import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import WorkerCard from '../components/WorkerCard';
import Loader from '../components/Loader';
import RatingStars from '../components/RatingStars';
import { ArrowLeft, User, MessageSquare } from 'lucide-react';

const WorkerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkerData = async () => {
      try {
        setLoading(true);
        const [workerRes, ratingsRes] = await Promise.all([
          api.get(`/users/workers/${id}`),
          api.get(`/ratings/worker/${id}`)
        ]);
        setWorker(workerRes.data);
        setRatings(ratingsRes.data);
      } catch (error) {
        console.error('Failed to fetch worker details', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkerData();
  }, [id]);

  if (loading) return <Loader fullScreen />;

  if (!worker) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold">Worker not found</h2>
      <button onClick={() => navigate(-1)} className="text-primary-600 mt-4 underline">Go Back</button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 mb-6 font-medium transition"
      >
        <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
      </button>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <WorkerCard worker={worker} />
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">About {worker.name}</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Experience</p>
                <p className="font-semibold text-gray-900 dark:text-white">{worker.experience ? `${worker.experience} years` : 'Not specified'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Completed Jobs</p>
                <p className="font-semibold text-gray-900 dark:text-white">{ratings.length + 5}+ (est.)</p>
              </div>
            </div>

            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Reviews ({worker.numReviews})</h3>
            
            {ratings.length > 0 ? (
              <div className="space-y-4">
                {ratings.map(review => (
                  <div key={review._id} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-300">
                          <User size={14} />
                        </div>
                        {review.customer?.name || 'Customer'}
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mb-2 pl-10">
                      <RatingStars rating={review.rating} />
                    </div>
                    {review.comment && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm pl-10 italic flex gap-2">
                        <MessageSquare size={16} className="text-gray-300 dark:text-gray-600 flex-shrink-0 mt-0.5" />
                        "{review.comment}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl text-center">
                No reviews yet. Be the first to hire and review {worker.name}!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;
