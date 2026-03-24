import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import useGeoLocation from '../hooks/useLocation';
import WorkerCard from '../components/WorkerCard';
import Loader from '../components/Loader';
import { Search, MapPin, Filter, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const CustomerDashboard = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [distance, setDistance] = useState(10); // Default 10km
  
  const [overrideLocation, setOverrideLocation] = useState(null);
  const [manualQuery, setManualQuery] = useState('');
  const [manualSearchLoading, setManualSearchLoading] = useState(false);
  
  const { location, error: locError, loading: locLoading, getLocation } = useGeoLocation();

  useEffect(() => {
    // Attempt to get location on mount
    getLocation();
  }, []);

  useEffect(() => {
    const fetchWorkers = async () => {
      const activeLocation = overrideLocation || location;
      if (!activeLocation) return;
      
      try {
        setLoading(true);
        const { data } = await api.get(`/users/workers?lng=${activeLocation.coordinates[0]}&lat=${activeLocation.coordinates[1]}&distance=${distance}`);
        setWorkers(data);
      } catch (error) {
        console.error('Error fetching workers:', error);
      } finally {
        setLoading(false);
      }
    };

    if (overrideLocation || location) {
      fetchWorkers();
    }
  }, [location, overrideLocation, distance]);

  const handleSearchLocation = async () => {
    if (!manualQuery.trim()) return;
    setManualSearchLoading(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(manualQuery)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        setOverrideLocation({
          type: 'Point',
          coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)]
        });
        toast.success(`Location set successfully!`);
      } else {
        toast.error("Couldn't find that location. Try another city or area.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching location.");
    } finally {
      setManualSearchLoading(false);
    }
  };

  const filteredWorkers = workers.filter(worker => 
    worker.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    worker.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Hire Workers Nearby</h1>
          <p className="text-gray-600 dark:text-gray-400">Find plumbers, electricians, painters, and more instantly.</p>
        </div>
        <Link 
          to="/post-job" 
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium shadow-md transition whitespace-nowrap"
        >
          + Post a Job
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search workers by skill (e.g. Plumber)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
          />
        </div>
        
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Change Area (e.g. Pune)"
            value={manualQuery}
            onChange={(e) => setManualQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchLocation()}
            className="block w-full pl-10 pr-10 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
          />
          <button
            onClick={handleSearchLocation}
            disabled={manualSearchLoading || !manualQuery.trim()}
            className="absolute inset-y-0 right-3 flex items-center justify-center text-primary-600 hover:text-primary-700 disabled:opacity-50 transition font-medium"
          >
            {manualSearchLoading ? <Loader2 size={20} className="animate-spin" /> : 'Set'}
          </button>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-xl">
          <Filter size={20} className="text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-300">Within {distance}km</span>
          <input 
            type="range" 
            min="1" 
            max="50" 
            value={distance} 
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-24 accent-primary-600"
          />
        </div>
      </div>

      {!overrideLocation && locLoading ? (
        <Loader text="Acquiring your location..." fullScreen />
      ) : !overrideLocation && locError ? (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-2xl text-center border border-red-100 dark:border-red-900/30">
          <MapPin size={40} className="mx-auto mb-3 opacity-50" />
          <h3 className="text-lg font-semibold mb-1">Location Required</h3>
          <p className="mb-4">We need your location (or a manual area search) to show nearby workers.</p>
          <button 
            onClick={getLocation}
            className="bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60 px-4 py-2 rounded-lg font-medium transition"
          >
            Retry GPS Permission
          </button>
        </div>
      ) : loading ? (
        <Loader text={`Finding top rated workers within ${distance}km...`} fullScreen />
      ) : filteredWorkers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredWorkers.map(worker => (
            <WorkerCard key={worker._id} worker={worker} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <div className="w-20 h-20 mx-auto bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <Search size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No workers found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            We couldn't find any workers matching your criteria within {distance}km. Try increasing the search radius or changing your keywords.
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
