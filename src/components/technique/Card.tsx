import React from 'react'
import { Technique } from '../../state/types'
import { Edit2, Trash2 } from 'lucide-react';
import { useAppDispatch } from '../../state/Store';
import { deleteTechnique } from '../../state/slices/techniquesSlice';
interface ICardProps {
  tech: Technique;
  startEdit: (tech: Technique) => void;
  findRelatedTechnique: (id: string) => string;
}
export default function Card({ tech, startEdit, findRelatedTechnique }: ICardProps) {
  const dispatch = useAppDispatch();

  const getTopCategory = (path: string): string => {
    return path.split(' > ')[0];
  };
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this technique?')) {
      dispatch(deleteTechnique(id));
    }
  };
  return (
    <div key={tech.id} className="card">
      <div className="card-content">
        <div style={{ flex: 1 }}>
          <h3 className="card-title">{tech.name}</h3>

          {/* Show all paths */}
          <div style={{ marginTop: '8px' }}>
            {tech.paths.map((path, index) => (
              <div key={index} className="technique-path">
                <span className={`category-badge ${getTopCategory(path).toLowerCase()}`}>
                  {getTopCategory(path)}
                </span>
                <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                  {path.split(' > ').slice(1).join(' › ')}
                </span>
              </div>
            ))}
          </div>

          <p className="card-description">{tech.description}</p>
          {tech.relatedTechniques.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              <p className="label">Related:</p>
              <div className="tag-container">
                {tech.relatedTechniques.map(relId => (
                  <span key={relId} className="tag-small">
                    {findRelatedTechnique(relId)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => startEdit(tech)}
            className="btn-edit-icon"
            title="Edit technique"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => handleDelete(tech.id)}
            className="btn-danger-icon"
            title="Delete technique"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
