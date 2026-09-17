# SEO copy proposal - titles, H1s and meta descriptions

Drafted 16 September 2026. **✅ APPLIED 16 September 2026**, after the three
decisions in §1 were settled:

| Decision | Chosen |
|---|---|
| §1.1 brand spelling | **Feel Right** — the product, the live URL and every component already used it, so no URL moved and no redirect was needed |
| §2 title mechanism | **A `seoTitle` field**, driving the `<title>` and the `<h1>` only. `product.name` still runs the cart, the Square line item and the Merchant feed, so no receipt changed and Google did not re-review the 36 feed entries |
| §1.2 "Tee" | **"T-Shirt" in titles and H1s only**; body copy still says "Tee" |

Kept as the record of what changed and why. The proposed column is what shipped
unless noted. Anything here is a one-line revert — the strings live in
`PAGE_SEO` / `SHOP_CATEGORIES` in `src/lib/pageSeo.ts` and in `seoTitle` /
`seoDescription` on each product.

Two things were done beyond the table below, both flagged by Bing Webmaster
Tools on the same day:

- **Nine more descriptions were lengthened** — `/about/contact`,
  `/about/sustainability`, `/affiliates`, `/pros`, `/leroy-bates`,
  `/gabe-salvanera`, `/shipping-policy`, `/terms`, `/safety-disclaimer`. §5
  called these "fine as they are"; Bing disagreed, and at 64-91 characters
  against a 120-155 target it was right. All 36 indexed pages now sit inside the
  target.
- **`/about/contact` stopped advertising the Development Grant**, which has been
  unpublished since 2026-09-02. It was inviting people to ask about a page that
  302s away.

---

## The problem this fixes

`docs/SEO.md` §3 lists the search terms that are realistically winnable for this
site:

> `swing path trainer`, `swing plane training aid`, `golf tempo trainer band`,
> `golf connection band drill`, `how to fix an over the top swing`,
> `golf swing path drills`, `golf training aid for beginners`

**Not one of those phrases currently appears in any title, H1 or meta
description on the site.** The markup that carries them is excellent; the words
inside it are brand names.

A title is the clickable blue line in Google, and it is the single strongest
on-page ranking signal. `Tour Pure Men` is a product name only somebody who
already knows the brand would type.

The guideline stays as it is in `SEO.md` §4: titles under ~60 characters,
descriptions 120-155. Character counts below include the ` | Dominus Golf`
suffix, which `seo()` appends automatically.

---

## 1. Two naming decisions to make first

These are brand questions, not SEO questions, but both affect every row below.

### 1.1 "Feel Right" or "Feel Rite"?

The site currently uses both:

| Spelling | Where |
|---|---|
| Feel **Right** Band | the product name, `/product/feel-right-band`, the route `/feel-right-band-guide`, `FeelRightBandOverview.tsx` |
| Feel **Rite** Band | the guide page title, `CLAUDE.md`, `docs/SEO.md`, the image file `FeelRiteGolfBand__cc34ac6f.webp` |

A customer who hears the name once and searches it will type one of the two.
Google treats them as different strings, so the brand's own search volume is
currently split across two spellings, and whichever one they land on, half the
site calls it something else.

**Needed: pick one.** I will make everything match, including the route (with a
301 from the old path so no link breaks). I have not assumed which - "Rite" is
the more distinctive mark, "Right" is what the code and the live URL already
use and so is the cheaper change.

### 1.2 "Tee" means the plastic peg

Five apparel products are titled `Icon Tee`, `Wordmark Tee`, `Performance Tee`.

In every other retail category "tee" reads as t-shirt. In golf it reads as the
peg you put the ball on - and "golf tee" is a high-volume query for a product
you do not sell. These pages are currently pointed at the wrong search
entirely, and at a query where the competition is Amazon selling 100-packs for
$8.

**Proposed: use "T-Shirt" in the title and H1**, and keep "Tee" in the on-page
body copy where the visitor already knows they are in apparel.

---

## 2. Products

The meta description for a product is currently the first paragraph of its
description, auto-clipped to 155 characters. That produces this, live right now
on your best-selling product:

> **Tour Pure Men** | Dominus Golf
> Most golfers spend hundreds on new equipment hoping something changes.

Seventy characters, no product category, no price, no reason to click. Three
others are clipped mid-word with an ellipsis. Proposed: a written description
per product, stored alongside the product, falling back to the current clip for
anything without one.

| URL | Now | Proposed |
|---|---|---|
| `/product/tour-pure-men` | **T:** Tour Pure Men<br>**D:** Most golfers spend hundreds on new equipment hoping something changes. | **T:** Tour Pure Swing Path Trainer - Men's *(50)*<br>**D:** Weighted swing trainer that teaches swing path and plane with immediate feedback on every rep. Built for full swing, chipping and putting. *(141)* |
| `/product/tour-pure-women` | **T:** Tour Pure Women<br>**D:** Precision weighted swing trainer designed to develop smooth tempo... *(clipped)* | **T:** Tour Pure Swing Path Trainer - Women's *(52)*<br>**D:** Women's weighted swing trainer for tempo, sequencing and a repeatable swing path. Includes the free Ultimate Guide to Mastering the Game. *(139)* |
| `/product/tour-pure-jr` | **T:** Tour Pure Jr<br>**D:** Junior swing trainer designed to build balance, sequencing... *(clipped)* | **T:** Tour Pure Junior Golf Swing Trainer *(49)*<br>**D:** Junior swing trainer that builds balance, sequencing and mechanics early, without overwhelming weight. Includes the free 90-day manual. *(139)* |
| `/product/feel-right-band` | **T:** Feel Right Band<br>**D:** Helps train proper arm structure and connection... *(clipped)* | **T:** Feel Right Golf Tempo and Connection Band *(55)*<br>**D:** Training band for arm structure and connection through the swing. Inspired by the floatie drill used on tour. Builds tempo and sequencing. *(142)* |
| `/product/dominus-towel` | **T:** Dominus Golf Towel<br>**D:** Premium Dominus Golf towel-clean, durable, built for the bag. *(61)* | **T:** Premium Microfiber Golf Towel *(43)*<br>**D:** Microfiber golf towel built for the bag. Durable, quick-drying and sized to clip on and stay put through a full round. *(122)* |
| `/product/mastering-the-game-book` | **T:** The Ultimate Guide to Mastering the Game (Physical Copy) *(71 - truncated by Google)*<br>**D:** Stop guessing and start grinding with purpose... *(clipped)* | **T:** 90-Day Golf Training Program - Paperback *(54)*<br>**D:** A structured day-by-day golf training curriculum. Ninety days of drills, rep counts and practice plans in a printed paperback. *(129)* |
| `/product/training-manual-pdf` | **T:** Ultimate Guide to Mastering the Game (PDF) *(57)*<br>**D:** The complete 90-day training curriculum... *(clipped)* | **T:** 90-Day Golf Training Program - PDF *(48)*<br>**D:** The full 90-day golf training curriculum as an instant PDF download. Free with any Tour Pure swing trainer. Drills, reps and practice plans. *(141)* |
| `/product/dominus-tee-icon-white` | **T:** Icon Tee (Men's) | **T:** Icon Golf T-Shirt - Men's, White *(47)*<br>**D:** Men's golf t-shirt with the Dominus icon. Minimalist design in a premium cotton feel, built for the course and beyond. *(122)* |
| `/product/dominus-tee-wordmark-white` | **T:** Wordmark Tee (Men's) | **T:** Wordmark Golf T-Shirt - Men's, White *(51)*<br>**D:** Men's golf t-shirt with the arched Dominus wordmark and D logo. Premium cotton feel for the course and beyond. *(113)* |
| `/product/dominus-tee-performance-black` | **T:** Performance Tee (Men's) | **T:** Performance Golf T-Shirt - Men's, Black *(55)*<br>**D:** Men's moisture-wicking golf t-shirt in triblend fabric. Back logo with sleeve branding, built to train and play in. *(119)* |
| `/product/dominus-womens-tee-black-icon` | **T:** Icon Tee - Black (Women's) | **T:** Icon Golf T-Shirt - Women's, Black *(50)*<br>**D:** Women's golf t-shirt with the Dominus icon in black. Bold logo and a premium feel, built for the course and beyond. *(119)* |
| `/product/dominus-womens-tee-white-icon` | **T:** Icon Tee - White (Women's) | **T:** Icon Golf T-Shirt - Women's, White *(50)*<br>**D:** Women's golf t-shirt with the Dominus icon in white. Clean minimalist design, built for the course and beyond. *(115)* |
| `/product/dominus-womens-tee-black-performance` | **T:** Performance Tee (Women's) | **T:** Performance Golf T-Shirt - Women's, Black *(57)*<br>**D:** Women's moisture-wicking golf t-shirt in triblend fabric with the Dominus D logo. Built to train and play in. *(112)* |

> **Note on the product H1.** `ProductInfo.tsx` renders
> `displayProductName(product.name)` as the H1, so changing a product's `name`
> changes the H1, the title, the cart, the Square line item and the Merchant
> Center feed together. That is usually what you want, but it means a rename is
> not only an SEO edit. If you would rather keep the short names on the page and
> in the cart, say so and I will add a separate `seoTitle` field instead, which
> changes the title tag only.

---

## 3. Category pages

| URL | Now | Proposed |
|---|---|---|
| `/shop/all` | **T:** Shop All<br>**D:** Browse every Dominus Golf product - training systems, apparel, and accessories. *(79)* | **T:** Shop All Golf Training Gear *(43)*<br>**D:** Every Dominus Golf product in one place: swing trainers, training bands, golf apparel and accessories. Free shipping over $150. *(129)* |
| `/shop/training-system` | **T:** Golf Training Systems<br>**D:** Swing training systems from Dominus Golf, built to develop swing path, plane, and tempo. *(88)* | **T:** Golf Swing Trainers and Training Aids *(53)*<br>**D:** Swing path and swing plane training aids built for repeatable mechanics. Weighted trainers and tempo bands for indoor or outdoor practice. *(141)* |
| `/shop/apparel` | **T:** Golf Apparel<br>**D:** Dominus Golf apparel - on and off the course. *(45 - very thin)* | **T:** Golf T-Shirts and Apparel *(40)*<br>**D:** Dominus Golf t-shirts and apparel for men and women. Premium cotton and moisture-wicking triblend, built for the course and beyond. *(134)* |
| `/shop/accessories` | **T:** Golf Accessories<br>**D:** Golf accessories and training add-ons from Dominus Golf. *(56 - thin)* | **T:** Golf Accessories and Training Add-Ons *(53)*<br>**D:** Golf towels, training manuals and practice add-ons from Dominus Golf. The small gear that makes a practice session work. *(124)* |
| `/shop/mens-gear` | **T:** Men's Golf Gear<br>**D:** Men's golf training gear and apparel from Dominus Golf. *(55 - thin)* | **T:** Men's Golf Apparel *(35)*<br>**D:** Men's golf t-shirts and apparel from Dominus Golf. Premium cotton and moisture-wicking triblend in icon, wordmark and performance cuts. *(138)* |
| `/shop/womens-gear` | **T:** Women's Golf Gear<br>**D:** Women's golf training gear and apparel from Dominus Golf. *(57 - thin)* | **T:** Women's Golf Apparel *(37)*<br>**D:** Women's golf t-shirts and apparel from Dominus Golf. Premium cotton and moisture-wicking triblend in icon and performance cuts. *(132)* |

> **On mens-gear and womens-gear.** `SEO.md` §1 records the decision that these
> two stay apparel-only, to avoid being ~70% identical to `/shop/all`. The
> titles above say "Apparel" rather than "Gear" so the page promises what it
> actually lists - a visitor arriving on "men's golf gear" and finding three
> t-shirts bounces, and that bounce is itself a ranking signal.

---

## 4. Guide and informational pages

These are the pages `SEO.md` §3 identifies as the winnable ones, so their titles
matter most. The current titles are named after the products; the proposed ones
are named after the search.

| URL | Now | Proposed |
|---|---|---|
| `/tour-pure-guide` | **T:** Tour Pure Training Guide<br>**D:** How to train with the Tour Pure system: drills, rep counts, and building a repeatable swing path. *(97)* | **T:** Golf Swing Path Drills - Tour Pure Guide *(56)*<br>**D:** How to fix an over-the-top swing and train a repeatable path. Drills, rep counts and a practice structure using the Tour Pure trainer. *(138)* |
| `/feel-right-band-guide` | **T:** Feel Rite Band Guide<br>**D:** How to use the Feel Rite Band to build tempo, sequencing, and connection through the golf swing. *(96)* | **T:** Golf Tempo and Connection Drills - Band Guide *(59)*<br>**D:** Drills for golf tempo, sequencing and arm connection through the swing, using a connection band. Includes the tour floatie drill. *(133)* |
| `/beginners` | **T:** Golf Training for Beginners<br>**D:** New to golf? Where to start with swing path, plane, and tempo - and which Dominus Golf training system fits a beginner. *(119)* | **T:** Golf Training Aids for Beginners *(46)*<br>**D:** New to golf? What to practise first, how to build a swing that repeats, and which training aid actually helps a beginner improve. *(131)* |

---

## 5. Pages that are fine, with small gains available

No change needed on these unless you want it. The two pro profiles are the only
ones with a real miss - a name alone tells Google nothing about the page.

| URL | Now | Proposed |
|---|---|---|
| `/leroy-bates` | **T:** Leroy Bates | **T:** Leroy Bates - Golf Professional *(48)* |
| `/gabe-salvanera` | **T:** Gabe Salvanera | **T:** Gabe Salvanera - Golf Professional *(51)* |
| `/pros` | **T:** Practice With Pros | **T:** Practice With Golf Professionals *(46)* |
| `/about/team` | **D:** 51 chars, thin | **D:** The coaches, players and builders behind Dominus Golf training systems, and why the company builds practice equipment rather than clubs. *(137)* |
| `/about/careers` | **D:** 55 chars, thin | **D:** Open roles at Dominus Golf. We hire for product, content and community across golf training and direct-to-consumer retail. *(122)* |
| `/`, `/about`, `/affiliates`, `/shipping-policy`, `/terms`, `/safety-disclaimer`, `/about/sustainability` | - | Fine as they are. |

---

## 6. The home page H1

Currently, in `NewHeroSection.tsx`:

> **THE FEEDBACK YOUR SWING HAS BEEN MISSING.**

This is a good line and I am not proposing replacing it. The issue is that the
home page - the strongest page on the domain - has no heading anywhere on it
containing the word "golf", and the H1 is the heading Google weights most.

Also worth knowing: `WhySection`, `PrincipleSection` and `ResultsSection`
currently render no heading tags at all, so the home page's entire heading
outline is one H1 and two H2s near the bottom.

**Proposed: keep the H1, add a descriptive H2** as the first heading of
`WhySection`, something like:

> Golf swing trainers built to teach path, plane and tempo

That gives the page its keyword heading without touching the hero line, and it
fixes the empty heading outline at the same time.

---

## 7. What I am not proposing

- **Keyword stuffing the body copy.** The product descriptions read well and
  convert; they are not the problem. Titles are.
- **Changing `/`'s title.** `Dominus Golf - Golf Training Systems, Apparel &
  Accessories` is already keyword-bearing and 63 characters. It is fine.
- **Renaming DOMINUS HER.** Unpublished pending legal review; out of scope here.
- **FAQ or HowTo schema.** Google deprecated both for sites like this.
  `SEO.md` §3 is correct to call them dead ends.

---

## After these are applied

1. `npm run seo:dates` and commit, or the sitemap advertises stale dates.
2. `npm run og:images` if any product `name` changes, so the share images match.
3. Re-check the Merchant Center feed: product `name` changes flow into
   `google-merchant.xml`, and Google re-reviews changed items.
4. Expect movement in 3-6 months, not weeks. `SEO.md` §3 sets that expectation
   and it has not changed.
