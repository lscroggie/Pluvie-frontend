import type { Role } from "./types";

// A qué portal va cada rol después de un login exitoso. Un solo formulario de
// login, pero cada portal mantiene su propio diseño y componentes.
const ROLE_HOME: Record<Role, string> = {
  donante: "/perfil",
  staff: "/staff",
  gerencial: "/gerencial",
};

const KNOWN_ROLES = Object.keys(ROLE_HOME) as Role[];

export function isKnownRole(value: string): value is Role {
  return (KNOWN_ROLES as string[]).includes(value);
}

/** Devuelve null si el rol no matchea ningún portal conocido, para mostrar un error en vez de redirigir a una ruta rota. */
export function getRoleHome(role: string): string | null {
  return isKnownRole(role) ? ROLE_HOME[role] : null;
}
