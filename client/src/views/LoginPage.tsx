import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { loginUser, signup } from '../communications/userCommunications';
import { toast } from "react-hot-toast";

// Form animations
const formVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.3,
      ease: 'easeInOut' 
    } 
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: { 
      duration: 0.3,
      ease: 'easeInOut' 
    } 
  }
};

export const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Define images for each mode.
  const loginImage = 'https://picsum.photos/id/1071/800/1200';
  const signUpImage = 'https://picsum.photos/id/1002/800/1200';

  const toggleForm = () => {
    setIsLogin(!isLogin);
    // Reset form fields when toggling
    setUsername('');
    setPassword('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const response = await loginUser(username, password);
        if (response) {
          toast.success("Login successful");
          navigate('/dashboard'); // Moved inside branch
        }
      } else {
        await signup(username, password);
        toast.success("Signup successful");
        navigate('/dashboard'); // Moved inside branch
      }
      window.location.reload(); // Reload the page after login/signup
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-start p-6 md:p-12 lg:p-16">
        <div className="w-full max-w-md mx-auto">
          <div className="text-left mb-8">
            <h1 className="text-4xl font-bold tracking-tight">UP SKILL</h1>
            <p className="mt-2 text-gray-400">
              {isLogin ? 'Welcome back! Please log in.' : 'Join our platform to enhance your skills.'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? 'login' : 'signup'}
              onSubmit={handleSubmit}
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <div className="grid gap-1">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1 relative">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="flex items-center relative">

                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                  >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                
                  </div>
              </div>

              {isLogin && (
                <div className="flex items-center justify-end">
                  <a href="#" className="text-sm text-blue-600 hover:underline">
                    Forgot password?
                  </a>
                </div>
              )}

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button type="submit" className=" w-full">
                {isLogin ? 'Log In' : 'Sign Up'}
              </Button>

              <div className="text-center mt-4">
                <button type="button" onClick={toggleForm} className="text-md font-semibold text-slate-200 hover:underline">
                  {isLogin ? "Don't have an account? Sign up " : 'Already have an account? '}<span className="text-blue-500">Log in</span>
                </button>
              </div>
            </motion.form>
          </AnimatePresence>

          <div className="   mt-8 text-center">
            <Link to="/" className="text-sm text-slate-200 hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Single Image based on mode */}
      <div className="hidden md:block md:w-1/2 relative">
        <div
          className="h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${isLogin ? loginImage : signUpImage})`
          }}
        >
      </div>
    </div>
  );
    </div>
  );
};
