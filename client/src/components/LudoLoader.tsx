import { motion, type Variants } from 'framer-motion';
import { FaDiceD6 } from 'react-icons/fa';

const LudoLoader = () => {
  // Animation variants with proper typing
  const floatVariants: Variants = {
    slow: {
      y: [0, -20, 0],
      rotate: [0, 180, 360],
      transition: {
        duration: 6,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut'
      }
    },
    medium: {
      x: [0, 20, 0],
      rotate: [0, -180, -360],
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut'
      }
    },
    fast: {
      y: [0, -15, 15, 0],
      x: [0, 15, -15, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut'
      }
    }
  };

  const pulseVariants: Variants = {
    pulse: {
      opacity: [0.4, 0.6, 0.4],
      scale: [1, 1.05, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut'
      }
    }
  };

  const twinkleVariants: Variants = {
    twinkle: {
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut'
      }
    }
  };

  const bounceVariants: Variants = {
    bounce: {
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut'
      }
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Floating orbs for ambient effect */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-32 h-32 bg-purple-300 rounded-full opacity-20 top-10 left-10"
          variants={floatVariants}
          animate="slow"
        />
        <motion.div
          className="absolute w-24 h-24 bg-blue-300 rounded-full opacity-20 top-20 right-20"
          variants={floatVariants}
          animate="medium"
        />
        <motion.div
          className="absolute w-20 h-20 bg-pink-300 rounded-full opacity-20 bottom-20 left-20"
          variants={floatVariants}
          animate="fast"
        />
      </div>

      {/* Game board corners - responsive colored squares */}
      <motion.div
        className="absolute w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[140px] md:h-[140px] lg:w-[160px] lg:h-[160px] border-4 md:border-6 lg:border-8 border-emerald-500 top-[15%] left-[10%] md:top-[12%] md:left-[15%] rounded-2xl opacity-40 shadow-lg bg-emerald-50"
        variants={pulseVariants}
        animate="pulse"
      />
      
      <motion.div
        className="absolute w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[140px] md:h-[140px] lg:w-[160px] lg:h-[160px] border-4 md:border-6 lg:border-8 border-amber-500 bottom-[15%] right-[10%] md:bottom-[12%] md:right-[15%] rounded-2xl opacity-40 shadow-lg bg-amber-50"
        variants={pulseVariants}
        animate="pulse"
        initial={{ opacity: 0.4, scale: 1 }}
        transition={{ delay: 0.5 }}
      />
      
      <motion.div
        className="absolute w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[140px] md:h-[140px] lg:w-[160px] lg:h-[160px] border-4 md:border-6 lg:border-8 border-rose-500 top-[15%] right-[10%] md:top-[12%] md:right-[15%] rounded-2xl opacity-40 shadow-lg bg-rose-50"
        variants={pulseVariants}
        animate="pulse"
        initial={{ opacity: 0.4, scale: 1 }}
        transition={{ delay: 1 }}
      />
      
      <motion.div
        className="absolute w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[140px] md:h-[140px] lg:w-[160px] lg:h-[160px] border-4 md:border-6 lg:border-8 border-blue-500 bottom-[15%] left-[10%] md:bottom-[12%] md:left-[15%] rounded-2xl opacity-40 shadow-lg bg-blue-50"
        variants={pulseVariants}
        animate="pulse"
        initial={{ opacity: 0.4, scale: 1 }}
        transition={{ delay: 1.5 }}
      />
      
      {/* Central loading area */}
      <motion.div 
        className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 sm:p-10 md:p-12 shadow-2xl border border-white/50"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Rotating dice icon with glow effect */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="relative">
            <motion.div
              className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-50"
              animate={{
                opacity: [0.3, 0.5, 0.3],
                scale: [0.9, 1.1, 0.9]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse' as const,
                ease: 'easeInOut'
              }}
            />
            <motion.div
              className="relative text-5xl sm:text-6xl md:text-7xl text-blue-600"
              animate={{ rotate: 360 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear'
              }}
            >
              <FaDiceD6/>
            </motion.div>
          </div>
        </div>

        {/* Loading text with typing effect */}
        <div className="text-center">
          <motion.div
            className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3"
            animate={{
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse' as const,
              ease: 'easeInOut'
            }}
          >
            Loading Game...
          </motion.div>
          <div className="flex justify-center space-x-1">
            <motion.div
              className="w-2 h-2 bg-blue-500 rounded-full"
              variants={bounceVariants}
              animate="bounce"
            />
            <motion.div
              className="w-2 h-2 bg-purple-500 rounded-full"
              variants={bounceVariants}
              animate="bounce"
              transition={{ delay: 0.2 }}
            />
            <motion.div
              className="w-2 h-2 bg-pink-500 rounded-full"
              variants={bounceVariants}
              animate="bounce"
              transition={{ delay: 0.4 }}
            />
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6 sm:mt-8 w-48 sm:w-56 md:w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: 'reverse' as const,
              ease: 'easeInOut'
            }}
          />
        </div>
      </motion.div>

      {/* Subtle particles */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-1 h-1 bg-blue-400 rounded-full top-1/4 left-1/4"
          variants={twinkleVariants}
          animate="twinkle"
        />
        <motion.div
          className="absolute w-1 h-1 bg-purple-400 rounded-full top-1/3 right-1/3"
          variants={twinkleVariants}
          animate="twinkle"
          transition={{ delay: 1 }}
        />
        <motion.div
          className="absolute w-1 h-1 bg-pink-400 rounded-full bottom-1/4 left-1/3"
          variants={twinkleVariants}
          animate="twinkle"
          transition={{ delay: 2 }}
        />
        <motion.div
          className="absolute w-1 h-1 bg-emerald-400 rounded-full bottom-1/3 right-1/4"
          variants={twinkleVariants}
          animate="twinkle"
          transition={{ delay: 3 }}
        />
      </div>
    </div>
  );
};

export default LudoLoader;