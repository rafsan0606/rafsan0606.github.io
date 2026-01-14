import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { FiCalendar } from "react-icons/fi";
import axios from "axios";

const AddTaskModal = ({ isOpen, onClose, onSave, initialTask = {} }) => {
	const [task, setTask] = useState({
		name: "",
		description: "",
		tag: "",
		priority: "medium",
		assignedUser: "",
		dueDate: null,
		status: "Todo",
	});

	// Construct base API URL from environment variables
	const host = import.meta.env.VITE_API_HOST || "172.16.7.219";
	const port = import.meta.env.VITE_API_PORT || "3000";
	const API_BASE = `http://${host}:${port}/api`;

	const [allUsers, setAllUsers] = useState([]);

	// Fetch all assigned users from the backend
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const res = await axios.get(`${API_BASE}/tasks/assignedUsers`);
				setAllUsers(res.data.assignedUsers || []);
			} catch (err) {
				console.error("Error fetching users:", err);
			}
		};
		fetchUsers();
	}, [API_BASE]);

	// Update form state whenever initialTask changes
	useEffect(() => {
		if (initialTask) {
			setTask({
				name: initialTask.name || "",
				description: initialTask.description || "",
				tag: initialTask.tag || "",
				priority: initialTask.priority || "medium",
				assignedUser: initialTask.assignedUser || "",
				dueDate: initialTask.dueDate ? new Date(initialTask.dueDate) : null,
				status: initialTask.status || "Todo",
			});
		}
	}, [initialTask]);

	if (!isOpen) return null;

	const handleChange = (e) =>
		setTask({ ...task, [e.target.name]: e.target.value });
	const handleDate = (date) => setTask({ ...task, dueDate: date });

	const handleSubmit = () => {
		onSave(task);
		onClose();
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
			<div className="bg-white p-6 rounded-lg shadow-lg w-96">
				<h2 className="text-xl font-semibold mb-4">
					{initialTask?._id ? "Edit Task" : "Add New Task"}
				</h2>
				<input
					name="name"
					value={task.name}
					onChange={handleChange}
					placeholder="Task Name"
					className="w-full p-2 mb-2 border border-gray-400 rounded"
				/>
				<textarea
					name="description"
					value={task.description}
					onChange={handleChange}
					placeholder="Description"
					className="w-full p-2 mb-2 border border-gray-400 rounded"
				/>
				<input
					name="tag"
					value={task.tag}
					onChange={handleChange}
					placeholder="Tag"
					className="w-full p-2 mb-2 border border-gray-400 rounded"
				/>
				<select
					name="priority"
					value={task.priority}
					onChange={handleChange}
					className="w-full p-2 mb-2 border border-gray-400 rounded"
				>
					<option value="low">Low</option>
					<option value="medium">Medium</option>
					<option value="high">High</option>
				</select>

				<div className="grid grid-cols-2 gap-2 mb-2">
					<input
						name="assignedUser"
						value={task.assignedUser}
						onChange={handleChange}
						placeholder="Create new user"
						className="w-full p-2 border border-gray-400 rounded"
					/>
					<select
						value={task.assignedUser}
						onChange={(e) => setTask({ ...task, assignedUser: e.target.value })}
						className="w-full p-2 border border-gray-400 rounded"
					>
						<option value="">Select user</option>
						{allUsers.map((user) => (
							<option key={user} value={user}>
								{user}
							</option>
						))}
					</select>
				</div>

				<div className="flex gap-2 items-center">
					<DatePicker
						selected={task.dueDate}
						onChange={handleDate}
						className="w-full p-2 mb-2 border border-gray-400 rounded"
					/>
					<FiCalendar size={26} />
				</div>

				<div className="flex justify-end pt-4 gap-2">
					<button
						onClick={handleSubmit}
						className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
					>
						Save
					</button>
					<button
						onClick={onClose}
						className="bg-gray-300 px-4 py-2 rounded cursor-pointer hover:bg-gray-400"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default AddTaskModal;
