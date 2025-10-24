import React from 'react';
import '../../App.css';
import { Plus } from 'lucide-react';

interface IHeaderProps {
  editingId: string | null;
  showTechniqueForm: boolean;
  setShowTechniqueForm: React.Dispatch<React.SetStateAction<boolean>>;
  resetForm: () => void;

}
export default function Header(props: IHeaderProps) {
  const { editingId, showTechniqueForm, setShowTechniqueForm, resetForm } = props;
  return (
    <div className="section-header">
      <h2>Technique Library</h2>
      <button
        onClick={() => {
          if (showTechniqueForm && editingId) {
            resetForm();
          } else {
            setShowTechniqueForm(!showTechniqueForm);
          }
        }}
        className={showTechniqueForm || editingId ? "btn-success" : "btn-primary"}
      >
        {showTechniqueForm || editingId ? null : <Plus size={18} />}
        <span>{showTechniqueForm || editingId ? 'Cancel' : 'Add Technique'}</span>
      </button>
    </div>
  );
}