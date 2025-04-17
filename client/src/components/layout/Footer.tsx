import { FC } from 'react';

const Footer: FC = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-800 to-zinc-800 text-white py-2">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">&copy; {new Date().getFullYear()} TriageNow - A Smart Health Triage System</p>
          </div>
          <div>
            <ul className="flex space-x-4">
              <li><a href="#" className="text-sm hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="text-sm hover:underline">Terms of Service</a></li>
              <li><a href="#" className="text-sm hover:underline">Contact</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
