"use client";

import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useAuth } from "@/hooks/useAuth";

import Loading from "@/components/Loading";
import { useRouter } from "next/navigation"; // Make sure useRouter is imported
import useAttedance from "@/hooks/useAttedance";

// Register the necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Profile() {
  const { loginuser, loading, logout } = useAuth(); // Assuming `logout` is available from useAuth hook
  const router = useRouter();
  const { updateAttendanceForAllUsers } = useAttedance();

  // Redirect to login if no user is found
  if (loading) {
    return <Loading />;
  }

  if (!loginuser) {
    router.push("/login");
    return null; // Prevent further rendering if the user is not logged in
  }

  const calculatePercentage = (attended, total) => {
    if (total === 0) return 0;
    return ((attended / total) * 100).toFixed(2);
  };

  const calculateOverallAttendance = (attendance) => {
    const totalAttended = attendance.reduce(
      (sum, sub) => sum + sub.attended,
      0
    );
    const totalClasses = attendance.reduce((sum, sub) => sum + sub.total, 0);
    return {
      percentage: calculatePercentage(totalAttended, totalClasses),
      attended: totalAttended,
      total: totalClasses,
    };
  };

  const overallAttendance = calculateOverallAttendance(loginuser.attendance);

  const overallData = {
    labels: ["Attended", "Missed"],
    datasets: [
      {
        data: [
          overallAttendance.attended,
          overallAttendance.total - overallAttendance.attended,
        ],
        backgroundColor: ["#4caf50", "#f44336"],
        hoverBackgroundColor: ["#66bb6a", "#ef5350"],
      },
    ],
  };

  // Logout handler
  const handleLogout = () => {
    logout(); // Call the logout function from the useAuth hook
    router.push("/login"); // Redirect to login page after logout
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Profile</h1>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mb-6 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Logout
        </button>

        {loginuser.name == "Nishant" ? (
          <button
            onClick={async () => await updateAttendanceForAllUsers()}
            className="mb-6 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        ) : (
          ""
        )}

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">
            {loginuser.name}
          </h2>
          <p className="text-gray-600">
            <strong>Email:</strong> {loginuser.email}
          </p>
          <p className="text-gray-600">
            <strong>Roll Number:</strong> {loginuser.rollNumber}
          </p>
          <p className="text-gray-600">
            <strong>Branch:</strong> {loginuser.branch}
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Overall Attendance
        </h2>
        <div className="flex justify-center mb-6">
          <div className="bg-gray-50 shadow rounded-lg p-4 flex flex-col items-center">
            <div className="w-40 h-40">
              <Pie data={overallData} />
            </div>
            <p className="text-gray-600 mt-2">
              <strong>Overall Attendance:</strong>{" "}
              {overallAttendance.percentage}%
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Attendance Report by Subject
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {loginuser.attendance.map((subject, index) => {
            const percentage = calculatePercentage(
              subject.attended,
              subject.total
            );

            const data = {
              labels: ["Attended", "Missed"],
              datasets: [
                {
                  data: [subject.attended, subject.total - subject.attended],
                  backgroundColor: ["#4caf50", "#f44336"],
                  hoverBackgroundColor: ["#66bb6a", "#ef5350"],
                },
              ],
            };

            return (
              <div
                key={index}
                className="bg-gray-50 shadow rounded-lg p-4 flex flex-col items-center"
              >
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {subject.subject}
                </h3>
                <div className="w-32 h-32">
                  <Pie data={data} />
                </div>
                <p className="text-gray-600 mt-2">
                  <strong>Attendance:</strong> {percentage}%
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
