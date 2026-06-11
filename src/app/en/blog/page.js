import Link from 'next/link';
import { getSortedPostsData } from '../../../lib/posts';
import BlogCard from '../../../components/BlogCard';
import ParticleTitle from '../../../components/ParticleTitle';

export const metadata = {
  title: 'Blog | Christos Kataxenos',
  description: 'Thoughts, ideas, and developer diaries.',
};

export default function BlogPage() {
  // Fetch English posts
  const allPostsData = getSortedPostsData('en');

  return (
    <main className="min-h-screen py-8 pt-20 font-sans">
      <div className="max-w-[800px] mx-auto space-y-6">

        <header className="mb-12 text-center pt-8 relative flex justify-center">
          <div className="w-full max-w-lg mb-4">
            <ParticleTitle 
              text="BLOG" 
              subtitle="INSIGHTS FROM THE DIGITAL FRONTIER"
              scale={1.45}
              particleSize={1.5}
            />
          </div>
        </header>

        <div className="flex flex-col space-y-6">
          {allPostsData.map(({ slug, date, title, description, readingTime }) => (
            <BlogCard
              key={slug}
              slug={slug}
              date={date}
              title={title}
              description={description}
              readingTime={readingTime}
              basePath="/en/blog"
            />
          ))}
        </div>
      </div>
    </main>
  );
}