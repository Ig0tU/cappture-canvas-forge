
import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuLink {
  title: string;
  url: string;
}

interface GradientMenuButtonProps {
  links: MenuLink[];
}

const GradientMenuButton: React.FC<GradientMenuButtonProps> = ({ links }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleClick = () => {
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
      setIsOpen(!isOpen);
    }, 300);
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={cn(
          "px-4 py-2 rounded-md font-medium text-white bg-gradient-to-r from-blue-500 to-white transition-all",
          isShaking && "animate-[shake_0.3s_ease-in-out]"
        )}
        style={{ 
          backgroundSize: '200% auto',
          backgroundPosition: 'left center' 
        }}
      >
        Menu
      </button>

      {isOpen && (
        <div className="absolute mt-2 z-50 w-48 bg-card border border-border rounded-md shadow-lg overflow-hidden animate-fade-in">
          <ul>
            {links.map((link, index) => (
              <li key={index} className="border-b border-border last:border-0">
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-2 text-sm hover:bg-secondary transition-colors"
                >
                  {link.title}
                  <ExternalLink size={14} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GradientMenuButton;
