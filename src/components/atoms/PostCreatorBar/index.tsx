import React from "react";
import { Button } from "../Button/Button";
import { useAuth } from "../../../contexts/AuthContext";

type PostCreatorBarProps = {
    onOpen: () => void;
}

const PostCreatorBar: React.FC<PostCreatorBarProps> = ({ onOpen }) => {
    const { user } = useAuth();
    return (
        <div className="bg-white rounded-xl shadow p-4 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-300" />

            <Button
                variant="outline"
                onClick={onOpen}
                className="flex-1 text-left bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full px-4 py-2 transition"
            >
                What's on your mind, {user?.fullName || user?.username || 'there'}?
            </Button>
        </div>
    );
};

export default PostCreatorBar;
