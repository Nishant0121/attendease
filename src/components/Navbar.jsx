"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const navigateTo = (path) => {
    router.push(path);
  };

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Brand Name */}
        <div className="text-xl font-bold">
          <button
            className="focus:outline-none text-white"
            onClick={() => navigateTo("/")}
          >
            MyApp
          </button>
        </div>

        {/* Navigation Buttons */}
        <div className="space-x-4">
          <button
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg focus:outline-none"
            onClick={() => navigateTo("/profile")}
          >
            Profile
          </button>
          <button
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg focus:outline-none"
            onClick={() => navigateTo("/dashboard")}
          >
            Dashboard
          </button>
        </div>
      </div>
    </nav>
  );
}
