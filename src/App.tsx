import React, { useState, useEffect } from 'react';
import './App.css';
import ForceGraph from './components/graph/ForceGraph';
import { sampleTechniques } from './data/SampleData';
import Tabs from './components/Tabs';
import { STORAGE, TABS } from './constants';
import Techniques from './components/technique/Techniques';
import Classes from './components/Classes';
import { IRootState, useAppDispatch } from './state/Store';
import { useSelector } from 'react-redux';
import { setTechniques } from './state/slices/techniquesSlice';


const title = "BJJ Library"
const subTitle = "Track techniques and training sessions"
const App = () => {
  const dispatch = useAppDispatch();
  const [loaded, setLoaded] = useState<boolean>(false);
  const { techniques } = useSelector(
    (state: IRootState) => state.techState,
  );
  const { activeTab, } = useSelector(
    (state: IRootState) => state.tabState,
  );

  useEffect(() => {
    if (!loaded) {
      if (techniques.length === 0) {
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

  return (
    <div className="container">
      <div className="content">
        <h1 className="title">{title}</h1>
        <p className="subtitle">{subTitle}</p>
        <Tabs />
        {activeTab === TABS.TECHNIQUES && (<Techniques />)}
        {activeTab === TABS.CLASS && (<Classes />)}
        {activeTab === TABS.VIZ && (
          <ForceGraph techniques={techniques} />
        )}
      </div>
    </div>
  );
};

export default App;
