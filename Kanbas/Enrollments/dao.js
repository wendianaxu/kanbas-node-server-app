import Database from "../Database/index.js";

export function getEnrollmentsByUser(userId) { 
  const { enrollments } = Database;
  return enrollments.filter((enrollment) => enrollment.user === userId);
}

export function enrollUserInCourse(courseId, userId) {
  const { enrollments } = Database;
  enrollments.push({ _id: Date.now(), user: userId, course: courseId });
}

export function unenrollUserFromCourse(courseId, userId) {
  const { enrollments } = Database;
  Database.enrollments = enrollments.filter(
    (enrollment) => !(enrollment.course === courseId && enrollment.user === userId)
  );
}

