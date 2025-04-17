import { FC } from 'react';

interface RoleSelectionCardProps {
  role: 'patient' | 'medical-staff';
  title: string;
  icon: string;
  features: string[];
  onClick: () => void;
}

const RoleSelectionCard: FC<RoleSelectionCardProps> = ({ role, title, icon, features, onClick }) => {
  return (
    <div 
      className="dark:bg-black bg-white rounded-xl shadow-xl p-6 flex-1 border-2 border-transparent hover:border-blue-500 transition-all cursor-pointer flex flex-col"
      onClick={onClick}
    >
      <div className="text-center mb-6 dark:text-blue-400 dark:border-green-300">
        <div className="border border-blue-400 rounded-full p-4 inline-block mb-4">
          <span className="material-icons text-primary text-4xl">{icon}</span>
        </div>
        <h3 className="text-xl font-bold text-primary dark:text-blue-400">{title}</h3>
      </div>
      <ul className="space-y-3 mb-8 flex-1 ">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <span className="material-icons text-primary mr-2 text-sm">check_circle</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button 
        className="w-full bg-gradient-to-r from-blue-800 to-green-800 text-white py-3 rounded-md font-medium transition-colors hover:text-black hover:bg-gradient-from-l hover:from-blue-400 hover:to-green-400 hover:shadow-lg"
        onClick={onClick}
      >
        Select {role === 'patient' ? 'Patient' : 'Medical Staff'}
      </button>
    </div>
  );
};

export default RoleSelectionCard;
