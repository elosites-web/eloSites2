import React, { useRef, useState, useEffect } from 'react';
import { useReducedMotion } from 'motion/react';
import { shouldReduceMedia } from '../mediaPrefs';

interface Interactive3DCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const Interactive3DCard: React.FC<Interactive3DCardProps> = ({
  children,
  className = '',
  maxTilt = 2.5,
  glare = true,
  style = {},
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const rafIdRef = useRef<number | null>(null);

  const systemPrefersReduced = useReducedMotion();
  const prefersReduced = Boolean(systemPrefersReduced || shouldReduceMedia());

  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // Evita tilt em dispositivos de toque puro ou caso haja preferência por redução de movimento
    if (prefersReduced || e.pointerType === 'touch') return;
    const card = cardRef.current;
    if (!card) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = requestAnimationFrame(() => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Movimento suave com ângulo reduzido para evitar tremores e sensibilidade a labirintite
      const rotateX = Number((((y - centerY) / centerY) * -maxTilt).toFixed(2));
      const rotateY = Number((((x - centerX) / centerX) * maxTilt).toFixed(2));

      setTilt({ x: rotateX, y: rotateY });
      if (glare) {
        setGlarePos({
          x: Math.round((x / rect.width) * 100),
          y: Math.round((y / rect.height) * 100),
          opacity: 0.14,
        });
      }
    });
  };

  const handlePointerLeave = () => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    setTilt({ x: 0, y: 0 });
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative rounded-2xl transition-transform duration-500 ease-out will-change-transform ${className}`}
      style={{
        transform: prefersReduced
          ? undefined
          : `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transformStyle: 'preserve-3d',
        ...style,
      }}
    >
      {children}

      {/* Brilho especular suave acompanhando o cursor */}
      {glare && !prefersReduced && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-500 z-20 overflow-hidden"
          style={{
            background: `radial-gradient(circle 260px at ${glarePos.x}% ${glarePos.y}%, rgba(129, 140, 248, ${glarePos.opacity}), transparent 75%)`,
            opacity: glarePos.opacity,
          }}
        />
      )}
    </div>
  );
};
