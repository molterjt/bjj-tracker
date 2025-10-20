import { Technique } from "../state/types";


export const sampleTechniques: Technique[] = [

  {
    "id": "1",
    "name": "Closed Guard",
    "paths": [
      "Position > Ground > Guard > Closed Guard"
    ],
    "description": "Fundamental guard position with legs locked around opponent",
    "relatedTechniques": [
      "2",
      "3",
      "4"
    ]
  },
  {
    "id": "2",
    "name": "Triangle Choke",
    "paths": [
      "Submission > Ground > Guard > Triangle"
    ],
    "description": "Choke using legs from guard, also a controlling position",
    "relatedTechniques": [
      "1",
      "3"
    ]
  },
  {
    "id": "3",
    "name": "Armbar from Guard",
    "paths": [
      "Submission > Ground > Guard > Armbar"
    ],
    "description": "Classic submission attacking the elbow",
    "relatedTechniques": [
      "1",
      "2"
    ]
  },
  {
    "id": "4",
    "name": "Scissor Sweep",
    "paths": [
      "Transition > Ground > Guard > Sweep"
    ],
    "description": "Fundamental sweep from closed guard",
    "relatedTechniques": [
      "1"
    ]
  },
  {
    "name": "Turtle",
    "paths": [
      "Position > Ground > Turtle"
    ],
    "description": "Position generally attacking from with oppenent balled up in prone position",
    "relatedTechniques": [
      "1760890170877"
    ],
    "id": "5"
  },
  {
    "id": "6",
    "name": "Side Control",
    "paths": [
      "Position > Ground > Side Control"
    ],
    "description": "Position generally attacking from with oppenent balled up in prone position",
    "relatedTechniques": []
  },
  {
    "id": "7",
    "name": "Mount",
    "paths": [
      "Position > Ground > Mount"
    ],
    "description": "Position generally attacking from with oppenent balled up in prone position",
    "relatedTechniques": []
  },
  {
    "id": "8",
    "name": "Half Guard",
    "paths": [
      "Position > Ground > Half Guard"
    ],
    "description": "Position generally attacking from with oppenent balled up in prone position",
    "relatedTechniques": []
  },
  {
    "id": "9",
    "name": "Back Control",
    "paths": [
      "Position > Ground > Back Control"
    ],
    "description": "Position generally attacking from with oppenent balled up in prone position",
    "relatedTechniques": []
  },
  {
    "name": "Rear Nake Choke",
    "paths": [
      "Submission > Ground > Back Control > Top"
    ],
    "description": "Mate Leon",
    "relatedTechniques": [
      "9"
    ],
    "id": "10"
  },
  {
    "id": "11",
    "name": "Standing",
    "paths": [
      "Position > Standing"
    ],
    "description": "Fundamental guard position with legs locked around opponent",
    "relatedTechniques": []
  },
  {
    "name": "Clock Choke",
    "paths": [
      "Submission > Ground > Turtle > Turtle Top"
    ],
    "description": "",
    "relatedTechniques": [
      "5"
    ],
    "id": "1760890170877"
  },
  {
    "name": "John Wayne Sweep",
    "paths": [
      "Transition > Ground > Half Guard > Bottom"
    ],
    "description": "",
    "relatedTechniques": [
      "8"
    ],
    "id": "1760890227276"
  }
]

export const sampleData: { [key: string]: any } = {
  'Position': {
    'Ground': {
      'Guard': ['Closed Guard', 'Open Guard', 'Half Guard', 'Butterfly Guard', 'X Guard', 'De La Riva', 'Turtle'],
      'Top': ['Mount', 'Side Control', 'Knee on Belly', 'North South', 'Back Control'],
      'Turtle': ['Turtle Top', 'Turtle Bottom'],
      'Side Control': ['Top', 'Bottom'],
      'Half Guard': ['Top', 'Bottom'],
      'Back Control': ['Top', 'Bottom'],
    },
    'Standing': {
      'Gi': ['Collar-Sleeve'],
      'NoGi': ['Over Under', 'Double Underhooks', 'Body Lock'],
      'No Grips': ['Shots'],
    }
  },
  'Transition': {
    'Ground': {
      'Guard': ['Sweep', 'Guard Pass', 'Guard Recovery'],
      'Top': ['To Mount', 'To Back', 'To Half Guard'],
      'Half Guard': ['Top', 'Bottom'],
      'Submissions': ['Submission Escape', 'Defense']
    },
    'Standing': {
      'Takedown': ['Single Leg', 'Double Leg', 'Throw', 'Trip'],
      'Guard Pull': ['Closed Guard Pull', 'Open Guard Pull']
    }
  },
  'Submission': {
    'Ground': {
      'Guard': ['Triangle', 'Armbar', 'Kimura', 'Guillotine', 'Omoplata'],
      'Top': ['Americana', 'Arm Triangle', 'Rear Naked Choke', 'Bow and Arrow'],
      'Leg Locks': ['Heel Hook', 'Knee Bar', 'Toe Hold', 'Ankle Lock'],
      'Turtle': ['Turtle Top', 'Turtle Bottom'],
      'Back Control': ['Top', 'Bottom'],
      'Side Control': ['Top', 'Bottom'],
      'Mount': ['Top', 'Bottom'],

    },
    'Standing': {
      'Chokes': ['Standing Guillotine', 'Standing RNC']
    }
  }
};


export const DEFAULT_CATEGORIES = ['Guard', 'Pass', 'Submission', 'Escape', 'Takedown', 'Position'];
