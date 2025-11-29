import { getPostData, getSortedPostsData } from '../../../lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import rehypePrettyCode from 'rehype-pretty-code';

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

/** @type {import('rehype-pretty-code').Options} */
const prettyCodeOptions = {
  theme: 'one-dark-pro',
  keepBackground: true,
  onVisitLine(node) {
    if (node.children.length === 0) {
      node.children = [{ type: 'text', value: ' ' }];
    }
  },
  onVisitHighlightedLine(node) {
    node.properties.className.push('line--highlighted');
  },
  onVisitHighlightedWord(node) {
    node.properties.className = ['word--highlighted'];
  },
};

export default async function Post({ params }) {
  const resolvedParams = await params;
  const postData = await getPostData(resolvedParams.slug);

  return (
    <div className="mx-auto max-w-3xl py-8 pt-32 px-6"> {/* Αύξησα το pt-24 σε pt-32 για περισσότερο αέρα */}
      
      {/* --- FORCE FIX BACK BUTTON --- */}
      <Link 
        href="/blog" 
        className="!group !inline-flex !items-center !gap-3 !text-sm !font-mono !text-gray-500 hover:!text-cyan-400 !transition-colors !mb-12 !no-underline"
        style={{ textDecoration: 'none' }} // Διπλή ασφάλεια για το 1990
      >
        <span className="transform group-hover:-translate-x-1 transition-transform duration-200 text-lg no-underline">
          ←
        </span>
        <span className="uppercase tracking-widest text-xs font-bold no-underline">
          BACK TO BLOG
        </span>
      </Link>
      {/* ----------------------------- */}

      <article className="prose prose-invert max-w-none font-sans prose-p:font-sans prose-headings:font-sans prose-li:font-sans prose-strong:font-sans leading-loose space-y-6 text-gray-300">
          <h1 className="text-4xl md::text-5xl font-bold text-white mb-4 tracking-tight">
            {postData.title}
          </h1>
          
          {/* Ημερομηνία με Monospace για στυλ */}
          <div className="font-mono text-xs text-cyan-500/80 mb-12 border-b border-gray-800 pb-8">
            PUBLISHED: {postData.date}
          </div>
            
          <MDXRemote 
            source={postData.content}
            options={{
              mdxOptions: {
                rehypePlugins: [
                  [rehypePrettyCode, prettyCodeOptions],
                ],
              },
            }}
          />
      </article>
    </div>
  );
}