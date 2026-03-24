import { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Phone, Lock, Briefcase, MapPin, Loader2 } from 'lucide-react';
import useGeoLocation from '../hooks/useLocation';
import toast from 'react-hot-toast';

const Register = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const role = state?.role || 'customer';
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    role: role
  });
  
  const [selectedSkills, setSelectedSkills] = useState([]);
  
  const SKILLS_LIST = [
    { id: 'Electrician', label: 'Electrician', icon: '⚡' },
    { id: 'Plumber', label: 'Plumber', icon: '🔧' },
    { id: 'Painter', label: 'Painter', icon: '🎨' },
    { id: 'Mazdoor', label: 'Mazdoor', icon: '🏗️' },
    { id: 'Carpenter', label: 'Carpenter', icon: '🔨' },
    { id: 'Cleaner', label: 'Cleaner', icon: '🧹' },
    { id: 'Driver', label: 'Driver', icon: '🚜' },
    { id: 'Security', label: 'Security', icon: '🔑' }
  ];

  const toggleSkill = (skillId) => {
    setSelectedSkills(prev => 
      prev.includes(skillId) 
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Aadhaar Verification State
  const [showAadhaarModal, setShowAadhaarModal] = useState(false);
  const [aadhaarStep, setAadhaarStep] = useState(1);
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  
  // Manual Location State
  const [isManualLocation, setIsManualLocation] = useState(false);
  const [manualQuery, setManualQuery] = useState('');
  const [manualCoords, setManualCoords] = useState(null);
  const [manualAddressString, setManualAddressString] = useState('');
  const [manualSearchLoading, setManualSearchLoading] = useState(false);
  
  const { register, user } = useContext(AuthContext);
  const { location, error: locError, loading: locLoading, getLocation } = useGeoLocation();

  useEffect(() => {
    if (user) {
      navigate(user.role === 'customer' ? '/customer-dashboard' : '/worker-dashboard');
    }
  }, [user, navigate]);
  
  // Use geolocation by default when opening register
  useEffect(() => {
    if (!location && !locLoading && !locError) {
      getLocation();
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearchLocation = async () => {
    if (!manualQuery.trim()) return;
    setManualSearchLoading(true);
    setManualCoords(null);
    setManualAddressString('');
    
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(manualQuery)}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        setManualCoords({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        });
        setManualAddressString(data[0].display_name);
        toast.success('Location found successfully!');
      } else {
        toast.error("Couldn't find coordinates for that location. Try a different spelled city/area.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching location. Please try GPS or try again later.");
    } finally {
      setManualSearchLoading(false);
    }
  };

  const handleSendOtp = () => {
    if (aadhaarNumber.length !== 12) return toast.error('Please enter a valid 12-digit Aadhaar number');
    setVerifyLoading(true);
    setTimeout(() => {
      setVerifyLoading(false);
      setAadhaarStep(2);
      toast.success('OTP sent locally for simulation!');
    }, 1500);
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return toast.error('Enter a 6-digit OTP');
    setVerifyLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowAadhaarModal(false);
      await submitRegistration(true);
    } catch (error) {
      console.error(error);
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role === 'worker') {
      setShowAadhaarModal(true);
    } else {
      submitRegistration(false);
    }
  };

  const submitRegistration = async (isVerified) => {
    setError('');
    setIsSubmitting(true);
    
    try {
      const dataToSubmit = { ...formData };
      
      if (role === 'worker') {
        if (selectedSkills.length === 0) {
          setError('Please select at least one skill.');
          setIsSubmitting(false);
          return;
        }
        dataToSubmit.skills = selectedSkills;
        dataToSubmit.verified = isVerified;
      }
      
      if (isManualLocation) {
        if (!manualCoords || !manualCoords.lat || !manualCoords.lng) {
          setError('Please search and select a valid location.');
          setIsSubmitting(false);
          return;
        }
        dataToSubmit.location = {
          type: 'Point',
          coordinates: [manualCoords.lng, manualCoords.lat]
        };
      } else if (location) {
        dataToSubmit.location = location;
      }

      await register(dataToSubmit);
      // navigation handled by useEffect
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
          Create Account
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Join as a <span className="font-semibold capitalize text-primary-600 dark:text-primary-400">{role}</span>
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg mb-6 text-sm flex items-center font-medium">
          ⚠️ {error}
        </div>
      )}

      {locError && (
        <div className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 p-3 rounded-lg mb-6 text-sm flex items-center font-medium">
          📍 Please allow location to help us find nearby {role === 'customer' ? 'workers' : 'jobs'}.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition"
              placeholder="Ravi Kumar"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone size={18} className="text-gray-400" />
            </div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition"
              placeholder="9876543210"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={18} className="text-gray-400" />
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        {role === 'worker' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select your Skills</label>
            <div className="flex flex-wrap gap-2">
              {SKILLS_LIST.map((skill) => {
                const isSelected = selectedSkills.includes(skill.id);
                return (
                  <button
                    type="button"
                    key={skill.id}
                    onClick={() => toggleSkill(skill.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      isSelected 
                        ? 'bg-orange-50 border-orange-300 text-orange-800 dark:bg-orange-900/30 dark:border-orange-500/50 dark:text-orange-400' 
                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span>{skill.icon}</span> {skill.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {!isManualLocation ? (
            <>
              <button
                type="button"
                onClick={getLocation}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                {locLoading ? <Loader2 className="animate-spin" size={16} /> : <MapPin size={16} />}
                {location ? 'Location Updated ✅' : 'Get Current Location'}
              </button>
              <button
                type="button"
                onClick={() => setIsManualLocation(true)}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline text-center"
              >
                Or search for a city/area manually
              </button>
            </>
          ) : (
            <div className="space-y-3 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Enter City & Area</span>
                <button
                  type="button"
                  onClick={() => setIsManualLocation(false)}
                  className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Use GPS instead
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Andheri, Mumbai"
                  value={manualQuery}
                  onChange={(e) => setManualQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearchLocation())}
                  className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary-500"
                />
                <button
                  type="button"
                  onClick={handleSearchLocation}
                  disabled={manualSearchLoading || !manualQuery.trim()}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
                >
                  {manualSearchLoading ? <Loader2 className="animate-spin text-white" size={16} /> : 'Search'}
                </button>
              </div>
              {manualCoords && (
                <div className="text-xs text-green-600 dark:text-green-400 font-medium p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                  ✅ Found: {manualAddressString}
                </div>
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || (!isManualLocation && locLoading) || (isManualLocation && !manualCoords)}
          className="w-full flex justify-center py-3 px-4 mt-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 transition"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Sign Up'}
        </button>
      </form>
      
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
                Aadhaar verification is required for all workers.
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
                  {verifyLoading ? 'Verifying & Registering...' : 'Verify & Register'}
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

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default Register;
