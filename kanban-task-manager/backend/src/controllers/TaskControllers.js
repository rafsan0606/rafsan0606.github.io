import Task from "../models/Task.js";

import { FEATURE_SEND_EMAIL } from "../env.js";

export const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();

        // if (FEATURE_SEND_EMAIL) {
        //     console.log("[FEATURE_SEND_EMAIL] would send email for task");
        // }

        res.status(200).json({ message: "Tasks retrieved successfully", tasks});
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({message: "Error fetching tasks" });
    }
}

export const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        // if (FEATURE_SEND_EMAIL) {
        //     console.log("[FEATURE_SEND_EMAIL] would send email for task");
        // }
        res.status(200).json({ message: "Task retrieved successfully", task });
    } catch (error) {
        console.error("Error fetching task:", error);
        res.status(500).json({message: "Error fetching task" });
    }
}

export const getAllAssignedUsers = async (req, res) => {
    try {
        const assignedUsers = await Task.distinct("assignedUser");
        return res.status(200).json({ message: "Assigned users retrieved successfully", assignedUsers });
    } catch (error) {
        console.error("Error fetching assigned users:", error);
        res.status(500).json({message: "Error fetching assigned users" });
    }
}

export const createTask = async (req, res) => {
    try {
        const { name, description, tag, priority, assignedUser, dueDate, status } = req.body;
        if(!name && !assignedUser) {
            res.status(400).json({message: "Invalid Task ID"})
        }
        const task = new Task({ name, description, tag, priority, assignedUser, dueDate, status });
        const newTask = await task.save();

        // if (FEATURE_SEND_EMAIL) {
        //     console.log("[FEATURE_SEND_EMAIL] would send email for task");
        // }

        res.status(201).json({ message: "Task created successfully", task: newTask });
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({message: "Error creating task" });
    }
}

export const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        Object.keys(req.body).forEach(key => {
            task[key] = req.body[key];
        });
        const updatedTask = await task.save();

        // if (FEATURE_SEND_EMAIL) {
        //     console.log("[FEATURE_SEND_EMAIL] would send email for task");
        // }
        res.status(200).json({ message: "Task updated successfully", task: updatedTask });
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: "Error updating task" });
    }
}

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        // if (FEATURE_SEND_EMAIL) {
        //     console.log("[FEATURE_SEND_EMAIL] would send email for task");
        // }
        res.status(200).json({ message: "Task deleted successfully", task: deletedTask });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({message: "Error deleting task" });
    }
}