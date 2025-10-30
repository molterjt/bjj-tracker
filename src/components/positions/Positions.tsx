// components/Positions.tsx

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Link as LinkIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import { IRootState, useAppDispatch } from '../../state/Store';
import { Position } from '../../state/types';
import { addPosition, updatePosition, deletePosition } from '../../state/slices/positionsSlice';
import '../../App.css';
import { Technique } from '../../state/types';

const CATEGORIES = ['Ground', 'Standing'];
const SUBCATEGORIES: { [key: string]: string[] } = {
  'Ground': ['Bottom', 'Top', 'Neutral'],
  'Standing': ['Neutral', 'Clinch', 'Grips']
};

export default function Positions() {
  const dispatch = useAppDispatch();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPosition, setNewPosition] = useState<Omit<Position, 'id'>>({
    name: '',
    category: 'Ground',
    subcategory: 'Guard',
    description: '',
    relatedPositions: []
  });

  const { positions } = useSelector((state: IRootState) => state.positionState);
  const { techniques } = useSelector((state: IRootState) => state.techState);

  const savePosition = () => {
    if (!newPosition.name.trim()) {
      alert('Please enter a position name');
      return;
    }

    if (editingId) {
      const updated: Position = { ...newPosition, id: editingId };
      dispatch(updatePosition(updated));
    } else {
      const position: Position = {
        ...newPosition,
        id: Date.now().toString()
      };
      dispatch(addPosition(position));
    }

    resetForm();
  };

  const startEdit = (position: Position) => {
    setEditingId(position.id);
    setNewPosition({
      name: position.name,
      category: position.category,
      subcategory: position.subcategory,
      description: position.description,
      relatedPositions: position.relatedPositions
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setNewPosition({
      name: '',
      category: 'Ground',
      subcategory: 'Guard',
      description: '',
      relatedPositions: []
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this position?')) {
      dispatch(deletePosition(id));
    }
  };

  const toggleRelatedPosition = (posId: string) => {
    setNewPosition(prev => ({
      ...prev,
      relatedPositions: prev.relatedPositions.includes(posId)
        ? prev.relatedPositions.filter((id: string) => id !== posId)
        : [...prev.relatedPositions, posId]
    }));
  };

  const getLinkedTechniques = (positionId: string) => {
    return techniques.filter((t: Technique) =>
      t.positionIds?.includes(positionId) ||
      t.fromPosition === positionId ||
      t.toPosition === positionId
    );
  };

  return (
    <div>
      <div className="section-header">
        <h2>Positions</h2>
        <button
          onClick={() => {
            if (showForm && editingId) {
              resetForm();
            } else {
              setShowForm(!showForm);
            }
          }}
          className="btn-primary"
        >
          <Plus size={18} />
          <span>{editingId ? 'Cancel Edit' : 'Add Position'}</span>
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? 'Edit Position' : 'New Position'}</h3>

          <input
            type="text"
            placeholder="Position name (e.g., Closed Guard)"
            value={newPosition.name}
            onChange={e => setNewPosition({ ...newPosition, name: e.target.value })}
            className="input"
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="label">Category:</label>
              <select
                value={newPosition.category}
                onChange={e => setNewPosition({
                  ...newPosition,
                  category: e.target.value,
                  subcategory: SUBCATEGORIES[e.target.value][0]
                })}
                className="input"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Subcategory:</label>
              <select
                value={newPosition.subcategory}
                onChange={e => setNewPosition({ ...newPosition, subcategory: e.target.value })}
                className="input"
              >
                {SUBCATEGORIES[newPosition.category].map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>

          <textarea
            placeholder="Description"
            value={newPosition.description}
            onChange={e => setNewPosition({ ...newPosition, description: e.target.value })}
            className="input textarea"
          />

          <div style={{ marginBottom: '16px' }}>
            <p className="label">Related Positions:</p>
            <div className="tag-container">
              {positions
                .filter((p: Position) => p.id !== editingId)
                .map((pos: Position) => (
                  <button
                    key={pos.id}
                    onClick={() => toggleRelatedPosition(pos.id)}
                    className={`tag ${newPosition.relatedPositions.includes(pos.id) ? 'selected' : ''}`}
                  >
                    {pos.name}
                  </button>
                ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={savePosition} className="btn-success">
              {editingId ? 'Update Position' : 'Save Position'}
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
        {positions.map((pos: Position) => {
          const linkedTechs = getLinkedTechniques(pos.id);
          return (
            <div key={pos.id} className="card">
              <div className="card-content">
                <div style={{ flex: 1 }}>
                  <h3 className="card-title">{pos.name}</h3>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <span className="badge">{pos.category}</span>
                    {pos.subcategory && (
                      <span className="badge">{pos.subcategory}</span>
                    )}
                  </div>

                  <p className="card-description">{pos.description}</p>

                  {linkedTechs.length > 0 && (
                    <div style={{ marginTop: '12px' }}>
                      <p className="label">
                        <LinkIcon size={14} style={{ display: 'inline', marginRight: '4px' }} />
                        Linked Techniques ({linkedTechs.length}):
                      </p>
                      <div className="tag-container">
                        {linkedTechs.slice(0, 5).map((tech: Technique) => (
                          <span key={tech.id} className="tag-small">
                            {tech.name}
                          </span>
                        ))}
                        {linkedTechs.length > 5 && (
                          <span className="tag-small">+{linkedTechs.length - 5} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  {pos.relatedPositions.length > 0 && (
                    <div style={{ marginTop: '12px' }}>
                      <p className="label">Related Positions:</p>
                      <div className="tag-container">
                        {pos.relatedPositions.map((relId: string) => {
                          const relPos = positions.find((p: Position) => p.id === relId);
                          return relPos ? (
                            <span key={relId} className="tag-small">
                              {relPos.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => startEdit(pos)}
                    className="btn-edit-icon"
                    title="Edit position"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(pos.id)}
                    className="btn-danger-icon"
                    title="Delete position"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}