import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Comment } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";
import { getTotalRepliesCount } from "@/lib/comments";

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
  onReply: (parentId: string, replyToId: string, commentText: string) => void;
  theme: ThemeType;
  userVotes: Record<string, number>;
  depth?: number;
  parentId?: string;
  isPartOfContinuedThread?: boolean;
  onContinueThread?: (reply: Comment) => void;
  onBackToThread?: () => void;
}

export const CommentComponent: React.FC<CommentProps> = ({
  comment,
  onVote,
  onReply,
  theme,
  userVotes,
  depth = 0,
  parentId = null,
  isPartOfContinuedThread = false,
  onContinueThread,
  onBackToThread,
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(true);
  const [showThreadDetails, setShowThreadDetails] = useState(false);

  const actualParentId = parentId || comment.parent_id || comment.id;

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
    onReply(actualParentId, comment.id, replyText);
    setReplyText("");
    setIsReplying(false);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyText(e.target.value);
  };

  const handleContinueThread = (reply: Comment) => {
    if (onContinueThread) {
      onContinueThread(reply);
    }
  };

  const handleBackToThread = () => {
    if (onBackToThread) {
      onBackToThread();
    }
  };

  const currentVote = userVotes[comment.id] || 0;

  const MAX_VISUAL_INDENT = 4;
  const MAX_THREAD_DEPTH = 4;

  const visualIndent = Math.min(depth, MAX_VISUAL_INDENT);

  const showDepthIndicator = depth > MAX_VISUAL_INDENT;
  const showContinueThread =
    depth >= MAX_THREAD_DEPTH && comment.replies && comment.replies.length > 0;

  const hasDeepNesting = (comment: Comment, currentDepth = 0): boolean => {
    if (currentDepth > MAX_VISUAL_INDENT) return true;
    return (
      comment.replies?.some((reply) =>
        hasDeepNesting(reply, currentDepth + 1)
      ) || false
    );
  };

  const scrollToComment = (id: string) => {
    const element = document.getElementById(`comment-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      element.classList.add("bg-secondary/40");
      setTimeout(() => {
        element.classList.remove("bg-secondary/40");
      }, 2000);
    }
  };

  const renderThreadOverview = (replies: Comment[], level = 0) => {
    return (
      <>
        {replies.map((reply) => (
          <div
            key={reply.id}
            className={`
              border-l-2 
              pl-2 
              ${level > 0 ? "ml-2" : ""}
              ${level % 2 === 0 ? "border-gray-600" : "border-gray-500"}
            `}
          >
            <div className="flex items-center gap-1 py-1 hover:bg-secondary/20 rounded px-1 transition-colors">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: reply.user_color }}
              ></div>
              <span className="font-medium text-foreground/80 whitespace-nowrap overflow-hidden text-ellipsis">
                Anonymous Niner:
              </span>
              <span className="truncate text-muted-foreground">
                {reply.comment_text.substring(0, 45)}
                {reply.comment_text.length > 45 ? "..." : ""}
              </span>
              <button
                className="ml-auto text-xs text-primary hover:underline flex-shrink-0"
                onClick={() => scrollToComment(reply.id)}
              >
                View
              </button>
            </div>
            {reply.replies &&
              reply.replies.length > 0 &&
              renderThreadOverview(reply.replies, level + 1)}
          </div>
        ))}
      </>
    );
  };

  return (
    <div
      id={`comment-${comment.id}`}
      className={`${
        depth > 0 ? "mt-3" : "mb-4"
      } transition-colors duration-300`}
    >
      {isPartOfContinuedThread && depth === 0 && (
        <div className="mb-3">
          <button
            onClick={handleBackToThread}
            className="text-sm bg-secondary/40 hover:bg-secondary/60 px-3 py-1 rounded-md flex items-center gap-1 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Back to Thread
          </button>
        </div>
      )}

      {depth === 0 ? (
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div
                className="h-8 w-8 text-sm rounded-full flex-shrink-0 flex items-center justify-center text-white font-medium"
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
                <div className="mb-3 text-sm w-full overflow-hidden text-wrap break-all hyphens-auto">
                  {comment.comment_text}
                </div>
                <div className="flex gap-4 text-xs">
                  <button
                    onClick={() => {
                      if (currentVote === 1) {
                        onVote(comment.id, -1, 1);
                      } else {
                        onVote(comment.id, 1, currentVote);
                      }
                    }}
                    className={`flex items-center gap-1 ${
                      currentVote === 1
                        ? "text-green-400"
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
                        onVote(comment.id, 1, -1);
                      } else {
                        onVote(comment.id, -1, currentVote);
                      }
                    }}
                    className={`flex items-center gap-1 ${
                      currentVote === -1
                        ? "text-red-400"
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
                    <textarea
                      className="w-full rounded-lg bg-secondary/30 border-secondary p-2 text-sm h-16 focus:outline-none focus:ring-1 focus:ring-primary/40"
                      placeholder="Reply to this comment..."
                      value={replyText}
                      onChange={handleTextChange}
                    ></textarea>
                    <div className="flex justify-end gap-2">
                      <button
                        className="px-4 py-1 text-sm rounded-md bg-secondary/50 hover:bg-secondary/80 transition-colors"
                        onClick={() => setIsReplying(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className={`${theme.accentBg} text-white px-4 py-1 rounded-md text-sm font-semibold hover:opacity-90 transition-colors`}
                        onClick={handleReplySubmit}
                        disabled={!replyText.trim()}
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                )}

                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-3">
                    <div className="flex gap-2">
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
                            Hide thread
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
                            Show thread ({getTotalRepliesCount(comment)})
                          </>
                        )}
                      </button>

                      {hasDeepNesting(comment) && (
                        <button
                          className={`text-xs flex items-center gap-1 ${theme.accentColor}`}
                          onClick={() =>
                            setShowThreadDetails(!showThreadDetails)
                          }
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
                            <rect
                              x="3"
                              y="3"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            ></rect>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                          </svg>
                          {showThreadDetails
                            ? "Hide thread details"
                            : "Thread details"}
                        </button>
                      )}
                    </div>

                    {showThreadDetails && (
                      <div className="mt-4 border rounded-lg overflow-hidden bg-card">
                        <div className="p-3 border-b bg-muted/40">
                          <div className="text-sm font-medium">
                            Thread Overview
                          </div>
                        </div>
                        <div className="p-3 max-h-60 overflow-y-auto">
                          {comment.replies && comment.replies.length > 0 ? (
                            <div className="text-xs space-y-2">
                              {renderThreadOverview(comment.replies)}
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground py-2 text-center">
                              No replies in this thread
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {showReplies && (
                      <div>
                        {comment.replies.map((reply) => (
                          <CommentComponent
                            key={reply.id}
                            comment={reply}
                            onVote={onVote}
                            onReply={onReply}
                            theme={theme}
                            userVotes={userVotes}
                            depth={depth + 1}
                            parentId={actualParentId}
                            onContinueThread={handleContinueThread}
                            onBackToThread={handleBackToThread}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="relative py-2">
          <div
            className={showDepthIndicator ? theme.accentBg : "bg-border"}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${visualIndent * 3}px`,
              width: showDepthIndicator ? "3px" : "1px",
            }}
          ></div>

          {showDepthIndicator && (
            <div
              className={`${theme.accentBg} text-xs text-muted-foreground px-1 rounded-r-md`}
              style={{
                position: "absolute",
                left: `${visualIndent * 4 - 1}px`,
                top: "0px",
              }}
            >
              +{depth - MAX_VISUAL_INDENT}
            </div>
          )}

          <div className={`pl-6 ${showDepthIndicator ? "pt-6" : ""}`}>
            <div className="flex items-start">
              <div
                className="h-6 w-6 text-xs rounded-full flex-shrink-0 flex items-center justify-center text-white font-medium"
                style={{ backgroundColor: comment.user_color }}
              >
                A
              </div>
              <div className="flex-1 ml-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="font-medium text-xs">Anonymous Niner</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(comment.created_at)}
                  </div>
                </div>
                <div className="mb-3 text-sm w-full overflow-hidden text-wrap break-all hyphens-auto">
                  {comment.comment_text}
                </div>
                <div className="flex gap-4 text-xs">
                  <button
                    onClick={() => {
                      if (currentVote === 1) {
                        onVote(comment.id, -1, 1);
                      } else {
                        onVote(comment.id, 1, currentVote);
                      }
                    }}
                    className={`flex items-center gap-1 ${
                      currentVote === 1
                        ? "text-green-400"
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
                        onVote(comment.id, 1, -1);
                      } else {
                        onVote(comment.id, -1, currentVote);
                      }
                    }}
                    className={`flex items-center gap-1 ${
                      currentVote === -1
                        ? "text-red-400"
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
                    <textarea
                      className="w-full rounded-lg bg-secondary/30 border-secondary p-2 text-sm h-16 focus:outline-none focus:ring-1 focus:ring-primary/40"
                      placeholder={`Reply to this reply...`}
                      value={replyText}
                      onChange={handleTextChange}
                    ></textarea>
                    <div className="flex justify-end gap-2">
                      <button
                        className="px-4 py-1 text-sm rounded-md bg-secondary/50 hover:bg-secondary/80 transition-colors"
                        onClick={() => setIsReplying(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className={`${theme.accentBg} text-white px-4 py-1 rounded-md text-sm font-semibold hover:opacity-90 transition-colors`}
                        onClick={handleReplySubmit}
                        disabled={!replyText.trim()}
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                )}

                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-3">
                    <div className="flex gap-2">
                      <button
                        className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setShowReplies(!showReplies)}
                      >
                        {showReplies
                          ? "Hide thread"
                          : `Show thread (${getTotalRepliesCount(comment)})`}
                      </button>

                      {hasDeepNesting(comment) && (
                        <button
                          className={`text-xs flex items-center gap-1 ${theme.accentColor}`}
                          onClick={() =>
                            setShowThreadDetails(!showThreadDetails)
                          }
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
                            <rect
                              x="3"
                              y="3"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            ></rect>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                          </svg>
                          {showThreadDetails
                            ? "Hide thread details"
                            : "Thread details"}
                        </button>
                      )}
                    </div>

                    {showThreadDetails && (
                      <div className="mt-4 border rounded-lg overflow-hidden bg-card">
                        <div className="p-3 border-b bg-muted/40">
                          <div className="text-sm font-medium">
                            Thread Overview
                          </div>
                        </div>
                        <div className="p-3 max-h-60 overflow-y-auto">
                          {comment.replies && comment.replies.length > 0 ? (
                            <div className="text-xs space-y-2">
                              {renderThreadOverview(comment.replies)}
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground py-2 text-center">
                              No replies in this thread
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {showReplies && (
                      <div>
                        {showContinueThread ? (
                          <div className="mt-4 py-2 border-t border-border">
                            <button
                              onClick={() => handleContinueThread(comment)}
                              className={`text-sm ${theme.accentColor} hover:underline flex items-center gap-1`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="9 18 15 12 9 6"></polyline>
                              </svg>
                              Continue Thread ({getTotalRepliesCount(comment)})
                            </button>
                          </div>
                        ) : (
                          comment.replies.map((reply) => (
                            <CommentComponent
                              key={reply.id}
                              comment={reply}
                              onVote={onVote}
                              onReply={onReply}
                              theme={theme}
                              userVotes={userVotes}
                              depth={depth + 1}
                              parentId={actualParentId}
                              onContinueThread={handleContinueThread}
                              onBackToThread={handleBackToThread}
                            />
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
