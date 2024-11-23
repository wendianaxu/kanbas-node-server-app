const assignment = {
    id: 1, title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10", completed: false, score: 0,
};
const module = {
    id: 1, 
    name: "NodeJS",
    description: "NodeJS is a JavaScript runtime built on Chrome's V8 JavaScript engine.",
    course: "CS572",
}

export default function WorkingWithObjects(app) {
    app.get("/lab5/assignment", (req, res) => {
        res.json(assignment); // respond with the assignment object in JSON format
    });
    app.get("/lab5/assignment/title", (req, res) => {
        res.json(assignment.title);
    });
    app.get("/lab5/assignment/title/:newTitle", (req, res) => {
        const { newTitle } = req.params; // extract the newTitle parameter from the request
        assignment.title = newTitle; // update the title property
        res.json(assignment);
      });
    
    app.get("/lab5/module", (req, res) => {
        res.json(module);
    });
    app.get("/lab5/module/name", (req, res) => {
        res.json(module.name);
    });
    app.get("/lab5/module/score/:newName", (req, res) => {
        const { newName } = req.params;
        module.name = newName;
        res.json(module);
    });
    app.get("/lab5/assignment/score/:newScore", (req, res) => {
        const { newScore } = req.params;
        assignment.score = newScore;
        res.json(assignment);
    });
    app.get("/lab5/assignment/completed/:toggleCompleted", (req, res) => {
        const { toggleCompleted } = req.params;
        assignment.completed = toggleCompleted;
        res.json(assignment);
    });
    app.get("/lab5/module/description/:newDes", (req, res) => {
        const { newDes } = req.params;
        module.description = newDes;
        res.json(module);
    });
};

