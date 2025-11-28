import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export function getSortedPostsData(locale = 'el') {
  // Determine directory based on locale
  // 'el' (default) -> content/posts
  // 'en' -> content/posts/en
  const targetDirectory = locale === 'en' 
    ? path.join(postsDirectory, 'en') 
    : postsDirectory;

  // Create directory if it doesn't exist
  if (!fs.existsSync(targetDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(targetDirectory);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.mdx')) // Filter only .mdx files
    .map((fileName) => {
      // Remove ".mdx" from file name to get id
      const slug = fileName.replace(/\.mdx$/, '');

      // Read markdown file as string
      const fullPath = path.join(targetDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Combine the data with the id
      return {
        slug,
        ...matterResult.data,
      };
    });

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getPostData(slug, locale = 'el') {
  const targetDirectory = locale === 'en' 
    ? path.join(postsDirectory, 'en') 
    : postsDirectory;
    
  const fullPath = path.join(targetDirectory, `${slug}.mdx`);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Post not found: ${slug} in ${locale}`);
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  return {
    slug,
    content: matterResult.content,
    ...matterResult.data,
  };
}
