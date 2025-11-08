import React, { useState, useEffect, useRef } from "react";
import { Blog } from "../../../api/blogApi";
import { Button } from "../../atoms/Button/Button";
import { useAuth } from "../../../contexts/AuthContext";
import { canUserModifyPost, getUserDisplayName, canUserCreateBlog } from "../../../utils/userUtils.ts";

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

type Comment = {
    id: string;
    author: string;
    content: string;
    createdAt: string;
};

export const BlogCard: React.FC<BlogCardProps> = ({ blog, onEdit, onDelete }) => {
    const { user } = useAuth();
    const [showComments, setShowComments] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [reactions, setReactions] = useState<Reaction[]>([
        { id: "like", emoji: "👍", count: 0, isLiked: false },
    ]);
    const [comments, setComments] = useState<Comment[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Đóng dropdown khi click bên ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    const handleReaction = (reactionId: string) => {
        setReactions(prev => prev.map(reaction => {
            if (reaction.id === reactionId) {
                return {
                    ...reaction,
                    count: reaction.isLiked ? reaction.count - 1 : reaction.count + 1,
                    isLiked: !reaction.isLiked
                };
            }
            // Remove other reactions when user clicks a new one
            return {
                ...reaction,
                count: reaction.isLiked ? reaction.count - 1 : reaction.count,
                isLiked: false
            };
        }));
    };

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        const comment: Comment = {
            id: Date.now().toString(),
            author: getUserDisplayName(user),
            content: newComment,
            createdAt: new Date().toLocaleString()
        };

        setComments(prev => [...prev, comment]);
        setNewComment("");
    };

    // Check if current user is the owner of the blog post
    const isOwner = () => {
        return canUserModifyPost(user, blog.author);
    };

    return (
        <div className="border rounded-lg p-4 shadow-sm bg-white mb-4">
            {/* Header với avatar và thông tin tác giả */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {typeof blog.author === 'object'
                            ? (blog.author?.username?.[0]?.toUpperCase() || 'U')
                            : (blog.author?.[0]?.toUpperCase() || 'U')}
                    </div>
                    <div>
                        <p className="font-medium text-sm">
                            {typeof blog.author === 'object'
                                ? blog.author?.username || 'Unknown'
                                : blog.author || 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-500">
                            {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                    </div>
                </div>

                {/* Nút Edit/Delete - chỉ hiện với chủ sở hữu bài viết */}
                {user && isOwner() && (
                    <div className="relative" ref={dropdownRef}>
                        <Button
                            variant="icon"
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="text-gray-500 hover:text-gray-700 p-2"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                            </svg>
                        </Button>

                        {/* Dropdown Menu */}
                        {showDropdown && (
                            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                                <button
                                    onClick={() => {
                                        onEdit?.(blog);
                                        setShowDropdown(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                    </svg>
                                    Edit
                                </button>
                                <button
                                    onClick={() => {
                                        onDelete?.(blog.id);
                                        setShowDropdown(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                    </svg>
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Nội dung bài viết */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{blog.title}</h3>
            <p className="text-gray-700 mb-4">{blog.content}</p>

            {/* Reactions */}
            <div className="flex items-center gap-2 py-3 border-t border-gray-100">
                {reactions.map(reaction => (
                    <button
                        key={reaction.id}
                        onClick={() => handleReaction(reaction.id)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full transition-colors ${reaction.isLiked
                            ? 'bg-blue-100 text-blue-600 border border-blue-200'
                            : 'hover:bg-gray-100 border border-gray-200'
                            }`}
                    >
                        <span className="text-lg">{reaction.emoji}</span>
                        {reaction.count > 0 && (
                            <span className="text-sm font-medium">{reaction.count}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Phần bình luận */}
            <div className="border-t border-gray-100 pt-3">
                <button
                    onClick={() => setShowComments(!showComments)}
                    className="text-sm text-gray-600 hover:text-gray-800 mb-3 flex items-center gap-2"
                >
                    💬 {comments.length} bình luận
                    <span className={`transform transition-transform ${showComments ? 'rotate-180' : ''}`}>
                        ▼
                    </span>
                </button>

                {/* Input thêm bình luận */}
                {canUserCreateBlog(user) ? (
                    <div className="flex gap-2 mb-3">
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-semibold">
                            {user?.fullName?.[0]?.toUpperCase() || user?.userName?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 flex gap-2">
                            <input
                                type="text"
                                placeholder="Viết bình luận..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Button
                                onClick={handleAddComment}
                                disabled={!newComment.trim()}
                                className="px-4 py-2 text-sm"
                            >
                                Gửi
                            </Button>
                        </div>
                    </div>
                ) : user ? (
                    <div className="mb-3 p-3 bg-gray-50 rounded-lg border">
                        <p className="text-sm text-gray-600 text-center">
                            <span className="font-medium">Students can view but not comment.</span>
                            <br />
                            Only companies can create posts and comments.
                        </p>
                    </div>
                ) : (
                    <div className="mb-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-sm text-yellow-800 text-center">
                            Please <a href="/signin" className="font-medium underline hover:text-yellow-900">sign in</a> to comment on posts.
                        </p>
                    </div>
                )}

                {/* Danh sách bình luận */}
                {showComments && (
                    <div className="space-y-3 bg-gray-50 rounded-lg p-3">
                        {comments.length > 0 ? (
                            comments.map(comment => (
                                <div key={comment.id} className="flex gap-2">
                                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-semibold">
                                        {comment.author[0]?.toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <div className="bg-white rounded-lg px-3 py-2 shadow-sm">
                                            <p className="font-medium text-sm text-blue-600">{comment.author}</p>
                                            <p className="text-sm">{comment.content}</p>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1 ml-3">{comment.createdAt}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 text-sm py-4">
                                Chưa có bình luận nào. Hãy là người đầu tiên bình luận! 💬
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};