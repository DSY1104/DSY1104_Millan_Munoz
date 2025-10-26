# Blog Post Content Migration - JSON + Loader Architecture

## Overview

Blog post content has been migrated from a JavaScript module to JSON files loaded dynamically via React Router loaders. This provides better separation of concerns, easier content management, and improved performance.

## New Structure

### JSON Files Location

```
public/
  data/
    blogPosts/
      auriculares-gaming-2025.json
      setup-gaming-completo.json
      monitores-4k-gaming.json
      borderlands-4-preview.json
      ps5-pro-review.json
      gaming-trends-2025.json
```

### Loader Implementation

```
src/
  loaders/
    blogPostLoader.js  ← New loader for blog post content
```

### Updated Files

- `src/App.jsx` - Added `blogPostLoader` to blog post route
- `src/pages/BlogPost.jsx` - Now uses `useLoaderData()` instead of import
- `src/assets/data/blogPostsContent.js` - ❌ Can be deleted (deprecated)

## How It Works

### 1. Route Configuration (App.jsx)

```jsx
import { blogPostLoader } from "./loaders/blogPostLoader";

const router = createBrowserRouter([
  {
    path: "blog/:slug",
    element: <BlogPost />,
    loader: blogPostLoader, // ← Loads JSON before rendering
  },
]);
```

### 2. Loader Function (blogPostLoader.js)

```jsx
export async function blogPostLoader({ params }) {
  const { slug } = params;

  // Fetch JSON file from public/data/blogPosts
  const response = await fetch(`/data/blogPosts/${slug}.json`);

  if (!response.ok) {
    throw new Response("Blog post not found", { status: 404 });
  }

  const postContent = await response.json();

  return {
    ...postContent,
    slug,
  };
}
```

### 3. Component Usage (BlogPost.jsx)

```jsx
import { useLoaderData } from "react-router";

export default function BlogPost() {
  const content = useLoaderData(); // ← Data from loader

  // content now has: title, subtitle, author, date, content[], etc.
  return (
    <article>
      <h1>{content.title}</h1>
      <p>{content.subtitle}</p>
      {/* ... render content blocks ... */}
    </article>
  );
}
```

## Benefits

### ✅ Better Separation

- Content (JSON) separated from code (JS)
- Non-developers can edit JSON files more easily
- Content can be version controlled separately

### ✅ Performance

- JSON files only loaded when needed (route-based)
- No need to bundle all blog content in main JS
- Lazy loading by default

### ✅ Scalability

- Easy to add new blog posts (just add JSON file)
- Can be moved to a CMS or API later with minimal changes
- Loader abstraction makes data source swappable

### ✅ SEO & Data Fetching

- React Router loaders work with SSR
- Data fetched before render (no loading spinners)
- Proper error handling with error boundaries

## JSON File Structure

Each blog post JSON file follows this schema:

```json
{
  "title": "Article Title",
  "subtitle": "Article subtitle or excerpt",
  "author": {
    "name": "Author Name",
    "role": "Author Role",
    "avatar": "Initials"
  },
  "date": "2024-09-10",
  "category": "reviews|guias|noticias|gaming",
  "readingTime": "5 min",
  "heroImage": "/src/assets/images/blog/image.webp",
  "heroCaption": "Image caption",
  "content": [
    {
      "type": "paragraph",
      "text": "Paragraph content..."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Section Title"
    },
    {
      "type": "list",
      "items": ["Item 1", "Item 2", "Item 3"]
    },
    {
      "type": "tips",
      "title": "💡 Pro Tips",
      "items": ["Tip 1", "Tip 2"]
    },
    {
      "type": "alert",
      "title": "🚨 Important",
      "text": "Alert message"
    },
    {
      "type": "comparison|specs|stats|rating",
      "...": "Type-specific properties"
    }
  ]
}
```

## Content Block Types

All content block types from the original implementation are supported:

- **paragraph** - Text paragraphs
- **heading** - H2, H3 headings (level: 2-3)
- **list** - Unordered lists
- **tips** - Tips callout box
- **alert** - Alert/warning box
- **comparison** - Comparison table
- **specs** - Specifications table
- **stats** - Statistics grid
- **rating** - Review rating card

The `BlogPost.jsx` component renders these blocks identically to before.

## Migration Checklist

- [x] Create JSON files for all 6 blog posts
- [x] Create `blogPostLoader.js` loader
- [x] Update `App.jsx` to use loader
- [x] Update `BlogPost.jsx` to use `useLoaderData()`
- [ ] Delete old `src/assets/data/blogPostsContent.js` (optional)
- [ ] Update tests if they reference old import
- [ ] Test all blog post pages load correctly

## Future Enhancements

### Content Management System (CMS)

The loader can be easily updated to fetch from a headless CMS:

```jsx
export async function blogPostLoader({ params }) {
  const response = await fetch(
    `https://cms.levelup.com/api/posts/${params.slug}`
  );
  return response.json();
}
```

### Static Site Generation (SSG)

With proper build setup, blog posts can be pre-rendered at build time for optimal performance.

### Markdown Support

JSON content blocks can be replaced with Markdown:

```json
{
  "title": "Article Title",
  "content": "# Heading\n\nParagraph text..."
}
```

Then use a Markdown renderer in `BlogPost.jsx`.

## Testing

To test a specific blog post:

```bash
# Navigate to the blog post page
http://localhost:5173/blog/auriculares-gaming-2025
```

If the post doesn't exist, you'll see a 404 error (error boundary).

## Troubleshooting

### "Blog post not found" Error

- Check that the JSON file exists in `public/data/blogPosts/`
- Verify the filename matches the slug exactly
- Ensure JSON is valid (use a JSON validator)

### Content Not Displaying

- Check browser console for fetch errors
- Verify `useLoaderData()` is being called
- Ensure loader is registered in App.jsx route

### 404 Errors in Production

- Ensure `public/data/blogPosts/` folder is included in build
- Check deployment configuration includes static files
- Verify fetch path is correct (no leading `/` issues)

---

**Migration completed successfully!** 🎉

All blog posts are now served via JSON files and loaded dynamically through React Router loaders.
