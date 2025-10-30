import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Position } from '../types';
import { STORAGE } from '../../constants';

interface IPositionsState {
  positions: Position[];
  selectedPosition: Position | null;
}

const initialState: IPositionsState = {
  positions: [
    // Sample positions
    {
      id: '1',
      name: 'Closed Guard',
      category: 'Ground',
      subcategory: 'Guard',
      description: 'Fundamental guard position with legs locked around opponent',
      relatedPositions: ['2', '3']
    },
    {
      id: '2',
      name: 'Mount',
      category: 'Ground',
      subcategory: 'Top',
      description: 'Dominant top position sitting on opponent\'s torso',
      relatedPositions: ['1']
    },
    {
      id: '3',
      name: 'Open Guard',
      category: 'Ground',
      subcategory: 'Guard',
      description: 'Guard position without legs locked',
      relatedPositions: ['1']
    }
  ],
  selectedPosition: null
};

const positionSlice = createSlice({
  name: 'positions',
  initialState,
  reducers: {
    setPositions: (
      state: IPositionsState,
      { payload }: PayloadAction<Position[]>,
    ) => {
      state.positions = payload;
      // localStorage.setItem(STORAGE.TECHS, JSON.stringify(state.techniques));
    },
    addPosition: (state, action: PayloadAction<Position>) => {
      state.positions.push(action.payload);
    },
    setSelectedPosition: (
      state: IPositionsState,
      { payload }: PayloadAction<Position>,
    ) => {
      state.selectedPosition = payload;
    },
    deletePosition: (
      state: IPositionsState,
      { payload }: PayloadAction<string>,
    ) => {
      state.positions = state.positions.filter(p => p.id !== payload)
      // localStorage.setItem(STORAGE.TECHS, JSON.stringify(state.techniques));
    },
    updatePosition: (state, action: PayloadAction<Position>) => {
      const index = state.positions.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.positions[index] = action.payload;
        // localStorage.setItem(STORAGE.TECHS, JSON.stringify(state.techniques));
      }
    },
  }
});

export const {
  setPositions,
  updatePosition,
  setSelectedPosition,
  deletePosition,
  addPosition

} = positionSlice.actions;

export default positionSlice.reducer;