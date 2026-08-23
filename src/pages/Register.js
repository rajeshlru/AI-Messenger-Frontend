import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

function Register() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isLight = theme === "light";
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      setError("Name is required");
      return;
    }

    if (trimmedName.length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    if (trimmedName.length > 50) {
      setError("Name must not exceed 50 characters");
      return;
    }

    if (!/^[A-Za-z ]+$/.test(trimmedName)) {
      setError("Name can contain only letters and spaces");
      return;
    }

    if (!trimmedEmail) {
      setError("Email is required");
      return;
    }

    const emailRegex = /^[A-Za-z0-9.\_%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password.length > 72) {
      setError("Password must not exceed 72 characters");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter");
      return;
    }

    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter");
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one number");
      return;
    }

    if (!/[!@#$%^&\*(),.?":{}|<>\_\\-]/.test(password)) {
      setError("Password must contain at least one special character");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: trimmedName,
            email: trimmedEmail,
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        setLoading(false);
        return;
      }

      setMessage(data.message);

      setName("");
      setEmail("");
      setPassword("");
      setShowPassword(false);

      setLoading(false);

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      setLoading(false);
      setError("Unable to connect to server");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 sm:px-6 py-6 sm:py-10 overflow-hidden relative transition-colors duration-300 ${
        isLight ? "bg-gray-50 text-gray-900" : "bg-[#08090f] text-white"
      }`}
    >
      {" "}
      <ThemeToggle />{" "}
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-violet-600/10 rounded-full blur-[120px] -top-32 -left-32 animate-pulse" />
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-cyan-500/10 rounded-full blur-[120px] -bottom-40 -right-32 animate-pulse" />
      <div className="absolute w-56 h-56 bg-pink-500/[0.06] rounded-full blur-[100px] top-1/2 left-1/2 animate-[floatGlow_7s_ease-in-out_infinite]" />
      <div className="relative z-10 w-full max-w-5xl animate-[pageEnter_0.8s_ease-out]">
        <div className="mb-5 sm:mb-7 animate-[slideRight_0.7s_ease-out]">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/[0.08] bg-white/[0.035] backdrop-blur-md text-gray-400 hover:text-white hover:bg-white/[0.07] hover:border-white/[0.15] hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20 transition-all duration-300"
          >
            <span className="text-lg transition-transform duration-300 group-hover:-translate-x-1 group-hover:scale-110">
              ←
            </span>

            <span className="text-sm font-medium transition-transform duration-300 group-hover:translate-x-0.5">
              Home
            </span>
          </Link>
        </div>

        <div className="grid lg:grid-cols-[1fr_460px] gap-8 lg:gap-14 items-center">
          <div className="hidden lg:block">
            <div className="max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.07] mb-6 animate-[fadeUp_0.7s_ease-out_0.15s_both] hover:bg-white/[0.07] hover:border-white/[0.12] transition-all duration-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

                <span className="text-xs text-gray-400">AI Messenger</span>
              </div>

              <h1 className="text-5xl xl:text-6xl font-bold leading-[1.05] tracking-tight animate-[fadeUp_0.8s_ease-out_0.25s_both]">
                <span className="text-white inline-block hover:translate-x-1 transition-transform duration-300">
                  Conversations
                </span>

                <br />

                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent animate-pulse inline-block">
                  made smarter.
                </span>
              </h1>

              <p className="mt-6 text-gray-400 text-base xl:text-lg leading-relaxed max-w-md animate-[fadeUp_0.8s_ease-out_0.4s_both]">
                Create your account and step into a cleaner, smarter way to
                communicate with AI.
              </p>

              <div className="mt-10 space-y-4">
                <div className="flex items-start gap-3 animate-[messageOne_4s_ease-in-out_infinite]">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:scale-110 hover:rotate-3">
                    <span className="text-xs font-bold">AI</span>
                  </div>

                  <div className="bg-white/[0.045] border border-white/[0.06] rounded-2xl rounded-tl-md px-4 py-3 transition-all duration-300 hover:bg-white/[0.07] hover:border-white/[0.1] hover:-translate-y-1">
                    <p className="text-sm text-gray-300">Ready when you are.</p>
                  </div>
                </div>

                <div className="flex justify-end animate-[messageTwo_4s_ease-in-out_infinite]">
                  <div className="bg-gradient-to-r from-blue-600/20 to-violet-600/20 border border-blue-500/10 rounded-2xl rounded-tr-md px-4 py-3 transition-all duration-300 hover:border-blue-500/20 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-900/10">
                    <p className="text-sm text-gray-300">
                      Let's get started ✨
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-8">
                <span className="px-3 py-1.5 rounded-lg bg-cyan-400/[0.06] border border-cyan-400/10 text-xs text-cyan-300 animate-[chipIn_0.5s_ease-out_0.7s_both] hover:bg-cyan-400/[0.1] hover:border-cyan-400/20 hover:-translate-y-1 transition-all duration-300">
                  Intelligent
                </span>

                <span className="px-3 py-1.5 rounded-lg bg-violet-400/[0.06] border border-violet-400/10 text-xs text-violet-300 animate-[chipIn_0.5s_ease-out_0.8s_both] hover:bg-violet-400/[0.1] hover:border-violet-400/20 hover:-translate-y-1 transition-all duration-300">
                  Fast
                </span>

                <span className="px-3 py-1.5 rounded-lg bg-pink-400/[0.06] border border-pink-400/10 text-xs text-pink-300 animate-[chipIn_0.5s_ease-out_0.9s_both] hover:bg-pink-400/[0.1] hover:border-pink-400/20 hover:-translate-y-1 transition-all duration-300">
                  Simple
                </span>
              </div>
            </div>
          </div>

          <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto animate-[cardEnter_0.8s_cubic-bezier(.22,1,.36,1)_0.15s_both]">
            <div className="lg:hidden text-center mb-7 animate-[fadeUp_0.7s_ease-out_both]">
              <div className="inline-flex relative mb-4">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 blur-xl opacity-30 animate-pulse" />

                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 flex items-center justify-center shadow-xl shadow-blue-900/30 hover:scale-105 hover:rotate-2 transition-all duration-300">
                  <span className="text-white text-lg font-bold">AI</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold animate-[fadeUp_0.6s_ease-out_0.15s_both]">
                Create your account
              </h1>

              <p className="text-sm text-gray-500 mt-2 animate-[fadeUp_0.6s_ease-out_0.25s_both]">
                Start your journey with AI Messenger
              </p>
            </div>

            <div className="relative group">
              <div className="absolute -inset-[1px] rounded-[25px] bg-gradient-to-br from-cyan-500/30 via-violet-500/20 to-pink-500/20 opacity-80 transition-all duration-500 group-hover:opacity-100 group-hover:blur-[2px]" />

              <div
                className={`
    relative
    backdrop-blur-2xl
    rounded-[24px]
    p-5
    sm:p-7
    shadow-2xl
    transition-all
    duration-500
    group-hover:-translate-y-1

    ${
      isLight
        ? "bg-white/95 border border-gray-200 shadow-gray-200/60 group-hover:border-gray-300"
        : "bg-[#11131c]/95 border border-white/[0.07] shadow-black/50 group-hover:border-white/[0.11] group-hover:shadow-violet-950/20"
    }
  `}
              >
                <div className="mb-7 animate-[fadeUp_0.6s_ease-out_0.3s_both]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2
                        className={`text-xl sm:text-2xl font-semibold ${
                          isLight ? "text-gray-900" : "text-white"
                        }`}
                      >
                        Get started
                      </h2>

                      <p
                        className={`text-xs sm:text-sm mt-1 ${
                          isLight ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        It only takes a moment.
                      </p>
                    </div>

                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/10 to-violet-500/10 border border-white/[0.07] flex items-center justify-center transition-all duration-300 hover:rotate-12 hover:scale-110 hover:border-violet-400/20">
                      <span className="text-sm animate-[sparkle_2s_ease-in-out_infinite]">
                        ✦
                      </span>
                    </div>
                  </div>
                </div>

                {message && (
                  <div className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] px-4 py-3.5 animate-[noticeIn_0.4s_ease-out]">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-emerald-400/10 border border-emerald-400/10 flex items-center justify-center flex-shrink-0 animate-[popIn_0.35s_ease-out]">
                        <span className="text-emerald-400 text-sm">✓</span>
                      </div>

                      <p className="text-sm text-emerald-400">{message}</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3.5 animate-[shake_0.4s_ease-in-out]">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-red-400/10 border border-red-400/10 flex items-center justify-center flex-shrink-0 animate-[popIn_0.35s_ease-out]">
                        <span className="text-red-400 text-sm">!</span>
                      </div>

                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-5">
                  <div className="animate-[fieldIn_0.55s_ease-out_0.4s_both]">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className={`
    w-full
    px-4
    py-3.5
    rounded-xl

    ${
      isLight
        ? "bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400"
        : "bg-[#090b12] border border-white/[0.08] text-white placeholder:text-gray-600"
    }

    text-sm
    sm:text-base
    outline-none
    transition-all
    duration-300

    ${
      isLight
        ? "hover:border-cyan-400/40 hover:-translate-y-[1px] focus:border-cyan-400/60 focus:bg-white"
        : "hover:border-cyan-400/20 hover:-translate-y-[1px] focus:border-cyan-400/50"
    }

    focus:ring-4
    focus:ring-cyan-400/[0.06]
    focus:-translate-y-[1px]
  `}
                    />
                  </div>

                  <div className="animate-[fieldIn_0.55s_ease-out_0.5s_both]">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className={`
    w-full
    px-4
    py-3.5
    rounded-xl

    ${
      isLight
        ? "bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400"
        : "bg-[#090b12] border border-white/[0.08] text-white placeholder:text-gray-600"
    }

    text-sm
    sm:text-base
    outline-none
    transition-all
    duration-300

    ${
      isLight
        ? "hover:border-blue-400/40 hover:-translate-y-[1px] focus:border-blue-400/60 focus:bg-white"
        : "hover:border-blue-400/20 hover:-translate-y-[1px] focus:border-blue-400/50"
    }

    focus:ring-4
    focus:ring-blue-400/[0.06]
    focus:-translate-y-[1px]
  `}
                    />
                  </div>

                  <div className="animate-[fieldIn_0.55s_ease-out_0.6s_both]">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Password
                    </label>

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password"
                        className={`
    w-full
    px-4
    py-3.5
    pr-14
    rounded-xl

    ${
      isLight
        ? "bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400"
        : "bg-[#090b12] border border-white/[0.08] text-white placeholder:text-gray-600"
    }

    text-sm
    sm:text-base
    outline-none
    transition-all
    duration-300

    ${
      isLight
        ? "hover:border-violet-400/40 hover:-translate-y-[1px] focus:border-violet-400/60 focus:bg-white"
        : "hover:border-violet-400/20 hover:-translate-y-[1px] focus:border-violet-400/50"
    }

    focus:ring-4
    focus:ring-violet-400/[0.06]
    focus:-translate-y-[1px]
  `}
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        disabled={loading}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        title={showPassword ? "Hide password" : "Show password"}
                        className="
                          absolute
                          right-3
                          top-1/2
                          -translate-y-1/2
                          w-9
                          h-9
                          rounded-lg
                          flex
                          items-center
                          justify-center
                          text-gray-500
                          hover:text-violet-300
                          hover:bg-violet-400/[0.08]
                          active:scale-90
                          transition-all
                          duration-200
                          disabled:opacity-40
                        "
                      >
                        <span
                          className={`text-lg transition-all duration-200 ${
                            showPassword
                              ? "scale-110 opacity-100"
                              : "opacity-70"
                          }`}
                        >
                          {showPassword ? "🙈" : "👁️"}
                        </span>
                      </button>
                    </div>

                    <p className="text-[11px] sm:text-xs leading-relaxed text-gray-600 mt-2.5">
                      8–72 characters · uppercase · lowercase · number · special
                      character
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`
    group
    relative
    w-full
    overflow-hidden
    py-3.5
    sm:py-4
    rounded-xl
    text-sm
    sm:text-base
    font-semibold
    transition-all
    duration-300
    border

    ${
      isLight
        ? `
          bg-gradient-to-r
          from-cyan-400
          via-blue-500
          to-violet-500
          text-gray-950
          border-blue-400/20
          shadow-lg
          shadow-blue-500/20
        `
        : `
          bg-gradient-to-r
          from-blue-500
          via-indigo-500
          to-violet-600
          text-white
          border-white/10
          shadow-lg
          shadow-violet-900/30
        `
    }

    ${
      loading
        ? "cursor-wait opacity-95"
        : `
          hover:-translate-y-[2px]
          hover:shadow-xl
          active:translate-y-0
          active:scale-[0.98]
        `
    }
  `}
                  >
                    <span
                      className={`
      absolute
      -inset-1
      opacity-0
      blur-xl
      transition-opacity
      duration-500
      group-hover:opacity-30
      pointer-events-none
      ${
        isLight
          ? "bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500"
          : "bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-600"
      }
    `}
                    />

                    {!loading && (
                      <span
                        className="
        absolute
        inset-0
        -translate-x-full
        bg-gradient-to-r
        from-transparent
        via-white/30
        to-transparent
        group-hover:translate-x-full
        transition-transform
        duration-700
        ease-out
        pointer-events-none
      "
                      />
                    )}

                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {loading ? (
                        <>
                          <span
                            className={`
            w-5
            h-5
            sm:w-[22px]
            sm:h-[22px]
            rounded-full
            border-[3px]
            animate-spin
            ${
              isLight
                ? "border-blue-900/20 border-t-blue-950 border-r-violet-900"
                : "border-white/25 border-t-white border-r-cyan-200"
            }
          `}
                          />

                          <span
                            className={
                              isLight
                                ? "text-gray-950 font-semibold tracking-wide"
                                : "text-white font-semibold tracking-wide"
                            }
                          >
                            Creating account...
                          </span>
                        </>
                      ) : (
                        <span
                          className={
                            isLight
                              ? "text-gray-950 font-semibold"
                              : "text-white font-semibold"
                          }
                        >
                          Create Account
                        </span>
                      )}
                    </span>
                  </button>
                </form>

                <div className="flex items-center gap-3 my-6 animate-[fadeIn_0.6s_ease-out_0.85s_both]">
                  <div className="h-px flex-1 bg-white/[0.07]" />

                  <span className="text-[10px] text-gray-600 tracking-[0.2em]">
                    OR
                  </span>

                  <div className="h-px flex-1 bg-white/[0.07]" />
                </div>

                <p className="text-center text-sm text-gray-500 animate-[fadeUp_0.6s_ease-out_0.9s_both]">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-cyan-400 hover:text-cyan-300 font-medium transition-all duration-300 hover:underline hover:underline-offset-4"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mt-5 animate-[fadeIn_0.8s_ease-out_1s_both]">
              <span className="text-emerald-400 text-xs animate-pulse">●</span>

              <p className="text-[11px] sm:text-xs text-gray-600">
                Your information is securely handled
              </p>
            </div>
          </div>
        </div>
      </div>
      <style>
        {`
          @keyframes pageEnter {
            from {
              opacity: 0;
              transform: translateY(18px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(18px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slideRight {
            from {
              opacity: 0;
              transform: translateX(-18px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes cardEnter {
            from {
              opacity: 0;
              transform: translateY(35px) scale(0.96);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes fieldIn {
            from {
              opacity: 0;
              transform: translateY(12px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes buttonIn {
            from {
              opacity: 0;
              transform: translateY(12px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes chipIn {
            from {
              opacity: 0;
              transform: translateY(10px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes popIn {
            0% {
              opacity: 0;
              transform: scale(0.5);
            }
            70% {
              transform: scale(1.15);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes noticeIn {
            from {
              opacity: 0;
              transform: translateY(-10px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes shake {
            0%, 100% {
              transform: translateX(0);
            }
            20% {
              transform: translateX(-5px);
            }
            40% {
              transform: translateX(5px);
            }
            60% {
              transform: translateX(-3px);
            }
            80% {
              transform: translateX(3px);
            }
          }

          @keyframes sparkle {
            0%, 100% {
              opacity: 0.5;
              transform: rotate(0deg) scale(1);
            }
            50% {
              opacity: 1;
              transform: rotate(180deg) scale(1.2);
            }
          }

          @keyframes floatGlow {
            0%, 100% {
              transform: translate(-10px, -10px) scale(1);
            }
            50% {
              transform: translate(20px, 20px) scale(1.08);
            }
          }

          @keyframes messageOne {
            0%, 15% {
              opacity: 0.55;
              transform: translateY(5px);
            }
            25%, 75% {
              opacity: 1;
              transform: translateY(0);
            }
            85%, 100% {
              opacity: 0.55;
              transform: translateY(5px);
            }
          }

          @keyframes messageTwo {
            0%, 25% {
              opacity: 0.4;
              transform: translateY(5px);
            }
            35%, 70% {
              opacity: 1;
              transform: translateY(0);
            }
            80%, 100% {
              opacity: 0.4;
              transform: translateY(5px);
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

export default Register;
