import React, { useEffect, useState } from "react";
import MainTemplate from "../../templates/MainTemplate/MainTemplate";
import { ProfileShell } from "../../organisms/ProfileShell";
import { Button } from "../../atoms/Button/Button";
import { useAuth } from "../../../contexts/AuthContext";

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, isLoading, refreshUser } = useAuth();
  const [role, setRole] = useState<"STUDENT" | "COMPANY">("STUDENT");

  useEffect(() => {
    // If auth is ready and user exists, derive role from user object
    if (!isLoading && user?.role) {
      // Ensure the app shows the user's real role
      if (user.role === "STUDENT" || user.role === "COMPANY") {
        setRole(user.role);
      }
    }
  }, [isLoading, user]);

  useEffect(() => {
    // Try to refresh user info when component mounts to get latest role
    if (isAuthenticated) {
      refreshUser().catch(() => {});
    }
  }, [isAuthenticated, refreshUser]);

  const isRoleKnown = !!user?.role;

  return (
    <MainTemplate>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          {!isRoleKnown ? (
            <div className="flex items-center gap-2">
              <Button variant={role === "STUDENT" ? "primary" : "secondary"} onClick={() => setRole("STUDENT")}>Student</Button>
              <Button variant={role === "COMPANY" ? "primary" : "secondary"} onClick={() => setRole("COMPANY")}>Company</Button>
            </div>
          ) : null}
        </div>

        <ProfileShell role={role} />
      </div>
    </MainTemplate>
  );
};

export default ProfilePage;
