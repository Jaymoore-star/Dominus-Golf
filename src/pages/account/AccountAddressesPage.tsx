import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { EMPTY_ADDRESS, readAddress, type SavedAddress } from '../../lib/accountProfile';
import { FieldError, fieldClass } from '../../components/auth/FieldError';
import { US_STATES } from '../../lib/usStates';
import { StyledSelect } from '../../components/ui/StyledSelect';
import { AccountCard, AccountLayout } from './AccountLayout';

const labelClass =
  'block font-sans text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2';

export function AccountAddressesPage() {
  const { user } = useAuth();
  const [address, setAddress] = useState<SavedAddress>(EMPTY_ADDRESS);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [seeded, setSeeded] = useState(false);

  // Seed once the session restores, but never clobber edits already in progress.
  useEffect(() => {
    if (seeded || !user) return;
    setAddress(readAddress(user.metadata));
    setSeeded(true);
  }, [user, seeded]);

  const set = (key: keyof SavedAddress) => (value: string) => {
    setAddress((prev) => ({ ...prev, [key]: value }));
    if (error) setError('');
    if (notice) setNotice('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (!address.line1.trim() || !address.city.trim() || !address.postalCode.trim()) {
      setError('Street address, city and ZIP / postal code are required.');
      return;
    }

    setSaving(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ data: { address } });
      if (updateError) throw updateError;
      setNotice('Address saved.');
    } catch (err: any) {
      setError(err?.message || 'Could not save your address. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const field = (
    id: keyof SavedAddress,
    label: string,
    opts: { placeholder?: string; type?: string } = {},
  ) => (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        type={opts.type ?? 'text'}
        value={address[id]}
        onChange={(e) => set(id)(e.target.value)}
        disabled={saving}
        placeholder={opts.placeholder}
        className={fieldClass(false)}
      />
    </div>
  );

  return (
    <AccountLayout
      active="addresses"
      title="Addresses"
      description="Save a delivery address so you don't have to type it out every time."
    >
      <AccountCard title="Default delivery address">
        <form onSubmit={handleSave} noValidate className="space-y-5">
          {field('line1', 'Street Address', { placeholder: '123 Fairway Drive' })}
          {field('line2', 'Apartment, Suite (optional)', { placeholder: 'Apt 4B' })}

          <div className="grid sm:grid-cols-2 gap-5">
            {field('city', 'City', { placeholder: 'Scottsdale' })}

            <StyledSelect
              id="state"
              label="State"
              value={address.state}
              onChange={set('state')}
              options={US_STATES}
              placeholder="Select your state"
              disabled={saving}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {field('postalCode', 'ZIP / Postal Code', { placeholder: '85251' })}
            {field('country', 'Country')}
          </div>

          {field('phone', 'Phone (optional)', { placeholder: '(555) 123-4567', type: 'tel' })}

          {error && <FieldError id="address-error">{error}</FieldError>}

          {notice && (
            <p role="status" className="flex items-center gap-1.5 font-sans text-xs text-accent">
              <CheckCircle2 size={13} className="shrink-0" />
              {notice}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="bg-primary text-primary-foreground px-8 py-3 font-sans text-xs font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Saving…
              </>
            ) : (
              'Save Address'
            )}
          </button>
        </form>
      </AccountCard>
    </AccountLayout>
  );
}
