/**
 * Language Context
 * Σκοπός: Διαχείριση πολυγλωσσικότητας (English/Greek) σε όλη την εφαρμογή.
 * Λειτουργία: Παροχή μεταφράσεων, αποθήκευση προτίμησης στο localStorage, αυτόματος εντοπισμός γλώσσας από το URL στα blogs.
 * Δεδομένα: translations object, language state.
 */
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const LanguageContext = createContext();

// ... (translations stay the same) ...
// (I will keep the translations as they are but I'll only show the relevant parts in TargetContent)


const translations = {
  en: {
    heroDescription: "Bridging networks and software engineering. As a Computer Science student (HOU) based in Stuttgart with years of global IT support experience, I combine infrastructure expertise with modern code. My travels have shaped my adaptability and systemic problem-solving skills, building resilient foundations for Software Development.",
    bioTitle: "Biography",
    bioCaption: "// System: ONLINE. CV and portfolio core data stream.",
    blogTitle: "Dev Blog",
    blogCaption: "// Technical log. Software documentation and concepts.",
    photoTitle: "Photography",
    photoCaption: "// Photography log. Visual indexing.",
    // Bio Section Translations
    experienceTitle: "Professional Experience",
    educationTitle: "Education",
    skillsTitle: "Skills",
    roles: {
      researchDev: {
        title: "Software Research & Development",
        date: "2024 - Present • GitHub Highlights",
        description: "Building custom automation tools, integrating AI features, and streamlining data pipelines.",
        projectsLabel: "Key Projects:",
        projects: [
          { name: "Papatzis Spotter", desc: "Code forensics tool using AST and Jaccard similarity to analyze code locally, without AI.", url: "https://github.com/christoskataxenos/papatzis-spotter" },
          { name: "Video-to-ML Suite", desc: "Automated pipeline for extracting and processing raw video into ready-to-use ML datasets.", url: "https://github.com/christoskataxenos/video-to-ml-suite" },
          { name: "Habit Tracker WebApp", desc: "Fullstack web app designed to help users effectively track and build their daily habits.", url: "https://github.com/christoskataxenos/habit-tracker-webapp" }
        ]
      },
      technician: {
        title: "Network and Computer Technician (Freelancer)",
        dateLocation: "2007 - Present • Remote/Client Sites",
        responsibilities: "Responsibilities:",
        responsibilitiesList: [
          "Network setup & administration",
          "Hardware & software troubleshooting",
          "Direct client support & consulting"
        ],
        skillsLabel: "Skills:",
        skillsList: [
          "TCP/IP, DNS, DHCP",
          "Windows Server, Linux",
          "Hardware diagnostics"
        ],
        achievementsLabel: "Achievements:",
        achievementsList: [
          "Improved network uptime by 15%",
          "Reduced support tickets by 10%"
        ]
      },
      security: {
        title: "Security Systems Technician",
        date: "2014 - 2018",
        description: "Installation, maintenance, and comprehensive technical support for CCTV and security alarm networks."
      }
    },
    education: {
      university: "Hellenic Open University",
      degree: "Informatics (BSc)",
      iek: "IEK Rhodes",
      iekDegree: "Computer and Network Technician"
    },
    skillGroups: {
      softwareAI: {
        title: "Software Engineering & AI",
        skills: [
          { label: "PYTHON FULLSTACK", level: "Production Ready", width: "90%" },
          { label: "SOFTWARE ORCHESTRATION", level: "Production Ready", width: "90%" },
          { label: "ADVANCED PROMPT DESIGN", level: "Production Ready", width: "95%" },
          { label: "AI & AGENTIC SYSTEMS", level: "Intermediate", width: "70%" }
        ]
      },
      frontend: {
        title: "Frontend & UI",
        skills: [
          { label: "REACT / NEXT.JS", level: "Production Ready", width: "85%" },
          { label: "CSS / TAILWIND", level: "Production Ready", width: "90%" }
        ]
      },
      infrastructure: {
        title: "Infrastructure",
        skills: [
          { label: "NETWORKING", level: "Production Ready", width: "90%" },
          { label: "HARDWARE & SYSTEMS", level: "Production Ready", width: "90%" }
        ]
      },
      backendLegacy: {
        title: "CS Fundamentals",
        skills: [
          { label: "C / C++ / C#", level: "Loading...", width: "33%" }
        ]
      }
    },
    interestsTitle: "Interests",
    interests: [
      { title: "PHOTOGRAPHY", body: "Capturing moments, street photography, landscapes." },
      { title: "GAMING", body: "RPG, strategy, simulation, VR experiences." },
      { title: "TRAVELLING", body: "Exploring new cultures, roadtrips, documentation." },
      { title: "CUSTOM PCs & SERVERS", body: "PC building, hardware tweaking, server setups." }
    ]
  },
  el: {
    heroDescription: "Από τα Δίκτυα στη Μηχανική Λογισμικού. Συνδυάζω την πολυετή παγκόσμια εμπειρία στο IT support με την ανάπτυξη σύγχρονου κώδικα. Ως φοιτητής Πληροφορικής στο ΕΑΠ, με βάση τη Στουτγκάρδη, αξιοποιώ την προσαρμοστικότητα από τα ταξίδια μου για να δίνω συστημικές λύσεις, χτίζοντας ανθεκτικές βάσεις στο Software Development.",
    bioTitle: "Βιογραφικό",
    bioCaption: "// System: ONLINE. Ροή δεδομένων βιογραφικού.",
    blogTitle: "Dev Blog",
    blogCaption: "// Τεχνικό ημερολόγιο. Τεκμηρίωση λογισμικού και ιδεών.",
    photoTitle: "Φωτογραφία",
    photoCaption: "// Φωτογραφικό αρχείο. Οπτικό ευρετήριο.",
    // Bio Section Translations
    experienceTitle: "Επαγγελματική Εμπειρία",
    educationTitle: "Εκπαίδευση",
    skillsTitle: "Δεξιότητες",
    roles: {
      researchDev: {
        title: "Software Research & Development",
        date: "2024 - Σήμερα • GitHub Highlights",
        description: "Ανάπτυξη custom εργαλείων και αυτοματισμών, με έμφαση στην ενσωμάτωση AI και την επεξεργασία δεδομένων.",
        projectsLabel: "Κύρια Projects:",
        projects: [
          { name: "Papatzis Spotter", desc: "Εργαλείο ανάλυσης κώδικα (code forensics) με αλγορίθμους AST και Jaccard, εντελώς offline (χωρίς AI).", url: "https://github.com/christoskataxenos/papatzis-spotter" },
          { name: "Video-to-ML Suite", desc: "Αυτοματοποιημένη ροή εξαγωγής δεδομένων από raw video, δημιουργώντας έτοιμα datasets για ML.", url: "https://github.com/christoskataxenos/video-to-ml-suite" },
          { name: "Habit Tracker WebApp", desc: "Fullstack web app παραγωγικότητας, σχεδιασμένο για να χτίζεις και να παρακολουθείς τις συνήθειές σου.", url: "https://github.com/christoskataxenos/habit-tracker-webapp" }
        ]
      },
      technician: {
        title: "Τεχνικός Δικτύων και Η/Υ (Freelancer)",
        dateLocation: "2007 - Σήμερα • Απομακρυσμένα/Σε πελάτες",
        responsibilities: "Αρμοδιότητες:",
        responsibilitiesList: [
          "Στήσιμο και διαχείριση δικτύων",
          "Αντιμετώπιση τεχνικών προβλημάτων (hardware/software)",
          "Άμεση υποστήριξη και καθοδήγηση πελατών"
        ],
        skillsLabel: "Δεξιότητες:",
        skillsList: [
          "TCP/IP, DNS, DHCP",
          "Windows Server, Linux",
          "Διάγνωση hardware"
        ],
        achievementsLabel: "Επιτεύγματα:",
        achievementsList: [
          "Βελτίωση uptime δικτύου κατά 15%",
          "Μείωση αιτημάτων υποστήριξης κατά 10%"
        ]
      },
      security: {
        title: "Τεχνικός Συστημάτων Ασφαλείας",
        date: "2014 - 2018",
        description: "Μελέτη, εγκατάσταση και τεχνική υποστήριξη σε συστήματα ασφαλείας, κάμερες παρακολούθησης και δίκτυα συναγερμών."
      }
    },
    education: {
      university: "Ελληνικό Ανοικτό Πανεπιστήμιο",
      degree: "Πληροφορική (BSc)",
      iek: "ΙΕΚ Ρόδου",
      iekDegree: "Τεχνικός ηλεκτρονικών υπολογιστών και δικτύων"
    },
    skillGroups: {
      softwareAI: {
        title: "Software Engineering & AI",
        skills: [
          { label: "PYTHON FULLSTACK", level: "Production Ready", width: "90%" },
          { label: "SOFTWARE ORCHESTRATION", level: "Production Ready", width: "90%" },
          { label: "ADVANCED PROMPT DESIGN", level: "Production Ready", width: "95%" },
          { label: "AI & AGENTIC SYSTEMS", level: "Intermediate", width: "70%" }
        ]
      },
      frontend: {
        title: "Frontend & UI",
        skills: [
          { label: "REACT / NEXT.JS", level: "Production Ready", width: "85%" },
          { label: "CSS / TAILWIND", level: "Production Ready", width: "90%" }
        ]
      },
      infrastructure: {
        title: "Υποδομές",
        skills: [
          { label: "NETWORKING", level: "Production Ready", width: "90%" },
          { label: "HARDWARE & SYSTEMS", level: "Production Ready", width: "90%" }
        ]
      },
      backendLegacy: {
        title: "Θεμέλια Πληροφορικής",
        skills: [
          { label: "C / C++ / C#", level: "Loading...", width: "33%" }
        ]
      }
    },
    interestsTitle: "Ενδιαφέροντα",
    interests: [
      { title: "ΦΩΤΟΓΡΑΦΙΑ", body: "Απαθανάτιση στιγμών, φωτογραφία δρόμου, τοπία." },
      { title: "GAMING", body: "RPG, παιχνίδια στρατηγικής, εξομοιωτές, εμπειρίες VR." },
      { title: "ΤΑΞΙΔΙΑ", body: "Εξερεύνηση νέων πολιτισμών, roadtrips, καταγραφή." },
      { title: "CUSTOM PCs & SERVERS", body: "Συναρμολόγηση υπολογιστών, βελτιστοποίηση hardware, στήσιμο servers." }
    ]
  }
};

export function LanguageProvider({ children }) {
  const pathname = usePathname();
  const [language, setLanguage] = useState('en');

  // Effect to load language preference from localStorage on mount
  useEffect(() => {
    const storedLang = localStorage.getItem('languagePreference');
    if (storedLang && (storedLang === 'en' || storedLang === 'el')) {
      setLanguage(storedLang);
    } else {
      setLanguage('en');
    }
  }, []);

  // Force language based on URL path (specific for blog)
  useEffect(() => {
    if (!pathname) return;

    if (pathname.startsWith('/en/blog')) {
      if (language !== 'en') setLanguage('en');
    } else if (pathname.startsWith('/blog')) {
      if (language !== 'el') setLanguage('el');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Effect to save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('languagePreference', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'el' : 'en'));
  };

  const t = translations[language] || translations.en;

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}