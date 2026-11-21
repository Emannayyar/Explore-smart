import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import PasswordField from '../components/PasswordField';
import StatusNote from '../components/StatusNote';
import AuthLayout from './AuthLayout';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [pending, setPending] = useState(false);
    const { signIn } = useAuth();

    const handleSignIn = async (e) => {
        e.preventDefault();
        const next = {};
        if (!email.trim()) next.email = 'Enter your email address.';
        else if (!EMAIL_RE.test(email.trim())) next.email = 'Enter a valid email address, like name@example.com.';
        if (!password) next.password = 'Enter your password.';
        setErrors(next);
        if (Object.keys(next).length > 0) return;

        setServerError('');
        setPending(true);
        try {
            await signIn(email.trim(), password);
            // PublicOnly sends the signed-in user on to the page they asked for (or /home).
        } catch (err) {
            setServerError(err.message);
            setPending(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Log in to continue planning your trip."
            footer={<>Don&rsquo;t have an account? <Link to="/signup">Sign up</Link></>}
        >
            <form className="form-stack" onSubmit={handleSignIn} noValidate>
                <div className="field">
                    <label htmlFor="signin-email" className="field__label"><Mail size={16} aria-hidden="true" /> Email address</label>
                    <input
                        id="signin-email"
                        type="email"
                        className="input"
                        placeholder="name@example.com"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        aria-invalid={errors.email ? true : undefined}
                        aria-describedby={errors.email ? 'signin-email-error' : undefined}
                    />
                    {errors.email && <p id="signin-email-error" className="field__error">{errors.email}</p>}
                </div>

                <PasswordField
                    id="signin-password"
                    label="Password"
                    value={password}
                    onChange={setPassword}
                    placeholder="Enter your password"
                    error={errors.password}
                    required
                />

                {serverError && <StatusNote tone="danger">{serverError}</StatusNote>}

                <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={pending}>
                    {pending ? 'Logging in…' : 'Log in'} <ArrowRight size={18} className="btn__arrow" aria-hidden="true" />
                </button>
            </form>
        </AuthLayout>
    );
}

export default SignIn;
