import React, { useEffect, useMemo, useState } from 'react'
import { SortOption, Technique } from '../../state/types';
import { useSelector } from 'react-redux';
import { IRootState } from '../../state/Store';
import '../../App.css';
import Form from './Form';
import Card from './Card';
import Header from './Header';
import FilterSort from './FilterSort';


export default function Techniques() {
  const [showTechniqueForm, setShowTechniqueForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTechnique, setNewTechnique] = useState<Omit<Technique, 'id'>>({
    name: '',
    paths: [],
    description: '',
    relatedTechniques: []
  });
  // Filter and sort state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date-newest');
  const [searchQuery, setSearchQuery] = useState('');
  const { techniques } = useSelector(
    (state: IRootState) => state.techState,
  );

  // Get unique top-level categories from all techniques
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    techniques.forEach(tech => {
      tech.paths.forEach(path => {
        const topCategory = path.split(' > ')[0];
        categorySet.add(topCategory);
      });
    });
    return ['all', ...Array.from(categorySet).sort()];
  }, [techniques]);

  // Filter and sort techniques
  const filteredAndSortedTechniques = useMemo(() => {
    let result = [...techniques];

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(tech =>
        tech.paths.some(path => path.startsWith(selectedCategory))
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(tech =>
        tech.name.toLowerCase().includes(query) ||
        tech.description.toLowerCase().includes(query) ||
        tech.paths.some(path => path.toLowerCase().includes(query))
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'date-newest':
          return parseInt(b.id) - parseInt(a.id); // Assuming id is timestamp
        case 'date-oldest':
          return parseInt(a.id) - parseInt(b.id);
        default:
          return 0;
      }
    });

    return result;
  }, [techniques, selectedCategory, sortBy, searchQuery]);

  const startEdit = (tech: Technique) => {
    console.log('Starting edit for:', tech);
    setEditingId(tech.id);
    setNewTechnique({
      name: tech.name,
      paths: tech.paths,
      description: tech.description,
      relatedTechniques: tech.relatedTechniques
    });
    setShowTechniqueForm(true);
    // Scroll to top so user can see the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setNewTechnique({ name: '', paths: [], description: '', relatedTechniques: [] });
    setShowTechniqueForm(false);
    setEditingId(null);
  };

  const findRelatedTechnique = (relId: string): string => (
    techniques.find(t => t.id === relId)?.name || 'Unknown'
  )

  return (
    <div>
      <Header
        editingId={editingId}
        showTechniqueForm={showTechniqueForm}
        setShowTechniqueForm={setShowTechniqueForm}
        resetForm={resetForm}
      />
      {showTechniqueForm && (
        <Form
          editingId={editingId}
          resetForm={resetForm}
          newTechnique={newTechnique}
          setNewTechnique={setNewTechnique}
        />
      )}
      {/* Filter and Sort Controls */}
      <FilterSort
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        resultCount={filteredAndSortedTechniques.length}
        totalCount={techniques.length}
      />

      {/* Technique Cards */}
      {filteredAndSortedTechniques.length === 0 ? (
        <div className="empty-state">
          {searchQuery || selectedCategory !== 'all'
            ? 'No techniques match your filters'
            : 'No techniques yet. Add your first technique!'}
        </div>
      ) : (
        <div className="card-grid">
          {filteredAndSortedTechniques.map(tech => (
            <Card
              key={tech.id}
              tech={tech}
              startEdit={startEdit}
              findRelatedTechnique={findRelatedTechnique}
            />
          ))}
        </div>
      )}
    </div>
  )
};