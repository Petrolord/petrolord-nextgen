import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Mail, Menu, X, GraduationCap, Unlock, ShieldAlert, BookOpen, CreditCard, Briefcase, Microscope, Award, BadgeCheck, UserPlus, ClipboardCheck, Layers, Database, HardHat, Fuel, DollarSign, Factory, ShieldCheck, HeartPulse, Leaf, CandlestickChart, Ship, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';

// Landing page reflects the Academy doctrine (NextGen-Academy-PLAN §1):
// one identity, four doors; the catalog is the app catalog; certification
// ladder Associate → Professional → Expert; published per-school fees.
// Keep this page in sync with academy_apps / academy_fees when they change.

const DOORS = [{
  icon: CreditCard,
  title: 'Self-Enrolled',
  desc: 'Register with your personal email, pick a course and tier, and pay the course fee securely online. Start learning the same day.'
}, {
  icon: GraduationCap,
  title: 'Campus Scholar',
  desc: 'Your university liaison gives you a cohort code that applies a scholarship to the course fee, so you pay only a small personal registration fee.'
}, {
  icon: Microscope,
  title: 'Residency',
  desc: 'Apply for a residency intake. If selected, your enrollment is created for you and you train inside a time-boxed, instructor-visible cohort.'
}, {
  icon: Briefcase,
  title: 'Employer-Sponsored',
  desc: 'Redeem a sponsorship code from your employer. Your sponsor covers the course fee, while the account, courses and certificate remain yours.'
}];

const LADDER = [{
  tier: 'Beginner',
  cert: 'Associate',
  desc: 'Learn the app on bundled teaching datasets. Certifying unlocks working mode: your own data, core features, training watermark removed.'
}, {
  tier: 'Intermediate',
  cert: 'Professional',
  desc: 'Deeper workflows and advanced capabilities of the app, certified against the same auto-graded standard.'
}, {
  tier: 'Advanced',
  cert: 'Expert',
  desc: 'Full capability, the highest quotas and all export formats, plus a discounted pathway into the professional Petrolord Suite.'
}];

// Module buckets mirror the Suite dashboard tiles plus the four new
// modules introduced for the commercial and energy-business app wave
// (2026-07-15 owner direction). `coming` lists the apps planned for the
// bucket, flagship first; keep in sync as the owner adds courses.
const MODULES = [{
  name: 'Geoscience',
  icon: Layers,
  color: 'text-emerald-400',
  bg: 'bg-emerald-500/10',
  desc: 'Well data, petrophysics, correlation, seismic interpretation, mapping and earth modelling.'
}, {
  name: 'Reservoir',
  icon: Database,
  color: 'text-blue-400',
  bg: 'bg-blue-500/10',
  desc: 'Volumetrics, material balance, decline analysis and waterflood surveillance.'
}, {
  name: 'Drilling',
  icon: HardHat,
  color: 'text-amber-400',
  bg: 'bg-amber-500/10',
  desc: 'Well engineering, cementing and drilling operations.'
}, {
  name: 'Production',
  icon: Fuel,
  color: 'text-purple-400',
  bg: 'bg-purple-500/10',
  desc: 'Production surveillance, allocation and performance optimisation.'
}, {
  name: 'Economics',
  icon: DollarSign,
  color: 'text-lime-400',
  bg: 'bg-lime-500/10',
  desc: 'Project economics, AFE and cost control, fiscal and contract modelling.',
  coming: ['Fiscal & Contract Economics Modeler']
}, {
  name: 'Facilities',
  icon: Factory,
  color: 'text-rose-400',
  bg: 'bg-rose-500/10',
  desc: 'Surface facilities, flow assurance and pipeline engineering.'
}, {
  name: 'Assurance',
  icon: ShieldCheck,
  color: 'text-cyan-400',
  bg: 'bg-cyan-500/10',
  desc: 'Technical assurance, risk and compliance.'
}, {
  name: 'HSE',
  icon: HeartPulse,
  color: 'text-red-400',
  bg: 'bg-red-500/10',
  desc: 'Health, safety and environment management.'
}, {
  name: 'Energy Transition',
  icon: Leaf,
  color: 'text-teal-400',
  bg: 'bg-teal-500/10',
  desc: 'Carbon accounting, emissions tracking and decarbonisation planning.',
  coming: ['Carbon & Emissions Studio', 'CCS/CCUS Screening Tool', 'Methane & Flaring Monitor'],
  isNew: true
}, {
  name: 'Commercial & Trading',
  icon: CandlestickChart,
  color: 'text-orange-400',
  bg: 'bg-orange-500/10',
  desc: 'Energy trading, cargo operations and market analytics.',
  coming: ['Energy Trading & Cargo Simulator', 'Crude Assay & Blending Manager', 'Price Risk & Hedging Desk'],
  isNew: true
}, {
  name: 'Supply Chain & Logistics',
  icon: Ship,
  color: 'text-sky-400',
  bg: 'bg-sky-500/10',
  desc: 'Supply chain planning and marine logistics for energy operations.',
  coming: ['Supply Chain & Marine Logistics Planner', 'Materials & Inventory Manager', 'Vessel Scheduling Optimizer'],
  isNew: true
}, {
  name: 'Data & AI',
  icon: BrainCircuit,
  color: 'text-violet-400',
  bg: 'bg-violet-500/10',
  desc: 'Oilfield data management and applied AI workflows.',
  coming: ['Oilfield Data & AI Studio', 'Production Forecasting ML Workbench'],
  isNew: true
}];

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const fadeIn = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };
  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 font-sans flex flex-col selection:bg-[#BFFF00] selection:text-black">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-lg shadow-lg shadow-[#BFFF00]/20 group-hover:shadow-[#BFFF00]/40 transition-all duration-300">
                 <img alt="Company Logo Icon" className="w-full h-full object-cover" src="https://horizons-cdn.hostinger.com/80504870-35f5-4fc9-ba7f-f8bc12cf282f/petrolord-symbol-512-4kVUt.png" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Petrolord <span className="text-[#BFFF00]">NextGen</span></span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-sm font-medium text-slate-300 hover:text-[#BFFF00] transition-colors">About</a>
              <a href="#doors" className="text-sm font-medium text-slate-300 hover:text-[#BFFF00] transition-colors">How to Join</a>
              <a href="#modules" className="text-sm font-medium text-slate-300 hover:text-[#BFFF00] transition-colors">Modules</a>
              <a href="#pricing" className="text-sm font-medium text-slate-300 hover:text-[#BFFF00] transition-colors">Pricing</a>
              <Link to="/verify" className="text-sm font-medium text-slate-300 hover:text-[#BFFF00] transition-colors">Verify a Certificate</Link>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">Log In</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-[#BFFF00] text-black hover:bg-[#a3d900] font-bold border-none shadow-[0_0_15px_rgba(191,255,0,0.3)] hover:shadow-[0_0_25px_rgba(191,255,0,0.5)] transition-all">Create Account</Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={toggleMobileMenu} className="text-slate-300 hover:text-white p-2">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#1E293B] border-b border-slate-800 py-4 px-4 space-y-4 shadow-xl">
            <a href="#about" onClick={toggleMobileMenu} className="block text-base font-medium text-slate-300 hover:text-[#BFFF00]">About</a>
            <a href="#doors" onClick={toggleMobileMenu} className="block text-base font-medium text-slate-300 hover:text-[#BFFF00]">How to Join</a>
            <a href="#modules" onClick={toggleMobileMenu} className="block text-base font-medium text-slate-300 hover:text-[#BFFF00]">Modules</a>
            <a href="#pricing" onClick={toggleMobileMenu} className="block text-base font-medium text-slate-300 hover:text-[#BFFF00]">Pricing</a>
            <Link to="/verify" onClick={toggleMobileMenu} className="block text-base font-medium text-slate-300 hover:text-[#BFFF00]">Verify a Certificate</Link>
            <div className="pt-4 border-t border-slate-700 flex flex-col gap-3">
              <Link to="/login" className="w-full">
                <Button variant="outline" className="w-full justify-center border-slate-600 text-slate-200">Log In</Button>
              </Link>
              <Link to="/register" className="w-full">
                <Button className="w-full justify-center bg-[#BFFF00] text-black hover:bg-[#a3d900] font-bold">Create Account</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-[#BFFF00]/10 via-[#BFFF00]/5 to-transparent opacity-20 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-[0.03] pointer-events-none mix-blend-overlay"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 mb-8 backdrop-blur-md shadow-lg">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#BFFF00] animate-pulse"></span>
              <span className="text-xs font-semibold text-[#BFFF00] uppercase tracking-wider">Petrolord Academy: Enrollment Now Open</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
              Learn the Real Tools. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BFFF00] to-emerald-400">Earn Verifiable Certifications.</span>
            </h1>

            <p className="mt-8 max-w-2xl mx-auto text-lg md:text-xl text-slate-300 leading-relaxed">
              <strong>Petrolord NextGen</strong> is the academy edition of the Petrolord Suite. Train hands-on inside the actual engineering apps, complete auto-graded practicals, and climb the certification ladder from Associate to Professional to Expert.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" className="h-14 px-10 bg-[#BFFF00] text-black hover:bg-[#a3d900] font-bold text-lg w-full shadow-[0_0_20px_rgba(191,255,0,0.4)] hover:shadow-[0_0_30px_rgba(191,255,0,0.6)] transition-all">
                  Create Your Account
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <a href="#doors" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="h-14 px-10 border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white font-semibold text-lg w-full">
                  See How to Join
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What Is Petrolord NextGen */}
      <section id="about" className="py-20 bg-[#0F172A] border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                What is Petrolord <span className="text-[#BFFF00]">NextGen</span>?
              </h2>
              <div className="space-y-4 text-slate-300 text-lg leading-relaxed">
                <p>
                  Petrolord NextGen is the academy of the Petrolord Suite. Each course is built around a real app: you learn Petrophysics inside the actual Petrophysics app, running the same calculation engines that professionals use in their daily work.
                </p>
                <p>
                  Every course pairs lessons and guided exercises on bundled teaching datasets with a quiz and a practical capstone that is auto-graded against verified reference answers. When you certify, your access upgrades automatically, from Learning Mode all the way to full professional capability.
                </p>
                <ul className="grid grid-cols-1 gap-3 mt-6">
                  {['Hands-on learning in the real Petrolord apps and engines', 'Auto-graded capstones with machine-checked answers', 'Certificates anyone can verify online, valid for 12 months', 'Fully cloud-based, with nothing to install'].map((item, i) => <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#BFFF00] shrink-0" />
                      <span className="text-slate-200">{item}</span>
                    </li>)}
                </ul>
              </div>
            </motion.div>
            <motion.div initial={{
            opacity: 0,
            x: 20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }} className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent z-10"></div>
              <img className="w-full h-auto object-cover opacity-90 hover:scale-105 transition-transform duration-700" alt="Students collaborating on laptops in a modern university lab" src="https://horizons-cdn.hostinger.com/80504870-35f5-4fc9-ba7f-f8bc12cf282f/nextgen-lab-MbfVX.png" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Four Doors */}
      <section id="doors" className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">One Identity, Four Doors</h2>
            <p className="text-slate-400 text-lg">Every learner registers with a personal email, so your account stays with you long after graduation. There are four ways in, and the only difference between them is who pays.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {DOORS.map((door, idx) => <motion.div key={idx} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: idx * 0.1,
            duration: 0.5
          }} className="relative p-6 rounded-2xl bg-[#1E293B]/50 border border-slate-700/50 hover:border-[#BFFF00]/30 hover:bg-[#1E293B] transition-all group">
                <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-[#BFFF00] z-20">
                  {idx + 1}
                </div>
                <div className="w-14 h-14 rounded-xl bg-slate-800/80 flex items-center justify-center mb-6 text-[#BFFF00] group-hover:scale-110 transition-transform duration-300">
                  <door.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{door.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{door.desc}</p>
              </motion.div>)}
          </div>

          <p className="text-center text-slate-300 mt-12 text-lg">
            Same account, same courses, same certificates. <span className="text-[#BFFF00] font-semibold">The only difference is who pays.</span>
          </p>
        </div>
      </section>

      {/* Certification Ladder & Path */}
      <section id="ladder" className="py-20 bg-[#0B1221]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">The Certification Ladder</h2>
            <p className="text-slate-400 text-lg">Each course has three tiers. Passing a tier's quiz and capstone earns you the matching certification and automatically unlocks more of the app.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {LADDER.map((rung, idx) => <div key={idx} className="bg-[#162032] rounded-3xl p-8 border border-slate-800 hover:border-[#BFFF00]/20 transition-colors">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#BFFF00]/10 rounded-lg">
                      <Award className="w-6 h-6 text-[#BFFF00]" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider">{rung.tier} tier</p>
                      <h3 className="text-xl font-bold text-white">{rung.cert}</h3>
                    </div>
                  </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{rung.desc}</p>
              </div>)}
          </div>

          {/* Your path, step by step */}
          <div className="grid md:grid-cols-4 gap-6">
            {[{
            icon: UserPlus,
            title: 'Register',
            desc: 'Create your account with your personal email and complete a short orientation and entry assessment.'
          }, {
            icon: BookOpen,
            title: 'Enroll',
            desc: 'Pick your course, tier and door. Learning Mode opens instantly on bundled teaching datasets.'
          }, {
            icon: ClipboardCheck,
            title: 'Prove It',
            desc: 'Pass the quiz and the practical capstone, which is auto-graded against verified reference answers within a stated tolerance.'
          }, {
            icon: Unlock,
            title: 'Certify & Unlock',
            desc: 'Your certificate is issued with a verifiable ID, valid for 12 months and renewable, and your app access upgrades automatically.'
          }].map((step, idx) => <div key={idx} className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50">
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center mb-4 text-[#BFFF00]">
                  <step.icon className="w-6 h-6" />
                </div>
                <h4 className="text-white font-bold mb-2">{idx + 1}. {step.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Modules</h2>
            <p className="text-slate-400 text-lg">Courses span the full breadth of the platform, from subsurface engineering to the business of energy, with every course built around a real app.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MODULES.map((module, idx) => <motion.div key={idx} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: (idx % 4) * 0.08,
            duration: 0.4
          }} className={`relative p-6 rounded-2xl border transition-all group ${module.isNew ? 'bg-[#1E293B]/70 border-[#BFFF00]/25 hover:border-[#BFFF00]/50' : 'bg-[#1E293B]/40 border-slate-800 hover:border-slate-600'}`}>
                {module.isNew && (
                  <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#BFFF00]/15 text-[#BFFF00]">New</span>
                )}
                <div className={`w-12 h-12 rounded-xl ${module.bg} flex items-center justify-center mb-5 ${module.color} group-hover:scale-110 transition-transform duration-300`}>
                  <module.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{module.name}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{module.desc}</p>
                {module.coming && (
                  <div className="mt-4 pt-3 border-t border-slate-700/60">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Coming soon</p>
                    <ul className="space-y-1">
                      {module.coming.map((app, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                          <span className="mt-1.5 w-1 h-1 rounded-full shrink-0 bg-[#BFFF00]/70"></span>
                          {app}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-[#0B1221] border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Fees</h2>
            <p className="text-slate-400 text-lg">One fee per course tier. Campus scholars enter on a scholarship via their university's cohort code and pay only a small personal registration fee.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Subsurface & Engineering */}
            <div className="bg-[#162032] rounded-3xl p-8 border border-slate-800">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Subsurface &amp; Engineering</h3>
              </div>

              <div className="space-y-6">
                {[{
                tier: 'Beginner → Associate',
                fee: '₦60,000',
                usd: '≈ $40'
              }, {
                tier: 'Intermediate → Professional',
                fee: '₦120,000',
                usd: '≈ $80'
              }, {
                tier: 'Advanced → Expert',
                fee: '₦200,000',
                usd: '≈ $130'
              }].map((row, i) => <div key={i} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-bold">{row.tier.split(' → ')[0]}</h4>
                      <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">{row.tier.split(' → ')[1]} certification</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-[#BFFF00]">{row.fee}</span>
                      <p className="text-xs text-slate-500">{row.usd}</p>
                    </div>
                  </div>)}
              </div>
            </div>

            {/* Energy Business & Society */}
            <div className="bg-[#162032] rounded-3xl p-8 border border-slate-800">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-emerald-500/10 rounded-lg">
                  <Briefcase className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Energy Business &amp; Society</h3>
              </div>

              <div className="space-y-6">
                {[{
                tier: 'Beginner → Associate',
                fee: '₦40,000',
                usd: '≈ $27'
              }, {
                tier: 'Intermediate → Professional',
                fee: '₦75,000',
                usd: '≈ $50'
              }, {
                tier: 'Advanced → Expert',
                fee: '₦120,000',
                usd: '≈ $80'
              }].map((row, i) => <div key={i} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-bold">{row.tier.split(' → ')[0]}</h4>
                      <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">{row.tier.split(' → ')[1]} certification</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-[#BFFF00]">{row.fee}</span>
                      <p className="text-xs text-slate-500">{row.usd}</p>
                    </div>
                  </div>)}
              </div>
            </div>
          </div>

          <p className="text-center text-slate-500 mt-10 text-sm">
            Fees are charged in Naira via secure Paystack checkout. US-dollar figures are indicative equivalents.
          </p>
        </div>
      </section>

      {/* Verifiable Certificates */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#BFFF00]/10 mb-6">
            <BadgeCheck className="w-8 h-8 text-[#BFFF00]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Certificates Anyone Can Verify</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Every certificate carries a unique verification code, so employers and universities can confirm a credential in seconds without creating an account. Certifications are valid for 12 months and renewable through re-certification.
          </p>
          <Link to="/verify">
            <Button variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white">
              Verify a Certificate
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Responsible Use - Red Accent Section */}
      <section className="py-16 bg-red-950/10 border-y border-red-900/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-6">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Academic Integrity &amp; Responsible Use</h2>
          <p className="text-slate-300 mb-6">
            Accounts are individual and non-transferable, limited to two registered devices, with session activity monitored. Learning Mode uses the provided teaching datasets only. Sharing credentials or using the platform for commercial gain results in immediate termination of access.
          </p>
          <div className="text-sm text-red-400 font-semibold uppercase tracking-wide">
            Zero Tolerance Policy
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#BFFF00]/10 to-emerald-500/10 opacity-30"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to start your first course?</h2>
          <p className="text-xl text-slate-300 mb-10">Create your account, enroll through the door that fits you, and start learning inside the real tools today.</p>
          <Link to="/register">
            <Button size="lg" className="h-16 px-12 bg-[#BFFF00] text-black hover:bg-[#a3d900] font-bold text-xl rounded-full shadow-2xl shadow-[#BFFF00]/20 hover:scale-105 transition-transform">
              Create Your Account
            </Button>
          </Link>
          <p className="mt-8 text-slate-400">
            Representing a university? Partner with us on Campus cohort scholarships at{' '}
            <a href="mailto:info@petrolord.com" className="text-[#BFFF00] hover:underline inline-flex items-center gap-1">
              <Mail className="w-4 h-4" /> info@petrolord.com
            </a>
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};
export default LandingPage;
