import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskCard from '../components/TaskCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

const Home = ({ refreshTasks }) => {
  const [taskName, setTaskName] = useState('');
  const [tags, setTags] = useState(''); // State for tags
  const [tasks, setTasks] = useState([]); // State for tasks
  const [error, setError] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const navigate = useNavigate();
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  

// Fetch tasks
  const fetchTasksAndTags = async () => {
    try {
      const [taskRes, tagRes] = await Promise.all([
        fetch('http://localhost:3010/tasks'),
        fetch('http://localhost:3010/tags')
      ]);

      const tasksData = await taskRes.json();
      const tagsData = await tagRes.json();
      setAllTags(tagsData);

      const tagMap = {};
      tagsData.forEach(tag => {
        tagMap[tag.id] = tag.name;
      });

      const tasksWithTags = tasksData.map(task => ({
        ...task,
        tagIds: task.tags ? task.tags.split(',').map(tagId => parseInt(tagId.trim())) : [],
        tags: task.tags ? task.tags.split(',').map(tagId => tagMap[tagId]).join(', ') : 'No Tags'
      }));
      

      setTasks(tasksWithTags);
    } catch (err) {
      console.error('Error fetching tasks or tags:', err);
      setError('Failed to load tasks or tags. Please try again later.');
    }
  };

  useEffect(() => {
    fetchTasksAndTags();
  }, []);

  const handleTagSelect = (tagId) => {
    setSelectedTags(prevSelectedTags => 
      prevSelectedTags.includes(tagId)
        ? prevSelectedTags.filter(id => id !== tagId)
        : [...prevSelectedTags, tagId]
    );
  };

  const filteredTasks = tasks.filter(task => {
    if (selectedTags.length === 0) return true;
    return selectedTags.every(tagId => task.tagIds.includes(tagId));
  });  

// Check if a tag exists and create it if it doesn't
  const createTagIfNotExists = async (tagName) => {
    try {
      const response = await fetch('http://localhost:3010/tags');
      const tagsData = await response.json();
  
      const existingTag = tagsData.find(tag => tag.name.toLowerCase() === tagName.toLowerCase());
      if (existingTag) {
        return existingTag.id; 
      } 
  
// Create a new tag
      const newTag = { name: tagName };
      const tagResponse = await fetch('http://localhost:3010/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTag),
      });
      const createdTag = await tagResponse.json();
      return createdTag.id;
    } catch (error) {
      console.error("Error in tag creation/fetching:", error);
      throw error;
    }
  };
  

// Add a new task
  const addTask = async () => {
    if (!taskName.trim()) {
      setError('Task name cannot be empty.');
      return;
    }

    if (!tags.trim()) {
      setError('Tags input cannot be empty.');
      return;
    }

    try {
      const tagArray = tags.split(',').map(tag => tag.trim()); 
      const tagIds = await Promise.all(tagArray.map(createTagIfNotExists));

// Create task with the taskName and associated tags
      const newTask = { name: taskName, tags: tagIds.join(',') };

      const response = await fetch('http://localhost:3010/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        fetchTasksAndTags();
        refreshTasks();
        setTaskName('');
        setTags('');
        setError('');
      } else {
        setError('Failed to add task. Please try again.');
      }
    } catch (err) {
      console.error('Error adding task:', err);
      setError('An error occurred while adding the task.');
    }
  };

  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen); // Toggle accordion open/close
  };


  return (
    <div className="home-container">
      <h1><FontAwesomeIcon icon="fa-solid fa-stopwatch" /> Select a View from the Menu</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className='add-item-container'>
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Enter new task name"
        />
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Enter tags (comma-separated)"
        />
        <button className='add-item' onClick={addTask}><FontAwesomeIcon icon="fa-solid fa-plus" /> Add Task</button>
      </div>

      <div className="tag-filter">
        <div className='filter-container'>
            <button className="filter" onClick={toggleAccordion}>
              <FontAwesomeIcon icon="fa-solid fa-filter" /> Filter by Tags
            </button>
            {isAccordionOpen && (
              <div className="panel">
                {allTags.map(tag => (
                  <label key={tag.id}>
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag.id)}
                      onChange={() => handleTagSelect(tag.id)}
                    />
                    {tag.name}
                  </label>
                ))}
              </div>
            )}
        </div>
      </div>

      <div>
        <h3>Tasks:</h3>
        <div className='card-container'>
          {filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
library.add(fas)

