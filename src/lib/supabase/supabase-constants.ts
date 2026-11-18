const DATABASE = {
    USERS: "users",
    BLOGS_CATEGORY: "blog-category",
    BLOGS: "blogs",
    CONTACT_INQUIRIES: "contact_inquiries",
    BANNER_AD_INQUIRIES: "banner_ad_inquiries"
}

const STORAGE = {
    BUCKETS: {
        ONELISTY: "onelisty"
    },
    FOLDERS: {
        BLOG_COVERS: "blogs/covers",
        BLOG_AUTHORS: "blogs/author-avatar",
    }
}

export const SUPABASE_CONSTANTS = {
    DB_TABLES: DATABASE,
    STORAGE: STORAGE
} as const;