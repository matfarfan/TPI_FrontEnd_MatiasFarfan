import { checkAuthUser, logout } from "../../../utils/auth";

const buttonLogout = document.getElementById(
  "logoutButton"
) as HTMLButtonElement;
buttonLogout?.addEventListener("click", () => {
  logout();
});


const initPage = () => {
  checkAuthUser(
    "/src/pages/auth/login/login.html",
    "/src/pages/admin/home/home.html",
    "client"
  );  
};
initPage();
