// api to interact with the database
import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("UserModel", schema); // create a model from the schema
export default model;