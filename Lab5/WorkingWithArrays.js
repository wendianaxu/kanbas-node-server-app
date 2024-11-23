let todos = [{ id: 1, title: "Task 1", completed: false }, { id: 2, title: "Task 2", completed: true },
{ id: 3, title: "Task 3", completed: false }, { id: 4, title: "Task 4", completed: true },];

export default function WorkingWithArrays(app) {
    app.get("/lab5/todos", (req, res) => { // retrieve todos by completed status with query parameter
        const { completed } = req.query;
        if (completed !== undefined) { // if completed query parameter is provided
            const completedBool = completed === "true"; // convert string to boolean
            const completedTodos = todos.filter(
                (t) => t.completed === completedBool); // filter todos by completed status
            res.json(completedTodos);
            return; // make sure to return to exit the function so that the next res.json() is not called
        }

        res.json(todos);
    });

    app.get("/lab5/todos/create", (req, res) => { // has to be before /lab5/todos/:id
        const newTodo = {
            id: new Date().getTime(),
            title: "New Task",
            completed: false,
        };
        todos.push(newTodo);
        res.json(todos);
    });

    app.post("/lab5/todos", (req, res) => {
        const newTodo = { ...req.body, id: new Date().getTime() };
        todos.push(newTodo);
        res.json(newTodo); // only respond with the new todo
    });


    app.get("/lab5/todos/:id", (req, res) => { // retrieve a todo by id
        const { id } = req.params;
        const todo = todos.find((t) => t.id === parseInt(id));
        res.json(todo);
    });

    app.get("/lab5/todos/:id/delete", (req, res) => {
        const { id } = req.params;
        const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
        todos.splice(todoIndex, 1); // remove 1 element at todoIndex
        res.json(todos);
    });

    app.delete("/lab5/todos/:id", (req, res) => {
        const { id } = req.params;
        const todoIndex = todos.findIndex((t) => t.id === parseInt(id));

        if (todoIndex === -1) { // handling errors: if todo is not found, return 404
            res.status(404).json({ message: `Unable to delete Todo with ID ${id}` });
            return;
          }      

        todos.splice(todoIndex, 1);
        res.sendStatus(200); // send a 200 OK status
    });


    app.get("/lab5/todos/:id/title/:title", (req, res) => { // update a todo title by id
        const { id, title } = req.params;
        const todo = todos.find((t) => t.id === parseInt(id));
        todo.title = title;
        res.json(todos);
    });

    app.get("/lab5/todos/:id/completed/:completed", (req, res) => { // update a todo completed status by id
        const { id, completed } = req.params;
        const todo = todos.find((t) => t.id === parseInt(id));
        todo.completed = completed;
        res.json(todos);
    });

    app.get("/lab5/todos/:id/description/:description", (req, res) => { // update a todo description by id
        const { id, description } = req.params;
        const todo = todos.find((t) => t.id === parseInt(id));
        todo.description = description;
        res.json(todos);
    });

    app.put("/lab5/todos/:id", (req, res) => { // modify a todo using put
        const { id } = req.params;

        const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
        if (todoIndex === -1) { // if todo is not found, return 404
          res.status(404).json({ message: `Unable to update Todo with ID ${id}` });
          return;
        }
    
        todos = todos.map((t) => {
            if (t.id === parseInt(id)) {
                return { ...t, ...req.body }; // merge t and req.body; the request body contains the updated fields
            }
            return t;
        });
        res.sendStatus(200);
    });

};
