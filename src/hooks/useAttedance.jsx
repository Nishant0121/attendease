import { db } from "@/firebase/config";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import timetableData from "@/data/timetable.json";
import React from "react";

export default function useAttedance() {
  // Function to update attendance for all users based on the current day
  const updateAttendanceForAllUsers = async () => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Get the current day
    const today = new Date();
    const currentDay = "Thursday";

    try {
      // Fetch all user data from Firestore
      const userCollectionRef = collection(db, "users");
      const userSnapshots = await getDocs(userCollectionRef);

      userSnapshots.forEach(async (userSnap) => {
        if (!userSnap.exists()) {
          console.error("User data not found in Firestore.");
          return;
        }

        const userInfo = userSnap.data();

        // Find the user's batch timetable
        const userBatch = userInfo.batch;
        const userTimetable = timetableData.batches.find(
          (batch) => batch.batch === userBatch
        );

        if (!userTimetable) {
          console.error("Batch timetable not found for user.");
          return;
        }

        // Find today's schedule
        const todaySchedule = userTimetable.timetable.find(
          (day) => day.dayOfWeek === currentDay
        );

        if (!todaySchedule) {
          console.log(`No schedule found for ${currentDay}.`);
          return;
        }

        // Update attendance for subjects in today's schedule
        todaySchedule.schedule.forEach((session) => {
          const subject = session.subject;

          // Find the corresponding subject in the user's attendance
          const attendanceRecord = userInfo.attendance.find(
            (record) => record.subject === subject
          );

          if (attendanceRecord) {
            // Increment the total count for this subject
            attendanceRecord.total += 1;
          } else {
            console.warn(`Subject ${subject} not found in user's attendance.`);
          }
        });

        // Save the updated attendance back to Firestore
        await updateDoc(doc(db, "users", userSnap.id), {
          attendance: userInfo.attendance,
        });

        console.log("Attendance updated for today:", currentDay);
      });
    } catch (error) {
      console.error("Error updating attendance for all users:", error);
    }
  };

  const updateAttendanceForUser = async (userId, dayOfWeek) => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Get the current day
    const today = new Date();
    const currentDay = dayOfWeek;

    try {
      // Fetch the user's data from Firestore using their ID
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.error("User data not found in Firestore.");
        return;
      }

      const userInfo = userSnap.data();

      // Find the user's batch timetable
      const userBatch = userInfo.batch;
      const userTimetable = timetableData.batches.find(
        (batch) => batch.batch === userBatch
      );

      if (!userTimetable) {
        console.error("Batch timetable not found for user.");
        return;
      }

      // Find today's schedule
      const todaySchedule = userTimetable.timetable.find(
        (day) => day.dayOfWeek === currentDay
      );

      if (!todaySchedule) {
        console.log(`No schedule found for ${currentDay}.`);
        return;
      }

      // Update attendance for subjects in today's schedule
      todaySchedule.schedule.forEach((session) => {
        const subject = session.subject;

        // Find the corresponding subject in the user's attendance
        const attendanceRecord = userInfo.attendance.find(
          (record) => record.subject === subject
        );

        if (attendanceRecord) {
          // Increment the total count for this subject
          attendanceRecord.total += 1;
        } else {
          console.warn(`Subject ${subject} not found in user's attendance.`);
        }
      });

      // Save the updated attendance back to Firestore
      await updateDoc(userRef, {
        attendance: userInfo.attendance,
      });

      console.log("Attendance updated for user:", userId);
    } catch (error) {
      console.error("Error updating attendance for user:", error);
    }
  };

  return { updateAttendanceForAllUsers, updateAttendanceForUser };
}
