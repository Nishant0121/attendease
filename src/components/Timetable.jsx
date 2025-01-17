"use client";

import { useState } from "react";

export default function Timetable({ schedule, onSaveAttendance }) {
  const [attendance, setAttendance] = useState({});

  const handleCheckboxChange = (index, subject) => {
    setAttendance((prev) => ({
      ...prev,
      [subject]: {
        ...prev[subject],
        attended: prev[subject]?.attended || false ? false : true,
      },
    }));
  };

  const handleSave = () => {
    // Convert attendance object to the format needed for Firebase
    const attendanceUpdates = Object.entries(attendance).map(
      ([subject, data]) => ({
        subject,
        attended: data.attended ? 1 : 0,
        total: 1,
      })
    );
    onSaveAttendance(attendanceUpdates);
  };

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-900 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="py-3 px-5 text-left text-gray-700 font-semibold border-b dark:text-gray-300">
              Time
            </th>
            <th className="py-3 px-5 text-left text-gray-700 font-semibold border-b dark:text-gray-300">
              Subject
            </th>
            <th className="py-3 px-5 text-center text-gray-700 font-semibold border-b dark:text-gray-300">
              Attendance
            </th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="py-3 px-5 border-b dark:border-gray-700 text-gray-700 dark:text-gray-300">
                {item.time}
              </td>
              <td className="py-3 px-5 border-b dark:border-gray-700 text-gray-700 dark:text-gray-300">
                {item.subject}
              </td>
              <td className="py-3 px-5 border-b dark:border-gray-700 text-center">
                <input
                  type="checkbox"
                  checked={attendance[item.subject]?.attended || false}
                  onChange={() => handleCheckboxChange(index, item.subject)}
                  className="form-checkbox h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500 rounded dark:focus:ring-blue-400"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleSave}
        className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-200"
      >
        Save Attendance
      </button>
    </div>
  );
}
