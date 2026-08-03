import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import {
  Search,
  User,
  ShoppingBag,
  Heart,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Package,
  MapPin,
  SlidersHorizontal,
} from 'lucide-react';
import { useCart } from '../../store/cartStore';
import { useWishlist } from '../../store/wishlistStore';
import { useAuth } from '../../hooks/useAuth';
import { useScrollLock } from '../../hooks/useScrollLock';
import { products } from '../../data/products';

type MegaMenuKey = 'training' | 'guide' | 'apparel' | 'accessories' | 'pros' | 'company' | null;

/** Signed-in account menu. Mirrors the sidebar on the /account pages. */
const accountMenu = [
  { label: 'Profile', to: '/account', icon: <User size={16} /> },
  { label: 'Orders', to: '/account/orders', icon: <Package size={16} /> },
  { label: 'Wishlist', to: '/account/wishlist', icon: <Heart size={16} /> },
  { label: 'Addresses', to: '/account/addresses', icon: <MapPin size={16} /> },
  { label: 'Preferences', to: '/account/preferences', icon: <SlidersHorizontal size={16} /> },
];

type MegaLink = { label: string; href: string };

type MegaMenuEntry = {
  /** Every column is a real grouping. A heading over a single link, or over a
      catch-all that isn't a product, reads as filler and was the main reason
      these menus looked arbitrary. */
  columns: { heading: string; links: MegaLink[] }[];
  /** At most one catch-all per menu, rendered as a footer action rather than a
      list item. As a list item it was indistinguishable from a product — and
      Training Systems had two of them under different names. */
  shopAll?: MegaLink;
  image: string;
  imageCaption: string;
};

const megaMenuData: Partial<Record<NonNullable<MegaMenuKey>, MegaMenuEntry>> = {
  training: {
    columns: [
      {
        heading: 'Tour Pure',
        links: [
          { label: 'Tour Pure Men', href: '/product/tour-pure-men' },
          { label: 'Tour Pure Women', href: '/product/tour-pure-women' },
          { label: 'Tour Pure Jr', href: '/product/tour-pure-jr' },
        ],
      },
      {
        heading: 'Guides & Coaching',
        links: [
          { label: 'Tour Pure Training Guide', href: '/tour-pure-guide' },
          { label: 'Golf Training for Beginners', href: '/beginners' },
          { label: 'Practice With Pros', href: '/pros' },
        ],
      },
    ],
    shopAll: { label: 'Shop All Training Systems', href: '/shop/training-system' },
    image: '/images/Photoroom-20251125_1425462241__e480e1c6.webp',
    imageCaption: 'Tour Pure - Build Your Best Swing',
  },
  apparel: {
    columns: [
      // The column heading already says whose tees these are, so the per-link
      // "(Men's)" / "(Women's)" suffix was repeating it on every row — and it was
      // long enough to wrap the longer labels onto a second line. Each label is
      // still unique within its own column.
      {
        heading: "Men's Tees",
        links: [
          { label: 'Icon Tee - White', href: '/product/dominus-tee-icon-white' },
          { label: 'Wordmark Tee - White', href: '/product/dominus-tee-wordmark-white' },
          // Labelled White because that is the only colour it ships in. The id
          // says "black" but its sole colorVariant is White — the id is historic
          // and is not worth changing, since it is a live product URL.
          { label: 'Performance Tee - White', href: '/product/dominus-tee-performance-black' },
        ],
      },
      {
        heading: "Women's Tees",
        links: [
          { label: 'Icon Tee - Black', href: '/product/dominus-womens-tee-black-icon' },
          { label: 'Icon Tee - White', href: '/product/dominus-womens-tee-white-icon' },
          { label: 'Performance Tee - Black', href: '/product/dominus-womens-tee-black-performance' },
        ],
      },
    ],
    shopAll: { label: 'Shop All Apparel', href: '/shop/apparel' },
    image: '/images/unnamed-11__fc5a40f7.webp',
    imageCaption: 'Dominus Golf Apparel',
  },
  accessories: {
    columns: [
      {
        heading: 'Gear',
        links: [
          { label: 'Feel Right Band', href: '/product/feel-right-band' },
          { label: 'Dominus Golf Towel', href: '/product/dominus-towel' },
        ],
      },
      {
        heading: 'Guides & Books',
        links: [
          { label: 'The Ultimate Guide (Book)', href: '/product/mastering-the-game-book' },
          { label: 'Feel Right Band Guide', href: '/feel-right-band-guide' },
        ],
      },
    ],
    shopAll: { label: 'Shop All Accessories', href: '/shop/accessories' },
    image: '/images/Screenshot_20260324_042207_SamsungInternet__2f2a1710.webp',
    imageCaption: 'Dominus Golf Accessories',
  },
  company: {
    columns: [
      {
        heading: 'Company',
        links: [
          { label: 'About Dominus Golf', href: '/about' },
          { label: 'Team Dominus Golf', href: '/about/team' },
          { label: 'Careers', href: '/about/careers' },
          { label: 'Sustainability', href: '/about/sustainability' },
        ],
      },
      {
        heading: 'Get Involved',
        links: [
          { label: 'Development Grant', href: '/grant' },
          { label: 'Affiliate Program', href: '/affiliates' },
          { label: 'Contact Us', href: '/about/contact' },
        ],
      },
      {
        heading: 'Legal',
        links: [
          { label: 'Safety Disclaimer', href: '/safety-disclaimer' },
          { label: 'Shipping Policy', href: '/shipping-policy' },
          { label: 'Terms & Conditions', href: '/terms' },
        ],
      },
    ],
    image: '/images/Photoroom-20251125_1425462241__e480e1c6.webp',
    imageCaption: 'Veteran-Owned. Coach-Led.',
  },
};

export function Navbar() {
  const { itemCount, toggleCart } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeMega, setActiveMega] = useState<MegaMenuKey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [accountOpen, setAccountOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const announcements = [
    { text: 'The Dominus Golf Development Grant is Now Open - $5,000 Awarded to One Golfer Nationwide. Apply by August 15.', link: '/grant', linkLabel: 'Apply Now' },
    { text: 'Free Shipping on Orders Over $150', link: null, linkLabel: null },
    { text: 'Earn Commission Promoting Dominus Golf.', link: '/affiliates', linkLabel: 'Become an Affiliate' },
    { text: 'Shop New Training Systems - Build Your Best Swing', link: null, linkLabel: null },
  ];

  // Rotate announcements
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  // Close mega menu / search when clicking outside the header
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveMega(null);
        setSearchOpen(false);
        setSearchQuery('');
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus the inline search field as it expands
  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  function closeSearch() {
    setSearchOpen(false);
    setSearchQuery('');
  }

  const searchResults = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.subcategory?.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .slice(0, 6)
    : [];

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      closeSearch();
    }
    if (e.key === 'Enter' && searchResults.length > 0) {
      const first = searchResults[0];
      closeSearch();
      navigate({ to: '/product/$id', params: { id: first.id } });
    }
  }

  // Lock body scroll when mobile menu open
  useScrollLock(mobileOpen);

  const navLinks: { label: string; key: MegaMenuKey; href?: string }[] = [
    { label: 'Training Systems', key: 'training' },
    { label: 'Apparel', key: 'apparel' },
    { label: 'Accessories', key: 'accessories' },
    { label: 'Company', key: 'company' },
    { label: 'Development Grant', key: null, href: '/grant' },
    // Short label on purpose: the row is 6 items plus the wordmark and four icons,
    // and the nav container clips rather than wraps. "Affiliate Program" pushed it
    // over on a 1024px viewport.
    { label: 'Affiliates', key: null, href: '/affiliates' },
  ];

  // Not every nav key has a panel (Grant and Affiliates go straight to a route),
  // so this stays undefined for those and the panel simply doesn't render.
  const mega = activeMega ? megaMenuData[activeMega] : undefined;

  // Icons tighten up while the search field is open so it has room to grow.
  const iconBtnClass = `relative ${
    // Four icons now, so they start tighter and relax as width allows.
    searchOpen ? 'p-1' : 'p-1 min-[360px]:p-1.5 sm:p-2'
  } text-foreground hover:text-accent transition-all duration-300 active:scale-90`;

  return (
    <>
      <header className="sticky top-0 z-30" ref={navRef}>
        {/* Announcement Bar — stacked in one grid cell so the bar is as tall as the
            longest message and never clips it on a narrow screen. */}
        <div className="bg-primary text-primary-foreground min-h-9 grid items-center px-4 py-1.5 overflow-hidden">
          {announcements.map((item, i) => (
            <div
              key={i}
              className={`col-start-1 row-start-1 flex items-center justify-center transition-all duration-700 ease-in-out ${
                i === announcementIndex
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 -translate-y-4 pointer-events-none'
              }`}
            >
              <span className="font-sans text-[10px] sm:text-[11px] font-medium tracking-wide sm:tracking-widest uppercase text-accent text-center leading-snug">
                {item.text}{' '}
                {/* Router Link, not an anchor with target="_blank". Every
                    announcement points somewhere on this site, so opening a new
                    tab meant a full page load and a duplicate tab — which looks
                    exactly like the site reloading itself. */}
                {item.link && (
                  <Link
                    to={item.link}
                    className="underline underline-offset-4 hover:text-white transition-colors duration-200 font-bold"
                  >
                    {item.linkLabel}
                  </Link>
                )}
              </span>
            </div>
          ))}
        </div>

        {/* Main Nav */}
        <nav className="bg-background border-b border-border">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* min-w-0 so the row can never be forced wider than the screen: the
                wordmark below is allowed to shrink and truncate, absorbing any
                pressure instead of shoving the icon group off the right edge.
                That is what put the cart icon off-screen on real phones. */}
            <div className="flex items-center justify-between h-16 gap-2 min-w-0">
              {/* Mobile hamburger */}
              <button
                className="lg:hidden p-1.5 sm:p-2 text-foreground hover:text-accent transition-colors"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>

              {/* Wordmark */}
              <Link
                to="/"
                className={`min-w-0 truncate font-serif font-bold text-foreground hover:text-accent transition-all duration-300 ${
                  searchOpen
                    ? 'hidden sm:block tracking-[0.14em] text-[17px]'
                    // Sized down on phones: at 22px/0.22em the wordmark is ~216px, and
                    // hamburger + wordmark + three icons came to 424px inside a 375px
                    // screen. Since the icon group is shrink-0, the row pushed 49px past
                    // the edge and every page scrolled sideways.
                    // Ramped by width rather than one mobile size, because the row now
                    // carries four icons as well as the hamburger. Every step was
                    // measured at 320/360/375/390/393/412/430/440px — the wordmark is
                    // the only thing with slack to give, and it is `min-w-0 truncate`
                    // so it yields rather than pushing the icons off if anything grows.
                    : 'text-[12px] tracking-[0.02em] min-[360px]:text-[14px] min-[360px]:tracking-[0.05em] min-[375px]:text-[16px] min-[375px]:tracking-[0.08em] min-[390px]:text-[17px] min-[390px]:tracking-[0.1em] min-[430px]:text-[19px] min-[430px]:tracking-[0.12em] sm:tracking-[0.16em] lg:text-[18px] lg:tracking-[0.12em] xl:text-[22px] xl:tracking-[0.22em]'
                }`}
              >
                DOMINUS GOLF
              </Link>

              {/* Desktop Nav Links — tighten (and clip, if it comes to that) while searching */}
              <div className="hidden lg:flex items-center gap-1 min-w-0 overflow-hidden">
                {navLinks.map((link) => (
                  // Hover handled on the wrapper so it covers plain links too:
                  // link.key is null for Development Grant and Affiliates, which
                  // closes whatever mega menu was open. Previously only the mega
                  // buttons had a hover handler, so sliding across to those two
                  // left the Company panel hanging open over the page.
                  <div
                    key={link.label}
                    className="relative shrink-0"
                    onMouseEnter={() => setActiveMega(link.key)}
                  >
                    {link.key ? (
                      <button
                        onClick={() =>
                          setActiveMega(activeMega === link.key ? null : link.key)
                        }
                        className={`flex items-center gap-1 whitespace-nowrap py-2 font-sans font-medium tracking-wide text-foreground hover:text-accent transition-all duration-300 ${
                          searchOpen
                            ? 'px-1.5 text-[12px]'
                            : 'px-1.5 text-[12px] xl:px-3 xl:text-[13px]'
                        } ${activeMega === link.key ? 'text-accent' : ''}`}
                      >
                        {link.label}
                        <ChevronDown
                          size={13}
                          className={`transition-transform duration-200 ${
                            activeMega === link.key ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    ) : link.href?.startsWith('http') ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block whitespace-nowrap py-2 font-sans font-medium tracking-wide text-foreground hover:text-accent transition-all duration-300 ${
                          searchOpen
                            ? 'px-1.5 text-[12px]'
                            : 'px-1.5 text-[12px] xl:px-3 xl:text-[13px]'
                        }`}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href ?? '/'}
                        className={`block whitespace-nowrap py-2 font-sans font-medium tracking-wide text-foreground hover:text-accent transition-all duration-300 ${
                          searchOpen
                            ? 'px-1.5 text-[12px]'
                            : 'px-1.5 text-[12px] xl:px-3 xl:text-[13px]'
                        }`}
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Inline search — the field and its results share one width */}
              <div
                className={`relative transition-all duration-300 ease-out ${
                  searchOpen
                    ? 'flex-1 min-w-[110px] max-w-[420px] mx-2 lg:mx-4 opacity-100'
                    : 'flex-none w-0 max-w-0 mx-0 opacity-0 pointer-events-none'
                }`}
              >
                <div
                  className={`flex w-full items-center gap-2 overflow-hidden border-b transition-colors ${
                    searchOpen ? 'border-border focus-within:border-accent' : 'border-transparent'
                  }`}
                >
                  <Search size={17} className="text-muted-foreground shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Search products..."
                    tabIndex={searchOpen ? 0 : -1}
                    aria-hidden={!searchOpen}
                    className="flex-1 min-w-0 bg-transparent border-none outline-none py-2 font-sans text-sm text-foreground placeholder:text-muted-foreground/50"
                  />
                  <button
                    onClick={closeSearch}
                    tabIndex={searchOpen ? 0 : -1}
                    className="p-1 shrink-0 text-muted-foreground hover:text-foreground hover:rotate-90 transition-all duration-300 active:scale-90"
                    aria-label="Close search"
                  >
                    <X size={17} />
                  </button>
                </div>

                {/* Results — same width as the field, hanging under it */}
                {searchOpen && searchQuery.trim() !== '' && (
                  <div className="absolute left-0 right-0 top-full mt-3 bg-background border border-border rounded-lg shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="max-h-[70vh] overflow-y-auto px-3">
                      {searchResults.length > 0 ? (
                        <ul className="divide-y divide-border">
                          {searchResults.map((p) => (
                            <li key={p.id}>
                              <Link
                                to="/product/$id"
                                params={{ id: p.id }}
                                onClick={closeSearch}
                                className="group flex items-center gap-3 py-2.5"
                              >
                                <div className="w-11 h-11 shrink-0 bg-white border border-border overflow-hidden">
                                  <img
                                    src={p.image}
                                    alt={p.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-sans text-[8px] tracking-widest uppercase text-muted-foreground">
                                    {p.subcategory || p.category.replace(/-/g, ' ')}
                                  </p>
                                  <h4 className="font-serif text-[13px] font-semibold text-foreground truncate group-hover:text-accent transition-colors">
                                    {p.name}
                                  </h4>
                                </div>
                                <p className="font-sans text-xs font-medium text-foreground shrink-0">
                                  ${p.price.toFixed(2)}
                                </p>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="font-sans text-xs text-muted-foreground py-3">
                          No results found for "{searchQuery}"
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Icons */}
              <div className="flex items-center gap-1 shrink-0 pr-1.5">
                <button
                  onClick={() => {
                    setActiveMega(null);
                    setSearchOpen(true);
                  }}
                  tabIndex={searchOpen ? -1 : 0}
                  aria-label="Search"
                  className={`text-foreground hover:text-accent overflow-hidden transition-all duration-300 active:scale-90 ${
                    searchOpen ? 'w-0 p-0 opacity-0 scale-75 pointer-events-none' : 'w-9 p-2 opacity-100 scale-100'
                  }`}
                >
                  <Search size={20} />
                </button>

                {/* Account — now on every screen, not just lg. It was the only icon
                    missing on mobile while wishlist and bag were both there, so the
                    account was reachable solely through the hamburger. */}
                <div className="relative" ref={accountRef}>
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        navigate({ to: '/login' });
                        return;
                      }
                      // A hover dropdown is wrong on touch, so below lg the icon goes
                      // straight to the account page instead of opening the menu.
                      if (window.matchMedia('(min-width: 1024px)').matches) {
                        setAccountOpen(!accountOpen);
                      } else {
                        navigate({ to: '/account' });
                      }
                    }}
                    className={iconBtnClass}
                    aria-label={isAuthenticated ? 'Account' : 'Sign in'}
                  >
                    <User size={20} />
                  </button>

                  {/* Account Dropdown — desktop only. It can only be opened above lg,
                      but this also covers resizing down while it is open. */}
                  {accountOpen && isAuthenticated && (
                    <div className="hidden lg:block absolute right-0 top-full mt-2 w-56 bg-background border border-border rounded-lg shadow-lg z-50">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="font-sans text-sm font-medium text-foreground truncate">
                          {user?.displayName || 'Member'}
                        </p>
                        <p className="font-sans text-xs text-muted-foreground truncate">
                          {user?.email}
                        </p>
                      </div>
                      <ul className="py-1">
                        {accountMenu.map((item) => (
                          <li key={item.to}>
                            <Link
                              to={item.to}
                              onClick={() => setAccountOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 font-sans text-sm text-foreground hover:bg-muted transition-colors"
                            >
                              {item.icon}
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => {
                          setAccountOpen(false);
                          signOut();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-3 font-sans text-sm text-foreground hover:bg-muted transition-colors border-t border-border"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>

                <Link
                  to="/wishlist"
                  className={iconBtnClass}
                  aria-label="Wishlist"
                >
                  <Heart size={20} />
                  {wishlistCount > 0 && (
                    <span className="cart-badge">{wishlistCount > 9 ? '9+' : wishlistCount}</span>
                  )}
                </Link>

                <button
                  onClick={toggleCart}
                  className={iconBtnClass}
                  aria-label="Cart"
                >
                  <ShoppingBag size={20} />
                  {itemCount > 0 && (
                    <span className="cart-badge">{itemCount > 9 ? '9+' : itemCount}</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mega Menu */}
          {mega && (
            <div
              className="mega-menu absolute top-full left-0 right-0 bg-background border-t border-b border-border shadow-xl z-20"
              onMouseLeave={() => setActiveMega(null)}
            >
              <div className="max-w-screen-xl mx-auto px-8 py-10 flex justify-between gap-12">
                <div>
                  {/* Columns are a fixed width rather than equal fractions of the
                      row: the grid was hard-coded to three tracks while most menus
                      have two, so the unused track opened a gap that read as a
                      missing column and stretched the rest far wider than their
                      labels needed. */}
                  <div className="flex gap-12">
                    {mega.columns.map((col) => (
                      <div key={col.heading} className="w-52 shrink-0">
                        <p className="font-sans text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-3 pb-2 border-b border-border">
                          {col.heading}
                        </p>
                        <ul className="space-y-2">
                          {col.links.map((link) => {
                            const isExternal = link.href.startsWith('http');
                            return (
                            <li key={link.label}>
                              {isExternal ? (
                                <a
                                  href={link.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => setActiveMega(null)}
                                  className="font-sans text-sm text-foreground hover:text-accent transition-colors duration-150 gold-underline-hover inline-block"
                                >
                                  {link.label}
                                </a>
                              ) : (
                                <Link
                                  to={link.href as any}
                                  onClick={() => setActiveMega(null)}
                                  className="font-sans text-sm text-foreground hover:text-accent transition-colors duration-150 gold-underline-hover inline-block"
                                >
                                  {link.label}
                                </Link>
                              )}
                            </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Sits under the columns, not in them, so it reads as the way
                      out of the menu rather than one more product. */}
                  {mega.shopAll && (
                    <Link
                      to={mega.shopAll.href as any}
                      onClick={() => setActiveMega(null)}
                      className="group inline-flex items-center gap-2 mt-8 pt-5 border-t border-border font-sans text-[11px] font-semibold tracking-widest uppercase text-foreground hover:text-accent transition-colors"
                    >
                      {mega.shopAll.label}
                      <span aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-1">
                        &rarr;
                      </span>
                    </Link>
                  )}
                </div>

                {/* Feature Image */}
                <div className="w-52 shrink-0">
                  <div className="aspect-[3/4] overflow-hidden bg-muted">
                    <img
                      src={mega.image}
                      alt={mega.imageCaption}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="font-sans text-xs text-muted-foreground mt-2">
                    {mega.imageCaption}
                  </p>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Mobile Menu Overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 bg-background z-50 flex flex-col lg:hidden">
            {/* Mobile Header */}
            <div className="flex items-center justify-between px-4 h-16 border-b border-border shrink-0">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="font-serif font-bold tracking-[0.22em] text-[20px] text-foreground"
              >
                DOMINUS GOLF
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-foreground"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Mobile Links */}
            <div className="flex-1 overflow-y-auto py-4">
              {navLinks.map((link) => (
                <div key={link.label} className="border-b border-border">
                  {link.key ? (
                    <>
                      <button
                        onClick={() =>
                          setMobileAccordion(
                            mobileAccordion === link.label ? null : link.label,
                          )
                        }
                        className="flex items-center justify-between w-full px-6 py-4 font-sans font-medium text-foreground text-sm tracking-wide"
                      >
                        {link.label}
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-200 ${
                            mobileAccordion === link.label ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {mobileAccordion === link.label && (
                        <div className="px-6 pb-4 space-y-3 bg-muted/50">
                          {megaMenuData[link.key]?.columns.map((col) => (
                            <div key={col.heading}>
                              <p className="font-sans text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mt-3 mb-1">
                                {col.heading}
                              </p>
                              {col.links.map((l) => {
                                const isExternal = l.href.startsWith('http');
                                return isExternal ? (
                                  <a
                                    key={l.label}
                                    href={l.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setMobileOpen(false)}
                                    className="block py-1.5 font-sans text-sm text-foreground hover:text-accent transition-colors"
                                  >
                                    {l.label}
                                  </a>
                                ) : (
                                  <Link
                                    key={l.label}
                                    to={l.href as any}
                                    onClick={() => setMobileOpen(false)}
                                    className="block py-1.5 font-sans text-sm text-foreground hover:text-accent transition-colors"
                                  >
                                    {l.label}
                                  </Link>
                                );
                              })}
                            </div>
                          ))}
                          {/* Mirrors the desktop footer link. Without it the
                              catch-all would be missing on mobile entirely, since
                              it no longer lives inside a column. */}
                          {megaMenuData[link.key]?.shopAll && (
                            <Link
                              to={megaMenuData[link.key]!.shopAll!.href as any}
                              onClick={() => setMobileOpen(false)}
                              className="flex items-center gap-2 mt-4 pt-4 border-t border-border font-sans text-[11px] font-semibold tracking-widest uppercase text-foreground"
                            >
                              {megaMenuData[link.key]!.shopAll!.label}
                              <span aria-hidden="true">&rarr;</span>
                            </Link>
                          )}
                        </div>
                      )}
                    </>
                  ) : link.href?.startsWith('http') ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileOpen(false)}
                      className="block px-6 py-4 font-sans font-medium text-foreground text-sm tracking-wide hover:text-accent transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.href ?? '/'}
                      onClick={() => setMobileOpen(false)}
                      className="block px-6 py-4 font-sans font-medium text-foreground text-sm tracking-wide hover:text-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}

            </div>

            {/* The account block and the Search / Account / Saved / Bag row that
                used to sit here are both gone: the account icon is on the main bar
                at every width now, so this menu holds shop navigation only. */}
          </div>
        )}
      </header>
    </>
  );
}