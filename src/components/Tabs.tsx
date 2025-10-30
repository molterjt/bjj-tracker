import React, { useState } from 'react'
import '../App.css';
import { BookOpen, Calendar, Network, Target } from 'lucide-react';
import { TABS } from '../constants';
import { IRootState, useAppDispatch } from '../state/Store';
import { setTabState } from '../state/slices/tabSlice';
import { useSelector } from 'react-redux';


export default function Tabs() {
  const dispatch = useAppDispatch();
  const { activeTab } = useSelector(
    (state: IRootState) => state.tabState,
  );
  const handleTabSelect = (selected: TABS) => {
    dispatch(setTabState(selected))
  }
  return (
    <div className="tabs" >
      <button
        onClick={() => handleTabSelect(TABS.TECHNIQUES)}
        className={`tab ${activeTab === TABS.TECHNIQUES ? 'active' : ''}`}
      >
        <BookOpen size={18} />
        <span>Techniques</span>
      </button>
      <button
        onClick={() => handleTabSelect(TABS.POS)}
        className={`tab ${activeTab === TABS.POS ? 'active' : ''}`}
      >
        <Target size={18} />
        <span>Positions</span>
      </button>
      <button
        onClick={() => handleTabSelect(TABS.CLASS)}
        className={`tab ${activeTab === TABS.CLASS ? 'active' : ''}`}
      >
        <Calendar size={18} />
        <span>Classes</span>
      </button>
      <button
        onClick={() => handleTabSelect(TABS.VIZ)}
        className={`tab ${activeTab === TABS.VIZ ? 'active' : ''}`}
      >
        <Network size={18} />
        <span>Visualize</span>
      </button>
    </div >
  )
}
