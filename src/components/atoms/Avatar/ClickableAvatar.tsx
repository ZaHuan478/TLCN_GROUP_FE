import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../services/authService";
import { Avatar } from "./index";
import conversationApi from "../../../api/conversationApi";

type Props = {
  userId: string;
  username?: string;
  fullName?: string;
  avatarUrl?: string | null;
  size?: "sm" | "md";
  className?: string;
};

const ClickableAvatar: React.FC<Props> = ({ userId, username, fullName, avatarUrl, size = "md", className = "" }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const otherName = fullName || username || "User";

  // Size mapping to match Avatar component sizes
  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "w-10 h-10"; // Match Avatar sm size
      case "md":
        return "w-16 h-16"; // Match Avatar md size
      default:
        return "w-10 h-10";
    }
  };

  const handleViewProfile = () => {
    setOpen(false);
    navigate(`/users/${userId}`);
  };

  const handleChat = async () => {
    try {
      setOpen(false);
      // If not authenticated, redirect to signin first
      if (!authService.isAuthenticated()) {
        navigate("/signin");
        return;
      }

      console.log("ClickableAvatar: creating/getting conversation with user", userId);
      const convo: any = await conversationApi.getOrCreateConversation(userId);
      console.log("ClickableAvatar: convo response", convo);

      // convo may be object with id in different shapes; pick likely fields
      const id = convo?.id || convo?.conversation?.id || convo?.data?.id || convo?.conversationId || convo?.conversation?.conversationId;

      // If API returned 401 or similar it should throw; but defensively handle missing id
      if (id) {
        navigate(`/connections?conversationId=${id}`);
      } else {
        // Fallback: open connections list and let user pick
        navigate(`/connections`);
      }
    } catch (err) {
      console.error("Create conversation failed", err);
      // If unauthorized, go to signin
      const status = (err as any)?.response?.status;
      if (status === 401 || status === 403) {
        navigate("/signin");
      }
    }
  };

  return (
    <div className={`relative inline-block ${className}`} ref={ref}>
      <button onClick={() => setOpen((s) => !s)} aria-label={`Open actions for ${otherName}`}>
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt={otherName} 
            className={`${getSizeClass()} rounded-full object-cover border-4 border-white shadow-lg`} 
          />
        ) : (
          <Avatar name={otherName} size={size} />
        )}
      </button>

      {open && (
        <div className="absolute z-20 right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg py-1">
          <button onClick={handleViewProfile} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Xem tường nhà</button>
          <button onClick={handleChat} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Nhắn tin</button>
        </div>
      )}
    </div>
  );
};

export default ClickableAvatar;
