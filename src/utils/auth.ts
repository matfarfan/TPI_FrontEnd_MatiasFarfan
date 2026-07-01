import type { IUser } from "../types/IUser";
import type { Rol } from "../types/Rol";
import { getUser, removeUser } from "./localStorage";
import { navigate } from "./navigate";

/**
 * Verifica que exista un usuario autenticado y que tenga
 * el rol necesario para acceder a la página.
 */
export const checkAuthUser = (
  redireccion1: string,
  redireccion2: string,
  rol: Rol
) => {

  const user = getUser();

  if (!user) {
    navigate(redireccion1);
    return;
  } else {

    const parseUser: IUser = JSON.parse(user);
    if (parseUser.role !== rol) {
      navigate(redireccion2);
      return;
    }
  }
};


/**
 * Cierra la sesión del usuario actual y redirige al login.
 */
export const logout = () => {
  removeUser();
  navigate("/src/pages/auth/login/login.html");
};
