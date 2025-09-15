"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          await fetch(`${'http://vibebitstest-env.eba-ubvupniq.ap-south-1.elasticbeanstalk.com/api'}/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        }
      } catch (e) {}
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setTimeout(() => {
        router.push("/login");
      }, 1200);
    };
    logout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-vibe-bg px-4 sm:px-0">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 text-center w-full max-w-md">
        <h1 className="text-xl sm:text-2xl font-bold text-vibe-brown mb-4">You have been logged out</h1>
        <p className="text-vibe-brown/70">Redirecting to login...</p>
      </div>
    </div>
  );
};

export default LogoutPage;
