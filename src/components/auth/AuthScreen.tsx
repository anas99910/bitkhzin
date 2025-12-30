import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { Toast, ToastType } from '../ui/Toast';
import { Loader2, LogIn, UserPlus, Eye, EyeOff, Mail } from 'lucide-react';

export const AuthScreen = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isResetting, setIsResetting] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Toast State
    const [toast, setToast] = useState<{ msg: string, type: ToastType, show: boolean }>({ msg: '', type: 'info', show: false });

    const showToast = (msg: string, type: ToastType) => {
        setToast({ msg, type, show: true });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
        } catch (err: any) {
            console.error(err);
            let msg = 'Authentication failed';
            if (err.code === 'auth/invalid-credential') msg = 'Invalid email or password.';
            if (err.code === 'auth/email-already-in-use') msg = 'Email already in use.';
            if (err.code === 'auth/weak-password') msg = 'Password should be at least 6 characters.';
            if (err.code === 'auth/operation-not-allowed') msg = 'Enable Email/Password in Firebase Console!';
            showToast(msg, 'error');
            setLoading(false); // Only stop loading on error, on success AuthContext will redirect
        }
    };

    const handleGuestLogin = async () => {
        setLoading(true);
        try {
            await signInAnonymously(auth);
        } catch (err: any) {
            console.error(err);
            showToast("Failed to sign in anonymously.", 'error');
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            showToast('Please enter your email address.', 'info');
            return;
        }
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            showToast('Password reset email sent! Check your inbox.', 'success');
            setIsResetting(false);
        } catch (err: any) {
            console.error(err);
            let msg = 'Failed to send reset email.';
            if (err.code === 'auth/user-not-found') msg = 'No account found with this email.';
            if (err.code === 'auth/invalid-email') msg = 'Invalid email address.';
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            background: 'radial-gradient(circle at 50% 10%, rgba(37, 99, 235, 0.1) 0%, transparent 50%)'
        }}>
            <div className="animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', background: 'linear-gradient(135deg, hsl(var(--color-primary)) 0%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Bitlkhzin
                    </h1>
                    <p className="text-muted">Your smart inventory companion.</p>
                </div>

                <Card>
                    <form onSubmit={isResetting ? handleResetPassword : handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <h2 className="text-title" style={{ fontSize: '1.5rem', textAlign: 'center' }}>
                            {isResetting ? 'Reset Password' : (isLogin ? 'Welcome Back' : 'Create Account')}
                        </h2>

                        <div className="form-row" style={{ display: 'flex', flexDirection: 'column' }}>
                            <label style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '8px' }}>Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="glass-panel"
                                style={{ padding: '12px', background: 'rgba(255,255,255,0.5)', width: '100%' }}
                                placeholder="you@example.com"
                            />
                        </div>

                        {!isResetting && (
                            <div className="form-row" style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Password</label>
                                    {isLogin && (
                                        <button
                                            type="button"
                                            onClick={() => setIsResetting(true)}
                                            style={{ background: 'none', border: 'none', color: 'hsl(var(--color-primary))', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 500 }}
                                        >
                                            Forgot Password?
                                        </button>
                                    )}
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        minLength={6}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="glass-panel"
                                        style={{ padding: '12px', paddingRight: '40px', background: 'rgba(255,255,255,0.5)', width: '100%' }}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: 'var(--color-text-light)',
                                            opacity: 0.6,
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        )}

                        <Button type="submit" style={{ marginTop: '8px', display: 'flex', justifyContent: 'center', gap: '8px' }} disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : (isResetting ? <Mail size={18} /> : (isLogin ? <LogIn size={18} /> : <UserPlus size={18} />))}
                            {isResetting ? 'Send Reset Link' : (isLogin ? 'Sign In' : 'Create Account')}
                        </Button>

                        <div style={{ textAlign: 'center', marginTop: '16px' }}>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                                {isResetting ? (
                                    <button
                                        type="button"
                                        onClick={() => setIsResetting(false)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'hsl(var(--color-primary))',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Back to Login
                                    </button>
                                ) : (
                                    <>
                                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                                        <button
                                            type="button"
                                            onClick={() => { setIsLogin(!isLogin); setEmail(''); setPassword(''); }}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: 'hsl(var(--color-primary))',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                textDecoration: 'underline'
                                            }}
                                        >
                                            {isLogin ? 'Sign Up' : 'Log In'}
                                        </button>
                                    </>
                                )}
                            </p>
                        </div>

                        {!isResetting && (
                            <>
                                <div style={{ position: 'relative', margin: '20px 0', textAlign: 'center' }}>
                                    <hr style={{ borderColor: 'var(--glass-border)', opacity: 0.5 }} />
                                    <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--color-surface-light)', padding: '0 10px', fontSize: '0.8rem', color: 'var(--color-text-light)', opacity: 0.6 }}>OR</span>
                                </div>

                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={handleGuestLogin}
                                    disabled={loading}
                                    style={{ width: '100%' }}
                                >
                                    Continue as Guest
                                </Button>
                            </>
                        )}
                    </form>
                </Card>
            </div>

            <Toast
                message={toast.msg}
                type={toast.type}
                isVisible={toast.show}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </div>
    );
};
