import { useState } from "react";

function LoginPage({ onBack }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <header className="bg-surface w-full top-0 sticky border-b border-outline-variant flex items-center justify-between px-8 h-16 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            Back to App
          </button>
          <span className="font-headline-md text-headline-md font-bold text-primary">LogicFlow AI</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-full p-2 flex items-center justify-center cursor-pointer active:opacity-80">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-6 relative">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg w-full max-w-md shadow-sm p-8 z-10 relative">
          <div className="text-center mb-8">
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Sign In</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Welcome back to your workspace</p>
          </div>

          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              // No real auth yet — redirect back into the app on submit.
              onBack();
            }}
          >
            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant block uppercase" htmlFor="email">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">mail</span>
                <input
                  className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border-b border-outline-variant focus:border-b-2 focus:border-primary focus:outline-none transition-all rounded-t-lg bg-surface-container-low hover:bg-surface-container font-body-md text-body-md text-on-surface"
                  id="email"
                  placeholder="you@example.com"
                  required
                  type="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-label-caps text-label-caps text-on-surface-variant block uppercase" htmlFor="password">Password</label>
                <a className="font-body-md text-body-md text-primary hover:text-primary-container transition-colors" href="#">Forgot Password?</a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">lock</span>
                <input
                  className="w-full pl-10 pr-10 py-3 bg-surface-container-lowest border-b border-outline-variant focus:border-b-2 focus:border-primary focus:outline-none transition-all rounded-t-lg bg-surface-container-low hover:bg-surface-container font-body-md text-body-md text-on-surface"
                  id="password"
                  placeholder="••••••••"
                  required
                  type={showPassword ? "text" : "password"}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <button
              className="w-full bg-primary text-on-primary py-3 px-4 rounded-lg font-body-md text-body-md font-semibold hover:bg-primary-container transition-colors focus:outline-none flex justify-center items-center gap-2"
              type="submit"
            >
              Sign In
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Don't have an account? <a className="text-primary hover:text-primary-container font-semibold transition-colors" href="#">Sign up</a>
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-surface w-full bottom-0 border-t border-outline-variant flex flex-col md:flex-row items-center justify-between px-8 py-6 mt-auto z-50">
        <div className="font-headline-md text-headline-md font-bold text-primary mb-4 md:mb-0">
          LogicFlow AI
        </div>
        <div className="flex flex-wrap justify-center gap-6 mb-4 md:mb-0">
          <a className="font-label-caps text-label-caps text-on-surface-variant opacity-70 hover:text-primary transition-colors cursor-pointer" href="#">Privacy Policy</a>
          <a className="font-label-caps text-label-caps text-on-surface-variant opacity-70 hover:text-primary transition-colors cursor-pointer" href="#">Terms of Service</a>
          <a className="font-label-caps text-label-caps text-on-surface-variant opacity-70 hover:text-primary transition-colors cursor-pointer" href="#">Contact Support</a>
        </div>
        <div className="font-label-caps text-label-caps text-on-surface-variant opacity-70 text-center md:text-right">
          © 2026 LogicFlow AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default LoginPage;
