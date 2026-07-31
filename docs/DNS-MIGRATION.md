# Going live at dominusgolf.com — step by step

Written 2026-07-30. Follow the steps in order. Nothing here is dangerous **until
Step 5**, so take your time on Steps 1–4.

## What is actually wrong right now

Your website is finished and already running on Cloudflare. The problem is only that
the address `dominusgolf.com` is pointing at the wrong place — it points at an old
Square Online / Weebly server that has nothing on it, which is why you see a 404.

So this job is not "put the website somewhere". It is "point the address at the
website that already exists".

To do that, the part of the internet that answers "where does dominusgolf.com live?"
has to be handled by Cloudflare instead of IONOS. That's what changing nameservers
means, and that is all Step 5 does.

**The one real risk:** those same settings also tell the internet where your *email*
goes. If we move them without copying the email settings across, email to
`@dominusgolf.com` stops working. So Steps 2–4 copy them first, and we only flip the
switch afterwards. Your domain stays registered at IONOS the whole time.

---

## Step 1 — Take a backup of what IONOS has now

### Finding the DNS list at IONOS

1. Go to <https://login.ionos.com> and sign in.
2. If it asks which contract/package to open, pick the one that contains
   `dominusgolf.com`.
3. Find **Domains & SSL** — in the top navigation bar, or behind the **Menu**
   (hamburger ☰) button, depending on the version you get.
4. You'll see a list of your domains. Find the **dominusgolf.com** row.
5. Open its DNS records. Either:
   - click the **⋯** (three dots) or gear icon at the right of the row and choose
     **DNS**, or
   - click **dominusgolf.com** itself, then open the **DNS** tab on the detail page.
6. You should now see a table of records with columns like *Type*, *Host name*,
   *Points to* / *Value*, *TTL*.

While you are there, also look for the **Nameserver** section on the domain's detail
page. It should currently show the IONOS nameservers — that is what Step 5 changes.

### Take the backup

**Screenshot the entire record list.** Press `Ctrl` `-` a couple of times to zoom the
page out so every row fits in one image, then capture it. Scroll and take more if
needed.

That's your safety net. If anything goes wrong later, this is how you put it back.
Keep the screenshots until the site has been live and email has worked for a week.

### What you are comparing against

Cloudflare should end up holding these 7 records. Anything IONOS lists that is **not**
in this set needs adding to Cloudflare:

| Type | Name | Notes |
|------|------|-------|
| CNAME | `autodiscover` | → `adsredir.ionos.info`, DNS only |
| CNAME | `_domainconnect` | → `_domainconnect.ionos.com`, DNS only |
| MX | `dominusgolf.com` | `mx00.ionos.com`, priority 10 |
| MX | `dominusgolf.com` | `mx01.ionos.com`, priority 10 |
| TXT | `dominusgolf.com` | `v=spf1 include:_spf-us.ionos.com ~all` |
| TXT | `dominusgolf.com` | `fb319c20-8b5b-11f1-a2ce-713663116963` |
| TXT | `resend._domainkey.send` | the Resend signing key |

**Two exceptions — do NOT copy these**, they are the 404 and are deliberately gone
from Cloudflare:

- `A` on the apex pointing at `199.34.228.186`
- `CNAME www` pointing at `dominusgolf.com`

Pay closest attention to record types **A, AAAA, CNAME, TXT, MX, SRV and CAA**, and
to anything that looks mail-related. Ignore the NS records themselves — Step 5 handles
those.

---

## Step 2 — Add the domain to Cloudflare

### ⚠️ Read this first: it must go in the right account

Your Cloudflare login can see **two** accounts:

| Account | Account ID | What's in it |
|---------|-----------|--------------|
| **`Jaymoore@dominusgolf.com's Account`** | `d52c80b6632554c75458cf115c6d74b0` | **The website (`tit`) and the API (`dominus-golf-backend`) — use this one** |
| `Jeetpatel@dominusgolf.com's Account` | `31eb6235c2e73103c1b98c4026a13e07` | Nothing — empty |

The domain **must** go into **Jaymoore@dominusgolf.com's Account**, because a website
can only use a domain that sits in the same account as itself. If you add it to your
own account, everything here will appear to work and then Step 6 will not list the
domain at all, and it will not be obvious why.

Verified 2026-07-30: neither account has any domain added yet, so nothing you do here
is a duplicate.

### The steps

1. Go to <https://dash.cloudflare.com> and sign in as `jeetpatel@dominusgolf.com`.
2. **Switch to the right account.** Look at the very top of the page for the account
   name. If it says *Jeetpatel@dominusgolf.com's Account*, click it and choose
   **Jaymoore@dominusgolf.com's Account** instead. Some versions show an account
   chooser list right after login — pick Jay's from there.
   - **Confirm you are in the right place:** in the left sidebar click
     **Compute (Workers)** or **Workers & Pages**. You should see `tit` and
     `dominus-golf-backend` listed. If you see an empty page, you are still in the
     wrong account — go back and switch.
3. Now find the add-domain button. Depending on the version of the dashboard:
   - Left sidebar **Domains** or **Websites** → button **Add a domain**, or
   - The **+ Add** button at the top → **Existing domain**, or
   - On the account home page, a card labelled **Add a domain**.
4. Type exactly `dominusgolf.com`
   - No `www.`
   - No `https://`
   - No trailing slash
5. If it asks how you want to use Cloudflare, choose the option for **manually
   entering / reviewing DNS records** (wording varies: *Manually enter DNS records*,
   *Quick scan for DNS records*). Do **not** choose anything about transferring the
   domain registration — you are keeping the domain registered at IONOS.
6. Choose the **Free** plan. You may have to scroll; Free is usually at the far right
   or the bottom of the plan list.
7. Cloudflare scans and shows the records it found. Click **Continue**.
8. It will now show you **two nameservers** ending in `.ns.cloudflare.com`.
   **Copy both and paste them somewhere safe** — you need them in Step 5.

Nothing has changed yet. Cloudflare is not in charge of your domain until Step 5, so
you cannot break anything in Steps 2, 3 or 4.

### If you cannot add the domain

Match the message you see:

| What you see | What it means | What to do |
|---|---|---|
| Nothing happens, or the domain never appears afterwards | You are probably in the wrong account | Redo step 2 above and confirm `tit` is visible before continuing |
| *"This domain is already associated with another Cloudflare account"* | Someone else's Cloudflare account still holds it — most likely left over from **Blink**, which hosted the old site on Cloudflare | It must be removed from that account before you can add it. If you can't reach whoever owns it, Cloudflare Support can release it — you'll need to prove you own the domain, which you can do because you control DNS at IONOS |
| *"Invalid domain name"* / *"not a registrable domain"* | A typo, or you included `www.` or `https://` | Type exactly `dominusgolf.com` |
| It asks for a credit card | You picked a paid plan | Go back and choose **Free** |
| *"Zone limit reached"* | That account is at its domain limit | Use the other account — but then the website Worker must be moved too, so tell me before doing this |

If none of these match, screenshot the error and send it to me.

---

## Step 3 — Make Cloudflare's record list correct

Open **DNS → Records** for dominusgolf.com in Cloudflare.

### 3a. Delete these two, if Cloudflare imported them

| Type | Name | Value |
|------|------|-------|
| A | `dominusgolf.com` (may show as `@`) | `199.34.228.186` |
| CNAME | `www` | `dominusgolf.com` |

These two **are** the 404. Step 6 replaces them automatically, and leaving them would
conflict.

### 3b. Turn OFF proxying for the two non-website records

Cloudflare imports everything as **Proxied** (orange cloud) by default. That is right
for your website, and wrong for anything that isn't your website. Click the orange
cloud on each of these so it turns **grey (DNS only)**:

| Type | Name | Content | Why |
|------|------|---------|-----|
| CNAME | `autodiscover` | `adsredir.ionos.info` | Mail app auto-setup. Sending it through Cloudflare's proxy can break Outlook and phone mail setup |
| CNAME | `_domainconnect` | `_domainconnect.ionos.com` | IONOS service-discovery record. Not web traffic; proxying it does nothing useful |

MX and TXT records are never proxied — they will already say *DNS only*, which is
correct. Leave them.

### 3c. Check these email records are all present

Compare against the list; add anything missing with **Add record**.

| # | Type | Name (type exactly this) | Value / Content | Extra |
|---|------|--------------------------|-----------------|-------|
| 1 | MX | `@` | `mx00.ionos.com` | Priority `10` |
| 2 | MX | `@` | `mx01.ionos.com` | Priority `10` |
| 3 | TXT | `@` | `v=spf1 include:_spf-us.ionos.com ~all` | — |
| 4 | TXT | `@` | `fb319c20-8b5b-11f1-a2ce-713663116963` | — |
| 5 | TXT | `resend._domainkey.send` | see the long key below | **Most likely missing — check carefully** |

Records 1–4 are your email. Record 5 is what lets grant-application emails be
trusted instead of treated as spam; Cloudflare's scan often fails to find keys like
this one, so search the list for `resend` and add it by hand if it isn't there.

The value for record 5, all one line with no spaces or line breaks:

```
p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC4E4f8Tn43OiTOVKz3Ca24yBYSnQLWQtcyhtekH212BRk/9WSHg17GPnfAU42tZo/x5jDKsfuEzkfARdC/W0eZfietwwv7JX6WJo8pk5y6uLSqJmUT2Sv6V+/owaiLbLHEGiwP5k28i5VcJYCaSVKuTGnSIwXZ8BW6SsLCD02TyQIDAQAB
```

### 3d. Compare against your Step 1 screenshots

Go through the IONOS screenshots line by line. **If IONOS has a record that
Cloudflare does not, add it to Cloudflare now.** Cloudflare's scan cannot see every
record — it has to guess names — so this manual check is the part that actually keeps
your email working.

Ignore only the two records from 3a. Copy everything else.

---

## Step 4 — Double-check before the point of no return

Confirm all of this before continuing:

- [ ] Both `mx00.ionos.com` and `mx01.ionos.com` MX records are present
- [ ] The `v=spf1 include:_spf-us.ionos.com ~all` TXT record is present
- [ ] The long `p=MIGf...` TXT record is present on `resend._domainkey.send`
- [ ] Every record from your IONOS screenshots is in Cloudflare (except the two in 3a)
- [ ] The old `199.34.228.186` A record is gone

---

## Step 5 — Switch the nameservers at IONOS

This is the actual switch. Email keeps working because you copied its settings in
Step 3.

Cloudflare assigned these two nameservers to this zone (read from the API on
2026-07-30, so they are the real ones, not examples):

```
armando.ns.cloudflare.com
daniella.ns.cloudflare.com
```

1. In IONOS: **Domains & SSL → dominusgolf.com → Nameserver** (may be called
   *Change nameservers* or *Use own nameservers*).
2. Choose the option to use **your own / external nameservers**.
3. Enter the two Cloudflare nameservers above, replacing the four IONOS ones.
4. Save.

**Write these down before you change anything** — these are the four IONOS
nameservers currently in use, and they are what you put back if you need to undo:

```
ns.ui-global-dns.biz
ns.ui-global-dns.com
ns.ui-global-dns.de
ns.ui-global-dns.org
```

**Do not delete the DNS records at IONOS.** Leave that list exactly as it is. It
costs nothing and it is how you undo this if needed.

---

## Step 6 — Wait, then connect the domain to the website

Cloudflare emails you when the domain is **Active**. Usually 10–60 minutes; it can
take up to 48 hours because of how the internet caches this. Wait for Active before
continuing.

Then:

1. In Cloudflare, make sure you are in **Jaymoore@dominusgolf.com's Account** (see
   Step 2), then go to **Compute (Workers)** / **Workers & Pages**.
2. Click the Worker named **`tit`** (that's the website).
3. Go to **Settings → Domains & Routes**.
4. Click **Add → Custom Domain**.
5. Add `www.dominusgolf.com`.
6. Click **Add → Custom Domain** again and add `dominusgolf.com` as well.

Add **both**. Cloudflare creates the right records and the security certificate on
its own. Adding both means neither address can show an error, even if Step 7 is
skipped or done wrong.

Give it a few minutes for the certificate, then open <https://www.dominusgolf.com>.
**Your site should be live.**

---

## Step 7 — Send dominusgolf.com to www (optional, do it after the site works)

The site's own settings all use the `www` version as the official address, so it's
tidier if the version without `www` forwards to it. Purely for Google's benefit — the
site works either way, so skip this if you'd rather stop here.

1. In Cloudflare, with dominusgolf.com selected, go to **Rules → Redirect Rules**.
2. Create a rule:
   - **When**: Hostname **equals** `dominusgolf.com`
   - **Then**: Dynamic redirect, status **301**, preserve query string
   - **Expression**: `concat("https://www.dominusgolf.com", http.request.uri.path)`
3. Deploy.

---

## Step 8 — Test it

**Email first.** This is the part with real consequences:

- [ ] Send an email **to** your `@dominusgolf.com` address from an outside account
      (Gmail etc.) — it arrives
- [ ] Send an email **from** your `@dominusgolf.com` address — it arrives
- [ ] Submit a test grant application and confirm the confirmation email arrives

**Then the site:**

- [ ] <https://www.dominusgolf.com> loads with a padlock (valid certificate)
- [ ] <https://dominusgolf.com> works (and forwards to www, if you did Step 7)
- [ ] Open a product page directly, e.g.
      <https://www.dominusgolf.com/product/tour-pure-men> — it should load straight
      away, not flash an error first
- [ ] Sign in, add something to the cart, and complete one real checkout — then
      refund it

Tell me when you reach this point and I'll verify the technical side properly,
including that the live site is talking to the right payment backend.

---

## If something goes wrong

**Undo everything:** in IONOS, set the nameservers back to the four original IONOS
ones from your Step 1 screenshots. Because you never deleted the IONOS records,
this restores the previous state, email included. It takes a little while to spread,
which is exactly why Step 5 says not to delete anything.

**If only email breaks:** you missed a record in Step 3. Compare your screenshots
against Cloudflare again — it's almost always a missing MX or TXT.

---

## Two email problems worth fixing while you're in there

Found while checking your DNS on 2026-07-30. Neither blocks going live, but both
affect whether your emails reach people:

1. **The Resend sending address is only half set up.** Grant emails are sent from
   `Customersupport@send.dominusgolf.com`. That subdomain has its signing key, but no
   SPF record and no bounce-handling MX record. Log in to Resend, open the domain,
   and add whatever records it says are missing — you can add them in Cloudflare in
   the same sitting.
2. **There is no DMARC record.** It tells other mail providers what to do with mail
   that fails checks, and its absence makes your mail more likely to be filtered.
   A safe starting record: TXT on name `_dmarc` with value
   `v=DMARC1; p=none; rua=mailto:Customersupport@dominusgolf.com`.

## One thing to check first

If `dominusgolf.com` is still connected to a **Square Online / Weebly** site,
disconnect it there. Otherwise that service may keep putting the old
`199.34.228.186` record back and undo your work.

---

## Reference: what was published before the migration

Recorded 2026-07-30 by querying public DNS. Useful for comparison, but your Step 1
screenshots are the authoritative version — public queries cannot list every record,
only resolve names that were guessed.

| Name | Type | Value |
|------|------|-------|
| `dominusgolf.com` | NS | `ns.ui-global-dns.{com,de,org,biz}` (IONOS) |
| `dominusgolf.com` | A | `199.34.228.186` (Weebly / Square Online — the 404) |
| `www` | CNAME | `dominusgolf.com` |
| `dominusgolf.com` | MX 10 | `mx00.ionos.com`, `mx01.ionos.com` |
| `dominusgolf.com` | TXT | `v=spf1 include:_spf-us.ionos.com ~all` |
| `dominusgolf.com` | TXT | `fb319c20-8b5b-11f1-a2ce-713663116963` |
| `resend._domainkey.send` | TXT | `p=MIGf...` (Resend DKIM, full value above) |
| `autodiscover` | A | `195.20.225.174` |
| `_dmarc`, `_dmarc.send` | TXT | **absent** |
| `send` | MX / TXT | **absent** (only the DKIM key exists) |
| `dominusgolf.com` | CAA | none — so Cloudflare's certificate will issue fine |
| `_autodiscover._tcp` etc. | SRV | none |
