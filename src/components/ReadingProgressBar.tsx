import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

interface ReadingProgressBarProps {
  currentScreen?: string;
}

/**
 * Barra fina de progresso de leitura no topo da página
 * Acompanha a rolagem vertical de cada tela com animação suave e efeito luminoso neon.
 */
export const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({ currentScreen }) => {
  const { scrollYProgress } = useScroll();

  // Mola para suavizar a aceleração e desaceleração do scroll
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  const [hasScrolled, setHasScrolled] = useState(false);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    // Atualiza estado inicial
    const initialVal = scrollYProgress.get();
    setHasScrolled(initialVal > 0.005);
    setPercent(Math.round(initialVal * 100));

    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setHasScrolled(latest > 0.005);
      setPercent(Math.round(latest * 100));
    });

    return () => unsubscribe();
  }, [scrollYProgress, currentScreen]);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none h-[3px] bg-white/[0.04] backdrop-blur-[1px]"
      role="progressbar"
      aria-label="Progresso de leitura da página"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className={`h-full w-full origin-left bg-gradient-to-r from-indigo-500 via-indigo-400 to-cyan-400 relative transition-opacity duration-200 ${
          hasScrolled
            ? 'opacity-100 shadow-[0_0_12px_rgba(99,102,241,0.85),0_0_6px_rgba(34,211,238,0.75)]'
            : 'opacity-0'
        }`}
        style={{ scaleX }}
      >
        {/* Ponto de luz no ápice da barra de progresso para dinamismo visual */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-200 blur-[0.5px] shadow-[0_0_8px_#38bdf8,0_0_14px_#818cf8]" />
      </motion.div>
    </div>
  );
};
