import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

//let currentUser = null;

export default function UserRoutes(app) {
    const createCourse = async (req, res) => {
        const currentUser = req.session["currentUser"];
        const newCourse = await courseDao.createCourse(req.body);
        await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
        res.json(newCourse);
    };
    app.post("/api/users/current/courses", createCourse);

    const createUser = async (req, res) => {
        const user = await dao.createUser(req.body);
        res.json(user);
      };
    
    const deleteUser = async (req, res) => {
        const status = await dao.deleteUser(req.params.userId);
        res.json(status);
    };
    const findAllUsers = async (req, res) => {
        const { role, name } = req.query;
        if (role) {
            const users = await dao.findUsersByRole(role);
            res.json(users);
            return;
        }

        if (name) {
            const users = await dao.findUsersByPartialName(name);
            res.json(users);
            return;
        }

        const users = await dao.findAllUsers();
        res.json(users);
    };
    const findUserById = async (req, res) => {
        const user = await dao.findUserById(req.params.userId);
        res.json(user);
    };
    const updateUser = async (req, res) => {
        const userId = req.params.userId; // extract userId from url
        const userUpdates = req.body; // extract user updates from request body
        await dao.updateUser(userId, userUpdates);  // update user in database
        const currentUser =  req.session["currentUser"];
        if (currentUser && currentUser._id === userId) { // if the updated user is the current user
          req.session["currentUser"] = { ...currentUser, ...userUpdates }; // update the current user in session
        }     
        res.json(currentUser);
    };
    const signup = async (req, res) => {
        const user = await dao.findUserByUsername(req.body.username);
        if (user) {
            res.status(400).json(
                { message: "Username already in use" });
            return;
        }
        const currentUser = await dao.createUser(req.body);
        req.session["currentUser"] = currentUser; // update session
        res.json(currentUser);

    };
    const signin = async (req, res) => {
        const { username, password } = req.body; // extract username and password from request body
        const currentUser = await dao.findUserByCredentials(username, password);
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

    const findCoursesForEnrolledUser = async (req, res) => {
        let { userId } = req.params;
        if (userId === "current") {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            userId = currentUser._id;
        }
        const courses = await courseDao.findCoursesForEnrolledUser(userId);
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
