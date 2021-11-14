import Cookies from "js-cookie";

const TokenKey = "shop_admin_key";

export function getToken() {
  return sessionStorage.getItem(TokenKey);
}

export function setToken(token) {
  return sessionStorage.setItem(TokenKey, token);
}

export function removeToken() {
  return sessionStorage.removeItem(TokenKey);
}

//
// 本地存储用户名
const usernameKey = "username_key";
export function getUsername() {
  return sessionStorage.getItem(usernameKey);
}

export function setUsername(username) {
  return sessionStorage.setItem(usernameKey, username);
}

export function removeUsername() {
  return sessionStorage.removeItem(usernameKey);
}
