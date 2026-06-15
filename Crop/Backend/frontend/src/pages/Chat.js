import React, { useState, useEffect, useRef } from 'react';

// --- Theme Style Definitions (Pure JavaScript Objects) ---

const getStyles = (isDark) => {
    // Define the color palette based on the theme
    const colors = {
        primaryAccent: '#059669', // Vibrant Green
        secondaryAccent: '#38B2AC', // Light Teal/Green (for bolding/loading)
        headerBorder: '#047857',
        // Dark Mode Palette
        darkBg: '#121212',
        darkCardSurface: '#1F2937',
        darkChatArea: '#1A202C',
        darkUserBubble: '#064E3B',
        darkBotBubble: '#2D3748',
        darkText: '#E2E8F0',
        darkUserText: '#ffffff',
        darkInputBg: '#2D3748',
        darkInputBorder: '#4A5568',
        // Light Mode Palette
        lightBg: '#f5f7f9',
        lightCardSurface: '#ffffff',
        lightChatArea: '#ebfcf8',
        lightUserBubble: '#DCFCE7',
        lightBotBubble: '#FFFFFF',
        lightText: '#1F2937',
        lightUserText: '#1F2937',
        lightInputBorder: '#D1D5DB',
    };

    const palette = isDark ? colors.dark : colors.light;

    return {
        // Basic App container
        appContainer: {
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: isDark ? colors.darkBg : colors.lightBg,
            padding: '20px',
            boxSizing: 'border-box',
            transition: 'background-color 0.3s ease',
        },
        // Main chat card
        chatContainer: {
            width: '100%',
            maxWidth: '650px',
            height: '85vh',
            maxHeight: '800px',
            backgroundColor: isDark ? colors.darkCardSurface : colors.lightCardSurface,
            borderRadius: '16px',
            boxShadow: isDark ? '0 15px 50px rgba(0, 0, 0, 0.4)' : '0 10px 40px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'all 0.3s ease-in-out',
        },
        // Header
        header: {
            padding: '16px 20px',
            backgroundColor: colors.primaryAccent,
            color: '#ffffff',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            fontSize: '1.4rem',
            fontWeight: '700',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `3px solid ${colors.headerBorder}`
        },
        titleGroup: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
        },
        userId: {
            fontSize: '0.75rem',
            fontWeight: '400',
            opacity: 0.8,
            marginTop: '4px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            maxWidth: '100%',
        },
        // Theme Toggle Icon Button
        themeToggle: {
            background: 'none',
            border: 'none',
            color: '#ffffff',
            cursor: 'pointer',
            padding: '0',
            marginLeft: '15px',
            transition: 'opacity 0.2s',
        },
        // Scrollable chat window
        chatWindow: {
            flexGrow: '1',
            overflowY: 'auto',
            padding: '20px',
            backgroundColor: isDark ? colors.darkChatArea : colors.lightChatArea,
            transition: 'background-color 0.3s ease',
        },
        // Message bubble wrapper
        messageBox: (isUser) => ({
            display: 'flex',
            justifyContent: isUser ? 'flex-end' : 'flex-start',
            marginBottom: '14px',
        }),
        // Individual message content bubble
        messageContent: (isUser) => ({
            maxWidth: '80%',
            padding: '12px 18px',
            borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
            backgroundColor: isUser ? (isDark ? colors.darkUserBubble : colors.lightUserBubble) : (isDark ? colors.darkBotBubble : colors.lightBotBubble),
            color: isUser ? colors.darkUserText : (isDark ? colors.darkText : colors.lightText),
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
            lineHeight: '1.5',
            fontSize: '0.95rem',
            wordBreak: 'break-word',
            transition: 'all 0.3s ease, background-color 0.3s ease, color 0.3s ease',
        }),
        // Input area form
        inputForm: {
            padding: '15px',
            borderTop: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
            display: 'flex',
            gap: '10px',
            backgroundColor: isDark ? colors.darkCardSurface : colors.lightCardSurface,
            transition: 'background-color 0.3s ease',
        },
        // Text input field
        textInput: {
            flexGrow: '1',
            padding: '12px 18px',
            borderRadius: '30px',
            border: `2px solid ${isDark ? colors.darkInputBorder : colors.lightInputBorder}`,
            fontSize: '1rem',
            outline: 'none',
            boxSizing: 'border-box',
            backgroundColor: isDark ? colors.darkInputBg : colors.lightBotBubble,
            color: isDark ? colors.darkText : colors.lightText,
            transition: 'border-color 0.3s, background-color 0.3s, color 0.3s',
        },
        // Send button
        sendButton: {
            backgroundColor: colors.primaryAccent,
            color: '#ffffff',
            border: 'none',
            borderRadius: '30px',
            padding: '12px 20px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'background-color 0.2s, transform 0.1s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 1,
            pointerEvents: 'auto',
        },
        // Loading indicator text
        loadingIndicator: {
            textAlign: 'center',
            padding: '10px',
            color: colors.secondaryAccent,
            fontSize: '0.9rem',
            fontStyle: 'italic',
            marginTop: '10px',
        },
        // Styles for the bolding done by formatText
        boldText: {
            fontWeight: 'bold',
            color: colors.secondaryAccent,
        }
    };
};

// --- Icons (Inline SVGs) ---

// Sun/Light Mode Icon
const SunIcon = ({ size = 20, color = 'white' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
);

// Moon/Dark Mode Icon
const MoonIcon = ({ size = 20, color = 'white' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
);

// Send Icon
const SendIcon = ({ size = 20, color = 'white' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);


// --- Utility Functions ---

/**
 * Utility to convert raw text to displayable text, handling markdown-like bold.
 * @param {string} text
 * @param {object} styles
 * @returns {JSX.Element}
 */
const formatText = (text, styles) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return (
        <>
            {parts.map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <span key={index} style={styles.boldText}>{part.slice(2, -2)}</span>;
                }
                return part;
            })}
        </>
    );
};


// --- Main Application Component ---

const initialMessages = [{
    id: 1,
    text: "Welcome! I'm **Agri-Buddy**, your friendly farming assistant. Use the moon/sun icon above to toggle the theme! Ask me anything about your crops, soil, or pests to get started!",
    sender: 'bot',
    timestamp: new Date(),
}];

const App = () => {
    // State for chat history and input
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);

    // Theme state (starts in dark mode as requested by previous query)
    const [isDarkMode, setIsDarkMode] = useState(true);
    const styles = getStyles(isDarkMode); // Get current styles based on theme

    // Toggle theme function
    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    // Auto-scroll to the bottom of the chat window
    useEffect(() => {
        const timer = setTimeout(() => {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        return () => clearTimeout(timer);
    }, [messages, isLoading, isDarkMode]); // Re-scroll if theme changes

    // LLM API Call (with Exponential Backoff)
    const callGeminiApi = async (userQuery) => {
        // System prompt defining the expert persona
        const systemPrompt = "You are Agri-Buddy, a highly knowledgeable, friendly, and practical agricultural assistant focused on small-scale, sustainable farming. Provide concise and actionable advice, and always maintain an encouraging tone. Your answers should be based on best practices in agronomy. Use **bold text** to highlight key terms like crop names, diseases, or action items. Keep responses under 100 words.";
        const apiKey = "AIzaSyARopSk3jqS-jeD44ou0CVjWuSSP79os7c"; // Leave as-is
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            tools: [{ "google_search": {} }],
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            },
        };

        const maxRetries = 5;
        for (let i = 0; i < maxRetries; i++) {
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.status === 429 && i < maxRetries - 1) {
                    const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue; // Retry
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
                return text || "Sorry, Agri-Buddy is having trouble finding the answer right now. Please try rephrasing your question.";

            } catch (error) {
                console.error(`Attempt ${i + 1} failed:`, error);
                if (i === maxRetries - 1) {
                    return "I'm sorry, I couldn't connect to my knowledge base after multiple attempts. Can you try again in a moment?";
                }
                const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    };


    // Message Sending Logic
    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setIsLoading(true);

        const newUserMessage = {
            id: Date.now(),
            text: userMessage,
            sender: 'user',
            timestamp: new Date(),
        };

        // Update local state with user message immediately
        setMessages(prev => [...prev, newUserMessage]);

        try {
            // 1. Call the LLM API
            const botResponseText = await callGeminiApi(userMessage);

            // 2. Add bot message to local state
            const botMessage = {
                id: Date.now() + 1, // Ensure unique ID
                text: botResponseText,
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error("Error during message send/API call:", error);
            // Add a temporary error message to the chat display
            const errorText = "A critical error occurred while contacting Agri-Buddy's knowledge base.";
            const errorMessage = {
                id: Date.now() + 2,
                text: errorText,
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    // Render Function
    return (
        <div style={styles.appContainer}>
            <div style={styles.chatContainer}>
                <div style={styles.header}>
                    <div style={styles.titleGroup}>
                        Agri-Assistant ({isDarkMode ? 'Dark' : 'Light'})
                        <div style={styles.userId} title="Chat history will not be saved when refreshed">
                            *History is not saved when refreshed*
                        </div>
                    </div>
                    <button onClick={toggleTheme} style={styles.themeToggle} aria-label={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Theme`}>
                        {isDarkMode ? <SunIcon size={24} /> : <MoonIcon size={24} />}
                    </button>
                </div>

                <div style={styles.chatWindow}>
                    {messages.map((msg) => {
                        const isUser = msg.sender === 'user';
                        return (
                            <div key={msg.id} style={styles.messageBox(isUser)}>
                                <div style={styles.messageContent(isUser)}>
                                    {formatText(msg.text, styles)}
                                </div>
                            </div>
                        );
                    })}
                    {isLoading && (
                        <div style={styles.messageBox(false)}>
                            <div style={styles.messageContent(false)}>
                                <div style={{ color: styles.loadingIndicator.color, fontStyle: styles.loadingIndicator.fontStyle }}>
                                    Agri-Buddy is thinking...
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleSend} style={styles.inputForm}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask Agri-Buddy about your crops, soil, or pests..."
                        style={{
                            ...styles.textInput,
                            border: input.length > 0 ? `2px solid ${styles.boldText.color}` : styles.textInput.border
                        }}
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        style={{
                            ...styles.sendButton,
                            opacity: input.trim().length === 0 || isLoading ? 0.6 : 1,
                            pointerEvents: input.trim().length === 0 || isLoading ? 'none' : 'auto'
                        }}
                        disabled={!input.trim() || isLoading}
                    >
                        <SendIcon size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default App;
