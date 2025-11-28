import Link from 'next/link';
import { getSortedPostsData } from '../../lib/posts';

export const metadata = {
  title: 'DevLog | Christos Kataxenos',
  description: 'Coding adventures and bugs found along the way.',
};

export default function Blog() {
  const allPostsData = getSortedPostsData();

  return (
    <main className="min-h-screen bg-[#0a0a0c] text-white font-sans p-4 sm:p-6 lg:p-8">
      {/* Centered content container */}
      <div className="mx-auto max-w-2xl">
        <header className="text-center py-16">
          <h1 className="text-5xl font-bold tracking-tight text-white">DevLog</h1>
          <p className="mt-3 text-lg text-gray-400">Insights from the digital frontier.</p>
        </header>

        {/* Vertical list of blog posts */}
        <div className="flex flex-col gap-12">
          {allPostsData.map(({ slug, date, title, description }) => (
            <Link href={`/blog/${slug}`} key={slug} className="block group">
              <article>
                <p className="text-base text-gray-400">{date}</p>
                <h2 className="mt-2 text-3xl font-bold text-gray-100 transition-colors group-hover:text-purple-400">
                  {title}
                </h2>
                <p className="mt-3 text-lg text-gray-300">{description}</p>
                <span className="mt-4 inline-block font-medium text-purple-400 group-hover:underline">
                  Read more →
                </span>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}