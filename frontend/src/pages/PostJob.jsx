import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Briefcase, IndianRupee, MapPin, AlertCircle, Loader2 } from 'lucide-react';
import useGeoLocation from '../hooks/useLocation';

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    urgency: 'normal'
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { location, error: locError, loading: locLoading, getLocation } = useGeoLocation();

  useEffect(() => {
    getLocation();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) {
      setError('Please allow location access to post a job');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    try {
      const jobData = {
        ...formData,
        budget: Number(formData.budget),
        location
      };
      
      await api.post('/jobs', jobData);
      navigate('/customer-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-8 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Post a New Job</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Fill in the details to find nearby workers instantly.</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm flex items-center font-medium">
              <AlertCircle size={18} className="mr-2" /> {error}
            </div>
          )}

          {locError && (
            <div className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 p-4 rounded-xl mb-6 text-sm flex items-center font-medium">
              <MapPin size={18} className="mr-2" /> Please allow location to help workers find you.
              <button onClick={getLocation} className="ml-auto underline font-semibold">Retry</button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Title</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Need a plumber to fix leaking pipe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Describe the issue or task in detail..."
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Budget (₹)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IndianRupee size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="500"
                    min="50"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Urgency</label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent Requirement</option>
                </select>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50 flex align-top gap-3">
              <MapPin size={24} className="text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-800 dark:text-blue-400">Location Set</h4>
                <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                  {locLoading ? 'Getting precise location...' : location ? 'Your current location represents the job site.' : 'Waiting for location access...'}
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/customer-dashboard')}
                className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !location}
                className="flex-1 flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 transition block w-full"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Post Job Now'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
