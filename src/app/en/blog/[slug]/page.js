import { getPostData, getSortedPostsData } from '../../../../lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import rehypePrettyCode from 'rehype-pretty-code';

export async function generateStaticParams() {
  // Generate params for English posts
  const posts = getSortedPostsData('en');
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
  // Fetch English post data
  const postData = await getPostData(resolvedParams.slug, 'en');

  return (
    <div className="min-h-screen font-sans">
      <div className="mx-auto max-w-3xl px-6 py-12 sm:px-8 lg:px-12">
        
        {/* Modern Back Button */}
        <div className="mb-12">
          <Link 
            href="/en/blog" 
            className="group inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="transition-transform group-hover:-translate-x-1"
            >
              <path d="M19 12H5"></path>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Blog
          </Link>
        </div>

        {/* Post Header */}
        <header className="mb-12 border-b border-white/10 pb-8">
          <time className="mb-4 block font-mono text-sm text-purple-400">
            {postData.date}
          </time>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {postData.title}
          </h1>
        </header>
          
        {/* Post Content */}
        <article className="prose prose-invert prose-lg max-w-none prose-headings:text-gray-100 prose-p:text-gray-300 prose-a:text-purple-400 hover:prose-a:text-purple-300 prose-code:text-purple-300 prose-pre:bg-[#1e1e24] prose-pre:border prose-pre:border-white/10">
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
    </div>
  );
}
