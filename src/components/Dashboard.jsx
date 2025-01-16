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

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timetable, setTimetable] = useState(null);
  const [auth, setAuth] = useState(false);
  const [attendanceUpdated, setAttendanceUpdated] = useState(null);
  const { loginuser, loading, logOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && loginuser) {
      setAuth(true);
      checkAttendanceForSelectedDate();
    } else if (!loading && !loginuser) {
      router.push("/login");
    }
  }, [loading, loginuser, selectedDate]);

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

      const updatedAttendance = loginuser.attendance.map((subject) => {
        const update = attendanceUpdates.find(
          (u) => u.subject === subject.subject
        );
        if (update) {
          return {
            ...subject,
            attended: subject.attended + update.attended,
          };
        }
        return subject;
      });

      await updateDoc(userRef, { attendance: updatedAttendance });

      const attendanceRef = collection(db, "attendance");

      const dateOnly = format(selectedDate, "yyyy-MM-dd"); // Ensure date-only format

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
        // Update existing record
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
      <div className="mb-4">
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="MMMM d, yyyy"
          className="p-2 border border-zinc-200 rounded dark:border-zinc-800"
        />
      </div>

      {attendanceUpdated ? (
        <div>
          <h2>Attendance Updated for {format(selectedDate, "MMMM d, yyyy")}</h2>
          <ul>
            {attendanceUpdated.map((subject) => (
              <li key={subject.subject}>
                {subject.subject}: {subject.attended}/{subject.total}
              </li>
            ))}
          </ul>
        </div>
      ) : timetable ? (
        <Timetable
          schedule={timetable.schedule}
          onSaveAttendance={handleAttendanceSave}
        />
      ) : (
        <p>No schedule available for the selected date.</p>
      )}
    </div>
  );
}
