import { Link } from 'react-router-dom';
import { Briefcase, MapPin, ShieldCheck, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative pt-20 pb-32 sm:pt-24 sm:pb-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-semibold mb-6 border border-primary-100 dark:border-primary-800">
            <Zap size={16} fill="currentColor" /> Connecting local talents instantly
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8">
            Find the right worker.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500">
              Right exactly when you need it.
            </span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400 mb-10">
            RozgarSaathi bridges the gap between daily wage workers waiting at nakas and local households needing immediate services. No middlemen, zero commission.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" state={{ role: 'customer' }} className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg flex items-center justify-center gap-2">
              <Search size={20} /> I need to hire
            </Link>
            <Link to="/register" state={{ role: 'worker' }} className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg flex items-center justify-center gap-2">
              <Briefcase size={20} /> I want to work
            </Link>
          </div>
          
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-gray-500 dark:text-gray-400 font-medium">
            <div className="flex items-center gap-2"><CheckCircle2 className="text-green-500" /> Aadhaar Verified Workers</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="text-green-500" /> WhatsApp Integrated</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="text-green-500" /> Hyperlocal Geo-Matching</div>
          </div>
        </div>
        
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-400/20 dark:bg-primary-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      </div>

      {/* Features Showcase */}
      <div className="bg-white dark:bg-gray-800 py-24 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why use RozgarSaathi?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">Our platform is designed to digitize the traditional labor market, providing transparency, speed, and trust.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-8 rounded-2xl hover:-translate-y-1 transition-transform border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
                <MapPin size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Hyperlocal Matching</h3>
              <p className="text-gray-600 dark:text-gray-400">Using geospatial data to instantly connect customers with plumbers, electricians, and painters within a 5-10km radius.</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700/50 p-8 rounded-2xl hover:-translate-y-1 transition-transform border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Aadhaar Verified Trust</h3>
              <p className="text-gray-600 dark:text-gray-400">Workers carry a digital Verified Badge by confirming their identity through our Aadhaar OTP simulator, ensuring safety for households.</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700/50 p-8 rounded-2xl hover:-translate-y-1 transition-transform border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Frictionless Contact</h3>
              <p className="text-gray-600 dark:text-gray-400">Skip the in-app chat. With one click, generate a pre-filled WhatsApp message indicating the job context and exact location instantly.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="py-24 max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Ready to transform the gig economy?</h2>
        <Link to="/role-selection" className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg group">
          Join the Platform <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

// Extracted Search Icon locally since it wasn't imported from lucide
function Search(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  );
}

export default Home;
