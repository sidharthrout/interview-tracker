export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center p-4">
      <div className="loading-spinner" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}

export function LoadingScreen() {
  return (
    <div className="min-h-[60vh] flex flex-col justify-center items-center">
      <div className="loading-spinner w-12 h-12" role="status">
        <span className="sr-only">Loading...</span>
      </div>
      <p className="mt-4 text-gray-600 text-lg">Loading...</p>
    </div>
  )
}

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <div className="loading-spinner w-10 h-10" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-4 text-gray-600">Please wait...</p>
      </div>
    </div>
  )
}