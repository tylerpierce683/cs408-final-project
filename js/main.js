import { AppGlobals } from "./config.js";

const storedGlobals = localStorage.getItem('AppGlobals');
if (storedGlobals) {
  Object.assign(AppGlobals, JSON.parse(storedGlobals));
}

const nameField = document.getElementById('username');
nameField.addEventListener('input', function() {
  AppGlobals.username = nameField.value;
  console.log(AppGlobals.username);
});

document.getElementById('go-to-menu').addEventListener('click', function() {
  localStorage.setItem('AppGlobals', JSON.stringify(AppGlobals));
  window.location.href = "../html/menu.html";
});