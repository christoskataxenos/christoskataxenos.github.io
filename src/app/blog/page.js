import Link from 'next/link';
import { getSortedPostsData } from '../../lib/posts';

export const metadata = {
  title: 'Blog | Christos Kataxenos',
  description: 'Thoughts, ideas, and developer diaries.',
};

export default function BlogPage() {
  const allPostsData = getSortedPostsData();

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-2xl">
        
        <header className="mb-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
            Blog
          </h1>
          <p className="text-lg text-neutral-400">
            Insights from the digital frontier.
          </p>
        </header>

        <div className="flex flex-col gap-6">
          {allPostsData.map(({ slug, date, title, description }) => (
            <Link href={`/blog/${slug}`} key={slug} className="block no-underline group">
              <article className="border border-neutral-800 p-6 rounded-xl bg-neutral-900/20 hover:border-neutral-600 transition-colors duration-200">
                
                <time className="text-sm font-mono text-neutral-500 mb-2 block">
                  {date}
                </time>
                
                <h2 className="text-2xl font-bold text-neutral-100 mb-2">
                  {title}
                </h2>
                
                <p className="text-neutral-400 mt-2 leading-relaxed">
                  {description}
                </p>
                
                <div className="mt-4 text-sky-400 group-hover:text-sky-300 text-sm font-medium inline-flex items-center gap-1 transition-colors">
                  Read More
                  <span aria-hidden="true">&rarr;</span>
                </div>
                
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
