import { Link } from 'react-router-dom';
import { Briefcase, CheckCircle, Shield, Zap,} from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ThemeToggle } from '../components/ThemeToggle';
import { BackgroundPaths } from '../components/ui/background-paths';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const featureCardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5
    }
  }
};

function LandingPage() {
  const [featuresRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md border-b border-teal-100 dark:border-teal-500/10 fixed w-full z-[100]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 sm:h-16">
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Briefcase className="h-6 w-6 sm:h-8 sm:w-8 text-teal-600 dark:text-teal-400" />
              <span className="ml-2 text-lg sm:text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">ApplyVault</span>
            </motion.div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 dark:from-teal-400 dark:to-cyan-400 dark:hover:from-teal-300 dark:hover:to-cyan-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-slate-900 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative pt-24 sm:pt-32 pb-20 overflow-hidden"
      >
        <BackgroundPaths />

        {/* Content Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-left space-y-8">
              <motion.h1
                variants={itemVariants}
                className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight"
              >
                <span className="block text-slate-800 dark:text-white">Track Your Job Search</span>
                <span className="block bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent mt-2">All in One Place</span>
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-slate-600 dark:text-slate-300 text-lg sm:text-xl max-w-xl"
              >
                Streamline your job search process with ApplyVault. Keep track of applications, credentials, and progress in a secure, organized way.
              </motion.p>
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-full text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 shadow-lg hover:shadow-teal-500/25 transition-all duration-200"
                >
                  Get Started
                </Link>
              </motion.div>
            </div>

            {/* Right Column - Decorative Elements */}
            <div className="relative hidden lg:block">
              <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
                <div className="relative">
                  {/* Decorative square */}
                  <div className="absolute -top-20 -left-20 w-40 h-40 bg-teal-200/30 dark:bg-teal-500/20 rounded-3xl transform rotate-12" />
                  {/* Decorative circle */}
                  <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-cyan-200/40 dark:bg-cyan-500/20 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 sm:-top-40 -right-16 sm:-right-32 w-48 sm:w-96 h-48 sm:h-96 rounded-full bg-gradient-to-br from-teal-400/20 to-cyan-500/20 dark:from-teal-500/20 dark:to-cyan-400/20 blur-3xl" />
          <div className="absolute -bottom-20 sm:-bottom-40 -left-16 sm:-left-32 w-48 sm:w-96 h-48 sm:h-96 rounded-full bg-gradient-to-tr from-cyan-400/20 to-teal-500/20 dark:from-cyan-500/20 dark:to-teal-400/20 blur-3xl" />
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="py-12 sm:py-16 bg-gradient-to-b from-slate-50 via-indigo-50/30 to-slate-50 dark:from-slate-900 dark:via-indigo-900/20 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={featuresRef}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={containerVariants}
            className="text-center"
          >
            <motion.h2
              variants={itemVariants}
              className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent px-4 sm:px-0"
            >
              Why Choose ApplyVault?
            </motion.h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="mt-12 sm:mt-20"
          >
            <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Zap,
                  title: "Automated Tracking",
                  description: "Automatically capture and organize your job applications in one secure location."
                },
                {
                  icon: Shield,
                  title: "Secure Storage",
                  description: "Your credentials are encrypted and stored with enterprise-grade security."
                },
                {
                  icon: CheckCircle,
                  title: "Easy Access",
                  description: "Quickly retrieve your application credentials whenever you need them."
                }
              ].map((feature) => (
                <motion.div
                  key={feature.title}
                  variants={featureCardVariants}
                  className="pt-6"
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flow-root bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg px-4 sm:px-6 pb-6 sm:pb-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 mx-2 sm:mx-0">
                    <div className="-mt-6">
                      <div>
                        <motion.span
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className="inline-flex items-center justify-center p-2.5 sm:p-3 bg-gradient-to-r from-teal-500 to-cyan-500 dark:from-teal-400 dark:to-cyan-400 rounded-md shadow-lg"
                        >
                          <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </motion.span>
                      </div>
                      <h3 className="mt-6 sm:mt-8 text-base sm:text-lg font-medium bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">{feature.title}</h3>
                      <p className="mt-4 sm:mt-5 text-sm sm:text-base text-slate-600 dark:text-slate-400">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;