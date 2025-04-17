import { FC } from 'react';
import { Link } from 'wouter';
import useStore from '@/store';

const Header: FC = () => {
  const { role } = useStore();

  return (
    <header className="bg-gradient-to-r from-zinc-800 to-blue-900 shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="bg-gradient-to-r from-blue-300 to-green-300 bg-clip-text text-transparent text-xl md:text-2xl font-semibold flex items-center">
          <span className="material-icons mr-2">local_hospital</span>
          TriageNow
        </Link>
        <div className="text-white">
          {role === 'patient' && (
            <div className="flex items-center">
              <span className="material-icons mr-1">person</span> 
              Patient Mode
            </div>
          )}
          {role === 'medical-staff' && (
            <div className="flex items-center">
              <span className="material-icons mr-1">medical_services</span>
              Medical Staff Mode
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
