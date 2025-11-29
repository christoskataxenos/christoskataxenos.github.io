'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    heroDescription: "From network management to software design. Based in Stuttgart as a Computer Science student, I am evolving my technical background into creative knowledge. My goal is to combine infrastructure experience with code, building strong foundations for a modern career in Software Development.",
    bioTitle: "Biography",
    bioCaption: "// Powered by caffeine and console.log",
    blogTitle: "Dev Blog",
    blogCaption: "// My brain dump. Mostly bugs, sometimes features.",
    photoTitle: "Photography",
    photoCaption: "// High resolution. Low stress.",
    // Bio Section Translations
    experienceTitle: "Professional Experience",
    educationTitle: "Education",
    skillsTitle: "Skills",
    roles: {
      technician: {
        title: "Network and Computer Technician (Freelancer)",
        dateLocation: "2007 - Present • Remote/Client Sites",
        responsibilities: "Responsibilities:",
        responsibilitiesList: [
          "System administration",
          "Network setup/support",
          "Hardware/software troubleshooting",
          "Client consultation"
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
        description: "Installation, maintenance, fault diagnosis, and technical support for alarm and security camera systems."
      },
      seniorDev: {
        title: "Senior Developer",
        date: "2023 - Present",
        description: "Leading frontend architecture and cyberpunk UI implementation."
      }
    },
    education: {
      university: "Hellenic Open University",
      degree: "Informatics (BSc)",
      iek: "IEK Rhodes",
      iekDegree: "Computer and Network Technician"
    },
    skillGroups: {
      frontend: {
        title: "Frontend & UI",
        skills: [
          { label: "REACT / NEXT.JS", level: "Exploring", width: "15%" },
          { label: "CSS / TAILWIND", level: "Exploring", width: "20%" }
        ]
      },
      backend: {
        title: "Backend",
        skills: [
          { label: "PYTHON", level: "Intermediate", width: "50%" },
          { label: "C LANGUAGE", level: "Loading...", width: "33%" }
        ]
      },
      infrastructure: {
        title: "Infrastructure",
        skills: [
          { label: "NETWORKING", level: "Production Ready", width: "95%" },
          { label: "HARDWARE & SYSTEMS", level: "Production Ready", width: "100%" }
        ]
      },
      interestsTitle: "Interests",
      interests: [
        "PHOTOGRAPHY",
        "GAMING",
        "TRAVELLING",
        "CUSTOM RIGS & SERVERS"
      ]
    }
  },
  el: {
    heroDescription: "Από τη διαχείριση δικτύων, στον σχεδιασμό λογισμικού. Με έδρα τη Στουτγκάρδη και ως φοιτητής Computer Science, εξελίσσω το τεχνικό μου υπόβαθρο σε δημιουργική γνώση. Στόχος μου είναι να συνδυάσω την εμπειρία των υποδοδομών με τον κώδικα, χτίζοντας γερές βάσεις για μια σύγχρονη καριέρα στο Software Development.",
    bioTitle: "Βιογραφικό",
    bioCaption: "// Με καύσιμο καφεΐνη και console.log",
    blogTitle: "Dev Blog",
    blogCaption: "// Οι σκέψεις μου. Κυρίως bugs, σπάνια features.",
    photoTitle: "Φωτογραφία",
    photoCaption: "// Υψηλή ανάλυση. Χαμηλό άγχος.",
    // Bio Section Translations
    experienceTitle: "Επαγγελματική Εμπειρία",
    educationTitle: "Εκπαίδευση",
    skillsTitle: "Δεξιότητες",
    roles: {
      technician: {
        title: "Τεχνικός Δικτύων και Η/Υ (Freelancer)",
        dateLocation: "2007 - Σήμερα • Απομακρυσμένα/Σε πελάτες",
        responsibilities: "Αρμοδιότητες:",
        responsibilitiesList: [
          "Διαχείριση συστημάτων",
          "Εγκατάσταση/υποστήριξη δικτύων",
          "Διάγνωση βλαβών hardware/software",
          "Συμβουλευτική πελατών"
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
        description: "Εγκατάσταση, συντήρηση, διάγνωση βλαβών και τεχνική υποστήριξη για συστήματα συναγερμού και κάμερες ασφαλείας."
      },
      seniorDev: {
        title: "Senior Developer",
        date: "2023 - Σήμερα",
        description: "Ηγεσία frontend αρχιτεκτονικής και υλοποίηση cyberpunk UI."
      }
    },
    education: {
      university: "Ελληνικό Ανοικτό Πανεπιστήμιο",
      degree: "Πληροφορική (BSc)",
      iek: "ΙΕΚ Ρόδου",
      iekDegree: "Τεχνικός ηλεκτρονικών υπολογιστών και δικτύων"
    },
    skillGroups: {
      frontend: {
        title: "Frontend & UI",
        skills: [
          { label: "REACT / NEXT.JS", level: "Exploring", width: "15%" },
          { label: "CSS / TAILWIND", level: "Exploring", width: "20%" }
        ]
      },
      backend: {
        title: "Backend",
        skills: [
          { label: "PYTHON", level: "Intermediate", width: "50%" },
          { label: "ΓΛΩΣΣΑ C", level: "Loading...", width: "33%" }
        ]
      },
      infrastructure: {
        title: "Υποδομές",
        skills: [
          { label: "NETWORKING", level: "Production Ready", width: "95%" },
          { label: "HARDWARE & SYSTEMS", level: "Production Ready", width: "100%" }
        ]
      }
    },
    interestsTitle: "Ενδιαφέροντα",
    interests: [
      "ΦΩΤΟΓΡΑΦΙΑ",
      "GAMING",
      "ΤΑΞΙΔΙΑ",
      "CUSTOM PCs & SERVERS"
    ]
  }
};

export function LanguageProvider({ children }) {
  // Default to English if no language is set
  const [language, setLanguage] = useState('en');

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
