import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { api } from '../api/client';
import { useOutletContext } from 'react-router-dom';
import { Mail, Send, MessageCircle, HelpCircle, ChevronDown } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatusNote from '../components/StatusNote';
import './ContactSupport.css';

const SUPPORT_EMAIL = 'support@exploresmart.com';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FAQS = [
    {
        question: 'How do I plan a trip?',
        answer: 'Open Plan Trip, choose a destination and fill in your budget, travellers, duration, accommodation and transport. ExploreSmart builds a plan summary with an eco score and lists matching packages.',
    },
    {
        question: 'What makes a trip eco-friendly?',
        answer: 'Shared transport, camping or shared rooms, larger groups and low-impact activities all raise the eco score. The Eco Insights page breaks down each factor for your trip.',
    },
    {
        question: 'How do I save trips to my dashboard?',
        answer: 'After generating a plan on Plan Trip, choose Save to dashboard. On Explore Trips, tap the heart on a package. Saved trips appear on your dashboard with their eco scores.',
    },
    {
        question: 'Can I change my travel preferences later?',
        answer: 'Yes. Account Settings holds your profile and travel preferences, and Appearance lets you switch between light, dark and automatic themes.',
    },
    {
        question: 'How accurate is the weather information?',
        answer: 'The Weather page shows current conditions for each destination from Open-Meteo, plus general seasonal guidance. Mountain weather changes quickly, so check a local forecast again before you travel.',
    },
];

const EMPTY_FORM = { name: '', email: '', subject: '', message: '' };

function ContactSupport() {
    const { openChat } = useOutletContext() ?? {};
    const [openFaqIndex, setOpenFaqIndex] = useState(0);
    const { user } = useAuth();
    const [form, setForm] = useState({ ...EMPTY_FORM, name: user.name, email: user.email });
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState({ tone: 'info', message: '' });
    const [sending, setSending] = useState(false);

    const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const next = {};
        if (!form.name.trim()) next.name = 'Enter your name.';
        if (!EMAIL_RE.test(form.email.trim())) next.email = 'Enter a valid email address.';
        if (!form.subject.trim()) next.subject = 'Add a short subject.';
        else if (form.subject.trim().length > 150) next.subject = 'Use 150 characters or fewer.';
        if (!form.message.trim()) next.message = 'Tell us how we can help.';
        else if (form.message.trim().length > 2000) next.message = 'Use 2000 characters or fewer.';
        setErrors(next);
        setStatus({ tone: 'info', message: '' });
        if (Object.keys(next).length > 0) return;

        setSending(true);
        try {
            await api.post('/contact', {
                name: form.name.trim(),
                email: form.email.trim(),
                subject: form.subject.trim(),
                message: form.message.trim(),
            });
            setForm((f) => ({ ...f, subject: '', message: '' }));
            setStatus({ tone: 'success', message: 'Thanks, your message was sent. We will reply by email.' });
        } catch (err) {
            setStatus({ tone: 'danger', message: `Your message was not sent. ${err.message}` });
        } finally {
            setSending(false);
        }
    };

    const fieldProps = (field) => ({
        id: `support-${field}`,
        value: form[field],
        onChange: update(field),
        'aria-invalid': errors[field] ? true : undefined,
        'aria-describedby': errors[field] ? `support-${field}-error` : undefined,
    });

    return (
        <div className="container page">
            <PageHeader
                backTo="/home"
                title="Contact Support"
                subtitle="Questions about planning, packages or your account? We are here to help."
            />

            <div className="support-layout">
                <section className="card" aria-labelledby="support-form-title">
                    <div className="card__header">
                        <h2 id="support-form-title" className="card__title">Send us a message</h2>
                    </div>
                    <form className="form-stack" onSubmit={handleSubmit} noValidate>
                        <div className="form-grid">
                            <div className="field">
                                <label htmlFor="support-name" className="field__label">Your name</label>
                                <input type="text" className="input" placeholder="Your full name" autoComplete="name" required {...fieldProps('name')} />
                                {errors.name && <p id="support-name-error" className="field__error">{errors.name}</p>}
                            </div>
                            <div className="field">
                                <label htmlFor="support-email" className="field__label">Email address</label>
                                <input type="email" className="input" placeholder="name@example.com" autoComplete="email" required {...fieldProps('email')} />
                                {errors.email && <p id="support-email-error" className="field__error">{errors.email}</p>}
                            </div>
                        </div>
                        <div className="field">
                            <label htmlFor="support-subject" className="field__label">Subject</label>
                            <input type="text" className="input" placeholder="How can we help you?" required {...fieldProps('subject')} />
                            {errors.subject && <p id="support-subject-error" className="field__error">{errors.subject}</p>}
                        </div>
                        <div className="field">
                            <label htmlFor="support-message" className="field__label">Message</label>
                            <textarea className="textarea" placeholder="Tell us more about your question..." rows={6} required {...fieldProps('message')} />
                            {errors.message && <p id="support-message-error" className="field__error">{errors.message}</p>}
                        </div>
                        <button type="submit" className="btn btn--primary support-submit" disabled={sending}>
                            <Send size={18} aria-hidden="true" /> {sending ? 'Sending…' : 'Send message'}
                        </button>
                        {status.message && <StatusNote tone={status.tone}>{status.message}</StatusNote>}
                    </form>
                </section>

                <aside className="support-side" aria-label="Other ways to get help">
                    <section className="card" aria-labelledby="support-reach-title">
                        <h2 id="support-reach-title" className="card__title support-side-title">Other ways to reach us</h2>
                        <a className="support-method" href={`mailto:${SUPPORT_EMAIL}`}>
                            <span className="icon-chip icon-chip--info" aria-hidden="true"><Mail size={18} /></span>
                            <span className="support-method-text">
                                <span className="support-method-label">Email</span>
                                <span className="support-method-value">{SUPPORT_EMAIL}</span>
                            </span>
                        </a>
                    </section>

                    <section className="card card--sunken support-guide" aria-labelledby="support-guide-title">
                        <span className="icon-chip" aria-hidden="true"><MessageCircle size={18} /></span>
                        <h2 id="support-guide-title" className="card__title">Need quick help?</h2>
                        <p className="text-muted">The trip guide answers common questions about destinations, budgets, weather and eco travel with prepared, automated answers.</p>
                        {openChat && (
                            <button type="button" className="btn btn--secondary" onClick={openChat}>Open the trip guide</button>
                        )}
                    </section>
                </aside>
            </div>

            <section className="card" aria-labelledby="support-faq-title">
                <div className="card__header">
                    <span className="icon-chip icon-chip--accent" aria-hidden="true"><HelpCircle size={18} /></span>
                    <h2 id="support-faq-title" className="card__title">Frequently asked questions</h2>
                </div>
                <ul className="support-faq-list" role="list">
                    {FAQS.map((faq, index) => {
                        const isOpen = openFaqIndex === index;
                        return (
                            <li key={faq.question} className="support-faq-item">
                                <h3 className="support-faq-heading">
                                    <button
                                        type="button"
                                        className="support-faq-toggle"
                                        aria-expanded={isOpen}
                                        aria-controls={`support-faq-${index}`}
                                        id={`support-faq-btn-${index}`}
                                        onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                                    >
                                        {faq.question}
                                        <ChevronDown size={20} className="support-faq-chevron" aria-hidden="true" />
                                    </button>
                                </h3>
                                <div
                                    id={`support-faq-${index}`}
                                    role="region"
                                    aria-labelledby={`support-faq-btn-${index}`}
                                    className="support-faq-answer"
                                    hidden={!isOpen}
                                >
                                    <p>{faq.answer}</p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </section>
        </div>
    );
}

export default ContactSupport;
