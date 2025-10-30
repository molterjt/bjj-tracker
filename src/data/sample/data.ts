import { Technique, Position } from '../../state/types';

// ==================== POSITIONS ====================

export const samplePositions: Position[] = [
  // Guard Positions
  {
    id: "pos-1",
    name: "Closed Guard",
    category: "Ground",
    subcategory: "Guard",
    description: "Fundamental guard position with legs locked around opponent's waist",
    relatedPositions: ["pos-2", "pos-3"]
  },
  {
    id: "pos-2",
    name: "Open Guard",
    category: "Ground",
    subcategory: "Guard",
    description: "Guard position with legs not locked, using grips and frames",
    relatedPositions: ["pos-1", "pos-3"]
  },
  {
    id: "pos-3",
    name: "Half Guard",
    category: "Ground",
    subcategory: "Guard",
    description: "Guard position with one leg trapped between opponent's legs",
    relatedPositions: ["pos-1", "pos-2"]
  },

  // Top Positions
  {
    id: "pos-4",
    name: "Mount",
    category: "Ground",
    subcategory: "Top",
    description: "Dominant top position sitting on opponent's chest",
    relatedPositions: ["pos-5", "pos-6"]
  },
  {
    id: "pos-5",
    name: "Side Control",
    category: "Ground",
    subcategory: "Top",
    description: "Dominant top position perpendicular to opponent",
    relatedPositions: ["pos-4", "pos-6"]
  },
  {
    id: "pos-6",
    name: "Back Control",
    category: "Ground",
    subcategory: "Top",
    description: "Dominant position behind opponent with hooks in",
    relatedPositions: ["pos-4"]
  },

  // Other Positions
  {
    id: "pos-7",
    name: "Turtle",
    category: "Ground",
    subcategory: "Turtle",
    description: "Defensive position on hands and knees",
    relatedPositions: ["pos-5"]
  },
  {
    id: "pos-8",
    name: "Standing",
    category: "Standing",
    subcategory: "Neutral",
    description: "Both grapplers on their feet, start of most matches",
    relatedPositions: []
  }
];

// ==================== TECHNIQUES ====================

export const sampleTechniques: Technique[] = [
  // Submissions from Closed Guard
  {
    id: "tech-1",
    name: "Triangle Choke",
    paths: ["Submission > Ground > Guard > Triangle"],
    description: "Choke using the legs to create a triangle around opponent's neck and arm",
    relatedTechniques: ["tech-2", "tech-3"],
    positionIds: ["pos-1"],
    fromPosition: "pos-1",
    toPosition: ""
  },
  {
    id: "tech-2",
    name: "Armbar from Closed Guard",
    paths: ["Submission > Ground > Guard > Armbar"],
    description: "Hyperextend the elbow by controlling the arm across your hips",
    relatedTechniques: ["tech-1", "tech-3"],
    positionIds: ["pos-1"],
    fromPosition: "pos-1",
    toPosition: ""
  },
  {
    id: "tech-3",
    name: "Kimura from Closed Guard",
    paths: ["Submission > Ground > Guard > Kimura"],
    description: "Shoulder lock using figure-four grip on opponent's arm",
    relatedTechniques: ["tech-1", "tech-2"],
    positionIds: ["pos-1"],
    fromPosition: "pos-1",
    toPosition: ""
  },

  // Sweeps from Closed Guard
  {
    id: "tech-4",
    name: "Scissor Sweep",
    paths: ["Transition > Ground > Guard > Sweep"],
    description: "Fundamental sweep from closed guard using scissoring leg motion",
    relatedTechniques: ["tech-5"],
    positionIds: ["pos-1"],
    fromPosition: "pos-1",
    toPosition: "pos-4"
  },
  {
    id: "tech-5",
    name: "Hip Bump Sweep",
    paths: ["Transition > Ground > Guard > Sweep"],
    description: "Sweep by bumping opponent with your hip while sitting up",
    relatedTechniques: ["tech-4"],
    positionIds: ["pos-1"],
    fromPosition: "pos-1",
    toPosition: "pos-4"
  },

  // Open Guard Techniques
  {
    id: "tech-6",
    name: "Spider Guard Sweep",
    paths: ["Transition > Ground > Guard > Sweep"],
    description: "Sweep from spider guard using sleeve control and foot on bicep",
    relatedTechniques: ["tech-7"],
    positionIds: ["pos-2"],
    fromPosition: "pos-2",
    toPosition: "pos-4"
  },
  {
    id: "tech-7",
    name: "Triangle from Open Guard",
    paths: ["Submission > Ground > Guard > Triangle"],
    description: "Triangle setup from open guard position",
    relatedTechniques: ["tech-6", "tech-1"],
    positionIds: ["pos-2"],
    fromPosition: "pos-2",
    toPosition: ""
  },

  // Half Guard Techniques
  {
    id: "tech-8",
    name: "Old School Sweep",
    paths: ["Transition > Ground > Half Guard > Sweep"],
    description: "Classic sweep from half guard by rolling opponent backwards",
    relatedTechniques: [],
    positionIds: ["pos-3"],
    fromPosition: "pos-3",
    toPosition: "pos-4"
  },

  // Mount Attacks
  {
    id: "tech-9",
    name: "Armbar from Mount",
    paths: ["Submission > Ground > Mount > Armbar"],
    description: "High percentage armbar from mount position",
    relatedTechniques: ["tech-10"],
    positionIds: ["pos-4"],
    fromPosition: "pos-4",
    toPosition: ""
  },
  {
    id: "tech-10",
    name: "Ezekiel Choke from Mount",
    paths: ["Submission > Ground > Mount > Ezekiel"],
    description: "Gi choke from mount using sleeve grip",
    relatedTechniques: ["tech-9"],
    positionIds: ["pos-4"],
    fromPosition: "pos-4",
    toPosition: ""
  },

  // Side Control Attacks
  {
    id: "tech-11",
    name: "Americana from Side Control",
    paths: ["Submission > Ground > Side Control > Americana"],
    description: "Shoulder lock from side control with figure-four grip",
    relatedTechniques: ["tech-12"],
    positionIds: ["pos-5"],
    fromPosition: "pos-5",
    toPosition: ""
  },
  {
    id: "tech-12",
    name: "Kimura from Side Control",
    paths: ["Submission > Ground > Side Control > Kimura"],
    description: "Reverse shoulder lock from side control",
    relatedTechniques: ["tech-11"],
    positionIds: ["pos-5"],
    fromPosition: "pos-5",
    toPosition: ""
  },

  // Back Control Attacks
  {
    id: "tech-13",
    name: "Rear Naked Choke",
    paths: ["Submission > Ground > Back Control > Rear Naked Choke"],
    description: "Blood choke from back control, one of the highest percentage submissions",
    relatedTechniques: ["tech-14"],
    positionIds: ["pos-6"],
    fromPosition: "pos-6",
    toPosition: ""
  },
  {
    id: "tech-14",
    name: "Bow and Arrow Choke",
    paths: ["Submission > Ground > Back Control > Bow and Arrow"],
    description: "Gi choke from back control using lapel",
    relatedTechniques: ["tech-13"],
    positionIds: ["pos-6"],
    fromPosition: "pos-6",
    toPosition: ""
  },

  // Turtle Attacks
  {
    id: "tech-15",
    name: "Clock Choke",
    paths: ["Submission > Ground > Turtle > Clock Choke"],
    description: "Gi choke from turtle position by walking around opponent",
    relatedTechniques: [],
    positionIds: ["pos-7"],
    fromPosition: "pos-7",
    toPosition: ""
  },

  // Guard Passes
  {
    id: "tech-16",
    name: "Toreando Pass",
    paths: ["Transition > Ground > Guard > Pass"],
    description: "Standing pass where you push the legs to one side",
    relatedTechniques: ["tech-17"],
    positionIds: ["pos-2"],
    fromPosition: "pos-2",
    toPosition: "pos-5"
  },
  {
    id: "tech-17",
    name: "Knee Slice Pass",
    paths: ["Transition > Ground > Guard > Pass"],
    description: "Pass by slicing the knee through opponent's guard",
    relatedTechniques: ["tech-16"],
    positionIds: ["pos-2"],
    fromPosition: "pos-2",
    toPosition: "pos-5"
  },

  // Takedowns
  {
    id: "tech-18",
    name: "Double Leg Takedown",
    paths: ["Transition > Standing > Takedown > Double Leg"],
    description: "Fundamental takedown attacking both legs",
    relatedTechniques: ["tech-19"],
    positionIds: ["pos-8"],
    fromPosition: "pos-8",
    toPosition: "pos-5"
  },
  {
    id: "tech-19",
    name: "Single Leg Takedown",
    paths: ["Transition > Standing > Takedown > Single Leg"],
    description: "Takedown focusing on one leg",
    relatedTechniques: ["tech-18"],
    positionIds: ["pos-8"],
    fromPosition: "pos-8",
    toPosition: "pos-5"
  },
  {
    id: "tech-20",
    name: "Closed Guard Pull",
    paths: ["Transition > Standing > Guard Pull > Closed Guard"],
    description: "Pull opponent into closed guard from standing",
    relatedTechniques: [],
    positionIds: ["pos-8"],
    fromPosition: "pos-8",
    toPosition: "pos-1"
  }
];

// ==================== HIERARCHICAL PATH DATA ====================

export const sampleData: { [key: string]: any } = {
  'Position': {
    'Ground': {
      'Guard': ['Closed Guard', 'Open Guard', 'Half Guard', 'Butterfly Guard', 'X Guard', 'De La Riva'],
      'Top': ['Mount', 'Side Control', 'Knee on Belly', 'North South', 'Back Control'],
      'Turtle': ['Turtle Top', 'Turtle Bottom']
    },
    'Standing': {
      'Neutral': ['Standing'],
      'Clinch': ['Over Under', 'Double Underhooks', 'Body Lock']
    }
  },
  'Transition': {
    'Ground': {
      'Guard': ['Sweep', 'Pass', 'Guard Recovery'],
      'Half Guard': ['Sweep', 'Pass'],
      'Mount': ['Mount Escape', 'Back Take'],
      'Side Control': ['Escape', 'Back Take']
    },
    'Standing': {
      'Takedown': ['Double Leg', 'Single Leg', 'Throw', 'Trip'],
      'Guard Pull': ['Closed Guard', 'Open Guard']
    }
  },
  'Submission': {
    'Ground': {
      'Guard': ['Triangle', 'Armbar', 'Kimura', 'Guillotine', 'Omoplata'],
      'Mount': ['Armbar', 'Ezekiel', 'Triangle', 'Americana'],
      'Side Control': ['Americana', 'Kimura', 'Arm Triangle'],
      'Back Control': ['Rear Naked Choke', 'Bow and Arrow'],
      'Turtle': ['Clock Choke', 'Crucifix'],
      'Half Guard': ['Kimura', 'Triangle']
    },
    'Standing': {
      'Chokes': ['Standing Guillotine', 'Standing RNC']
    }
  }
};

export const DEFAULT_CATEGORIES = ['Position', 'Transition', 'Submission'];