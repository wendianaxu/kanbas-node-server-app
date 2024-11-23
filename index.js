import "dotenv/config";
import express from "express";
import Hello from "./Hello.js"; // import Hello function from Hello.js
import Lab5 from "./Lab5/index.js";
import WorkingWithObjects from "./Lab5/WorkingWithObjects.js";
import WorkingWithArrays from "./Lab5/WorkingWithArrays.js";
import cors from "cors";
import UserRoutes from "./Kanbas/Users/routes.js";
import CourseRoutes from "./Kanbas/Courses/routes.js";
import session from "express-session";
import ModuleRoutes from "./Kanbas/Modules/routes.js";
import AssignmentRoutes from "./Kanbas/Assignments/routes.js";
import EnrollmentRoutes from "./Kanbas/Enrollments/routes.js";


const app = express();
app.use(
    cors({ // enable CORS for all requests
        credentials: true, // support cookies
        origin: process.env.NETLIFY_URL || "http://localhost:3000", // restrict cross origin resource sharing to the react application
    }

    ));

const sessionOptions = {
    secret: process.env.SESSION_SECRET || "kanbas",
    resave: false,
    saveUninitialized: false,
};
if (process.env.NODE_ENV !== "development") { // if not running in development mode (when deployed)
    sessionOptions.proxy = true;
    sessionOptions.cookie = {
        sameSite: "none",
        secure: true,
        domain: process.env.NODE_SERVER_DOMAIN,
    };
}
app.use(session(sessionOptions));


app.use(express.json()); // enable parsing JSON bodies for POST requests
UserRoutes(app); // pass app reference to UserRoutes function
CourseRoutes(app);
ModuleRoutes(app);
AssignmentRoutes(app);
EnrollmentRoutes(app);

Hello(app); // pass app reference to Hello function
Lab5(app);
WorkingWithObjects(app);
WorkingWithArrays(app);
app.listen(process.env.PORT || 4000); // listens to HTTP requests on the remote PORT environment if available, or port 4000 when running locally