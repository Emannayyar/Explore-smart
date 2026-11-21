import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, SendHorizontal, Compass } from 'lucide-react';
import { useDialogFocus } from '../hooks/useDialogFocus';
import { trips } from '../data/trips';
import './AIChatbot.css';

// The guide answers from a small set of prepared replies using keyword matching.
// It is a local, automated guide: nothing is sent to a server.

const priceOf = (trip) => parseInt(String(trip.price).replace(/[^\d]/g, ''), 10) || 0;
const byPrice = [...trips].sort((a, b) => priceOf(a) - priceOf(b));
const cheapest = byPrice[0];
const priciest = byPrice[byPrice.length - 1];

const ANSWERS = [
    {
        question: 'Best time to visit Hunza?',
        keywords: ['hunza', 'best time', 'when to', 'season', 'blossom', 'autumn', 'month'],
        answer: 'Late April to October is the usual travel window for Hunza. May and June bring cherry and apricot blossom; October has autumn colour and clearer mountain views.',
    },
    {
        question: 'Budget-friendly packages',
        keywords: ['budget', 'cheap', 'price', 'cost', 'afford', 'package', 'pkr', 'money', 'deal'],
        answer: `Packages on Explore Trips range from PKR ${cheapest.price} (${cheapest.title}, ${cheapest.duration}) to PKR ${priciest.price} (${priciest.title}, ${priciest.duration}). Open Explore Trips to compare them side by side.`,
    },
    {
        question: 'Eco-friendly destinations',
        keywords: ['eco', 'sustainab', 'green', 'environment', 'carbon', 'co2', 'footprint', 'impact'],
        answer: 'Quieter places such as Kumrat Valley and Deosai National Park see fewer crowds and reward low-impact travel. Use the Eco Insights calculator to score your own trip, and look for the eco badge on Explore Trips.',
    },
    {
        question: 'Weather in Northern Areas',
        keywords: ['weather', 'temperature', 'cold', 'rain', 'snow', 'forecast', 'climate', 'pack', 'wear'],
        answer: 'In summer, Skardu and Gilgit are usually around 20-25°C by day and can drop to 5-10°C at night, so pack layers. Open the Weather page for current conditions at each destination.',
    },
];

const FALLBACK = 'I can only answer a few prepared topics so far: the best time to visit Hunza, budget packages, eco-friendly destinations and Northern Areas weather. Try one of the suggestions below, or use Plan Trip to build your own plan.';

const GREETING = 'Hi! I am the ExploreSmart trip guide. Ask about destinations, budgets, weather or eco-friendly travel in northern Pakistan.';

function matchAnswer(text) {
    const query = text.toLowerCase();
    let best = null;
    let bestHits = 0;
    for (const entry of ANSWERS) {
        const hits = entry.keywords.filter((k) => query.includes(k)).length;
        if (hits > bestHits) {
            best = entry;
            bestHits = hits;
        }
    }
    return best ? best.answer : FALLBACK;
}

let nextId = 1;
const timeNow = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const message = (from, text) => ({ id: nextId++, from, text, time: timeNow() });

function AIChatbot({ open, onOpenChange }) {
    const [messages, setMessages] = useState([{ id: 0, from: 'guide', text: GREETING, time: null }]);
    const [draft, setDraft] = useState('');
    const inputRef = useRef(null);
    const listRef = useRef(null);
    useDialogFocus(open, inputRef, () => onOpenChange(false));

    useEffect(() => {
        const list = listRef.current;
        if (list) list.scrollTop = list.scrollHeight;
    }, [messages, open]);

    const ask = (text) => {
        const question = text.trim();
        if (!question) return;
        const exchange = [message('user', question), message('guide', matchAnswer(question))];
        setMessages((prev) => [...prev, ...exchange]);
        setDraft('');
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        ask(draft);
    };

    return (
        <div className="chatbot">
            {open && (
                <section className="chatbot-panel" role="dialog" aria-modal="false" aria-labelledby="chatbot-title">
                    <header className="chatbot-head">
                        <span className="icon-chip" aria-hidden="true"><Compass size={18} /></span>
                        <div className="chatbot-head-text">
                            <h2 id="chatbot-title" className="chatbot-title">ExploreSmart guide</h2>
                            <p className="chatbot-subtitle">Trip guide · automated answers</p>
                        </div>
                        <button type="button" className="btn btn--ghost btn--icon btn--sm" onClick={() => onOpenChange(false)} aria-label="Close trip guide">
                            <X size={18} aria-hidden="true" />
                        </button>
                    </header>

                    <ol ref={listRef} className="chatbot-messages" role="log" aria-live="polite" aria-label="Conversation">
                        {messages.map((m) => (
                            <li key={m.id} className={m.from === 'user' ? 'chatbot-msg chatbot-msg--user' : 'chatbot-msg chatbot-msg--guide'}>
                                <span className="visually-hidden">{m.from === 'user' ? 'You said:' : 'Guide:'}</span>
                                <p>{m.text}</p>
                                {m.time && <span className="chatbot-time">{m.time}</span>}
                            </li>
                        ))}
                    </ol>

                    <div className="chatbot-suggestions">
                        <p id="chatbot-suggestions-label" className="chatbot-suggestions-label">Suggested questions</p>
                        <div className="chatbot-pills" role="group" aria-labelledby="chatbot-suggestions-label">
                            {ANSWERS.map(({ question }) => (
                                <button key={question} type="button" className="chatbot-pill" onClick={() => ask(question)}>
                                    {question}
                                </button>
                            ))}
                        </div>
                    </div>

                    <form className="chatbot-form" onSubmit={handleSubmit}>
                        <label htmlFor="chatbot-input" className="visually-hidden">Ask the trip guide</label>
                        <input
                            ref={inputRef}
                            id="chatbot-input"
                            type="text"
                            className="input chatbot-input"
                            placeholder="Ask about destinations, budget, weather..."
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            autoComplete="off"
                        />
                        <button type="submit" className="btn btn--primary btn--icon" aria-label="Send message" disabled={!draft.trim()}>
                            <SendHorizontal size={18} aria-hidden="true" />
                        </button>
                    </form>
                </section>
            )}

            <button
                type="button"
                className="chatbot-launcher"
                onClick={() => onOpenChange(!open)}
                aria-expanded={open}
                aria-label={open ? 'Close trip guide' : 'Open trip guide'}
            >
                {open ? <X size={24} aria-hidden="true" /> : <MessageCircle size={24} aria-hidden="true" />}
            </button>
        </div>
    );
}

export default AIChatbot;
