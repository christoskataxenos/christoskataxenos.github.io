'use client';

import Link from 'next/link';
import { GitHubIcon, LinkedInIcon, InstagramIcon } from './Icons';

export default function SocialLinks() {
  return (
    <div className="social-links">
      <Link href="https://github.com/christosk8926" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
        <GitHubIcon className="social-icon" />
      </Link>
      <Link href="https://www.linkedin.com/in/christos-kataxenos-4b57a586" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
        <LinkedInIcon className="social-icon" />
      </Link>
      <Link href="https://www.instagram.com/christoskataxenos/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
        <InstagramIcon className="social-icon" />
      </Link>

      <style jsx>{`
        .social-links {
          position: fixed;
          left: 2rem;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          z-index: 999;
        }

        @media (max-width: 1280px) {
          .social-links {
            display: none;
          }
        }

        .social-links a {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 36px;
          height: 36px;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 50%;
          border: 1px solid rgba(127, 90, 240, 0.1);
          transition: all 0.3s ease;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        }

        .social-links a:hover {
          background-color: rgba(127, 90, 240, 0.2);
          border-color: rgba(127, 90, 240, 0.6);
          box-shadow: 0 0 20px rgba(127, 90, 240, 0.5);
          transform: translateY(-3px);
        }

        .social-icon {
          color: #94a1b2; /* text-secondary */
          width: 20px;
          height: 20px;
          transition: color 0.3s ease;
        }

        .social-links a:hover .social-icon {
          color: #7f5af0; /* accent-purple */
        }
      `}</style>
    </div>
  );
}
