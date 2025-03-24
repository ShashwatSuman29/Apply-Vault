import { motion } from "framer-motion";

const paths = [
  "M 0 0 L 100 0 L 100 100 L 0 100 Z",
  "M 50 0 L 100 50 L 50 100 L 0 50 Z",
  "M 25 0 C 40 0 50 35 50 50 C 50 65 40 100 25 100 C 10 100 0 65 0 50 C 0 35 10 0 25 0",
];

const pathColors = [
  "stroke-violet-500",
  "stroke-indigo-500",
  "stroke-fuchsia-500",
];

export function BackgroundPaths() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0"
      >
        <svg
          className="absolute h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {paths.map((path, index) => (
            <motion.path
              key={index}
              d={path}
              className={`fill-none ${pathColors[index]} opacity-20 dark:opacity-10`}
              strokeWidth="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 2,
                delay: index * 0.5,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </svg>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-br from-violet-100/30 via-transparent to-indigo-100/30 dark:from-violet-900/30 dark:to-indigo-900/30" />
      <div className="absolute inset-0 backdrop-blur-[1px]" />
    </div>
  );
} 