import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import PixelCard from "../components/HoverCard";
import Aurora from "../components/Aurora";
import TrueFocus from "../components/TrueFocus";

// Hero section animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scrolling for navbar background change
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-black/40 backdrop-blur-2xl " : "bg-transparent"
        }`}
      >
        <div className="container bg-transparent mx-auto  sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <span className="text-3xl font-bold text-white">SKILL GARAGE</span>
            </div>

            {/* <nav className="hidden md:flex space-x-8">
              {["Home", "About", "Features", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-white/90 hover:text-white font-medium transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav> */}

            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white border border-white/20 hover:bg-white/10 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Aurora */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <Aurora
            colorStops={["#2F4F4F", "#00008B", "#2B1082"]}
            blend={0.8}
            amplitude={1.2}
            speed={0.5}
          />
        </div>

        <div className="container bg-transparent mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="w-full mx-auto text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              className="mb-6"
            >
              <TrueFocus 
                sentence="Enter The New Learning Era"
                manualMode={true}
                blurAmount={6}
                borderColor="#1EB0A4"
                glowColor="rgba(255, 85, 85, 0.6)"
                animationDuration={0.8}
                pauseBetweenAnimations={1}
              />
            </motion.div>

            <motion.p
              className="text-xl md:text-2xl mb-8 text-white/90"
              variants={itemVariants}
            >
              Learn with AI-powered feedback and expert guidance
            </motion.p>

            <motion.div variants={itemVariants} className="space-x-4">
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-4 rounded-lg text-gray-900 bg-white hover:bg-gray-100 text-lg font-medium transition-colors"
              >
                Start Practice
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section with HoverCards */}
      <section id="features" className="py-32 bg-blend-color-burn relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <Aurora
            colorStops={["#00d8ff", "#7cff67", "#00d8ff"]}
            blend={0.3}
            amplitude={0.8}
            speed={0.3}
          />
        </div>

        <div className="container bg-transparent mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose UP SKILL?
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Experience the future of interview preparation
            </p>
          </div>

          {/* <div className="grid m-auto grid-cols-1 md:grid-cols-3 gap-8"> */}
          <div className="flex justify-center m-auto md:grid-cols-3 gap-52">
            {[
              {
                title: "AI-Powered Practice",
                description: "Get instant feedback from our advanced AI system",
                variant: "blue"
              },
              {
                title: "Real-time Analytics",
                description: "Track your progress with detailed performance metrics",
                variant: "pink"
              },
              {
                title: "Expert Guidance",
                description: "Access curated resources and personalized tips",
                variant: "blue"
              }
            ].map((feature, index) => (
              <PixelCard key={index} variant={feature.variant as "blue" | "pink" | "yellow"}>
                <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                  <div>
                    <h3 className="text-3xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-100">{feature.description}</p>
                  </div>
                </div>
              </PixelCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* <Aurora
            colorStops={["#FF94B4", "#3A29FF", "#FF3232"]}
            blend={0.5}
            amplitude={1.0}
            speed={0.4}
          /> */}
        </div>

        <div className="container bg-transparent mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Level Up?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join thousands of students, Grow with us!
            </p>
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-4 rounded-lg bg-white text-gray-900 hover:bg-gray-100 text-lg font-medium transition-colors"
            >
              Get Started Now
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container bg-transparent mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <span className="text-2xl font-bold text-white">UP SKILL</span>
              <p className="mt-2 max-w-md">
                Empowering professionals with the skills they need to excel in
                technical interviews
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Platform
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-white">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Pricing
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Resources
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-white">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Guides
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Support
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Company
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-white">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p>© 2023 UP SKILL. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">GitHub</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
