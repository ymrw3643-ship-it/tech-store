import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowRight,
  Award,
  BookOpen,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CirclePlay,
  Clock3,
  Code2,
  Download,
  ExternalLink,
  FileCode2,
  Filter,
  Github,
  Globe2,
  GraduationCap,
  Layers3,
  LayoutGrid,
  Linkedin,
  LockKeyhole,
  Mail,
  Menu,
  MessageSquareText,
  MonitorPlay,
  Moon,
  Play,
  Plus,
  Search,
  Send,
  Sparkles,
  Terminal,
  Trophy,
  UserRound,
  X,
  Zap,
} from "lucide-react";

type Course = {
  id: string;
  name: string;
  icon: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  lessons: number;
  duration: string;
  accent: string;
  topics: string[];
};

type Lesson = {
  id: number;
  title: string;
  description: string;
  duration: string;
};

const courses: Course[] = [
  {
    id: "html",
    name: "HTML",
    icon: "</>",
    description: "Build the foundation of the modern web.",
    level: "Beginner",
    lessons: 24,
    duration: "4h 20m",
    accent: "orange",
    topics: ["HTML basics", "Semantic structure", "Forms & tables", "Accessibility", "Real landing page"],
  },
  {
    id: "css",
    name: "CSS",
    icon: "#",
    description: "Turn structure into polished, responsive experiences.",
    level: "Beginner",
    lessons: 32,
    duration: "5h 45m",
    accent: "blue",
    topics: ["Selectors & cascade", "Flexbox", "CSS Grid", "Responsive design", "Motion systems"],
  },
  {
    id: "javascript",
    name: "JavaScript",
    icon: "JS",
    description: "Make interfaces feel alive with real logic.",
    level: "Intermediate",
    lessons: 38,
    duration: "7h 10m",
    accent: "yellow",
    topics: ["Modern syntax", "DOM interactions", "Async JavaScript", "Data structures", "Build a dashboard"],
  },
  {
    id: "python",
    name: "Python",
    icon: "Py",
    description: "Think clearly, automate tasks, and prototype ideas.",
    level: "Beginner",
    lessons: 28,
    duration: "5h 05m",
    accent: "green",
    topics: ["Python foundations", "Functions", "Collections", "Automation", "First data project"],
  },
  {
    id: "uiux",
    name: "UI/UX Design",
    icon: "✦",
    description: "Design interfaces people understand and enjoy.",
    level: "Intermediate",
    lessons: 18,
    duration: "3h 50m",
    accent: "pink",
    topics: ["Visual hierarchy", "Design systems", "Wireframes", "Prototyping", "Developer handoff"],
  },
  {
    id: "git",
    name: "Git & GitHub",
    icon: "⌘",
    description: "Build confidence with the tools behind every team.",
    level: "Beginner",
    lessons: 16,
    duration: "2h 40m",
    accent: "purple",
    topics: ["Version control", "Branches", "Pull requests", "Team workflows", "Ship your portfolio"],
  },
];

const lessons: Lesson[] = [
  { id: 1, title: "Welcome to the web", description: "Understand how browsers, HTML, and the web work together.", duration: "08:24" },
  { id: 2, title: "Your first HTML document", description: "Create a clean document structure that browsers can understand.", duration: "12:10" },
  { id: 3, title: "Elements & attributes", description: "Learn the building blocks that make every page meaningful.", duration: "16:42" },
  { id: 4, title: "Structure with semantic HTML", description: "Build pages that are clear, accessible, and future-friendly.", duration: "19:05" },
  { id: 5, title: "Build a profile card", description: "Apply the fundamentals in a small real-world project.", duration: "24:31" },
];

const projectData = [
  { name: "Landing Page", description: "A focused launch page with strong hierarchy.", tech: ["HTML", "CSS"], icon: "↗", tone: "coral" },
  { name: "Portfolio", description: "Showcase your work with a memorable personal site.", tech: ["HTML", "CSS", "JS"], icon: "◌", tone: "blue" },
  { name: "Tech Store", description: "A product browsing experience with filters.", tech: ["JS", "UI/UX"], icon: "▦", tone: "violet" },
  { name: "Book Gallery", description: "Organize a beautiful library of things you love.", tech: ["CSS", "JS"], icon: "▤", tone: "mint" },
  { name: "JavaScript Apps", description: "A collection of small apps that solve real problems.", tech: ["JS", "API"], icon: "⌘", tone: "amber" },
];

const defaultProgress: Record<string, number> = { html: 75, css: 60, javascript: 35, python: 10, uiux: 0, git: 0 };

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [progress, setProgress] = useState(defaultProgress);
  const [toast, setToast] = useState("");
  const [contactState, setContactState] = useState<"idle" | "sending" | "success" | "error">("idle");

  useEffect(() => {
    const savedProgress = localStorage.getItem("codenova-progress");
    const savedLessons = localStorage.getItem("codenova-lessons");
    if (savedProgress) setProgress({ ...defaultProgress, ...JSON.parse(savedProgress) });
    if (savedLessons) setCompletedLessons(JSON.parse(savedLessons));
  }, []);

  useEffect(() => {
    localStorage.setItem("codenova-progress", JSON.stringify(progress));
    localStorage.setItem("codenova-lessons", JSON.stringify(completedLessons));
  }, [progress, completedLessons]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const filteredCourses = useMemo(() => courses.filter((course) => {
    const matchesFilter = activeFilter === "All" || course.level === activeFilter;
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = !term || `${course.name} ${course.description} ${course.level}`.toLowerCase().includes(term);
    return matchesFilter && matchesSearch;
  }), [activeFilter, searchTerm]);

  const openCourse = (course: Course) => {
    setSelectedCourse(course);
    setActiveLesson(0);
    document.body.style.overflow = "hidden";
  };

  const closeCourse = () => {
    setSelectedCourse(null);
    document.body.style.overflow = "auto";
  };

  const markLessonComplete = () => {
    const lessonId = lessons[activeLesson].id;
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons((current) => [...current, lessonId]);
      setProgress((current) => ({ ...current, html: Math.min(100, current.html + 5) }));
      setToast("Lesson complete — your progress has been saved.");
    } else {
      setToast("This lesson is already complete.");
    }
  };

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const showToast = (message: string) => setToast(message);

  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      setContactState("error");
      setToast("Please complete all required fields with a valid email.");
      return;
    }
    setContactState("sending");
    window.setTimeout(() => {
      setContactState("success");
      form.reset();
      setToast("Message ready — connect EmailJS to send it for real.");
    }, 900);
  };

  return (
    <div className="app-shell">
      <div className="noise" aria-hidden="true" />
      <header className="site-header">
        <div className="page-container header-inner">
          <button className="brand" onClick={() => scrollTo("home")} aria-label="Go to CodeNova home">
            <span className="brand-mark"><Code2 size={18} /></span>
            <span><strong>CodeNova</strong><small>Academy</small></span>
          </button>
          <nav className={`main-nav ${mobileOpen ? "is-open" : ""}`} aria-label="Main navigation">
            <button onClick={() => scrollTo("home")}>Home</button>
            <button onClick={() => scrollTo("courses")}>Courses</button>
            <button onClick={() => scrollTo("path")}>Learning Path</button>
            <button onClick={() => scrollTo("about")}>About</button>
            <button onClick={() => scrollTo("projects")}>Projects</button>
            <button onClick={() => scrollTo("contact")}>Contact</button>
          </nav>
          <div className="header-actions">
            <button className="login-link" onClick={() => showToast("Account access is coming in the next build.")}>Log in</button>
            <button className="button button-small button-primary" onClick={() => scrollTo("courses")}>Start learning <ArrowRight size={15} /></button>
          </div>
          <button className="menu-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu" aria-expanded={mobileOpen}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <main>
        <section id="home" className="hero section-pad">
          <div className="page-container hero-grid">
            <div className="hero-copy reveal">
              <div className="eyebrow"><span className="eyebrow-dot" /> The new way to learn code</div>
              <h1>Learn <span className="muted-word">the logic.</span><br /><em>Build</em> the future.</h1>
              <p className="hero-lead">A practical programming academy for curious minds. Learn the fundamentals, build work you are proud of, and create your own momentum.</p>
              <div className="hero-actions">
                <button className="button button-primary" onClick={() => scrollTo("courses")}>Explore courses <ArrowRight size={17} /></button>
                <button className="button button-ghost" onClick={() => scrollTo("path")}><CirclePlay size={17} /> See how it works</button>
              </div>
              <div className="hero-trust"><div className="avatar-stack"><span>AK</span><span>MY</span><span>+</span></div><span>Built for beginners.<br /><strong>No experience needed.</strong></span></div>
            </div>
            <div className="hero-visual reveal reveal-delay">
              <div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" />
              <div className="code-window">
                <div className="window-bar"><div className="window-dots"><i /><i /><i /></div><span>codenova / first-project.js</span><LockKeyhole size={13} /></div>
                <div className="code-content"><div className="line-number">01<br />02<br />03<br />04<br />05<br />06<br />07<br />08</div><pre><span className="code-purple">const</span> <span className="code-blue">future</span> <span className="code-white">=</span> <span className="code-green">"CodeNova"</span><span className="code-white">;</span>{"\n"}<span className="code-purple">const</span> <span className="code-blue">learner</span> <span className="code-white">=</span> <span className="code-yellow">{`{`}</span>{"\n  "}<span className="code-blue">curiosity</span><span className="code-white">:</span> <span className="code-orange">true</span><span className="code-white">,</span>{"\n  "}<span className="code-blue">pace</span><span className="code-white">:</span> <span className="code-green">"your own"</span>{"\n"}<span className="code-yellow">{`}`}</span><span className="code-white">;</span>{"\n\n"}<span className="code-purple">await</span> <span className="code-blue">learn</span><span className="code-white">();</span>{"\n"}<span className="code-purple">await</span> <span className="code-blue">build</span><span className="code-white">();</span>{"\n"}<span className="code-purple">await</span> <span className="code-blue">create</span><span className="code-white">();</span><span className="cursor" /></pre></div>
                <div className="window-footer"><span><span className="status-dot" /> Live learning environment</span><span>Ln 08, Col 18</span></div>
              </div>
              <div className="floating-card floating-progress"><div className="mini-icon cyan"><Zap size={15} /></div><div><small>Learning streak</small><strong>07 days <span>↗</span></strong></div></div>
              <div className="floating-card floating-ai"><Sparkles size={15} /><span>Clarity, not shortcuts.</span></div>
            </div>
          </div>
          <div className="page-container hero-bottom"><div className="scroll-hint"><span className="scroll-line" /> Scroll to explore</div><div className="hero-meta"><span>01</span><i /><span>CodeNova Academy / 2026</span></div></div>
        </section>

        <section className="logo-strip"><div className="page-container logo-strip-inner"><span className="strip-label">A learning system that respects your time</span><div className="strip-items"><span><Terminal size={16} /> PRACTICE</span><span><Layers3 size={16} /> STRUCTURE</span><span><Globe2 size={16} /> SHIP</span><span><Award size={16} /> GROW</span></div></div></section>

        <section id="about" className="section-pad section-light">
          <div className="page-container">
            <div className="section-heading split-heading"><div><span className="section-kicker">01 / WHY CODENOVA</span><h2>A calmer way to<br /><span>get good at code.</span></h2></div><p>Less noise. More momentum. CodeNova is built around the moments that make learning stick: clear explanations, deliberate practice, and projects with a purpose.</p></div>
            <div className="feature-grid">
              <article className="feature-card feature-large"><div className="feature-number">01</div><div className="feature-icon"><BookOpen size={21} /></div><h3>Easy learning, <em>actually.</em></h3><p>Complex ideas broken into small, focused steps that make sense from the first line.</p><button className="text-link" onClick={() => scrollTo("path")}>Explore the method <ArrowRight size={15} /></button><div className="card-grid-lines" /></article>
              <article className="feature-card"><div className="feature-number">02</div><div className="feature-icon blue"><LayoutGrid size={21} /></div><h3>Projects over theory.</h3><p>Every concept earns its place by helping you make something real.</p><button className="feature-arrow" onClick={() => scrollTo("projects")} aria-label="View projects"><ArrowRight size={18} /></button></article>
              <article className="feature-card"><div className="feature-number">03</div><div className="feature-icon purple"><Sparkles size={21} /></div><h3>Modern by design.</h3><p>Visual lessons and AI-assisted production that make ideas easier to see.</p><button className="feature-arrow" onClick={() => scrollTo("ai-learning")} aria-label="Learn about AI assisted learning"><ArrowRight size={18} /></button></article>
              <article className="feature-card feature-wide"><div className="feature-number">04</div><div className="wide-copy"><div className="feature-icon green"><Moon size={21} /></div><h3>At your pace, <em>for real.</em></h3><p>Pause, repeat, or jump ahead. Your progress lives in your browser so your next step is always close.</p></div><div className="pace-visual"><span className="pace-label">YOUR PACE</span><div className="pace-track"><i style={{ width: "72%" }} /><b>72%</b></div><span className="pace-caption">Small steps compound.</span></div></article>
            </div>
          </div>
        </section>

        <section id="courses" className="section-pad courses-section">
          <div className="page-container">
            <div className="section-heading courses-heading"><div><span className="section-kicker">02 / EXPLORE COURSES</span><h2>Find your next<br /><span>useful thing.</span></h2></div><div className="search-wrap"><Search size={17} /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search courses..." aria-label="Search courses" /></div></div>
            <div className="filter-row"><div className="filter-tabs"><Filter size={15} />{["All", "Beginner", "Intermediate", "Advanced"].map((filter) => <button key={filter} className={activeFilter === filter ? "active" : ""} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div><span className="results-count">{filteredCourses.length} learning paths</span></div>
            <div className="course-grid">{filteredCourses.map((course, index) => <CourseCard key={course.id} course={course} index={index} progress={progress[course.id]} onOpen={openCourse} />)}</div>
            {filteredCourses.length === 0 && <div className="empty-state"><Search size={24} /><h3>No courses found.</h3><p>Try a different keyword or reset the filters.</p><button className="button button-ghost" onClick={() => { setSearchTerm(""); setActiveFilter("All"); }}>Reset search</button></div>}
            <div className="course-footnote"><span><Check size={15} /> Progress saved locally</span><span><Check size={15} /> No account required to start</span><span><Check size={15} /> Built for practical learning</span></div>
          </div>
        </section>

        <section id="path" className="section-pad path-section section-light">
          <div className="page-container"><div className="section-heading split-heading"><div><span className="section-kicker">03 / LEARNING PATH</span><h2>One clear path.<br /><span>Many directions.</span></h2></div><p>Start with the foundations, follow your curiosity, and build the confidence to choose what comes next. There is no “perfect” order—just a strong first step.</p></div>
            <div className="roadmap"><div className="roadmap-line" /><RoadmapNode number="01" title="Start here" sub="Build the habit" active /><RoadmapNode number="02" title="HTML + CSS" sub="Shape the web" /><RoadmapNode number="03" title="JavaScript" sub="Add the logic" /><RoadmapNode number="04" title="Git & GitHub" sub="Work like a team" /><RoadmapNode number="05" title="Real projects" sub="Make it yours" /><RoadmapNode number="06" title="Your direction" sub="Keep exploring" last /></div>
            <div className="path-note"><div className="note-icon"><GraduationCap size={19} /></div><div><strong>Not sure where to begin?</strong><p>Start with HTML. It is the shortest route from “I have an idea” to “I can see it on a page.”</p></div><button className="button button-dark" onClick={() => openCourse(courses[0])}>Start with HTML <ArrowRight size={16} /></button></div>
          </div>
        </section>

        <section id="ai-learning" className="section-pad ai-section"><div className="page-container ai-grid"><div className="ai-copy"><span className="section-kicker">04 / LEARNING POWERED BY AI</span><h2>See the idea.<br /><span>Then make it yours.</span></h2><p>We use AI as a creative partner in content design, visual explanation, and video production—so lessons feel clear, intentional, and worth returning to.</p><div className="ai-points"><div><span>01</span><p><strong>Content design</strong>Ideas arranged around how people actually learn.</p></div><div><span>02</span><p><strong>Visual explanation</strong>Abstract concepts turned into something you can see.</p></div><div><span>03</span><p><strong>Learning experience</strong>Less friction between “I’m stuck” and “I get it.”</p></div></div></div><div className="ai-visual"><div className="ai-ring ring-a" /><div className="ai-ring ring-b" /><div className="ai-core"><Sparkles size={26} /><span>AI × HUMAN<br /><b>CLARITY</b></span></div><div className="ai-label label-one"><span className="pulse-dot" /> Visual lessons</div><div className="ai-label label-two">Your thinking stays at the center <span>↗</span></div><div className="ai-code">{`{`}<br /><span>clarity</span>: <b>"first"</b>,<br /><span>practice</span>: <b>true</b><br />{`}`}</div></div></div></section>

        <section id="projects" className="section-pad projects-section section-light"><div className="page-container"><div className="section-heading split-heading"><div><span className="section-kicker">05 / BUILD REAL PROJECTS</span><h2>Proof you can<br /><span>put your hands on.</span></h2></div><p>Learning feels different when it leaves the tutorial. These are the kinds of small, meaningful builds that turn a concept into confidence.</p></div><div className="project-grid">{projectData.map((project) => <article className={`project-card project-${project.tone}`} key={project.name}><div className="project-art"><span>{project.icon}</span><i /></div><div className="project-info"><div className="project-meta"><span>PROJECT / 0{projectData.indexOf(project) + 1}</span><ExternalLink size={14} /></div><h3>{project.name}</h3><p>{project.description}</p><div className="tech-row">{project.tech.map((tech) => <span key={tech}>{tech}</span>)}</div><button className="text-link" onClick={() => showToast(`${project.name} preview will open when project links are connected.`)}>View project <ArrowRight size={15} /></button></div></article>)}</div></div></section>

        <section className="section-pad practice-section"><div className="page-container practice-grid"><div className="practice-intro"><span className="section-kicker">06 / PRACTICE & BUILD</span><h2>One challenge.<br /><span>One more unlock.</span></h2><p>Short prompts, specific requirements, and enough room to make the solution yours.</p><button className="button button-primary" onClick={() => showToast("Challenge started — open your editor and make it responsive.")}>Start challenge <ArrowRight size={16} /></button></div><div className="challenge-card"><div className="challenge-top"><span className="challenge-tag"><Terminal size={14} /> CHALLENGE / 001</span><span className="challenge-level">BEGINNER</span></div><div className="challenge-body"><div className="challenge-icon"><Code2 size={24} /></div><h3>Create a responsive navigation bar.</h3><p>Build a navigation bar that feels effortless on every screen size.</p><div className="requirements"><span>Requirements</span><div><b><Check size={13} /> HTML</b><b><Check size={13} /> CSS</b><b><Check size={13} /> JavaScript</b></div></div></div><div className="challenge-footer"><span><Clock3 size={14} /> ~30 min</span><button className="icon-button" onClick={() => showToast("Challenge started — good luck.")} aria-label="Start challenge"><ArrowRight size={18} /></button></div></div></div></section>

        <section className="section-pad dashboard-section section-light"><div className="page-container"><div className="section-heading dashboard-heading"><div><span className="section-kicker">07 / YOUR DASHBOARD</span><h2>Welcome back, <span>builder.</span></h2></div><button className="button button-ghost" onClick={() => showToast("Your progress is stored in this browser.")}><Download size={16} /> Export progress</button></div><div className="dashboard-grid"><div className="dashboard-main panel"><div className="panel-header"><div><span className="panel-label">YOUR LEARNING PROGRESS</span><h3>Keep the momentum.</h3></div><span className="dashboard-date">LOCAL PROFILE / 2026</span></div><div className="progress-list">{courses.slice(0, 4).map((course) => <div className="progress-row" key={course.id}><div className={`course-mini-icon ${course.accent}`}>{course.icon}</div><div className="progress-name"><strong>{course.name}</strong><span>{progress[course.id] > 0 ? `${Math.round(progress[course.id] / 5)} lessons completed` : "Ready when you are"}</span></div><div className="progress-track"><i style={{ width: `${progress[course.id]}%` }} /></div><strong className="progress-value">{progress[course.id]}%</strong><button className="progress-continue" onClick={() => openCourse(course)} aria-label={`Continue ${course.name}`}><ChevronRight size={16} /></button></div>)}</div></div><div className="dashboard-side panel"><div className="side-stat"><div className="stat-icon cyan"><Trophy size={19} /></div><div><span>COMPLETED LESSONS</span><strong>{completedLessons.length.toString().padStart(2, "0")}</strong></div></div><div className="side-stat"><div className="stat-icon purple"><Zap size={19} /></div><div><span>CURRENT STREAK</span><strong>07 days</strong></div></div><div className="achievements-mini"><div className="panel-header"><span className="panel-label">ACHIEVEMENTS</span><button className="text-link" onClick={() => scrollTo("achievements")}>View all <ArrowRight size={14} /></button></div><div className="badge-row"><span className="achievement-badge earned"><Check size={17} /></span><span className="achievement-badge earned"><Code2 size={17} /></span><span className="achievement-badge"><Award size={17} /></span><span className="achievement-badge"><LockKeyhole size={15} /></span></div></div></div></div></div></section>

        <section id="achievements" className="section-pad achievements-section"><div className="page-container achievements-wrap"><div><span className="section-kicker">08 / YOUR ACHIEVEMENTS</span><h2>Small wins.<br /><span>Visible progress.</span></h2></div><div className="achievements-grid"><Achievement icon={<Play size={18} />} title="First Lesson" status={completedLessons.length > 0 ? "Unlocked" : "Start a lesson"} unlocked={completedLessons.length > 0} /><Achievement icon={<Layers3 size={18} />} title="First Project" status="Build a project" /><Achievement icon={<Code2 size={18} />} title="HTML Master" status={`${progress.html}% complete`} unlocked={progress.html >= 100} /><Achievement icon={<Zap size={18} />} title="JavaScript Starter" status={`${progress.javascript}% complete`} unlocked={progress.javascript > 0} /></div></div></section>

        <section className="section-pad stats-section"><div className="page-container stats-grid"><div><span className="section-kicker">09 / THE ACADEMY</span><h2>Built for the<br /><span>long game.</span></h2></div><div className="stat-item"><strong>00<span>+</span></strong><span>Courses</span><small>Growing with intent</small></div><div className="stat-item"><strong>00<span>+</span></strong><span>Lessons</span><small>No filler, just clarity</small></div><div className="stat-item"><strong>00<span>+</span></strong><span>Projects</span><small>Made to be shipped</small></div></div></section>

        <section id="contact" className="section-pad contact-section section-light"><div className="page-container contact-grid"><div className="contact-copy"><span className="section-kicker">10 / SAY HELLO</span><h2>Let’s make<br /><span>something useful.</span></h2><p>Have a question, an idea, or a project you want to talk through? Send a note. We’ll get back to you when the signal comes through.</p><div className="contact-details"><div><div className="detail-icon"><Mail size={16} /></div><span>EMAIL<br /><strong>hello@codenova.academy</strong></span></div><div><div className="detail-icon"><MessageSquareText size={16} /></div><span>RESPONSE TIME<br /><strong>Usually within 2–3 days</strong></span></div></div></div><form className="contact-form" onSubmit={submitContact} noValidate><div className="form-row"><label>Name<input name="name" required placeholder="Your name" /></label><label>Email<input name="email" type="email" required placeholder="you@example.com" /></label></div><label>Subject<input name="subject" required placeholder="What is on your mind?" /></label><label>Message<textarea name="message" required minLength={20} rows={5} placeholder="Tell us a little more..." /></label><div className="form-footer"><span>We never share your details.</span><button className="button button-primary" disabled={contactState === "sending"}>{contactState === "sending" ? "Sending..." : contactState === "success" ? "Message ready" : "Send message"}<Send size={15} /></button></div>{contactState === "error" && <p className="form-error">Please check the fields above and write at least 20 characters.</p>}{contactState === "success" && <p className="form-success"><Check size={15} /> Success state shown. Add your EmailJS keys in the project configuration to send for real.</p>}</form></div></section>
      </main>

      <footer className="site-footer"><div className="page-container footer-grid"><div><button className="brand footer-brand" onClick={() => scrollTo("home")}><span className="brand-mark"><Code2 size={18} /></span><span><strong>CodeNova</strong><small>Academy</small></span></button><p>Learn <span>•</span> Build <span>•</span> Create</p></div><div className="footer-links"><span>Explore</span><button onClick={() => scrollTo("courses")}>Courses</button><button onClick={() => scrollTo("path")}>Learning Path</button><button onClick={() => scrollTo("projects")}>Projects</button></div><div className="footer-links"><span>Connect</span><button onClick={() => scrollTo("contact")}>Contact</button><button onClick={() => showToast("Social links will be added here soon.")}>Instagram</button><button onClick={() => showToast("Social links will be added here soon.")}>LinkedIn</button></div><div className="footer-note"><span>CodeNova Academy</span><p>Learning made practical,<br />one line at a time.</p></div></div><div className="page-container footer-bottom"><span>© 2026 CodeNova Academy. All rights reserved.</span><span>Designed for curious minds <span className="heart">✦</span></span></div></footer>

      {selectedCourse && <CourseModal course={selectedCourse} activeLesson={activeLesson} completedLessons={completedLessons} onLessonChange={setActiveLesson} onComplete={markLessonComplete} onClose={closeCourse} />}
      {toast && <div className="toast" role="status"><Check size={16} /> {toast}</div>}
    </div>
  );
}

function CourseCard({ course, index, progress, onOpen }: { course: Course; index: number; progress: number; onOpen: (course: Course) => void }) {
  return <article className={`course-card accent-${course.accent}`} style={{ animationDelay: `${index * 50}ms` }}><div className="course-card-top"><div className={`course-icon ${course.accent}`}>{course.icon}</div><span className="course-level">{course.level}</span></div><h3>{course.name}</h3><p>{course.description}</p><div className="course-details"><span><BookOpen size={14} /> {course.lessons} lessons</span><span><Clock3 size={14} /> {course.duration}</span></div><div className="course-progress-label"><span>{progress > 0 ? "Your progress" : "Ready to start"}</span><strong>{progress}%</strong></div><div className="course-progress"><i style={{ width: `${progress}%` }} /></div><button className="course-button" onClick={() => onOpen(course)}>{progress > 0 ? "Continue course" : "View course"}<ArrowRight size={15} /></button></article>;
}

function RoadmapNode({ number, title, sub, active = false, last = false }: { number: string; title: string; sub: string; active?: boolean; last?: boolean }) {
  return <div className={`roadmap-node ${active ? "active" : ""} ${last ? "last" : ""}`}><div className="node-number">{active ? <Play size={13} fill="currentColor" /> : number}</div><strong>{title}</strong><span>{sub}</span></div>;
}

function Achievement({ icon, title, status, unlocked = false }: { icon: ReactNode; title: string; status: string; unlocked?: boolean }) {
  return <div className={`achievement ${unlocked ? "unlocked" : ""}`}><div className="achievement-icon">{icon}</div><div><strong>{title}</strong><span>{status}</span></div>{unlocked && <Check size={15} className="achievement-check" />}</div>;
}

function CourseModal({ course, activeLesson, completedLessons, onLessonChange, onComplete, onClose }: { course: Course; activeLesson: number; completedLessons: number[]; onLessonChange: (index: number) => void; onComplete: () => void; onClose: () => void }) {
  const lesson = lessons[activeLesson];
  const lessonProgress = Math.round(((activeLesson + 1) / lessons.length) * 100);
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={`${course.name} course details`}><div className="course-modal"><button className="modal-close" onClick={onClose} aria-label="Close course details"><X size={20} /></button><div className="modal-hero"><div className={`course-icon large ${course.accent}`}>{course.icon}</div><div><span className="section-kicker">COURSE / {course.level.toUpperCase()}</span><h2>{course.name} <span>Fundamentals</span></h2><p>{course.description} A focused path from first principles to a real, shareable build.</p></div></div><div className="modal-content"><div className="lesson-main"><div className="video-player"><div className="video-grid" /><div className="video-top"><span><span className="status-dot" /> Lesson {String(lesson.id).padStart(2, "0")} / {lessons.length}</span><span>{lesson.duration}</span></div><button className="video-play" onClick={() => onComplete()} aria-label="Play lesson"><Play size={25} fill="currentColor" /></button><div className="video-code">&lt;{course.id === "html" ? "section" : "code"}&gt; <span>learn by building</span> &lt;/{course.id === "html" ? "section" : "code"}&gt;</div><div className="video-controls"><span>00:00</span><div className="video-track"><i style={{ width: `${Math.max(24, lessonProgress / 1.4)}%` }} /></div><span>{lesson.duration}</span></div></div><div className="lesson-heading"><div><span className="section-kicker">NOW PLAYING</span><h3>{lesson.title}</h3><p>{lesson.description}</p></div><button className="button button-primary" onClick={onComplete}>{completedLessons.includes(lesson.id) ? <><Check size={15} /> Completed</> : <>Mark complete <Check size={15} /></>}</button></div><div className="lesson-nav"><button disabled={activeLesson === 0} onClick={() => onLessonChange(Math.max(0, activeLesson - 1))}><ChevronLeft size={16} /> Previous</button><span>{activeLesson + 1} / {lessons.length}</span><button disabled={activeLesson === lessons.length - 1} onClick={() => onLessonChange(Math.min(lessons.length - 1, activeLesson + 1))}>Next lesson <ChevronRight size={16} /></button></div></div><aside className="lesson-sidebar"><div className="sidebar-heading"><span>COURSE LESSONS</span><strong>{lessonProgress}% complete</strong></div><div className="modal-progress"><i style={{ width: `${lessonProgress}%` }} /></div><div className="lesson-list">{lessons.map((item, index) => <button key={item.id} className={`lesson-item ${index === activeLesson ? "current" : ""}`} onClick={() => onLessonChange(index)}><span className="lesson-num">{completedLessons.includes(item.id) ? <Check size={13} /> : String(item.id).padStart(2, "0")}</span><span><strong>{item.title}</strong><small>{item.duration}</small></span><ChevronRight size={14} /></button>)}</div><div className="what-learn"><span>WHAT YOU’LL BUILD</span><ul>{course.topics.map((topic) => <li key={topic}><Check size={13} /> {topic}</li>)}</ul></div></aside></div></div></div>;
}

export default App;

// EmailJS placeholders for the future contact integration:
// EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID
// The current form intentionally demonstrates validation and success states without exposing credentials.
void UserRound;
void Github;
void Linkedin;
void Plus;
void ChevronDown;
void FileCode2;
void MonitorPlay;
void ArrowRight;
void Filter;
void CirclePlay;
void Download;
void LayoutGrid;
void Trophy;
void ExternalLink;
void Moon;
void Globe2;
void Mail;
void MessageSquareText;
void Send;
void Zap;
void Sparkles;
void LockKeyhole;
void Check;
void BookOpen;
void Clock3;
void GraduationCap;
void Layers3;
void Code2;
void Terminal;
void Award;
void Play;
void ChevronLeft;
void ChevronRight;
void X;
void Menu;
void Search;
