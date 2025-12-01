'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { FaHeart, FaRegHeart, FaShareAlt, FaTwitter, FaLinkedin } from 'react-icons/fa';

// Tooltip component (reused logic)
const Tooltip = ({ children, text }) => {
  return (
    <div className="group relative flex items-center">
      <span
        className="absolute right-full mr-2 scale-0 rounded bg-gray-800 p-2 text-xs text-white 
                   transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 opacity-0 whitespace-nowrap"
      >
        {text}
      </span>
      {children}
    </div>
  );
};

export default function InteractionDock({ title }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Ensure client-side rendering
  useEffect(() => {
    setMounted(true);
    // Check local storage for like status
    const storageKey = `like-${pathname}`;
    const isLiked = localStorage.getItem(storageKey) === 'true';
    setLiked(isLiked);
  }, [pathname]);

  if (!mounted) return null;

  const handleLike = () => {
    const storageKey = `like-${pathname}`;
    const newStatus = !liked;
    setLiked(newStatus);
    localStorage.setItem(storageKey, newStatus.toString());
    
    // Optional: Add haptic feedback if on mobile
    if (navigator.vibrate) navigator.vibrate(50);
  };

  const handleShare = async () => {
    const shareData = {
      title: title || 'Christos Kataxenos Blog',
      text: 'Check out this article!',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard or show menu
      setShowShareMenu(!showShareMenu);
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(`Check out "${title}" by Christos Kataxenos`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareLinkedin = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  return (
    <aside className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center gap-6">
      
      {/* Dock Container */}
      <div className="flex flex-col items-center gap-4 px-3 py-6 rounded-full 
                      bg-black/50 backdrop-blur-md border border-white/10 
                      shadow-lg shadow-purple-500/10">
        
        {/* Like Button */}
        <Tooltip text={liked ? "Liked!" : "Like"}>
          <button 
            onClick={handleLike}
            className="hover:scale-110 transition-transform duration-200 p-2 rounded-full"
            aria-label="Like post"
          >
            {liked ? (
              <FaHeart size={22} className="text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            ) : (
              <FaRegHeart size={22} className="text-gray-400 hover:text-red-400 transition-colors" />
            )}
          </button>
        </Tooltip>

        <div className="w-4 h-[1px] bg-gray-700/50"></div>

        {/* Share Button (Main) */}
        <Tooltip text="Share">
          <button 
            onClick={handleShare}
            className="hover:scale-110 transition-transform duration-200 p-2 rounded-full group"
            aria-label="Share post"
          >
            <FaShareAlt size={20} className="text-gray-400 group-hover:text-cyan-400 transition-colors" />
          </button>
        </Tooltip>

        {/* Extra Social Shares (Visible if no native share or just always visible for desktop convenience) */}
        <div className="flex flex-col gap-4 pt-2">
            <Tooltip text="Tweet">
                <button onClick={shareTwitter} className="hover:scale-110 transition-transform duration-200 p-1">
                    <FaTwitter size={18} className="text-gray-500 hover:text-[#1DA1F2]" />
                </button>
            </Tooltip>
            <Tooltip text="Post">
                <button onClick={shareLinkedin} className="hover:scale-110 transition-transform duration-200 p-1">
                    <FaLinkedin size={18} className="text-gray-500 hover:text-[#0A66C2]" />
                </button>
            </Tooltip>
        </div>

      </div>
    </aside>
  );
}
