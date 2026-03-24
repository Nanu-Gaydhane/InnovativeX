import { useNavigate } from 'react-router-dom';
import { UserPlus, Briefcase } from 'lucide-react';

const RoleSelection = () => {
  const navigate = useNavigate();

  const selectRole = (role) => {
    navigate('/register', { state: { role } });
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 text-center">
      <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 mb-4">Join RozgarSaathi</h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">How would you like to use the platform?</p>

      <div className="grid md:grid-cols-2 gap-8">
        <div 
          onClick={() => selectRole('worker')}
          className="bg-white dark:bg-gray-800 rounded-3xl p-8 cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-primary-500 group"
        >
          <div className="w-20 h-20 mx-auto bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition">
            <Briefcase size={40} className="text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">I am a Worker</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Find nearby jobs instantly. Plumbers, Electricians, Painters, Laborers, etc. No commission, direct connection.
          </p>
          <button className="mt-8 bg-primary-50 text-primary-600 dark:bg-gray-700 dark:text-primary-400 px-6 py-2 rounded-lg font-medium group-hover:bg-primary-600 group-hover:text-white transition">
            Register as Worker &rarr;
          </button>
        </div>

        <div 
          onClick={() => selectRole('customer')}
          className="bg-white dark:bg-gray-800 rounded-3xl p-8 cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-teal-500 group"
        >
          <div className="w-20 h-20 mx-auto bg-teal-100 dark:bg-teal-900/40 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition">
            <UserPlus size={40} className="text-teal-600 dark:text-teal-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">I want to Hire</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Post jobs and hire trusted local workers for same-day tasks. Get things done quickly and affordably.
          </p>
          <button className="mt-8 bg-teal-50 text-teal-600 dark:bg-gray-700 dark:text-teal-400 px-6 py-2 rounded-lg font-medium group-hover:bg-teal-600 group-hover:text-white transition">
            Register as Customer &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
