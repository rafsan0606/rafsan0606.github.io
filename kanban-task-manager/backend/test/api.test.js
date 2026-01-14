import request from "supertest";
import { describe, expect, it, beforeAll, afterAll } from "vitest";
import mongoose from "mongoose";
import app from "../src/app.js";
import { de } from "zod/v4/locales";
import dotenv from "dotenv"
dotenv.config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_DB_URI_TEST);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase(); 
  await mongoose.connection.close();
});

describe("GET /api", () => {
	it("responds with a json message", () =>
		request(app)
			.get("/api")
			.set("Accept", "application/json")
			.expect("Content-Type", /json/)
			.expect(200, {
				message: "API - 👋🌎🌍🌏",
			}));
});

describe("CRUD /api/tasks", () => {
	let taskId = null;

	// Test creating a new task first then test all API with the created task
       it("/api/tasks - Create a new task", async () => {
	       const response = await request(app)
		       .post("/api/tasks")
		       .send({
			       name: "Test Task",
			       description: "This is a test task",
			       tag: "feature",
			       priority: "high",
			       assignedUser: "user1",
			       dueDate: null,
			       status: "Todo"
		       })
		       .set("Accept", "application/json");

	       expect(response.status).toBe(201)
	       expect(response.body.message).toBe("Task created successfully")
	       expect(response.body.task).toHaveProperty("_id")
	       expect(response.body.task.name).toBe("Test Task")
	       expect(response.body.task.description).toBe("This is a test task")
	       expect(response.body.task.tag).toBe("feature")
	       expect(response.body.task.priority).toBe("high")
	       expect(response.body.task.assignedUser).toBe("user1")
	       expect(response.body.task.status).toBe("Todo")

	       taskId = response.body.task._id
       })

	it("/api/tasks - Get all tasks", async () => {
		const response = await request(app)
			.get("/api/tasks")
			.set("Accept", "application/json");

		expect(response.status).toBe(200)
		expect(response.body.message).toBe("Tasks retrieved successfully")
		expect(response.body.tasks).toBeInstanceOf(Array)
	})

	it("/api/tasks/:id - Get task by Id", async () => {
		const response = await request(app)
			.get(`/api/tasks/${taskId}`)
			.set("Accept", "application/json");

		expect(response.status).toBe(200)
		expect(response.body.message).toBe("Task retrieved successfully")
		expect(response.body.task).toHaveProperty("_id")
		expect(response.body.task._id).toBe(taskId)
	})

       it("/api/tasks/:id - Update task by Id", async () => {
	       const response = await request(app)
		       .patch(`/api/tasks/${taskId}`)
		       .send({
			       name: "Updated Test Task",
			       description: "This is an updated test task",
			       tag: "bugfix",
			       priority: "medium",
			       assignedUser: "user2",
			       dueDate: null,
			       status: "In Progress"
		       })
		       .set("Accept", "application/json");

	       expect(response.status).toBe(200)
	       expect(response.body.message).toBe("Task updated successfully")
	       expect(response.body.task).toHaveProperty("_id")
	       expect(response.body.task._id).toBe(taskId)
	       expect(response.body.task.name).toBe("Updated Test Task")
	       expect(response.body.task.description).toBe("This is an updated test task")
	       expect(response.body.task.tag).toBe("bugfix")
	       expect(response.body.task.priority).toBe("medium")
	       expect(response.body.task.assignedUser).toBe("user2")
	       expect(response.body.task.status).toBe("In Progress")
       })

	it("/api/tasks/:id - Delete task by Id", async () => {
		const response = await request(app)
			.delete(`/api/tasks/${taskId}`)
			.set("Accept", "application/json");

		expect(response.status).toBe(200)
		expect(response.body.message).toBe("Task deleted successfully")
	})
})
