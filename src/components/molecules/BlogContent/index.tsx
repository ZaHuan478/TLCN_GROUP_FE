import React from "react";
import { Blog } from "../../../api/blogApi";

type BlogContentProps = {
    blog: Blog;
};

export const BlogContent: React.FC<BlogContentProps> = ({ blog }) => {
    return (
        <>
            {blog.title && (
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{blog.title}</h3>
            )}
            <p className="text-gray-700 mb-4">{blog.content}</p>

            {/* Display images if available */}
            {blog.images && blog.images.length > 0 && (
                <div className={`mb-4 grid gap-2 ${blog.images.length === 1 ? 'grid-cols-1' :
                        blog.images.length === 2 ? 'grid-cols-2' :
                            'grid-cols-2'
                    }`}>
                    {blog.images.map((imageUrl, index) => (
                        <div key={index} className="relative">
                            <img
                                src={imageUrl}
                                alt={`Blog image ${index + 1}`}
                                className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => {
                                    window.open(imageUrl, '_blank');
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

