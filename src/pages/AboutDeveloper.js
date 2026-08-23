import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const AboutDeveloper = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const isLight = theme === "light";
  const heartbeatStyle = `
  @keyframes heartbeat {
    0%, 100% {
      transform: scale(1);
    }
    14% {
      transform: scale(1.18);
    }
    28% {
      transform: scale(1);
    }
    42% {
      transform: scale(1.18);
    }
    56% {
      transform: scale(1);
    }
  }
`;
  return (
    <div
      className={`
        min-h-screen
        w-full
        transition-colors
        duration-300
        ${isLight ? "bg-[#f5f8fc] text-slate-900" : "bg-[#080b12] text-white"}
      `}
    >
      <style>{heartbeatStyle}</style>
      <div className="relative min-h-screen overflow-hidden">
        <div
          className={`
            absolute
            -top-40
            left-1/2
            -translate-x-1/2
            w-[600px]
            h-[400px]
            rounded-full
            blur-[120px]
            pointer-events-none
            ${isLight ? "bg-blue-400/[0.10]" : "bg-blue-500/[0.07]"}
          `}
        />

        <div
          className={`
            absolute
            top-[45%]
            -left-40
            w-[450px]
            h-[450px]
            rounded-full
            blur-[130px]
            pointer-events-none
            ${isLight ? "bg-violet-300/[0.08]" : "bg-violet-500/[0.05]"}
          `}
        />

        <div
          className={`
            absolute
            bottom-[-180px]
            right-[-120px]
            w-[500px]
            h-[500px]
            rounded-full
            blur-[130px]
            pointer-events-none
            ${isLight ? "bg-cyan-300/[0.08]" : "bg-cyan-500/[0.04]"}
          `}
        />

        <header
          className={`
            sticky
            top-0
            z-50
            border-b
            backdrop-blur-xl
            ${
              isLight
                ? "bg-white/75 border-slate-200/80"
                : "bg-[#080b12]/80 border-white/[0.06]"
            }
          `}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-[72px] flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate("/chat")}
                className={`
                  group
                  flex
                  items-center
                  gap-2.5
                  px-3
                  py-2
                  rounded-xl
                  text-sm
                  font-medium
                  transition-all
                  duration-300
                  ease-out
                  hover:-translate-x-1
                  active:scale-95
                  ${
                    isLight
                      ? `
                        text-slate-600
                        hover:text-slate-900
                        hover:bg-slate-100
                        hover:shadow-md
                      `
                      : `
                        text-gray-400
                        hover:text-white
                        hover:bg-white/[0.06]
                        hover:shadow-lg
                        hover:shadow-black/20
                      `
                  }
                `}
              >
                <span
                  className="
                    text-lg
                    transition-transform
                    duration-300
                    group-hover:-translate-x-1
                  "
                >
                  ←
                </span>

                <span className="hidden sm:inline">Back to Messenger</span>

                <span className="sm:hidden">Back</span>
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className={`
                    relative
                    w-[72px]
                    h-9
                    rounded-full
                    p-1
                    border
                    transition-all
                    duration-500
                    ease-out
                    hover:scale-105
                    active:scale-95
                    ${
                      isLight
                        ? `
                          bg-slate-100
                          border-slate-200
                          shadow-inner
                          hover:shadow-md
                          hover:shadow-slate-300/30
                        `
                        : `
                          bg-[#151a24]
                          border-white/[0.08]
                          shadow-inner
                          hover:shadow-lg
                          hover:shadow-cyan-500/10
                        `
                    }
                  `}
                  aria-label="Toggle theme"
                >
                  <span
                    className={`
                      absolute
                      top-1
                      w-7
                      h-7
                      rounded-full
                      flex
                      items-center
                      justify-center
                      text-sm
                      shadow-md
                      transition-all
                      duration-500
                      ease-out
                      ${
                        isLight
                          ? `
                            left-1
                            bg-white
                            text-amber-500
                            rotate-0
                          `
                          : `
                            left-10
                            bg-[#252c38]
                            text-cyan-300
                            rotate-[360deg]
                          `
                      }
                    `}
                  >
                    {isLight ? "☀️" : "🌙"}
                  </span>

                  <span
                    className={`
                      absolute
                      inset-y-0
                      flex
                      items-center
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-wide
                      transition-colors
                      duration-300
                      ${
                        isLight
                          ? "right-2 text-slate-400"
                          : "left-2 text-gray-500"
                      }
                    `}
                  >
                    {isLight ? "Light" : "Dark"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/chat")}
                  className={`
                    group
                    w-9
                    h-9
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    text-sm
                    transition-all
                    duration-300
                    hover:scale-110
                    active:scale-90
                    ${
                      isLight
                        ? `
                          text-slate-400
                          hover:text-slate-800
                          hover:bg-slate-100
                          hover:shadow-md
                        `
                        : `
                          text-gray-500
                          hover:text-white
                          hover:bg-white/[0.07]
                          hover:shadow-lg
                          hover:shadow-black/20
                        `
                    }
                  `}
                  aria-label="Close"
                >
                  <span className="transition-transform duration-300 group-hover:rotate-90">
                    ✕
                  </span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <section className="pt-12 sm:pt-16 lg:pt-20">
            <div
              className={`
                relative
                overflow-hidden
                rounded-[32px]
                border
                ${
                  isLight
                    ? `
                      bg-white
                      border-slate-200
                      shadow-xl
                      shadow-slate-300/20
                    `
                    : `
                      bg-[#0d1118]
                      border-white/[0.07]
                      shadow-2xl
                      shadow-black/30
                    `
                }
              `}
            >
              <div
                className={`
                  absolute
                  inset-0
                  pointer-events-none
                  ${
                    isLight
                      ? "bg-gradient-to-br from-blue-50/80 via-transparent to-violet-50/80"
                      : "bg-gradient-to-br from-blue-500/[0.05] via-transparent to-violet-500/[0.05]"
                  }
                `}
              />

              <div className="relative grid lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-12 p-7 sm:p-10 lg:p-14">
                <div className="flex flex-col justify-center">
                  <div
                    className={`
                      inline-flex
                      self-start
                      items-center
                      gap-2
                      px-3
                      py-1.5
                      rounded-full
                      text-[10px]
                      uppercase
                      tracking-[0.2em]
                      font-semibold
                      border
                      ${
                        isLight
                          ? "bg-blue-50 text-blue-600 border-blue-100"
                          : "bg-blue-500/[0.08] text-blue-400 border-blue-500/[0.12]"
                      }
                    `}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Developer & Creator
                  </div>

                  <h1
                    className={`
                      mt-6
                      text-4xl
                      sm:text-5xl
                      lg:text-6xl
                      font-bold
                      tracking-tight
                      leading-[1.05]
                      ${isLight ? "text-slate-900" : "text-white"}
                    `}
                  >
                    Meet the mind
                    <br />
                    behind{" "}
                    <span
                      className={`
                        bg-clip-text
                        text-transparent
                        bg-gradient-to-r
                        ${
                          isLight
                            ? "from-cyan-500 via-blue-600 to-violet-600"
                            : "from-cyan-300 via-blue-400 to-violet-400"
                        }
                      `}
                    >
                      AI Messenger.
                    </span>
                  </h1>

                  <p
                    className={`
                      mt-6
                      max-w-2xl
                      text-sm
                      sm:text-base
                      lg:text-lg
                      leading-8
                      ${isLight ? "text-slate-500" : "text-gray-400"}
                    `}
                  >
                    Hi, I'm{" "}
                    <strong
                      className={isLight ? "text-slate-800" : "text-gray-200"}
                    >
                      Rajesh Elluru
                    </strong>
                    . I enjoy turning ideas into working software and exploring
                    how AI can make everyday applications more useful,
                    intelligent and enjoyable.
                  </p>

                  <p
                    className={`
                      mt-4
                      max-w-2xl
                      text-sm
                      sm:text-base
                      leading-8
                      ${isLight ? "text-slate-500" : "text-gray-500"}
                    `}
                  >
                    AI Messenger started as a project to bring authentication,
                    conversations, AI responses, file interaction and a polished
                    user experience together into one application.
                  </p>

                  <div className="flex flex-wrap gap-3 mt-8">
                    <button
                      type="button"
                      onClick={() => navigate("/")}
                      className="
                        group
                        relative
                        overflow-hidden
                        inline-flex
                        items-center
                        gap-2
                        px-5
                        py-3
                        rounded-xl
                        bg-gradient-to-r
                        from-blue-500
                        via-indigo-500
                        to-violet-600
                        text-white
                        text-sm
                        font-semibold
                        shadow-lg
                        shadow-blue-500/20
                        transition-all
                        duration-300
                        ease-out
                        hover:-translate-y-1
                        hover:scale-[1.02]
                        hover:shadow-xl
                        hover:shadow-blue-500/30
                        active:translate-y-0
                        active:scale-[0.97]
                      "
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full transition-transform duration-700 group-hover:translate-x-full" />

                      <span className="relative">Open AI Messenger</span>

                      <span className="relative transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-center lg:justify-end">
                  <div
                    className={`
                      relative
                      w-full
                      max-w-[390px]
                      aspect-square
                      rounded-[32px]
                      border
                      flex
                      items-center
                      justify-center
                      overflow-hidden
                      ${
                        isLight
                          ? `
                            bg-gradient-to-br
                            from-cyan-50
                            via-blue-50
                            to-violet-50
                            border-blue-100
                          `
                          : `
                            bg-gradient-to-br
                            from-blue-500/[0.08]
                            via-indigo-500/[0.05]
                            to-violet-500/[0.08]
                            border-white/[0.07]
                          `
                      }
                    `}
                  >
                    <div
                      className={`
                        absolute
                        w-52
                        h-52
                        rounded-full
                        blur-3xl
                        ${isLight ? "bg-blue-300/30" : "bg-blue-500/10"}
                      `}
                    />

                    <div
                      className={`
                        relative
                        w-40
                        h-40
                        sm:w-48
                        sm:h-48
                        rounded-[40px]
                        flex
                        items-center
                        justify-center
                        text-7xl
                        sm:text-8xl
                        shadow-2xl
                        rotate-3
                        ${
                          isLight
                            ? `
                              bg-white
                              border
                              border-blue-100
                              shadow-blue-200/40
                            `
                            : `
                              bg-[#111722]
                              border
                              border-white/[0.08]
                              shadow-black/40
                            `
                        }
                      `}
                    >
                      👨‍💻
                      <span
                        className={`
                          absolute
                          bottom-3
                          right-3
                          w-6
                          h-6
                          rounded-full
                          border-4
                          ${
                            isLight
                              ? "bg-emerald-500 border-white"
                              : "bg-emerald-400 border-[#111722]"
                          }
                        `}
                      />
                    </div>

                    <div
                      className={`
                        absolute
                        top-8
                        right-8
                        px-3
                        py-2
                        rounded-xl
                        text-xs
                        font-semibold
                        border
                        backdrop-blur-md
                        ${
                          isLight
                            ? "bg-white/80 text-blue-600 border-blue-100"
                            : "bg-black/20 text-blue-300 border-white/[0.08]"
                        }
                      `}
                    >
                      AI + Code
                    </div>

                    <div
                      className={`
                        absolute
                        bottom-8
                        left-8
                        px-3
                        py-2
                        rounded-xl
                        text-xs
                        font-semibold
                        border
                        backdrop-blur-md
                        ${
                          isLight
                            ? "bg-white/80 text-violet-600 border-violet-100"
                            : "bg-black/20 text-violet-300 border-white/[0.08]"
                        }
                      `}
                    >
                      Build • Learn • Create
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8 grid md:grid-cols-3 gap-4">
            {[
              [
                "01",
                "Learn",
                "Understand the technology behind every feature.",
              ],
              ["02", "Build", "Turn ideas into real, usable applications."],
              [
                "03",
                "Improve",
                "Keep refining the experience with every iteration.",
              ],
            ].map(([number, title, description]) => (
              <div
                key={number}
                className={`
                  rounded-2xl
                  border
                  p-6
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  ${
                    isLight
                      ? `
                        bg-white
                        border-slate-200
                        hover:shadow-lg
                        hover:shadow-slate-200/50
                      `
                      : `
                        bg-[#0d1118]
                        border-white/[0.07]
                        hover:shadow-lg
                        hover:shadow-black/20
                      `
                  }
                `}
              >
                <span
                  className={`
                    text-xs
                    font-bold
                    tracking-[0.2em]
                    ${isLight ? "text-blue-500" : "text-blue-400"}
                  `}
                >
                  {number}
                </span>

                <h3
                  className={`
                    mt-3
                    text-lg
                    font-semibold
                    ${isLight ? "text-slate-900" : "text-white"}
                  `}
                >
                  {title}
                </h3>

                <p
                  className={`
                    mt-2
                    text-sm
                    leading-6
                    ${isLight ? "text-slate-500" : "text-gray-500"}
                  `}
                >
                  {description}
                </p>
              </div>
            ))}
          </section>

          <section className="mt-16">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p
                  className={`
                    text-[10px]
                    uppercase
                    tracking-[0.25em]
                    font-semibold
                    ${isLight ? "text-blue-600" : "text-blue-400"}
                  `}
                >
                  The stack
                </p>

                <h2
                  className={`
                    mt-2
                    text-2xl
                    sm:text-3xl
                    font-bold
                    ${isLight ? "text-slate-900" : "text-white"}
                  `}
                >
                  Technology behind the experience
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-7">
              {[
                ["⚛️", "React.js", "Frontend"],
                ["🟢", "Node.js", "Runtime"],
                ["🚂", "Express.js", "Backend"],
                ["🍃", "MongoDB", "Database"],
                ["🎨", "Tailwind CSS", "UI"],
                ["⚡", "Groq", "AI"],
                ["🔐", "JWT", "Authentication"],
                ["🔗", "REST APIs", "Communication"],
              ].map(([icon, name, category]) => (
                <div
                  key={name}
                  className={`
                    group
                    p-5
                    rounded-2xl
                    border
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    ${
                      isLight
                        ? `
                          bg-white
                          border-slate-200
                          hover:border-blue-200
                          hover:shadow-lg
                          hover:shadow-blue-100/40
                        `
                        : `
                          bg-[#0d1118]
                          border-white/[0.07]
                          hover:bg-[#111722]
                          hover:border-white/[0.12]
                          hover:shadow-lg
                          hover:shadow-black/20
                        `
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
                      {icon}
                    </span>

                    <span
                      className={`
                        text-[9px]
                        uppercase
                        tracking-wider
                        ${isLight ? "text-slate-400" : "text-gray-600"}
                      `}
                    >
                      {category}
                    </span>
                  </div>

                  <p
                    className={`
                      mt-5
                      text-sm
                      font-semibold
                      ${isLight ? "text-slate-800" : "text-gray-200"}
                    `}
                  >
                    {name}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <div className="grid lg:grid-cols-2 gap-6">
              <div
                className={`
                  rounded-3xl
                  border
                  p-7
                  sm:p-8
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  ${
                    isLight
                      ? "bg-white border-slate-200 hover:shadow-lg hover:shadow-slate-200/50"
                      : "bg-[#0d1118] border-white/[0.07] hover:shadow-lg hover:shadow-black/20"
                  }
                `}
              >
                <div className="text-3xl">🤖</div>

                <h2
                  className={`
                    mt-5
                    text-xl
                    font-bold
                    ${isLight ? "text-slate-900" : "text-white"}
                  `}
                >
                  What makes AI Messenger useful?
                </h2>

                <div className="mt-6 space-y-4">
                  {[
                    "AI-powered conversations",
                    "Conversation history and management",
                    "File upload and file-aware conversations",
                    "Secure authentication",
                    "AI response regeneration",
                    "Dark and light experiences",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <span
                        className={`
                          w-6
                          h-6
                          rounded-full
                          flex
                          items-center
                          justify-center
                          text-xs
                          ${
                            isLight
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-emerald-500/10 text-emerald-400"
                          }
                        `}
                      >
                        ✓
                      </span>

                      <span
                        className={`
                          text-sm
                          ${isLight ? "text-slate-600" : "text-gray-400"}
                        `}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className={`
                  rounded-3xl
                  border
                  p-7
                  sm:p-8
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  ${
                    isLight
                      ? "bg-white border-slate-200 hover:shadow-lg hover:shadow-slate-200/50"
                      : "bg-[#0d1118] border-white/[0.07] hover:shadow-lg hover:shadow-black/20"
                  }
                `}
              >
                <div className="text-3xl">🧠</div>

                <h2
                  className={`
                    mt-5
                    text-xl
                    font-bold
                    ${isLight ? "text-slate-900" : "text-white"}
                  `}
                >
                  Why I built it
                </h2>

                <p
                  className={`
                    mt-5
                    text-sm
                    leading-7
                    ${isLight ? "text-slate-500" : "text-gray-500"}
                  `}
                >
                  The goal was not just to create another chat interface. The
                  idea was to understand how a complete application comes
                  together — from authentication and APIs to databases, AI
                  integration, file handling and the small UI details that make
                  software feel polished.
                </p>

                <p
                  className={`
                    mt-4
                    text-sm
                    leading-7
                    ${isLight ? "text-slate-500" : "text-gray-500"}
                  `}
                >
                  Every part of the project became an opportunity to learn
                  something new and turn that learning into something people can
                  actually interact with.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-16">
            <div
              className={`
                relative
                overflow-hidden
                rounded-3xl
                border
                p-8
                sm:p-10
                text-center
                ${
                  isLight
                    ? `
                      bg-gradient-to-br
                      from-blue-50
                      via-white
                      to-violet-50
                      border-blue-100
                    `
                    : `
                      bg-gradient-to-br
                      from-blue-500/[0.07]
                      via-[#0d1118]
                      to-violet-500/[0.07]
                      border-white/[0.07]
                    `
                }
              `}
            >
              <div className="text-4xl">🚀</div>

              <h2
                className={`
                  mt-5
                  text-2xl
                  sm:text-3xl
                  font-bold
                  ${isLight ? "text-slate-900" : "text-white"}
                `}
              >
                Thanks for exploring AI Messenger.
              </h2>

              <p
                className={`
                  max-w-2xl
                  mx-auto
                  mt-4
                  text-sm
                  sm:text-base
                  leading-7
                  ${isLight ? "text-slate-500" : "text-gray-500"}
                `}
              >
                A project built from ideas, experiments, mistakes, improvements
                and a lot of learning.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 mt-7">
                <a
                  href="https://github.com/rajeshh12"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    group
                    relative
                    overflow-hidden
                    inline-flex
                    items-center
                    gap-2
                    px-6
                    py-3
                    rounded-xl
                    border
                    text-sm
                    font-semibold
                    transition-all
                    duration-300
                    ease-out
                    hover:-translate-y-1
                    hover:scale-[1.02]
                    active:scale-95
                    ${
                      isLight
                        ? `
                          bg-white
                          text-slate-700
                          border-slate-200
                          hover:bg-slate-50
                          hover:shadow-lg
                          hover:shadow-slate-200/60
                        `
                        : `
                          bg-white/[0.04]
                          text-gray-300
                          border-white/[0.08]
                          hover:bg-white/[0.08]
                          hover:shadow-lg
                          hover:shadow-black/20
                        `
                    }
                  `}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full transition-transform duration-700 group-hover:translate-x-full" />

                  <span className="relative">GitHub ↗</span>
                </a>

                <a
                  href="https://www.linkedin.com/in/rajeshlru/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    group
                    relative
                    overflow-hidden
                    inline-flex
                    items-center
                    gap-2
                    px-6
                    py-3
                    rounded-xl
                    border
                    text-sm
                    font-semibold
                    transition-all
                    duration-300
                    ease-out
                    hover:-translate-y-1
                    hover:scale-[1.02]
                    active:scale-95
                    ${
                      isLight
                        ? `
                          bg-white
                          text-blue-600
                          border-blue-200
                          hover:bg-blue-50
                          hover:shadow-lg
                          hover:shadow-blue-100/60
                        `
                        : `
                          bg-white/[0.04]
                          text-blue-400
                          border-white/[0.08]
                          hover:bg-white/[0.08]
                          hover:shadow-lg
                          hover:shadow-blue-500/10
                        `
                    }
                  `}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full transition-transform duration-700 group-hover:translate-x-full" />

                  <span className="relative">Connect on LinkedIn ↗</span>
                </a>
              </div>
            </div>
          </section>
          <footer className="py-12 text-center">
            <div
              className={`
      mx-auto
      mb-6
      h-px
      w-24
      ${
        isLight
          ? "bg-gradient-to-r from-transparent via-blue-300 to-transparent"
          : "bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"
      }
    `}
            />

            <div
              className={`
      inline-flex
      items-center
      gap-2
      px-4
      py-2
      rounded-full
      border
      text-[10px]
      font-semibold
      uppercase
      tracking-[0.2em]
      ${
        isLight
          ? "bg-white/70 border-slate-200 text-slate-500 shadow-sm"
          : "bg-white/[0.03] border-white/[0.07] text-gray-500"
      }
    `}
            >
              <span
                className={`
        w-1.5
        h-1.5
        rounded-full
        ${isLight ? "bg-emerald-500" : "bg-emerald-400"}
      `}
              />
              Built with curiosity
            </div>

            <p
              className={`
      mt-5
      text-sm
      font-medium
      ${isLight ? "text-slate-800" : "text-gray-400"}
    `}
            >
              Designed & developed by{" "}
              <span
                className={`
        font-semibold
        ${isLight ? "text-slate-900" : "text-gray-300"}
      `}
              >
                Rajesh Elluru
              </span>
            </p>

            <p
              className={`
      mt-4
      text-xs
      ${isLight ? "text-slate-600" : "text-gray-600"}
    `}
            >
              Made with{" "}
              <span
                className="
        inline-block
        mx-1
        text-red-500
        animate-[heartbeat_1.2s_ease-in-out_infinite]
        hover:scale-125
        transition-transform
        duration-300
      "
                style={{
                  transformOrigin: "center",
                }}
              >
                ❤️
              </span>
              and lots of learning
            </p>

            <div
              className={`
      mt-5
      flex
      items-center
      justify-center
      gap-3
      text-[13px]
      ${isLight ? "text-slate-900" : "text-gray-100"}
    `}
            >
              <span>AI Messenger</span>
              <span>•</span>
              <span>2026</span>
              <span>•</span>
              <span>Keep building.</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default AboutDeveloper;
