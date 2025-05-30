import { useLoading } from '../context/LoadingContext';

const GlobalLoadingOverlay = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative h-28 w-28">
        {/* Spinning ring */}
        <div className="absolute inset-0 animate-spin rounded-full border-t-4 border-b-4 border-white"></div>
        
        {/* Centered logo */}
        <div className="absolute inset-0 flex items-center justify-center invert">
          <img 
            src="/logo.png" 
            alt="Loading"
            className="h-10 w-10"
          />
        </div>
      </div>
    </div>
  );
};

export default GlobalLoadingOverlay;