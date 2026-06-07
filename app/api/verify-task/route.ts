import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function uploadPhoto(base64Image: string, taskId: string, kidId: string): Promise<string | null> {
  try {
    // Convert base64 data URL to binary
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/jpeg" });

    const fileName = `${kidId}/${taskId}-${Date.now()}.jpg`;

    const { error } = await supabase.storage
      .from("task-photos")
      .upload(fileName, blob, { contentType: "image/jpeg", upsert: true });

    if (error) { console.error("Upload error:", error); return null; }

    const { data } = supabase.storage.from("task-photos").getPublicUrl(fileName);
    console.log("Photo uploaded successfully:", data.publicUrl);
    return data.publicUrl;
  } catch (e) {
    console.error("Upload error:", e);
    return null;
  }
}

export async function POST(req: NextRequest) {
  const { image, link, pastedText, taskTitle, taskDescription, taskType, requiresParentApproval, taskId, kidId } = await req.json();

  try {
    const isHomework = taskType === "homework";

    // If pasted text was submitted
    if (pastedText) {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: `You are a strict homework verification assistant.

A student pasted their homework text for the task: "${taskTitle}"

Here is their homework:
"""
${pastedText}
"""

Your job:
1. Read every question and answer
2. Check if each answer is correct
3. Check if any questions are unanswered
4. Tell the kid exactly which questions are wrong or missing

Be STRICT — only approve if homework is complete and mostly correct (at least 80% correct).

Respond ONLY with this exact JSON:
{
  "approved": true,
  "reason": "Detailed explanation",
  "feedback": "Specific feedback — which questions were right, which were wrong",
  "questionsChecked": 8,
  "correctAnswers": 7
}`,
          },
        ],
        max_tokens: 400,
      });

      const text = response.choices[0].message.content ?? "";
      console.log("Pasted text verify response:", text);
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) return NextResponse.json({ approved: false, reason: "Could not read homework.", feedback: "Try again." });
      const json = JSON.parse(match[0]);
      if (requiresParentApproval && json.approved) {
        json.pendingParentApproval = true;
        json.reason = "AI approved! Waiting for your parent to confirm.";
      }
      return NextResponse.json(json);
    }

    // If a link was submitted instead of a photo
    if (link) {
      // Fetch the page content from the link
      let pageContent = "";
      try {
        const res = await fetch(link);
        const html = await res.text();
        // Strip HTML tags to get plain text
        pageContent = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").slice(0, 3000);
      } catch {
        return NextResponse.json({
          approved: false,
          reason: "Could not access the link. Make sure it is public and shareable.",
          feedback: "Try making your Google Doc public, or take a photo instead.",
        });
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: `You are a strict homework verification assistant.

A student submitted a link to their digital homework for the task: "${taskTitle}"

Here is the content from that link:
"""
${pageContent}
"""

Your job:
1. Read all the questions and answers in this content
2. Check if the answers are correct
3. Check if the work is complete
4. If answers are wrong, tell the kid specifically which ones to fix

Be STRICT — only approve if the homework is genuinely complete and mostly correct.

Respond ONLY with this exact JSON, no other text:
{
  "approved": true,
  "reason": "Detailed explanation",
  "feedback": "Specific feedback for the kid",
  "questionsChecked": 5,
  "correctAnswers": 4
}`,
          },
        ],
        max_tokens: 400,
      });

      const text = response.choices[0].message.content ?? "";
      console.log("Link verify response:", text);
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) return NextResponse.json({ approved: false, reason: "Could not read the document.", feedback: "Try sharing the link again or take a photo instead." });
      const json = JSON.parse(match[0]);
      if (requiresParentApproval && json.approved) {
        json.pendingParentApproval = true;
        json.reason = "AI approved! Waiting for your parent to confirm.";
      }
      return NextResponse.json(json);
    }

    // Photo verification
    const prompt = isHomework
      ? `You are a strict homework verification assistant for a kids app.

A child submitted a photo of their homework for: "${taskTitle}"

Your job:
1. Read all questions visible in the photo
2. Check if answers are correct
3. Check if work is complete
4. Tell the kid exactly which questions to fix if wrong

Be STRICT. Do not approve if answers are wrong, work is incomplete, or photo is too blurry to read.

Respond ONLY with this exact JSON:
{
  "approved": true,
  "reason": "Detailed explanation",
  "feedback": "Specific feedback for the kid",
  "questionsChecked": 5,
  "correctAnswers": 4
}`
      : `You are a fair and smart task verification assistant for a kids chore app.

The task is: "${taskTitle}"
The task description is: "${taskDescription || taskTitle}"

First figure out what TYPE of task this is, then verify accordingly:

TYPE A — Physical chores (make bed, take out trash, clean room, do dishes, vacuum):
- Need a photo of the RESULT, not a selfie
- APPROVE if the photo clearly shows the completed task
- REJECT if it's just a selfie with no evidence of the task

TYPE B — Personal/body tasks (smile, exercise, brush teeth, wash hands, get dressed):
- A selfie or photo of the person IS the correct evidence
- APPROVE if the photo shows the person doing or having done the task
- For "smile" — approve if the person is smiling in the photo

TYPE C — Outdoor tasks (take out trash, mow lawn, walk dog):
- Need photo showing the outdoor evidence
- APPROVE if there is reasonable evidence shown

General rules:
- Give the kid benefit of the doubt on genuine attempts
- Do NOT reject for minor imperfections
- REJECT only if the photo is completely unrelated or clearly a joke
- A blurry but relevant photo should still be approved

Respond ONLY with this exact JSON:
{
  "approved": true or false,
  "reason": "Specific explanation of what you see in the photo",
  "feedback": "Encouraging and specific message to the kid"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: image } },
          ],
        },
      ],
      max_tokens: 400,
    });

    const text = response.choices[0].message.content ?? "";
    console.log("Photo verify response:", text);
    const match = text.match(/\{[\s\S]*\}/);

    if (!match) {
      return NextResponse.json({
        approved: !isHomework,
        reason: isHomework ? "Could not read homework. Try a clearer photo." : "AI Approved!",
        feedback: isHomework ? "Retake in better lighting or submit a link instead." : "Great job!",
      });
    }

    const json = JSON.parse(match[0]);

    // Upload photo to Supabase Storage if taskId and kidId provided
    let photoUrl = null;
    if (image && taskId && kidId) {
      photoUrl = await uploadPhoto(image, taskId, kidId);
    }

    // Save result to database
    if (taskId) {
      // Always set to pending_review when approved so parent can see the photo
      const newStatus = json.approved ? "pending_review" : "active";

      await supabase.from("tasks").update({
        status: newStatus,
        ai_verdict: json.reason,
        ...(photoUrl && { photo_url: photoUrl }),
      }).eq("id", taskId);

      // If approved and no parent approval needed, update balance
      if (json.approved && !requiresParentApproval && kidId) {
        const { data: task } = await supabase.from("tasks").select("reward").eq("id", taskId).single();
        if (task) {
          const { data: kid } = await supabase.from("kids").select("balance, weekly_budget").eq("id", kidId).single();
          if (kid) {
            const newBalance = Math.min(kid.balance + task.reward, kid.weekly_budget);
            await supabase.from("kids").update({ balance: newBalance }).eq("id", kidId);
          }
        }
      }
    }

    if (requiresParentApproval && json.approved) {
      json.pendingParentApproval = true;
      json.reason = "AI approved! Waiting for your parent to confirm.";
    }

    json.photoUrl = photoUrl;
    return NextResponse.json(json);

  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({
      approved: false,
      reason: "Could not verify. Please try again.",
      feedback: "Make sure photo is clear or your link is publicly accessible.",
    });
  }
}
