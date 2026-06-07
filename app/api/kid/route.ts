import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const kidId = searchParams.get("kidId");

  if (!kidId) return NextResponse.json({ error: "Missing kidId" }, { status: 400 });

  const { data, error } = await supabase
    .from("kids")
    .select("*")
    .eq("id", kidId)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
