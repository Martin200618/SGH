"use client";

import { useState } from "react";
import {
  Home,
  Calendar,
  Users,
  BookOpen,
  LogOut,
  GraduationCap,
  Library,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from 'js-cookie';
import { useAuth } from "@/hooks/useAuth";
import LogoutModal from "./LogoutModal";

/**
 * Componente de navegación lateral (Sidebar) del dashboard
 *
 * Proporciona navegación entre diferentes secciones del dashboard con un menú
 * jerárquico. Incluye funcionalidad de logout con modal de confirmación.
 *
 * @returns {JSX.Element} El sidebar de navegación
 *
 * @example
 * ```tsx
 * <Sidebar />
 * ```
 */
export default function Sidebar() {
  const [showModal, setShowModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Call backend logout endpoint
      const response = await fetch("http://localhost:8085/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      if (!response.ok) {
        console.error("Error calling logout endpoint");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      logout();
      setIsLoggingOut(false);
      setShowModal(false);
    }
  };

  const handleNavigation = (path: string, label: string) => {
    setActiveItem(label);
    router.push(`${path}`);
  };

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const menuItems = [
    { icon: Home, label: "General", path: "/dashboard" },
    { icon: Users, label: "Profesores", path: "/dashboard/professor" },
    { icon: BookOpen, label: "Materias", path: "/dashboard/subject" },
    { icon: Library, label: "Cursos", path: "/dashboard/course" },
        {
      icon: Calendar,
      label: "Horarios",
      children: [
        { label: "Generar Horario", path: "/dashboard/schedule" },
        {
          label: "Horarios cursos",
          path: "/dashboard/schedule/scheduleCourse",
        },
        {
          label: "Horarios Profesores",
          path: "/dashboard/schedule/scheduleProfessor",
        },
      ],
    },
  ];

  return (
    <>
      <aside className="fixed top-0 left-0 h-screen w-60 bg-white shadow-lg border-r border-gray-100 flex flex-col overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-12 h-auto" />
            ABC
          </h2>
          <p className="text-sm text-gray-500 mt-1">Panel de Control</p>
        </div>

        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.label}>
                {item.children ? (
                  <>
                    {/* Botón padre */}
                    <button
                      onClick={() => toggleMenu(item.label)}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        openMenu === item.label
                          ? "bg-blue-50 text-blue-600 shadow-sm"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <item.icon size={20} />
                        <span className="font-medium">{item.label}</span>
                      </span>
                      {openMenu === item.label ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>

                    {/* Submenú */}
                    {openMenu === item.label && (
                      <ul className="ml-8 mt-2 space-y-1 text-sm">
                        {item.children.map((sub) => (
                          <li key={sub.label}>
                            <button
                              onClick={() =>
                                handleNavigation(sub.path, sub.label)
                              }
                              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                activeItem === sub.label
                                  ? "bg-blue-100 text-blue-600"
                                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                              }`}
                            >
                              {sub.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  // Items normales
                  <button
                    onClick={() =>
                      handleNavigation(item.path || "/", item.label)
                    }
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeItem == item.label
                        ? "bg-blue-50 text-blue-600 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => setShowModal(true)}
            className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-3 px-4 rounded-xl transition-all duration-200"
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <LogoutModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleLogout}
        isLoggingOut={isLoggingOut}
      />
    </>
  );
}
