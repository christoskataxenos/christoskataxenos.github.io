import fs from 'fs';
import path from 'path';
import PortfolioSection from '../../../components/PortfolioSection';

export const metadata = {
  title: 'Portfolio | Christos Kataxenos',
  description: 'Photography Portfolio of Christos Kataxenos',
};

function getPortfolioData() {
  const portfolioDir = path.join(process.cwd(), 'public', 'images', 'portfolio');
  
  if (!fs.existsSync(portfolioDir)) {
    return [];
  }

  const folders = fs.readdirSync(portfolioDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const portfolioData = folders.map(folder => {
    const folderPath = path.join(portfolioDir, folder);
    const files = fs.readdirSync(folderPath)
      .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file));

    const title = folder
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      id: folder,
      title: title,
      images: files.map(file => `/images/portfolio/${folder}/${file}`)
    };
  });

  return portfolioData.filter(category => category.images.length > 0);
}

export default function EnPortfolioPage() {
  const categories = getPortfolioData();
  
  return (
    <main>
      <h1 className="hero-headline">Portfolio</h1>
      <PortfolioSection categories={categories} />
    </main>
  );
}
