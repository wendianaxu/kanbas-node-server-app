import * as assignmentsDao from "./dao.js";

export default function AssignmentRoutes(app) {
    app.delete("/api/assignments/:assignmentId", async (req, res) => { // delete assignment
        const { assignmentId } = req.params;
        const status = await assignmentsDao.deleteAssignment(assignmentId);
        res.send(status); // if successful, send status 204
    });

    app.put("/api/assignments/:assignmentId", async (req, res) => { // update assignment
        const { assignmentId } = req.params;
        const assignmentUpdates = req.body;
        const status = await assignmentsDao.updateAssignment(assignmentId, assignmentUpdates); 
        res.send(status);
    });

}

