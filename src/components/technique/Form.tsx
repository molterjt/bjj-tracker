import React, { useEffect, useState } from 'react'
import { Technique } from '../../state/types';
import { IRootState, useAppDispatch } from '../../state/Store';
import { setTechniques, updateTechnique } from '../../state/slices/techniquesSlice';
import { useSelector } from 'react-redux';
import { X } from 'lucide-react';
import { sampleData } from '../../data/sample/data';

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

  // Get positions from state if available
  const positions = useSelector((state: IRootState) =>
    state.positionState?.positions || []
  );

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

  const togglePosition = (posId: string) => {
    setNewTechnique(prev => ({
      ...prev,
      positionIds: prev.positionIds?.includes(posId)
        ? prev.positionIds.filter(id => id !== posId)
        : [...(prev.positionIds || []), posId]
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

      {/* Position Linking - Only show if positions exist */}
      {positions.length > 0 && (
        <>
          <div style={{ marginBottom: '16px' }}>
            <p className="label">Link to Positions (optional):</p>
            <div className="tag-container">
              {positions.map(pos => (
                <button
                  key={pos.id}
                  onClick={() => togglePosition(pos.id)}
                  className={`tag ${newTechnique.positionIds?.includes(pos.id) ? 'selected' : ''}`}
                >
                  {pos.name}
                </button>
              ))}
            </div>
          </div>

          {/* From/To Positions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label className="label">From Position (optional):</label>
              <select
                value={newTechnique.fromPosition || ''}
                onChange={e => setNewTechnique({ ...newTechnique, fromPosition: e.target.value })}
                className="input"
              >
                <option value="">None</option>
                {positions.map(pos => (
                  <option key={pos.id} value={pos.id}>
                    {pos.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">To Position (optional):</label>
              <select
                value={newTechnique.toPosition || ''}
                onChange={e => setNewTechnique({ ...newTechnique, toPosition: e.target.value })}
                className="input"
              >
                <option value="">None</option>
                {positions.map(pos => (
                  <option key={pos.id} value={pos.id}>
                    {pos.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}

      {/* Related Techniques */}
      <div style={{ marginBottom: '16px' }}>
        <p className="label">Related Techniques:</p>
        <div className="tag-container">
          {techniques
            .filter(tech => tech.id !== editingId)
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