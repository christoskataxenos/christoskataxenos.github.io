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
  // Use one of Shiki's packaged themes
  theme: 'one-dark-pro',
 
  // Keep the background or use a custom background color?
  keepBackground: true,

  // Callback hooks to add custom logic to nodes when visiting
  // them.
  onVisitLine(node) {
    // Prevent lines from collapsing in `display: grid` mode, and allow empty
    // lines to be copy/pasted
    if (node.children.length === 0) {
      node.children = [{ type: 'text', value: ' ' }];
    }
  },
  onVisitHighlightedLine(node) {
    // Each line node by default has `class="line"`.
    node.properties.className.push('line--highlighted');
  },
  onVisitHighlightedWord(node) {
    // Each word node has no className by default.
    node.properties.className = ['word--highlighted'];
  },
};

export default async function Post({ params }) {
  // Await the params before using them
  const resolvedParams = await params;
  const postData = await getPostData(resolvedParams.slug);

  return (
    <div className="mx-auto max-w-3xl py-8 pt-24">
      <div className="mb-8">
        <Link 
            href="/blog" 
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors w-max"
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

      <article className="prose prose-invert max-w-none font-sans leading-relaxed space-y-4">
          <h1 className="text-4xl font-bold text-white mb-8">{postData.title}</h1>
          <div className="text-gray-400 mb-8 -mt-6">{postData.date}</div>
            
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