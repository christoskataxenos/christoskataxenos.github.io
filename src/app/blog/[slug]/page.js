import { getPostData, getSortedPostsData } from '../../../lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Post({ params }) {
  // Await the params before using them
  const resolvedParams = await params;
  const postData = await getPostData(resolvedParams.slug);

  return (
    <div className="blog-container">
      <article className="prose">
        <Link href="/blog" className="read-more" style={{ display: 'inline-block', marginBottom: '2rem' }}>← Back to Blog</Link>
        <h1>{postData.title}</h1>
        <div className="post-date" style={{marginBottom: '3rem'}}>{postData.date}</div>
        
        <MDXRemote source={postData.content} />
      </article>
    </div>
  );
}