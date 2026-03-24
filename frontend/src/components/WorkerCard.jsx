import { MapPin, Phone, MessageCircle } from 'lucide-react';
import RatingStars from './RatingStars';
import { Link } from 'react-router-dom';

const WorkerCard = ({ worker, distance }) => {
  // WhatsApp redirect logic
  const handleWhatsApp = () => {
    const text = "Hi, I need your service from RozgarSaathi.";
    window.open(`https://wa.me/${worker.phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700 flex flex-col h-full relative overflow-hidden group">
      {worker.rating > 4.5 && (
        <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg">
          Top Rated ⭐
        </div>
      )}
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            {worker.name}
            {worker.verified && (
              <span className="text-blue-500" title="Verified Worker">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </h3>
          <RatingStars rating={worker.rating} />
        </div>
        <div className="text-right">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${worker.availability ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
            {worker.availability ? 'Available' : 'Busy'}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {worker.skills?.map((skill, idx) => (
          <span key={idx} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-md border border-gray-200 dark:border-gray-600">
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          <MapPin size={16} className="mr-1" />
          {distance ? `${distance} km away` : 'Nearby'}
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-2 bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40 py-2 rounded-lg font-medium transition"
          >
            <MessageCircle size={18} /> WhatsApp
          </button>
          <a 
            href={`tel:${worker.phone}`}
            className="flex items-center justify-center gap-2 bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400 dark:hover:bg-primary-900/40 py-2 rounded-lg font-medium transition"
          >
            <Phone size={18} /> Call
          </a>
        </div>
      </div>
    </div>
  );
};

export default WorkerCard;
