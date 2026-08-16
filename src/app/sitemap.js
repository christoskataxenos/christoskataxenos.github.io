export const dynamic = "force-static";

import { getSortedPostsData } from '../lib/posts';

export default async function sitemap() {
  const baseUrl = 'https://christoskataxenos.com';
  const today = new Date().toISOString().split('T')[0];

  const elPosts = getSortedPostsData('el').map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date || today,
    priority: 0.8,
  }));

  const enPosts = getSortedPostsData('en').map((post) => ({
    url: `${baseUrl}/en/blog/${post.slug}`,
    lastModified: post.date || today,
    priority: 0.8,
  }));

  const routes = [
    '',
    '/blog',
    '/bio',
    '/portfolio',
    '/en',
    '/en/blog',
    '/en/bio',
    '/en/portfolio',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: today,
    priority: route === '' || route === '/en' ? 1.0 : 0.9,
  }));

  return [...routes, ...elPosts, ...enPosts];
}

