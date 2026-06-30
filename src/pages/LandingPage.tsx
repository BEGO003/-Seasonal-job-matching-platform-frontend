import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Users,
  MessageCircle,
  Shield,
  Globe,
  CreditCard,
  Smartphone,
  BarChart3,
  FileText,
  Search,
  ArrowRight,
  Download,
  ChevronDown,
  Star,
  Sparkles,
  Moon,
  Sun,
  Palette,
} from "lucide-react";

type Theme = "dark" | "lavender" | "light";

/* ------------------------------------------------------------------ */
/*  Animated section wrapper – fades + slides children into view      */
/* ------------------------------------------------------------------ */
function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Floating particles background                                      */
/* ------------------------------------------------------------------ */
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 6 + 2,
            height: Math.random() * 6 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `hsla(265, 70%, 55%, ${Math.random() * 0.35 + 0.15})`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Feature card                                                       */
/* ------------------------------------------------------------------ */
function FeatureCard({
  icon: Icon,
  title,
  description,
  gradient,
  delay = 0,
}: {
  icon: any;
  title: string;
  description: string;
  gradient: string;
  delay?: number;
}) {
  return (
    <AnimatedSection delay={delay}>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="group relative rounded-2xl border border-white/70 bg-white/55 backdrop-blur-xl p-7 h-full overflow-hidden shadow-lg shadow-purple-900/5"
      >
        {/* Glow effect on hover */}
        <div
          className={`absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 ${gradient} blur-3xl -z-10`}
        />

        <div
          className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${gradient} mb-5 shadow-lg`}
        >
          <Icon className="w-7 h-7 text-white" />
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed text-sm">{description}</p>

        {/* Subtle corner highlight */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/60 to-transparent rounded-bl-full" />
      </motion.div>
    </AnimatedSection>
  );
}

/* ------------------------------------------------------------------ */
/*  Team member card                                                   */
/* ------------------------------------------------------------------ */
function TeamMemberCard({
  name,
  role,
  delay = 0,
}: {
  name: string;
  role: string;
  delay?: number;
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <AnimatedSection delay={delay} className="h-full">
      <motion.div
        whileHover={{ y: -6, scale: 1.04 }}
        className="relative group h-full"
      >
        <div className="relative h-full flex flex-col items-center gap-4 p-6 rounded-2xl border border-white/70 bg-white/55 backdrop-blur-sm hover:bg-white/75 transition-all duration-300 shadow-md shadow-purple-900/5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-purple-500/30">
              {initials}
            </div>
            <motion.div
              className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 -z-10 opacity-0 group-hover:opacity-50 blur-md transition-opacity duration-300"
            />
          </div>
          <div className="text-center flex flex-col items-center justify-start gap-1 w-full">
            <p className="text-slate-900 font-semibold text-lg leading-tight min-h-[3.5rem] flex items-center">
              {name}
            </p>
            <p className="text-purple-700/90 text-xs font-medium uppercase tracking-wider leading-snug min-h-[2rem] flex items-center">
              {role}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatedSection>
  );
}

/* ------------------------------------------------------------------ */
/*  Stat counter (animates number)                                     */
/* ------------------------------------------------------------------ */
function StatCounter({
  value,
  suffix,
  label,
  delay = 0,
}: {
  value: number;
  suffix: string;
  label: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
    const duration = 2000;
    const stepTime = Math.max(Math.floor(duration / end), 20);
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <AnimatedSection delay={delay}>
      <div ref={ref} className="text-center">
        <div className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          {count}
          {suffix}
        </div>
        <p className="text-slate-600 mt-2 text-sm uppercase tracking-wider">
          {label}
        </p>
      </div>
    </AnimatedSection>
  );
}

/* ================================================================== */
/*  LANDING PAGE                                                       */
/* ================================================================== */
export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  const features = [
    {
      icon: Briefcase,
      title: "Smart Job Posting",
      description:
        "Create, edit, and manage seasonal job listings with rich details — categories, requirements, benefits, salary types and more.",
      gradient: "bg-gradient-to-br from-purple-600 to-indigo-600",
    },
    {
      icon: Users,
      title: "Application Management",
      description:
        "Track every applicant in real-time. Accept, reject, or schedule interviews — all from a single, intuitive dashboard.",
      gradient: "bg-gradient-to-br from-blue-600 to-cyan-600",
    },
    {
      icon: MessageCircle,
      title: "Q&A Discussion Threads",
      description:
        "Built-in threaded Q&A on every job post lets employers and candidates communicate seamlessly with replies and nested discussions.",
      gradient: "bg-gradient-to-br from-emerald-600 to-teal-600",
    },
    {
      icon: FileText,
      title: "Resume & Profile Viewer",
      description:
        "Employers can view candidate resumes and detailed profiles right inside the platform — no external tools needed.",
      gradient: "bg-gradient-to-br from-orange-500 to-amber-600",
    },
    {
      icon: CreditCard,
      title: "Credit & Payment System",
      description:
        "Integrated Stripe-powered credit system. Purchase job posting credits and manage your budget with transparent pricing.",
      gradient: "bg-gradient-to-br from-pink-600 to-rose-600",
    },
    {
      icon: Globe,
      title: "Bilingual Support",
      description:
        "Full English & Arabic language support with real-time switching. Every label, button, and message is localized.",
      gradient: "bg-gradient-to-br from-violet-600 to-purple-600",
    },
    {
      icon: BarChart3,
      title: "Dashboard & Analytics",
      description:
        "At-a-glance stats for total jobs, applications, active listings, and views. Data-driven decision making made simple.",
      gradient: "bg-gradient-to-br from-indigo-600 to-blue-600",
    },
    {
      icon: Smartphone,
      title: "Mobile App for Employees",
      description:
        "Dedicated Android app lets employees browse jobs, apply instantly, and track applications — all from their phone.",
      gradient: "bg-gradient-to-br from-fuchsia-600 to-pink-600",
    },
    {
      icon: Shield,
      title: "Secure Authentication",
      description:
        "JWT-based login with form validation, secure sign-up flow, and role-based access control to protect employer data.",
      gradient: "bg-gradient-to-br from-slate-600 to-gray-600",
    },
  ];

  // ── Team members: REPLACE these with the real names & roles ──
  const teamMembers = [
    { name: "Abdelrahman Mohamed", role: "Mobile Developer" },
    { name: "Ahmed Bahig", role: "DevOps Engineer" },
    { name: "Ahmed Hossam", role: "AI Engineer" },
    { name: "Baher Adawy", role: "Backend Developer" },
    { name: "Moataz Fahmy", role: "Frontend Developer" },
  ];

  return (
    <div
      className="min-h-screen text-slate-900 overflow-x-hidden font-sans relative"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.35)), url('https://t4.ftcdn.net/jpg/05/97/49/09/360_F_597490918_dugDbSuqx6YSRmCaYiZJ6pCr37cXK3Rv.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* ── Sticky navbar ───────────────────────────────────── */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/60 border-b border-white/40 shadow-sm shadow-purple-900/5"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">
              HireConnect
            </span>
          </div>

          {/* CTA buttons */}
          <div className="flex items-center gap-3">
            <a
              href="#download"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-slate-700 hover:text-slate-900 border border-slate-300/70 hover:border-purple-400 transition-all duration-300 hover:bg-white/70"
            >
              <Download className="w-4 h-4" />
              Download APK
            </a>
            <Link
              to="/signin"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/30 transition-all duration-300 hover:shadow-purple-500/50 hover:scale-105"
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center justify-center pt-20"
      >
        <FloatingParticles />

        {/* Large radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-400/25 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-indigo-400/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-400/50 bg-white/60 text-purple-700 text-sm font-medium mb-8 shadow-sm shadow-purple-500/10 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4" />
              Seasonal Job Matching Platform
            </motion.div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] mb-6">
              <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                Connect the
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                Right Talent
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-700 max-w-2xl mx-auto mb-10 leading-relaxed">
              A modern platform bridging employers and seasonal workers.
              Post&nbsp;jobs, manage applications, and hire — all in one
              beautiful&nbsp;experience.
            </p>
          </motion.div>

          {/* Hero CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/signin"
              id="hero-signin-btn"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-xl shadow-purple-600/40 transition-all duration-300 hover:shadow-purple-500/60 hover:scale-105"
            >
              Employer Sign In
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#download"
              id="hero-download-btn"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full text-lg font-semibold text-slate-800 border-2 border-purple-300 hover:border-purple-500 bg-white/60 hover:bg-white/80 backdrop-blur-sm transition-all duration-300 hover:scale-105 shadow-sm shadow-purple-500/10"
            >
              <Download className="w-5 h-5" />
              Download Employee App
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-6 h-6 text-slate-600" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ── Stats bar ────────────────────────────────────────── */}
      <section className="relative py-20 border-y border-white/40 bg-white/20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10">
          <StatCounter value={9} suffix="+" label="Core Features" delay={0} />
          <StatCounter value={2} suffix="" label="Platforms" delay={0.1} />
          <StatCounter value={2} suffix="" label="Languages" delay={0.2} />
          <StatCounter value={5} suffix="" label="Team Members" delay={0.3} />
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="relative py-24" id="features">
        {/* Background glow */}
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-purple-400/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-400/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-purple-700 font-semibold text-sm tracking-widest uppercase mb-3">
              Features
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold">
              <span className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                Everything You Need
              </span>
            </h2>
            <p className="text-slate-600 mt-4 max-w-xl mx-auto">
              A comprehensive suite of tools for employers and seasonal workers
              to connect, communicate, and collaborate.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <FeatureCard
                key={f.title}
                icon={f.icon}
                title={f.title}
                description={f.description}
                gradient={f.gradient}
                delay={i * 0.08}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────── */}
      <section className="relative py-24 border-t border-white/40">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-indigo-700 font-semibold text-sm tracking-widest uppercase mb-3">
              How It Works
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold">
              <span className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                Simple Steps to Get Started
              </span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Account",
                desc: "Sign up as an employer on web or download the employee mobile app.",
                icon: Users,
              },
              {
                step: "02",
                title: "Post or Browse Jobs",
                desc: "Employers create detailed seasonal job listings. Employees browse and apply from their phone.",
                icon: Search,
              },
              {
                step: "03",
                title: "Hire & Connect",
                desc: "Review applications, schedule interviews, and hire the perfect seasonal workers.",
                icon: Star,
              },
            ].map((item, i) => (
              <AnimatedSection key={item.step} delay={i * 0.15}>
                <div className="relative text-center p-8">
                  {/* Step number */}
                  <div className="text-7xl font-black text-purple-900/[0.08] absolute top-0 left-1/2 -translate-x-1/2">
                    {item.step}
                  </div>
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/30 to-indigo-500/30 border border-purple-400/40 mb-6 backdrop-blur-sm shadow-sm shadow-purple-500/20">
                      <item.icon className="w-7 h-7 text-purple-700" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Download Section ─────────────────────────────────── */}
      <section id="download" className="relative py-24 border-t border-white/40">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-400/10 to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection>
            <div className="relative rounded-3xl border border-white/70 bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl p-10 md:p-16 text-center overflow-hidden shadow-xl shadow-purple-900/10">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-400/15 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/15 rounded-full blur-[60px] pointer-events-none" />

              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-600 mb-8 shadow-2xl shadow-purple-600/40">
                  <Smartphone className="w-10 h-10 text-white" />
                </div>

                <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                  <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Get the Employee App
                  </span>
                </h2>
                <p className="text-slate-600 max-w-md mx-auto mb-8 leading-relaxed">
                  Download the Android app and start browsing seasonal jobs,
                  apply with one tap, and track your applications in real-time.
                </p>

                <motion.a
                  href="https://github.com/Seasonal-job-matching-platform/Seasonal-job-matching-platform-mobile-app/releases/download/v25/app-release.apk"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-xl shadow-purple-600/40 transition-shadow duration-300 hover:shadow-purple-500/60"
                  id="download-apk-btn"
                >
                  <Download className="w-5 h-5" />
                  Download APK
                </motion.a>

                <p className="text-xs text-slate-500 mt-4">
                  Version 1.1.0
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────── */}
      <section className="relative py-24 border-t border-white/40" id="team">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-purple-700 font-semibold text-sm tracking-widest uppercase mb-3">
              Our Team
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold">
              <span className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                Built With Passion
              </span>
            </h2>
            <p className="text-slate-600 mt-4 max-w-lg mx-auto">
              Meet the talented team behind HireConnect.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {teamMembers.map((member, i) => (
              <TeamMemberCard key={member.name} name={member.name} role={member.role} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-white/40 py-12 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm shadow-purple-500/30">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-800">HireConnect</span>
            </div>
            <p className="text-sm text-slate-600">
              © {new Date().getFullYear()} HireConnect — Seasonal Job Matching
              Platform. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link
                to="/TermsConditions"
                className="text-sm text-slate-600 hover:text-purple-700 transition-colors"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
