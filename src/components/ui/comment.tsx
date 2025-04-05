import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Comment } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";

interface ThemeType {
  color: string;
  emoji: string;
  bgGradient: string;
  accentColor: string;
  accentBg: string;
}

interface CommentProps {
  comment: Comment;
  onVote: (id: string, increment: number, previousVote: number) => void;
  onReply: (parentId: string, commentText: string) => void;
  theme: ThemeType;
  userVotes: Record<string, number>;
}

export const CommentComponent: React.FC<CommentProps> = ({
  comment,
  onVote,
  onReply,
  theme,
  userVotes,
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(true);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return "Unknown time";
    }
  };

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;
    onReply(comment.id, replyText);
    setReplyText("");
    setIsReplying(false);
  };

  const currentVote = userVotes[comment.id] || 0;

  return (
    <Card className="overflow-hidden mb-4">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
            style={{ backgroundColor: comment.user_color }}
          >
            A
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="font-medium text-sm">Anonymous Niner</div>
              <div className="text-xs text-muted-foreground">
                {formatDate(comment.created_at)}
              </div>
            </div>
            <div className="text-sm mb-3">{comment.comment_text}</div>
            <div className="flex gap-4 text-xs">
              <button
                onClick={() => {
                  if (currentVote === 1) {
                    onVote(comment.id, -1, currentVote);
                  } else {
                    onVote(comment.id, currentVote === -1 ? 2 : 1, currentVote);
                  }
                }}
                className={`flex items-center gap-1 ${
                  currentVote === 1
                    ? theme.accentColor
                    : "text-muted-foreground hover:" + theme.accentColor
                } transition-colors`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 8L18 14M12 8L6 14M12 8V20M6 4H18" />
                </svg>
                Upvote
              </button>
              <span className="text-muted-foreground">
                {comment.votes} votes
              </span>
              <button
                onClick={() => {
                  if (currentVote === -1) {
                    onVote(comment.id, 1, currentVote);
                  } else {
                    onVote(
                      comment.id,
                      currentVote === 1 ? -2 : -1,
                      currentVote
                    );
                  }
                }}
                className={`flex items-center gap-1 ${
                  currentVote === -1
                    ? theme.accentColor
                    : "text-muted-foreground hover:" + theme.accentColor
                } transition-colors`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 16L18 10M12 16L6 10M12 16V4M6 20H18" />
                </svg>
                Downvote
              </button>
              <button
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsReplying(!isReplying)}
              >
                Reply
              </button>
            </div>

            {isReplying && (
              <div className="mt-3 space-y-2">
                <div className="relative">
                  <textarea
                    className="w-full rounded-lg bg-secondary/30 border-secondary p-2 text-sm h-16 focus:outline-none focus:ring-1 focus:ring-primary/40"
                    placeholder="Reply to this comment..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  ></textarea>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    className="px-3 py-1 text-sm rounded-md bg-secondary/50 hover:bg-secondary/80 transition-colors"
                    onClick={() => setIsReplying(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className={`${theme.accentBg} text-white px-3 py-1 rounded-md text-sm hover:opacity-90 transition-colors`}
                    onClick={handleReplySubmit}
                    disabled={!replyText.trim()}
                  >
                    Post Reply
                  </button>
                </div>
              </div>
            )}

            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-3">
                <button
                  className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowReplies(!showReplies)}
                >
                  {showReplies ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="18 15 12 9 6 15" />
                      </svg>
                      Hide {comment.replies.length} replies
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                      Show {comment.replies.length} replies
                    </>
                  )}
                </button>

                {showReplies && (
                  <div className="mt-2 pl-4 border-l border-border space-y-3">
                    {comment.replies.map((reply) => {
                      const replyVote = userVotes[reply.id] || 0;
                      return (
                        <div key={reply.id} className="py-2">
                          <div className="flex gap-2">
                            <div
                              className="h-6 w-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                              style={{ backgroundColor: reply.user_color }}
                            >
                              A
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <div className="font-medium text-xs">
                                  Anonymous Niner
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {formatDate(reply.created_at)}
                                </div>
                              </div>
                              <div className="text-sm mt-1">
                                {reply.comment_text}
                              </div>
                              <div className="flex gap-3 mt-1 text-xs">
                                <button
                                  onClick={() => {
                                    if (replyVote === 1) {
                                      onVote(reply.id, -1, replyVote);
                                    } else {
                                      onVote(
                                        reply.id,
                                        replyVote === -1 ? 2 : 1,
                                        replyVote
                                      );
                                    }
                                  }}
                                  className={`flex items-center gap-1 ${
                                    replyVote === 1
                                      ? theme.accentColor
                                      : "text-muted-foreground hover:" +
                                        theme.accentColor
                                  } transition-colors`}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="10"
                                    height="10"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M12 8L18 14M12 8L6 14M12 8V20M6 4H18" />
                                  </svg>
                                  Upvote
                                </button>
                                <span className="text-muted-foreground">
                                  {reply.votes} votes
                                </span>
                                <button
                                  onClick={() => {
                                    if (replyVote === -1) {
                                      onVote(reply.id, 1, replyVote);
                                    } else {
                                      onVote(
                                        reply.id,
                                        replyVote === 1 ? -2 : -1,
                                        replyVote
                                      );
                                    }
                                  }}
                                  className={`flex items-center gap-1 ${
                                    replyVote === -1
                                      ? theme.accentColor
                                      : "text-muted-foreground hover:" +
                                        theme.accentColor
                                  } transition-colors`}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="10"
                                    height="10"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M12 16L18 10M12 16L6 10M12 16V4M6 20H18" />
                                  </svg>
                                  Downvote
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
