import { FC } from 'react';
import { Link } from 'wouter';
import useStore from '@/store';
import ThemeToggle from '@/components/ThemeToggle';

const Header: FC = () => {
  const { role } = useStore();

  return (
    <header className="bg-gradient-to-r from-zinc-800 to-blue-900 dark:from-neutral-900 dark:to-blue-950 shadow-md py-4 transition-all duration-300">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="group">
          <div className="bg-gradient-to-r from-blue-300 to-green-300 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent text-xl md:text-2xl font-semibold flex items-center">
            <span className="material-icons mr-2 group-hover:rotate-12 transform transition-all duration-300 ease-in-out">local_hospital</span>
            <span className="relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 group-hover:after:w-full after:bg-gradient-to-r after:from-blue-300 after:to-green-300 dark:after:from-blue-400 dark:after:to-green-400 after:transition-all after:duration-300 after:ease-in-out">
              TriageNow
              <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-300/0 via-blue-300/50 to-green-300/0 dark:from-blue-400/0 dark:via-blue-400/50 dark:to-green-400/0 animate-shimmer"></span>
            </span>
          </div>
        </Link>
        <div className="flex items-center space-x-4">
          <div className="text-white">
            {role === 'patient' && (
              <div className="flex items-center opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                <span className="material-icons mr-1">person</span> 
                <span className="relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-white after:transition-all after:duration-300">Patient Mode</span>
              </div>
            )}
            {role === 'medical-staff' && (
              <div className="flex items-center opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                <span className="material-icons mr-1">medical_services</span>
                <span className="relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-white after:transition-all after:duration-300">Medical Staff Mode</span>
              </div>
            )}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
