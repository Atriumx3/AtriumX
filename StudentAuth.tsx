import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithEmail, registerWithEmail } from '../services/dataService';
import { useApp } from '../context/AppContext';

export default function StudentAuth() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [residence, setResidence] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { setCurrentUser, redirectAfterLogin, setRedirectAfterLogin } = useApp();
  const navigate = useNavigate();

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (mode === 'register' && !fullName.trim()) {
      errs.fullName = 'Full name is required.';
    }
    if (!email.trim()) {
      errs.email = 'Email is required.';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 8) {
      errs.password = 'Password must be at least 8 characters.';
    }
    if (mode === 'register') {
      if (password !== confirmPassword) {
        errs.confirmPassword = 'Passwords do not match.';
      }
      if (!residence.trim()) {
        errs.residence = 'Residence is required.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (mode === 'login') {
      const { user, error } = await loginWithEmail(email, password);
      if (error) { setErrors({ email: error }); return; }
      if (user) { setCurrentUser(user); navigate(redirectAfterLogin ?? '/feed'); setRedirectAfterLogin(null); }
    } else {
      const { user, error } = await registerWithEmail(email, password, fullName);
      if (error) { setErrors({ email: error }); return; }
      if (user) {
        setCurrentUser(user);
        if ('Notification' in window && Notification.permission !== 'granted') {
          Notification.requestPermission();
        }
        navigate(redirectAfterLogin ?? '/feed'); setRedirectAfterLogin(null);
      }
    }
  };

  const inputClass = 'bg-slate-card border border-slate-border rounded-xl px-4 py-3 text-cream w-full text-sm placeholder:text-cream-muted focus:outline-none focus:border-teal-light';

  return (
    <div className="min-h-screen bg-slate-deep flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <span className="text-gold font-bold text-xl">CN</span>
          <h1 className="text-cream font-bold text-2xl mt-2 font-serif">
            {mode === 'login' ? 'Welcome back' : 'Join your campus'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'register' && (
            <div>
              <label htmlFor="fullName" className="sr-only">Full Name</label>
              <input
                id="fullName"
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className={inputClass}
              />
              {errors.fullName && <p className="text-status-danger text-sm mt-1">{errors.fullName}</p>}
            </div>
          )}

          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={inputClass}
            />
            {errors.email && <p className="text-status-danger text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              type="password"
              placeholder={mode === 'register' ? 'Create a password (min 8 characters)' : 'Password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={inputClass}
            />
            {errors.password && <p className="text-status-danger text-sm mt-1">{errors.password}</p>}
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className={inputClass}
                />
                {errors.confirmPassword && <p className="text-status-danger text-sm mt-1">{errors.confirmPassword}</p>}
              </div>

              <div>
                <label htmlFor="residence" className="sr-only">Residence</label>
                <input
                  id="residence"
                  type="text"
                  placeholder="Type your residence or building name"
                  value={residence}
                  onChange={e => setResidence(e.target.value)}
                  className={inputClass}
                  required
                />
                {errors.residence && <p className="text-status-danger text-sm mt-1">{errors.residence}</p>}
              </div>
            </>
          )}

          <button
            type="submit"
            className="bg-ember text-white rounded-xl py-3 px-6 font-bold text-base w-full"
          >
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          {mode === 'login' ? (
            <span className="text-cream-muted">
              Don't have an account?{' '}
              <button onClick={() => { setMode('register'); setErrors({}); }} className="text-teal-light underline">
                Register
              </button>
            </span>
          ) : (
            <span className="text-cream-muted">
              Already have an account?{' '}
              <button onClick={() => { setMode('login'); setErrors({}); }} className="text-teal-light underline">
                Sign in
              </button>
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
