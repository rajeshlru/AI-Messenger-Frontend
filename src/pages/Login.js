import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
function Login() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isLight = theme === "light";

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    const trimmedEmail = email.trim().toLowerCase();

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

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
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

      localStorage.setItem("token", data.token);

      localStorage.setItem("user", JSON.stringify(data.user));

      setLoading(false);

      navigate("/chat");
    } catch (error) {
      setLoading(false);
      setError("Unable to connect to server");
    }
  };

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8 overflow-hidden relative transition-colors duration-300 ${
        isLight ? "bg-gray-50 text-gray-900" : "bg-[#080b12] text-white"
      }`}
    >
      <ThemeToggle />
      <div className="absolute inset-0 opacity-[0.018] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:40px_40px] animate-[gridMove_18s_linear_infinite]" />

      <div className="relative z-10 w-full max-w-[430px] sm:max-w-[460px]">
        <div className="mb-5 sm:mb-6 animate-[fadeDown_0.6s_ease-out]">
          <Link
            to="/"
            className="
              group
              inline-flex
              items-center
              gap-2
              px-3.5
              py-2
              rounded-xl
              bg-white/[0.035]
              border border-white/[0.07]
              text-gray-400
              hover:text-white
              hover:bg-white/[0.06]
              hover:border-white/[0.12]
              hover:-translate-y-1
              hover:shadow-lg
              hover:shadow-black/20
              transition-all
              duration-300
            "
          >
            <span className="text-base transition-transform duration-300 group-hover:-translate-x-1 group-hover:scale-110">
              ←
            </span>

            <span className="text-sm font-medium">Home</span>
          </Link>
        </div>

        <div className="text-center mb-7 sm:mb-8 animate-[fadeUp_0.7s_ease-out]">
          <div className="inline-flex items-center justify-center relative mb-5">
            <div className="absolute inset-0 rounded-[18px] bg-blue-500/30 blur-2xl animate-[logoGlow_3s_ease-in-out_infinite]" />

            <div
              className="
                relative
                w-14
                h-14
                sm:w-16
                sm:h-16
                rounded-[18px]
                bg-gradient-to-br
                from-blue-500
                via-indigo-500
                to-purple-600
                flex
                items-center
                justify-center
                shadow-xl
                shadow-blue-900/30
                transition-all
                duration-500
                hover:scale-110
                hover:-rotate-3
                hover:shadow-purple-900/40
              "
            >
              <span className="text-white text-lg sm:text-xl font-bold tracking-tight transition-transform duration-500 hover:scale-110">
                AI
              </span>
            </div>
          </div>

          <h1
            className={`text-[27px] sm:text-3xl font-bold tracking-tight animate-[titleIn_0.7s_ease-out_0.1s_both] ${
              isLight ? "text-gray-900" : "text-white"
            }`}
          >
            Welcome Back
          </h1>

          <p
            className={`text-sm sm:text-base mt-2 px-3 animate-[fadeUp_0.6s_ease-out_0.2s_both] ${
              isLight ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Login to your AI Messenger account
          </p>
        </div>

        <div className="relative animate-[cardEnter_0.8s_cubic-bezier(.22,1,.36,1)_0.15s_both]">
          <div className="absolute -inset-[1px] rounded-[22px] bg-gradient-to-br from-blue-500/25 via-purple-500/10 to-cyan-500/15 opacity-80 transition-all duration-500 hover:opacity-100 hover:blur-[2px]" />

          <div
            className={`
  relative
  w-full
  backdrop-blur-xl
  rounded-[22px]
  p-5
  sm:p-7
  md:p-8
  shadow-2xl
  transition-all
  duration-500
  hover:-translate-y-1

  ${
    isLight
      ? "bg-white border border-gray-200 shadow-gray-200/60"
      : "bg-[#10141e]/95 border border-white/[0.07] shadow-black/50"
  }
`}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent animate-[accentMove_3s_ease-in-out_infinite]" />

            {error && (
              <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3.5 animate-[shake_0.4s_ease-in-out]">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-red-500/15 flex items-center justify-center animate-[popIn_0.35s_ease-out]">
                    <span className="text-red-400 text-sm font-semibold">
                      !
                    </span>
                  </div>

                  <p className="text-sm text-red-400 leading-5">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="animate-[fieldIn_0.55s_ease-out_0.3s_both]">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
                  className={`
    w-full
    h-[50px]
    px-4
    rounded-xl

    ${
      isLight
        ? "bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400"
        : "bg-[#090d15] border border-white/[0.08] text-white placeholder:text-gray-600"
    }

    text-sm
    sm:text-base
    outline-none
    transition-all
    duration-300

    ${
      isLight
        ? "hover:border-gray-400 focus:border-blue-500/60 focus:bg-white"
        : "hover:border-white/[0.14] hover:-translate-y-[1px] focus:border-blue-500/60 focus:bg-[#0b1019]"
    }

    focus:ring-4
    focus:ring-blue-500/[0.07]
    focus:-translate-y-[1px]
  `}
                />
              </div>

              <div className="animate-[fieldIn_0.55s_ease-out_0.4s_both]">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={`
    w-full
    h-[50px]
    px-4
    pr-12
    rounded-xl

    ${
      isLight
        ? "bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300"
        : "bg-[#0a0d14] text-gray-100 placeholder:text-gray-600 border border-white/[0.08]"
    }

    text-sm
    sm:text-base
    outline-none
    transition-all
    duration-300

    ${
      isLight
        ? "hover:bg-gray-50 hover:border-gray-400 focus:bg-white focus:border-blue-500/60"
        : "hover:border-white/[0.14] hover:-translate-y-[1px] focus:border-blue-500/60 focus:bg-[#0b1019]"
    }

    focus:ring-4
    focus:ring-blue-500/[0.07]
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
                      hover:text-blue-300
                      hover:bg-blue-400/[0.08]
                      active:scale-90
                      transition-all
                      duration-200
                      disabled:opacity-40
                    "
                  >
                    <span
                      className={`text-lg transition-all duration-200 ${
                        showPassword ? "scale-110 opacity-100" : "opacity-70"
                      }`}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`
    group
    relative
    w-full
    h-[50px]
    mt-1
    overflow-hidden
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
          from-blue-400
          via-indigo-500
          to-purple-600
          text-white
          border-white/10
          shadow-lg
          shadow-blue-900/25
        `
    }

    ${
      loading
        ? `
          opacity-95
          cursor-wait
        `
        : `
          hover:-translate-y-1
          hover:shadow-xl
          active:translate-y-0
          active:scale-[0.98]
        `
    }

    animate-[buttonIn_0.6s_ease-out_0.5s_both]
  `}
              >
                {!loading && (
                  <>
                    <span className="absolute inset-y-0 -left-20 w-16 bg-white/25 skew-x-[-20deg] transition-all duration-700 group-hover:left-[120%]" />

                    <span className="absolute inset-0 rounded-xl ring-1 ring-white/0 group-hover:ring-white/20 transition-all duration-300" />

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
              : "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600"
          }
        `}
                    />
                  </>
                )}

                <span className="relative z-10 flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <span
                        className={`
            w-5
            h-5
            rounded-full
            border-[3px]
            animate-spin
            flex-shrink-0

            ${
              isLight
                ? `
                  border-blue-900/20
                  border-t-blue-950
                  border-r-violet-900
                `
                : `
                  border-white/25
                  border-t-white
                  border-r-cyan-200
                `
            }
          `}
                      />

                      <span
                        className={`
            font-semibold
            tracking-wide
            ${isLight ? "text-gray-950" : "text-white"}
          `}
                      >
                        Signing in...
                      </span>
                    </>
                  ) : (
                    <span
                      className={`
          font-semibold
          ${isLight ? "text-gray-950" : "text-white"}
        `}
                    >
                      Login
                    </span>
                  )}
                </span>
              </button>
            </form>

            <div className="flex items-center gap-3 my-6 sm:my-7 animate-[fadeIn_0.6s_ease-out_0.65s_both]">
              <div className="h-px flex-1 bg-white/[0.07]" />

              <span className="text-[10px] sm:text-[11px] font-medium text-gray-600 tracking-[0.15em]">
                NEW HERE?
              </span>

              <div className="h-px flex-1 bg-white/[0.07]" />
            </div>

            <p className="text-center text-sm text-gray-500 animate-[fadeUp_0.6s_ease-out_0.7s_both]">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="
                  group
                  inline-flex
                  items-center
                  gap-1
                  text-blue-400
                  hover:text-blue-300
                  font-medium
                  transition-all
                  duration-200
                "
              >
                Register
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-5 sm:mt-6 animate-[fadeUp_1s_ease-out_0.8s_both]">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/70 shadow-sm shadow-emerald-400/30 animate-pulse" />

          <p className="text-[11px] sm:text-xs text-gray-600 text-center">
            Securely sign in to continue
          </p>
        </div>
      </div>

      <style>{`
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

        @keyframes fadeDown {
          from {
            opacity: 0;
            transform: translateY(-14px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
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

        @keyframes titleIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.97);
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
            transform: translateY(-8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
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
            transform: translateX(-4px);
          }

          80% {
            transform: translateX(4px);
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

        @keyframes logoGlow {
          0%, 100% {
            opacity: 0.7;
            transform: scale(0.95);
          }

          50% {
            opacity: 1;
            transform: scale(1.08);
          }
        }

        @keyframes accentMove {
          0%, 100% {
            opacity: 0.3;
            transform: translateX(-25px);
          }

          50% {
            opacity: 1;
            transform: translateX(25px);
          }
        }

        @keyframes gridMove {
          from {
            background-position: 0 0;
          }

          to {
            background-position: 40px 40px;
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
      `}</style>
    </div>
  );
}

export default Login;
