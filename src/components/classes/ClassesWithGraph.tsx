import React, { useState } from 'react'
import { Plus, Trash2, Edit2, Network, List } from 'lucide-react'
import { ClassSession } from '../../state/types';
import { useSelector } from 'react-redux';
import { IRootState, useAppDispatch } from '../../state/Store';
import '../../App.css';
import { deleteClass, setClasses, updateClass } from '../../state/slices/classSlice';
import ClassGraphBuilder from './ClassGraphBuilder';
import ClassGraphModal from './ClassGraphModal';

export default function Classes() {
  const dispatch = useAppDispatch();
  const [showClassForm, setShowClassForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [builderMode, setBuilderMode] = useState<'list' | 'graph'>('list');
  const [viewingClass, setViewingClass] = useState<ClassSession | null>(null);
  const [newClass, setNewClass] = useState<Omit<ClassSession, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    techniqueIds: [],
    notes: ''
  });

  const { techniques } = useSelector(
    (state: IRootState) => state.techState,
  );
  const { classes } = useSelector(
    (state: IRootState) => state.classState,
  );

  const addClass = () => {
    if (newClass.techniqueIds.length === 0) {
      alert('Please add at least one technique');
      return;
    }

    const classSession: ClassSession = {
      ...newClass,
      id: Date.now().toString()
    };
    dispatch(setClasses([...classes, classSession]));
    resetForm();
  };

  const saveClass = () => {
    if (newClass.techniqueIds.length === 0) {
      alert('Please add at least one technique');
      return;
    }

    if (editingId) {
      // Update existing class
      const updatedClass: ClassSession = {
        ...newClass,
        id: editingId
      };
      dispatch(updateClass(updatedClass));
      resetForm();
    } else {
      // Add new class
      addClass();
    }
  };

  const startEdit = (cls: ClassSession) => {
    setEditingId(cls.id);
    setNewClass({
      date: cls.date,
      techniqueIds: cls.techniqueIds,
      notes: cls.notes
    });
    setShowClassForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setNewClass({
      date: new Date().toISOString().split('T')[0],
      techniqueIds: [],
      notes: ''
    });
    setShowClassForm(false);
    setEditingId(null);
    setBuilderMode('list');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      dispatch(deleteClass(id));
    }
  };

  const toggleTechniqueSelection = (techId: string) => {
    setNewClass(prev => ({
      ...prev,
      techniqueIds: prev.techniqueIds.includes(techId)
        ? prev.techniqueIds.filter(id => id !== techId)
        : [...prev.techniqueIds, techId]
    }));
  };

  return (
    <div>
      <div className="section-header">
        <h2>Training Sessions</h2>
        <button
          onClick={() => {
            if (showClassForm && editingId) {
              resetForm();
            } else {
              setShowClassForm(!showClassForm);
            }
          }}
          className={editingId || showClassForm ? "btn-success" : "btn-primary"}
        // className="btn-primary"
        >

          {editingId || showClassForm ? null : <Plus size={18} />}
          <span>{editingId || showClassForm ? 'Cancel' : 'Add Class'}</span>
        </button>
      </div>

      {showClassForm && (
        <div className="form-card">
          <h3>{editingId ? 'Edit Class Session' : 'New Class Session'}</h3>

          <input
            type="date"
            value={newClass.date}
            onChange={e => setNewClass({ ...newClass, date: e.target.value })}
            className="input"
          />

          {/* Mode Selector */}
          <div style={{ marginBottom: '16px' }}>
            <p className="label">Select Techniques:</p>
            <div className="mode-selector">
              <button
                onClick={() => setBuilderMode('list')}
                className={`mode-button ${builderMode === 'list' ? 'active' : ''}`}
              >
                <List size={16} />
                <span>List View</span>
              </button>
              <button
                onClick={() => setBuilderMode('graph')}
                className={`mode-button ${builderMode === 'graph' ? 'active' : ''}`}
              >
                <Network size={16} />
                <span>Graph Builder</span>
              </button>

            </div>
          </div>

          {/* List Mode */}
          {builderMode === 'list' && (
            <div style={{ marginBottom: '16px' }}>
              <div className="tag-container">
                {techniques.map(tech => (
                  <button
                    key={tech.id}
                    onClick={() => toggleTechniqueSelection(tech.id)}
                    className={`tag ${newClass.techniqueIds.includes(tech.id) ? 'selected' : ''}`}
                  >
                    {tech.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Graph Mode */}
          {builderMode === 'graph' && (
            <ClassGraphBuilder
              techniques={techniques}
              selectedIds={newClass.techniqueIds}
              onToggleTechnique={toggleTechniqueSelection}
            />
          )}

          {/* Selected Count */}
          {newClass.techniqueIds.length > 0 && (
            <div className="selected-count">
              {newClass.techniqueIds.length} technique{newClass.techniqueIds.length !== 1 ? 's' : ''} selected
            </div>
          )}

          <textarea
            placeholder="Class notes..."
            value={newClass.notes}
            onChange={e => setNewClass({ ...newClass, notes: e.target.value })}
            className="input textarea"
          />

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={saveClass} className="btn-success">
              {editingId ? 'Update Class' : 'Save Class'}
            </button>
            {editingId && (
              <button onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      <div className="card-grid">
        {classes && classes.length && [...classes].sort((a, b) => b.date.localeCompare(a.date)).map(cls => (
          <div key={cls.id} className="card">
            <div className="card-content">
              <div style={{ flex: 1 }}>
                <h3 className="card-title">
                  {new Date(cls.date + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h3>
                <button
                  onClick={() => setViewingClass(cls)}
                  className={`mode-button view`}
                >
                  <Network size={16} />
                  <span>View Graph</span>
                </button>
                <div style={{ marginTop: '12px' }}>
                  <p className="label">Techniques ({cls.techniqueIds.length}):</p>
                  <div className="tag-container">
                    {cls.techniqueIds.map(techId => (
                      <span key={techId} className="tag-small">
                        {techniques.find(t => t.id === techId)?.name || 'Unknown'}
                      </span>
                    ))}
                  </div>
                </div>
                {cls.notes && (
                  <p className="card-description">{cls.notes}</p>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={() => startEdit(cls)}
                  className="btn-edit-icon"
                  title="Edit class"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(cls.id)}
                  className="btn-danger-icon"
                  title="Delete class"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Graph Modal for viewing existing classes */}
      {viewingClass && (
        <ClassGraphModal
          classSession={viewingClass}
          techniques={techniques}
          onClose={() => setViewingClass(null)}
        />
      )}
    </div>
  )
}