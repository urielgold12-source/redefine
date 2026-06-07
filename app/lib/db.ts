import { supabase } from "./supabase";

// Upload a photo to Supabase Storage and return the public URL
export async function uploadTaskPhoto(
  base64Image: string,
  taskId: string,
  kidId: string
): Promise<string | null> {
  try {
    // Convert base64 to blob
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const blob = new Blob([buffer], { type: "image/jpeg" });

    const fileName = `${kidId}/${taskId}-${Date.now()}.jpg`;

    const { error } = await supabase.storage
      .from("task-photos")
      .upload(fileName, blob, { contentType: "image/jpeg", upsert: true });

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    const { data } = supabase.storage
      .from("task-photos")
      .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
}

// Update task status in database
export async function updateTaskStatus(
  taskId: string,
  status: string,
  photoUrl?: string,
  aiVerdict?: string,
  failCount?: number
) {
  const { error } = await supabase
    .from("tasks")
    .update({
      status,
      ...(photoUrl && { photo_url: photoUrl }),
      ...(aiVerdict && { ai_verdict: aiVerdict }),
      ...(failCount !== undefined && { fail_count: failCount }),
    })
    .eq("id", taskId);

  if (error) console.error("Update task error:", error);
}

// Update kid balance
export async function updateKidBalance(kidId: string, newBalance: number) {
  const { error } = await supabase
    .from("kids")
    .update({ balance: newBalance })
    .eq("id", kidId);

  if (error) console.error("Update balance error:", error);
}

// Get tasks for a kid
export async function getKidTasks(kidId: string) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("kid_id", kidId)
    .order("created_at", { ascending: false });

  if (error) console.error("Get tasks error:", error);
  return data ?? [];
}

// Get tasks pending review for parent
export async function getPendingTasks(parentId: string) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*, kids!inner(parent_id, name)")
    .eq("kids.parent_id", parentId)
    .eq("status", "pending_review")
    .order("created_at", { ascending: false });

  if (error) console.error("Get pending tasks error:", error);
  return data ?? [];
}

// Insert a test kid for demo purposes
export async function insertDemoData() {
  // Check if demo data exists
  const { data: existing } = await supabase
    .from("kids")
    .select("id")
    .eq("username", "jake")
    .single();

  if (existing) return existing.id;

  // Create demo parent
  const { data: parent } = await supabase
    .from("users")
    .insert({ email: "parent@test.com", role: "parent", name: "Parent" })
    .select()
    .single();

  if (!parent) return null;

  // Create demo kid
  const { data: kid } = await supabase
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

  if (!kid) return null;

  // Create demo tasks
  await supabase.from("tasks").insert([
    { kid_id: kid.id, title: "Make your bed", description: "Take a clear photo of your made bed", reward: 1.00, task_type: "chore", requires_parent_approval: false },
    { kid_id: kid.id, title: "Do homework", description: "Take a photo of your completed homework", reward: 2.00, task_type: "homework", requires_parent_approval: true },
    { kid_id: kid.id, title: "Take out trash", description: "Take a photo of the empty trash can", reward: 1.50, task_type: "chore", requires_parent_approval: false },
    { kid_id: kid.id, title: "Exercise for 20 mins", description: "Take a photo showing you exercised", reward: 1.00, task_type: "exercise", requires_parent_approval: false },
  ]);

  return kid.id;
}
