import React, { useState } from 'react';
import { MessageCircle, Sparkles, X } from 'lucide-react';
import './AIChatbot.css';

function AIChatbot() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        { type: 'ai', text: "Hi! I'm your AI travel assistant for Pakistan. I can help you with destinations, budget planning, weather info, and eco-friendly travel tips. How can I assist you today?", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);

    const handleQuickQuestion = (question) => {
        // Add user message
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setChatMessages(prev => [...prev, { type: 'user', text: question, time: now }]);

        // Simulate AI thinking and response
        setTimeout(() => {
            let reply = "That's a great question! I'm still learning, but I'll do my best to help.";
            if (question === "Best time to visit Hunza?") {
                reply = "The best time to visit Hunza is generally from late April to October. May and June are perfect for admiring the cherry blossoms, while October offers stunning autumn foliage and clearer skies for mountain viewing.";
            } else if (question === "Budget-friendly packages") {
                reply = "We offer several budget-friendly packages starting at around PKR 45,000 for a 5-day trip to Naran and Kaghan, which includes transport, standard accommodation, and guided tours. Would you like me to pull up the full itinerary?";
            } else if (question === "Eco-friendly destinations") {
                reply = "For eco-friendly travel, I highly recommend Kumrat Valley or Deosai National Park. These areas promote sustainable tourism, have fewer crowds, and offer immense natural beauty. You can find more details in the 'Eco Insights' section on your dashboard.";
            } else if (question === "Weather in Northern Areas") {
                reply = "Currently, the weather in the Northern Areas (like Skardu and Gilgit) is quite pleasant during the day (around 20-25°C) but can drop significantly at night to 5-10°C. Make sure to pack layers!";
            }

            setChatMessages(prev => [...prev, { type: 'ai', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        }, 1000);
    };

    return (
        <div className="ai-chatbot-container">
            {isChatOpen ? (
                <div className="chatbot-popup">
                    <div className="chat-header">
                        <div className="chat-header-icon">
                            <Sparkles size={18} color="white" />
                        </div>
                        <div className="chat-header-info">
                            <h3>AI Travel Assistant</h3>
                            <span>Online • Instant replies</span>
                        </div>
                        <button className="chat-close-btn" onClick={() => setIsChatOpen(false)}>
                            <X size={18} color="white" />
                        </button>
                    </div>

                    <div className="chat-messages">
                        {chatMessages.map((msg, idx) => (
                            <div key={idx} className={`chat-bubble ${msg.type}`}>
                                <p>{msg.text}</p>
                                <span className="chat-time">{msg.time}</span>
                            </div>
                        ))}
                    </div>

                    {chatMessages.length === 1 && (
                        <div className="chat-quick-questions">
                            <p className="quick-q-label">Quick questions:</p>
                            <div className="quick-q-pills">
                                <button className="quick-q-btn" onClick={() => handleQuickQuestion("Best time to visit Hunza?")}>Best time to visit Hunza?</button>
                                <button className="quick-q-btn" onClick={() => handleQuickQuestion("Budget-friendly packages")}>Budget-friendly packages</button>
                                <button className="quick-q-btn" onClick={() => handleQuickQuestion("Eco-friendly destinations")}>Eco-friendly destinations</button>
                                <button className="quick-q-btn" onClick={() => handleQuickQuestion("Weather in Northern Areas")}>Weather in Northern Areas</button>
                            </div>
                        </div>
                    )}

                    <div className="chat-input-area">
                        <input type="text" placeholder="Ask me anything..." className="chat-input-field" />
                        <button className="chat-send-btn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>

                    <div className="chat-footer">
                        Powered by ExploreSmart AI
                    </div>
                </div>
            ) : (
                <button
                    className="chat-widget-pink"
                    onClick={() => setIsChatOpen(true)}
                >
                    <MessageCircle size={24} color="white" />
                    <span className="notification-dot-red">AI</span>
                </button>
            )}
        </div>
    );
}

export default AIChatbot;
