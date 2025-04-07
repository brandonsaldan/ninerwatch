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

export type Comment = {
  id: string;
  incident_id: string;
  parent_id: string | null;
  reply_to_id: string | null;
  comment_text: string;
  user_color: string;
  votes: number;
  created_at: string;
  replies?: Comment[];
  crime_incidents?: Incident;
};

export const supabase = createClient<{
  public: {
    Tables: {
      crime_incidents: {
        Row: Incident;
        Insert: Omit<Incident, "id" | "created_at">;
        Update: Partial<Omit<Incident, "id" | "created_at">>;
      };
      incident_comments: {
        Row: Comment;
        Insert: Omit<
          Comment,
          "id" | "created_at" | "crime_incidents" | "replies"
        >;
        Update: Partial<
          Omit<Comment, "id" | "created_at" | "crime_incidents" | "replies">
        >;
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
