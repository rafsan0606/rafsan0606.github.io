import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

const Tags = ({ refreshTags }) => {
  const [tags, setTags] = useState([]);
  const [newTagName, setNewTagName] = useState('');


// Fetch all tags
  useEffect(() => {
    fetchTags();
  }, [refreshTags]);

  const fetchTags = async () => {
    try {
      const response = await fetch('http://127.0.0.1:3010/tags');
      const data = await response.json();
      setTags(data);
    } catch (err) {
      console.error("Failed to fetch tags:", err);
    }
  };

// Handle adding a new tag
  const handleAddTag = () => {
    if (newTagName.trim() === '') return;

    const existingTag = tags.find(tag => tag.name.toLowerCase() === newTagName.toLowerCase());

    if (existingTag) {
      alert("This tag already exists!");
      setNewTagName('');
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
            setTags(prevTags => [...prevTags, data]);
            setNewTagName('');
            refreshTags();
          }
        })
        .catch(err => console.error("Error creating new tag:", err));
    }
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
      .then(() => fetch(`http://127.0.0.1:3010/tags/${tagId}`, { method: 'DELETE' }))
      .then(response => {
        if (!response.ok) throw new Error('Failed to delete tag');
        setTags(prevTags => prevTags.filter(tag => tag.id !== tagId));
      })
      .catch(err => console.error("Error deleting tag:", err));
  };

  return (
    <div className="tags-view">
      <h1>Manage Tags</h1>
      <div className='add-item-container'>
        <input
          type="text"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          placeholder="New Tag Name"
        />
        <button className='add-item' onClick={handleAddTag}><FontAwesomeIcon icon="fa-solid fa-plus" /> Add Tag</button>
      </div>
      <h2>All Tags</h2>
      <ul className='tags-list-container'>
        {tags.map(tag => (
          <li key={tag.id}>
            {tag.name}
            <button className='tag-delete' onClick={() => handleDeleteTag(tag.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tags;
library.add(fas)

