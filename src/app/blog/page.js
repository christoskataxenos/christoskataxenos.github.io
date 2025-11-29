import { getSortedPostsData } from '../../lib/posts';
import BlogCard from '../../components/BlogCard';
import Link from 'next/link';

export const metadata = {
  title: 'Blog | Christos Kataxenos',
  description: 'Thoughts, ideas, and developer diaries.',
};

export default function BlogPage() {
  const allPostsData = getSortedPostsData();

  return (
    <main className="min-h-screen py-8 pt-20 font-sans">
      <div className="max-w-[800px] mx-auto space-y-6">
        
        <header className="mb-12 text-center pt-8 relative">
          
          <h1 className="text-4xl font-bold tracking-tight text-white mb-4">
            Blog
          </h1>
          <p className="text-gray-400">
            Insights from the digital frontier.
          </p>
        </header>

        <div className="flex flex-col space-y-10">
          {allPostsData.map(({ slug, date, title, description }) => (
            <BlogCard
              key={slug}
              slug={slug}
              date={date}
              title={title}
              description={description}
            />
          ))}
        </div>
      </div>
    </main>
  );
}