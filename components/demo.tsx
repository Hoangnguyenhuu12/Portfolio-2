"use client";

import { useEffect, useState, useRef } from "react";
import GlyphPortal from "@/components/ui/glyph-portal";
import { Menu, X, ChevronDown, Mail, Phone, Copy, Check, ExternalLink } from "lucide-react";

const settings = { word: "HOANG", scrollLength: 2.4, interactive: true, annotations: false };
const family = '"Glyph Portal Jakarta", Arial, sans-serif';
let fontLoad: Promise<void> | undefined;

interface SectionFeature {
  num: string;
  title: string;
  desc: string;
  image?: string;
}

interface SectionData {
  char: string;
  title: string;
  features: SectionFeature[];
}

const sectionData: Record<string, SectionData> = {
  H: {
    char: "H",
    title: "Highlights",
    features: [
      {
        num: "01",
        title: "Who Am I?",
        desc: "Hi, I'm Hoang (Oliver) — an Artificial Intelligence junior at FPT University. I focus on building practical tech projects, from designing AI workflows to organizing tech events. Driven by discipline and a problem-solving mindset, I’m looking for opportunities in a professional environment where I can contribute to real-world products and deepen my AI engineering skills.",
        image: "/sample-card.jpg",
      },
      {
        num: "02",
        title: "What Defines Me?",
        desc: "Patience, discipline, and a quiet focus. I break down complex problems carefully, iterate through mistakes without excuses, and stay dedicated to the process—much like endurance running, pushing forward until crossing the finish line.",
        image: "/sample-card.jpg",
      },
      {
        num: "03",
        title: "What Makes Me Happy?",
        desc: "Four hobbies that keep me balanced: running, vlogging, collecting cars and exploring new things. Above all, my happiness is simply the feeling of finishing a tough race and spending time with my partner and friends.",
        image: "/sample-card.jpg",
      },
    ],
  },
  O: {
    char: "O",
    title: "Overview",
    features: [
      {
        num: "01",
        title: "What Was I Studied?",
        desc: "Graduated from Hoang Hoa Tham High School with a strong passion for Mathematics and early AI exploration. Having previously achieved an IELTS 6.0, I established the analytical mindset and English foundation needed to dive into computer science.",
        image: "/sample-card.jpg",
      },
      {
        num: "02",
        title: "What Am I Studying?",
        desc: "Pursuing Artificial Intelligence at FPT University and hands-on as an AI Engineer Intern. My current focus centers on advanced NLP, RAG workflows, and turning complex document logic into working software—while preparing for a target 800+ TOEIC certification.",
        image: "/sample-card.jpg",
      },
      {
        num: "03",
        title: "What I'm Looking For?",
        desc: "Targeting an AI Software Engineer role at innovative product teams or global enterprises. I thrive in collaborative environments, focusing on transforming complex AI pipelines into impactful products that solve real problems.",
        image: "/sample-card.jpg",
      },
    ],
  },
  A: {
    char: "A",
    title: "Abilities",
    features: [
      {
        num: "01",
        title: "What Can I Build?",
        desc: "• Core Stack: Python (OOP, Data Structures), Database (MySQL, PostgreSQL).\n• AI Systems: RAG, Prompt Engineering, Data Pipelines (Pandas).\n• Backend & Services: FastAPI, RESTful APIs, FAISS vector search.\n• Production Tools: Git/GitHub collaboration, Docker containerization fundamentals.",
        image: "/sample-card.jpg",
      },
      {
        num: "02",
        title: "What Am I Exploring?",
        desc: "• Foundational ML & Vision: Scikit-learn, OpenCV.\n• Web Prototyping: HTML, CSS, JavaScript (DOM, MediaRecorder API) for hackathon prototypes.\n• Developer Environment: Postman API testing, Linux/Bash basics, VS Code workflows.\n• Active R&D: Advanced RAG, Speech-To-Text, Evaluation metrics (Ragas).",
        image: "/sample-card.jpg",
      },
      {
        num: "03",
        title: "How Do I Connect?",
        desc: "• Hackathon Execution: SEAL Hackathon Spring 2026 competitor; co-developed Marketing Agentic RAG system and delivered technical pitch.\n• Event Organizing: ESC 2026 Organizing Committee; awarded 'Top 5 Most Dedicated Members'; led media production.\n• Community Impact: Co-authored an Anti-CV e-book about failures and overcoming them to promote growth mindset.\n• Team Culture: Empathetic, disciplined under deadlines, committed to collective success.",
        image: "/sample-card.jpg",
      },
    ],
  },
  N: {
    char: "N",
    title: "Notable Projects",
    features: [
      {
        num: "01",
        title: "Lendo Stylix (Team)",
        desc: "AI Stylist platform personalized for Asian aesthetics & the Vietnamese market. Engineered a 4-tier architecture incorporating Vision-Language Models (Qwen3-VL + LoRA), Knowledge Graph compatibility routing, and Qdrant vector retrieval for multi-modal fashion matching and personalized outfit recommendations.",
        image: "/sample-card.jpg",
      },
      {
        num: "02",
        title: "Triad Synergy Agentic RAG (Team)",
        desc: "Enterprise-grade Multimodal Agentic RAG system built with LangGraph, ChromaDB, and Vision AI. Features stateful self-correction (CRAG), context-aware query routing, zero-hallucination guardrails, asynchronous PDF table/text extraction, and strict citation enforcement.",
        image: "/sample-card.jpg",
      },
      {
        num: "03",
        title: "HedgeDoc (Personal)",
        desc: "Intelligent NotebookLM-style Retrieval-Augmented Generation (RAG) system for enterprise document intelligence. Designed for legal and financial document exploitation with citation lineage, reasoning trace drawers, and table-structure understanding.",
        image: "/sample-card.jpg",
      },
    ],
  },
  G: {
    char: "G",
    title: "Get In Touch",
    features: [
      {
        num: "01",
        title: "Direct Contact",
        desc: "Always open to discussions on AI projects, technology innovation, and new opportunities. Reach out directly via email at nguyenhuuhoang21092006@gmail.com or phone at +84934363606 (Ho Chi Minh City).",
        image: "/sample-card.jpg",
      },
      {
        num: "02",
        title: "GitHub Repository",
        desc: "Explore my source code, repositories, and technical experiments at github.com/Hoangnguyenhuu12. Feel free to review my code, raise issues, or connect on open-source initiatives.",
        image: "/sample-card.jpg",
      },
      {
        num: "03",
        title: "LinkedIn & Network",
        desc: "Connect with me professionally on LinkedIn at linkedin.com/in/hoang-nguyen-8a641b372. Eager to exchange ideas with engineers, researchers, and mentors in the global tech ecosystem.",
        image: "/sample-card.jpg",
      },
    ],
  },
};

const menuItems = [
  { char: "H", label: "HIGHLIGHTS" },
  { char: "O", label: "OVERVIEW" },
  { char: "A", label: "ABILITIES" },
  { char: "N", label: "NOTABLE PROJECTS" },
  { char: "G", label: "GET IN TOUCH" },
];

export default function Demo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  const [face, setFace] = useState<string | null>(null);
  const [activeChar, setActiveChar] = useState<string>("H");
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [isDark, setIsDark] = useState<boolean>(true);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isInside, setIsInside] = useState<boolean>(false);
  const [hoveredMenuIdx, setHoveredMenuIdx] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const themeButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [checkedItem, setCheckedItem] = useState<string | null>(null);

  const handleItemClick = (key: string, copyText?: string, url?: string) => {
    setCheckedItem(key);
    if (copyText && typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(copyText);
    }
    if (url && typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
    setTimeout(() => {
      setCheckedItem(null);
    }, 700);
  };

  // Khi ở trong khu vực nội dung (inside portal), màu nền đảo ngược so với trang ngoài
  // Dark mode ngoài nền đen -> trong phòng nền trắng => Navbar phải màu Đen
  // Light mode ngoài nền trắng -> trong phòng nền đen => Navbar phải màu Trắng
  const isNavbarDark = isInside ? !isDark : isDark;

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    setHoveredCardIndex(null);
  }, [activeChar]);

  const toggleTheme = (e?: React.MouseEvent) => {
    const nextTheme = !isDark;

    const isAppearanceTransition =
      typeof document !== "undefined" &&
      "startViewTransition" in document &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isAppearanceTransition) {
      setIsDark(nextTheme);
      if (nextTheme) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return;
    }

    let x = window.innerWidth - 60;
    let y = 40;

    if (e && e.clientX && e.clientY) {
      x = e.clientX;
      y = e.clientY;
    } else if (themeButtonRef.current) {
      const rect = themeButtonRef.current.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = (document as any).startViewTransition(() => {
      setIsDark(nextTheme);
      if (nextTheme) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 1200,
          easing: "cubic-bezier(0.25, 1, 0.5, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  useEffect(() => {
    let settled = false;
    const finish = (value: string) => {
      if (!settled) {
        settled = true;
        setFace(value);
      }
    };

    fontLoad ??= new FontFace(
      "Glyph Portal Jakarta",
      'url("https://cdn.21st.dev/assets/mirror/15/153fc85b70298beeb1d61a5f723331649e7f23bb77302a66e61cb3e2fbdb5e79.woff2")',
      { weight: "400 700" }
    ).load().then((font) => {
      document.fonts.add(font);
    });

    const timeout = window.setTimeout(() => finish("Arial, sans-serif"), 1600);
    void fontLoad.then(() => finish(family), () => finish("Arial, sans-serif"));

    return () => {
      settled = true;
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  const startScrollAnimation = (startTop: number, endTop: number, duration = 1000, onComplete?: () => void) => {
    const container = containerRef.current;
    if (!container) return;

    const distance = endTop - startTop;
    const startTime = performance.now();

    const easeInOutCubic = (t: number) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);

      container.scrollTop = startTop + distance * easedProgress;

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        container.scrollTop = endTop;
        onComplete?.();
      }
    };

    requestAnimationFrame(animateScroll);
  };

  // Quay lại màn hình chính có chữ HOANG khi bấm vào logo H
  const handleLogoClick = () => {
    setIsMenuOpen(false);
    const container = containerRef.current;
    if (!container) return;
    startScrollAnimation(container.scrollTop, 0, 750);
  };

  // Chuyển tab qua menu: Mở đầu bằng mục hiện đang đứng -> Lùi về màn hình chính (HOANG) -> Lướt vào mục cần tới
  const handleSelectMenuItem = (targetChar: string) => {
    setIsMenuOpen(false);
    const container = containerRef.current;
    if (!container) return;

    const targetScrollTop = container.clientHeight * (s.scrollLength ?? 2.4);

    // Nếu người dùng chọn đúng mục đang đứng và đã ở bên trong
    if (targetChar === activeChar && container.scrollTop > 100) {
      return;
    }

    if (container.scrollTop > 100) {
      // 1. Đang ở trong phòng nội dung: lùi mượt từ mục đang đứng về màn hình chính (HOANG)
      startScrollAnimation(container.scrollTop, 0, 750, () => {
        // 2. Khi camera đã lùi về đến màn hình chính (HOANG): chuyển sang mục cần tới
        setActiveChar(targetChar);
        const idx = "HOANG".indexOf(targetChar);
        const btn = container.querySelector<HTMLButtonElement>(`[data-gp-letter="${idx}"]`);
        if (btn && !btn.disabled) {
          btn.dispatchEvent(new MouseEvent("pointerover", { bubbles: true }));
          btn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        }

        // 3. Nghỉ nhẹ một nhịp (180ms) để người dùng thấy tiêu điểm nhắm vào chữ cái mới
        setTimeout(() => {
          // 4. Bắt đầu lướt mượt mà phóng to bay xuyên qua chữ cái mới vào phòng nội dung!
          startScrollAnimation(0, targetScrollTop, 1100);
        }, 180);
      });
    } else {
      // Đang ở màn hình chính (HOANG): trực tiếp lướt vào mục được chọn
      setActiveChar(targetChar);
      const idx = "HOANG".indexOf(targetChar);
      const btn = container.querySelector<HTMLButtonElement>(`[data-gp-letter="${idx}"]`);
      if (btn && !btn.disabled) {
        btn.dispatchEvent(new MouseEvent("pointerover", { bubbles: true }));
        btn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      }

      startScrollAnimation(container.scrollTop, targetScrollTop, 1100);
    }
  };

  return (
    <div
      ref={containerRef}
      data-demo-scroll
      data-slipstream-demo
      tabIndex={0}
      role="region"
      aria-label="HOANG. Scroll to step inside."
      style={{
        width: "100%",
        minHeight: "100vh",
        height: "100vh",
        overflowY: "auto",
        backgroundColor: isDark ? "#000000" : "#ffffff",
        color: isDark ? "#ffffff" : "#000000",
        containerType: "inline-size",
        fontFamily: face ?? "Arial, sans-serif",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      <style>{`
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation: none;
          mix-blend-mode: normal;
        }
        ::view-transition-old(root) {
          z-index: 1;
        }
        ::view-transition-new(root) {
          z-index: 99999;
        }
        [data-slipstream-demo] [data-gp-caption]{inset:calc(var(--gp-word-bottom,50%) + 82px) 24px auto;justify-content:center;gap:14px;}
        [data-slipstream-demo] [data-gp-hint]{display:none;}
        [data-slipstream-demo] [data-gp-enter]{
          min-height:46px;
          padding:0 30px;
          gap:24px;
          background:${isDark ? "#ffffff" : "#000000"};
          border:1.5px solid ${isDark ? "#ffffff" : "#000000"};
          border-radius:10px;
          color:${isDark ? "#000000" : "#ffffff"};
          font-size:14px;
          font-weight:600;
          letter-spacing:0.02em;
          box-shadow:${isDark ? "0 4px 16px rgba(255,255,255,0.18)" : "0 4px 16px rgba(0,0,0,0.25)"};
          transition:all .2s ease;
          cursor:pointer;
          text-decoration:none;
        }
        [data-slipstream-demo] [data-gp-enter]:hover{
          background:${isDark ? "#e5e5e5" : "#262626"};
          transform:translateY(-1px);
          box-shadow:${isDark ? "0 6px 20px rgba(255,255,255,0.25)" : "0 6px 20px rgba(0,0,0,0.35)"};
        }
        [data-slipstream-demo] [data-gp-enter]:focus-visible{outline:2px solid ${isDark ? "#fff" : "#000"};outline-offset:4px;}
        [data-slipstream-demo] [data-gp-touch-picker]{top:auto;bottom:24px;left:50%;}
        [data-slipstream-demo] [data-gp-select]{
          border:1px solid ${isDark ? "#333" : "#d8deda"};
          border-radius:8px;
          font-size:12px;
          color:${isDark ? "#fff" : "#626964"};
          background:${isDark ? "#171717" : "#fff"};
        }
        [data-sublime-eyebrow]{
          position:absolute;
          inset:auto 24px calc(100% - var(--gp-word-top,35%) + 36px);
          margin:0;
          text-align:center;
          font-size:14px;
          font-weight:400;
          line-height:1.5;
          letter-spacing:.02em;
          color:${isDark ? "#a1a1aa" : "#71766f"};
          pointer-events:none;
        }
        [data-sublime-eyebrow] span{
          display:inline-block;
          padding:2px 8px;
          cursor:pointer;
          user-select:none;
          pointer-events:auto;
          transform:translateY(0) rotate(0deg);
          transform-origin:center center;
          transition:transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s ease;
          will-change:transform;
        }
        [data-sublime-eyebrow] span:hover{
          transform:translateY(5px) rotate(16deg);
          color:${isDark ? "#ffffff" : "#000000"};
          transition:transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s ease;
        }
        [data-sublime-support]{
          position:absolute;
          inset:calc(var(--gp-word-bottom,50%) + 32px) 24px auto;
          margin:0;
          text-align:center;
          font-size:17px;
          font-weight:400;
          line-height:1.5;
          color:${isDark ? "#ffffff" : "#18181b"};
        }
        [data-sublime-scroll]{
          position:absolute;
          inset:auto 24px 6%;
          text-align:center;
          color:${isDark ? "#71717a" : "#7c817b"};
          font-size:13px;
          letter-spacing:.02em;
        }
        @media(any-pointer:coarse){[data-sublime-scroll]{bottom:13%;}}
        @container(max-width:450px){
          [data-sublime-eyebrow]{font-size:12px;}
          [data-sublime-support]{font-size:14px;}
          [data-slipstream-demo] [data-gp-caption]{top:calc(var(--gp-word-bottom,50%) + 76px);}
        }
        @container(max-height:479px){
          [data-sublime-support]{top:calc(var(--gp-word-bottom,50%) + 16px);}
          [data-slipstream-demo] [data-gp-caption]{top:calc(var(--gp-word-bottom,50%) + 60px);}
          [data-sublime-scroll]{display:none;}
        }
        [data-slipstream-demo] [data-gp-content]{
          padding:max(6rem, calc(50svh - 248px)) clamp(1.5rem,6cqw,6rem) 5rem !important;
          font-family:inherit;
          display:flex !important;
          flex-direction:column !important;
          justify-content:flex-start !important;
          align-items:center !important;
          align-content:flex-start !important;
        }
        [data-slipstream-demo] section,[data-slipstream-demo] [data-gp-caption]{font-family:inherit;}
        [data-slipstream-copy]{
          display:flex;
          width:min(100%,80rem);
          margin:0 auto !important;
          flex-direction:column;
          align-items:flex-start;
          gap:clamp(1.5rem,3.5svh,2.5rem);
        }
        [data-slipstream-copy] h2{
          max-width:48rem;
          margin:0;
          color:${isDark ? "#000000" : "#ffffff"};
          font-size:clamp(2rem,1.4rem + 2.5cqw,3rem);
          font-weight:600;
          line-height:1.2;
          letter-spacing:-0.01em;
          text-wrap:balance;
        }
        [data-slipstream-features]{display:grid;width:100%;grid-template-columns:1fr;gap:2rem;}
        [data-slipstream-feature]{
          display:flex;
          flex-direction:column;
          position:relative;
        }
        [data-slipstream-feature] h3{
          margin:0;
          color:${isDark ? "#000000" : "#ffffff"};
          font-size:1.15rem;
          font-weight:500;
          line-height:1.2;
          letter-spacing:0;
        }
        [data-slipstream-feature] p{
          margin:.65rem 0 0;
          color:${isDark ? "rgba(0,0,0,0.72)" : "rgba(255,255,255,0.85)"};
          font-size:.95rem;
          line-height:1.65;
          white-space:pre-line;
        }
        [data-slipstream-no]{
          display:inline-block;
          margin-right:.75rem;
          color:${isDark ? "#000000" : "#ffffff"};
          font:600 .8rem ui-monospace,monospace;
          letter-spacing:.08em;
          transform:translateY(-.1em);
        }
        @keyframes fadeInSlide {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in-section {
          animation: fadeInSlide 0.4s ease-out forwards;
        }
        @container(min-width:768px){[data-slipstream-features]{grid-template-columns:repeat(3,minmax(0,1fr));gap:3.5rem;}}
      `}</style>

      {/* Header / Navigator Bar with Dynamic Island Navigation */}
      {/* Header / Navigator Bar */}
      <header className="fixed top-0 left-0 right-0 z-[110] px-6 py-5 pointer-events-none">
        <nav className="relative flex items-center justify-between max-w-screen-2xl mx-auto pointer-events-auto">
          {/* Dynamic Island Capsule Menu: Flat Switch Style */}
          <div className="relative flex items-center">
            {/* Click-outside backdrop to collapse the menu */}
            {isMenuOpen && (
              <div
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 z-30"
              />
            )}

            {/* Dynamic Island Capsule Menu: Đồng bộ 100% kích thước & màu sắc với nút Switch */}
            <div
              className="relative z-40 flex items-center h-8 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none p-1 cursor-pointer"
              style={{
                backgroundColor: isNavbarDark ? "hsl(0 0% 15%)" : "hsl(0 0% 90%)",
                transition: "background-color 0.3s ease",
              }}
            >
              {/* Trigger Knob: Kích thước w-6 h-6 & màu sắc y hệt núm tròn của nút Switch */}
              <button
                ref={buttonRef}
                type="button"
                className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shrink-0 shadow-sm"
                style={{
                  backgroundColor: isNavbarDark ? "hsl(0 0% 100%)" : "hsl(0 0% 10%)",
                  color: isNavbarDark ? "hsl(0 0% 10%)" : "hsl(0 0% 100%)",
                }}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-3.5 h-3.5 transition-transform duration-200 hover:rotate-90" strokeWidth={2.5} />
                ) : (
                  <Menu className="w-3.5 h-3.5 transition-transform duration-200 hover:scale-110" strokeWidth={2.5} />
                )}
              </button>

              {/* Horizontally expanding letters list: H  O  A  N  G */}
              <div
                className="flex items-center overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  maxWidth: isMenuOpen ? "200px" : "0px",
                  opacity: isMenuOpen ? 1 : 0,
                  pointerEvents: isMenuOpen ? "auto" : "none",
                }}
              >
                {/* 5 Section Letters */}
                <div className="flex items-center gap-1 shrink-0 pl-1 pr-0.5">
                  {menuItems.map((item, idx) => {
                    const isCurrent = item.char === activeChar;
                    const isHovered = hoveredMenuIdx === idx;

                    return (
                      <div key={item.label} className="relative group">
                        <button
                          type="button"
                          onClick={() => handleSelectMenuItem(item.char)}
                          onMouseEnter={() => setHoveredMenuIdx(idx)}
                          onMouseLeave={() => setHoveredMenuIdx(null)}
                          className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs font-mono cursor-pointer transition-all duration-200 select-none"
                          style={{
                            color: isCurrent
                              ? isNavbarDark ? "hsl(0 0% 10%)" : "hsl(0 0% 100%)"
                              : isHovered
                                ? isNavbarDark ? "#ffffff" : "#000000"
                                : isNavbarDark ? "hsl(0 0% 65%)" : "hsl(0 0% 35%)",
                            backgroundColor: isCurrent
                              ? isNavbarDark ? "hsl(0 0% 100%)" : "hsl(0 0% 10%)"
                              : isHovered
                                ? isNavbarDark ? "hsl(0 0% 25%)" : "hsl(0 0% 80%)"
                                : "transparent",
                            transition: "all 0.2s ease",
                          }}
                          aria-label={item.label}
                        >
                          {item.char}
                        </button>

                        {/* Hover Tooltip appearing right below the letter */}
                        <div
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-0.5 rounded-md text-[10px] font-mono font-medium tracking-wide uppercase whitespace-nowrap shadow-md pointer-events-none transition-all duration-200 z-50"
                          style={{
                            opacity: isHovered ? 1 : 0,
                            transform: isHovered
                              ? "translateX(-50%) translateY(0) scale(1)"
                              : "translateX(-50%) translateY(-3px) scale(0.92)",
                            backgroundColor: isNavbarDark ? "hsl(0 0% 20%)" : "hsl(0 0% 95%)",
                            color: isNavbarDark ? "#ffffff" : "#000000",
                            border: isNavbarDark
                              ? "1px solid hsl(0 0% 28%)"
                              : "1px solid hsl(0 0% 85%)",
                          }}
                        >
                          {item.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Signature: Letter H in cursive script (Căn giữa tuyệt đối - không bao giờ bị lệch khi menu mở!) */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl select-none cursor-pointer hover:scale-105 transition-transform pointer-events-auto"
            style={{
              color: isNavbarDark ? "#ffffff" : "#000000",
              fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive",
              transition: "color 0.3s ease",
            }}
            onClick={handleLogoClick}
            title="Quay lại màn hình chính HOANG"
          >
            H
          </div>

          {/* Theme Toggle Pill Switch with Circular Ripple */}
          <button
            ref={themeButtonRef}
            type="button"
            onClick={toggleTheme}
            className="relative w-16 h-8 rounded-full hover:opacity-80 transition-opacity cursor-pointer"
            style={{
              backgroundColor: isNavbarDark ? "hsl(0 0% 15%)" : "hsl(0 0% 90%)",
              transition: "background-color 0.3s ease",
            }}
            aria-label="Toggle theme"
          >
            <div
              className="absolute top-1 left-1 w-6 h-6 rounded-full transition-all duration-300"
              style={{
                backgroundColor: isNavbarDark ? "hsl(0 0% 100%)" : "hsl(0 0% 10%)",
                transform: isDark ? "translateX(2rem)" : "translateX(0)",
              }}
            />
          </button>
        </nav>
      </header>

      {face ? (
        <GlyphPortal
          word={s.word}
          focusChar={activeChar}
          isDark={isDark}
          onFocusChange={setActiveChar}
          onProgress={(p) => {
            const inside = p >= 0.65;
            setIsInside((prev) => (prev !== inside ? inside : prev));
          }}
          fontFamily={face}
          fontWeight={700}
          style={{
            fontFamily: face,
            "--gp-paper": isDark ? "#000000" : "#ffffff",
            "--gp-ink": isDark ? "#ffffff" : "#000000",
            "--gp-field": isDark ? "#ffffff" : "#000000",
            "--gp-foreground": isDark ? "#000000" : "#ffffff",
          }}
          scrollLength={s.scrollLength}
          interactive={s.interactive}
          annotations={s.annotations}
          enterLabel="Resume"
          enterHref="/resume.pdf"
          secondaryLabel="Github"
          secondaryHref="https://github.com/Hoangnguyenhuu12"
          background={
            <div
              style={{
                position: "absolute",
                inset: 0,
                transform: "scale(var(--gp-field-scale,1))",
                backgroundColor: isDark ? "#ffffff" : "#000000",
                transition: "background-color 0.3s ease",
              }}
            />
          }
          front={
            <>
              <p data-sublime-eyebrow>
                <span>Hi there, I'm</span>
              </p>
              <p data-sublime-support>Explore my work.</p>
              <span data-sublime-scroll className="inline-flex items-center justify-center gap-1.5 cursor-pointer">
                <span>Scroll letter by letter</span>
                <ChevronDown className="w-3.5 h-3.5 animate-bounce" strokeWidth={2.5} />
              </span>
            </>
          }
        >
          {(() => {
            const currentSection = sectionData[activeChar] ?? sectionData["H"];

            if (activeChar === "G") {
              return (
                <div data-slipstream-copy key="G" className="fade-in-section w-full">
                  <h2>{currentSection.title}</h2>

                  {/* Get In Touch Custom Wide Card: Balanced Floating Elevation for both White and Black modes, No Border */}
                  <div
                    className="w-full rounded-3xl relative overflow-hidden group/card cursor-default"
                    style={{
                      backgroundColor: isDark ? "#ffffff" : "#0e0e0e",
                      border: "none",
                      boxShadow: isDark
                        ? "0 10px 32px -4px rgba(0, 0, 0, 0.06), 0 3px 12px -2px rgba(0, 0, 0, 0.03)"
                        : "0 16px 44px -4px rgba(255, 255, 255, 0.12), 0 4px 16px -2px rgba(255, 255, 255, 0.07)",
                      transition:
                        "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.008)";
                      e.currentTarget.style.boxShadow = isDark
                        ? "0 14px 38px -4px rgba(0, 0, 0, 0.09), 0 4px 14px -2px rgba(0, 0, 0, 0.04)"
                        : "0 22px 56px -4px rgba(255, 255, 255, 0.18), 0 6px 20px -2px rgba(255, 255, 255, 0.10)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = isDark
                        ? "0 10px 32px -4px rgba(0, 0, 0, 0.06), 0 3px 12px -2px rgba(0, 0, 0, 0.03)"
                        : "0 16px 44px -4px rgba(255, 255, 255, 0.12), 0 4px 16px -2px rgba(255, 255, 255, 0.07)";
                    }}
                  >
                    {/* Ambient light shader: subtle top reflection for balanced depth */}
                    <div
                      className="absolute inset-0 pointer-events-none transition-opacity duration-700"
                      style={{
                        background: isDark
                          ? "radial-gradient(900px circle at 50% 20%, rgba(0, 0, 0, 0.02), transparent 70%)"
                          : "radial-gradient(900px circle at 50% 20%, rgba(255, 255, 255, 0.06), transparent 70%)",
                      }}
                    />

                    <div className="relative p-7 sm:p-9 md:p-11 flex flex-col md:flex-row items-stretch justify-between gap-8 md:gap-12">
                      {/* Left Column: Balanced Quote & Clean Bullet Contact Info (matching Image 2 style) */}
                      <div className="flex-1 flex flex-col justify-between py-1">
                        {/* 1. Kanye West Quote with original font for English, new font specifically for Vietnamese translation */}
                        <div>
                          <blockquote className="py-1">
                            {/* Main Quote in English (keeps original font) */}
                            <p
                              className="italic text-base sm:text-lg md:text-xl font-normal leading-relaxed"
                              style={{
                                color: isDark ? "rgba(0, 0, 0, 0.88)" : "rgba(255, 255, 255, 0.92)",
                              }}
                            >
                              “We&apos;ve become so focused on that tiny screen that we forget the big picture, the people right in front of us.”
                            </p>

                            {/* Vietnamese Translation (specifically uses Be Vietnam Pro / Plus Jakarta Sans for flawless diacritics) */}
                            <p
                              className="italic text-base sm:text-lg md:text-xl font-normal leading-relaxed mt-3"
                              style={{
                                color: isDark ? "rgba(0, 0, 0, 0.42)" : "rgba(255, 255, 255, 0.42)",
                                fontFamily: "'Be Vietnam Pro', 'Plus Jakarta Sans', sans-serif",
                              }}
                            >
                              “Chúng ta đã quá tập trung vào chiếc màn hình bé nhỏ đó, mà quên mất bức tranh toàn cảnh, những con người đang hiện diện ngay trước mắt mình.”
                            </p>

                            {/* Attribution after translation */}
                            <footer
                              className="text-xs sm:text-sm font-medium mt-3"
                              style={{
                                color: isDark ? "rgba(0, 0, 0, 0.52)" : "rgba(255, 255, 255, 0.52)",
                              }}
                            >
                              — Kanye West
                            </footer>
                          </blockquote>
                        </div>

                        {/* 2. Contact lines: Left-to-right subtle underline on hover, instant black checkmark on click */}
                        <div className="mt-8 flex flex-col gap-3 text-sm sm:text-base leading-relaxed">
                          {/* Email */}
                          <div
                            onClick={() => handleItemClick("email", "nguyenhuuhoang21092006@gmail.com")}
                            className="group/item w-fit flex items-center gap-2.5 transition-all duration-200 cursor-pointer select-none py-0.5"
                            title="Bấm để sao chép email: nguyenhuuhoang21092006@gmail.com"
                          >
                            <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                              {checkedItem === "email" ? (
                                <Check
                                  className="w-3.5 h-3.5 stroke-[3] animate-in zoom-in-75 fade-in duration-75"
                                  style={{ color: isDark ? "#000000" : "#ffffff" }}
                                />
                              ) : (
                                <span
                                  className="w-1.5 h-1.5 rounded-full transition-transform duration-200 group-hover/item:scale-125"
                                  style={{
                                    backgroundColor: isDark ? "#000000" : "#ffffff",
                                  }}
                                />
                              )}
                            </span>
                            <span
                              className="relative inline-flex items-center py-0.5 transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left group-hover/item:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out"
                              style={{
                                color: isDark ? "rgba(0, 0, 0, 0.78)" : "rgba(255, 255, 255, 0.82)",
                              }}
                            >
                              <strong
                                className="font-semibold not-italic"
                                style={{ color: isDark ? "#000000" : "#ffffff" }}
                              >
                                Email:
                              </strong>{" "}
                              <span className="font-mono text-[0.93em] ml-1.5">
                                nguyenhuuhoang21092006@gmail.com
                              </span>
                            </span>
                          </div>

                          {/* Direct Phone */}
                          <div
                            onClick={() => handleItemClick("phone", "+84934363606")}
                            className="group/item w-fit flex items-center gap-2.5 transition-all duration-200 cursor-pointer select-none py-0.5"
                            title="Bấm để sao chép số điện thoại: +84934363606"
                          >
                            <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                              {checkedItem === "phone" ? (
                                <Check
                                  className="w-3.5 h-3.5 stroke-[3] animate-in zoom-in-75 fade-in duration-75"
                                  style={{ color: isDark ? "#000000" : "#ffffff" }}
                                />
                              ) : (
                                <span
                                  className="w-1.5 h-1.5 rounded-full transition-transform duration-200 group-hover/item:scale-125"
                                  style={{
                                    backgroundColor: isDark ? "#000000" : "#ffffff",
                                  }}
                                />
                              )}
                            </span>
                            <span
                              className="relative inline-flex items-center py-0.5 transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left group-hover/item:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out"
                              style={{
                                color: isDark ? "rgba(0, 0, 0, 0.78)" : "rgba(255, 255, 255, 0.82)",
                              }}
                            >
                              <strong
                                className="font-semibold not-italic"
                                style={{ color: isDark ? "#000000" : "#ffffff" }}
                              >
                                Direct Phone:
                              </strong>{" "}
                              <span className="font-mono text-[0.93em] ml-1.5">
                                +84934363606
                              </span>
                            </span>
                          </div>

                          {/* GitHub */}
                          <div
                            onClick={() =>
                              handleItemClick("github", undefined, "https://github.com/Hoangnguyenhuu12")
                            }
                            className="group/item w-fit flex items-center gap-2.5 transition-all duration-200 cursor-pointer select-none py-0.5"
                            title="Mở GitHub: github.com/Hoangnguyenhuu12"
                          >
                            <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                              {checkedItem === "github" ? (
                                <Check
                                  className="w-3.5 h-3.5 stroke-[3] animate-in zoom-in-75 fade-in duration-75"
                                  style={{ color: isDark ? "#000000" : "#ffffff" }}
                                />
                              ) : (
                                <span
                                  className="w-1.5 h-1.5 rounded-full transition-transform duration-200 group-hover/item:scale-125"
                                  style={{
                                    backgroundColor: isDark ? "#000000" : "#ffffff",
                                  }}
                                />
                              )}
                            </span>
                            <span
                              className="relative inline-flex items-center py-0.5 transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left group-hover/item:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out"
                              style={{
                                color: isDark ? "rgba(0, 0, 0, 0.78)" : "rgba(255, 255, 255, 0.82)",
                              }}
                            >
                              <strong
                                className="font-semibold not-italic"
                                style={{ color: isDark ? "#000000" : "#ffffff" }}
                              >
                                GitHub Repository:
                              </strong>{" "}
                              <span className="font-mono text-[0.93em] ml-1.5">
                                github.com/Hoangnguyenhuu12
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Taller Photo + Social Icons Spanned Evenly (justify-between) */}
                      <div className="w-full md:w-[300px] lg:w-[340px] shrink-0 flex flex-col justify-between gap-5">
                        {/* Photo on Top - Taller height to fill vertical space */}
                        <div className="relative w-full h-[240px] sm:h-[260px] md:h-[250px] rounded-2xl overflow-hidden shadow-md group/img">
                          <img
                            src="/sample-card.jpg"
                            alt="Hoang"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-40 pointer-events-none" />
                        </div>

                        {/* 4 Social Logos: Dàn đều chính xác theo chiều ngang hình ảnh (justify-between) */}
                        <div className="flex items-center justify-between w-full px-1">
                          <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer"
                            title="Facebook"
                          >
                            <img
                              src="/facebook.png"
                              alt="Facebook"
                              className="w-full h-full object-contain"
                            />
                          </a>

                          <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer"
                            title="Instagram"
                          >
                            <img
                              src="/instagram.png"
                              alt="Instagram"
                              className="w-full h-full object-contain"
                            />
                          </a>

                          <a
                            href="https://strava.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer"
                            title="Strava"
                          >
                            <img
                              src="/strava.png"
                              alt="Strava"
                              className="w-full h-full object-contain"
                            />
                          </a>

                          <a
                            href="https://linkedin.com/in/hoang-nguyen-8a641b372"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer"
                            title="LinkedIn"
                          >
                            <img
                              src="/linkedin.png"
                              alt="LinkedIn"
                              className="w-full h-full object-contain"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div data-slipstream-copy key={activeChar} className="fade-in-section">
                <h2>{currentSection.title}</h2>
                <div data-slipstream-features>
                  {currentSection.features.map((feat, i) => {
                    const isHovered = hoveredCardIndex === i;

                    return (
                      <div
                        data-slipstream-feature
                        key={feat.num}
                        onMouseEnter={() => setHoveredCardIndex(i)}
                        onMouseLeave={() => setHoveredCardIndex(null)}
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        {/* 1. Image Stage: Nằm phía TRÊN vạch kẻ ngang */}
                        <div
                          style={{
                            position: "relative",
                            width: "100%",
                            height: feat.image ? "210px" : "0px",
                            overflow: "hidden",
                            borderRadius: "14px",
                            marginBottom: feat.image ? "14px" : "0px",
                            pointerEvents: "none",
                          }}
                        >
                          {feat.image && (
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                transform: isHovered
                                  ? "translateY(0%) scale(1)"
                                  : "translateY(100%) scale(0.95)",
                                opacity: isHovered ? 1 : 0,
                                transition:
                                  "transform 0.42s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease",
                                willChange: "transform, opacity",
                              }}
                            >
                              <img
                                src={feat.image}
                                alt={feat.title}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  borderRadius: "14px",
                                  boxShadow: isDark
                                    ? "0 12px 36px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.08)"
                                    : "0 12px 36px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.15)",
                                }}
                              />
                            </div>
                          )}
                        </div>

                        {/* 2. Vạch kẻ ngang của card */}
                        <div
                          style={{
                            width: "100%",
                            height: "1px",
                            backgroundColor: isHovered
                              ? isDark
                                ? "rgba(0, 0, 0, 0.85)"
                                : "rgba(255, 255, 255, 0.85)"
                              : isDark
                                ? "rgba(0, 0, 0, 0.18)"
                                : "rgba(255, 255, 255, 0.22)",
                            marginBottom: "18px",
                            transition: "background-color 0.3s ease",
                          }}
                        />

                        {/* 3. Nội dung text */}
                        <h3>
                          <span
                            data-slipstream-no
                            style={{
                              transition: "color 0.3s ease",
                              color: isHovered
                                ? isDark
                                  ? "#000000"
                                  : "#ffffff"
                                : isDark
                                  ? "rgba(0, 0, 0, 0.55)"
                                  : "rgba(255, 255, 255, 0.6)",
                            }}
                          >
                            {feat.num}
                          </span>
                          <span
                            style={{
                              transition: "color 0.3s ease",
                              color: isDark ? "#000000" : "#ffffff",
                            }}
                          >
                            {feat.title}
                          </span>
                        </h3>
                        <p
                          className="whitespace-pre-line"
                          style={{
                            transition: "color 0.3s ease",
                            color: isHovered
                              ? isDark
                                ? "rgba(0, 0, 0, 0.95)"
                                : "rgba(255, 255, 255, 0.95)"
                              : isDark
                                ? "rgba(0, 0, 0, 0.72)"
                                : "rgba(255, 255, 255, 0.72)",
                          }}
                        >
                          {feat.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </GlyphPortal>
      ) : (
        <div
          role="status"
          style={{
            height: "100%",
            display: "grid",
            placeItems: "center",
            color: isDark ? "#71717a" : "#a1a1aa",
            fontSize: 13,
          }}
        >
          Loading type...
        </div>
      )}
    </div>
  );
}
