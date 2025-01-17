"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AlignEndVertical, CircleUserRound } from "lucide-react";

export default function Navbar() {
  const router = useRouter();

  const navigateTo = (path) => {
    router.push(path);
  };

  return (
    <nav className="bg-gray-50 text-indigo-600 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Brand Name */}
        <div className="text-xl font-bold">
          <button
            className="focus:outline-none text-indigo-600"
            onClick={() => navigateTo("/")}
          >
            AttendEase
          </button>
        </div>

        {/* Navigation Buttons */}
        <div className="space-x-4 flex">
          <button
            className="px-4 py-2 bg-gray-100 flex justify-between hover:bg-gray-200 rounded-lg focus:outline-none"
            onClick={() => navigateTo("/profile")}
          >
            <span>
              <CircleUserRound />
            </span>
            <span> Profile</span>
          </button>
          <button
            className="px-4 py-2 bg-gray-100 flex justify-between hover:bg-gray-200 rounded-lg focus:outline-none"
            onClick={() => navigateTo("/dashboard")}
          >
            <AlignEndVertical />
            Dashboard
          </button>
        </div>
      </div>
    </nav>
  );
}
