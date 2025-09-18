import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Player, Npc, Tent, Position } from './types';
import {
    MAP_WIDTH, MAP_HEIGHT, PLAYER_SIZE, NPC_SIZE, TENT_SIZE, PLAYER_SPEED, INTERACTION_DISTANCE,
    PlayerIcon, SoldierIcon, CivilianIcon, TentIcon
} from './constants';
import TentModal from './components/TentModal';
import AmbientSounds from './components/AmbientSounds';

const initialTents: Tent[] = [
    { id: 1, name: 'Alpha Squad Tent', position: { x: 100, y: 100 } },
    { id: 2, name: 'Civilian Shelter', position: { x: 650, y: 450 } },
    { id: 3, name: 'Command Post', position: { x: 400, y: 250 } },
];

const initialNpcs: Npc[] = [
    { id: 1, type: 'soldier', x: 200, y: 300, target: { x: 200, y: 300 } },
    { id: 2, type: 'civilian', x: 500, y: 150, target: { x: 500, y: 150 } },
    { id: 3, type: 'soldier', x: 700, y: 400, target: { x: 700, y: 400 } },
    { id: 4, type: 'civilian', x: 150, y: 500, target: { x: 150, y: 500 } },
];

// FIX: Moved NpcComponent outside of the App component.
// Defining components inside other components is an anti-pattern in React that can cause performance issues and unexpected behavior, including type errors with props like 'key'.
const NpcComponent = ({ npc }: { npc: Npc }) => {
    const style: React.CSSProperties = {
        position: 'absolute',
        left: npc.x,
        top: npc.y,
        width: NPC_SIZE,
        height: NPC_SIZE,
        transition: 'left 0.1s linear, top 0.1s linear',
    };
    return (
        <div style={style}>
            {npc.type === 'soldier' ? <SoldierIcon /> : <CivilianIcon />}
        </div>
    );
};

const App: React.FC = () => {
    const [player, setPlayer] = useState<Player>({ id: 'player1', x: MAP_WIDTH / 2, y: MAP_HEIGHT / 2 });
    const [npcs, setNpcs] = useState<Npc[]>(initialNpcs);
    const [tents] = useState<Tent[]>(initialTents);
    const [activeTent, setActiveTent] = useState<Tent | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [interactionTarget, setInteractionTarget] = useState<Tent | null>(null);
    const [audioStarted, setAudioStarted] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [campfireVolume, setCampfireVolume] = useState(0);

    const keysPressed = useRef<{ [key: string]: boolean }>({});
    // FIX: The `useRef<number>()` hook requires an initial value of type `number`.
    // Initializing with `null` and updating the type to `number | null` resolves the error.
    const gameLoopRef = useRef<number | null>(null);

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!audioStarted) {
            setAudioStarted(true);
        }
        keysPressed.current[e.key.toLowerCase()] = true;
        if (e.key.toLowerCase() === 'e' && interactionTarget) {
            setActiveTent(interactionTarget);
            setModalOpen(true);
        }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
        keysPressed.current[e.key.toLowerCase()] = false;
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interactionTarget, audioStarted]);

    const gameLoop = useCallback(() => {
        // Player movement
        setPlayer(p => {
            let { x, y } = p;
            if (keysPressed.current['w'] || keysPressed.current['arrowup']) y -= PLAYER_SPEED;
            if (keysPressed.current['s'] || keysPressed.current['arrowdown']) y += PLAYER_SPEED;
            if (keysPressed.current['a'] || keysPressed.current['arrowleft']) x -= PLAYER_SPEED;
            if (keysPressed.current['d'] || keysPressed.current['arrowright']) x += PLAYER_SPEED;

            x = Math.max(0, Math.min(MAP_WIDTH - PLAYER_SIZE, x));
            y = Math.max(0, Math.min(MAP_HEIGHT - PLAYER_SIZE, y));
            return { ...p, x, y };
        });
        
        // NPC movement
        setNpcs(currentNpcs => currentNpcs.map(npc => {
            const dx = npc.target.x - npc.x;
            const dy = npc.target.y - npc.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 5) {
                // New target
                return {
                    ...npc,
                    target: {
                        x: Math.random() * (MAP_WIDTH - NPC_SIZE),
                        y: Math.random() * (MAP_HEIGHT - NPC_SIZE),
                    }
                };
            } else {
                return {
                    ...npc,
                    x: npc.x + (dx / distance),
                    y: npc.y + (dy / distance),
                };
            }
        }));

        // Interaction and Sound Calculation
        let closestTentForInteraction: Tent | null = null;
        let minInteractionDistance = INTERACTION_DISTANCE;
        let minSoundDistance = Infinity;
        
        tents.forEach(tent => {
            const tentCenterX = tent.position.x + TENT_SIZE / 2;
            const tentCenterY = tent.position.y + TENT_SIZE / 2;
            const playerCenterX = player.x + PLAYER_SIZE / 2;
            const playerCenterY = player.y + PLAYER_SIZE / 2;
            
            const distance = Math.sqrt(Math.pow(tentCenterX - playerCenterX, 2) + Math.pow(tentCenterY - playerCenterY, 2));
            
            if (distance < minInteractionDistance) {
                minInteractionDistance = distance;
                closestTentForInteraction = tent;
            }
            if (distance < minSoundDistance) {
                minSoundDistance = distance;
            }
        });
        setInteractionTarget(closestTentForInteraction);

        const MAX_HEARING_DISTANCE = 350;
        const MAX_VOLUME = 0.4;
        let volume = 0;
        if (minSoundDistance < MAX_HEARING_DISTANCE) {
            const volumeRatio = 1 - (minSoundDistance / MAX_HEARING_DISTANCE);
            volume = MAX_VOLUME * Math.pow(volumeRatio, 2);
        }
        setCampfireVolume(volume);

        gameLoopRef.current = requestAnimationFrame(gameLoop);
    }, [player.x, player.y, tents]);

    useEffect(() => {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
        return () => {
            if (gameLoopRef.current) {
                cancelAnimationFrame(gameLoopRef.current);
            }
        };
    }, [gameLoop]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 font-mono">
            <AmbientSounds play={audioStarted} isMuted={isMuted} campfireVolume={campfireVolume} />
            <h1 className="text-3xl font-bold mb-4 text-yellow-300">Campfire Connect</h1>
            <div 
                className="relative bg-cover bg-center border-4 border-gray-700 shadow-lg"
                style={{
                    width: MAP_WIDTH,
                    height: MAP_HEIGHT,
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23386641\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                    backgroundColor: '#6a994e',
                }}
            >
                <div className="absolute top-2 right-2 z-10">
                    <button 
                        onClick={() => setIsMuted(m => !m)} 
                        className="p-2 bg-gray-800/50 rounded-full hover:bg-gray-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
                    >
                        {isMuted ? (
                             <svg className="w-6 h-6 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
                        ) : (
                           <svg className="w-6 h-6 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                        )}
                    </button>
                </div>
                {/* Tents */}
                {tents.map(tent => (
                    <div key={tent.id} style={{ position: 'absolute', left: tent.position.x, top: tent.position.y, width: TENT_SIZE, height: TENT_SIZE }}>
                        <TentIcon />
                    </div>
                ))}

                {/* NPCs */}
                {npcs.map(npc => <NpcComponent key={npc.id} npc={npc} />)}

                {/* Player */}
                <div style={{ position: 'absolute', left: player.x, top: player.y, width: PLAYER_SIZE, height: PLAYER_SIZE }}>
                    <PlayerIcon />
                </div>
                 {interactionTarget && !modalOpen && (
                    <div 
                        className="absolute bg-black/70 text-white px-4 py-2 rounded-lg text-center"
                        style={{
                            left: `${player.x + PLAYER_SIZE / 2 - 75}px`,
                            top: `${player.y - 40}px`,
                            width: '150px'
                        }}
                    >
                        Press [E] to enter <br /> {interactionTarget.name}
                    </div>
                )}
            </div>
            {modalOpen && activeTent && (
                <TentModal tent={activeTent} onClose={() => setModalOpen(false)} />
            )}
            <div className="mt-4 text-gray-400">Use W-A-S-D or Arrow Keys to move.</div>
        </div>
    );
};

export default App;