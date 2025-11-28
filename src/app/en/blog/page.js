import Link from 'next/link';
import { getSortedPostsData } from '../../../../lib/posts';
import BlogCard from '../../../../components/BlogCard';

export const metadata = {
  title: 'Blog | Christos Kataxenos',
  description: 'Thoughts, ideas, and developer diaries.',
};

export default function BlogPage() {
  // Fetch English posts
  const allPostsData = getSortedPostsData('en');

  return (
    <main className="min-h-screen p-8 font-sans">
      <div className="max-w-[800px] mx-auto space-y-6">
        
        <header className="mb-12 text-center pt-8 relative">
          <div className="absolute top-0 right-0">
            <Link href="/blog" className="text-sm font-mono text-gray-500 hover:text-purple-400 transition-colors">
              GR / <span className="text-white">EN</span>
            </Link>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-white mb-4">
            Blog
          </h1>
          <p className="text-gray-400">
            Insights from the digital frontier.
          </p>
        </header>

        <div className="flex flex-col space-y-6">
          {allPostsData.map(({ slug, date, title, description }) => (
            <BlogCard
              key={slug}
              slug={slug}
              date={date}
              title={title}
              description={description}
              basePath="/en/blog"
            />
          ))}
        </div>
      </div>
    </main>
  );
}