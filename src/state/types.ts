export interface Technique {
  id: string;
  name: string;
  paths: string[];
  description: string;
  relatedTechniques: string[];
}

export interface ClassSession {
  id: string;
  date: string;
  techniqueIds: string[];
  notes: string;
}

export type SortOption = 'name-asc' | 'name-desc' | 'date-newest' | 'date-oldest';
