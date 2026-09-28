"use client";

import { useEffect, useState, useRef } from "react";
import GlyphPortal from "@/components/ui/glyph-portal";
import { Menu, X, ChevronDown } from "lucide-react";

const settings = { word: "HOANG", scrollLength: 2.4, interactive: true, annotations: false };
const family = '"Glyph Portal Jakarta", Arial, sans-serif';
let fontLoad: Promise<void> | undefined;

const sectionTitles: Record<string, string> = {
  H: "Highlights",
  O: "Overview",
  A: "Abilities",
  N: "Notable Projects",
  G: "Get in touch",
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
  const [isDark, setIsDark] = useState<boolean>(true);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isInside, setIsInside] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Khi ở trong khu vực nội dung (inside portal), màu nền đảo ngược so với trang ngoài
  // Dark mode ngoài nền đen -> trong phòng nền trắng => Navbar phải màu Đen
  // Light mode ngoài nền trắng -> trong phòng nền đen => Navbar phải màu Trắng
  const isNavbarDark = isInside ? !isDark : isDark;

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
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
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
        [data-slipstream-demo] [data-gp-caption]{inset:calc(var(--gp-word-bottom,50%) + 82px) 24px auto;justify-content:center;}
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
        [data-slipstream-demo] [data-gp-content]{padding:6rem clamp(1.5rem,6cqw,6rem) 6.5rem;font-family:inherit;}
        [data-slipstream-demo] section,[data-slipstream-demo] [data-gp-caption]{font-family:inherit;}
        [data-slipstream-copy]{display:flex;width:min(100%,80rem);margin:auto;flex-direction:column;align-items:flex-start;gap:clamp(2rem,5svh,3.5rem);}
        [data-slipstream-copy] h2{
          max-width:48rem;
          margin:0;
          color:${isDark ? "#000000" : "#ffffff"};
          font-size:clamp(2rem,1.4rem + 2.5cqw,3rem);
          font-weight:500;
          line-height:1.2;
          letter-spacing:-0.01em;
          text-wrap:balance;
        }
        [data-slipstream-features]{display:grid;width:100%;grid-template-columns:1fr;gap:2rem;}
        [data-slipstream-feature]{
          border-top:1px solid ${isDark ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.22)"};
          padding-top:1.25rem;
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
          color:${isDark ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.85)"};
          font-size:.95rem;
          line-height:1.6;
        }
        [data-slipstream-no]{
          display:inline-block;
          margin-right:.75rem;
          color:${isDark ? "#000000" : "#ffffff"};
          font:600 .8rem ui-monospace,monospace;
          letter-spacing:.08em;
          transform:translateY(-.1em);
        }
        @container(min-width:768px){[data-slipstream-features]{grid-template-columns:repeat(3,minmax(0,1fr));gap:3.5rem;}}
      `}</style>

      {/* Header / Navigator Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-5 pointer-events-none">
        <nav className="flex items-center justify-between max-w-screen-2xl mx-auto pointer-events-auto">
          {/* Menu Button & Minimal Menu List directly matching Image 2 */}
          <div className="relative">
            <button
              ref={buttonRef}
              type="button"
              className="p-1 transition-colors duration-300 z-50 cursor-pointer"
              style={{
                color: isNavbarDark ? "#ffffff" : "#000000",
              }}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-8 h-8 transition-colors duration-300" strokeWidth={2} />
              ) : (
                <Menu className="w-8 h-8 transition-colors duration-300" strokeWidth={2} />
              )}
            </button>

            {/* Menu List: Tối giản y hệt Hình 2 */}
            {isMenuOpen && (
              <div
                ref={menuRef}
                className="absolute top-full left-0 mt-3 flex flex-col gap-2 z-[100] select-none"
              >
                {menuItems.map((item) => {
                  const isCurrent = item.char === activeChar;
                  return (
                    <a
                      key={item.label}
                      onClick={() => handleSelectMenuItem(item.char)}
                      className="text-left text-base md:text-lg font-bold tracking-tight cursor-pointer transition-colors duration-200 whitespace-nowrap block"
                      style={{
                        color: isCurrent
                          ? isNavbarDark
                            ? "#ffffff"
                            : "#000000"
                          : isNavbarDark
                          ? "rgba(255, 255, 255, 0.45)"
                          : "rgba(0, 0, 0, 0.45)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = isNavbarDark ? "#ffffff" : "#000000";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = isCurrent
                          ? isNavbarDark
                            ? "#ffffff"
                            : "#000000"
                          : isNavbarDark
                          ? "rgba(255, 255, 255, 0.45)"
                          : "rgba(0, 0, 0, 0.45)";
                      }}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Signature: Letter H in cursive script - Click quay lại màn hình chính HOANG */}
          <div
            className="text-4xl select-none cursor-pointer hover:scale-105 transition-transform"
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

          {/* Theme Toggle Pill Switch */}
          <button
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
              <p data-sublime-eyebrow>Hi there, I'm</p>
              <p data-sublime-support>Explore my work.</p>
              <span data-sublime-scroll className="inline-flex items-center justify-center gap-1.5 cursor-pointer">
                <span>Scroll down</span>
                <ChevronDown className="w-3.5 h-3.5 animate-bounce" strokeWidth={2.5} />
              </span>
            </>
          }
        >
          <div data-slipstream-copy>
            <h2>{sectionTitles[activeChar] ?? "Highlights"}</h2>
            <div data-slipstream-features>
              <div data-slipstream-feature>
                <h3><span data-slipstream-no>01</span>Who Am I?</h3>
                <p>Hi, I'm Hoang (Oliver) — an Artificial Intelligence junior at FPT University. I focus on building practical tech projects, from designing AI workflows to organizing tech events. Driven by discipline and a problem-solving mindset, I’m looking for opportunities in a professional environment where I can contribute to real-world products and deepen my AI engineering skills.</p>
              </div>
              <div data-slipstream-feature>
                <h3><span data-slipstream-no>02</span>What Defines Me?</h3>
                <p>Patience, discipline, and a quiet focus. I break down complex problems carefully, iterate through mistakes without excuses, and stay dedicated to the process—much like endurance running, pushing forward until crossing the finish line.</p>
              </div>
              <div data-slipstream-feature>
                <h3><span data-slipstream-no>03</span>What Makes Me Happy?</h3>
                <p>Four hobbies that keep me balanced: running, vlogging, collecting cars and exploring new things. Above all, my happiness is simply the feeling of finishing a tough race and spending time with my partner and friends.</p>
              </div>
            </div>
          </div>
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
