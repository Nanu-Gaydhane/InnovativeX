import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import useGeoLocation from '../hooks/useLocation';
import { AuthContext } from '../context/AuthContext';
import JobCard from '../components/JobCard';
import Loader from '../components/Loader';
import { ToggleLeft, ToggleRight, MapPin, Search, AlertCircle, Briefcase } from 'lucide-react';

const WorkerDashboard = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [distance, setDistance] = useState(15);
  const [updatingAvail, setUpdatingAvail] = useState(false);
  const [skillFilter, setSkillFilter] = useState('');
  
  // Aadhaar Verification State
  const [showAadhaarModal, setShowAadhaarModal] = useState(false);
  const [aadhaarStep, setAadhaarStep] = useState(1); // 1: Enter Number, 2: Enter OTP
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  
  const { location, error: locError, loading: locLoading, getLocation } = useGeoLocation();

  useEffect(() => {
    getLocation();
  }, []);

  const fetchJobs = async () => {
    if (!location) return;
    try {
      setLoading(true);
      const { data } = await api.get(`/jobs/nearby?lng=${location.coordinates[0]}&lat=${location.coordinates[1]}&distance=${distance}`);
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location) {
      fetchJobs();
      // Update location dynamically if needed
      if (user && (!user.location || user.location.coordinates[0] !== location.coordinates[0])) {
         updateProfile({ location }).catch(console.error);
      }
    }
  }, [location, distance]);

  const toggleAvailability = async () => {
    try {
      setUpdatingAvail(true);
      await updateProfile({ availability: !user.availability });
    } catch (error) {
      console.error('Failed to update availability', error);
    } finally {
      setUpdatingAvail(false);
    }
  };

  const handleApply = (job) => {
    // Basic placeholder for "applying" or calling customer
    const text = `Hi, I am interested in your job: ${job.title} at your location.`;
    window.open(`https://wa.me/${job.customer?.phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSendOtp = () => {
    if (aadhaarNumber.length !== 12) return alert('Please enter a valid 12-digit Aadhaar number');
    setVerifyLoading(true);
    setTimeout(() => {
      setVerifyLoading(false);
      setAadhaarStep(2);
    }, 1500);
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return alert('Enter a 6-digit OTP');
    setVerifyLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      await updateProfile({ verified: true });
      setShowAadhaarModal(false);
    } catch (error) {
      console.error(error);
    } finally {
      setVerifyLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => 
    !skillFilter || 
    job.title.toLowerCase().includes(skillFilter.toLowerCase()) || 
    job.description.toLowerCase().includes(skillFilter.toLowerCase())
  );

  return (
    <div className="pb-10">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/40 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 text-2xl font-bold uppercase overflow-hidden">
            {user?.name?.[0] || 'W'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Welcome, {user?.name}
              {user?.verified ? (
                <span className="text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full text-xs flex items-center gap-1 border border-blue-200 dark:border-blue-800" title="Verified Account">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              ) : (
                <button onClick={() => setShowAadhaarModal(true)} className="text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full font-medium transition flex items-center gap-1 border border-gray-200 dark:border-gray-600">
                  <AlertCircle size={14} /> Verify Aadhaar
                </button>
              )}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 flex flex-wrap gap-2 mt-2">
              {user?.skills?.map((skill, idx) => (
                <span key={idx} className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">
                  {skill}
                </span>
              ))}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-600 w-full md:w-auto">
          <span className="font-medium text-gray-700 dark:text-gray-300">Availability:</span>
          <button 
            onClick={toggleAvailability} 
            disabled={updatingAvail}
            className={`flex items-center gap-2 font-bold transition ${user?.availability ? 'text-green-500' : 'text-gray-400'}`}
          >
            {user?.availability ? (
              <><ToggleRight size={28} /> Available</>
            ) : (
              <><ToggleLeft size={28} /> Offline</>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          Jobs Nearby
          <span className="bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 text-xs py-1 px-2 rounded-full">
            Within {distance}km
          </span>
        </h2>
        
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Filter jobs by skill..."
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="pl-9 pr-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-white w-full"
            />
          </div>
          Radius:
          <select 
            value={distance} 
            onChange={(e) => setDistance(Number(e.target.value))}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-1 px-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value={5}>5 km</option>
            <option value={15}>15 km</option>
            <option value={30}>30 km</option>
          </select>
        </div>
      </div>

      {!user?.availability && (
        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-8 dark:bg-orange-900/20 dark:border-orange-500">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-orange-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-orange-700 dark:text-orange-300">
                You are currently marked as offline. Customers won't see you, but you can still browse and apply to jobs.
              </p>
            </div>
          </div>
        </div>
      )}

      {locLoading ? (
        <Loader text="Getting location for precise job matching..." />
      ) : locError ? (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-2xl">
          <MapPin size={48} className="mx-auto text-red-400 mb-4 opacity-70" />
          <p className="text-gray-500 font-medium mb-4">Location is required to show nearby jobs.</p>
          <button onClick={getLocation} className="bg-primary-600 text-white px-4 py-2 rounded-lg">Allow Location</button>
        </div>
      ) : loading ? (
        <Loader text="Finding jobs in your area..." />
      ) : filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map(job => (
            <JobCard 
              key={job._id} 
              job={job} 
              onAction={handleApply}
              actionText="Contact Customer" 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <div className="w-20 h-20 mx-auto bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <Briefcase size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No jobs nearby yet</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Try expanding your search radius or check back later. When someone posts a job in this area, it will appear here.
          </p>
        </div>
      )}

      {/* Aadhaar Verification Modal */}
      {showAadhaarModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 max-w-md w-full relative">
            <button 
              onClick={() => setShowAadhaarModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              ✕
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Verify Identity</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Gain customer trust with a verified badge.
              </p>
            </div>

            {aadhaarStep === 1 ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Aadhaar Number</label>
                  <input
                    type="text"
                    maxLength="12"
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-primary-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter 12-digit number"
                  />
                </div>
                <button
                  onClick={handleSendOtp}
                  disabled={verifyLoading || aadhaarNumber.length !== 12}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition"
                >
                  {verifyLoading ? 'Sending...' : 'Send OTP'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-3 rounded-lg text-sm text-center mb-2">
                  OTP sent to Aadhaar registered mobile
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Enter OTP</label>
                  <input
                    type="text"
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-primary-500 text-center tracking-widest text-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="000000"
                  />
                </div>
                <button
                  onClick={handleVerifyOtp}
                  disabled={verifyLoading || otp.length !== 6}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition"
                >
                  {verifyLoading ? 'Verifying...' : 'Verify Now'}
                </button>
                <button
                  onClick={() => setAadhaarStep(1)}
                  className="w-full text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mt-2"
                >
                  Back
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerDashboard;
