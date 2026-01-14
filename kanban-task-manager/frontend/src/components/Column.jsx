import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { useDndContext } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

const Column = ({
	id,
	title,
	tasks,
	onEdit,
	setModalOpen,
	onDelete,
	onStatusChange,
}) => {
	const { setNodeRef } = useDroppable({ id });
	const { active } = useDndContext();

	return (
		<div className="bg-white p-4 rounded-lg min-h-[200px]">
			<h2 className="text-xl border-dashed border-b-1 border-gray-200 pb-3 font-semibold text-gray-800 mb-4">
				{title}
			</h2>

			{/* Put droppable ref ONLY here */}
			<div ref={setNodeRef} className="min-h-[150px] space-y-3">
				{tasks.length === 0 ? (
					<p className="text-gray-500 text-sm">No tasks</p>
				) : (
					tasks.map((task) => (
						<TaskCard
							key={task._id}
							task={task}
							onEdit={(t) => {
								onEdit(t);
								setModalOpen(true);
							}}
							onDelete={onDelete}
							onStatusChange={onStatusChange}
							isDragging={active?.id === task._id}
						/>
					))
				)}
			</div>
		</div>
	);
};

export default Column;
