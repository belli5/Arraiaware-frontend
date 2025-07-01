export default function SkeletonStatCard(){
    return(
    <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-8 bg-gray-300 rounded w-1/2 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
}