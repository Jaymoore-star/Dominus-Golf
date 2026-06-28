import { useState, useRef, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import {
  Search,
  User,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { useCart } from '../../store/cartStore';
import { SearchOverlay } from './SearchOverlay';

type MegaMenuKey = 'training' | 'guide' | 'apparel' | 'accessories' | 'pros' | 'company' | null;

const megaMenuData = {
  training: {
    columns: [
      {
        heading: 'Training Systems',
        links: [
          { label: 'Tour Pure Men', href: '/product/tour-pure-men' },
          { label: 'Tour Pure Women', href: '/product/tour-pure-women' },
          { label: 'Tour Pure Jr', href: '/product/tour-pure-jr' },
          { label: 'All Training Systems', href: '/shop/training-system' },
        ],
      },
      {
        heading: 'Shop All',
        links: [{ label: 'View All Products', href: '/shop/training-system' }],
      },
    ],
    image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FPhotoroom-20251125_1425462241__e480e1c6.png?alt=media&token=7c96a611-0b70-415f-a7f7-8bebe5a974a2',
    imageCaption: 'Tour Pure — Build Your Best Swing',
  },
  apparel: {
    columns: [
      {
        heading: "Men's Tees",
        links: [
          { label: "Icon Tee — White (Men's)", href: '/product/dominus-tee-icon-white' },
          { label: "Wordmark Tee — White (Men's)", href: '/product/dominus-tee-wordmark-white' },
          { label: "Performance Tee — Black (Men's)", href: '/product/dominus-tee-performance-black' },
          { label: "Performance Tee — White (Men's)", href: '/product/dominus-tee-performance-white' },
        ],
      },
      {
        heading: "Women's Tees",
        links: [
          { label: "Icon Tee — Black (Women's)", href: '/product/dominus-womens-tee-black-icon' },
          { label: "Icon Tee — White (Women's)", href: '/product/dominus-womens-tee-white-icon' },
          { label: "Performance Tee — Black (Women's)", href: '/product/dominus-womens-tee-black-performance' },
          { label: 'Shop All Apparel', href: '/shop/apparel' },
        ],
      },
    ],
    image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2Funnamed-11__fc5a40f7.jpg?alt=media&token=87722e6d-11e3-4e1b-a6b4-7e84ebce8990',
    imageCaption: 'Dominus Golf Apparel',
  },
  accessories: {
    columns: [
      {
        heading: 'Training Aids',
        links: [
          { label: 'Feel Right Band', href: '/product/feel-right-band' },
        ],
      },
      {
        heading: 'Gear & Education',
        links: [
          { label: 'Dominus Golf Towel', href: '/product/dominus-towel' },
          { label: 'The Ultimate Guide (Book)', href: '/product/mastering-the-game-book' },
          { label: 'Shop All Accessories', href: '/shop/accessories' },
        ],
      },
    ],
    image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FScreenshot_20260324_042207_SamsungInternet__2f2a1710.jpg?alt=media&token=4e6db837-c08e-4745-b0c4-9d9e5d607413',
    imageCaption: 'Dominus Golf Accessories',
  },
  company: {
    columns: [
      {
        heading: 'Company',
        links: [
          { label: 'About Dominus Golf', href: '/about' },
          { label: 'Team Dominus Golf', href: '/about/team' },
          { label: 'Contact Us', href: '/about/contact' },
          { label: 'Careers', href: '/about/careers' },
          { label: 'Development Grant', href: 'https://42sajz.share-na2.hsforms.com/2CE8-nDHaRwCmkVkulHz0tw' },
          { label: 'Sustainability', href: '/about/sustainability' },
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
    image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FPhotoroom-20251125_1425462241__e480e1c6.png?alt=media&token=7c96a611-0b70-415f-a7f7-8bebe5a974a2',
    imageCaption: 'Veteran-Owned. Coach-Led.',
  },
};

export function Navbar() {
  const { itemCount, toggleCart } = useCart();
  const [activeMega, setActiveMega] = useState<MegaMenuKey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const announcements = [
    { text: 'The Dominus Golf Development Grant is Now Open — $5,000 Awarded to One Golfer Nationwide. Apply by August 15.', link: 'https://share-na2.hsforms.com/084f3e9c-31da-4700-a691-592e947cf4b7', linkLabel: 'Apply Now' },
    { text: 'Free Shipping on Orders Over $150', link: null, linkLabel: null },
    { text: 'Shop New Training Systems — Build Your Best Swing', link: null, linkLabel: null },
  ];

  // Rotate announcements
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  // Close mega menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveMega(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const navLinks: { label: string; key: MegaMenuKey; href?: string }[] = [
    { label: 'Training Systems', key: 'training' },
    { label: 'Apparel', key: 'apparel' },
    { label: 'Accessories', key: 'accessories' },
    { label: 'Company', key: 'company' },
    { label: 'Development Grant', key: null, href: 'https://grant.dominusgolf.com/grant' },
  ];

  return (
    <>
      <header className="sticky top-0 z-30" ref={navRef}>
        {/* Announcement Bar */}
        <div className="bg-primary text-primary-foreground h-9 flex items-center justify-center relative overflow-hidden px-4">
          {announcements.map((item, i) => (
            <div
              key={i}
              className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out px-4 ${
                i === announcementIndex
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 -translate-y-4'
              }`}
            >
              <span className="font-sans text-[11px] font-medium tracking-widest uppercase text-accent text-center">
                {item.text}{' '}
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 hover:text-white transition-colors duration-200 font-bold"
                  >
                    {item.linkLabel}
                  </a>
                )}
              </span>
            </div>
          ))}
        </div>

        {/* Main Nav */}
        <nav className="bg-background border-b border-border">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Mobile hamburger */}
              <button
                className="lg:hidden p-2 text-foreground hover:text-accent transition-colors"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>

              {/* Wordmark */}
              <Link
                to="/"
                className="flex-shrink-0 font-serif font-bold tracking-[0.22em] text-[22px] text-foreground hover:text-accent transition-colors duration-200"
              >
                DOMINUS GOLF
              </Link>

              {/* Desktop Nav Links */}
              <div className="hidden lg:flex items-center gap-1">
                {navLinks.map((link) => (
                  <div key={link.label} className="relative">
                    {link.key ? (
                      <button
                        onMouseEnter={() => setActiveMega(link.key)}
                        onClick={() =>
                          setActiveMega(activeMega === link.key ? null : link.key)
                        }
                        className={`flex items-center gap-1 px-3 py-2 font-sans text-[13px] font-medium tracking-wide text-foreground hover:text-accent transition-colors duration-150 ${
                          activeMega === link.key ? 'text-accent' : ''
                        }`}
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
                        className="px-3 py-2 font-sans text-[13px] font-medium tracking-wide text-foreground hover:text-accent transition-colors duration-150"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href ?? '/'}
                        className="px-3 py-2 font-sans text-[13px] font-medium tracking-wide text-foreground hover:text-accent transition-colors duration-150"
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Right Icons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-foreground hover:text-accent transition-colors"
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>
                <button
                  className="p-2 text-foreground hover:text-accent transition-colors hidden lg:flex"
                  aria-label="Account"
                >
                  <User size={20} />
                </button>
                <button
                  onClick={toggleCart}
                  className="relative p-2 text-foreground hover:text-accent transition-colors"
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
          {activeMega && megaMenuData[activeMega] && (
            <div
              className="mega-menu absolute top-full left-0 right-0 bg-background border-t border-b border-border shadow-xl z-20"
              onMouseLeave={() => setActiveMega(null)}
            >
              <div className="max-w-screen-xl mx-auto px-8 py-10 grid grid-cols-[1fr_auto] gap-12">
                {/* Columns */}
                <div className="grid grid-cols-3 gap-8">
                  {megaMenuData[activeMega].columns.map((col) => (
                    <div key={col.heading}>
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

                {/* Feature Image */}
                <div className="w-52 shrink-0">
                  <div className="aspect-[3/4] overflow-hidden bg-muted">
                    <img
                      src={megaMenuData[activeMega].image}
                      alt={megaMenuData[activeMega].imageCaption}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="font-sans text-xs text-muted-foreground mt-2">
                    {megaMenuData[activeMega].imageCaption}
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

            {/* Mobile Footer Icons */}
            <div className="flex items-center justify-around px-6 py-5 border-t border-border shrink-0">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setSearchOpen(true);
                }}
                className="flex flex-col items-center gap-1 text-foreground"
              >
                <Search size={20} />
                <span className="font-sans text-[10px] tracking-widest uppercase">Search</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-foreground">
                <User size={20} />
                <span className="font-sans text-[10px] tracking-widest uppercase">Account</span>
              </button>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  toggleCart();
                }}
                className="relative flex flex-col items-center gap-1 text-foreground"
              >
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span className="cart-badge">{itemCount > 9 ? '9+' : itemCount}</span>
                )}
                <span className="font-sans text-[10px] tracking-widest uppercase">Bag</span>
              </button>
            </div>
          </div>
        )}
      </header>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}