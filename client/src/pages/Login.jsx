import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (error) {
      const message = error?.response?.data?.message || error.message;
      alert(message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/95 shadow-2xl shadow-slate-900/20 dark:bg-slate-950 dark:border-slate-700">
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <div className="space-y-8 p-10 sm:p-14">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">TaskFlow</p>
              <h1 className="text-4xl font-semibold text-slate-950 dark:text-white">Welcome back</h1>
              <p className="max-w-xl leading-8 text-slate-600 dark:text-slate-300">
                Sign in to your premium project dashboard. Stay on top of tasks with clean boards, powerful filters, and beautiful collaboration tools.
              </p>
            </div>
            <div className="grid gap-4">
              <div className="rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-500 p-5 text-sm text-white shadow-lg">
                <p className="font-semibold">Professional planning</p>
                <p className="mt-2 text-sm text-slate-100/90">Streamlined boards, elegant cards, and fast status updates for modern teams.</p>
              </div>
              <div className="rounded-3xl bg-slate-100 p-5 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                <p className="font-semibold">Ready for action</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Login or create an account to start managing tasks instantly.</p>
              </div>
            </div>
          </div>
          <div className="rounded-[2rem] bg-slate-950 p-10 text-white shadow-2xl shadow-slate-950/20 sm:p-12">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Sign in</p>
              <h2 className="mt-3 text-3xl font-semibold">Access your dashboard</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block text-sm font-medium text-slate-300">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="hello@example.com"
                className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                required
              />
              <label className="block text-sm font-medium text-slate-300">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                required
              />
              <button
                className="w-full rounded-3xl bg-gradient-to-r from-sky-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95"
              >
                Login
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-400">
              New here? <Link to="/register" className="font-semibold text-sky-300 hover:text-sky-200">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
