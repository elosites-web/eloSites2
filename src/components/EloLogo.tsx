import React from 'react';

interface EloLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  taglineClassName?: string;
  onClick?: () => void;
}

export const EloLogo: React.FC<EloLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
  taglineClassName = '',
  onClick,
}) => {
  const heights = { sm: 'h-6', md: 'h-8', lg: 'h-10' }[size];
  const taglineSizes = {
    sm: 'text-[7px] min-[360px]:text-[7.5px]',
    md: 'text-[7.5px] min-[380px]:text-[8.5px]',
    lg: 'text-[9px] min-[380px]:text-[10px]',
  }[size];

  const imgElement = (
    <img
      src="/logo-elosites-final.png"
      alt="ēloSites — Logotipo Oficial"
      fetchPriority="high"
      className={`${heights} w-auto shrink-0 object-contain ${className}`}
    />
  );

  const content = showTagline ? (
    <div className="inline-flex flex-col items-start leading-tight">
      {imgElement}
      <span
        className={`font-semibold uppercase text-slate-400 select-none tracking-wider mt-0.5 ${taglineSizes} ${taglineClassName}`}
      >
        O melhor site pelo melhor preço
      </span>
    </div>
  ) : (
    imgElement
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1 -ml-1 transition-opacity hover:opacity-90 text-left flex items-center shrink-0 cursor-pointer"
        aria-label="ēloSites — Ir para a Página Inicial (Home)"
      >
        {content}
      </button>
    );
  }

  return content;
};
