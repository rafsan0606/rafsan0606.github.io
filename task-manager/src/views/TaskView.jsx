import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startTaskTimer, stopTaskTimer, updateTaskElapsedTime } from '../store/timerSlice'; 
import moment from 'moment';
import Home from './Home';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

const TaskView = ({ refreshTasks }) => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [tags, setTags] = useState([]);
  const [associatedTags, setAssociatedTags] = useState([]);
  const [activeTag, setActiveTag] = useState(null);
  const [newTagName, setNewTagName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTaskName, setUpdatedTaskName] = useState('');
  const dispatch = useDispatch();

// Fetch task details
  useEffect(() => {
    fetch(`http://127.0.0.1:3010/tasks/${taskId}`)
      .then(response => response.json())
      .then(data => {
        console.log("Fetched Task Data:", data);
        if (Array.isArray(data) && data.length > 0) {
          setTask(data[0]);
          setUpdatedTaskName(data[0].name);
        } else {
          setTask(data);
          setUpdatedTaskName(data.name);
        }
      })
      .catch(err => console.error("Failed to fetch task:", err));
  }, [taskId]);

// Fetch associated tags for the task
  useEffect(() => {
    if (task) {
      const tagIds = task.tags ? task.tags.split(',') : [];
      const fetchTags = tagIds.map(tagId =>
        fetch(`http://127.0.0.1:3010/tags/${tagId}`)
          .then(response => response.json())
          .then(data => data[0])
      );

      Promise.all(fetchTags)
        .then(tagsData => {
          setAssociatedTags(tagsData.filter(tag => tag));
        })
        .catch(err => console.error("Failed to fetch associated tags:", err));
    }
  }, [task]);

// Fetch all tags to display in the add tag section
  useEffect(() => {
    fetch('http://127.0.0.1:3010/tags')
      .then(response => response.json())
      .then(data => setTags(data))
      .catch(err => console.error("Failed to fetch all tags:", err));
  }, []);

  const taskTimer = useSelector((state) => state.timer.tasks[taskId]);

  const formatTime = (ms) => moment.utc(ms).format("HH:mm:ss");
  const formatTimestamp = (date) => moment(date).format("YYYY-MM-DD HH:mm:ss.SSS");

  const startTask = () => {
    const now = new Date();
    const formattedTimestamp = formatTimestamp(now);
    dispatch(startTaskTimer({ taskId, startTime: formattedTimestamp }));

    fetch('http://127.0.0.1:3010/timestamps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: formattedTimestamp,
        task: taskId,
        type: 0,
        tags: activeTag ? [activeTag].join(',') : '',
      }),
    });
  };

  const stopTask = () => {
    const now = new Date();
    const formattedTimestamp = formatTimestamp(now);
    dispatch(stopTaskTimer({ taskId, stopTime: formattedTimestamp }));

    fetch('http://127.0.0.1:3010/timestamps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: formattedTimestamp,
        task: taskId,
        type: 1,
        tags: activeTag ? [activeTag].join(',') : '',
      }),
    });
  };

  useEffect(() => {
    let interval;
    if (taskTimer?.isTracking) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsedTime = now - new Date(taskTimer.startTime);
        dispatch(updateTaskElapsedTime({ taskId, elapsedTime }));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [taskTimer, dispatch, taskId]);

// Check if task is loaded before rendering
  if (!task) {
    return <p>Loading task...</p>;
  }

  const handleDeleteTask = () => {
    fetch(`http://127.0.0.1:3010/tasks/${taskId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          refreshTasks();
          navigate('/');
        } else {
          throw new Error('Failed to delete task');
        }
      })
      .catch(err => console.error("Error deleting task:", err));
  };

  const handleAddTag = () => {
    if (newTagName.trim() === '') return;
  
// Check if the tag already exists
    const existingTag = tags.find(tag => tag.name.toLowerCase() === newTagName.toLowerCase());
  
    if (existingTag) {
      const updatedTags = task.tags ? `${task.tags},${existingTag.id}` : `${existingTag.id}`;
      
      fetch(`http://127.0.0.1:3010/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: task.name, tags: updatedTags }),
      })
        .then(response => {
          if (!response.ok) throw new Error('Failed to update task with existing tag');
          setAssociatedTags(prevTags => [...prevTags, existingTag]);
          setTask(prevTask => ({ ...prevTask, tags: updatedTags }));
          setNewTagName('');
        })
        .catch(err => console.error("Error updating task with existing tag:", err));
    } else {
      const newTag = { name: newTagName };
  
      fetch('http://127.0.0.1:3010/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTag),
      })
        .then(response => response.json())
        .then(data => {
          if (data.id) {
            const updatedTags = task.tags ? `${task.tags},${data.id}` : `${data.id}`;
  
            return fetch(`http://127.0.0.1:3010/tasks/${taskId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: task.name, tags: updatedTags }),
            })
              .then(() => {
                setAssociatedTags(prevTags => [...prevTags, data]);
                setTask(prevTask => ({ ...prevTask, tags: updatedTags }));
                setNewTagName('');
              });
          } else {
            console.error('Error: Tag creation returned no ID', data);
          }
        })
        .catch(err => console.error("Error creating or adding new tag:", err));
    }
  };
  
// Update task name
  const handleUpdateTaskName = () => {
    fetch(`http://127.0.0.1:3010/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: updatedTaskName, tags: task.tags }),
    })
      .then(response => {
        if (response.ok) {
          refreshTasks();
          setTask(prevTask => ({ ...prevTask, name: updatedTaskName }));
          setIsEditing(false);
        } else {
          throw new Error('Failed to update task name');
        }
      })
      .catch(err => console.error("Error updating task name:", err));
  };

// Handle deleting a tag
  const handleDeleteTag = (tagId) => {
    fetch(`http://127.0.0.1:3010/tasks`)
      .then(response => response.json())
      .then(tasks => {
        const tasksToUpdate = tasks.filter(task => task.tags?.split(',').includes(String(tagId)));
  
        const updateTasksPromises = tasksToUpdate.map(task => {
          const updatedTags = task.tags.split(',').filter(id => id !== String(tagId)).join(',');
          
          return fetch(`http://127.0.0.1:3010/tasks/${task.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: task.name, tags: updatedTags }),
          });
        });
  
        return Promise.all(updateTasksPromises);
      })
      
      .then(() => {
        setAssociatedTags(prevTags => prevTags.filter(tag => tag.id !== tagId));
      })
      .catch(err => console.error("Error removing tag from tasks:", err));
  };
  

  return (
    <div className="view-container">
      <h1>
        {isEditing ? (
          <input 
            type="text" 
            value={updatedTaskName} 
            onChange={(e) => setUpdatedTaskName(e.target.value)} 
          />
        ) : (
          task.name ? task.name.charAt(0).toUpperCase() + task.name.slice(1) : "Unnamed Task"
        )}
      </h1>

      <div className='task-edit'>

        {isEditing ? (
          <button className='add-item' onClick={handleUpdateTaskName}><FontAwesomeIcon icon="fa-solid fa-floppy-disk" /> Update</button> // Show update button when in edit mode
        ) : (
          <button className='add-item' onClick={() => setIsEditing(true)}><FontAwesomeIcon icon="fa-solid fa-pen-to-square" /> Edit Name</button> // Show edit button when not in edit mode
        )}

        <button className='add-item remove-button' onClick={handleDeleteTask}><FontAwesomeIcon icon="fa-solid fa-delete-left" /> Delete Task</button>

      </div>

      <div>
        <label><strong>Tags:</strong></label>
        <div className="tag-buttons">
          {associatedTags.map(tag => (
            <div className='single-tag' key={tag.id}>
            <button
              onClick={() => setActiveTag(tag.id)}
              className={`tag-button ${activeTag === tag.id ? 'active' : ''}`}
            >
              {tag.name}
            </button>
            {activeTag === tag.id && (
              <button className='remove-button' onClick={() => handleDeleteTag(tag.id)}><FontAwesomeIcon icon="fa-solid fa-delete-left" /> Remove Tag</button>
            )}
          </div>
          ))}
        </div>

        <div className="add-tag">
          <input 
            type="text" 
            value={newTagName} 
            onChange={(e) => setNewTagName(e.target.value)} 
            placeholder="New Tag Name" 
          />
          <button className='add-item' onClick={handleAddTag}><FontAwesomeIcon icon="fa-solid fa-plus" /> Add Tag</button>
        </div>
      </div>

      <div className="task-timer">
        <h2>Track time: {task.name || "Unnamed Task"}</h2>
        <p>Time spent: <span className="timer-digits">{formatTime(taskTimer?.elapsedTime || 0)}</span></p>
        {!taskTimer?.isTracking ? (
          <button onClick={startTask}>Start Tracking</button>
        ) : (
          <button onClick={stopTask}>Stop Tracking</button>
        )}
      </div>
    </div>
  );
};

export default TaskView;
library.add(fas)
