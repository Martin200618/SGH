"use client";

import { useState } from "react";
import {
  Home,
  Calendar,
  Users,
  BookOpen,
  LogOut,
  Loader2,
  GraduationCap,
  Library,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from 'js-cookie';

export default function Sidebar() {
  const [showModal, setShowModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();

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
      // Remove the authentication token
      Cookies.remove("token");
      setIsLoggingOut(false);
      setShowModal(false);
      router.push("/login");
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
    {
      icon: Calendar,
      label: "Horarios",
      children: [
        {
          label: "Horarios cursos",
          path: "/dashboard/schedule/scheduleCourse",
        },
        {
          label: "Horarios Profesores",
          path: "/dashboard/schedule/scheduleProfessor",
        },
        { label: "Generar Horario", path: "/dashboard/schedule" },
      ],
    },
    { icon: Users, label: "Profesores", path: "/dashboard/professor" },
    { icon: BookOpen, label: "Materias", path: "/dashboard/subject" },
    { icon: Library, label: "Cursos", path: "/dashboard/course" },
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 mx-4">
            {!isLoggingOut ? (
              <>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Cerrar Sesión
                </h3>
                <p className="text-gray-600 mb-6">
                  ¿Estás seguro de que quieres cerrar la sesión?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors"
                  >
                    Aceptar
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center py-6">
                <Loader2 className="animate-spin text-red-500 mb-3" size={32} />
                <p className="text-gray-700 font-medium">Cerrando sesión...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
