import { useEffect, useRef, useState } from 'react'
import {
  motion, useInView,
  AnimatePresence,
} from 'framer-motion'
import './App.css'

// ─── Images ──────────────────────────────────────────────────────────────────
// Real travel photos (local)
const P = {
  northern_lights:  '/iceland-northern-lights.jpeg',
  paris_group:      '/paris-group.jpeg',
  paris_eiffel:     '/paris-eiffel-night.jpeg',
  paris_louvre:     '/paris-louvre.jpeg',
  rome_moonrise:    '/rome-moonrise.jpeg',
  rome_balcony:     '/rome-cavalieri-balcony.jpeg',
  santorini_arch:   '/santorini-blue-domes.jpeg',
  santorini_family: '/santorini-family.jpeg',
  athens:           '/athens-acropolis.jpeg',
  munich:           '/munich-hofbrauhaus.jpeg',
  munich_beer:      '/munich-beer-hall.jpeg',
  elegant_dining:   '/elegant-dining.jpeg',
  cruise:           '/cruise-formal.jpeg',
} as const

// Unsplash fallbacks for destinations without local photos yet
const B = 'https://images.unsplash.com/photo-'
const IMG = {
  amalfi:   `${B}1516483638261-f4dbaf036963`,  // Amalfi coast (no local photo yet)
  travel:   `${B}1539635278303-d4002c07eae3`,  // Newsletter photo
} as const

function src(id: string, w = 1200, q = 82) {
  return `${id}?auto=format&fit=crop&w=${w}&q=${q}`
}

// local photos don't need query params
function lsrc(path: string) { return path }

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
          <a href="https://instagram.com/passportsandproseccolife" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>
          </a>
          <a href="https://www.youtube.com/@PassportsandProseccoLife" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 001.95-1.97A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/></svg>
          </a>
          <a href="https://www.facebook.com/passportsandproseccolife" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
          </a>
          <a href="https://www.tiktok.com/@passportsandproseccolife" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 12a4 4 0 104 4V4a5 5 0 005 5"/></svg>
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
  { id: P.northern_lights,  alt: 'Jason and Debbi under the Northern Lights in Reykjavik, Iceland' },
  { id: P.santorini_arch,   alt: 'Blue domes and white buildings of Oia, Santorini' },
  { id: P.paris_eiffel,     alt: 'Jason and Debbi at the Eiffel Tower at night' },
  { id: P.rome_moonrise,    alt: 'Full moon rising over Rome at night' },
  { id: P.athens,           alt: 'The Acropolis of Athens glowing at night' },
  { id: P.munich,           alt: 'The family raising beer steins at the Hofbräuhaus Munich' },
] as const

function PhotoStrip() {
  return (
    <section className="photo-strip" aria-label="Travel highlights">
      <div className="photo-strip__photos">
        {STRIP.map(({ id, alt }) => (
          <div key={id} className="photo-strip__item">
            <img src={lsrc(id)} alt={alt} loading="lazy" />
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
              <img src={lsrc(P.paris_eiffel)} alt="Jason and Debbi at the Eiffel Tower at night in Paris" loading="lazy" />
            </figure>
            <figure className="polaroid polaroid--2">
              <img src={lsrc(P.northern_lights)} alt="Jason and Debbi under the Northern Lights in Iceland" loading="lazy" />
            </figure>
            <figure className="polaroid polaroid--3">
              <img src={lsrc(P.santorini_family)} alt="Family in front of the blue domes of Santorini" loading="lazy" />
            </figure>
            <figure className="polaroid polaroid--4">
              <img src={lsrc(P.munich)} alt="Family raising beer steins at Hofbräuhaus in Munich" loading="lazy" />
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
              We're Jason &amp; Debbi — a couple from Palm Beach County with a simple philosophy: life is too short for ordinary travel and mediocre wine. We still have careers. But every spare moment, every vacation day, every long weekend belongs to the road.
            </motion.p>
            <motion.p className="about__body" variants={fadeUp}>
              Italy stole our hearts. Switzerland took our breath away. Standing under the Northern Lights in Finland reminded us why we started this in the first place. And our ritual is non-negotiable — wherever we land, we find the balcony, order the prosecco, and watch the world go quiet.
            </motion.p>
            <motion.p className="about__body" variants={fadeUp}>
              This is us building toward the life we want — one passport stamp, one beautifully set table, one unforgettable view at a time.
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
  { img: P.paris_louvre,    name: 'Paris',        country: 'France',  sub: 'Three trips and we still can\'t get enough' },
  { img: P.rome_moonrise,   name: 'Rome',         country: 'Italy',   sub: 'Sunsets from the Cavalieri, prosecco in robes' },
  { img: P.santorini_arch,  name: 'Santorini',    country: 'Greece',  sub: 'White walls, blue domes, and too much wine' },
  { img: P.athens,          name: 'Athens',       country: 'Greece',  sub: 'The Acropolis at night took our breath away' },
  { img: P.munich,          name: 'Munich',       country: 'Germany', sub: 'Yes, we ordered four steins. Worth it.' },
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
              src={lsrc(dest.img)}
              alt={`${dest.name}, ${dest.country}`}
              loading="lazy"
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
          <img src={src(IMG.travel, 800, 82)} alt="Luggage ready for the next adventure" loading="lazy" width={800} height={1000} />
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
            The hotels worth every euro. The restaurants your guidebook missed. The moments that remind you life is too short to wait.
          </motion.h2>
          <motion.p className="newsletter__sub" variants={fadeUp}>
            Join our list for real destination guides, honest hotel reviews, table-by-table food finds, and dispatches from wherever our pinky is raised this week.
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
  { img: P.northern_lights,  alt: 'Jason and Debbi under the Northern Lights in Iceland' },
  { img: P.paris_group,      alt: 'Family in front of the Eiffel Tower, Paris' },
  { img: P.santorini_arch,   alt: 'Blue domed churches of Oia, Santorini' },
  { img: P.rome_balcony,     alt: 'Prosecco on the balcony overlooking Rome at night' },
  { img: P.athens,           alt: 'The Acropolis of Athens lit up at night' },
  { img: P.munich,           alt: 'Raising steins at the Hofbräuhaus in Munich' },
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
          @passportsandproseccolife <span>♥</span>
        </motion.div>
        <motion.p className="instagram__sub" variants={fadeUp}>Follow along on Instagram</motion.p>
      </motion.div>

      <motion.div
        className="instagram__grid"
        initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger}
      >
        {IG.map(({ img, alt }) => (
          <motion.a
            key={img} href="https://instagram.com/passportsandproseccolife" target="_blank" rel="noopener noreferrer"
            className="instagram__item" variants={fadeUp}
          >
            <img src={lsrc(img)} alt={alt} loading="lazy" />
            <div className="instagram__hover" aria-hidden="true">
              <span>♥ Follow</span>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </section>
  )
}

// ─── Blog ────────────────────────────────────────────────────────────────────
const POSTS = [
  {
    img: P.rome_balcony,
    alt: 'Prosecco on the balcony of the Cavalieri overlooking Rome at night',
    date: 'June 2025',
    category: 'Italy',
    title: 'The Cavalieri at Sunset: The Night Rome Made Us Speechless',
    excerpt:
      'We were sitting on the balcony of the Cavalieri in our robes, watching the sun drop behind the old city, when Debbi turned to me and said — "This is it. This is the life." A glass of prosecco. The whole of Rome laid out below us. Some moments you don\'t photograph. You just live inside them.',
  },
  {
    img: P.elegant_dining,
    alt: 'Raising glasses of white wine at an elegant hotel restaurant',
    date: 'May 2025',
    category: 'Food & Wine',
    title: 'Bene Knew Exactly What We Wanted Before We Did',
    excerpt:
      'At Il Bersagliere in Rome\'s Prati District, our waiter Bene told us simply: "I know what you\'ll love." Then he proceeded to prove it — dish after extraordinary dish, each one better than the last, all of it washed down with a very generous amount of Chianti. The best meals aren\'t always planned.',
  },
  {
    img: P.northern_lights,
    alt: 'Jason and Debbi together under the Northern Lights in Reykjavik, Iceland',
    date: 'December 2025',
    category: 'Iceland',
    title: 'Standing Under the Northern Lights: Nothing Can Prepare You',
    excerpt:
      'We\'d seen photos. We thought we knew what to expect. We did not. Standing outside Harpa Concert Hall in Reykjavik watching the sky fill with ribbons of green light, we were completely, utterly silent. Then Debbi whispered — "We need to come back." We\'re already planning it.',
  },
] as const

function Blog() {
  const { ref, inView } = useReveal()
  return (
    <section id="stories" className="blog section-light" style={{ padding: 'var(--section-py) 0' }}>
      <div className="container" ref={ref}>
        <motion.div
          className="section-header"
          style={{ marginBottom: 'clamp(2.5rem, 5vw, 4rem)', textAlign: 'center' }}
          initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger}
        >
          <motion.span className="section-kicker" variants={fadeUp}>From the Journal</motion.span>
          <motion.h2 className="section-title-light" variants={fadeUp}>Stories Worth Telling</motion.h2>
          <motion.p style={{ fontSize: '1rem', color: 'var(--light-ink-muted)', marginTop: '0.75rem', maxWidth: '44ch', marginInline: 'auto' }} variants={fadeUp}>
            The moments behind the passport stamps.
          </motion.p>
        </motion.div>

        <motion.div
          className="blog__grid"
          initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger}
        >
          {POSTS.map(post => (
            <motion.article key={post.title} className="blog-card" variants={fadeUp}>
              <a href="#" className="blog-card__img-wrap">
                <img src={lsrc(post.img)} alt={post.alt} loading="lazy" />
              </a>
              <div className="blog-card__body">
                <div className="blog-card__meta">
                  <span className="blog-card__category">{post.category}</span>
                  <span className="blog-card__date">{post.date}</span>
                </div>
                <h3 className="blog-card__title"><a href="#">{post.title}</a></h3>
                <p className="blog-card__excerpt">{post.excerpt}</p>
                <a href="#" className="blog-card__read-more">Read the Full Story →</a>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
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
            <a href="https://instagram.com/passportsandproseccolife" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>
            </a>
            <a href="https://www.youtube.com/@PassportsandProseccoLife" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <svg viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 001.95-1.97A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/></svg>
            </a>
            <a href="https://www.facebook.com/passportsandproseccolife" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
            </a>
            <a href="https://www.tiktok.com/@passportsandproseccolife" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <svg viewBox="0 0 24 24"><path d="M9 12a4 4 0 104 4V4a5 5 0 005 5"/></svg>
            </a>
            <a href="mailto:passportsandproseccolife@gmail.com" aria-label="Email">
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
          <a href="mailto:passportsandproseccolife@gmail.com">Contact</a>
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
        <Blog />
        <Newsletter />
        <Instagram />
      </main>
      <Footer />
    </>
  )
}
