import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import PasswordField from '../components/PasswordField';
import StatusNote from '../components/StatusNote';
import AuthLayout from './AuthLayout';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [pending, setPending] = useState(false);
    const { signUp } = useAuth();

    const handleSignUp = async (e) => {
        e.preventDefault();
        const next = {};
        if (!name.trim()) next.name = 'Enter your name.';
        else if (name.trim().length > 80) next.name = 'Use 80 characters or fewer.';
        if (!email.trim()) next.email = 'Enter your email address.';
        else if (!EMAIL_RE.test(email.trim())) next.email = 'Enter a valid email address, like name@example.com.';
        if (!password) next.password = 'Create a password.';
        else if (password.length < MIN_PASSWORD) next.password = `Use at least ${MIN_PASSWORD} characters.`;
        if (!confirm) next.confirm = 'Re-enter your password.';
        else if (confirm !== password) next.confirm = 'Passwords do not match.';
        setErrors(next);
        if (Object.keys(next).length > 0) return;

        setServerError('');
        setPending(true);
        try {
            await signUp(name.trim(), email.trim(), password);
            // PublicOnly sends the signed-in user on to the page they asked for (or /home).
        } catch (err) {
            setServerError(err.message);
            setPending(false);
        }
    };

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Save your plans and pick up where you left off."
            footer={<>Already have an account? <Link to="/signin">Log in</Link></>}
        >
            <form className="form-stack" onSubmit={handleSignUp} noValidate>
                <div className="field">
                    <label htmlFor="signup-name" className="field__label"><User size={16} aria-hidden="true" /> Full name</label>
                    <input
                        id="signup-name"
                        type="text"
                        className="input"
                        placeholder="Your name"
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        aria-invalid={errors.name ? true : undefined}
                        aria-describedby={errors.name ? 'signup-name-error' : undefined}
                    />
                    {errors.name && <p id="signup-name-error" className="field__error">{errors.name}</p>}
                </div>

                <div className="field">
                    <label htmlFor="signup-email" className="field__label"><Mail size={16} aria-hidden="true" /> Email address</label>
                    <input
                        id="signup-email"
                        type="email"
                        className="input"
                        placeholder="name@example.com"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        aria-invalid={errors.email ? true : undefined}
                        aria-describedby={errors.email ? 'signup-email-error' : undefined}
                    />
                    {errors.email && <p id="signup-email-error" className="field__error">{errors.email}</p>}
                </div>

                <PasswordField
                    id="signup-password"
                    label="Password"
                    value={password}
                    onChange={setPassword}
                    placeholder="Create a password"
                    hint={`At least ${MIN_PASSWORD} characters.`}
                    autoComplete="new-password"
                    error={errors.password}
                    required
                />

                <PasswordField
                    id="signup-confirm"
                    label="Confirm password"
                    value={confirm}
                    onChange={setConfirm}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    error={errors.confirm}
                    required
                />

                {serverError && <StatusNote tone="danger">{serverError}</StatusNote>}

                <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={pending}>
                    {pending ? 'Creating account…' : 'Create account'} <ArrowRight size={18} className="btn__arrow" aria-hidden="true" />
                </button>
            </form>
        </AuthLayout>
    );
}

export default SignUp;
