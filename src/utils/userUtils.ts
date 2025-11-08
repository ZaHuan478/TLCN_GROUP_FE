import { User } from "../types/types";

/**
 * Get display name for user based on their role and available data
 */
export const getUserDisplayName = (user: User | null): string => {
    if (!user) return "Anonymous";
    
    return user.fullName || user.userName || "Anonymous";
};

/**
 * Get user ID based on their role
 */
export const getUserId = (user: User): string => {
    switch (user.role) {
        case 'STUDENT':
            return user.studentId || user.id;
        case 'COMPANY':
            return user.companyId || user.id;
        case 'ADMIN':
        default:
            return user.id;
    }
};

/**
 * Check if user can create blog posts
 */
export const canUserCreateBlog = (user: User | null): boolean => {
    return user?.role === 'COMPANY' || user?.role === 'ADMIN';
};

/**
 * Check if user can modify a specific blog post
 */
export const canUserModifyBlog = (user: User | null, blogAuthorId: string): boolean => {
    if (!user) return false;
    
    // Admin can modify any blog
    if (user.role === 'ADMIN') return true;
    
    // User can only modify their own blogs (and only if they can create blogs)
    if (!canUserCreateBlog(user)) return false;
    
    const userId = getUserId(user);
    return userId === blogAuthorId;
};

/**
 * Get user permissions for blog functionality
 */
export const getUserBlogPermissions = (user: User | null) => {
    return {
        canCreate: canUserCreateBlog(user),
        canRead: true, // Everyone can read blogs
        canModify: (blogAuthorId: string) => canUserModifyBlog(user, blogAuthorId),
        roleMessage: user?.role === 'STUDENT' 
            ? 'Students can only view posts' 
            : user?.role === 'COMPANY'
            ? 'Companies can create and manage posts'
            : 'Please log in to interact with posts'
    };
};

/**
 * Get role-specific field name for user ID
 */
export const getUserIdFieldName = (user: User): string => {
    switch (user.role) {
        case 'STUDENT':
            return 'studentId';
        case 'COMPANY':
            return 'companyId';
        case 'ADMIN':
        default:
            return 'id';
    }
};

/**
 * Check if user can edit/delete a post
 */
export const canUserModifyPost = (
    currentUser: User | null, 
    postAuthor: any
): boolean => {
    if (!currentUser) return false;
    
    // Admin can modify any post
    if (currentUser.role === 'ADMIN') return true;
    
    // If author is string, compare with display name
    if (typeof postAuthor === 'string') {
        return postAuthor === getUserDisplayName(currentUser);
    }
    
    // If author is object, compare IDs based on role
    if (typeof postAuthor === 'object' && postAuthor) {
        const currentUserId = getUserId(currentUser);
        
        switch (currentUser.role) {
            case 'STUDENT':
                return postAuthor.studentId === currentUser.studentId || 
                       postAuthor.id === currentUserId;
            case 'COMPANY':
                return postAuthor.companyId === currentUser.companyId || 
                       postAuthor.id === currentUserId;
            default:
                return postAuthor.id === currentUserId;
        }
    }
    
    return false;
};