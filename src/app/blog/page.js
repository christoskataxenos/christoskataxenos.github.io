import Link from 'next/link';
import { getSortedPostsData } from '../../lib/posts';

export const metadata = {
  title: 'Blog | Christos Kataxenos',
  description: 'Thoughts, ideas, and developer diaries.',
};

export default function BlogPage() {
  const allPostsData = getSortedPostsData();

  return (
    <main className="min-h-screen p-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <header className="mb-12 text-center pt-8">
          <h1 className="text-4xl font-bold tracking-tight text-white mb-4">
            Blog
          </h1>
          <p className="text-gray-400">
            Insights from the digital frontier.
          </p>
        </header>

        <div className="space-y-6">
          {allPostsData.map(({ slug, date, title, description }) => (
            <Link href={`/blog/${slug}`} key={slug} className="block group no-underline">
              <article className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all duration-300">
                
                <time className="text-xs font-mono text-gray-500 mb-2 block">
                  {date}
                </time>
                
                <h2 className="text-xl font-bold text-gray-100 mb-2 group-hover:text-purple-400 transition-colors">
                  {title}
                </h2>
                
                <p className="text-gray-400 leading-relaxed">
                  {description}
                </p>
                
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
