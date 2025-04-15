import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const COURSES_API = `${REMOTE_SERVER}/api/courses`;
const ENROLLMENTS_API = `${REMOTE_SERVER}/api/enrollments`;
export const fetchAllCourses = async () => {
  const { data } = await axiosWithCredentials.get(`${COURSES_API}`);
  return data;
};
export const fetchAllEnrollments = async () => {
  const { data } = await axiosWithCredentials.get(`${ENROLLMENTS_API}`);
  return data;
};
export const deleteCourse = async (id: string) => {
  const { data } = await axiosWithCredentials.delete(`${COURSES_API}/${id}`);
  return data;
};
export const updateCourse = async (course: any) => {
  const { data } = await axiosWithCredentials.put(
    `${COURSES_API}/${course._id}`,
    course
  );
  return data;
};
export const findModulesForCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.get(
    `${COURSES_API}/${courseId}/modules`
  );
  return response.data;
};
export const createModuleForCourse = async (courseId: string, module: any) => {
  const response = await axiosWithCredentials.post(
    `${COURSES_API}/${courseId}/modules`,
    module
  );
  return response.data;
};
export const findAssignmentsForCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.get(
    `${COURSES_API}/${courseId}/assignments`
  );
  return response.data;
};
export const createAssignmentForCourse = async (
  courseId: string,
  assignment: any
) => {
  const response = await axiosWithCredentials.post(
    `${COURSES_API}/${courseId}/assignments`,
    assignment
  );
  return response.data;
};
export const findEnrollmentsForCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.get(
    `${COURSES_API}/${courseId}/enrollments`
  );
  return response.data;
};
export async function addUserToCourse(courseId: string, userId: string) {
  try {
    const response = await axiosWithCredentials.post(
      `${COURSES_API}/${courseId}/enrollments/${userId}`
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error in addUserToCourse:",
      error.response?.data || error.message
    );
    throw error;
  }
}
export async function deleteUserFromCourse(courseId: string, userId: string) {
  try {
    const response = await axiosWithCredentials.delete(
      `${COURSES_API}/${courseId}/enrollments/unenroll/${userId}`
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error in deleteUserFromCourse:",
      error.response?.data || error.message
    );
    throw error;
  }
}
export const findQuizzesForCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.get(
    `${COURSES_API}/${courseId}/quizzes`
  );
  return response.data;
};
