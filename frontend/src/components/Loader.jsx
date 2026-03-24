import { Loader2 } from 'lucide-react';

const Loader = ({ fullScreen = false, text = 'Loading...' }) => {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <Loader2 className="animate-spin text-primary-500" size={40} />
      {text && <p className="text-gray-500 dark:text-gray-400 font-medium">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return <div className="py-10">{content}</div>;
};

export default Loader;
