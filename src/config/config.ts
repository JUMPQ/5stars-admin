// src/config/config.ts
import { IconType } from "react-icons";
import {
  FiGrid,
  FiPlusSquare,
  FiAward,
  FiUser,
  FiUsers,
  FiSettings,
} from "react-icons/fi";
import { FaFutbol, FaUsers } from "react-icons/fa";

export type Role = "admin";
export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon?: IconType;
  requiresAuth?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: FiGrid,
    requiresAuth: true,
  },
  {
    id: "add-competition",
    label: "Add Competition",
    href: "/admin/addcompetition",
    icon: FaFutbol,
    requiresAuth: true,
  },
  {
    id: "competitions",
    label: "Competitions",
    href: "/admin/competitions",
    icon: FaFutbol,
    requiresAuth: true,
  },
  {
    id: "teams",
    label: "Teams",
    href: "/admin/teams",
    icon: FaUsers,
    requiresAuth: true,
  },
  {
    id: "fixtures",
    label: "Fixtures",
    href: "/admin/fixtures",
    icon: FaFutbol,
    requiresAuth: true,
  },
];

export const PUBLIC_NAV_ITEMS: NavItem[] = [
  { id: "login", label: "Login", href: "/login" },
];

export const DASHBOARD_TEXT = {
  admin: { title: "League Dashboard", subtitle: "Manage the whole league" },
};

export const AUTH_ROUTES = {
  login: "/login",
  admin: "/admin/dashboard",
  unauthorized: "/unauthorized",
};
