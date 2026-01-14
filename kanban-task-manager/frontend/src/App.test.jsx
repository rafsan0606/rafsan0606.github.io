/* global test, expect, vi */
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import KanbanBoard from "./components/KanbanBoard";
import TaskCard from "./components/TaskCard";
import AddTaskModal from "./components/AddTaskModal";
import { vi } from "vitest";

// 1. Test KanbanBoard renders columns
test("KanbanBoard renders all columns", () => {
	render(<KanbanBoard />);
	expect(screen.getByText(/Todo/i)).toBeInTheDocument();
	expect(screen.getByText(/In Progress/i)).toBeInTheDocument();
	expect(screen.getByText(/Review/i)).toBeInTheDocument();
	expect(screen.getByText(/Testing/i)).toBeInTheDocument();
	expect(screen.getByText(/Done/i)).toBeInTheDocument();
});

// 2. Test TaskCard displays task info
test("TaskCard displays task name and priority", () => {
	const mockTask = {
		_id: "1",
		name: "Test Task",
		priority: "high",
		dueDate: new Date().toISOString(),
		assignedUser: "Rafsan",
		tag: "Feature",
		status: "Todo",
		description: "Test description",
	};
	render(
		<TaskCard
			task={mockTask}
			onEdit={() => {
				// empty function
			}}
			onDelete={() => {
				// empty function
			}}
			onStatusChange={() => {
				// empty function
			}}
		/>,
	);
	expect(screen.getByText(/Test Task/i)).toBeInTheDocument();
	expect(screen.getByText(/high/i)).toBeInTheDocument();
	expect(screen.getByText(/Rafsan/i)).toBeInTheDocument();
	expect(screen.getByText(/Feature/i)).toBeInTheDocument();
});

// 3. Test AddTaskModal calls onSave when Save is clicked
test("AddTaskModal calls onSave when Save button is clicked", () => {
	const handleSave = vi.fn();
	render(
		<AddTaskModal
			isOpen={true}
			onClose={() => {
				// empty function
			}}
			onSave={handleSave}
			initialTask={{}}
		/>,
	);
	fireEvent.change(screen.getByPlaceholderText(/Task Name/i), {
		target: { value: "New Task" },
	});
	fireEvent.click(screen.getByText(/Save/i));
	expect(handleSave).toHaveBeenCalled();
});
