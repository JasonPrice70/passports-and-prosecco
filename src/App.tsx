import { useEffect, useRef, useState } from 'react'
import {
  motion, useInView,
  AnimatePresence,
} from 'framer-motion'
import './App.css'

// ─── Images (all verified) ──────────────────────────────────────────────────
const B = 'https://images.unsplash.com/photo-'
const IMG = {
  hero:     `${B}1609971757431-439cf7b4141b`,  // Eiffel Tower at golden hour (used in photo strip)
  paris:    `${B}1499856871958-5b9627545d1a`,  // Paris bridge at dusk
  bungalow: `${B}1544550581-5f7ceaf7f992`,     // Maldives overwater bungalows
  dock:     `${B}1476514525535-07fb3b4ae5f1`,  // Wooden dock, lake, mountains
  venice:   `${B}1523906834658-6e24ef2386f9`,  // Venice canal
  amalfi:   `${B}1516483638261-f4dbaf036963`,  // Amalfi coast village
  food:     `${B}1414235077428-338989a2e8c0`,  // Fine dining
  salmon:   `${B}1567620905732-2d1ec7ab7445`,  // Plated dish
  spread:   `${B}1504674900247-0877df9cc836`,  // Food spread
  cocktail: `${B}1551024709-8f23befc6f87`,     // Cocktail
  travel:   `${B}1539635278303-d4002c07eae3`,  // Luggage on cobblestones
  rome:     `${B}1552832230-c0197dd311b5`,     // Colosseum, Rome
  kyoto:    `${B}1528360983277-13d401cdc186`,  // Japan alleyway
  santorini:`${B}1507525428034-b723cf961d3e`,  // Santorini beach
} as const

function src(id: string, w = 1200, q = 82) {
  return `${id}?auto=format&fit=crop&w=${w}&q=${q}`
}

// ─── Framer Motion helpers ──────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
function useReveal(amount = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount })
  return { ref, inView }
}

// ─── Brand Badge SVG ────────────────────────────────────────────────────────
function BrandBadge() {
  return (
    <svg viewBox="0 0 200 200" aria-label="Passports & Prosecco brand seal" role="img">
      <circle cx="100" cy="100" r="94" fill="none" stroke="oklch(79% 0.13 85)" strokeWidth="1.5"/>
      <circle cx="100" cy="100" r="76" fill="none" stroke="oklch(79% 0.13 85)" strokeWidth="0.75"/>
      <path id="top-arc" d="M 20 100 A 80 80 0 0 1 180 100" fill="none"/>
      <text fontSize="9.5" fill="oklch(79% 0.13 85)" letterSpacing="3" fontFamily="Cinzel, serif" textAnchor="middle">
        <textPath href="#top-arc" startOffset="50%">PASSPORTS &amp; PROSECCO</textPath>
      </text>
      {/* Champagne glasses */}
      <g stroke="oklch(79% 0.13 85)" strokeWidth="1.5" fill="none" transform="translate(79, 88)">
        <path d="M10 0 L7 14 L5 14 L10 0z"/>
        <path d="M32 0 L35 14 L37 14 L32 0z"/>
        <line x1="10" y1="14" x2="10" y2="26"/>
        <line x1="32" y1="14" x2="32" y2="26"/>
        <line x1="6" y1="26" x2="14" y2="26"/>
        <line x1="28" y1="26" x2="36" y2="26"/>
        <line x1="10" y1="19" x2="32" y2="19"/>
        <path d="M17 0 l4 3 l4-3" strokeLinecap="round"/>
      </g>
      <path id="bottom-arc" d="M 22 100 A 78 78 0 0 0 178 100" fill="none"/>
      <text fontSize="7.5" fill="oklch(79% 0.13 85)" letterSpacing="2.5" fontFamily="Cinzel, serif" textAnchor="middle">
        <textPath href="#bottom-arc" startOffset="50%">KEEP YOUR PINKY UP, DARLING.</textPath>
      </text>
      <circle cx="21" cy="100" r="2" fill="oklch(79% 0.13 85)"/>
      <circle cx="179" cy="100" r="2" fill="oklch(79% 0.13 85)"/>
    </svg>
  )
}

// ─── Brand Logo Decoration SVG ───────────────────────────────────────────────
// ─── Stat Icons ──────────────────────────────────────────────────────────────
const GlobeIcon = () => (
  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3.6 9h16.8M3.6 15h16.8"/><path d="M12 3c-2.5 3-3.5 5.5-3.5 9s1 6 3.5 9"/><path d="M12 3c2.5 3 3.5 5.5 3.5 9s-1 6-3.5 9"/></svg>
)
const ClocheIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M3 13c0-5 4-9 9-9s9 4 9 9"/><rect x="2" y="13" width="20" height="2" rx="1"/><line x1="12" y1="4" x2="12" y2="2"/></svg>
)
const LuggageIcon = () => (
  <svg viewBox="0 0 24 24"><rect x="5" y="8" width="14" height="13" rx="1.5"/><path d="M9 8V5.5A1.5 1.5 0 0110.5 4h3A1.5 1.5 0 0115 5.5V8"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>
)
const GlassesIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M8 4l-2 8h4L8 4z"/><path d="M16 4l2 8h-4l2-8z"/><line x1="8" y1="12" x2="8" y2="20"/><line x1="16" y1="12" x2="16" y2="20"/><line x1="5" y1="20" x2="11" y2="20"/><line x1="13" y1="20" x2="19" y2="20"/><line x1="8" y1="16" x2="16" y2="16"/></svg>
)
// ─── Nav ────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 64)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const close = () => setOpen(false)

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner">
        <a href="#" className="nav__logo" aria-label="Passports & Prosecco">
          <span className="nav__logo-passports">Passports</span>
          <span className="nav__logo-amp">&amp;</span>
          <span className="nav__logo-prosecco">Prosecco</span>
        </a>

        <nav className="nav__links" aria-label="Primary">
          <a href="#about">Our Story</a>
          <a href="#destinations">Destinations</a>
          <a href="#food">Food &amp; Drink</a>
          <a href="#stories">Travel Guides</a>
          <a href="#stories">Blog</a>
          <a href="#work-with-us">Contact</a>
        </nav>

        <div className="nav__social">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="2" y="2" width="20" height="20" rx="5"/>
              <circle cx="12" cy="12" r="5"/>
              <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/>
            </svg>
          </a>
          <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 2C6.5 2 2 6.5 2 12c0 4.2 2.6 7.8 6.3 9.3-.1-.8-.2-2.1 0-3l1.4-5.8s-.4-.7-.4-1.7c0-1.6.9-2.8 2.3-2.8 1.1 0 1.6.8 1.6 1.8 0 1.1-.7 2.7-1 4.1-.3 1.2.6 2.1 1.7 2.1 2 0 3.4-2.1 3.4-5.1 0-2.7-1.9-4.6-4.6-4.6-3.1 0-4.9 2.3-4.9 4.7 0 .9.4 1.9.8 2.4.1.1.1.3.1.4l-.3 1.2c-.1.4-.3.5-.7.3-1.6-.7-2.5-3-2.5-4.8 0-3.9 2.8-7.4 8.1-7.4 4.3 0 7.6 3 7.6 7 0 4.2-2.6 7.5-6.3 7.5-1.2 0-2.4-.6-2.8-1.4l-.7 2.8c-.3 1-.9 2.1-1.4 2.9.9.3 1.9.5 2.9.5 5.5 0 10-4.5 10-10S17.5 2 12 2z"/>
            </svg>
          </a>
        </div>

        <button
          className={`nav__hamburger ${open ? 'nav__hamburger--open' : ''}`}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          <span /><span /><span />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div className="nav__mobile"
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}
          >
            <a href="#about"        onClick={close}>Our Story</a>
            <a href="#destinations" onClick={close}>Destinations</a>
            <a href="#food"         onClick={close}>Food &amp; Drink</a>
            <a href="#stories"      onClick={close}>Travel Guides</a>
            <a href="#stories"      onClick={close}>Blog</a>
            <a href="#work-with-us" onClick={close}>Contact</a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

// ─── Hero (split layout matching mockup) ────────────────────────────────────
function Hero() {
  const { ref, inView } = useReveal(0.05)

  return (
    <section className="hero-main" aria-label="Welcome to Passports & Prosecco">
      {/* ── Left: Brand text ── */}
      <div className="hero-main__left" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.1 }}
        >
          <img
            src="/passportprosecco.svg"
            alt="Passports & Prosecco"
            className="hero-logo-img"
            width={600}
            height={500}
          />
        </motion.div>

        <motion.p
          className="hero-main__tagline"
          initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.45, duration: 0.6 }}
        >
          We quit our jobs. Sold our house.<br />
          Now we live our dreams abroad.
        </motion.p>

        <motion.div
          className="hero-main__stats"
          initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger}
        >
          <motion.div className="hero-stat" variants={fadeUp}>
            <div className="hero-stat__icon"><GlobeIcon /></div>
            <div className="hero-stat__divider" />
            <div className="hero-stat__text">
              <span>42 Countries</span><span>&amp; Counting</span>
            </div>
          </motion.div>
          <motion.div className="hero-stat" variants={fadeUp}>
            <div className="hero-stat__icon"><ClocheIcon /></div>
            <div className="hero-stat__divider" />
            <div className="hero-stat__text">
              <span>Extraordinary</span><span>Food</span>
            </div>
          </motion.div>
          <motion.div className="hero-stat" variants={fadeUp}>
            <div className="hero-stat__icon"><LuggageIcon /></div>
            <div className="hero-stat__divider" />
            <div className="hero-stat__text">
              <span>Luxury Stays</span><span>&amp; Balcony Views</span>
            </div>
          </motion.div>
          <motion.div className="hero-stat" variants={fadeUp}>
            <div className="hero-stat__icon"><GlassesIcon /></div>
            <div className="hero-stat__divider" />
            <div className="hero-stat__text">
              <span>Every Trip Ends</span><span>With a Pinky Up</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.p
          className="hero-main__location"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9, duration: 0.7 }}
        >
          ♥ From Palm Beach County ♥
        </motion.p>
      </div>

      {/* ── Right: Couple photo ── */}
      <div className="hero-main__right">
        <img
          src="/herov2.jpeg"
          alt="Debbi and Jason raising champagne glasses toward a golden Mediterranean sunset from their hotel balcony"
          width={1200}
          height={900}
          fetchPriority="high"
        />
      </div>
    </section>
  )
}

// ─── Photo Strip ─────────────────────────────────────────────────────────────
const STRIP = [
  { id: IMG.kyoto,    alt: 'Japanese temple with red lanterns at dusk' },
  { id: IMG.bungalow, alt: 'Maldives overwater bungalows on turquoise water' },
  { id: IMG.hero,     alt: 'Eiffel Tower at golden hour between Haussmann buildings' },
  { id: IMG.salmon,   alt: 'Artfully plated course at a fine restaurant' },
  { id: IMG.venice,   alt: 'Venice canal at golden hour' },
  { id: IMG.food,     alt: 'Fine dining table with candlelight' },
] as const

function PhotoStrip() {
  return (
    <section className="photo-strip" aria-label="Travel highlights">
      <div className="photo-strip__photos">
        {STRIP.map(({ id, alt }) => (
          <div key={id} className="photo-strip__item">
            <img
              src={`${id}?auto=format&fit=crop&w=400&h=240&q=80`}
              alt={alt} loading="lazy" width={400} height={240}
            />
          </div>
        ))}
      </div>
      <div className="photo-strip__pinky" aria-hidden="true">
        <p className="photo-strip__pinky-text">Keep your<br />Pinky Up,<br />Darling.</p>
        <div className="photo-strip__pinky-glass"><GlassesIcon /></div>
        <span className="photo-strip__pinky-heart">♥</span>
      </div>
    </section>
  )
}

// ─── Tagline Bar ──────────────────────────────────────────────────────────────
function TaglineBar() {
  return (
    <div className="tagline-bar">
      <p>♥ &nbsp; Collect Stamps &nbsp;·&nbsp; Raise Glasses &nbsp;·&nbsp; Create Memories &nbsp;·&nbsp; Live the Story &nbsp; ♥</p>
    </div>
  )
}

// ─── About ───────────────────────────────────────────────────────────────────
function About() {
  const { ref, inView } = useReveal()
  return (
    <section id="about" className="about">
      <div className="container" ref={ref}>
        <div className="about__inner">
          <motion.div
            className="collage"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            aria-hidden="true"
          >
            <figure className="polaroid polaroid--1">
              <img src={src(IMG.dock, 400, 80)} alt="" loading="lazy" />
            </figure>
            <figure className="polaroid polaroid--2">
              <img src={src(IMG.food, 400, 80)} alt="" loading="lazy" />
            </figure>
            <figure className="polaroid polaroid--3">
              <img src={src(IMG.venice, 400, 80)} alt="" loading="lazy" />
            </figure>
            <figure className="polaroid polaroid--4">
              <img src={src(IMG.amalfi, 350, 75)} alt="" loading="lazy" />
            </figure>
            <div className="collage__heart" aria-hidden="true">♥</div>
          </motion.div>

          <motion.div
            className="about__text"
            initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger}
          >
            <motion.span className="section-kicker" variants={fadeUp}>Our Story</motion.span>
            <motion.h2 className="about__heading" variants={fadeUp}>
              We're not just collecting stamps,
              <span className="script-inline">we're making memories ♥</span>
            </motion.h2>
            <motion.p className="about__body" variants={fadeUp}>
              After decades of hard work and big dreams, we made the ultimate decision — to leave it all behind. From Palm Beach to hidden gems, from Michelin stars to little cafes, we're here to inspire you to chase your dreams and savor every moment.
            </motion.p>
            <motion.p className="about__body" variants={fadeUp}>
              This is our story. Told one passport stamp, one raised glass, one unforgettable meal at a time.
            </motion.p>
            <motion.div variants={fadeUp}>
              <a href="#destinations" className="btn btn--pink about__cta">Read Our Story →</a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── Destinations ────────────────────────────────────────────────────────────
const DESTINATIONS = [
  { img: IMG.amalfi,    name: 'Amalfi Coast', country: 'Italy',  sub: 'Cliffs, limoncello & la dolce vita' },
  { img: IMG.kyoto,     name: 'Kyoto',        country: 'Japan',  sub: 'Temples, cherry blossoms & stillness' },
  { img: IMG.rome,      name: 'Roma Roma',    country: 'Italy',  sub: 'Ancient streets & trattoria dinners' },
  { img: IMG.santorini, name: 'Santorini',    country: 'Greece', sub: 'Blue domes, wine & sunset views' },
  { img: IMG.paris,     name: 'Paris',        country: 'France', sub: 'Romance is always on the menu' },
] as const

function Destinations() {
  const { ref, inView } = useReveal()
  return (
    <section id="destinations" className="destinations">
      <div className="destinations__header container" ref={ref}>
        <motion.span
          className="section-kicker"
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', display: 'block' }}
        >
          Featured Destinations
        </motion.span>
        <motion.h2
          className="destinations__title"
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ textAlign: 'center' }}
        >
          Places We <span className="script">Love</span>
        </motion.h2>
      </div>

      <motion.div
        className="destinations__grid"
        initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger}
      >
        {DESTINATIONS.map(dest => (
          <motion.a key={dest.name} href="#" className="dest-card" variants={fadeUp}>
            <img
              className="dest-card__img"
              src={src(dest.img, 600, 80)}
              alt={`${dest.name}, ${dest.country}`}
              loading="lazy" width={600} height={800}
            />
            <div className="dest-card__overlay" aria-hidden="true" />
            <div className="dest-card__info">
              <p className="dest-card__name">{dest.name}, {dest.country}</p>
              <p className="dest-card__sub">{dest.sub}</p>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </section>
  )
}

// ─── Newsletter ───────────────────────────────────────────────────────────────
function Newsletter() {
  const { ref, inView } = useReveal()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <section id="newsletter" className="newsletter">
      <div className="newsletter__inner" ref={ref}>
        <motion.div
          className="newsletter__photo"
          initial={{ opacity: 0, x: -24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <img src={src(IMG.travel, 800, 82)} alt="Luxury monogrammed luggage on sunlit cobblestone in a European city" loading="lazy" width={800} height={1000} />
          <div className="newsletter__photo-overlay" aria-hidden="true" />
        </motion.div>

        <motion.div
          className="newsletter__right"
          initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger}
        >
          <motion.span className="section-kicker" variants={fadeUp} style={{ color: 'var(--gold-muted)' }}>
            Join Our Travel List
          </motion.span>
          <motion.h2 className="newsletter__heading" variants={fadeUp}>
            Get our favorite finds, travel tips &amp; behind-the-scenes moments straight to your inbox.
          </motion.h2>
          <motion.p className="newsletter__sub" variants={fadeUp}>
            Destination guides, hidden restaurants, packing secrets, and dispatches from wherever our pinky is raised this week.
          </motion.p>

          {submitted ? (
            <p className="newsletter__success">You're in, darling. ♥ Keep an eye on your inbox.</p>
          ) : (
            <motion.form
              className="newsletter__form"
              variants={fadeUp}
              onSubmit={e => { e.preventDefault(); if (email.trim()) setSubmitted(true) }}
            >
              <label htmlFor="nl-email" className="sr-only">Email address</label>
              <input
                id="nl-email" className="newsletter__input"
                type="email" placeholder="your@email.com"
                value={email} onChange={e => setEmail(e.target.value)}
                required autoComplete="email"
              />
              <button type="submit" className="btn btn--pink">Subscribe →</button>
            </motion.form>
          )}

          <motion.div className="newsletter__badge" variants={fadeUp}>
            <BrandBadge />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Instagram ────────────────────────────────────────────────────────────────
const IG = [
  { img: IMG.hero,     alt: 'Paris bridge glowing at dusk' },
  { img: IMG.amalfi,   alt: 'Amalfi coast village at midday' },
  { img: IMG.food,     alt: 'Fine dining plate under candlelight' },
  { img: IMG.salmon,   alt: 'Michelin-starred plated course' },
  { img: IMG.venice,   alt: 'Venice canal at golden hour' },
  { img: IMG.cocktail, alt: 'Elegant garnished cocktail' },
] as const

function Instagram() {
  const { ref, inView } = useReveal()
  return (
    <section className="instagram">
      <motion.div
        className="instagram__header container"
        ref={ref}
        initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger}
      >
        <motion.div className="instagram__handle" variants={fadeUp}>
          @passportsandprosecco <span>♥</span>
        </motion.div>
        <motion.p className="instagram__sub" variants={fadeUp}>Follow along on Instagram</motion.p>
      </motion.div>

      <motion.div
        className="instagram__grid"
        initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger}
      >
        {IG.map(({ img, alt }) => (
          <motion.a
            key={img} href="https://instagram.com" target="_blank" rel="noopener noreferrer"
            className="instagram__item" variants={fadeUp}
          >
            <img src={src(img, 500, 75)} alt={alt} loading="lazy" width={500} height={500} />
            <div className="instagram__hover" aria-hidden="true">
              <span>♥ Follow</span>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="footer__main">
        <div className="footer__brand">
          <div className="footer__logo">
            <p className="footer__logo-passports">Passports</p>
            <p className="footer__logo-amp">&amp;</p>
            <p className="footer__logo-prosecco">Prosecco</p>
          </div>
          <p className="footer__tagline">Keep your pinky up, darling. ♥</p>
          <div className="footer__social">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
              <svg viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12c0 4.2 2.6 7.8 6.3 9.3 0-.8-.2-2.1 0-3l1.4-5.8s-.4-.7-.4-1.7c0-1.6.9-2.8 2.3-2.8 1.1 0 1.6.8 1.6 1.8 0 1.1-.7 2.7-1 4.1-.3 1.2.6 2.1 1.7 2.1 2 0 3.4-2.1 3.4-5.1 0-2.7-1.9-4.6-4.6-4.6-3.1 0-4.9 2.3-4.9 4.7 0 .9.4 1.9.8 2.4.1.1.1.3.1.4l-.3 1.2c-.1.4-.3.5-.7.3-1.6-.7-2.5-3-2.5-4.8 0-3.9 2.8-7.4 8.1-7.4 4.3 0 7.6 3 7.6 7 0 4.2-2.6 7.5-6.3 7.5-1.2 0-2.4-.6-2.8-1.4l-.7 2.8c-.3 1-.9 2.1-1.4 2.9.9.3 1.9.5 2.9.5 5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>
            </a>
            <a href="mailto:hello@passportsandprosecco.com" aria-label="Email">
              <svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>
            </a>
          </div>
        </div>

        <div className="footer__nav-col">
          <p className="footer__nav-heading">Explore</p>
          <a href="#destinations">Travel Essentials</a>
          <a href="#destinations">Destinations</a>
          <a href="#destinations">Experiences</a>
          <a href="#stories">Guides &amp; Tips</a>
          <a href="#food">Food &amp; Dining</a>
        </div>

        <div className="footer__nav-col">
          <p className="footer__nav-heading">Company</p>
          <a href="#about">About Us</a>
          <a href="#work-with-us">Work With Us</a>
          <a href="#stories">Blog</a>
          <a href="#newsletter">Newsletter</a>
          <a href="mailto:hello@passportsandprosecco.com">Contact</a>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} Passports &amp; Prosecco. We are making memories.</p>
        <p>Keep your pinky up, darling.</p>
      </div>
    </footer>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <PhotoStrip />
        <TaglineBar />
        <About />
        <Destinations />
        <Newsletter />
        <Instagram />
      </main>
      <Footer />
    </>
  )
}
