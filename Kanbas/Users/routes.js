import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

//let currentUser = null;

export default function UserRoutes(app) {
    const createCourse = (req, res) => {
        const currentUser = req.session["currentUser"];
        const newCourse = courseDao.createCourse(req.body);
        enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
        res.json(newCourse);
    };
    app.post("/api/users/current/courses", createCourse);

    const createUser = (req, res) => { };
    const deleteUser = (req, res) => { };
    const findAllUsers = (req, res) => { };
    const findUserById = (req, res) => { };
    const updateUser = (req, res) => {
        const userId = req.params.userId; // extract userId from url
        const userUpdates = req.body; // extract user updates from request body
        dao.updateUser(userId, userUpdates);  // update user in database
        const currentUser = dao.findUserById(userId); // update currentUser
        req.session["currentUser"] = currentUser; // update session
        res.json(currentUser);
    };
    const signup = (req, res) => {
        const user = dao.findUserByUsername(req.body.username);
        if (user) {
            res.status(400).json(
                { message: "Username already in use" });
            return;
        }
        const currentUser = dao.createUser(req.body);
        req.session["currentUser"] = currentUser; // update session
        res.json(currentUser);

    };
    const signin = (req, res) => {
        const { username, password } = req.body; // extract username and password from request body
        const currentUser = dao.findUserByCredentials(username, password);
        if (currentUser) { // if user is found
            req.session["currentUser"] = currentUser;
            res.json(currentUser); // return the current user to the client
        } else {
            res.status(401).json({ message: "Unable to login. Try again later." });
        }

    };
    const signout = (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    };
    const profile = async (req, res) => {
        const currentUser = req.session["currentUser"]; // extract current user from session
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        res.json(currentUser); // return the current user to the client
    };

    const findCoursesForEnrolledUser = (req, res) => {
        let { userId } = req.params;
        if (userId === "current") {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            userId = currentUser._id;
        }
        const courses = courseDao.findCoursesForEnrolledUser(userId);
        res.json(courses);
    };
    
    app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);

    app.post("/api/users", createUser);
    app.get("/api/users", findAllUsers);
    app.get("/api/users/:userId", findUserById);
    app.put("/api/users/:userId", updateUser);
    app.delete("/api/users/:userId", deleteUser);
    app.post("/api/users/signup", signup);
    app.post("/api/users/signin", signin);
    app.post("/api/users/signout", signout);
    app.post("/api/users/profile", profile);
}
