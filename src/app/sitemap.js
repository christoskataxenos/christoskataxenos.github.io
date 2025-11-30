export const dynamic = "force-static";

import { getSortedPostsData } from '../lib/posts';

export default async function sitemap() {
  const posts = getSortedPostsData();
  const baseUrl = 'https://christoskataxenos.com';

  const blogs = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date,
    priority: 0.8,
  }));

  const routes = ['', '/blog', '/bio', '/portfolio'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    priority: 1.0,
  }));

  return [...routes, ...blogs];
}
