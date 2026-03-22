import type { AppRole } from "@/types/domain";

const coachRoutes = ["/app/coach"];
const parentRoutes = ["/app/parent"];
const adminRoutes = ["/app/admin"];

export function hasRouteAccess(role: AppRole, pathname: string) {
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    return role === "admin";
  }

  if (coachRoutes.some((route) => pathname.startsWith(route))) {
    return role === "coach" || role === "admin";
  }

  if (parentRoutes.some((route) => pathname.startsWith(route))) {
    return role === "parent" || role === "admin";
  }

  return true;
}

export function getRoleHome(role: AppRole) {
  if (role === "coach") {
    return "/app/coach";
  }

  if (role === "parent") {
    return "/app/parent";
  }

  if (role === "admin") {
    return "/app/admin";
  }

  return "/app/dashboard";
}
