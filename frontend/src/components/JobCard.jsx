import { MapPin, Clock, IndianRupee, AlertCircle } from 'lucide-react';

const JobCard = ({ job, distance, onAction, actionText }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'assigned': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 border ${job.urgency === 'urgent' ? 'border-red-300 dark:border-red-800/50' : 'border-gray-100 dark:border-gray-700'} flex flex-col h-full relative group`}>
      
      {job.urgency === 'urgent' && (
        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
          <AlertCircle size={14} /> Urgent
        </div>
      )}

      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white pr-16">{job.title}</h3>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">
        {job.description}
      </p>

      <div className="space-y-2 mb-6">
        <div className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
          <IndianRupee size={16} className="text-primary-500 mr-2" />
          ₹{job.budget}
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <MapPin size={16} className="text-gray-400 mr-2" />
          {distance ? `${distance} km away` : 'Location provided'}
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Clock size={16} className="text-gray-400 mr-2" />
          Posted {new Date(job.createdAt).toLocaleDateString()}
        </div>
      </div>

      <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(job.status)}`}>
          {job.status}
        </span>
        
        {onAction && (
          <button 
            onClick={() => onAction(job)}
            className="bg-primary-50 hover:bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:hover:bg-primary-900/40 dark:text-primary-400 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            {actionText || 'View Details'}
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
