import type { IUser } from "../types/IUser";

/**
 * Guarda la información del usuario autenticado en LocalStorage.
 */
export const saveUser = (user: IUser) => {
  const userJson = JSON.stringify(user);
  localStorage.setItem("userData", userJson);
};

/**
 * Recupera el usuario autenticado almacenado en LocalStorage.
 */
export const getUser = () => {
  return localStorage.getItem("userData");
};

/**
 * Elimina la sesión del usuario actual.
 */
export const removeUser = () => {
  localStorage.removeItem("userData");
};
