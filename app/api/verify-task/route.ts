import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const gemini = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY ?? "");

async function verifyWithGemini(prompt: string, image?: string, pastedText?: string, link?: string): Promise<{ approved: boolean; reason: string; feedback: string; questionsChecked?: number; correctAnswers?: number }> {
  const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });

  let parts: ({ text: string } | { inlineData: { mimeType: string; data: string } })[] = [{ text: prompt }];

  if (image) {
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    parts = [{ text: prompt }, { inlineData: { mimeType: "image/jpeg", data: base64Data } }];
  }

  const result = await model.generateContent(parts);
  const text = result.response.text();
  console.log("Gemini response:", text);
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return { approved: false, reason: "Could not read homework. Try a clearer photo.", feedback: "Retake in better lighting or submit a link instead." };
  return JSON.parse(match[0]);
}

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
      const prompt = `You are a strict homework verification assistant.

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
}`;

      const json = await verifyWithGemini(prompt);
      return NextResponse.json({
        ...json,
        ...(requiresParentApproval && json.approved ? { pendingParentApproval: true, reason: "AI approved! Waiting for your parent to confirm." } : {}),
      });
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

      const linkPrompt = `You are a strict homework verification assistant.

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
}`;

      const json = await verifyWithGemini(linkPrompt);
      return NextResponse.json({
        ...json,
        ...(requiresParentApproval && json.approved ? { pendingParentApproval: true, reason: "AI approved! Waiting for your parent to confirm." } : {}),
      });
    }

    // Photo verification
    const prompt = isHomework
      ? `You are an expert homework checker for a kids productivity app called Redefine.

TASK: "${taskTitle}"
DESCRIPTION: "${taskDescription || taskTitle}"

A child has submitted a PHOTO of their completed homework. Your job is to carefully read and grade it.

STEP 1 — READ: Scan the entire photo. List every question and answer you can see.
STEP 2 — GRADE: For each question, decide if the answer is correct, incorrect, or missing.
STEP 3 — DECIDE: Approve ONLY if at least 80% of answers are correct AND the work looks complete.

STRICT RULES:
- If the photo is too blurry or dark to read — REJECT and ask for a clearer photo
- If the page is blank or nearly empty — REJECT
- If answers are copied without work shown (for math) — REJECT
- If most answers look correct and work is complete — APPROVE
- Do NOT approve a selfie or random photo as homework

Write your response ONLY as this JSON (no extra text before or after):
{
  "approved": true,
  "reason": "I can see [X] questions. Questions 1-5 are correct. Question 3 has a small error but overall work is strong.",
  "feedback": "Great job on questions 1, 2, 4, and 5! Question 3 — double check your answer, but you're almost there!",
  "questionsChecked": 5,
  "correctAnswers": 4
}`
      : `You are an expert task verifier for a kids chore and productivity app called Redefine.

TASK TITLE: "${taskTitle}"
TASK DESCRIPTION: "${taskDescription || taskTitle}"

A child has taken a photo as proof they completed this task. Your job: decide if the photo genuinely proves the task is done.

STEP 1 — UNDERSTAND THE TASK: What does this task require? What would proof look like?
STEP 2 — ANALYZE THE PHOTO: Describe exactly what you see in the photo.
STEP 3 — MATCH: Does what you see match what the task requires?

TASK CATEGORIES AND RULES:

PHYSICAL CHORES (make bed, clean room, do dishes, vacuum, take out trash, organize):
- Photo must show the END RESULT, not the process
- Made bed = sheets pulled up, pillows in place, looks neat
- Clean room = visible floor, items put away, not just one corner
- Done dishes = sink empty or dishes drying/put away
- APPROVE if the result is clearly visible and looks done
- REJECT selfies with no background evidence for these tasks

PERSONAL TASKS (smile, exercise, brush teeth, wash hands, get dressed, read a book):
- A selfie or photo of the person IS the correct proof
- Smile task: is the person smiling? → APPROVE
- Exercise: is the person in workout clothes, sweating, doing a move? → APPROVE
- Reading: is there a book visible? → APPROVE
- Dressed: are they wearing clothes (not pajamas)? → APPROVE
- Be GENEROUS — these tasks rely on honest effort

OUTDOOR TASKS (mow lawn, walk dog, take out trash, shovel snow):
- Photo should show outdoor setting with evidence of the task
- Dog walk: leash, dog, outside = APPROVE
- Mowed lawn: grass visible and cut = APPROVE

CREATIVE/SKILL TASKS (draw a picture, practice instrument, build something):
- Photo shows the created item or person doing the activity → APPROVE

GOLDEN RULES:
- If the photo clearly matches the task → APPROVE, even if slightly imperfect
- Give kids the benefit of the doubt on genuine honest attempts
- ONLY reject if: photo is completely unrelated to the task, it's an obvious joke/troll, or there is zero evidence of the task
- A slightly blurry photo that clearly shows the task done = APPROVE
- Speak to the kid directly and warmly in feedback

Respond ONLY with this JSON (no other text):
{
  "approved": true,
  "reason": "I can see [specific description of what's in the photo and why it proves the task]",
  "feedback": "Warm, specific, encouraging message directly to the kid about what they did"
}`;

    let json: { approved: boolean; reason: string; feedback: string; questionsChecked?: number; correctAnswers?: number };

    if (isHomework) {
      // Use Gemini for homework — better at reading text in photos
      json = await verifyWithGemini(prompt, image);
    } else {
      // Use GPT-4o for chores/exercise — better at understanding scenes
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
          approved: true,
          reason: "AI Approved!",
          feedback: "Great job!",
        });
      }

      json = JSON.parse(match[0]);
    }

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

    return NextResponse.json({
      ...json,
      photoUrl,
      ...(requiresParentApproval && json.approved ? { pendingParentApproval: true, reason: "AI approved! Waiting for your parent to confirm." } : {}),
    });

  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({
      approved: false,
      reason: "Could not verify. Please try again.",
      feedback: "Make sure photo is clear or your link is publicly accessible.",
    });
  }
}
