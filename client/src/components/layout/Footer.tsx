import { FC } from 'react';

const Footer: FC = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-800 to-zinc-800 dark:from-blue-950 dark:to-neutral-900 text-white py-2 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 hover:scale-105 transition-transform duration-300">
            <p className="text-sm relative">
              &copy; {new Date().getFullYear()} 
              <span className="bg-gradient-to-r from-blue-300 to-green-300 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent mx-1 font-semibold">
                TriageNow
              </span> 
              - A Smart Health Triage System
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-300/30 to-transparent dark:via-blue-400/30 animate-shimmer"></span>
            </p>
          </div>
          <div className="flex space-x-1">
            <ul className="flex space-x-4">
              {['Privacy Policy', 'Terms of Service', 'Contact'].map((item, index) => (
                <li key={item} className="opacity-0 animate-fade-in" style={{ animationDelay: `${0.1 * (index + 1)}s`, animationFillMode: 'forwards' }}>
                  <a 
                    href="#" 
                    className="text-sm relative overflow-hidden group"
                  >
                    <span className="relative z-10 group-hover:text-blue-200 transition-colors duration-300">{item}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-300 dark:bg-blue-400 group-hover:w-full transition-all duration-300 ease-in-out"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
