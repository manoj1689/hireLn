import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, provider } from "../../firebase/firebaseConfig";
import { signInWithPopup, signOut, User } from "firebase/auth";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter(); // Initialize router

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        router.push("/Dashboard"); // Redirect to chat page if already logged in
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push("/Dashboard"); // Redirect after successful login
    } catch (error) {
      console.error("Login failed:", error);
    }
  };




  return (
    <div className="flex flex-col items-center justify-center  ">
    

      {!user ? (
        <button
          onClick={handleSignIn}
          className="flex items-center py-2 px-4 text-[#15B8A6] rounded-full bg-white"
        >
          
          Sign In
        </button>
      ) : (
        <>
          
        </>
      )}
    </div>
  );
}
