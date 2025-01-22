import { configureStore } from '@reduxjs/toolkit';
import timerReducer from './timerSlice';
import counterReducer from './counterSlice';

const store = configureStore({
  reducer: {
    timer: timerReducer,
    counter: counterReducer,
  },
});

export default store;
