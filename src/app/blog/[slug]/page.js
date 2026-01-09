import { getPostData, getSortedPostsData } from '../../../lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import rehypePrettyCode from 'rehype-pretty-code';
import Stats from '../../../components/Stats';
import Callout from '../../../components/Callout';
import FileTree from '../../../components/FileTree';
import InteractionDock from '../../../components/InteractionDock';
import ReadingProgress from '../../../components/ReadingProgress';
import Terminal from '../../../components/Terminal';

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  try {
    const post = getPostData(resolvedParams.slug);

    if (!post) {
      return;
    }

    const { title, date, description } = post;

    return {
      title: `${title} | Christos Kataxenos DevLog`,
      description: description,
      openGraph: {
        title: title,
        description: description,
        type: 'article',
        publishedTime: date,
        authors: ['Christos Kataxenos'],
        images: [
          {
            url: 'https://christoskataxenos.com/images/og-default.png',
            width: 1200,
            height: 630,
          },
        ],
      },
    };
  } catch (error) {
    return {
      title: 'Post Not Found',
    };
  }
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
    <div className="mx-auto max-w-3xl py-8 pt-32 px-6">
      <ReadingProgress />
      <InteractionDock title={postData.title} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: postData.title,
            datePublished: postData.date,
            description: postData.description,
            author: {
              '@type': 'Person',
              name: 'Christos Kataxenos',
              url: 'https://christoskataxenos.com',
            },
          }),
        }}
      />

      <article className="prose prose-invert max-w-none font-sans prose-p:font-sans prose-headings:font-sans prose-li:font-sans prose-strong:font-sans leading-loose space-y-6 text-gray-300">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          {postData.title}
        </h1>

        {/* Date and reading time with Monospace styling */}
        <div className="font-mono text-xs text-cyan-500/80 mb-12 border-b border-gray-800 pb-8 flex items-center gap-4">
          <span>PUBLISHED: {postData.date}</span>
          <span className="text-gray-600">•</span>
          <span className="text-purple-400">{postData.readingTime} MIN READ</span>
        </div>

        <MDXRemote
          source={postData.content}
          components={{ Stats, Callout, FileTree, Terminal }}
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