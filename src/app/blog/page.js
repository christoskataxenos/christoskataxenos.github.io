import { getSortedPostsData } from '../../lib/posts';
import BlogCard from '../../components/BlogCard';
import Link from 'next/link';
import ParticleTitle from '../../components/ParticleTitle';

export const metadata = {
  title: 'Blog | Christos Kataxenos',
  description: 'Thoughts, ideas, and developer diaries.',
};

export default function BlogPage() {
  const allPostsData = getSortedPostsData();

  return (
    <main className="min-h-screen py-8 pt-20 font-sans">
      <div className="max-w-4xl mx-auto space-y-6 px-6">

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

        <div className="max-w-2xl mx-auto flex flex-col gap-8">
          {allPostsData.map(({ slug, date, title, description, readingTime }) => (
            <BlogCard
              key={slug}
              slug={slug}
              date={date}
              title={title}
              description={description}
              readingTime={readingTime}
            />
          ))}
        </div>
      </div>
    </main>
  );
}