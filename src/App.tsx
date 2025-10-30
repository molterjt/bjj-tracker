import React, { useState, useEffect } from 'react';
import './App.css';
// import ForceGraph from './components/graph/ForceGraph';
import Tabs from './components/Tabs';
import { STORAGE, TABS } from './constants';
import Techniques from './components/technique/Techniques';
import { IRootState, useAppDispatch } from './state/Store';
import { useSelector } from 'react-redux';
import { setTechniques } from './state/slices/techniquesSlice';
import { setClasses } from './state/slices/classSlice';
import ClassesWithGraph from './components/classes/ClassesWithGraph';
import Positions from './components/positions/Positions';
import UnifiedGraph from './components/graph/UnifiedGraph';
import { sampleTechniques } from './data/sample/data';
import { sampleClasses } from './data/sample/classes';


const title = "BJJ Library"
const subTitle = "Track techniques and training sessions"
const App = () => {
  const dispatch = useAppDispatch();
  const [loaded, setLoaded] = useState<boolean>(false);
  const { techniques } = useSelector(
    (state: IRootState) => state.techState,
  );
  const { classes } = useSelector(
    (state: IRootState) => state.classState,
  );
  const { positions } = useSelector(
    (state: IRootState) => state.positionState,
  );
  const { activeTab, } = useSelector(
    (state: IRootState) => state.tabState,
  );

  useEffect(() => {
    if (!loaded) {
      if (techniques.length === 0) {
        // const storedTechs = null;
        const storedTechs = localStorage.getItem(STORAGE.TECHS);
        if (storedTechs) {
          const parsedTechs = JSON.parse(storedTechs);
          if (parsedTechs && parsedTechs.length > 0) {
            console.log("Loading techniques from storage")
            dispatch(setTechniques(parsedTechs));
            setLoaded(true);
            return;
          }
        }
        console.log("Loading techniques from sample data")
        dispatch(setTechniques(sampleTechniques))
        setLoaded(true);
      }
    }
  }, [loaded]);

  useEffect(() => {
    if (techniques.length === 0) {
      const storedClasses = localStorage.getItem(STORAGE.CLASS);
      if (storedClasses) {
        const parsedClasses = JSON.parse(storedClasses);
        if (parsedClasses && parsedClasses.length > 0) {
          console.log("Loading classes from storage")
          dispatch(setClasses(parsedClasses));
          return;
        }
      }
      console.log("Loading classes from sample data")
      dispatch(setClasses(sampleClasses))
    }
  }, [])

  return (
    <div className="container">
      <div className="content">
        <h1 className="title">{title}</h1>
        <p className="subtitle">{subTitle}</p>
        <Tabs />
        {activeTab === TABS.TECHNIQUES && (<Techniques />)}
        {activeTab === TABS.POS && (<Positions />)}
        {activeTab === TABS.CLASS && (<ClassesWithGraph />)}
        {activeTab === TABS.VIZ && (
          // <ForceGraph techniques={techniques} />
          <UnifiedGraph techniques={techniques} positions={positions} />
        )}
      </div>
    </div>
  );
};

export default App;
