
import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  const shapes = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 60 + 20,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  const lensFlares = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    size: Math.random() * 200 + 100,
    x: Math.random() * 100,
    y: Math.random() * 100,
    opacity: Math.random() * 0.5 + 0.2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Lens flares */}
      {lensFlares.map((flare) => (
        <motion.div
          key={`flare-${flare.id}`}
          className="absolute rounded-full mix-blend-screen filter blur-xl"
          style={{
            width: flare.size,
            height: flare.size,
            left: `${flare.x}%`,
            top: `${flare.y}%`,
            background: `radial-gradient(circle at center, 
              rgba(249, 115, 22, ${flare.opacity}),
              rgba(0, 150, 136, ${flare.opacity * 0.5}),
              transparent)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [flare.opacity, flare.opacity * 1.5, flare.opacity],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Original animated shapes */}
      {shapes.map((shape) => (
        <motion.div
          key={`shape-${shape.id}`}
          className="absolute rounded-full mix-blend-screen filter blur-sm"
          style={{
            width: shape.size,
            height: shape.size,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            background: `radial-gradient(circle at center, 
              ${shape.id % 2 === 0 ? '#F97316' : '#009688'}80,
              transparent)`,
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            delay: shape.delay,
            ease: "linear"
          }}
        />
      ))}

      {/* Additional lens flare streaks */}
      <motion.div
        className="absolute w-[300px] h-[2px] blur-md"
        style={{
          background: "linear-gradient(90deg, transparent, #F97316, transparent)",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%) rotate(45deg)",
        }}
        animate={{
          opacity: [0.2, 0.5, 0.2],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
