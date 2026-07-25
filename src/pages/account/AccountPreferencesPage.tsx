import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import {
  DEFAULT_PREFERENCES,
  readPreferences,
  type AccountPreferences,
} from '../../lib/accountProfile';
import { FieldError } from '../../components/auth/FieldError';
import { AccountCard, AccountLayout } from './AccountLayout';

const TOGGLES: { key: keyof AccountPreferences; label: string; description: string }[] = [
  {
    key: 'marketingEmails',
    label: 'Offers and promotions',
    description: 'Occasional sales, bundles, and seasonal offers.',
  },
  {
    key: 'productUpdates',
    label: 'New products and restocks',
    description: 'A note when something launches or comes back in stock.',
  },
  {
    key: 'grantAnnouncements',
    label: 'Development Grant news',
    description: 'Application windows, deadlines, and winner announcements.',
  },
];

export function AccountPreferencesPage() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<AccountPreferences>(DEFAULT_PREFERENCES);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [seeded, setSeeded] = useState(false);

  // Seed once the session restores, but never clobber edits already in progress.
  useEffect(() => {
    if (seeded || !user) return;
    setPrefs(readPreferences(user.metadata));
    setSeeded(true);
  }, [user, seeded]);

  const toggle = (key: keyof AccountPreferences) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
    setNotice('');
    setError('');
  };

  const handleSave = async () => {
    setError('');
    setNotice('');
    setSaving(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: { preferences: prefs },
      });
      if (updateError) throw updateError;
      setNotice('Preferences saved.');
    } catch (err: any) {
      setError(err?.message || 'Could not save your preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AccountLayout
      active="preferences"
      title="Preferences"
      description="Choose what you'd like to hear from us about."
    >
      <AccountCard
        title="Email preferences"
        description="These are all off unless you turn them on. Order confirmations and other transactional emails are always sent."
      >
        <ul className="divide-y divide-border border-y border-border">
          {TOGGLES.map((item) => {
            const on = prefs[item.key];
            return (
              <li key={item.key} className="flex items-start justify-between gap-6 py-5">
                <div className="min-w-0">
                  <p className="font-sans text-sm font-medium text-foreground">{item.label}</p>
                  <p className="font-sans text-xs text-muted-foreground mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={on}
                  aria-label={item.label}
                  disabled={saving}
                  onClick={() => toggle(item.key)}
                  className={`relative shrink-0 mt-0.5 w-11 h-6 rounded-full transition-colors duration-200 disabled:opacity-60 ${
                    on ? 'bg-accent' : 'bg-muted-foreground/25'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                      on ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </li>
            );
          })}
        </ul>

        {error && <FieldError id="preferences-error">{error}</FieldError>}

        {notice && (
          <p role="status" className="mt-5 flex items-center gap-1.5 font-sans text-xs text-accent">
            <CheckCircle2 size={13} className="shrink-0" />
            {notice}
          </p>
        )}

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="mt-6 bg-primary text-primary-foreground px-8 py-3 font-sans text-xs font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Saving…
            </>
          ) : (
            'Save Preferences'
          )}
        </button>
      </AccountCard>
    </AccountLayout>
  );
}
