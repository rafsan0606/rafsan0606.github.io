import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: {},
};

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    startTaskTimer: (state, action) => {
      const { taskId, startTime } = action.payload;
      state.tasks[taskId] = { isTracking: true, startTime, elapsedTime: 0 };
    },
    stopTaskTimer: (state, action) => {
      const { taskId, stopTime } = action.payload;
      if (state.tasks[taskId]?.isTracking) {
        state.tasks[taskId].isTracking = false;
        state.tasks[taskId].stopTime = stopTime;
      }
    },
    updateTaskElapsedTime: (state, action) => {
      const { taskId, elapsedTime } = action.payload;
      if (state.tasks[taskId]?.isTracking) {
        state.tasks[taskId].elapsedTime = elapsedTime;
      }
    },
  },
});

export const { startTaskTimer, stopTaskTimer, updateTaskElapsedTime } = timerSlice.actions;

export default timerSlice.reducer;
