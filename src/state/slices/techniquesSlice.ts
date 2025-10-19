import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Technique } from '../types';
import Techniques from '../../components/technique/Techniques';
import { STORAGE } from '../../constants';

interface ITechniquesState {
  techniques: Technique[];
  selectedTechnique: Technique | undefined,
}

const initialState: ITechniquesState = {
  techniques: [],
  selectedTechnique: undefined,
};

export const tabState = createSlice({
  name: 'TabState',
  initialState: initialState,
  reducers: {
    setTechniques: (
      state: ITechniquesState,
      { payload }: PayloadAction<Technique[]>,
    ) => {
      state.techniques = payload;
      localStorage.setItem(STORAGE.TECHS, JSON.stringify(state.techniques));

    },
    setSelectedTechnique: (
      state: ITechniquesState,
      { payload }: PayloadAction<string>,
    ) => {
      state.selectedTechnique = state.techniques.find(t => t.id === payload) || undefined
    },
    deleteTechnique: (
      state: ITechniquesState,
      { payload }: PayloadAction<string>,
    ) => {
      state.techniques = state.techniques.filter(t => t.id !== payload)
      localStorage.setItem(STORAGE.TECHS, JSON.stringify(state.techniques));
    },
    updateTechnique: (state, action: PayloadAction<Technique>) => {
      const index = state.techniques.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.techniques[index] = action.payload;
        localStorage.setItem(STORAGE.TECHS, JSON.stringify(state.techniques));
      }
    },
  },
});

export const {
  setTechniques,
  setSelectedTechnique,
  deleteTechnique,
  updateTechnique
} = tabState.actions;

export default tabState.reducer;
