import React from 'react';

interface EloLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const EloLogo: React.FC<EloLogoProps> = ({ className = '', size = 'md' }) => {
  const heights = { sm: 'h-6', md: 'h-8', lg: 'h-10' }[size];
  return (
    <img
      src="/logo-elosites-final.png"
      alt="ēloSites — Logotipo Oficial"
      fetchPriority="high"
      className={`${heights} w-auto shrink-0 object-contain ${className}`}
    />
  );
};
