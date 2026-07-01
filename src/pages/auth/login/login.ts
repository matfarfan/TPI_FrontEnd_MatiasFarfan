import type { IUser } from "../../../types/IUser";
import type { Rol } from "../../../types/Rol";
import { USERS } from "../../../data/data";
import { navigate } from "../../../utils/navigate";

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

  const authenticatedUser = USERS.find(
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

  localStorage.setItem("userData", JSON.stringify(user));

  if (authenticatedUser.rol === "admin") {
    navigate("/src/pages/admin/home/home.html");
  } else if (authenticatedUser.rol === "client") {
    navigate("/src/pages/store/home/home.html");
  }
});