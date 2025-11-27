import Link from 'next/link';
import { getSortedPostsData } from '../../lib/posts';

export default async function BlogPage() {
  const allPostsData = getSortedPostsData();

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '4rem 2rem',
      minHeight: '100vh',
    }}>
      <header style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <Link href="/" style={{ 
          color: '#94a1b2', 
          textDecoration: 'none', 
          marginBottom: '1rem', 
          display: 'inline-block',
          fontSize: '0.9rem'
        }}>
          ← Back to Home
        </Link>
        <h1 style={{ 
          color: '#7f5af0', 
          fontSize: '2.5rem', 
          marginTop: '0.5rem' 
        }}>
          Blog
        </h1>
        <p style={{ color: '#94a1b2', fontSize: '1.1rem' }}>
          Thoughts, tutorials, and updates.
        </p>
      </header>

      <main>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {allPostsData.map(({ slug, date, title, description }) => (
            <li key={slug} style={{ marginBottom: '2.5rem' }}>
              <Link href={`/blog/${slug}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: '1.5rem',
                  border: '1px solid rgba(148, 161, 178, 0.2)',
                  borderRadius: '8px',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)'
                }}
                className="blog-card"
                >
                  <h2 style={{ 
                    color: '#fffffe', 
                    margin: '0 0 0.5rem 0', 
                    fontSize: '1.5rem' 
                  }}>
                    {title}
                  </h2>
                  <small style={{ 
                    color: '#94a1b2', 
                    display: 'block', 
                    marginBottom: '0.5rem' 
                  }}>
                    {date}
                  </small>
                  <p style={{ 
                    color: '#94a1b2', 
                    margin: 0, 
                    lineHeight: '1.6' 
                  }}>
                    {description}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      
      {/* Add hover effect via style tag for simplicity in this component */}
      <style>{`
        .blog-card:hover {
          border-color: #7f5af0 !important;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}