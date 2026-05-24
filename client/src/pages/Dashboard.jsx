import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

const NAV_ITEMS = [
  { label: "Dashboard", icon: "📊" },
  { label: "My Tasks", icon: "🗂️" },
  { label: "Completed", icon: "✅" },
  { label: "Team", icon: "👥" },
  { label: "Settings", icon: "⚙️" },
];

const STATUS_ORDER = ["All", "Todo", "In Progress", "Completed"];

const priorityStyles = {
  High: "bg-rose-100 text-rose-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-emerald-100 text-emerald-700",
};

const statusColumnStyles = {
  Todo: "from-sky-500 to-cyan-500",
  "In Progress": "from-violet-500 to-fuchsia-500",
  Completed: "from-emerald-500 to-teal-500",
};

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [statusFilter, setStatusFilter] = useState("All");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/tasks", formData);
      fetchTasks();
      setFormData({ title: "", description: "", priority: "Medium", dueDate: "" });
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/tasks/${id}`, { status });
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const todoTasks = useMemo(() => tasks.filter((task) => task.status === "Todo"), [tasks]);
  const progressTasks = useMemo(
    () => tasks.filter((task) => task.status === "In Progress"),
    [tasks]
  );
  const completedTasks = useMemo(
    () => tasks.filter((task) => task.status === "Completed"),
    [tasks]
  );

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = [task.title, task.description, task.priority]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchQuery, statusFilter]);

  const summaryCards = [
    {
      label: "Total Tasks",
      value: tasks.length,
      accent: "bg-sky-500/10 text-sky-700 border-sky-200",
      icon: "🗂️",
    },
    {
      label: "Completed",
      value: completedTasks.length,
      accent: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
      icon: "✅",
    },
    {
      label: "In Progress",
      value: progressTasks.length,
      accent: "bg-violet-500/10 text-violet-700 border-violet-200",
      icon: "🚀",
    },
    {
      label: "Pending",
      value: todoTasks.length,
      accent: "bg-amber-500/10 text-amber-700 border-amber-200",
      icon: "⏳",
    },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    return new Date(dateString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  const TaskCard = ({ task }) => {
    return (
      <article className="group bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 shadow-sm hover:shadow-xl transition duration-300">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-[0.2em]">{task.status}</p>
            <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">{task.title}</h3>
          </div>
          <div className="text-xs font-semibold px-3 py-1 rounded-full text-slate-700 bg-slate-100 dark:bg-slate-800 dark:text-slate-200">{formatDate(task.dueDate)}</div>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{task.description || "No description added yet."}</p>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${priorityStyles[task.priority]}`}>
            <span className="h-2.5 w-2.5 rounded-full bg-current"></span>
            {task.priority}
          </span>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">{task.title?.slice(0, 1) || "T"}</span>
            <span>Team</span>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <select
            value={task.status}
            onChange={(e) => updateStatus(task._id, e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 transition focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 sm:w-auto dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            <option>Todo</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <button
            onClick={() => deleteTask(task._id)}
            className="w-full rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600 sm:w-auto"
          >
            Delete
          </button>
        </div>
      </article>
    );
  };

  return (
    <div className={`${darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"} min-h-screen`}>
      <div className="relative md:flex">
        <aside className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-[#111111] text-slate-100 transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex h-full flex-col justify-between p-6">
            <div>
              <div className="mb-10 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white text-black shadow-lg">TF</div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">TaskFlow</p>
                  <h1 className="text-2xl font-semibold">Workspace</h1>
                </div>
              </div>
              <nav className="space-y-2">
                {NAV_ITEMS.map((item) => {
                  const active = item.label === activeNav;
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        setActiveNav(item.label);
                        setSidebarOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-left text-sm transition ${active ? "bg-white/10 text-white shadow" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/";
                }}
                className="flex w-full items-center justify-center rounded-3xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                🔒 Logout
              </button>
              <div className="rounded-3xl bg-white/5 p-4 text-sm text-slate-400">
                <p className="font-semibold text-slate-100">Team collaboration</p>
                <p className="mt-2 leading-6 text-slate-400">Real-time updates, shared boards, and polished activity streams.</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1 md:ml-72">
          <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-950/95">
            <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-4 md:px-8">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 md:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  ☰
                </button>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back,</p>
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Sleek project planning made simple</h2>
                </div>
              </div>

              <div className="flex flex-1 items-center justify-end gap-3 md:gap-4">
                <div className="relative hidden w-full max-w-md md:block">
                  <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">🔍</span>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tasks, boards, or teams"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-100/90 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>
                <button className="hidden h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 md:flex">🔔</button>
                <button
                  onClick={() => setDarkMode((prev) => !prev)}
                  className="h-11 w-11 rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? "🌙" : "☀️"}
                </button>
                <div className="hidden h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg sm:flex">JD</div>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-[1440px] px-4 py-6 md:px-8">
            <section className="grid gap-6 xl:grid-cols-[1.75fr_0.85fr]">
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {summaryCards.map((card) => (
                    <div key={card.label} className={`overflow-hidden rounded-3xl border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${card.accent}`}>
                      <div className="flex items-center justify-between">
                        <span className="rounded-2xl bg-white/80 px-3 py-2 text-lg shadow-sm">{card.icon}</span>
                        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">{card.label}</span>
                      </div>
                      <p className="mt-8 text-4xl font-semibold text-slate-950 dark:text-white">{card.value}</p>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Updated in real time</p>
                    </div>
                  ))}
                </div>

                <section className="rounded-[2rem] bg-white/95 p-6 shadow-xl dark:bg-slate-900/95">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Task builder</p>
                      <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Create high-priority work in seconds</h3>
                    </div>
                    <div className="rounded-3xl bg-slate-100 px-4 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      <span className="font-semibold">Drag & drop</span> ready placeholder
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Task title"
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    />
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    />
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Task description"
                      rows="4"
                      className="col-span-full w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    />
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                    <button className="col-span-full rounded-3xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800">
                      Create Task
                    </button>
                  </form>
                </section>

                <section className="rounded-[2rem] bg-white/95 p-6 shadow-xl dark:bg-slate-900/95">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Kanban Board</p>
                      <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Board overview</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {STATUS_ORDER.map((status) => (
                        <button
                          key={status}
                          onClick={() => setStatusFilter(status)}
                          className={`rounded-full px-4 py-2 text-sm transition ${
                            statusFilter === status
                              ? "bg-slate-900 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 lg:grid-cols-3">
                    {Object.entries(statusColumnStyles).map(([status, gradient]) => {
                      const statusTasks = filteredTasks.filter((task) => task.status === status);
                      return (
                        <div key={status} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950">
                          <div className={`mb-4 inline-flex rounded-3xl bg-gradient-to-r ${gradient} px-4 py-2 text-sm font-semibold text-white shadow-md`}>{status}</div>
                          <div className="max-h-[480px] space-y-4 overflow-y-auto pr-1">
                            {statusTasks.length ? statusTasks.map((task) => <TaskCard key={task._id} task={task} />) : <p className="text-sm text-slate-500">No tasks in this column yet.</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>

              <aside className="space-y-6">
                <section className="rounded-[2rem] bg-white/95 p-6 shadow-xl dark:bg-slate-900/95">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Team activity</p>
                      <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Collaboration pulse</h3>
                    </div>
                    <div className="rounded-3xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">Live</div>
                  </div>
                  <div className="mt-6 space-y-4">
                    <article className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Sarah assigned a new task</p>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Design system updates were added to the Todo column.</p>
                    </article>
                    <article className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Sprint review scheduled</p>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Review board and close completed tickets before Friday.</p>
                    </article>
                    <article className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Priority task moved</p>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">A high-priority item is now in progress with the design team.</p>
                    </article>
                  </div>
                </section>
                <section className="rounded-[2rem] bg-white/95 p-6 shadow-xl dark:bg-slate-900/95">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Team members</p>
                      <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Working together</h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><span>5 online</span></div>
                  </div>
                  <div className="mt-6 grid gap-3">
                    {['AE','JM','RK','SB','LC'].map((initials) => (
                      <div key={initials} className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-4 dark:bg-slate-950">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-lg">{initials}</div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">{initials === 'AE' ? 'Ava Ellis' : initials === 'JM' ? 'Jae Moon' : initials === 'RK' ? 'Rhea King' : initials === 'SB' ? 'Sky Brown' : 'Leo Cruz'}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Product team</p>
                          </div>
                        </div>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">Online</span>
                      </div>
                    ))}
                  </div>
                </section>
              </aside>
            </section>
          </main>
        </div>
      </div>

      {sidebarOpen ? (
        <button
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-20 bg-slate-950/40 md:hidden"
          aria-label="Close sidebar"
        />
      ) : null}
    </div>
  );
}

export default Dashboard;

