
import React, { useState, useRef, useEffect } from 'react';
import type { Tent, ChatMessage } from '../types';
import VideoCallView from './VideoCallView';

interface TentModalProps {
    tent: Tent;
    onClose: () => void;
}

const ChatView: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 1, sender: 'Operator', text: 'Connection established. Welcome to the channel.', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        { id: 2, sender: 'Soldier', text: 'Copy that. Area is secure.', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);
    const [newMessage, setNewMessage] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;
        
        const userMessage: ChatMessage = {
            id: Date.now(),
            sender: 'You',
            text: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages(prev => [...prev, userMessage]);
        setNewMessage('');

        setTimeout(() => {
            // FIX: Explicitly type the replies array to prevent TypeScript from widening the 'sender' property to a generic 'string'.
            // This ensures the sender property is compatible with the 'ChatMessage' type.
            const replies: { sender: 'Civilian' | 'Soldier' | 'Operator'; text: string; }[] = [
                { sender: 'Civilian', text: 'Anyone heard any news from the west?' },
                { sender: 'Soldier', text: 'All quiet on my end. Stay vigilant.' },
                { sender: 'Operator', text: 'Keep comms clear for priority messages.' },
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            const replyMessage: ChatMessage = {
                id: Date.now() + 1,
                ...randomReply,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages(prev => [...prev, replyMessage]);
        }, 1500 + Math.random() * 1000);
    };

    const getSenderColor = (sender: string) => {
        switch(sender) {
            case 'You': return 'text-blue-300';
            case 'Operator': return 'text-yellow-300';
            case 'Soldier': return 'text-green-300';
            case 'Civilian': return 'text-gray-300';
            default: return 'text-white';
        }
    };

    return (
        <div className="p-4 flex flex-col h-full">
            <div className="flex-grow overflow-y-auto pr-2">
                {messages.map(msg => (
                    <div key={msg.id} className={`mb-3 ${msg.sender === 'You' ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block p-3 rounded-lg ${msg.sender === 'You' ? 'bg-blue-800/50' : 'bg-gray-700/50'}`}>
                            <div className="flex items-baseline gap-2">
                                <span className={`font-bold text-sm ${getSenderColor(msg.sender)}`}>{msg.sender}</span>
                                <span className="text-xs text-gray-400">{msg.timestamp}</span>
                            </div>
                            <p className="text-white mt-1">{msg.text}</p>
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="mt-4 flex">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-grow bg-gray-900 border border-gray-600 rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button type="submit" className="bg-yellow-600 text-black font-bold px-4 rounded-r-md hover:bg-yellow-500 transition-colors">
                    Send
                </button>
            </form>
        </div>
    );
};

const TentModal: React.FC<TentModalProps> = ({ tent, onClose }) => {
    const [activeTab, setActiveTab] = useState<'chat' | 'video'>('chat');

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="w-full max-w-3xl h-[80vh] bg-gray-800 shadow-2xl rounded-lg border border-gray-700 flex flex-col">
                <header className="p-4 flex justify-between items-center border-b border-gray-700">
                    <h2 className="text-xl font-bold text-yellow-300">{tent.name}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                <div className="p-4 border-b border-gray-700">
                    <div className="flex space-x-4">
                        <button 
                            onClick={() => setActiveTab('chat')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'chat' ? 'bg-yellow-600 text-black' : 'bg-gray-700 hover:bg-gray-600'}`}
                        >
                            Chat
                        </button>
                        <button
                            onClick={() => setActiveTab('video')}
                             className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'video' ? 'bg-yellow-600 text-black' : 'bg-gray-700 hover:bg-gray-600'}`}
                        >
                            Video Call
                        </button>
                    </div>
                </div>
                <main className="flex-grow overflow-hidden">
                    {activeTab === 'chat' ? <ChatView /> : <VideoCallView />}
                </main>
            </div>
        </div>
    );
};

export default TentModal;