import { useEffect } from 'react';
import { Link } from '@tanstack/react-router';

const footerLinks = {
  'Training Systems': [
    { label: 'Tour Pure Men', href: '/product/tour-pure-men' },
    { label: 'Tour Pure Women', href: '/product/tour-pure-women' },
    { label: 'Tour Pure Jr', href: '/product/tour-pure-jr' },
    { label: 'Shop All Systems', href: '/shop/training-system' },
  ],
  'Apparel': [
    { label: "Men's Tees", href: '/shop/apparel' },
    { label: "Women's Tees", href: '/shop/apparel' },
    { label: 'Shop All Apparel', href: '/shop/apparel' },
  ],
  'Accessories': [
    { label: 'Feel Right Band', href: '/product/feel-right-band' },
    { label: 'Dominus Golf Towel', href: '/product/dominus-towel' },
    { label: 'The Ultimate Guide (Book)', href: '/product/mastering-the-game-book' },
    { label: 'Shop All Accessories', href: '/shop/accessories' },
  ],
  Company: [
    { label: 'About Dominus Golf', href: '/about' },
    { label: 'Team Dominus Golf', href: '/about/team' },
    { label: 'Contact Us', href: '/about/contact' },
    { label: 'Careers', href: '/about/careers' },
    { label: 'Development Grant', href: 'https://42sajz.share-na2.hsforms.com/2CE8-nDHaRwCmkVkulHz0tw' },
    { label: 'Sustainability', href: '/about/sustainability' },
  ],
  Legal: [
    { label: 'Safety Disclaimer', href: '/safety-disclaimer' },
    { label: 'Shipping Policy', href: '/shipping-policy' },
    { label: 'Terms & Conditions', href: '/terms' },
  ],
};

// Simple SVG social icons
function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
    </svg>
  );
}

function TwitterXIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Links Grid */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-12">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-sans text-[10px] font-semibold tracking-[0.3em] uppercase text-white mb-5">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href as any}
                      className="font-sans text-sm text-white/60 hover:text-white transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Brand Statement */}
        <div className="mt-14 pt-10 border-t border-white/10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            {/* Logo + tagline */}
            <div>
              <div className="font-serif font-bold tracking-[0.22em] text-xl text-white mb-2">
                DOMINUS GOLF
              </div>
              <p className="font-sans text-xs text-white/40 max-w-xs leading-relaxed">
                Dominus Golf — premium equipment engineered for serious players. The #1 choice on Tour.
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {[
                { icon: <FacebookIcon />, label: 'Facebook', href: 'https://www.facebook.com/DominusGolf' },
                { icon: <InstagramIcon />, label: 'Instagram', href: 'https://www.instagram.com/dominus_golf/' },
                { icon: <YoutubeIcon />, label: 'YouTube', href: 'https://www.youtube.com/@DominusGolf' },
                { icon: <TwitterXIcon />, label: 'X / Twitter', href: 'https://x.com/GolfDominus' },
              ].map((social) =>
                social.href ? (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-9 h-9 flex items-center justify-center border border-white/20 text-white/60 hover:text-white hover:border-white transition-colors duration-150"
                  >
                    {social.icon}
                  </a>
                ) : (
                  <button
                    key={social.label}
                    aria-label={social.label}
                    className="w-9 h-9 flex items-center justify-center border border-white/20 text-white/60 hover:text-white hover:border-white transition-colors duration-150"
                  >
                    {social.icon}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-sans text-[11px] text-white/40">
              &copy; 2026 Dominus Golf. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              {['Privacy Policy', 'Terms of Use', 'Cookie Settings'].map((item) => (
                <button
                  key={item}
                  className="font-sans text-[11px] text-white/40 hover:text-white/70 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
