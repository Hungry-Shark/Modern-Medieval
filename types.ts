
export interface Position {
  x: number;
  y: number;
}

export interface Player extends Position {
  id: string;
}

export interface Npc extends Position {
  id: number;
  type: 'soldier' | 'civilian';
  target: Position;
}

export interface Tent {
  id: number;
  name: string;
  position: Position;
}

export interface ChatMessage {
  id: number;
  sender: 'You' | 'Operator' | 'Civilian' | 'Soldier';
  text: string;
  timestamp: string;
}
