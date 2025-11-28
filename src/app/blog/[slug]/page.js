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
    <div className="prose prose-invert mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
      <Link href="/blog" className="no-underline hover:text-blue-400">
        ← Back to Blog
      </Link>

      <h1 className="mt-8 text-4xl font-bold">{postData.title}</h1>
      <div className="text-gray-400">{postData.date}</div>
        
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
    </div>
  );
}