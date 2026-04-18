
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton, useUser, useAuth } from '@clerk/clerk-react';
import { Navigate, Route, Routes } from 'react-router';
import { useEffect } from 'react';
import HomePage from './pages/HomePage';
import ProblemsPage from './pages/ProblemsPage';
import DashboardPage from './pages/DashboardPage';
import ProblemPage from './pages/ProblemPage';
import { Toaster } from "react-hot-toast";
import SessionPage from './pages/SessionPage';
import { setAuthInterceptor } from './lib/axios';

function App() {

  const { isSignedIn, isLoaded } = useUser()
  const { getToken } = useAuth()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setAuthInterceptor(getToken);
    }
  }, [isLoaded, isSignedIn, getToken]);

  if (!isLoaded) return null;

  return (
    <>
      <Routes>

        <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={"dashboard"} />} />
        <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />} />
        <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />} />
        <Route path="/problem/:id" element={isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />} />
        <Route path="/session/:id" element={isSignedIn ? <SessionPage /> : <Navigate to={"/"} />} />




      </Routes>
      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App


// tw,dausy,react-router,react-toast
//react-query,axios