import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error(
    "NEXT_PUBLIC_SUPABASE_URL is not defined in environment variables"
  );
}

if (!supabaseAnonKey) {
  console.error(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined in environment variables"
  );
}

export type Incident = {
  id: string;
  report_number: string;
  incident_type: string;
  incident_location: string;
  date_reported: string;
  time_reported: string;
  time_secured: string | null;
  time_of_occurrence: string | null;
  disposition: string | null;
  incident_description: string | null;
  created_at: string;
  lat?: number;
  lng?: number;
};

export const supabase = createClient<{
  public: {
    Tables: {
      crime_incidents: {
        Row: Incident;
        Insert: Omit<Incident, "id" | "created_at">;
        Update: Partial<Omit<Incident, "id" | "created_at">>;
      };
    };
  };
}>(supabaseUrl || "", supabaseAnonKey || "");

export const validateSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("crime_incidents")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Failed to connect to Supabase:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error validating Supabase connection:", err);
    return false;
  }
};
