import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import tabState from './slices/tabSlice';
import techState from './slices/techniquesSlice';
import classState from './slices/classSlice';
import positionState from './slices/positionsSlice';

const appReducer = combineReducers({
  tabState,
  techState,
  classState,
  positionState
});
const rootReducer = (state: any, action: any) => {
  if (action.type === 'RESET') {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
}

const Store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof Store.dispatch;
export const useAppDispatch = () => useDispatch();
export type IRootState = ReturnType<typeof rootReducer>;

export default Store;
