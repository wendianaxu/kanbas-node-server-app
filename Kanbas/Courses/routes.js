import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";
import * as assignmentsDao from "../Assignments/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app) {
    app.get("/api/courses", async (req, res) => {
        const courses = await dao.findAllCourses();
        res.send(courses);
    });

    app.delete("/api/courses/:courseId", async (req, res) => {
        const { courseId } = req.params;
        const status = await dao.deleteCourse(courseId);
        res.send(status);
    });

    app.put("/api/courses/:courseId", async (req, res) => {
        const { courseId } = req.params;
        const courseUpdates = req.body;
        const status = await dao.updateCourse(courseId, courseUpdates);
        res.send(status);
    });

    app.post("/api/courses", async (req, res) => {
        const course = await dao.createCourse(req.body);
        const currentUser = req.session["currentUser"];
        if (currentUser) {
            await enrollmentsDao.enrollUserInCourse(currentUser._id, course._id); // enroll the current user in the course they created
        }
        res.json(course);
    });

    app.get("/api/courses/:courseId/modules", async (req, res) => { // get modules for a course
        const { courseId } = req.params;
        const modules = await modulesDao.findModulesForCourse(courseId);
        res.json(modules);
    });

    app.post("/api/courses/:courseId/modules", async (req, res) => { // create a new module for a course
        const { courseId } = req.params; // extract courseId from request parameters
        const module = { // create the new module object and set courseId
            ...req.body,
            course: courseId,
        };
        const newModule = await modulesDao.createModule(module); // create the new module
        res.send(newModule);
    });

    app.get("/api/courses/:courseId/assignments", async (req, res) => { // get assignments for a course
        const { courseId } = req.params;
        const assignments = await assignmentsDao.findAssignmentsForCourse(courseId);
        res.json(assignments);
    });

    app.post("/api/courses/:courseId/assignments", async (req, res) => { // create a new assignment for a course
        const { courseId } = req.params; // extract courseId from request parameters
        const assignment = {
            ...req.body,
            course: courseId,
        };
        const newAssignment = await assignmentsDao.createAssignment(assignment);
        res.send(newAssignment);
    });

    const findUsersForCourse = async (req, res) => { // retrieve the users enrolled in a course
        const { cid } = req.params;
        const users = await enrollmentsDao.findUsersForCourse(cid);
        res.json(users);
    };
    app.get("/api/courses/:cid/users", findUsersForCourse);

}
