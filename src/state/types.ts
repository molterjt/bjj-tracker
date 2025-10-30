export interface Technique {
  id: string;
  name: string;
  paths: string[];
  description: string;
  relatedTechniques: string[];
  positionIds?: string[]; // NEW: IDs of positions this technique is from/to
  fromPosition?: string; // Optional: Starting position
  toPosition?: string; // Optional: Ending position
}

export interface Position {
  id: string;
  name: string;
  category: string; // Ground, Standing, etc.
  subcategory?: string; // Guard, Top, etc.
  description: string;
  relatedPositions: string[]; // IDs of related positions
  createdAt?: string;
}

export interface ClassSession {
  id: string;
  date: string;
  techniqueIds: string[];
  notes: string;
}

export type SortOption = 'name-asc' | 'name-desc' | 'date-newest' | 'date-oldest';
