import type { IUser } from "../../../types/IUser";
import type { Rol } from "../../../types/Rol";
import { USERS } from "../../../data/data";
import { navigate } from "../../../utils/navigate";
import { saveUser } from "../../../utils/localStorage";

interface AuthUser {
  id: number;
  nombre: string;
  apellido?: string;
  mail: string;
  password: string;
  rol: Rol;
}

const form = document.getElementById("form") as HTMLFormElement;
const inputEmail = document.getElementById("email") as HTMLInputElement;
const inputPassword = document.getElementById("password") as HTMLInputElement;
const selectRol = document.getElementById("rol") as HTMLSelectElement;

const userData = localStorage.getItem("userData");

if (userData) {
  const user = JSON.parse(userData) as IUser;

  if (user.loggedIn && user.role === "admin") {
    navigate("/src/pages/admin/home/home.html");
  }

  if (user.loggedIn && user.role === "client") {
    navigate("/src/pages/store/home/home.html");
  }
}

const getRegisteredUsers = (): AuthUser[] => {
  const users = localStorage.getItem("registeredUsers");

  if (!users) {
    return [];
  }

  return JSON.parse(users) as AuthUser[];
};

form.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();

  const valueEmail = inputEmail.value.trim();
  const valuePassword = inputPassword.value.trim();
  const valueRol = selectRol.value as Rol;

  if (!valueEmail) {
    alert("Debe ingresar un email");
    return;
  }

  if (!valuePassword) {
    alert("Debe ingresar una contraseña");
    return;
  }

  if (!valueRol) {
    alert("Debe seleccionar un rol");
    return;
  }

  const registeredUsers = getRegisteredUsers();
  const allUsers: AuthUser[] = [...USERS, ...registeredUsers];

  const authenticatedUser = allUsers.find(
    (user) =>
      user.mail === valueEmail &&
      user.password === valuePassword &&
      user.rol === valueRol
  );

  if (!authenticatedUser) {
    alert("Email, contraseña o rol incorrectos.");
    return;
  }

  const user: IUser = {
    email: authenticatedUser.mail,
    role: authenticatedUser.rol,
    loggedIn: true,
  };

  saveUser(user);

  if (authenticatedUser.rol === "admin") {
    navigate("/src/pages/admin/home/home.html");
  } else {
    navigate("/src/pages/store/home/home.html");
  }
});