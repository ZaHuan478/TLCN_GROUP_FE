import React, { useState, useEffect, useRef } from "react";
import { Blog } from "../../../api/blogApi";
import { Button } from "../../atoms/Button/Button";
import { Textarea } from "../../atoms/Textarea/Textarea";
import { useAuth } from "../../../contexts/AuthContext";
import { canUserCreateBlog } from "../../../utils/userUtils";

type PostModalProps = {
    onClose: () => void;
    onPost: (data: { content: string; images?: File[] }) => void;
    initialData?: Blog;
    title?: string;
};

const PostModal: React.FC<PostModalProps> = ({ onClose, onPost, initialData }) => {
    const { user } = useAuth();
    const [content, setContent] = useState("");
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialData) {
            setContent(initialData.content);
        }
    }, [initialData]);

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0) return;

        // Validate file types
        const validFiles = files.filter(file => 
            file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB limit
        );

        if (validFiles.length !== files.length) {
            alert('Please select only image files under 5MB each');
            return;
        }

        setSelectedImages(prev => [...prev, ...validFiles]);

        // Create preview URLs
        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    setImagePreviews(prev => [...prev, e.target!.result as string]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleImageButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handlePost = () => {
        // Defensive check: ensure current user is allowed to create posts
        if (!canUserCreateBlog(user as any)) {
            alert("You don't have permission to create posts.");
            onClose();
            return;
        }

        if (!content.trim() && selectedImages.length === 0) return;
        onPost({ content, images: selectedImages });
        setContent("");
        setSelectedImages([]);
        setImagePreviews([]);
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

                {/* Image Preview */}
                {imagePreviews.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                        {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-opacity-70"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                />

                <div className="flex justify-between items-center mt-4">
                    <div className="flex space-x-3">
                        {/* Image Upload Button */}
                        <Button
                            variant="icon"
                            onClick={handleImageButtonClick}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50 p-2 rounded-full"
                            title="Add images"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                            </svg>
                        </Button>
                    </div>

                    <Button
                        onClick={handlePost}
                        disabled={!content.trim() && selectedImages.length === 0}
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
