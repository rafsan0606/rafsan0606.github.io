import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  studying: 0,
  cooking: 0,
  sleeping: 0,
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    incrementStudying: (state) => {
      state.studying += 1;
    },
    incrementCooking: (state) => {
      state.cooking += 1;
    },
    incrementSleeping: (state) => {
      state.sleeping += 1;
    },
  },
});

export const { incrementStudying, incrementCooking, incrementSleeping } = counterSlice.actions;
export default counterSlice.reducer;
