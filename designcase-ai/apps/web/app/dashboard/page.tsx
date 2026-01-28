'use client';

import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-indigo-600">
            DesignCase AI
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">
              Welcome, {user?.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Welcome to DesignCase AI
              </p>
            </div>
          </div>

          {/* User Info */}
          <div className="mb-8 p-6 bg-indigo-50 rounded-lg border border-indigo-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Account Information
            </h2>
            <div className="space-y-2">
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>User ID:</strong> {user?.id}
              </p>
              <p>
                <strong>Account Created:</strong>{' '}
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
          </div>

          {/* Feature Overview */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                📁 Projects
              </h3>
              <p className="text-gray-600 mb-4">
                Create and manage your design projects
              </p>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                📤 Upload Files
              </h3>
              <p className="text-gray-600 mb-4">
                Upload your design files for analysis
              </p>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ⚙️ Settings
              </h3>
              <p className="text-gray-600 mb-4">
                Manage your account settings
              </p>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              🚀 Getting Started
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Create a new project</li>
              <li>Upload your design files</li>
              <li>Let AI analyze your designs</li>
              <li>Generate a beautiful case study</li>
              <li>Share with the world</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
