import React, { useState } from "react";
import { Button } from "../../atoms/Button/Button";
import { Input } from "../../atoms/Input/Input";
import { Avatar } from "../../atoms/Avatar";
import { User } from "../../../types/types";

type CommentInputProps = {
    user: User | null;
    onSubmit: (content: string) => void;
    disabled?: boolean;
};

export const CommentInput: React.FC<CommentInputProps> = ({
    user,
    onSubmit,
    disabled = false
}) => {
    const [comment, setComment] = useState("");

    const handleSubmit = () => {
        if (comment.trim() && !disabled) {
            onSubmit(comment.trim());
            setComment("");
        }
    };

    const getUserInitial = () => {
        if (!user) return 'U';
        return user?.fullName?.[0]?.toUpperCase() ||
            user?.userName?.[0]?.toUpperCase() ||
            'U';
    };

    if (!user) {
        return (
            <div className="mb-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800 text-center">
                    Please <a href="/signin" className="font-medium underline hover:text-yellow-900">sign in</a> to comment on posts.
                </p>
            </div>
        );
    }

    if (disabled) {
        return (
            <div className="mb-3 p-3 bg-gray-50 rounded-lg border">
                <p className="text-sm text-gray-600 text-center">
                    <span className="font-medium">Students can view but not comment.</span>
                    <br />
                    Only companies can create posts and comments.
                </p>
            </div>
        );
    }

    return (
        <div className="flex gap-2 mb-3">
            <Avatar name={getUserInitial()} size="sm" bgColor="bg-gray-300" />
            <div className="flex-1 relative">
                <Input
                    type="text"
                    placeholder="Write a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                    overrideDefaultStyles={true}
                    className="w-full pl-4 pr-20 py-2.5 border border-gray-300 rounded-full text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                    onClick={handleSubmit}
                    disabled={!comment.trim()}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 text-sm rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                >
                    Send
                </Button>
            </div>
        </div>
    );
};

