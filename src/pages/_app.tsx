import type { AppProps } from 'next/app';
import { ErrorBoundary } from 'react-error-boundary';
import Link from 'next/link';
import { AuthProvider } from '@/contexts/AuthContext';

function ErrorFallback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">Error</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Something went wrong!</h2>
        <p className="text-lg text-gray-600 mb-8">
          We apologize for the inconvenience. Please try again later.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ErrorBoundary>
  );
}
