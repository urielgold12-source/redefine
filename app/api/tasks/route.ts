import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";

// GET — fetch tasks for a kid or parent
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const kidId = searchParams.get("kidId");
  const parentId = searchParams.get("parentId");

  if (kidId) {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("kid_id", kidId)
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  if (parentId) {
    const { data, error } = await supabase
      .from("tasks")
      .select("*, kids!inner(parent_id, name)")
      .eq("kids.parent_id", parentId)
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  return NextResponse.json({ error: "Missing kidId or parentId" }, { status: 400 });
}

// POST — create a new task
export async function POST(req: NextRequest) {
  const { kid_id, title, description, reward, task_type, requires_parent_approval } = await req.json();

  const { data, error } = await supabase
    .from("tasks")
    .insert({ kid_id, title, description, reward, task_type, requires_parent_approval, status: "active" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// PATCH — update task status (approve/reject)
export async function PATCH(req: NextRequest) {
  const { taskId, status, photoUrl, aiVerdict, failCount, kidId, reward } = await req.json();

  // Update task
  const { error: taskError } = await supabase
    .from("tasks")
    .update({
      status,
      ...(photoUrl && { photo_url: photoUrl }),
      ...(aiVerdict && { ai_verdict: aiVerdict }),
      ...(failCount !== undefined && { fail_count: failCount }),
    })
    .eq("id", taskId);

  if (taskError) return NextResponse.json({ error: taskError.message }, { status: 500 });

  // If approved, add reward to kid's balance
  if (status === "approved" && kidId && reward) {
    const { data: kid } = await supabase
      .from("kids")
      .select("balance")
      .eq("id", kidId)
      .single();

    if (kid) {
      const { data: kidFull } = await supabase.from("kids").select("weekly_budget").eq("id", kidId).single();
      const cap = kidFull?.weekly_budget ?? 20;
      const newBalance = Math.min(kid.balance + reward, cap);
      await supabase.from("kids").update({ balance: newBalance }).eq("id", kidId);
    }
  }

  return NextResponse.json({ success: true });
}

// DELETE — remove a task
export async function DELETE(req: NextRequest) {
  const { taskId } = await req.json();

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
