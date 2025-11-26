export default function Home() {
  return (
    <div className="scroll-container">
      {/* Section 1: Hero */}
      <section id="hero" className="section hero-section">
        <div className="hero-content">
          <h1 className="hero-headline">
            Christos Kataxenos
          </h1>
          <p className="hero-description">
            Από τη διαχείριση δικτύων, στον σχεδιασμό λογισμικού. Με έδρα τη Στουτγκάρδη και ως φοιτητής Computer Science, εξελίσσω το τεχνικό μου υπόβαθρο σε δημιουργική γνώση. Στόχος μου είναι να συνδυάσω την εμπειρία των υποδομών με τον κώδικα, χτίζοντας γερές βάσεις για μια σύγχρονη καριέρα στο Software Development
          </p>
        </div>
        <div className="scroll-down-indicator">
          <span></span>
        </div>
      </section>

      {/* Section 2: Biography */}
      <section id="bio" className="section content-section">
        <div className="card-wrapper">
          <a href="https://bio.christoskataxenos.com" className="holographic-card card-bio">
            <div className="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            <span className="card-title">Biography</span>
          </a>
          <p className="code-caption">// Powered by caffeine and console.log</p>
        </div>
      </section>

      {/* Section 3: Dev Blog */}
      <section id="blog" className="section content-section">
        <div className="card-wrapper">
          <a href="https://blog.christoskataxenos.com" className="holographic-card card-blog">
            <div className="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
              </svg>
            </div>
            <span className="card-title">Dev Blog</span>
          </a>
          <p className="code-caption">// My brain dump. Mostly bugs, sometimes features.</p>
        </div>
      </section>

      {/* Section 4: Photography Portfolio */}
      <section id="portfolio" className="section content-section">
        <div className="card-wrapper">
          <a href="https://portfolio.christoskataxenos.com" className="holographic-card card-photo">
            <div className="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.776 48.776 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
            </div>
            <span className="card-title">Photography</span>
          </a>
          <p className="code-caption">// High resolution. Low stress.</p>
        </div>
      </section>

    </div>
  );
}