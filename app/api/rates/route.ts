import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";

export async function POST(req: NextRequest) {
  const { kid_id, app_name, rate_per_minute } = await req.json();

  // Upsert — update if exists, insert if not
  const { error } = await supabase
    .from("app_rates")
    .upsert(
      { kid_id, app_name, rate_per_minute },
      { onConflict: "kid_id,app_name" }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
