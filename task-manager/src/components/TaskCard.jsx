import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { startTaskTimer, stopTaskTimer, updateTaskElapsedTime } from '../store/timerSlice';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'


const TaskCard = ({ task }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const taskTimer = useSelector(state => state.timer.tasks[task.id]);
  
    const formatTime = (ms) => moment.utc(ms).format("HH:mm:ss");
  
    const startTask = () => {
      const now = new Date();
      dispatch(startTaskTimer({ taskId: task.id, startTime: now }));
    };
  
    const stopTask = () => {
      dispatch(stopTaskTimer({ taskId: task.id, stopTime: new Date() }));
    };
  
    useEffect(() => {
      let interval;
      if (taskTimer?.isTracking) {
        interval = setInterval(() => {
          const now = new Date();
          const elapsedTime = now - new Date(taskTimer.startTime);
          dispatch(updateTaskElapsedTime({ taskId: task.id, elapsedTime }));
        }, 1000);
      }
      return () => clearInterval(interval);
    }, [taskTimer, dispatch, task.id]);
  
    return (
      <div className="task-card">
        <h3><FontAwesomeIcon icon="fa-solid fa-bars-progress" /> {task.name}</h3>
        
        <p>Time spent: {formatTime(taskTimer?.elapsedTime || 0)}</p>
  
        {!taskTimer?.isTracking ? (
          <button onClick={startTask}>Start Tracking</button>
        ) : (
          <button onClick={stopTask}>Stop Tracking</button>
        )}

        <p className='card-tags'><strong>Tags:</strong> {task.tags || 'No Tags'}</p>
  
        <button className='open-task' onClick={() => navigate(`/task/${task.id}`)}>Open Task <FontAwesomeIcon icon="fa-solid fa-angle-right" /></button>
      </div>
    );
  };
  

export default TaskCard;
library.add(fas)

