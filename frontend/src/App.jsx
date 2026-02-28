
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton, useUser } from '@clerk/clerk-react';
import { Navigate, Route, Routes } from 'react-router';
import HomePage from './pages/HomePage';
import ProblemsPage from './pages/ProblemsPage';
import DashboardPage from './pages/DashboardPage';

function App() {

  const {isSignedIn , isLoaded} =useUser()

  if(!isLoaded) return null;
  return (
    <>
    <Routes>

      <Route path= "/" element={!isSignedIn ? <HomePage/>: <Navigate to={"dashboard"}/>}/>
        <Route path= "/dashboard" element={ isSignedIn ? <DashboardPage/>: <Navigate to={"/"}/>}/>
      <Route path= "/problems" element={ isSignedIn ? <ProblemsPage/> : <Navigate to={"/"}/>}/>



       </Routes>
       </>
  );
}

export default App


// tw,dausy,react-router,react-toast
//react-query,axios