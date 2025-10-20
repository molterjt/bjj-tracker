import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ClassSession } from '../types';
import { STORAGE } from '../../constants';

interface IClassState {
  classes: ClassSession[];
}

const initialState: IClassState = {
  classes: [],
};

export const classState = createSlice({
  name: 'TabState',
  initialState: initialState,
  reducers: {
    setClasses: (
      state: IClassState,
      { payload }: PayloadAction<ClassSession[]>,
    ) => {
      state.classes = payload;
      localStorage.setItem(STORAGE.CLASS, JSON.stringify(state.classes));

    },
    deleteClass: (
      state: IClassState,
      { payload }: PayloadAction<string>,
    ) => {
      state.classes = state.classes.filter(t => t.id !== payload)
      localStorage.setItem(STORAGE.CLASS, JSON.stringify(state.classes));
    },
    updateClass: (state: IClassState, action: PayloadAction<ClassSession>) => {
      const index = state.classes.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.classes[index] = action.payload;
        localStorage.setItem(STORAGE.CLASS, JSON.stringify(state.classes));
      }
    },
  },
});

export const {
  setClasses,
  deleteClass,
  updateClass
} = classState.actions;

export default classState.reducer;
