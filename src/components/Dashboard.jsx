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
    // Redirect to login if not logged in

    // Once the user is logged in, load schedule and attendance
    if (!loading && loginuser) {
      setAuth(true);
      const today = format(new Date(), "EEEE");
      loadScheduleForDay(today);
      checkAttendanceForSelectedDate();
    } else {
      setAuth(false);
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
    const selectedDay = format(date, "EEEE");
    loadScheduleForDay(selectedDay);
    checkAttendanceForSelectedDate();
  };

  const checkAttendanceForSelectedDate = async () => {
    if (!loginuser) return;

    try {
      // Reference to the 'attendance' collection
      const attendanceRef = collection(db, "attendance");

      // Query to check if this user has already updated attendance for the selected date
      const attendanceQuery = query(
        attendanceRef,
        where("userId", "==", loginuser.uid),
        where("date", "==", selectedDate.toISOString()) // Store date as ISO string
      );

      const querySnapshot = await getDocs(attendanceQuery);

      // If an attendance record exists for this date
      if (!querySnapshot.empty) {
        const attendanceDoc = querySnapshot.docs[0].data();
        setAttendanceUpdated(attendanceDoc.attendance); // Set the updated attendance
        setTimetable(null); // Hide timetable if attendance is updated
      } else {
        setAttendanceUpdated(null); // No attendance for this date, show timetable
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
      // Reference to the user's document in the 'users' collection
      const userRef = doc(db, "users", loginuser.uid);

      // Update the attendance in the user's profile
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

      // Update the user's attendance field in Firestore
      await updateDoc(userRef, {
        attendance: updatedAttendance,
      });

      // Reference to the attendance collection
      const attendanceRef = collection(db, "attendance");

      // Add or update a document for the attendance record
      const attendanceQuery = query(
        attendanceRef,
        where("userId", "==", loginuser.uid),
        where("date", "==", selectedDate.toISOString())
      );
      const querySnapshot = await getDocs(attendanceQuery);

      if (querySnapshot.empty) {
        // No record exists for this date, so add a new one
        await addDoc(attendanceRef, {
          userId: loginuser.uid,
          date: selectedDate.toISOString(),
          attendance: attendanceUpdates,
        });
      } else {
        // Update existing record for this date
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          attendance: attendanceUpdates,
        });
      }

      alert("Attendance saved successfully!");
      checkAttendanceForSelectedDate(); // Refresh attendance after saving
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
          <h2>Updated Attendance for {format(selectedDate, "MMMM d, yyyy")}</h2>
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
