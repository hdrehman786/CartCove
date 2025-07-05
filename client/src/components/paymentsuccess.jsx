
export default function PaymentSuccess() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-10 bg-white rounded-lg shadow-xl text-center max-w-md">
        
        {/* Checkmark Icon */}
        <div className="mb-4">
          <svg
            className="w-20 h-20 text-green-500 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>

        {/* Text Content */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. An email receipt has been sent to you.
        </p>

        {/* Home Button */}
        <a
          href="/" // Change this to your homepage route
          className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
        >
          Go to Homepage
        </a>
      </div>
    </div>
  );
}