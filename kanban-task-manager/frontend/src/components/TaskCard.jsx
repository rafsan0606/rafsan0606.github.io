import React, { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { FiSettings, FiMoreHorizontal, FiUser } from "react-icons/fi";
import "../styles/styles.css";

const TaskCard = ({
	task,
	onEdit,
	onDelete,
	onStatusChange,
	isOverlay = false,
	isDragging = false,
}) => {
	const [expanded, setExpanded] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const draggable = useDraggable({ id: task._id, data: { type: "task" } });

	const { attributes, listeners, setNodeRef, transform, transition } =
		draggable;

	const cardStyle = {
		backgroundColor: "white",
		border: "1px solid #e2e8f0",
		borderRadius: "8px",
		padding: "12px",
		marginBottom: "8px",
		boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
		touchAction: "none",
		position: "relative",
	};

	const wrapperStyle = {
		transform:
			!isOverlay && transform ? CSS.Transform.toString(transform) : undefined,
		transition: !isOverlay ? transition || "transform 0.2s ease" : undefined,
		touchAction: "none",
	};

	const priorityColors = {
		low: "bg-green-100 text-green-800",
		medium: "bg-yellow-100 text-yellow-800",
		high: "bg-red-100 text-red-800",
	};

	const handleButtonClick = (e, callback) => {
		e.stopPropagation();
		e.preventDefault();
		callback();
		setDropdownOpen(false);
	};

	return (
		<div
			ref={!isOverlay ? setNodeRef : null}
			style={{
				...wrapperStyle,
				opacity: isDragging ? 0 : 1,
			}}
			{...(!isOverlay ? attributes : {})}
			{...(!isOverlay ? listeners : {})}
		>
			<div
				style={cardStyle}
				className="task-card-container max-h-96"
				onClick={() => setExpanded(!expanded)}
			>
				<div className="flex-col border-b-1 border-gray-100 pb-3 justify-between">
					<div className="flex justify-between items-center">
						<h3 className="font-semibold text-m font-light">{task.name}</h3>
						<p className="text-sm">
							<span
								className={`px-2 py-1 rounded ${priorityColors[task.priority]}`}
							>
								{task.priority}
							</span>
						</p>
					</div>
					<p className="text-sm text-gray-600 mt-1">
						Due:{" "}
						{task.dueDate
							? (() => {
									const d = new Date(task.dueDate);
									const day = String(d.getDate()).padStart(2, "0");
									const month = String(d.getMonth() + 1).padStart(2, "0");
									const year = String(d.getFullYear()).slice(2);
									return `${day}/${month}/${year}`;
								})()
							: "N/A"}
					</p>
					<div className="flex justify-between pt-4 gap-4 items-center">
						<p className="bg-sky-50 rounded inline p-1 text-xs font-medium text-blue-400">
							{task.tag || "None"}
						</p>
						<div className="flex justify-between gap-2 items-center">
							<FiUser size={14} />
							<p className="text-sm text-gray-600">
								{task.assignedUser || "Unassigned"}
							</p>
						</div>
					</div>
				</div>
				<div className="flex justify-between pt-3 gap-4 items-center">
					<div className="flex items-center">
						<div className="pr-2">
							<button
								onClick={(e) =>
									handleButtonClick(e, () => setExpanded(!expanded))
								}
								className="text-gray-500 pb-1 cursor-pointer"
							>
								<FiMoreHorizontal size={18} />
							</button>
						</div>

						<div className="flex justify-between">
							<select
								value={task.status}
								onChange={(e) =>
									handleButtonClick(e, () =>
										onStatusChange(task._id, e.target.value),
									)
								}
								onClick={(e) => e.stopPropagation()}
								className="text-sm text-gray-600 border-gray-300 border-1 rounded p-1 cursor-pointer"
							>
								{["Todo", "In Progress", "Review", "Testing", "Done"].map(
									(status) => (
										<option key={status} value={status}>
											{status}
										</option>
									),
								)}
							</select>
						</div>
					</div>

					<div className="relative">
						<button
							onClick={(e) => {
								e.stopPropagation();
								setDropdownOpen(!dropdownOpen);
							}}
							className="p-1 hover:bg-gray-200 rounded cursor-pointer"
						>
							<FiSettings size={18} />
						</button>

						{dropdownOpen && (
							<div className="absolute right-0 mt-2 w-28 bg-white border-1 border-gray-300 rounded shadow-lg z-10">
								<button
									onClick={(e) => handleButtonClick(e, () => onEdit(task))}
									className="w-full text-left px-3 py-2 hover:bg-gray-100 text-blue-500 cursor-pointer"
								>
									Edit
								</button>
								<button
									onClick={(e) =>
										handleButtonClick(e, () => onDelete(task._id))
									}
									className="w-full text-left px-3 py-2 hover:bg-gray-100 text-red-500 cursor-pointer"
								>
									Delete
								</button>
							</div>
						)}
					</div>
				</div>
				{expanded && (
					<p className="mt-2 text-[13px] text-gray-700">
						{task.description || "No description"}
					</p>
				)}
			</div>
		</div>
	);
};

export default TaskCard;
