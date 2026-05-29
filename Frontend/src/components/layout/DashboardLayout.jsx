import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FileText, Home, LogOut, Menu, MessageSquare, Settings, Sparkles, Star, UserRound, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { logoutUser } from "../../services/auth.service";

function DashboardLayout({ setIsAuthenticated = () => {} }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Report", href: "/report", icon: FileText },
    { name: "AI Chat", href: "/chat", icon: MessageSquare },
    { name: "Birth", href: "/birth", icon: UserRound },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await logoutUser();
    setIsAuthenticated(false);
    navigate("/", { replace: true });
  };

  const isActive = (href) => location.pathname === href || (href !== "/dashboard" && location.pathname.startsWith(href));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-white to-violet-50/50">
      <aside className="fixed left-0 top-0 hidden h-screen w-20 flex-col items-center border-r border-sidebar-border bg-sidebar py-8 md:flex">
        <Link to="/" className="mb-12" aria-label="Aistro home">
          <Star className="h-10 w-10 fill-sidebar-primary text-sidebar-primary" />
        </Link>

        <nav className="flex flex-1 flex-col gap-6">
          {navigation.map((item) => (
            <Link key={item.name} to={item.href} className="group relative" aria-label={item.name}>
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-all ${
                  isActive(item.href)
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/30"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className="h-6 w-6" />
              </div>
              <div className="pointer-events-none absolute left-full top-1/2 ml-4 -translate-y-1/2 whitespace-nowrap rounded-lg bg-sidebar-primary px-3 py-2 text-sm text-sidebar-primary-foreground opacity-0 transition-opacity group-hover:opacity-100">
                {item.name}
              </div>
            </Link>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="group relative flex h-14 w-14 items-center justify-center rounded-2xl text-sidebar-foreground/60 transition-all hover:bg-sidebar-accent hover:text-sidebar-foreground"
          aria-label="Logout"
        >
          <LogOut className="h-6 w-6" />
          <div className="pointer-events-none absolute left-full top-1/2 ml-4 -translate-y-1/2 whitespace-nowrap rounded-lg bg-sidebar-primary px-3 py-2 text-sm text-sidebar-primary-foreground opacity-0 transition-opacity group-hover:opacity-100">
            Logout
          </div>
        </button>
      </aside>

      <header className="sticky top-0 z-40 border-b border-purple-100 bg-white/80 backdrop-blur-lg md:hidden">
        <div className="flex items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Aistro</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-purple-50"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-purple-100"
            >
              <nav className="space-y-2 px-4 py-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                      isActive(item.href) ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-purple-50"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-foreground/70 transition-all hover:bg-purple-50"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="min-h-screen md:ml-20">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
