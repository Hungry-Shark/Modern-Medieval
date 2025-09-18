import React, { useRef, useEffect } from 'react';

interface AmbientSoundsProps {
    play: boolean;
    isMuted: boolean;
    campfireVolume: number;
}

const SOUNDS = {
    wind: 'https://cdn.pixabay.com/audio/2022/08/04/audio_2dee6ff26a.mp3', // A gentle wind sound
    campfire: 'https://cdn.pixabay.com/download/audio/2022/02/08/audio_8213235081.mp3?filename=campfire-crackling-loop-11145.mp3',
    wildlife: 'https://cdn.pixabay.com/download/audio/2022/08/19/audio_d086383a2d.mp3?filename=night-ambience-115320.mp3',
};

const AmbientSounds: React.FC<AmbientSoundsProps> = ({ play, isMuted, campfireVolume }) => {
    const windRef = useRef<HTMLAudioElement>(null);
    const campfireRef = useRef<HTMLAudioElement>(null);
    const wildlifeRef = useRef<HTMLAudioElement>(null);

    const audioRefs = { wind: windRef, campfire: campfireRef, wildlife: wildlifeRef };

    useEffect(() => {
        if (play) {
            const initialVolumes: { [key in keyof typeof SOUNDS]: number } = { wind: 0.1, campfire: 0, wildlife: 0.08 };
            (Object.keys(initialVolumes) as Array<keyof typeof initialVolumes>).forEach(key => {
                const audio = audioRefs[key].current;
                if (audio) {
                    audio.volume = initialVolumes[key];
                    audio.play().catch(e => {
                        console.log(`Audio autoplay for ${key} was prevented:`, e.name);
                    });
                }
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [play]);

    useEffect(() => {
        Object.values(audioRefs).forEach(ref => {
            if (ref.current) {
                ref.current.muted = isMuted;
            }
        });
    }, [isMuted, audioRefs]);

    useEffect(() => {
        if (campfireRef.current) {
            campfireRef.current.volume = campfireVolume;
        }
    }, [campfireVolume]);

    return (
        <div aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
            <audio ref={windRef} src={SOUNDS.wind} loop />
            <audio ref={campfireRef} src={SOUNDS.campfire} loop />
            <audio ref={wildlifeRef} src={SOUNDS.wildlife} loop />
        </div>
    );
};

export default AmbientSounds;
