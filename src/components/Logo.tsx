import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'full', className = '' }) => {
  if (variant === 'icon') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 25 38" className="w-5 h-7 fill-white">
          <path d="M2.956 11.425c1.236 0 2.239-1 2.239-2.235a2.237 2.237 0 0 0-2.24-2.236A2.237 2.237 0 0 0 .718 9.19a2.237 2.237 0 0 0 2.239 2.235Zm0 19.372c1.236 0 2.239-1 2.239-2.235a2.237 2.237 0 0 0-2.24-2.235c-1.236 0-2.238 1-2.238 2.235a2.237 2.237 0 0 0 2.239 2.235Zm19.402-19.372c1.237 0 2.24-1 2.24-2.235a2.237 2.237 0 0 0-2.24-2.236A2.237 2.237 0 0 0 20.12 9.19a2.237 2.237 0 0 0 2.238 2.235Zm0 19.372c1.237 0 2.24-1 2.24-2.235a2.237 2.237 0 0 0-2.24-2.235c-1.236 0-2.238 1-2.238 2.235a2.237 2.237 0 0 0 2.238 2.235Zm-9.701-8.196a3.728 3.728 0 0 0 3.732-3.725 3.728 3.728 0 0 0-3.732-3.726 3.728 3.728 0 0 0-3.731 3.726 3.728 3.728 0 0 0 3.731 3.725Zm0-17.137a2.61 2.61 0 0 0 2.612-2.608A2.61 2.61 0 0 0 12.657.248a2.61 2.61 0 0 0-2.612 2.608 2.61 2.61 0 0 0 2.612 2.608Zm0 32.039a2.61 2.61 0 0 0 2.612-2.608 2.61 2.61 0 0 0-2.612-2.607 2.61 2.61 0 0 0-2.612 2.607 2.61 2.61 0 0 0 2.612 2.608Z" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Icon cluster */}
      <svg viewBox="0 0 16 25" className="w-4 h-6 fill-white shrink-0">
        <circle cx="1.5" cy="6" r="1.5" />
        <circle cx="1.5" cy="19" r="1.5" />
        <circle cx="14.5" cy="6" r="1.5" />
        <circle cx="14.5" cy="19" r="1.5" />
        <circle cx="8" cy="12.5" r="2.5" />
        <circle cx="8" cy="1.75" r="1.75" />
        <circle cx="8" cy="23.25" r="1.75" />
      </svg>
      {/* Wordmark typography */}
      <span className="text-xl font-bold tracking-tight text-white font-['Poppins',sans-serif]">
        Skill<span className="text-[#3d9be9]">Space</span>
      </span>
    </div>
  );
};
