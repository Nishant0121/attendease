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
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-zinc-200 dark:border-zinc-800">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">Time</th>
            <th className="py-2 px-4 border-b">Subject</th>
            <th className="py-2 px-4 border-b">Attendance</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{item.time}</td>
              <td className="py-2 px-4 border-b">{item.subject}</td>
              <td className="py-2 px-4 border-b">
                <input
                  type="checkbox"
                  checked={attendance[item.subject]?.attended || false}
                  onChange={() => handleCheckboxChange(index, item.subject)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleSave}
        className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
      >
        Save Attendance
      </button>
    </div>
  );
}
