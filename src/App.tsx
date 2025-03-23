import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import LandingPage from './pages/LandingPage';
import AnimatedPage from './components/AnimatedPage';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={
              <AnimatedPage>
                <LandingPage />
              </AnimatedPage>
            } />
            <Route path="/login" element={
              <AnimatedPage>
                <Login />
              </AnimatedPage>
            } />
            <Route path="/signup" element={
              <AnimatedPage>
                <SignUp />
              </AnimatedPage>
            } />
            
            <Route element={<Layout />}>
              <Route 
                path="/dashboard" 
                element={
                  <AnimatedPage>
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  </AnimatedPage>
                }
              />
              <Route 
                path="/applications" 
                element={
                  <AnimatedPage>
                    <ProtectedRoute>
                      <Applications />
                    </ProtectedRoute>
                  </AnimatedPage>
                }
              />
              <Route 
                path="/analytics" 
                element={
                  <AnimatedPage>
                    <ProtectedRoute>
                      <Analytics />
                    </ProtectedRoute>
                  </AnimatedPage>
                }
              />
              <Route 
                path="/settings" 
                element={
                  <AnimatedPage>
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  </AnimatedPage>
                }
              />
            </Route>
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;