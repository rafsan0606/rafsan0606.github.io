import React, { useEffect, useState, useCallback } from "react";
import {
	DndContext,
	PointerSensor,
	DragOverlay,
	useSensor,
	useSensors,
	closestCenter,
} from "@dnd-kit/core";
import { createTask, deleteTask, getTasks, updateTask } from "../api";
import AddTaskModal from "./AddTaskModal";
import TaskCard from "./TaskCard";
import Column from "./Column";
const columns = ["Todo", "In Progress", "Review", "Testing", "Done"];
import { FiPlus } from "react-icons/fi";
import logo from "../assets/logo.png";

const KanbanBoard = () => {
	const [tasks, setTasks] = useState([]);
	const [modalOpen, setModalOpen] = useState(false);
	const [editingTask, setEditingTask] = useState(null);

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
	);

	const fetchTasks = useCallback(async () => {
		try {
			const res = await getTasks();
			setTasks(res.data.tasks || []);
		} catch (err) {
			console.error("Error fetching tasks:", err);
		}
	}, []);

	useEffect(() => {
		fetchTasks();
	}, [fetchTasks]);

	const handleSave = async (taskData) => {
		try {
			if (editingTask) {
				await updateTask(editingTask._id, taskData);
			} else {
				await createTask(taskData);
			}
			await fetchTasks();
			setEditingTask(null);
			setModalOpen(false);
		} catch (err) {
			console.error("Error saving task:", err);
		}
	};

	const handleDelete = async (id) => {
		try {
			await deleteTask(id);
			await fetchTasks();
		} catch (err) {
			console.error("Error deleting task:", err);
		}
	};

	const handleStatusChange = async (id, newStatus) => {
		try {
			await updateTask(id, { status: newStatus });
			await fetchTasks();
		} catch (err) {
			console.error("Error updating status:", err);
		}
	};

	const groupTasks = () => {
		const grouped = {};
		columns.forEach((col) => {
			grouped[col] = tasks.filter((t) => t.status === col);
		});
		return grouped;
	};

	const [activeTask, setActiveTask] = useState(null);

	const handleDragStart = (event) => {
		const taskId = event.active.id;
		const task = tasks.find((t) => t._id === taskId);
		setActiveTask(task);
	};

	const handleDragEnd = async ({ active, over }) => {
		setActiveTask(null); // reset the overlay

		if (!over) return;

		const taskId = active.id;
		const targetColumn = columns.find(
			(col) => over.id === col.replace(/\s+/g, "-"),
		);

		if (!targetColumn) return;

		const task = tasks.find((t) => t._id === taskId);
		if (task.status !== targetColumn) {
			await updateTask(taskId, { status: targetColumn });
			await fetchTasks();
		}
	};

	return (
		<div className="container mx-auto p-6 bg-gray-100 min-h-screen">
			<div className="flex flex-col-reverse md:flex-row mb-6 justify-between gap-4 items-center">
				<div className="flex justify-self-stretch gap-2 items-center">
					<button
						onClick={() => {
							setEditingTask(null);
							setModalOpen(true);
						}}
						className="flex items-center gap-2 px-4 py-2 bg-blue-600 cursor-pointer text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						<FiPlus /> Add New Task
					</button>
				</div>

				<div className="flex gap-2 items-center">
					<img src={logo} alt="Imaginary Board Logo" className="h-11 w-auto" />
				</div>
			</div>

			<AddTaskModal
				key={editingTask?._id || "new"}
				isOpen={modalOpen}
				onClose={() => {
					setModalOpen(false);
					setEditingTask(null); // also reset when cancel/close
				}}
				onSave={handleSave}
				initialTask={editingTask}
			/>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
			>
				<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
					{columns.map((col) => (
						<Column
							key={col}
							id={col.replace(/\s+/g, "-")}
							title={col}
							tasks={groupTasks()[col]}
							onEdit={setEditingTask}
							setModalOpen={setModalOpen}
							onDelete={handleDelete}
							onStatusChange={handleStatusChange}
						/>
					))}
				</div>
				<DragOverlay>
					{activeTask ? (
						<div className="shadow-lg">
							<TaskCard
								task={activeTask}
								isOverlay={true}
								onEdit={() => {
									/* intentionally empty for overlay */
								}}
								onDelete={() => {
									/* intentionally empty for overlay */
								}}
								onStatusChange={() => {
									/* intentionally empty for overlay */
								}}
							/>
						</div>
					) : null}
				</DragOverlay>
			</DndContext>
		</div>
	);
};

export default KanbanBoard;
