const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      <div className="text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-500 mx-auto mb-4"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-primary-600 font-bold text-lg">K</span>
          </div>
        </div>
        <p className="text-primary-600 font-semibold">Loading KEY Library...</p>
        <p className="text-primary-400 text-sm mt-1">Knowledge Empowering Youth</p>
      </div>
    </div>
  )
}

export default LoadingSpinner
