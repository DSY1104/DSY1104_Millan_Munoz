/**
 * Blog Post Content Loader
 * Loads individual blog post content from JSON files
 */

/**
 * Loader function for blog post detail page
 * @param {Object} params - Route parameters
 * @param {string} params.slug - Blog post slug
 * @returns {Promise<Object>} Blog post content data
 */
export async function blogPostLoader({ params }) {
  const { slug } = params;

  try {
    // Fetch the JSON file from public/data/blogPosts
    const response = await fetch(`/data/blogPosts/${slug}.json`);

    if (!response.ok) {
      throw new Error(`Blog post not found: ${slug}`);
    }

    const postContent = await response.json();

    // Add the slug to the returned data
    return {
      ...postContent,
      slug,
    };
  } catch (error) {
    console.error(`Error loading blog post ${slug}:`, error);
    // Return null or throw to trigger error boundary
    throw new Response("Blog post not found", { status: 404 });
  }
}

/**
 * Helper function to check if a blog post exists
 * @param {string} slug - Blog post slug
 * @returns {Promise<boolean>}
 */
export async function blogPostExists(slug) {
  try {
    const response = await fetch(`/data/blogPosts/${slug}.json`, {
      method: "HEAD",
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Helper function to get all available blog post slugs
 * This would need a manifest file or API endpoint in production
 * For now, returns hardcoded list
 * @returns {string[]}
 */
export function getAllBlogPostSlugs() {
  return [
    "auriculares-gaming-2025",
    "setup-gaming-completo",
    "monitores-4k-gaming",
    "borderlands-4-preview",
    "ps5-pro-review",
    "gaming-trends-2025",
  ];
}
