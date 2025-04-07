import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { Dumbbell, RotateCcw, Home, ArrowLeft } from 'lucide-react'
import { Avatar, AvatarImage } from '../ui/avatar'

const ErrorPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-emerald-300 dark:bg-emerald-900/30 rounded-full blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-blue-300 dark:bg-blue-900/30 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-900/30 rounded-full blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container max-w-5xl relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center md:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-7xl sm:text-8xl md:text-9xl font-extrabold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent"
            >
              404
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-4"
            >
               Page Not Found
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-slate-600 dark:text-slate-300 mb-8 text-lg"
            >
              Looks like you've lost your way during your fitness journey.
              Let's get you back on track!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
            >
              <Button
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white flex items-center gap-2 px-6 py-5 rounded-full"
              >
                <Home className="w-5 h-5" />
                Back to Home
              </Button>

              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="border-secondary text-secondary hover:bg-secondary hover:text-white dark:hover:bg-emerald-950/30 flex items-center gap-2 px-6 py-5 rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative flex justify-center md:justify-end"
          >
            <div className="relative w-80 h-80">
              {/* Animated Dumbbell */}
              <motion.div
                initial={{ rotate: 0 }}
                animate={{
                  rotate: [0, 15, 0, -15, 0],
                  y: [0, -10, 0, -10, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 5,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {/* <Dumbbell className="w-40 h-40 text-emerald-500" strokeWidth={1.5} /> */}
                <Avatar className='size-50'>
                  <AvatarImage src="/logo.png" />
                </Avatar>
              </motion.div>

              {/* Circular pulsing background */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{
                  scale: [0.8, 1.1, 0.8],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 rounded-full bg-secondary/20"
              />

              {/* Random floating elements */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: Math.random() * 200 - 100,
                    y: Math.random() * 200 - 100,
                    opacity: 0
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 4 + Math.random() * 3,
                    delay: i * 0.8
                  }}
                  className="absolute"
                  style={{
                    left: `${30 + Math.random() * 40}%`,
                    top: `${30 + Math.random() * 40}%`
                  }}
                >
                  <div className={`w-${3 + i}  h-${3 + i} rounded-full bg-emerald-${300 + i * 100}`} />
                </motion.div>
              ))}

            </div>
          </motion.div>
        </div>

        {/* Fitness motivational quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center mt-16"
        >
          <blockquote className="text-slate-600 dark:text-slate-300 italic">
            "The only bad workout is the one that didn't happen. Let's get you back on the right path!"
          </blockquote>
        </motion.div>
      </div>

      {/* Add custom animation for this page */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: scale(1) translate(0px, 0px);
          }
          33% {
            transform: scale(1.1) translate(20px, -20px);
          }
          66% {
            transform: scale(0.9) translate(-20px, 20px);
          }
          100% {
            transform: scale(1) translate(0px, 0px);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

export default ErrorPage
