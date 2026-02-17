'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    MessageSquare,
    ArrowLeft,
    Send,
    Search,
    Phone,
    Video,
    MoreVertical,
    Paperclip,
    Image,
    Smile,
    Check,
    CheckCheck
} from 'lucide-react';

const conversations = [
    {
        id: 1,
        name: 'Dr. James Wilson',
        avatar: 'JW',
        lastMessage: 'I reviewed the X-ray results...',
        time: '2m ago',
        unread: 2,
        online: true
    },
    {
        id: 2,
        name: 'Dr. Emily Chen',
        avatar: 'EC',
        lastMessage: 'The patient is responding well to treatment',
        time: '1h ago',
        unread: 0,
        online: true
    },
    {
        id: 3,
        name: 'Dr. Michael Brown',
        avatar: 'MB',
        lastMessage: 'Can you review Case #1234?',
        time: '3h ago',
        unread: 1,
        online: false
    },
    {
        id: 4,
        name: 'Case Discussion Group',
        avatar: 'CD',
        lastMessage: 'Dr. Park: Interesting findings...',
        time: 'Yesterday',
        unread: 0,
        online: false,
        isGroup: true
    },
];

const chatMessages = [
    { id: 1, sender: 'them', text: 'Hi Dr. Rohan, I wanted to discuss the skin lesion case from this morning.', time: '10:30 AM' },
    { id: 2, sender: 'me', text: 'Of course! I ran it through our AI detection model. The results were quite interesting.', time: '10:32 AM', read: true },
    { id: 3, sender: 'them', text: 'What did the model predict?', time: '10:33 AM' },
    { id: 4, sender: 'me', text: 'It detected potential melanoma with 94% confidence. I recommend we schedule a biopsy.', time: '10:35 AM', read: true },
    { id: 5, sender: 'them', text: 'I reviewed the X-ray results as well. The patient shows no signs of metastasis which is encouraging.', time: '10:40 AM' },
    { id: 6, sender: 'me', text: 'That\'s great news. Let\'s discuss the treatment plan in our meeting tomorrow.', time: '10:42 AM', read: false },
];

export default function MessagesPage() {
    const [selectedChat, setSelectedChat] = useState(conversations[0]);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState(chatMessages);
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = () => {
        if (!message.trim()) return;

        const newMessage = {
            id: messages.length + 1,
            sender: 'me',
            text: message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: false
        };

        setMessages([...messages, newMessage]);
        setMessage('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const filteredConversations = conversations.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
            <div className="max-w-7xl mx-auto p-4 lg:p-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/dashboard" className="btn btn-icon btn-secondary">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex-1">
                        <h1 className="heading-serif text-2xl lg:text-3xl" style={{ color: 'var(--charcoal)' }}>
                            Messages
                        </h1>
                        <p className="text-sm" style={{ color: 'var(--silver)' }}>
                            Communicate with your team
                        </p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-4 h-[calc(100vh-180px)]">
                    {/* Conversations List */}
                    <div className="card card-bordered overflow-hidden flex flex-col">
                        {/* Search */}
                        <div className="p-4 border-b" style={{ borderColor: 'var(--mist)' }}>
                            <div
                                className="flex items-center gap-2 px-3 py-2 rounded-lg"
                                style={{ background: 'var(--cloud)' }}
                            >
                                <Search className="w-4 h-4" style={{ color: 'var(--silver)' }} />
                                <input
                                    type="text"
                                    placeholder="Search conversations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 bg-transparent text-sm outline-none"
                                    style={{ color: 'var(--charcoal)' }}
                                />
                            </div>
                        </div>

                        {/* Conversation List */}
                        <div className="flex-1 overflow-y-auto">
                            {filteredConversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    onClick={() => setSelectedChat(conv)}
                                    className="p-4 cursor-pointer transition-colors border-b"
                                    style={{
                                        background: selectedChat.id === conv.id ? 'var(--sage-light)' : 'transparent',
                                        borderColor: 'var(--mist)'
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div
                                                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium"
                                                style={{ background: conv.isGroup ? 'var(--sky)' : 'var(--sage)' }}
                                            >
                                                {conv.avatar}
                                            </div>
                                            {conv.online && (
                                                <div
                                                    className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
                                                    style={{ background: 'var(--sage)' }}
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium truncate" style={{ color: 'var(--charcoal)' }}>
                                                    {conv.name}
                                                </span>
                                                <span className="text-xs" style={{ color: 'var(--silver)' }}>
                                                    {conv.time}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between mt-1">
                                                <span className="text-sm truncate" style={{ color: 'var(--slate)' }}>
                                                    {conv.lastMessage}
                                                </span>
                                                {conv.unread > 0 && (
                                                    <span
                                                        className="ml-2 w-5 h-5 rounded-full text-xs flex items-center justify-center text-white"
                                                        style={{ background: 'var(--coral)' }}
                                                    >
                                                        {conv.unread}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Window */}
                    <div className="lg:col-span-2 card card-bordered overflow-hidden flex flex-col">
                        {/* Chat Header */}
                        <div
                            className="p-4 flex items-center justify-between border-b"
                            style={{ borderColor: 'var(--mist)' }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                                        style={{ background: 'var(--sage)' }}
                                    >
                                        {selectedChat.avatar}
                                    </div>
                                    {selectedChat.online && (
                                        <div
                                            className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white"
                                            style={{ background: 'var(--sage)' }}
                                        />
                                    )}
                                </div>
                                <div>
                                    <div className="font-medium" style={{ color: 'var(--charcoal)' }}>
                                        {selectedChat.name}
                                    </div>
                                    <div className="text-xs" style={{ color: selectedChat.online ? 'var(--sage)' : 'var(--silver)' }}>
                                        {selectedChat.online ? 'Online' : 'Offline'}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="btn btn-icon btn-secondary" style={{ width: '36px', height: '36px' }}>
                                    <Phone className="w-4 h-4" />
                                </button>
                                <Link href="/consultations" className="btn btn-icon btn-secondary" style={{ width: '36px', height: '36px' }}>
                                    <Video className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ background: 'var(--cloud)' }}>
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className="max-w-[70%] p-3 rounded-2xl"
                                        style={{
                                            background: msg.sender === 'me' ? 'var(--sage)' : 'var(--white)',
                                            color: msg.sender === 'me' ? 'white' : 'var(--charcoal)',
                                            borderBottomRightRadius: msg.sender === 'me' ? '4px' : '16px',
                                            borderBottomLeftRadius: msg.sender === 'me' ? '16px' : '4px'
                                        }}
                                    >
                                        <p className="text-sm">{msg.text}</p>
                                        <div className="flex items-center justify-end gap-1 mt-1">
                                            <span
                                                className="text-xs"
                                                style={{ opacity: 0.7 }}
                                            >
                                                {msg.time}
                                            </span>
                                            {msg.sender === 'me' && (
                                                msg.read ?
                                                    <CheckCheck className="w-3 h-3" style={{ opacity: 0.7 }} /> :
                                                    <Check className="w-3 h-3" style={{ opacity: 0.7 }} />
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="p-4 border-t" style={{ borderColor: 'var(--mist)' }}>
                            <div className="flex items-center gap-2">
                                <button className="btn btn-icon btn-secondary" style={{ width: '40px', height: '40px' }}>
                                    <Paperclip className="w-4 h-4" />
                                </button>
                                <div
                                    className="flex-1 flex items-center gap-2 px-4 py-2 rounded-full"
                                    style={{ background: 'var(--cloud)' }}
                                >
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-transparent outline-none text-sm"
                                        style={{ color: 'var(--charcoal)' }}
                                    />
                                    <button>
                                        <Smile className="w-5 h-5" style={{ color: 'var(--silver)' }} />
                                    </button>
                                </div>
                                <button
                                    onClick={sendMessage}
                                    className="btn btn-primary"
                                    style={{ width: '40px', height: '40px', padding: 0 }}
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

