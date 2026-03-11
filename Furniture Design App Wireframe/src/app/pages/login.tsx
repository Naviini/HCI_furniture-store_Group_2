import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { AnimatedBackground } from '../components/animated-background';
import { ThemeToggle } from '../components/theme-toggle';
import { useTheme } from '../components/theme-context';

export function LoginPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem('designer', JSON.stringify({ email, name: email.split('@')[0] }));
      const onboardingCompleted = localStorage.getItem('onboardingCompleted');
      if (onboardingCompleted) {
        navigate('/designer');
      } else {
        navigate('/onboarding');
      }
      setIsLoading(false);
    }, 600);
  };

  const glass = isDark
    ? 'bg-white/5 border border-white/10 backdrop-blur-xl'
    : 'bg-white/75 border border-black/10 backdrop-blur-xl shadow-xl shadow-black/5';

  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-white/50' : 'text-slate-500';
  const inputClass = isDark
    ? 'bg-white/8 border border-white/15 text-white placeholder:text-white/30 focus:border-pink-400/60 focus:bg-white/12'
    : 'bg-white/60 border border-black/10 text-slate-900 placeholder:text-slate-400 focus:border-purple-400/80 focus:bg-white/90';

  return (
    <div className={`min-h-screen relative flex flex-col ${isDark ? 'bg-neutral-950' : 'bg-slate-50'} font-sans overflow-hidden`}>
      <AnimatedBackground />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <span className="text-xl">🪑</span>
          </div>
          <span className={`font-bold text-xl tracking-tight ${textPrimary}`}>ND Furniture</span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`w-full max-w-sm rounded-3xl p-8 ${glass}`}
        >
          {/* Card header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
              <span className="text-3xl">🪑</span>
            </div>
            <h1 className={`text-2xl tracking-tight ${textPrimary}`}>Welcome Back</h1>
            <p className={`text-sm mt-1 ${textSecondary}`}>Access the ND Furniture design studio</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className={`text-sm ${textSecondary}`}>Email</label>
              <input
                type="email"
                placeholder="designer@ndfurniture.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full px-4 py-3 rounded-xl outline-none transition-all text-sm ${inputClass}`}
              />
            </div>

            <div className="space-y-1.5">
              <label className={`text-sm ${textSecondary}`}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`w-full px-4 py-3 pr-12 rounded-xl outline-none transition-all text-sm ${inputClass}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 ${textSecondary} hover:opacity-80 transition-opacity`}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`mt-2 w-full h-12 rounded-xl flex items-center justify-center gap-2 transition-all font-semibold text-sm ${
                isDark
                  ? 'bg-white text-black hover:bg-neutral-200 shadow-[0_0_20px_rgba(255,255,255,0.15)]'
                  : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90 shadow-lg shadow-purple-500/25'
              } ${isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider hint */}
          <p className={`text-center text-xs mt-6 ${textSecondary}`}>
            Enter any email and password to continue
          </p>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className={`relative z-10 text-center p-6 text-xs ${textSecondary}`}>
        © {new Date().getFullYear()} ND Furniture. Designer portal.
      </footer>
    </div>
  );
}
