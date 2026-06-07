import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { image, link, pastedText, taskTitle, taskType, requiresParentApproval } = await req.json();

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
      : `You are a friendly chore verification assistant for a kids app.

The task is: "${taskTitle}"

Look at this photo. Be generous — if there is ANY evidence the task was completed, approve it. Only reject if completely unrelated.

Respond ONLY with this exact JSON:
{
  "approved": true,
  "reason": "Brief explanation",
  "feedback": "Encouraging message"
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
    if (requiresParentApproval && json.approved) {
      json.pendingParentApproval = true;
      json.reason = "AI approved! Waiting for your parent to confirm.";
    }

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
