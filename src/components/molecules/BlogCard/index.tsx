import React, { useState, useEffect } from "react";
import { Blog } from "../../../api/blogApi";
import { commentApi } from "../../../api/commentApi";
import { likeApi } from "../../../api/likeApi";
import { Comment } from "../../../types/types.ts";
import { useAuth } from "../../../contexts/AuthContext";
import { canUserCreateBlog, canUserComment } from "../../../utils/userUtils.ts";
import { BlogHeader } from "../BlogHeader";
import { BlogContent } from "../BlogContent";
import { BlogStats } from "../BlogStats";
import { BlogActions } from "../BlogActions";
import { BlogModal } from "../BlogModal";

type BlogCardProps = {
    blog: Blog;
    onEdit?: (blog: Blog) => void;
    onDelete?: (id: string) => void;
};

type Reaction = {
    id: string;
    emoji: string;
    count: number;
    isLiked: boolean;
};

export const BlogCard: React.FC<BlogCardProps> = ({ blog, onEdit, onDelete }) => {
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [reactions, setReactions] = useState<Reaction[]>([
        { id: "like", emoji: "", count: 0, isLiked: false },
    ]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [totalComments, setTotalComments] = useState(0);
    const [loadingComments, setLoadingComments] = useState(false);

    useEffect(() => {
        loadLikes();
    }, [blog.id]);

    useEffect(() => {
        setComments([]);
        setTotalComments(0);
        loadComments();
    }, [blog.id]);

    useEffect(() => {
        if (showModal && comments.length === 0) {
            loadComments();
        }
    }, [showModal]);

    const loadLikes = async () => {
        if (!user) {
            // Nếu chưa login, chỉ load count (backend vẫn trả về liked: false)
            try {
                const likeInfo = await likeApi.getByBlogId(blog.id);
                setReactions([{
                    id: "like",
                    emoji: "",
                    count: likeInfo.count,
                    isLiked: false
                }]);
            } catch (error) {
                console.error('❌ Failed to load likes:', error);
            }
            return;
        }

        try {
            const likeInfo = await likeApi.getByBlogId(blog.id);
            setReactions([{
                id: "like",
                emoji: "",
                count: likeInfo.count,
                isLiked: likeInfo.liked
            }]);
        } catch (error) {
            console.error('❌ Failed to load likes:', error);
            setReactions([{ id: "like", emoji: "", count: 0, isLiked: false }]);
        }
    };

    const loadComments = async () => {
        try {
            setLoadingComments(true);
            const { comments: blogComments, total } = await commentApi.getByBlogId(blog.id);
            setComments(blogComments);
            setTotalComments(total);
        } catch (error) {
            console.error('❌ Failed to load comments:', error);
            setComments([]);
            setTotalComments(0);
        } finally {
            setLoadingComments(false);
        }
    };

    const handleReaction = async (reactionId: string) => {
        if (!user) {
            alert('Vui lòng đăng nhập để like bài viết');
            return;
        }

        if (reactionId !== 'like') return;

        const currentReaction = reactions.find(r => r.id === 'like');
        const wasLiked = currentReaction?.isLiked || false;

        setReactions([{
            id: "like",
            emoji: "",
            count: wasLiked ? (currentReaction?.count || 1) - 1 : (currentReaction?.count || 0) + 1,
            isLiked: !wasLiked
        }]);

        try {
            const likeInfo = await likeApi.toggleLike(blog.id);

            setReactions([{
                id: "like",
                emoji: "",
                count: likeInfo.count,
                isLiked: likeInfo.liked
            }]);
        } catch (error: any) {
            console.error('❌ Failed to toggle like:', error);
            setReactions([{
                id: "like",
                emoji: "",
                count: currentReaction?.count || 0,
                isLiked: wasLiked
            }]);

            if (error.response?.status === 401) {
                alert('Your session has expired. Please log in again..');
            } else {
                alert('Unable to like this post. Please try again.');
            }
        }
    };

    const handleAddComment = async (content: string) => {
        if (!content.trim() || !user) return;

        try {
            const commentData = {
                blogId: blog.id,
                content: content
            };

            const newCommentResult = await commentApi.create(commentData);
            setComments(prev => [newCommentResult, ...prev]);
            setTotalComments(prev => prev + 1);
        } catch (error: any) {
            console.error('Failed to add comment:', error);

            if (error.response?.status === 401) {
                alert('Please login to comment');
            } else if (error.response?.status === 403) {
                alert('You do not have permission to comment');
            } else {
                alert('Failed to add comment. Please try again.');
            }
        }
    };

    const handleReplyComment = async (parentId: string, content: string) => {
        if (!content.trim() || !user) return;

        try {
            const replyData = {
                blogId: blog.id,
                content: content,
                parentId: parentId
            };

            const newReply = await commentApi.create(replyData);

            setComments(prev => {
                const addReplyToComment = (comments: Comment[]): Comment[] => {
                    return comments.map(comment => {
                        if (comment.id === parentId) {
                            return {
                                ...comment,
                                replies: [...(comment.replies || []), newReply]
                            };
                        }
                        if (comment.replies && comment.replies.length > 0) {
                            return {
                                ...comment,
                                replies: addReplyToComment(comment.replies)
                            };
                        }
                        return comment;
                    });
                };
                return addReplyToComment(prev);
            });

            setTotalComments(prev => prev + 1);
        } catch (error: any) {
            console.error('Failed to add reply:', error);
            alert('Failed to add reply. Please try again.');
        }
    };

    const handleEditComment = async (commentId: string, newContent: string) => {
        if (!newContent.trim()) return;

        try {
            await commentApi.update(commentId, { content: newContent });
            setComments(prev => {
                const updateCommentContent = (comments: Comment[]): Comment[] => {
                    return comments.map(comment => {
                        if (comment.id === commentId) {
                            return { ...comment, content: newContent };
                        }
                        if (comment.replies && comment.replies.length > 0) {
                            return {
                                ...comment,
                                replies: updateCommentContent(comment.replies)
                            };
                        }
                        return comment;
                    });
                };
                return updateCommentContent(prev);
            });
        } catch (error: any) {
            console.error('Failed to edit comment:', error);
            alert('Failed to edit comment. Please try again.');
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            await commentApi.delete(commentId);
            let deletedCount = 0;
            const countReplies = (c: Comment): number => {
                let count = 1;
                if (c.replies) {
                    c.replies.forEach(r => count += countReplies(r));
                }
                return count;
            };

            setComments(prev => {
                const removeComment = (comments: Comment[]): Comment[] => {
                    return comments.filter(comment => {
                        if (comment.id === commentId) {
                            deletedCount = countReplies(comment);
                            return false;
                        }
                        if (comment.replies && comment.replies.length > 0) {
                            comment.replies = removeComment(comment.replies);
                        }
                        return true;
                    });
                };
                return removeComment(prev);
            });

            // Update total count once after deletion
            setTotalComments(prev => Math.max(0, prev - deletedCount));
        } catch (error: any) {
            console.error('Failed to delete comment:', error);
            alert('Failed to delete comment. Please try again.');
        }
    };

    return (
        <div className="border rounded-lg p-4 shadow-sm bg-white mb-4">
            <BlogHeader
                blog={blog}
                currentUser={user}
                onEdit={onEdit}
                onDelete={onDelete}
            />

            <BlogContent blog={blog} />

            <BlogStats reactions={reactions} totalComments={totalComments} />

            <BlogActions
                reactions={reactions}
                onReaction={handleReaction}
                onToggleComments={() => setShowModal(true)}
            />

            <BlogModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                blog={blog}
                currentUser={user}
                reactions={reactions}
                totalComments={totalComments}
                comments={comments}
                loadingComments={loadingComments}
                canComment={canUserComment(user) && !!user}
                onReaction={handleReaction}
                onAddComment={handleAddComment}
                onReplyComment={handleReplyComment}
                onEditComment={handleEditComment}
                onDeleteComment={handleDeleteComment}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        </div>
    );
};