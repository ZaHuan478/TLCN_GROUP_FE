import React, { useState, useEffect } from "react";
import { Blog } from "../../../api/blogApi";
import { Button } from "../../atoms/Button/Button";
import { Textarea } from "../../atoms/Textarea/Textarea";
import { useAuth } from "../../../contexts/AuthContext";

type PostModalProps = {
    onClose: () => void;
    onPost: (data: { content: string }) => void;
    initialData?: Blog;
    title?: string;
};

const PostModal: React.FC<PostModalProps> = ({ onClose, onPost, initialData, title = "Create New Post" }) => {
    const { user } = useAuth();
    const [content, setContent] = useState("");

    useEffect(() => {
        if (initialData) {
            setContent(initialData.content);
        }
    }, [initialData]);

    const handlePost = () => {
        if (!content.trim()) return;
        onPost({ content });
        setContent("");
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-4 relative">
                <h2 className="text-lg font-semibold text-center mb-3">
                    {initialData ? "Edit post" : "Create post"}
                </h2>

                <Textarea
                    placeholder={`What's on your mind, ${user?.fullName || user?.userName || 'there'}?`}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    className="border-none bg-transparent"
                />

                <div className="flex justify-between items-center mt-4">
                    <div className="flex space-x-3 text-xl">
                        {/* <span className="cursor-pointer">🖼️</span>
                        <span className="cursor-pointer">😊</span>
                        <span className="cursor-pointer">📍</span> */}
                    </div>

                    <Button
                        onClick={handlePost}
                        disabled={!content.trim()}
                    >
                        {initialData ? "Update" : "Post"}
                    </Button>
                </div>

                <Button
                    variant="icon"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-4 right-4 text-gray-500 hover:text-black">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </Button>
            </div>
        </div>
    );
};

export default PostModal;
