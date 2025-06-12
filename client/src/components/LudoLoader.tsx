import { motion } from "framer-motion";
import { FaDiceFive } from "react-icons/fa";

const LudoLoader = () => {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-green-100 flex flex-col justify-center items-center relative overflow-hidden">
      <div className="absolute w-[300px] h-[300px] border-8 border-green-500 top-10 left-10 rounded-lg opacity-30" />
      <div className="absolute w-[300px] h-[300px] border-8 border-yellow-500 bottom-10 right-10 rounded-lg opacity-30" />
      <div className="absolute w-[300px] h-[300px] border-8 border-red-500 top-10 right-10 rounded-lg opacity-30" />
      <div className="absolute w-[300px] h-[300px] border-8 border-blue-500 bottom-10 left-10 rounded-lg opacity-30" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="text-6xl text-blue-700 mb-4"
      >
        <FaDiceFive />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="text-xl font-semibold text-gray-800"
      >
        Loading Ludo Game...
      </motion.div>
    </div>
  );
};

export default LudoLoader;
