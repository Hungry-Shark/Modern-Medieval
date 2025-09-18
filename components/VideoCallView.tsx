
import React, { useState, useEffect, useRef } from 'react';

const VideoCallView: React.FC = () => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const getMedia = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                console.error("Error accessing media devices.", err);
                setError("Camera/Microphone access denied. Please allow access in your browser settings to use video call.");
            }
        };

        getMedia();

        return () => {
            stream?.getTracks().forEach(track => track.stop());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleCamera = () => {
        if (stream) {
            stream.getVideoTracks().forEach(track => track.enabled = !isCameraOn);
            setIsCameraOn(!isCameraOn);
        }
    };

    const toggleMic = () => {
        if (stream) {
            stream.getAudioTracks().forEach(track => track.enabled = !isMicOn);
            setIsMicOn(!isMicOn);
        }
    };
    
    const UserVideo = ({ name, isMuted, isCameraOff }: { name: string, isMuted?: boolean, isCameraOff?: boolean }) => (
        <div className="relative aspect-video bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
            {isCameraOff ? (
                 <div className="flex flex-col items-center">
                    <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.55a1 1 0 011.45.89v4.22a1 1 0 01-1.45.89L15 14M5 10a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1H6a1 1 0 01-1-1v-4z" /></svg>
                    <span className="mt-2 text-sm">Camera Off</span>
                </div>
            ) : (
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-2xl font-bold">{name.charAt(0)}</div>
            )}
             <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded-md text-sm flex items-center">
                {isMuted && <svg className="w-4 h-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm-1 4a1 1 0 011-1h4a1 1 0 110 2H7a1 1 0 01-1-1zm-3 2a1 1 0 000 2h10a1 1 0 100-2H3z" clipRule="evenodd" /></svg>}
                {name}
            </div>
        </div>
    );

    return (
        <div className="p-4 h-full flex flex-col">
            <div className="grid grid-cols-2 gap-4 flex-grow">
                {error ? (
                    <div className="col-span-2 bg-red-900/50 text-red-200 p-4 rounded-lg flex items-center justify-center text-center">
                        {error}
                    </div>
                ) : (
                    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                        <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
                         <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded-md text-sm">You</div>
                    </div>
                )}

                <UserVideo name="Soldier 1" isMuted={true} />
                <UserVideo name="Civilian 1" isCameraOff={true} />
                <UserVideo name="Operator" />
            </div>
            <div className="mt-4 flex justify-center items-center space-x-4">
                <button onClick={toggleMic} className={`p-3 rounded-full ${isMicOn ? 'bg-gray-600' : 'bg-red-600'}`}>
                    {isMicOn ? 
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm-1 4a1 1 0 011-1h4a1 1 0 110 2H7a1 1 0 01-1-1zm-3 2a1 1 0 000 2h10a1 1 0 100-2H3z" clipRule="evenodd" /></svg> :
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 3a1 1 0 00-1.447-.894L4.22 5.472A1 1 0 003 6.382V13.618a1 1 0 001.22.894l4.333-3.363A1 1 0 0010 10.273V3zm-1 0v7.273l-3.333 2.59V6.137L9 3zM13 7a1 1 0 012 0v6a1 1 0 11-2 0V7z" clipRule="evenodd" /></svg>
                    }
                </button>
                <button onClick={toggleCamera} className={`p-3 rounded-full ${isCameraOn ? 'bg-gray-600' : 'bg-red-600'}`}>
                    {isCameraOn ? 
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.55a1 1 0 011.45.89v4.22a1 1 0 01-1.45.89L15 14M5 10a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1H6a1 1 0 01-1-1v-4z" /></svg> :
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    }
                </button>
            </div>
        </div>
    );
};

export default VideoCallView;
