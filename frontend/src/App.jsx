
import './App.css'
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react';

function App() {
  return (
    <>
    <h1>Welcome</h1>
     <SignedOut>
    <SignInButton mode="modal"> 
      
    </SignInButton>
    </SignedOut>

    <SignedIn>
     <SignOutButton />
    </SignedIn>

    <SignedIn>
    <UserButton />
     </SignedIn>
       </>
  );
}

export default App
