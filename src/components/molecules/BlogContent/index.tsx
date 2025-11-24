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
                <div className="mb-4 w-full">
                    {/* 1 Image */}
                    {blog.images.length === 1 && (
                        <div className="w-full overflow-hidden rounded-lg">
                            <img
                                src={blog.images[0]}
                                alt="Blog image"
                                className="w-full h-auto max-h-[500px] object-cover cursor-pointer hover:opacity-95 transition-opacity"
                                onClick={() => window.open(blog.images![0], '_blank')}
                            />
                        </div>
                    )}

                    {/* 2 Images */}
                    {blog.images.length === 2 && (
                        <div className="grid grid-cols-2 gap-1 h-80 w-full overflow-hidden rounded-lg">
                            {blog.images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`Blog image ${idx + 1}`}
                                    className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                                    onClick={() => window.open(img, '_blank')}
                                />
                            ))}
                        </div>
                    )}

                    {/* 3 Images */}
                    {blog.images.length === 3 && (
                        <div className="grid grid-cols-2 gap-1 h-96 w-full overflow-hidden rounded-lg">
                            <div className="col-span-1 h-full">
                                <img
                                    src={blog.images[0]}
                                    alt="Blog image 1"
                                    className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                                    onClick={() => window.open(blog.images![0], '_blank')}
                                />
                            </div>
                            <div className="col-span-1 grid grid-rows-2 gap-1 h-full">
                                {blog.images.slice(1).map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`Blog image ${idx + 2}`}
                                        className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                                        onClick={() => window.open(img, '_blank')}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 4 Images */}
                    {blog.images.length === 4 && (
                        <div className="grid grid-cols-2 gap-1 h-96 w-full overflow-hidden rounded-lg">
                            {blog.images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`Blog image ${idx + 1}`}
                                    className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                                    onClick={() => window.open(img, '_blank')}
                                />
                            ))}
                        </div>
                    )}

                    {/* 5+ Images */}
                    {blog.images.length >= 5 && (
                        <div className="grid grid-cols-2 gap-1 h-96 w-full overflow-hidden rounded-lg relative">
                            {blog.images.slice(0, 4).map((img, idx) => (
                                <div key={idx} className="relative w-full h-full">
                                    <img
                                        src={img}
                                        alt={`Blog image ${idx + 1}`}
                                        className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                                        onClick={() => window.open(img, '_blank')}
                                    />
                                    {idx === 3 && (
                                        <div
                                            className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/60 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Open the 4th image or a gallery view
                                                window.open(img, '_blank');
                                            }}
                                        >
                                            <span className="text-white text-3xl font-bold">+{blog.images!.length - 4}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

