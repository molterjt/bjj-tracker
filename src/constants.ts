export enum TABS {
  TECHNIQUES = 'techniques',
  CLASS = 'classes',
  POS = 'positions',
  VIZ = 'visualize'
}

export enum STORAGE {
  TECHS = "bjj-techs",
  CLASS = "bjj-classes"
}

export enum CATEGORY {
  POS = "Position",
  TRAN = "Transition",
  SUB = "Submission",
  TD = "TakeDown",
}

export type CategoryKeys = CATEGORY.POS | CATEGORY.TRAN | CATEGORY.SUB | CATEGORY.TD;

interface CategoryStyle {
  /** The color value, which can be in 'rgba()' or hex format. */
  color: string;
  /** The radius value for the category. */
  radius: number;
}

export const CATEGORIES: Record<CATEGORY, CategoryStyle> = {
  "Position": {
    "color": 'rgba(80,20,255,1)',
    "radius": 18,
  },
  "Transition": {
    "color": '#10b981',
    "radius": 14,
  },
  "Submission": {
    "color": '#ef4444',
    "radius": 14,
  },
  "TakeDown": {
    "color": '#af00',
    "radius": 14,
  },
}

export const getRadius = (key: CATEGORY) => CATEGORIES[key].radius || 18;
export const getColor = (key: CATEGORY) => CATEGORIES[key].color || '#6b7280';

