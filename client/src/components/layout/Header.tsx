import { FC } from "react";
import { Link } from "wouter";
import useStore from "@/store";
import ThemeToggle, { useIsDarkMode } from "@/components/ThemeToggle";

const Header: FC = () => {
  const { role } = useStore();
  const isDarkMode = useIsDarkMode();


  return (
    <header className="bg-gradient-to-r from-zinc-900 to-blue-600 dark:bg-gradient-to-br dark:from-blue-900 dark:to-zinc-800 shadow-md py-4 transition-all duration-300 no-overflow">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="group">
          <div className="flex items-center">
            <span className="material-icons text-blue-300 after:dark:text-green-400 mr-2 text-2xl md:text-3xl group-hover:rotate-12 transform transition-all duration-300 ease-in-out hover:scale-110">
              local_hospital
            </span>
            <div className="relative">
              <span className="bg-gradient-to-r from-blue-400 to-green-400 after:dark:from-blue-300 to-green-400 bg-clip-text text-transparent text-xl md:text-2xl font-bold relative z-10">
                TriageNow
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-green-400 dark:from-blue-300 dark:to-green-400 group-hover:w-full transition-all duration-500 ease-in-out"></span>
              {/* Glow effect for dark mode */}
              <span className="absolute inset-0 dark:bg-blue-500/20 dark:group-hover:bg-blue-500/30 rounded-lg blur-sm transition-all duration-300 -z-10"></span>
            </div>
          </div>
        </Link>
        <div className="flex items-center space-x-4">
          <div>
            {role === "patient" && (
              <div
                className="flex items-center opacity-0 animate-fade-in border border-green-400 rounded-full p-2 transition-all duration-300"
                style={{
                  animationDelay: "0.2s",
                  animationFillMode: "forwards",
                }}
              >
                <span className="material-icons mr-1 text-white dark:text-green-400">
                  person
                </span>
                <span className="text-white relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-white dark:after:bg-green-400 after:transition-all after:duration-300">
                  Patient Mode
                </span>
              </div>
            )}
            {role === "medical-staff" && (
              <div
                className="flex items-center opacity-0 animate-fade-in"
                style={{
                  animationDelay: "0.2s",
                  animationFillMode: "forwards",
                }}
              >
                <span className="material-icons mr-1 text-white dark:text-green-400">
                  medical_services
                </span>
                <span className="relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-white dark:after:bg-green-400 after:transition-all after:duration-300">
                  Medical Staff Mode
                </span>
              </div>
            )}
          </div>
          {!isDarkMode && (
            <div className="hover-gradient-blue-purple px-3 py-1 rounded-lg shadow-lg">
              <p className="text-white text-sm font-medium flex items-center">
                <span className="material-icons text-yellow-300 text-xs mr-1">lightbulb</span>
                <span>
                  <em>Headache</em>?
                  <span className="ml-1 font-bold">Try Dark Mode</span>
                  <span className="inline-block ml-1 animate-bounce-light">👉</span>
                </span>
              </p>
            </div>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
