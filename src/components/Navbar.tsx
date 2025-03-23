import { useState, useEffect } from 'react';
import { Bell, Search, LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface ProfileData {
  first_name: string | null;
  last_name: string | null;
}

function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfileData(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navigateToSettings = () => {
    navigate('/settings');
    setIsProfileMenuOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('profile-dropdown');
      const button = document.getElementById('profile-button');
      if (
        dropdown &&
        button &&
        !dropdown.contains(event.target as Node) &&
        !button.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-1 flex items-center">
            <div className="max-w-lg w-full lg:max-w-xs">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search applications..."
                  type="search"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" />
            </button>
            <div className="ml-4 relative flex-shrink-0">
              <div>
                <button
                  id="profile-button"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {loading ? (
                    <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                  ) : (
                    <img
                      className="h-8 w-8 rounded-full"
                      src={`https://ui-avatars.com/api/?name=${profileData?.first_name || user?.email?.split('@')[0]}&background=random`}
                      alt={user?.email || 'Profile'}
                    />
                  )}
                </button>
              </div>
              {isProfileMenuOpen && (
                <div
                  id="profile-dropdown"
                  className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none"
                >
                  <div className="px-4 py-3">
                    <p className="text-sm">Signed in as</p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <div className="py-3 px-4">
                    <div className="flex items-center mb-3">
                      <div className="flex-shrink-0">
                        {loading ? (
                          <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                        ) : (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={`https://ui-avatars.com/api/?name=${profileData?.first_name || user?.email?.split('@')[0]}&background=random`}
                            alt=""
                          />
                        )}
                      </div>
                      <div className="ml-3">
                        {loading ? (
                          <div className="space-y-2">
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                            <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
                          </div>
                        ) : (
                          <>
                            <p className="text-base font-medium text-gray-700">
                              {profileData?.first_name && profileData?.last_name
                                ? `${profileData.first_name} ${profileData.last_name}`
                                : 'Set up your profile'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {profileData?.first_name ? 'View or edit profile' : 'Complete your profile'}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={navigateToSettings}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                      disabled={loading}
                    >
                      <Settings className="mr-3 h-5 w-5 text-gray-400" />
                      Settings
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-gray-100 w-full"
                      disabled={loading}
                    >
                      <LogOut className="mr-3 h-5 w-5 text-red-400" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;