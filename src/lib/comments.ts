import { supabase, Comment } from "./supabase";

type SupabaseResponse<T> = {
  data: T | null;
  error: Error | null;
};

export async function getIncidentComments(
  incidentId: string
): Promise<SupabaseResponse<Comment[]>> {
  const { data, error } = await supabase
    .from("incident_comments")
    .select("*")
    .eq("incident_id", incidentId)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: null, error };
  }

  const topLevelComments =
    data?.filter((comment) => comment.parent_id === null) || [];
  const replies = data?.filter((comment) => comment.parent_id !== null) || [];

  topLevelComments.forEach((comment) => {
    comment.replies = replies
      .filter((reply) => reply.parent_id === comment.id)
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
  });

  return { data: topLevelComments, error: null };
}

export async function addComment(
  incidentId: string,
  commentText: string,
  userColor: string
): Promise<SupabaseResponse<{ id: string }>> {
  return supabase.from("incident_comments").insert([
    {
      incident_id: incidentId,
      parent_id: null,
      comment_text: commentText,
      user_color: userColor,
      votes: 0,
    },
  ]);
}

export async function addReply(
  incidentId: string,
  parentId: string,
  commentText: string,
  userColor: string
): Promise<SupabaseResponse<{ id: string }>> {
  return supabase.from("incident_comments").insert([
    {
      incident_id: incidentId,
      parent_id: parentId,
      comment_text: commentText,
      user_color: userColor,
      votes: 0,
    },
  ]);
}

export async function updateCommentVotes(
  commentId: string,
  increment: number
): Promise<SupabaseResponse<{ id: string }>> {
  const { data: comment, error: fetchError } = await supabase
    .from("incident_comments")
    .select("votes")
    .eq("id", commentId)
    .single();

  if (fetchError) {
    return { data: null, error: fetchError };
  }

  return supabase
    .from("incident_comments")
    .update({ votes: comment.votes + increment })
    .eq("id", commentId);
}
