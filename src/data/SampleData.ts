import { Technique } from "../state/types";


export const sampleTechniques: Technique[] = [
  {
    "id": "1",
    "name": "Closed Guard",
    "paths": [
      "Position > Guard > Closed Guard"
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
      "Submission > Guard > Triangle"
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
      "Submission > Guard > Armbar"
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
      "Transition > Guard > Sweep"
    ],
    "description": "Fundamental sweep from closed guard",
    "relatedTechniques": [
      "1"
    ]
  },
  {
    "name": "Turtle",
    "paths": [
      "Position > Turtle"
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
      "Position > Side Control"
    ],
    "description": "Position generally attacking from with oppenent balled up in prone position",
    "relatedTechniques": []
  },
  {
    "id": "7",
    "name": "Mount",
    "paths": [
      "Position > Mount"
    ],
    "description": "Position generally attacking from with oppenent balled up in prone position",
    "relatedTechniques": []
  },
  {
    "id": "8",
    "name": "Half Guard",
    "paths": [
      "Position > Half Guard"
    ],
    "description": "Position generally attacking from with oppenent balled up in prone position",
    "relatedTechniques": []
  },
  {
    "id": "9",
    "name": "Back Control",
    "paths": [
      "Position > Back Control"
    ],
    "description": "Position generally attacking from with oppenent balled up in prone position",
    "relatedTechniques": []
  },
  {
    "name": "Rear Nake Choke",
    "paths": [
      "Submission > Back Control > Top"
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
      "Submission > Turtle > Turtle Top"
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
      "Transition > Half Guard > Bottom"
    ],
    "description": "",
    "relatedTechniques": [
      "8"
    ],
    "id": "1760890227276"
  },
  {
    "name": "Choi Bar",
    "paths": [
      "Submission > Side Control > Bottom"
    ],
    "description": "Cool arm bar from side control",
    "relatedTechniques": [
      "6"
    ],
    "id": "1760930492436"
  },
  {
    "name": "Open Guard",
    "paths": [
      "Position > Guard"
    ],
    "description": "",
    "relatedTechniques": [],
    "id": "1760930560467"
  },
  {
    "name": "Tri-Pod Sweep",
    "paths": [
      "Transition > Guard"
    ],
    "description": "",
    "relatedTechniques": [
      "1760930560467"
    ],
    "id": "1760930612934"
  }
]


export const sampleData: { [key: string]: any } = {
  'Position': {
    'Guard': {
      "Closed Guard": ['Top', 'Bottom'],
      "Open Guard": ['Top', 'Bottom'],
      "Butterfly Guard": ['Top', 'Bottom'],
      "X Guard": ['Top', 'Bottom'],
      "De La Riva": ['Top', 'Bottom'],
      "Knee Shield": ['Top', 'Bottom'],
    },
    // 'Guard': ['Top', 'Bottom'],
    'Turtle': ['Top', 'Bottom'],
    'Side Control': ['Top', 'Bottom'],
    'Half Guard': ['Top', 'Bottom'],
    'Back Control': ['Top', 'Bottom'],
    'Knee on Belly': ['Top', 'Bottom'],
    'North South': ['Top', 'Bottom'],
    // },
    // 'Standing': {
    //   'Gi': ['Collar-Sleeve'],
    //   'NoGi': ['Over Under', 'Double Underhooks', 'Body Lock'],
    //   'No Grips': ['Shots'],
    // }
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
  'Takedown': {

  },
  'Submission': {
    'Ground': {
      'Guard': ['Triangle', 'Armbar', 'Kimura', 'Guillotine', 'Omoplata'],
      'Leg Locks': ['Heel Hook', 'Knee Bar', 'Toe Hold', 'Ankle Lock'],
      'Turtle': ['Turtle Top', 'Turtle Bottom'],
      'Back Control': ['Top', 'Bottom'],
      'Side Control': ['Top', 'Bottom'],
      'Mount': ['Top', 'Bottom'],

    },
    'Standing': {
      'Chokes': ['Standing Guillotine', 'Standing RNC'],
      'Joint Locks': ['Wrist Lock']
    }
  }
};

export const sampleClasses = [
  {
    "date": "2025-10-20",
    "techniqueIds": [
      "1760930560467",
      "1760930612934",
      "8",
      "1760890227276",
      "1760930492436",
      "6"
    ],
    "notes": "",
    "id": "1760934390045"
  },
  {
    "date": "2025-10-19",
    "techniqueIds": [
      "1",
      "3",
      "2",
      "4",
      "1760930492436",
      "6"
    ],
    "notes": "",
    "id": "1760935648772"
  }
]