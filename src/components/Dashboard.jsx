"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import data from "../data/timetable.json";
import Timetable from "./Timetable";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import useAttedance from "@/hooks/useAttedance";

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [day, setDay] = useState("");
  const [timetable, setTimetable] = useState(null);
  const [auth, setAuth] = useState(false);
  const [attendanceUpdated, setAttendanceUpdated] = useState(null);
  const { loginuser, loading, logOut } = useAuth();
  const router = useRouter();
  const { updateAttendanceForUser } = useAttedance();

  useEffect(() => {
    if (!loading && loginuser) {
      setAuth(true);
      checkAttendanceForSelectedDate();
    } else if (!loading && !loginuser) {
      router.push("/login");
    }
  }, [loading, loginuser, selectedDate]);

  console.log(JSON.stringify(loginuser));

  const loadScheduleForDay = (dayOfWeek) => {
    if (!loginuser) return;
    const batch = data.batches.find((b) => b.batch === loginuser.batch);
    if (batch) {
      const daySchedule = batch.timetable.find(
        (entry) => entry.dayOfWeek === dayOfWeek
      );
      setTimetable(daySchedule || null);
    } else {
      setTimetable(null);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    checkAttendanceForSelectedDate(); // Refresh attendance when the date changes
  };

  const checkAttendanceForSelectedDate = async () => {
    if (!loginuser) return;

    try {
      const attendanceRef = collection(db, "attendance");

      // Convert selectedDate to a date-only ISO string (e.g., "2025-01-16")
      const dateOnly = format(selectedDate, "yyyy-MM-dd");

      // Query Firestore for attendance records matching the user and date
      const attendanceQuery = query(
        attendanceRef,
        where("userId", "==", loginuser.uid),
        where("date", "==", dateOnly) // Match only the date part
      );

      const querySnapshot = await getDocs(attendanceQuery);

      if (!querySnapshot.empty) {
        // Attendance exists for this date
        const attendanceDoc = querySnapshot.docs[0].data();
        setAttendanceUpdated(attendanceDoc.attendance); // Set updated attendance
        setTimetable(null); // Clear timetable if attendance is already updated
      } else {
        // No attendance found, load timetable for the selected day
        setAttendanceUpdated(null);
        loadScheduleForDay(format(selectedDate, "EEEE"));
      }
    } catch (error) {
      console.error("Error checking attendance:", error);
      alert("Failed to check attendance. Please try again.");
    }
  };

  const handleAttendanceSave = async (attendanceUpdates) => {
    if (!loginuser || !loginuser.attendance) return;

    try {
      const userRef = doc(db, "users", loginuser.uid);

      // Update total count for all subjects scheduled for the selected day
      const selectedDay = format(selectedDate, "EEEE");
      const batch = data.batches.find((b) => b.batch === loginuser.batch);

      if (!batch) {
        console.error("User batch not found in timetable data.");
        return;
      }

      const daySchedule = batch.timetable.find(
        (entry) => entry.dayOfWeek === selectedDay
      );

      if (!daySchedule) {
        console.log(`No schedule found for ${selectedDay}.`);
        return;
      }

      // Increment the total count for subjects scheduled for the day
      const updatedAttendance = loginuser.attendance.map((subjectRecord) => {
        const isScheduled = daySchedule.schedule.some(
          (session) => session.subject === subjectRecord.subject
        );
        if (isScheduled) {
          return {
            ...subjectRecord,
            total: subjectRecord.total + 1,
          };
        }
        return subjectRecord;
      });

      // Update the attended count based on user selections (checkbox values)
      const finalAttendance = updatedAttendance.map((subjectRecord) => {
        const update = attendanceUpdates.find(
          (u) => u.subject === subjectRecord.subject
        );
        if (update && update.attended) {
          return {
            ...subjectRecord,
            attended: subjectRecord.attended + 1,
          };
        }
        return subjectRecord;
      });

      // Save the updated attendance to Firestore
      await updateDoc(userRef, { attendance: finalAttendance });

      // Also record attendance in the `attendance` collection for the selected day
      const attendanceRef = collection(db, "attendance");

      const dateOnly = format(selectedDate, "yyyy-MM-dd");

      const attendanceQuery = query(
        attendanceRef,
        where("userId", "==", loginuser.uid),
        where("date", "==", dateOnly)
      );

      const querySnapshot = await getDocs(attendanceQuery);

      if (querySnapshot.empty) {
        // Add a new attendance record
        await addDoc(attendanceRef, {
          userId: loginuser.uid,
          date: dateOnly,
          attendance: attendanceUpdates,
        });
      } else {
        // Update existing attendance record
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          attendance: attendanceUpdates,
        });
      }

      alert("Attendance saved successfully!");
      checkAttendanceForSelectedDate(); // Refresh attendance
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Failed to save attendance. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!loginuser) {
    router.push("/login");
    return null;
  }

  return (
    <div>
      <div className="mb-6 mx-auto flex items-center justify-center max-w-[1000px]">
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="MMMM d, yyyy"
          className="p-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:ring-blue-400"
        />
      </div>

      {attendanceUpdated ? (
        <div className="max-w-[800px] mx-auto p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
            Attendance Updated for {format(selectedDate, "MMMM d, yyyy")}
          </h2>
          <ul className="space-y-2">
            {attendanceUpdated.map((subject) => (
              <li
                key={subject.subject}
                className="flex justify-between items-center p-3 bg-gray-100 rounded-lg border border-gray-200"
              >
                <span className="text-lg font-medium text-gray-700">
                  {subject.subject}
                </span>
                <span className="text-lg font-semibold text-blue-600">
                  {subject.attended}/{subject.total}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : timetable ? (
        <Timetable
          schedule={timetable.schedule}
          onSaveAttendance={handleAttendanceSave}
        />
      ) : format(selectedDate, "EEEE") === "Sunday" ||
        format(selectedDate, "EEEE") === "Saturday" ? (
        <p className="text-center text-lg font-semibold text-gray-700 dark:text-gray-300">
          Bro, it’s a holiday! Just enjoy...!!
          <span className="block text-blue-500 text-sm mt-1">
            "Attendance..... ye sab moh maya hai!"
          </span>
        </p>
      ) : (
        <p className="text-center text-gray-500">
          No timetable available for the selected date.
        </p>
      )}
    </div>
  );
}
