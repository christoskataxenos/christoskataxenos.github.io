import Link from 'next/link';
import { getSortedPostsData } from '../../lib/posts';
import styles from './blog.module.css'; // <--- Η Σύνδεση

export const metadata = {
  title: 'DevLog | Christos Kataxenos',
  description: 'Coding adventures and bugs found along the way.',
};

export default function Blog() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a0c] text-white p-8 font-sans">
      <header className={styles.header}>
        <h1 className={styles.title}>DevLog</h1>
        <p style={{color: '#94a1b2'}}>Insights from the digital frontier.</p>
      </header>

      <div className={styles.grid}>
        {allPostsData.map(({ slug, date, title, description }) => (
          <Link href={`/blog/${slug}`} key={slug} className={styles.cardLink}>
            <article className={styles.card}>
              <span className={styles.date}>{date}</span>
              <h2>{title}</h2>
              <p>{description}</p>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}