import React, { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { ClassSession } from '../state/types';
import { useSelector } from 'react-redux';
import { IRootState } from '../state/Store';
import '../App.css';

export default function Classes() {
  const [classes, setClasses] = useState<ClassSession[]>([]);

  const [showClassForm, setShowClassForm] = useState(false);
  const [newClass, setNewClass] = useState<Omit<ClassSession, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    techniqueIds: [],
    notes: ''
  });
  const { techniques } = useSelector(
    (state: IRootState) => state.techState,
  );

  const addClass = () => {
    const classSession: ClassSession = {
      ...newClass,
      id: Date.now().toString()
    };
    setClasses([...classes, classSession]);
    setNewClass({
      date: new Date().toISOString().split('T')[0],
      techniqueIds: [],
      notes: ''
    });
    setShowClassForm(false);
  };

  const deleteClass = (id: string) => {
    setClasses(classes.filter(c => c.id !== id));
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
          onClick={() => setShowClassForm(!showClassForm)}
          className="btn-primary"
        >
          <Plus size={18} />
          <span>Log Class</span>
        </button>
      </div>

      {showClassForm && (
        <div className="form-card">
          <h3>New Class Session</h3>
          <input
            type="date"
            value={newClass.date}
            onChange={e => setNewClass({ ...newClass, date: e.target.value })}
            className="input"
          />
          <div>
            <p className="label">Techniques Covered:</p>
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
          <textarea
            placeholder="Class notes..."
            value={newClass.notes}
            onChange={e => setNewClass({ ...newClass, notes: e.target.value })}
            className="input textarea"
          />
          <button onClick={addClass} className="btn-success">
            Save Class
          </button>
        </div>
      )}

      <div className="card-grid">
        {classes.sort((a, b) => b.date.localeCompare(a.date)).map(cls => (
          <div key={cls.id} className="card">
            <div className="card-content">
              <div style={{ flex: 1 }}>
                <h3 className="card-title">
                  {new Date(cls.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h3>
                <div style={{ marginTop: '12px' }}>
                  <p className="label">Techniques:</p>
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
              <button
                onClick={() => deleteClass(cls.id)}
                className="btn-danger-icon"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

