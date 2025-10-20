import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2, Bookmark } from 'lucide-react';

// Mock blog post data - in production, fetch from API based on slug
const BLOG_POSTS = [
  {
    id: 1,
    slug: 'getting-started-with-nextjs',
    title: 'Getting Started with Next.js 15',
    author: 'Sarah Chen',
    date: '2025-01-15',
    tag: 'Next.js',
    image: '/nextjs-dashboard.jpg',
    content: `
      <p>Next.js 15 brings powerful new features and improvements to the React framework. In this comprehensive guide, we'll explore the latest capabilities and best practices for building modern web applications.</p>
      
      <h2>Why Next.js 15?</h2>
      <p>Next.js continues to evolve as the leading React framework for production applications. Version 15 introduces significant performance improvements, better developer experience, and new features that make building scalable applications easier than ever.</p>
      
      <h2>Key Features</h2>
      <p>The App Router provides a more intuitive way to structure your application. With file-based routing, you can organize your code in a way that makes sense for your project. Server Components allow you to fetch data directly in your components, reducing the need for client-side data fetching.</p>
      
      <blockquote>
        "Next.js has become the go-to framework for React developers who want to build production-ready applications with minimal configuration."
      </blockquote>
      
      <h2>Getting Started</h2>
      <p>To create a new Next.js 15 project, use the create-next-app command. This will scaffold a new project with all the necessary configuration and dependencies.</p>
      
      <pre><code>npx create-next-app@latest my-app --typescript --tailwind</code></pre>
      
      <p>Once your project is set up, you can start building your application using the App Router. Create files in the app directory to define your routes, and Next.js will automatically handle the routing for you.</p>
    `,
    relatedPosts: [
      {
        id: 2,
        slug: 'tailwind-css-tips',
        title: 'Tailwind CSS Tips & Tricks',
        image: '/tailwind-design-system.jpg',
      },
      {
        id: 3,
        slug: 'react-hooks-deep-dive',
        title: 'React Hooks Deep Dive',
        image: '/react-hooks-code.jpg',
      },
      {
        id: 4,
        slug: 'typescript-best-practices',
        title: 'TypeScript Best Practices',
        image: '/typescript-code-editor.jpg',
      },
    ],
    tags: ['Next.js', 'React', 'Web Development', 'JavaScript'],
  },
  {
    id: 2,
    slug: 'tailwind-css-tips',
    title: 'Tailwind CSS Tips & Tricks',
    author: 'Alex Rodriguez',
    date: '2025-01-12',
    tag: 'CSS',
    image: '/tailwind-design-system.jpg',
    content: `
      <p>Tailwind CSS has revolutionized the way we write CSS. Learn advanced techniques to maximize your productivity and create beautiful, responsive designs.</p>
      
      <h2>Utility-First CSS</h2>
      <p>Tailwind's utility-first approach allows you to build complex designs without leaving your HTML. Instead of writing custom CSS, you compose designs using pre-defined utility classes.</p>
      
      <h2>Responsive Design</h2>
      <p>With Tailwind's responsive prefixes, you can easily create designs that adapt to different screen sizes. Use breakpoints like sm, md, lg, and xl to target specific device sizes.</p>
      
      <blockquote>
        "Tailwind CSS lets you build modern designs without leaving your HTML. It's a game-changer for rapid development."
      </blockquote>
      
      <h2>Custom Configuration</h2>
      <p>Tailwind is highly customizable. You can extend the default configuration to add custom colors, fonts, spacing, and more. This allows you to create a design system that matches your brand.</p>
      
      <pre><code>module.exports = {
  theme: {
    extend: {
      colors: {
        brand: '#FF6B6B',
      },
    },
  },
}</code></pre>
    `,
    relatedPosts: [
      {
        id: 1,
        slug: 'getting-started-with-nextjs',
        title: 'Getting Started with Next.js 15',
        image: '/nextjs-dashboard.jpg',
      },
      {
        id: 5,
        slug: 'web-performance-optimization',
        title: 'Web Performance Optimization',
        image: '/performance-metrics-dashboard.jpg',
      },
    ],
    tags: ['CSS', 'Tailwind', 'Design', 'Web Development'],
  },
];

// Helper function to find post by slug
function getPostBySlug(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

// Helper function to render HTML content (in production, use a proper markdown parser)
function renderContent(content: string) {
  return content
    .split('\n')
    .filter((line) => line.trim())
    .map((line, index) => {
      if (line.startsWith('<h2>')) {
        return (
          <h2
            key={index}
            className="mt-8 mb-4 text-2xl font-bold text-foreground"
          >
            {line.replace(/<\/?h2>/g, '')}
          </h2>
        );
      }
      if (line.startsWith('<p>')) {
        return (
          <p
            key={index}
            className="mb-4 text-base leading-relaxed text-foreground"
          >
            {line.replace(/<\/?p>/g, '')}
          </p>
        );
      }
      if (line.startsWith('<blockquote>')) {
        return (
          <blockquote
            key={index}
            className="my-6 border-l-4 border-primary pl-4 italic text-muted-foreground"
          >
            {line.replace(/<\/?blockquote>/g, '')}
          </blockquote>
        );
      }
      if (line.startsWith('<pre><code>')) {
        return (
          <pre
            key={index}
            className="mb-4 overflow-x-auto rounded-lg bg-muted p-4 text-sm text-foreground"
          >
            <code>{line.replace(/<\/?pre>|<\/?code>/g, '')}</code>
          </pre>
        );
      }
      return null;
    });
}

interface BlogPostDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostDetailPage({
  params,
}: BlogPostDetailPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">
              Post Not Found
            </h1>
            <p className="mt-4 text-muted-foreground">
              The blog post you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link href="/blog">
              <Button className="mt-6">Back to Blog</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/blog">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <article className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Featured Image */}
          <div className="relative mb-8 h-96 w-full overflow-hidden rounded-lg bg-muted">
            <Image
              src={post.image || '/placeholder.svg'}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Post Header */}
          <header className="mb-8">
            {/* Category Badge */}
            <Badge className="mb-4">{post.tag}</Badge>

            {/* Title */}
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                {/* Author Avatar Placeholder */}
                <div className="h-12 w-12 rounded-full bg-primary/20" />
                <div>
                  <p className="font-medium text-foreground">{post.author}</p>
                  <time
                    dateTime={post.date}
                    className="text-sm text-muted-foreground"
                  >
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
              </div>

              {/* Share and Save Buttons */}
              <div className="flex gap-2">
                <Button variant="outline" size="icon" aria-label="Share post">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" aria-label="Save post">
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>
        </div>
      </article>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Article Content */}
          <article className="prose prose-sm max-w-none lg:col-span-2">
            <div className="space-y-6 text-foreground">
              {renderContent(post.content)}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Tags Section */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-foreground">Tags</h3>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Related Posts Section */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-foreground">Related Posts</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {post.relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                    <div className="group cursor-pointer space-y-2 rounded-lg p-2 transition-colors hover:bg-muted">
                      {/* Related Post Thumbnail */}
                      <div className="relative h-24 w-full overflow-hidden rounded bg-muted">
                        <Image
                          src={relatedPost.image || '/placeholder.svg'}
                          alt={relatedPost.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      {/* Related Post Title */}
                      <p className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary">
                        {relatedPost.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-foreground">Subscribe</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Get the latest posts delivered to your inbox.
                </p>
                <div className="space-y-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    aria-label="Email for newsletter"
                  />
                  <Button className="w-full">Subscribe</Button>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      {/* Navigation to Other Posts */}
      <section className="border-t border-border bg-muted/50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold text-foreground">
            More Posts
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BLOG_POSTS.filter((p) => p.slug !== slug)
              .slice(0, 3)
              .map((otherPost) => (
                <Link key={otherPost.id} href={`/blog/${otherPost.slug}`}>
                  <Card className="h-full overflow-hidden transition-all hover:shadow-lg hover:scale-105">
                    <div className="relative h-40 w-full overflow-hidden bg-muted">
                      <Image
                        src={otherPost.image || '/placeholder.svg'}
                        alt={otherPost.title}
                        fill
                        className="object-cover transition-transform hover:scale-110"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <Badge variant="secondary" className="w-fit">
                        {otherPost.tag}
                      </Badge>
                      <h3 className="mt-2 text-lg font-semibold text-foreground line-clamp-2">
                        {otherPost.title}
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <time
                        dateTime={otherPost.date}
                        className="text-xs text-muted-foreground"
                      >
                        {new Date(otherPost.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}
