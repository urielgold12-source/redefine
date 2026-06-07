import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";

export async function GET() {
  try {
    // Check if demo data exists
    const { data: existing } = await supabase
      .from("kids")
      .select("id")
      .eq("username", "jake")
      .single();

    if (existing) {
      return NextResponse.json({ message: "Demo data already exists", kidId: existing.id });
    }

    // Create demo parent
    const { data: parent, error: parentError } = await supabase
      .from("users")
      .insert({ email: "parent@test.com", role: "parent", name: "Parent" })
      .select()
      .single();

    if (parentError) return NextResponse.json({ error: parentError.message }, { status: 500 });

    // Create demo kid
    const { data: kid, error: kidError } = await supabase
      .from("kids")
      .insert({
        parent_id: parent.id,
        name: "Jake",
        username: "jake",
        pin: "1234",
        balance: 20.00,
        weekly_budget: 20.00,
      })
      .select()
      .single();

    if (kidError) return NextResponse.json({ error: kidError.message }, { status: 500 });

    // Create demo tasks
    await supabase.from("tasks").insert([
      { kid_id: kid.id, title: "Make your bed", description: "Take a clear photo of your made bed", reward: 1.00, task_type: "chore", requires_parent_approval: false },
      { kid_id: kid.id, title: "Do homework", description: "Take a photo of your completed homework — AI will check your answers", reward: 2.00, task_type: "homework", requires_parent_approval: true },
      { kid_id: kid.id, title: "Take out trash", description: "Take a photo of the empty trash can", reward: 1.50, task_type: "chore", requires_parent_approval: false },
      { kid_id: kid.id, title: "Exercise for 20 mins", description: "Take a photo showing you exercised", reward: 1.00, task_type: "exercise", requires_parent_approval: false },
    ]);

    // Create app rates
    await supabase.from("app_rates").insert([
      { kid_id: kid.id, app_name: "TikTok", rate_per_minute: 0.10 },
      { kid_id: kid.id, app_name: "Instagram", rate_per_minute: 0.08 },
      { kid_id: kid.id, app_name: "Snapchat", rate_per_minute: 0.08 },
      { kid_id: kid.id, app_name: "YouTube", rate_per_minute: 0.05 },
    ]);

    return NextResponse.json({
      message: "Demo data created successfully!",
      kidId: kid.id,
      parentId: parent.id
    });

  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
