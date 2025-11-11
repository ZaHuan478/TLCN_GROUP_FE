import React from "react";

type Reaction = {
    id: string;
    emoji: string;
    count: number;
    isLiked: boolean;
};

type BlogStatsProps = {
    reactions: Reaction[];
    totalComments: number;
};

export const BlogStats: React.FC<BlogStatsProps> = ({ reactions, totalComments }) => {
    const likeCount = reactions.find(r => r.id === 'like')?.count || 0;

    return (
        <div className="flex items-center justify-between py-2 px-1 text-sm">
            <div className="flex items-center gap-1">
                <span className="flex items-center gap-1">
                    <span className="text-blue-500">👍</span>
                    <span>{likeCount}</span>
                </span>
            </div>
            <div className="flex items-center gap-4">
                <span>{totalComments} comments</span>
            </div>
        </div>
    );
};

