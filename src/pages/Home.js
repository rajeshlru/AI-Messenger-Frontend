import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
function Home() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div
      className={
        theme === "dark"
          ? "min-h-screen bg-black text-white"
          : "min-h-screen bg-[#f8f9fc] text-gray-900"
      }
    >
      <div
        className={`absolute inset-0 pointer-events-none opacity-[0.025] ${
          isLight
            ? "bg-[linear-gradient(rgba(120,140,180,1)_1px,transparent_1px),linear-gradient(90deg,rgba(120,140,180,1)_1px,transparent_1px)]"
            : "bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)]"
        } bg-[size:48px_48px]`}
      />

      <div className="absolute top-[-220px] left-[10%] w-[420px] h-[420px] rounded-full bg-blue-600/[0.08] blur-[130px] animate-[orbOne_8s_ease-in-out_infinite]" />

      <div className="absolute bottom-[-220px] right-[8%] w-[430px] h-[430px] rounded-full bg-purple-600/[0.08] blur-[140px] animate-[orbTwo_9s_ease-in-out_infinite]" />

      <nav
        className={`relative z-20 min-h-[76px] sm:h-20 flex items-center justify-between max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 border-b ${
          isLight ? "border-gray-200/70" : "border-white/[0.05]"
        }`}
      >
        <Link
          to="/"
          className="group flex items-center gap-3 animate-[fadeDown_0.6s_ease-out] shrink-0"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-900/20 group-hover:scale-105 group-hover:rotate-2 transition-all duration-300">
            <span className="text-sm font-bold">AI</span>
          </div>

          <div className="hidden sm:block">
            <p
              className={`font-semibold text-[15px] ${
                isLight ? "text-gray-900" : "text-gray-100"
              }`}
            >
              AI Messenger
            </p>

            <p
              className={`text-[10px] ${
                isLight ? "text-gray-500" : "text-gray-600"
              }`}
            >
              Talk. Ask. Create.
            </p>
          </div>
        </Link>

        <div className="flex  items-end gap-2">
          <div className="flex items-center gap-2 sm:gap-3 animate-[fadeDown_0.6s_ease-out_0.1s_both]">
            <Link
              to="/login"
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium border hover:-translate-y-0.5 transition-all duration-300 ${
                isLight
                  ? "text-orange-600 border-gray-200 bg-white hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300"
                  : "text-gray-400 border-white/[0.07] bg-white/[0.025] hover:text-white hover:bg-white/[0.06] hover:border-white/[0.13]"
              }`}
            >
              Login
            </Link>

            <Link
              to="/register"
              className="group relative overflow-hidden px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-sm font-semibold shadow-lg shadow-blue-900/20 hover:shadow-purple-900/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              <span className="absolute inset-y-0 -left-12 w-10 bg-white/20 skew-x-[-20deg] group-hover:left-[120%] transition-all duration-700" />

              <span className="relative">Get Started</span>
            </Link>
          </div>
          <ThemeToggle inline />
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <section className="min-h-[calc(100vh-76px)] sm:min-h-[calc(100vh-80px)] grid lg:grid-cols-[1.05fr_0.95fr] gap-12 xl:gap-20 items-center py-12 sm:py-16 lg:py-20">
          <div className="max-w-2xl">
            <div
              className={`inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full border mb-7 animate-[fadeUp_0.7s_ease-out] transition-all duration-300 ${
                isLight
                  ? "bg-blue-50 border-blue-100 hover:bg-blue-100/70 hover:border-blue-200"
                  : "bg-blue-500/[0.06] border-blue-400/[0.12] hover:bg-blue-500/[0.1] hover:border-blue-400/[0.2]"
              }`}
            >
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60 animate-ping" />

                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
              </span>

              <span
                className={`text-xs sm:text-sm ${
                  isLight ? "text-blue-600" : "text-blue-300"
                }`}
              >
                Your conversations, your way
              </span>
            </div>

            <h1 className="text-[34px] sm:text-5xl md:text-6xl lg:text-[64px] xl:text-[72px] font-mono tracking-[-0.045em] leading-[1.02] animate-[heroText_0.8s_ease-out_0.1s_both]">
              <span className={isLight ? "text-gray-900" : "text-white"}>
                A smarter way
              </span>
              <br />
              <span className="text-red-300">to</span>{" "}
              <span className="text-red-300">chat.</span>
            </h1>

            <p
              className={`mt-7 text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl animate-[fadeUp_0.8s_ease-out_0.25s_both] ${
                isLight ? "text-gray-800" : "text-gray-400"
              }`}
            >
              Ask questions, explore ideas, manage conversations and interact
              with AI — all from one simple messenger.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 animate-[fadeUp_0.8s_ease-out_0.4s_both]">
              <Link
                to="/register"
                className="group relative overflow-hidden inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 font-semibold shadow-xl shadow-blue-950/20 hover:shadow-purple-950/30 hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
              >
                <span className="absolute inset-y-0 -left-16 w-14 bg-white/20 skew-x-[-20deg] group-hover:left-[120%] transition-all duration-700" />

                <span className="relative">Start Chatting</span>

                <span className="relative text-lg transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                to="/login"
                className={`group inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-xl border font-semibold hover:-translate-y-1 transition-all duration-300 ${
                  isLight
                    ? "border-gray-200 bg-white text-teal-500 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300"
                    : "border-white/[0.09] bg-white/[0.025] text-gray-300 hover:text-white hover:bg-white/[0.06] hover:border-white/[0.16]"
                }`}
              >
                <span>Login</span>

                <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  →
                </span>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-5 sm:gap-7 mt-9 animate-[fadeUp_0.8s_ease-out_0.55s_both]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />

                <span className="text-xs sm:text-sm text-gray-500">
                  Ready to use
                </span>
              </div>

              <div
                className={`w-px h-4 ${
                  isLight ? "bg-gray-200" : "bg-white/[0.08]"
                }`}
              />

              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-500">
                  Simple interface
                </span>
              </div>

              <div
                className={`w-px h-4 hidden sm:block ${
                  isLight ? "bg-gray-200" : "bg-white/[0.08]"
                }`}
              />

              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-500">
                  Built for conversations
                </span>
              </div>
            </div>
          </div>

          <div className="relative w-full max-w-[520px] mx-auto lg:ml-auto animate-[previewEnter_1s_cubic-bezier(.22,1,.36,1)_0.25s_both]">
            <div className="absolute -inset-10 bg-gradient-to-r from-blue-500/[0.07] via-purple-500/[0.08] to-cyan-500/[0.05] blur-3xl rounded-full" />

            <div className="relative">
              <div
                className={`absolute -top-4 left-8 right-8 h-8 rounded-t-2xl border border-b-0 flex items-center px-4 gap-2 ${
                  isLight
                    ? "bg-white border-gray-200"
                    : "bg-[#161c28] border-white/[0.07]"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400/50" />

                <span
                  className={`ml-3 text-[10px] ${
                    isLight ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  AI Messenger
                </span>
              </div>

              <div
                className={`mt-4 rounded-[22px] border shadow-2xl overflow-hidden hover:-translate-y-1 transition-all duration-500 ${
                  isLight
                    ? "bg-white border-gray-200 shadow-gray-300/30 hover:border-blue-200"
                    : "bg-[#10151f] border-white/[0.08] shadow-black/50 hover:border-white/[0.13]"
                }`}
              >
                <div
                  className={`px-5 sm:px-6 py-4 border-b flex items-center justify-between ${
                    isLight ? "border-gray-200" : "border-white/[0.06]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-[10px] font-bold">AI</span>
                    </div>

                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isLight ? "text-gray-800" : "text-gray-200"
                        }`}
                      >
                        AI Assistant
                      </p>

                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

                        <span
                          className={`text-[10px] ${
                            isLight ? "text-gray-500" : "text-gray-600"
                          }`}
                        >
                          Online
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`text-lg ${
                      isLight ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    ···
                  </div>
                </div>

                <div className="p-5 sm:p-7 min-h-[360px]">
                  <div className="flex items-start gap-3 animate-[chatOne_5s_ease-in-out_infinite]">
                    <div
                      className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 ${
                        isLight
                          ? "bg-blue-50 border-blue-100"
                          : "bg-blue-500/10 border-blue-400/10"
                      }`}
                    >
                      <span className="text-[9px] font-bold text-blue-300">
                        AI
                      </span>
                    </div>

                    <div
                      className={`max-w-[75%] rounded-2xl rounded-tl-sm border px-4 py-3 ${
                        isLight
                          ? "bg-[#f1f4fa] border-gray-200"
                          : "bg-[#171e2b] border-white/[0.06]"
                      }`}
                    >
                      <p
                        className={`text-sm leading-relaxed ${
                          isLight ? "text-green-800" : "text-gray-300"
                        }`}
                      >
                        Hey! What would you like to explore today?
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end mt-5 animate-[chatTwo_5s_ease-in-out_infinite]">
                    <div
                      className={`max-w-[75%] rounded-2xl rounded-tr-sm border px-4 py-3 ${
                        isLight
                          ? "bg-gradient-to-r from-blue-100 to-purple-100 border-blue-200"
                          : "bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-400/[0.1]"
                      }`}
                    >
                      <p
                        className={`text-sm ${
                          isLight ? "text-blue-700" : "text-gray-300"
                        }`}
                      >
                        Help me plan my day.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 mt-5 animate-[chatThree_5s_ease-in-out_infinite]">
                    <div
                      className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 ${
                        isLight
                          ? "bg-blue-50 border-blue-100"
                          : "bg-blue-500/10 border-blue-400/10"
                      }`}
                    >
                      <span className="text-[9px] font-bold text-blue-300">
                        AI
                      </span>
                    </div>

                    <div
                      className={`rounded-2xl rounded-tl-sm border px-4 py-3 ${
                        isLight
                          ? "bg-[#f1f4fa] border-gray-200"
                          : "bg-[#171e2b] border-white/[0.06]"
                      }`}
                    >
                      <div className="flex gap-1.5 items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" />
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`px-5 sm:px-6 py-4 border-t ${
                    isLight ? "border-gray-200" : "border-white/[0.06]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex-1 h-11 rounded-xl border flex items-center px-4 ${
                        isLight
                          ? "bg-[#f4f5fb] border-gray-200"
                          : "bg-[#090d15] border-white/[0.07]"
                      }`}
                    >
                      <span
                        className={`text-sm ${
                          isLight ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Message AI...
                      </span>
                    </div>

                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
                      <span className="text-lg">↑</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-16 sm:pb-20">
          <div className="text-center mb-9">
            <p
              className={`text-xs uppercase tracking-[0.2em] ${
                isLight ? "text-gray-500" : "text-gray-600"
              }`}
            >
              Everything in one place
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div
              className={`group rounded-2xl border p-5 hover:-translate-y-1 transition-all duration-300 ${
                isLight
                  ? "bg-white border-gray-200 hover:bg-blue-50/40 hover:border-blue-200"
                  : "bg-white/[0.025] border-white/[0.06] hover:bg-white/[0.045] hover:border-blue-400/[0.15]"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-400/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <span className="text-blue-400 text-lg">✦</span>
              </div>

              <h3
                className={`font-semibold ${
                  isLight ? "text-gray-800" : "text-gray-200"
                }`}
              >
                Ask anything
              </h3>

              <p
                className={`text-sm mt-2 leading-relaxed ${
                  isLight ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Explore ideas, solve problems and get useful answers.
              </p>
            </div>

            <div
              className={`group rounded-2xl border p-5 hover:-translate-y-1 transition-all duration-300 ${
                isLight
                  ? "bg-white border-gray-200 hover:bg-purple-50/40 hover:border-purple-200"
                  : "bg-white/[0.025] border-white/[0.06] hover:bg-white/[0.045] hover:border-purple-400/[0.15]"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-400/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                <span className="text-purple-400 text-lg">◈</span>
              </div>

              <h3
                className={`font-semibold ${
                  isLight ? "text-gray-800" : "text-gray-200"
                }`}
              >
                Keep conversations
              </h3>

              <p
                className={`text-sm mt-2 leading-relaxed ${
                  isLight ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Keep your conversations together and easy to access.
              </p>
            </div>

            <div
              className={`group rounded-2xl border p-5 hover:-translate-y-1 transition-all duration-300 ${
                isLight
                  ? "bg-white border-gray-200 hover:bg-cyan-50/40 hover:border-cyan-200"
                  : "bg-white/[0.025] border-white/[0.06] hover:bg-white/[0.045] hover:border-cyan-400/[0.15]"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <span className="text-cyan-400 text-lg">↗</span>
              </div>

              <h3
                className={`font-semibold ${
                  isLight ? "text-gray-800" : "text-gray-200"
                }`}
              >
                Stay focused
              </h3>

              <p
                className={`text-sm mt-2 leading-relaxed ${
                  isLight ? "text-gray-500" : "text-gray-500"
                }`}
              >
                A clean interface designed to keep the conversation flowing.
              </p>
            </div>
          </div>
        </section>
      </main>

      <style>
        {`
          @keyframes fadeDown {
            from {
              opacity: 0;
              transform: translateY(-15px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes heroText {
            from {
              opacity: 0;
              transform: translateY(30px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes previewEnter {
            from {
              opacity: 0;
              transform: translateX(35px) translateY(15px) scale(0.97);
            }
            to {
              opacity: 1;
              transform: translateX(0) translateY(0) scale(1);
            }
          }

          @keyframes orbOne {
            0%, 100% {
              transform: translate(0, 0);
            }

            50% {
              transform: translate(40px, 30px);
            }
          }

          @keyframes orbTwo {
            0%, 100% {
              transform: translate(0, 0);
            }

            50% {
              transform: translate(-35px, -25px);
            }
          }

          @keyframes chatOne {
            0%, 15% {
              opacity: 0.5;
              transform: translateY(5px);
            }

            25%, 75% {
              opacity: 1;
              transform: translateY(0);
            }

            85%, 100% {
              opacity: 0.5;
              transform: translateY(5px);
            }
          }

          @keyframes chatTwo {
            0%, 25% {
              opacity: 0.4;
              transform: translateY(6px);
            }

            35%, 70% {
              opacity: 1;
              transform: translateY(0);
            }

            80%, 100% {
              opacity: 0.4;
              transform: translateY(6px);
            }
          }

          @keyframes chatThree {
            0%, 35% {
              opacity: 0.3;
              transform: translateY(6px);
            }

            45%, 70% {
              opacity: 1;
              transform: translateY(0);
            }

            80%, 100% {
              opacity: 0.3;
              transform: translateY(6px);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Home;
