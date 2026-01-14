import express from "express";


import { getAllTasks, getTaskById, getAllAssignedUsers, createTask , deleteTask, updateTask } from "../controllers/TaskControllers.js";

const router = express.Router();

router.get("/", (_req, res) => {
	res.json({
		message: "API - 👋🌎🌍🌏",
	});
});


router.get("/tasks", getAllTasks);
router.get("/tasks/assignedUsers", getAllAssignedUsers);
router.get("/tasks/:id", getTaskById);
router.post("/tasks", createTask);
router.patch("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);

export default router;