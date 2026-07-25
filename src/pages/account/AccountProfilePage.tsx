import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { passwordChecksFor, validatePassword } from '../../lib/passwordRules';
import { FieldError, fieldClass } from '../../components/auth/FieldError';
import { AccountCard, AccountLayout } from './AccountLayout';

const labelClass =
  'block font-sans text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2';

const buttonClass =
  'bg-primary text-primary-foreground px-8 py-3 font-sans text-xs font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed';

export function AccountProfilePage() {
  const { user, isLoading } = useAuth();

  // Name
  const [displayName, setDisplayName] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [nameNotice, setNameNotice] = useState('');
  const [nameError, setNameError] = useState('');

  // Password
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordNotice, setPasswordNotice] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  // Seed the name field once the session has restored.
  useEffect(() => {
    if (user?.displayName) setDisplayName(user.displayName);
  }, [user?.displayName]);

  const passwordChecks = passwordChecksFor(newPassword);
  const passwordsMatch = confirmPassword.length > 0 && confirmPassword === newPassword;

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError('');
    setNameNotice('');

    const trimmed = displayName.trim();
    if (!trimmed) {
      setNameError('Enter the name you want shown on your account.');
      return;
    }

    setSavingName(true);
    try {
      const { error } = await supabase.auth.updateUser({ data: { displayName: trimmed } });
      if (error) throw error;
      setNameNotice('Name updated.');
    } catch (err: any) {
      setNameError(err?.message || 'Could not update your name. Please try again.');
    } finally {
      setSavingName(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setConfirmError('');
    setPasswordNotice('');

    const problem = validatePassword(newPassword);
    if (problem) {
      setPasswordError(problem);
      return;
    }
    if (confirmPassword !== newPassword) {
      setConfirmError('Passwords do not match.');
      return;
    }

    setSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setNewPassword('');
      setConfirmPassword('');
      setPasswordNotice('Password changed. Use it next time you sign in.');
    } catch (err: any) {
      const msg = (err?.message || '').toLowerCase();
      if (msg.includes('password')) {
        setPasswordError('That password does not meet the requirements above.');
      } else {
        setPasswordError(err?.message || 'Could not change your password. Please try again.');
      }
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <AccountLayout
      active="profile"
      title="Profile"
      description="Your account details and sign-in credentials."
    >
      <AccountCard title="Your details">
        <form onSubmit={handleSaveName} noValidate className="space-y-5">
          <div>
            <label htmlFor="displayName" className={labelClass}>
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                if (nameError) setNameError('');
              }}
              disabled={isLoading || savingName}
              placeholder="Your name"
              aria-invalid={!!nameError}
              aria-describedby={nameError ? 'name-error' : undefined}
              className={fieldClass(!!nameError)}
            />
            {nameError && <FieldError id="name-error">{nameError}</FieldError>}
          </div>

          <div>
            <label htmlFor="accountEmail" className={labelClass}>
              Email Address
            </label>
            <input
              id="accountEmail"
              type="email"
              value={user?.email ?? ''}
              readOnly
              disabled
              className={`${fieldClass(false)} opacity-60 cursor-not-allowed`}
            />
            <p className="mt-2 font-sans text-xs text-muted-foreground">
              Your email is how you sign in and where receipts are sent. Contact support to change it.
            </p>
          </div>

          {nameNotice && (
            <p role="status" className="flex items-center gap-1.5 font-sans text-xs text-accent">
              <CheckCircle2 size={13} className="shrink-0" />
              {nameNotice}
            </p>
          )}

          <button type="submit" disabled={savingName} className={buttonClass}>
            {savingName ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Saving…
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </form>
      </AccountCard>

      <AccountCard
        title="Change password"
        description="Choose something you don't use anywhere else."
      >
        <form onSubmit={handleChangePassword} noValidate className="space-y-5">
          <div>
            <label htmlFor="newPassword" className={labelClass}>
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                disabled={savingPassword}
                placeholder="New password"
                aria-invalid={!!passwordError}
                aria-describedby={passwordError ? 'new-password-error' : undefined}
                className={fieldClass(!!passwordError, 'pr-12')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {passwordError && <FieldError id="new-password-error">{passwordError}</FieldError>}

            {newPassword.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {passwordChecks.map((check) => (
                  <div key={check.label} className="flex items-center gap-2">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        check.met ? 'bg-accent' : 'bg-muted-foreground/30'
                      }`}
                    />
                    <span
                      className={`font-sans text-xs ${
                        check.met ? 'text-accent' : 'text-muted-foreground/60'
                      }`}
                    >
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmNewPassword" className={labelClass}>
              Confirm New Password
            </label>
            <input
              id="confirmNewPassword"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (confirmError) setConfirmError('');
              }}
              disabled={savingPassword}
              placeholder="Re-enter your new password"
              aria-invalid={!!confirmError}
              aria-describedby={confirmError ? 'confirm-new-password-error' : undefined}
              className={fieldClass(!!confirmError)}
            />
            {confirmError && (
              <FieldError id="confirm-new-password-error">{confirmError}</FieldError>
            )}
            {!confirmError && confirmPassword.length > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    passwordsMatch ? 'bg-accent' : 'bg-muted-foreground/30'
                  }`}
                />
                <span
                  className={`font-sans text-xs ${
                    passwordsMatch ? 'text-accent' : 'text-muted-foreground/60'
                  }`}
                >
                  Passwords match
                </span>
              </div>
            )}
          </div>

          {passwordNotice && (
            <p role="status" className="flex items-center gap-1.5 font-sans text-xs text-accent">
              <CheckCircle2 size={13} className="shrink-0" />
              {passwordNotice}
            </p>
          )}

          <button type="submit" disabled={savingPassword} className={buttonClass}>
            {savingPassword ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Updating…
              </>
            ) : (
              'Update Password'
            )}
          </button>

          <p className="flex items-start gap-1.5 font-sans text-xs text-muted-foreground">
            <AlertCircle size={13} className="mt-px shrink-0" />
            Changing your password does not sign you out on other devices.
          </p>
        </form>
      </AccountCard>
    </AccountLayout>
  );
}
