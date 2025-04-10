import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { incidentId } = await request.json();

    if (!incidentId) {
      return NextResponse.json(
        { error: "Incident ID is required" },
        { status: 400 }
      );
    }

    const { data: incident, error: fetchError } = await supabase
      .from("crime_incidents")
      .select("view_count")
      .eq("id", incidentId)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { error: "Failed to fetch incident" },
        { status: 500 }
      );
    }

    const { error: updateError } = await supabase
      .from("crime_incidents")
      .update({ view_count: (incident.view_count || 0) + 1 })
      .eq("id", incidentId);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update view count" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      view_count: (incident.view_count || 0) + 1,
    });
  } catch (error) {
    console.error("Error in view incident API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
