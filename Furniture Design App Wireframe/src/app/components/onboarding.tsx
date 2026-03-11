import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { ChevronLeft, ArrowRight, Check } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ThemeToggle } from './theme-toggle';
import { AnimatedBackground } from './animated-background';
import { useTheme } from './theme-context';

interface OnboardingStep {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    title: 'Choose where you want to start',
    description: 'Your space, your rules – let your creativity flow!',
    image: 'https://images.unsplash.com/photo-1760434773841-7eef8a7af7c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBpc29tZXRyaWMlMjByb29tJTIwZGVzaWdufGVufDF8fHx8MTc3MzE4ODg4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    imageAlt: 'Isometric room design',
  },
  {
    title: 'Wide range of furniture and decor pieces!',
    description: 'Use catalog to decorate your space with a variety of interior items from well-known brands.',
    image: 'https://images.unsplash.com/photo-1746450912859-63285b70d878?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXJuaXR1cmUlMjBjYXRhbG9nJTIwc2hvd3Jvb218ZW58MXx8fHwxNzczMTg4ODkwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    imageAlt: 'Furniture catalog',
  },
  {
    title: 'Make sure everything is fitting',
    description: 'Plan your purchases with size in mind',
    image: 'https://images.unsplash.com/photo-1771189255517-2a93f2ffff48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlcHJpbnQlMjBpbnRlcmlvciUyMGRlc2lnbnxlbnwxfHx8fDE3NzMxODg4OTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    imageAlt: 'Room planning',
  },
  {
    title: 'Pick your favourite color',
    description: 'We have everything you need to create great design and find right items in stores',
    image: 'https://images.unsplash.com/photo-1668786977632-98d3fc392193?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMG1vZGVybiUyMGZ1cm5pdHVyZXxlbnwxfHx8fDE3NzMxODg4OTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    imageAlt: 'Colorful furniture',
  },
  {
    title: 'Take a walkthrough of your design',
    description: 'See your design from a first-person mode and get inspired',
    image: 'https://images.unsplash.com/photo-1611094016919-36b65678f3d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBsaXZpbmclMjByb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzczMTIxMTYyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    imageAlt: 'Luxury interior',
  },
];

export function Onboarding() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    navigate('/designer');
  };

  const step = ONBOARDING_STEPS[currentStep];

  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-white/60' : 'text-slate-500';
  const stepBadge = isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10';
  const stepBadgeText = 'text-pink-500';

  const nextBtnClass = isDark
    ? 'bg-white text-black hover:bg-neutral-200 shadow-[0_0_20px_rgba(255,255,255,0.25)]'
    : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90 shadow-lg shadow-purple-500/25';

  const backBtnClass = isDark
    ? 'border border-white/10 bg-white/5 hover:bg-white/10 text-white'
    : 'border border-black/10 bg-black/5 hover:bg-black/10 text-slate-700';

  return (
    <div className={`min-h-screen relative flex ${isDark ? 'bg-neutral-950' : 'bg-slate-50'} font-sans overflow-hidden`}>
      <AnimatedBackground />

      <div className="relative z-10 flex flex-col w-full min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between p-6 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="text-xl">🪑</span>
            </div>
            <span className={`font-bold text-xl tracking-tight ${textPrimary}`}>ND Furniture</span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={handleSkip}
              className={`group flex items-center gap-2 px-4 py-2 transition-colors text-sm font-medium ${textSecondary} hover:${isDark ? 'text-white' : 'text-slate-900'}`}
            >
              Skip Intro
              <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col lg:flex-row items-center justify-center p-6 lg:p-12 gap-12 lg:gap-24">

          {/* Left Column: Image Presentation */}
          <div className="w-full lg:w-1/2 flex justify-center items-center">
            <div className={`relative w-full max-w-lg aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl ring-1 ${
              isDark ? 'shadow-purple-900/40 ring-white/10' : 'shadow-purple-200/60 ring-black/8'
            }`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="absolute inset-0 w-full h-full"
                >
                  <ImageWithFallback
                    src={step.image}
                    alt={step.imageAlt}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </AnimatePresence>
              <div className={`absolute inset-0 bg-gradient-to-t pointer-events-none ${
                isDark
                  ? 'from-neutral-950/80 via-transparent to-transparent'
                  : 'from-slate-900/40 via-transparent to-transparent'
              }`} />
            </div>
          </div>

          {/* Right Column: Text and Controls */}
          <div className="w-full lg:w-1/2 max-w-lg flex flex-col justify-center min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="space-y-6 flex-1 flex flex-col justify-center"
              >
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${stepBadge}`}>
                  <span className={`text-xs font-semibold tracking-wider uppercase ${stepBadgeText}`}>
                    Step {currentStep + 1} of {ONBOARDING_STEPS.length}
                  </span>
                </div>

                <h1 className={`text-4xl lg:text-5xl font-bold leading-tight tracking-tight ${textPrimary}`}>
                  {step.title}
                </h1>

                <p className={`text-lg leading-relaxed ${textSecondary}`}>
                  {step.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="mt-12 flex items-center justify-between">
              {/* Progress Indicators */}
              <div className="flex items-center gap-3">
                {ONBOARDING_STEPS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className="group py-2 focus:outline-none"
                    aria-label={`Go to step ${index + 1}`}
                  >
                    <div className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentStep
                        ? 'w-10 bg-gradient-to-r from-pink-500 to-purple-500'
                        : isDark
                          ? 'w-3 bg-white/20 group-hover:bg-white/40'
                          : 'w-3 bg-black/15 group-hover:bg-black/30'
                    }`} />
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className={`w-12 h-12 rounded-full p-0 flex items-center justify-center transition-all ${backBtnClass} ${
                    currentStep === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>

                <Button
                  onClick={handleNext}
                  className={`h-12 px-8 rounded-full hover:scale-105 transition-all font-semibold flex items-center gap-2 ${nextBtnClass}`}
                >
                  {currentStep === ONBOARDING_STEPS.length - 1 ? (
                    <>
                      Let's Start <Check className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      Next <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
