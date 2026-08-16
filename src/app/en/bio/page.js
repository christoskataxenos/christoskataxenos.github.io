import BioSection from '../../../components/BioSection';

export const metadata = {
  title: 'Bio | Christos Kataxenos',
  description: 'Christos Kataxenos - Biography and CV',
};

export default function EnBioPage() {
  return (
    <main>
      <h1 className="hero-headline">Bio</h1>
      <BioSection />
    </main>
  );
}
