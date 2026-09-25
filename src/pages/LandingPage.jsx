import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Check, Menu, Search, X } from 'lucide-react';
import { listAcademyApps } from '@/services/academyService';
import { HOME_COURSES, HOME_MODULES, mergeCatalog, catalogStats } from '@/lib/homeCatalog';
import './LandingPage.css';

// Homepage, regal redesign (2026-09-25, owner approved). Written for two
// readers at a glance: the professional choosing a course and the employer
// buying seats. Course list and counts come from src/lib/homeCatalog.js,
// with live status from academy_apps. Fees mirror academy_fees (every course
// is on the subsurface schedule today); update both together.

const LOGO = 'https://horizons-cdn.hostinger.com/80504870-35f5-4fc9-ba7f-f8bc12cf282f/petrolord-symbol-512-4kVUt.png';
const INITIAL_COUNT = 12;

const NAV = [
  ['#courses', 'Courses'],
  ['#employers', 'For Employers'],
  ['#how', 'How It Works'],
  ['#fees', 'Fees'],
  ['#verify', 'Verify a Certificate'],
];

const PATHWAYS = [
  ['Graduate Accelerator', 6, 'Well Data, Petrophysics, DCA, Nodal Analysis, Cash Flow & NPV, Safety KPIs'],
  ['Wells Delivery', 7, 'Well Design, Pore Pressure, Geomechanics, Well Control, Casing, Cementing, Well Cost'],
  ['Barrels Now', 6, 'Nodal, Gas Lift, ESP, Flow Assurance, Networks, Surveillance'],
  ['Asset Integrity & Safety', 5, 'Relief & Flare, Corrosion, LOPA & SIL, Consequence Modelling, QRA'],
  ['Commercial Leadership', 5, 'Cash Flow & NPV, Fiscal Regimes, Probabilistic Economics, Decision Analysis, FDP'],
];

const SAMPLE_LEARNERS = [
  ['T. Bello', 'Petrophysics · Associate', 100, '92%', 'done', 'Certified'],
  ['C. Eze', 'Nodal Analysis · Associate', 78, '84%', 'ok', 'On track'],
  ['F. Adeyemi', 'DCA · Associate', 64, '76%', 'ok', 'On track'],
  ['K. Musa', 'Cash Flow & NPV · Associate', 22, 'n/a', 'warn', 'Inactive 16 days'],
];

const FEES = [
  ['Associate', 'Beginner tier', '₦60,000', '≈ $40'],
  ['Professional', 'Intermediate tier', '₦120,000', '≈ $80'],
  ['Expert', 'Advanced tier', '₦200,000', '≈ $130'],
];

const moduleLabel = (key) => HOME_MODULES.find((m) => m.key === key)?.label ?? key;

function Catalogue({ courses, stats }) {
  const [active, setActive] = React.useState('all');
  const [term, setTerm] = React.useState('');
  const [expanded, setExpanded] = React.useState(false);

  const live = (key) => courses.filter((c) => c.status === 'available' && (key === 'all' || c.module === key)).length;
  const mod = HOME_MODULES.find((m) => m.key === active);
  const q = term.trim().toLowerCase();
  const matches = courses.filter(
    (c) => (active === 'all' || c.module === active) && (!q || `${c.name} ${c.blurb}`.toLowerCase().includes(q)),
  );
  const capped = active === 'all' && !q && !expanded && matches.length > INITIAL_COUNT;
  const shown = capped ? matches.slice(0, INITIAL_COUNT) : matches;

  return (
    <>
      <div className="tabs" role="tablist" aria-label="Disciplines">
        {[{ key: 'all', label: 'All' }, ...HOME_MODULES].map((m) => (
          <button
            key={m.key}
            type="button"
            role="tab"
            className="tab"
            aria-selected={active === m.key}
            onClick={() => { setActive(m.key); setExpanded(false); }}
          >
            {m.label}<span className="c">{live(m.key)}</span>
          </button>
        ))}
      </div>
      <div className="cat-top">
        <div>
          <h3>{mod ? mod.label : 'All disciplines'}</h3>
          <p>{mod ? mod.tagline : `${stats.courses} live courses across ${stats.disciplines} disciplines, with more on the way.`}</p>
        </div>
        <label className="search" htmlFor="home-course-search">
          <Search className="w-4 h-4" aria-hidden="true" />
          <input
            id="home-course-search"
            type="search"
            placeholder="Search courses, e.g. well control"
            autoComplete="off"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
        </label>
      </div>
      <div className="grid" aria-live="polite">
        {shown.length === 0 && (
          <p className="empty">No course matches that search yet. Try a broader word, or browse by discipline.</p>
        )}
        {shown.map((c) => {
          const soon = c.status !== 'available';
          return (
            <article className="course" key={c.slug}>
              <span className="mod">{moduleLabel(c.module)}</span>
              {soon ? <span className="pill">Coming soon</span> : c.isNew ? <span className="pill new">New</span> : null}
              <h4>{c.name}</h4>
              <p>{c.blurb}</p>
              {!soon && (
                <div className="tiers">
                  <i style={{ background: 'var(--assoc)' }} />
                  <i style={{ background: 'var(--prof)' }} />
                  <i style={{ background: 'var(--expert)' }} />
                  &nbsp;Associate · Professional · Expert
                </div>
              )}
            </article>
          );
        })}
      </div>
      {capped && (
        <div className="more">
          <button type="button" className="btn btn-ink" onClick={() => setExpanded(true)}>
            Show all courses
          </button>
        </div>
      )}
    </>
  );
}

function VerifyPanel() {
  const navigate = useNavigate();
  const [code, setCode] = React.useState('');
  const [msg, setMsg] = React.useState('');
  const submit = (e) => {
    e.preventDefault();
    const v = code.trim();
    if (!v) { setMsg('Enter the verification code printed on the certificate.'); return; }
    navigate(`/verify/${encodeURIComponent(v)}`);
  };
  return (
    <div className="panel" id="verify">
      <p className="eyebrow">Public register</p>
      <h3>Verify a certificate</h3>
      <p>Employers, clients and regulators can confirm any NextGen credential without creating an account. Enter the verification code printed on the certificate.</p>
      <form className="vform" onSubmit={submit}>
        <input
          id="home-verify-code"
          type="text"
          placeholder="Verification code"
          aria-label="Verification code"
          autoComplete="off"
          value={code}
          onChange={(e) => { setCode(e.target.value); setMsg(''); }}
        />
        <button className="btn btn-ink" type="submit">Verify</button>
      </form>
      <p className="vmsg" role="status">{msg}</p>
    </div>
  );
}

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [courses, setCourses] = React.useState(HOME_COURSES);

  React.useEffect(() => {
    let alive = true;
    listAcademyApps()
      .then((apps) => { if (alive) setCourses(mergeCatalog(HOME_COURSES, apps)); })
      .catch(() => {}); // keep the static catalogue
    return () => { alive = false; };
  }, []);

  const stats = catalogStats(courses);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="ng-home">
      <Helmet>
        <title>Petrolord NextGen Academy | Energy courses with verifiable certifications</title>
        <meta
          name="description"
          content={`${stats.courses} hands-on energy industry courses taught inside the Petrolord Suite, from geoscience to HSE. Auto-graded practicals and Associate, Professional and Expert certificates anyone can verify.`}
        />
      </Helmet>

      <header className="site">
        <div className="wrap nav">
          <Link className="brand" to="/" aria-label="Petrolord NextGen home">
            <span className="crest"><img src={LOGO} alt="" /></span>
            <span>Petrolord <em>NextGen</em></span>
          </Link>
          <nav className="links" aria-label="Main">
            {NAV.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
          </nav>
          <div className="nav-cta">
            <Link className="login" to="/login">Log in</Link>
            <Link className="btn btn-gold" to="/register">Get started</Link>
            <button
              type="button"
              className="menu-btn"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        <nav className={`mobile-menu${menuOpen ? ' open' : ''}`} aria-label="Mobile">
          {NAV.map(([href, label]) => <a key={href} href={href} onClick={closeMenu}>{label}</a>)}
          <Link to="/login" onClick={closeMenu}>Log in</Link>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="wrap hero-grid">
            <div>
              <p className="eyebrow">The Academy of the Petrolord Suite</p>
              <h1>Where energy professionals are <em>made, proven and certified.</em></h1>
              <p className="lede">
                Train inside the same engineering software used on real assets, across {stats.courses} courses from
                geoscience to HSE. Every certificate is earned on an auto-graded practical and can be verified by
                anyone, anywhere.
              </p>
              <div className="ctas">
                <a className="btn btn-gold" href="#courses">Explore the {stats.courses} courses <ArrowRight className="w-4 h-4" /></a>
                <a className="btn btn-ghost" href="#employers">Train your team</a>
              </div>
              <p className="fine">Already certified? <a href="#verify">Verify a certificate</a> in seconds.</p>
            </div>
            <div className="cert-stage" aria-label="Sample Professional certificate">
              <div className="cert">
                <span className="sample" aria-hidden="true">SAMPLE</span>
                <div className="cert-top">
                  <div className="cert-word">Petrolord <em>NextGen</em></div>
                  <div className="cert-tier">Professional</div>
                </div>
                <div className="cert-mid">
                  <div className="k">Certificate of Professional Certification</div>
                  <div className="name">Your Name</div>
                  <div className="cert-course">Nodal Analysis &amp; Well Performance<br />Professional tier · auto-graded capstone passed</div>
                </div>
                <div className="cert-bot">
                  <div className="cert-id">PLA-2026-000000<br />Valid for 12 months</div>
                  <div className="seal">LORDS<br />WAY</div>
                  <div className="sig">Registrar<small>Lordsway Energy</small></div>
                </div>
              </div>
              <div className="verified" role="note">
                <div className="dot"><Check className="w-4 h-4" /></div>
                <div><b>Verifiable credential</b><span>Checked on the public register, no login needed</span></div>
              </div>
            </div>
          </div>
          <div className="ledger">
            <ul className="wrap" aria-label="NextGen at a glance">
              <li><strong>{stats.courses}</strong><span>courses, each built around a real engineering app</span></li>
              <li><strong>{stats.disciplines}</strong><span>disciplines across the energy value chain</span></li>
              <li><strong>{stats.certifications}</strong><span>certifications across three tiers</span></li>
              <li><strong>100%</strong><span>of capstones auto-graded against verified answers</span></li>
              <li><strong>0</strong><span>software to install. Learn from any browser</span></li>
            </ul>
          </div>
        </section>

        <section className="block" id="start">
          <div className="wrap">
            <div className="head">
              <p className="eyebrow">Choose your path</p>
              <h2>Built for ambitious professionals and the companies that grow them.</h2>
            </div>
            <div className="aud">
              <article className="pro">
                <p className="eyebrow">For professionals and graduates</p>
                <h3>Get job-ready on the tools the industry runs on.</h3>
                <ul>
                  <li>Learn inside the real Petrolord apps on realistic field datasets</li>
                  <li>Climb from Associate to Professional to Expert in each course</li>
                  <li>Each certificate you earn opens more of the software for your own work</li>
                  <li>Your account uses your personal email, so it follows your career</li>
                </ul>
                <div className="actions">
                  <a className="btn btn-ink" href="#courses">Find your course</a>
                  <a className="btn btn-line" href="#fees">See fees</a>
                </div>
              </article>
              <article className="emp">
                <p className="eyebrow">For employers and sponsors</p>
                <h3>Turn your training budget into verified capability.</h3>
                <ul>
                  <li>Buy seats and assign courses with a single sponsorship code</li>
                  <li>See every learner&apos;s progress and scores in the Sponsor console</li>
                  <li>Spot inactive learners automatically after 14 days</li>
                  <li>Export results to CSV for HR, audits and local content reporting</li>
                </ul>
                <div className="actions"><a className="btn btn-gold" href="#employers">Plan a team programme</a></div>
              </article>
            </div>
          </div>
        </section>

        <section className="block flush" id="how">
          <div className="wrap">
            <div className="head">
              <p className="eyebrow">How it works</p>
              <h2>Four steps from enrolment to a certificate that means something.</h2>
            </div>
            <ol className="how">
              <li><span className="n">STEP 1</span><h3>Enrol</h3><p>Create your account, or redeem your employer&apos;s code. Learning opens the same day.</p></li>
              <li><span className="n">STEP 2</span><h3>Learn by doing</h3><p>Lessons and guided exercises inside the real app, on teaching datasets built from field-style data.</p></li>
              <li><span className="n">STEP 3</span><h3>Prove it</h3><p>Pass the quiz and a practical capstone graded automatically against verified reference answers.</p></li>
              <li><span className="n">STEP 4</span><h3>Certify</h3><p>Receive a certificate with a public verification code, valid for 12 months and renewable.</p></li>
            </ol>
          </div>
        </section>

        <section className="block cat-bg" id="courses">
          <div className="wrap">
            <div className="head">
              <p className="eyebrow">The catalogue</p>
              <h2>{stats.courses} courses. One academy for the whole value chain.</h2>
              <p>Every course has Associate, Professional and Expert tiers. Pick a discipline or search by topic.</p>
            </div>
            <Catalogue courses={courses} stats={stats} />
          </div>
        </section>

        <section className="block" id="ladder">
          <div className="wrap">
            <div className="head">
              <p className="eyebrow">The certification ladder</p>
              <h2>Three tiers in every course. Each one unlocks more of the software.</h2>
            </div>
            <div className="ladder">
              <article className="rung a"><div className="badge">I</div><p className="who">Graduates and new hires</p><h3>Associate</h3><p>Runs the core workflow correctly and independently.</p><p className="unlock"><b>Unlocks</b> your own data and the core features, with the training watermark removed.</p></article>
              <article className="rung p"><div className="badge">II</div><p className="who">Working engineers and analysts</p><h3>Professional</h3><p>Handles real complexity, sensitivities and quality checks.</p><p className="unlock"><b>Unlocks</b> the advanced workflows and features of the app.</p></article>
              <article className="rung e"><div className="badge">III</div><p className="who">Senior staff and future leads</p><h3>Expert</h3><p>Makes and defends decisions, and mentors others.</p><p className="unlock"><b>Unlocks</b> full capability, every export format and a discounted pathway into the Petrolord Suite.</p></article>
            </div>
          </div>
        </section>

        <section className="block emp-sec" id="employers">
          <div className="wrap">
            <div className="head">
              <p className="eyebrow">For employers</p>
              <h2>Develop your people. <em>See the results.</em></h2>
              <p>Choose a ready-made pathway or build your own. Your training lead follows every learner from the first lesson to the certificate.</p>
            </div>
            <div className="emp-grid">
              <div className="pathways" aria-label="Ready-made pathways">
                {PATHWAYS.map(([name, n, list]) => (
                  <div className="pw" key={name}><b>{name}</b><em>{n} courses</em><span>{list}</span></div>
                ))}
                <a className="btn btn-gold" style={{ justifySelf: 'start', marginTop: 10 }} href="#contact">Book a 30-minute briefing</a>
              </div>
              <div className="console" aria-label="Sample Sponsor console">
                <div className="bar"><b>Sponsor console · Graduate Accelerator</b><span>Sample view</span></div>
                <div className="kpis">
                  <div><strong>24</strong><small>seats assigned</small></div>
                  <div><strong>71%</strong><small>average progress</small></div>
                  <div><strong>2</strong><small>inactive 14+ days</small></div>
                </div>
                <div className="tbl">
                  <table>
                    <thead><tr><th>Learner</th><th>Course · tier</th><th>Progress</th><th>Best score</th><th>Status</th></tr></thead>
                    <tbody>
                      {SAMPLE_LEARNERS.map(([who, course, pct, score, tone, status]) => (
                        <tr key={who}>
                          <td>{who}</td><td>{course}</td>
                          <td><div className="bar-p"><i style={{ width: `${pct}%` }} /></div></td>
                          <td>{score}</td><td><span className={`chip ${tone}`}>{status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="note">Sample data for illustration. Export any view to CSV.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="block">
          <div className="wrap duo">
            <VerifyPanel />
            <div className="panel" id="fees">
              <p className="eyebrow">Fees</p>
              <h3>One clear fee per tier</h3>
              <div className="fees">
                {FEES.map(([tier, sub, ngn, usd]) => (
                  <div key={tier}><b>{tier}</b><span>{sub}</span><strong>{ngn}<small>{usd}</small></strong></div>
                ))}
              </div>
              <p style={{ fontSize: 14 }}>Charged in Naira through secure Paystack checkout. US-dollar figures are indicative. Cohort packages for employers and scholarships for partner universities are available.</p>
            </div>
          </div>
        </section>

        <section className="block flush">
          <div className="wrap">
            <div className="head">
              <p className="eyebrow">Other ways in</p>
              <h2>Partnerships that widen the pipeline of talent.</h2>
            </div>
            <div className="partners">
              <article><h3>Universities</h3><p>Campus cohorts learn on scholarship through a cohort code from their liaison. Students pay only a small personal registration fee.</p></article>
              <article><h3>Sponsors</h3><p>Operators, service companies and foundations can sponsor learners. The account and certificate always stay with the learner.</p></article>
              <article><h3>Residency, from 2027</h3><p>A selective, in-person programme at the Lordsway facility with instructor supervision. Applications open when the facility is ready.</p></article>
            </div>
          </div>
        </section>

        <section className="block final" id="contact">
          <div className="wrap">
            <p className="eyebrow">Start today</p>
            <h2>Build the workforce your <em>next barrel</em> depends on.</h2>
            <p>Create your account in minutes, or talk to us about a pilot cohort for your team.</p>
            <div className="ctas">
              <Link className="btn btn-gold" to="/register">Create your account</Link>
              <a className="btn btn-ghost" href="mailto:info@petrolord.com?subject=NextGen%20team%20briefing">Book a team briefing</a>
            </div>
            <p className="contact-line">
              <a href="mailto:info@petrolord.com">info@petrolord.com</a> · <a href="mailto:info@lordswayenergy.com">info@lordswayenergy.com</a> · +234 901 556 6981 · +44 7403 660720
            </p>
          </div>
        </section>
      </main>

      <HomeFooter />
    </div>
  );
};

function HomeFooter() {
  return (
    <footer style={{ background: '#07140E', color: 'var(--on-ink-muted)', fontSize: 14 }}>
      <div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 28, paddingBlock: '52px 36px' }}>
        <div>
          <Link className="brand" to="/" style={{ marginBottom: 14 }}>
            <span className="crest"><img src={LOGO} alt="" /></span>
            <span>Petrolord <em>NextGen</em></span>
          </Link>
          <p>The academy of the Petrolord Suite. Hands-on courses and verifiable Associate, Professional and Expert certifications. A Lordsway Energy company.</p>
        </div>
        <FooterCol title="Academy">
          {NAV.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
          <Link to="/register">Create Account</Link>
        </FooterCol>
        <FooterCol title="Contact">
          <a href="mailto:info@petrolord.com">info@petrolord.com</a>
          <a href="mailto:info@lordswayenergy.com">info@lordswayenergy.com</a>
          <a href="tel:+2349015566981">+234 901 556 6981</a>
          <a href="tel:+447403660720">+44 7403 660720</a>
        </FooterCol>
        <FooterCol title="Offices">
          <p>8 The Providence Street, Lekki Phase 1, Lagos, Nigeria</p>
          <p style={{ marginTop: 10 }}>128 City Road, London EC1V 2NX, United Kingdom</p>
        </FooterCol>
      </div>
      <div className="wrap" style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingBlock: 18, display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', fontSize: 13 }}>
        <span>© {new Date().getFullYear()} Lordsway Energy. All rights reserved.</span>
        <span style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          <Link to="/privacy-policy" style={{ textDecoration: 'none' }}>Privacy Policy</Link>
          <Link to="/terms-of-service" style={{ textDecoration: 'none' }}>Terms of Service</Link>
          <Link to="/academic-integrity" style={{ textDecoration: 'none' }}>Academic Integrity</Link>
        </span>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }) {
  return (
    <div style={{ display: 'grid', gap: 6, alignContent: 'start' }}>
      <h5 style={{ margin: '0 0 8px', font: '600 12px/1 var(--sans)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold-soft)' }}>{title}</h5>
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? React.cloneElement(child, { style: { textDecoration: 'none', lineHeight: 1.7, ...(child.props.style || {}) } }) : child,
      )}
    </div>
  );
}

export default LandingPage;
