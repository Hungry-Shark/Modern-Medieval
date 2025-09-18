
import React from 'react';

export const MAP_WIDTH = 800;
export const MAP_HEIGHT = 600;
export const PLAYER_SIZE = 40;
export const NPC_SIZE = 40;
export const TENT_SIZE = 80;
export const PLAYER_SPEED = 4;
export const INTERACTION_DISTANCE = 60;

export const PlayerIcon = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        <circle cx="50" cy="30" r="15" fill="#4a5568" />
        <rect x="35" y="45" width="30" height="40" rx="10" fill="#2d3748" />
        <rect x="30" y="50" width="10" height="30" rx="5" fill="#4a5568" transform="rotate(-15 35 65)" />
        <rect x="60" y="50" width="10" height="30" rx="5" fill="#4a5568" transform="rotate(15 65 65)" />
        <circle cx="50" cy="50" r="4" fill="#fefcbf" />
    </svg>
);

export const SoldierIcon = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <rect x="40" y="20" width="20" height="15" fill="#4a5568" />
        <circle cx="50" cy="40" r="15" fill="#a0aec0" />
        <rect x="35" y="55" width="30" height="35" rx="10" fill="#718096" />
        <rect x="45" y="60" width="10" height="20" rx="3" fill="#4a5568" />
    </svg>
);

export const CivilianIcon = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <circle cx="50" cy="30" r="15" fill="#e2e8f0" />
        <rect x="35" y="45" width="30" height="40" rx="10" fill="#a0aec0" />
        <circle cx="50" cy="65" r="5" fill="#cbd5e0" />
    </svg>
);

export const TentIcon = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
        <path d="M 50,10 L 10,90 H 90 Z" fill="#667a5b" />
        <path d="M 50,10 L 50,90" stroke="#4b5943" strokeWidth="5" />
        <path d="M 45,90 V 40 L 55,40 V 90 H 45 Z" fill="#2d3748" />
    </svg>
);
