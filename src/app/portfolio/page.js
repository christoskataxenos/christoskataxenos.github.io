import fs from 'fs';
import path from 'path';
import PortfolioSection from '../../components/PortfolioSection';

export const metadata = {
  title: 'Portfolio | Christos Kataxenos',
  description: 'Photography Portfolio of Christos Kataxenos',
};

// Αυτή η συνάρτηση τρέχει αποκλειστικά στον Server.
// Διαβάζει δυναμικά τους φακέλους σου. Όταν φτιάχνεις νέο φάκελο, 
// εμφανίζεται αυτόματα ως νέος κόμβος (node) στο portfolio!
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

    // Μετατροπή του ονόματος φακέλου σε Τίτλο (π.χ. american-football -> American Football)
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

  // Επιστρέφει μόνο κατηγορίες που έχουν έστω 1 φωτογραφία
  return portfolioData.filter(category => category.images.length > 0);
}

export default function PortfolioPage() {
  const categories = getPortfolioData();
  
  return <PortfolioSection categories={categories} />;
}
