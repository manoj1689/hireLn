import React from 'react'
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, provider } from "../../firebase/firebaseConfig";
import { signInWithPopup, signOut, User } from "firebase/auth";
function index() {
  const router=useRouter();
 
    const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/"); 
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <div className='container mx-auto my-12'>
    <div className='text-2xl'>Dashboard Page</div>
    <div>
          <button
            onClick={handleSignOut}
            className="mt-4 p-2 bg-red-500 cursor-pointer text-white rounded-lg shadow-lg hover:bg-red-600"
          >
            Sign Out
          </button></div>
    </div>
  )
}

export default index