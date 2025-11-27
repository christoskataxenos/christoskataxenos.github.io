import { getPostData, getSortedPostsData } from '../../../lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const postData = getPostData(slug);
  return {
    title: postData.metadata.title,
    description: postData.metadata.description,
  };
}

export default async function Post({ params }) {
  const { slug } = await params;
  const postData = getPostData(slug);

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '4rem 2rem',
      minHeight: '100vh',
    }}>
       <header style={{ marginBottom: '3rem' }}>
        <Link href="/blog" style={{ 
          color: '#94a1b2', 
          textDecoration: 'none', 
          marginBottom: '1.5rem', 
          display: 'inline-block',
          fontSize: '0.9rem'
        }}>
          ← Back to Blog
        </Link>
        <h1 style={{ 
          color: '#fffffe', 
          fontSize: '2.5rem', 
          marginTop: '0.5rem',
          marginBottom: '0.5rem'
        }}>
          {postData.metadata.title}
        </h1>
        <time style={{ color: '#7f5af0', fontFamily: 'monospace' }}>
          {postData.metadata.date}
        </time>
      </header>

      <article className="prose">
        <MDXRemote source={postData.content} />
      </article>

      <style>{`
        .prose {
          color: #94a1b2;
          line-height: 1.8;
          font-size: 1.1rem;
        }
        .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
          color: #fffffe;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .prose h2 { font-size: 1.8rem; border-bottom: 1px solid rgba(148, 161, 178, 0.1); padding-bottom: 0.5rem; }
        .prose h3 { font-size: 1.5rem; }
        .prose p { margin-bottom: 1.5rem; }
        .prose ul, .prose ol { margin-bottom: 1.5rem; padding-left: 1.5rem; }
        .prose li { margin-bottom: 0.5rem; }
        .prose a { color: #7f5af0; text-decoration: none; border-bottom: 1px solid transparent; transition: border-color 0.2s; }
        .prose a:hover { border-bottom-color: #7f5af0; }
        .prose strong { color: #fffffe; }
        .prose code { 
          background-color: rgba(127, 90, 240, 0.1); 
          color: #7f5af0; 
          padding: 0.2rem 0.4rem; 
          border-radius: 4px; 
          font-family: var(--font-mono); 
          font-size: 0.9em;
        }
        .prose pre {
          background-color: #16161a;
          padding: 1.5rem;
          border-radius: 8px;
          overflow-x: auto;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(148, 161, 178, 0.1);
        }
        .prose pre code {
          background-color: transparent;
          color: inherit;
          padding: 0;
        }
        .prose blockquote {
          border-left: 4px solid #7f5af0;
          padding-left: 1rem;
          margin-left: 0;
          font-style: italic;
          color: #fffffe;
        }
      `}</style>
    </div>
  );
}
