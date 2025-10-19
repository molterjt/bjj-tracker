import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TABS } from '../../constants';

interface ITabState {
  activeTab: TABS;
}

const initialState: ITabState = {
  activeTab: TABS.TECHNIQUES
};

export const tabState = createSlice({
  name: 'TabState',
  initialState: initialState,
  reducers: {
    setTabState: (
      state: ITabState,
      { payload }: PayloadAction<TABS>,
    ) => {
      state.activeTab = payload;
    },
  },
});

export const {
  setTabState,
} = tabState.actions;

export default tabState.reducer;
