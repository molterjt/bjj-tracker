import React, { useEffect, useState } from 'react'
import { sampleData } from '../../data/SampleData';
import { Technique } from '../../state/types';
import { IRootState, useAppDispatch } from '../../state/Store';
import { setTechniques, updateTechnique } from '../../state/slices/techniquesSlice';
import { useSelector } from 'react-redux';
import { X } from 'lucide-react';
import { STORAGE } from '../../constants';

interface IFormProps {
  editingId: string | null;
  resetForm: () => void;
  newTechnique: Omit<Technique, 'id'>;
  setNewTechnique: React.Dispatch<React.SetStateAction<Omit<Technique, "id">>>
}
export default function Form(props: IFormProps) {
  const dispatch = useAppDispatch();
  const { editingId, resetForm, newTechnique, setNewTechnique } = props;
  const [availableOptions, setAvailableOptions] = useState<string[]>(Object.keys(sampleData));
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const { techniques } = useSelector(
    (state: IRootState) => state.techState,
  );

  // useEffect(() => {
  //   console.log('storing techniques: ', techniques.length)
  //   localStorage.setItem(STORAGE.TECHS, JSON.stringify(techniques));
  // }, [techniques])

  // Update available options based on current path
  useEffect(() => {
    let current: any = sampleData;
    for (const step of currentPath) {
      if (current[step]) {
        current = current[step];
      }
    }

    if (typeof current === 'object' && !Array.isArray(current)) {
      setAvailableOptions(Object.keys(current));
    } else if (Array.isArray(current)) {
      setAvailableOptions(current);
    } else {
      setAvailableOptions([]);
    }
  }, [currentPath]);

  const handleReset = () => {
    resetForm();
    setCurrentPath([]);
  }

  const toggleRelatedTechnique = (techId: string) => {
    setNewTechnique(prev => ({
      ...prev,
      relatedTechniques: prev.relatedTechniques.includes(techId)
        ? prev.relatedTechniques.filter(id => id !== techId)
        : [...prev.relatedTechniques, techId]
    }));
  };

  const addTechnique = () => {
    if (!newTechnique.name || newTechnique.paths.length === 0) {
      alert('Please add a name and at least one path');
      return;
    }

    const technique: Technique = {
      ...newTechnique,
      id: Date.now().toString()
    };
    dispatch(setTechniques([...techniques, technique]));
    handleReset();
  };

  const saveTechnique = () => {
    if (!newTechnique.name || newTechnique.paths.length === 0) {
      alert('Please add a name and at least one path');
      return;
    }

    if (editingId) {
      // Update existing technique
      const updatedTechnique: Technique = {
        ...newTechnique,
        id: editingId
      };
      dispatch(updateTechnique(updatedTechnique));
      handleReset();
    } else {
      // Add new technique
      addTechnique();
    }
  };

  const cancelEdit = () => {
    handleReset();
  };

  const selectPathOption = (option: string) => {
    setCurrentPath([...currentPath, option]);
  };

  const removePathStep = (index: number) => {
    setCurrentPath(currentPath.slice(0, index));
  };

  const addPathToTechnique = () => {
    if (currentPath.length >= 3) {
      const pathString = currentPath.join(' > ');
      if (!newTechnique.paths.includes(pathString)) {
        setNewTechnique({
          ...newTechnique,
          paths: [...newTechnique.paths, pathString]
        });
      }
      setCurrentPath([]);
    }
  };

  const removePathFromTechnique = (pathToRemove: string) => {
    setNewTechnique({
      ...newTechnique,
      paths: newTechnique.paths.filter(p => p !== pathToRemove)
    });
  };

  return (
    <div className="form-card">
      <h3>{editingId ? 'Edit Technique' : 'New Technique'}</h3>
      <input
        type="text"
        placeholder="Technique name"
        value={newTechnique.name}
        onChange={e => setNewTechnique({ ...newTechnique, name: e.target.value })}
        className="input"
      />

      <textarea
        placeholder="Description"
        value={newTechnique.description}
        onChange={e => setNewTechnique({ ...newTechnique, description: e.target.value })}
        className="input textarea"
      />
      {/* Path Builder */}
      <div style={{ marginBottom: '16px' }}>
        <p className="label">Build Technique Path:</p>

        {/* Current Path Display */}
        <div className="path-builder">
          {currentPath.map((step, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="path-separator">›</span>}
              <button
                onClick={() => removePathStep(index)}
                className="path-step"
              >
                {step}
                <X size={14} style={{ marginLeft: '4px' }} />
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Available Options */}
        {availableOptions.length > 0 && (
          <div className="tag-container" style={{ marginTop: '12px' }}>
            {availableOptions.map(option => (
              <button
                key={option}
                onClick={() => selectPathOption(option)}
                className="tag"
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {currentPath.length >= 3 && (
          <button
            onClick={addPathToTechnique}
            className="btn-success"
            style={{ marginTop: '12px' }}
          >
            Add This Path
          </button>
        )}
      </div>

      {newTechnique.paths.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <p className="label">Technique Paths:</p>
          <div className="path-list">
            {newTechnique.paths.map((path, index) => (
              <div key={index} className="path-item">
                <span>{path}</span>
                <button
                  onClick={() => removePathFromTechnique(path)}
                  className="btn-danger-icon"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ marginBottom: '16px' }}>
        <p className="label">Related Techniques:</p>
        <div className="tag-container">
          {techniques
            .filter(tech => tech.id !== editingId) // Don't show the technique being edited
            .map(tech => (
              <button
                key={tech.id}
                onClick={() => toggleRelatedTechnique(tech.id)}
                className={`tag ${newTechnique.relatedTechniques.includes(tech.id) ? 'selected' : ''}`}
              >
                {tech.name}
              </button>
            ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={saveTechnique} className="btn-success">
          {editingId ? 'Update Technique' : 'Save Technique'}
        </button>
        {editingId && (
          <button onClick={cancelEdit} className="btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}
