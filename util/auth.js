/* eslint-disable camelcase */
import Cookies from "universal-cookie";

const cookies = new Cookies();

const date = `=;expires=${new Date().toUTCString()};path=/`;

const Auth = {
  set(name, authToken = null, options) {
    return cookies.set(name, authToken, options);
  },

  get(authToken) {
    const token = cookies.get(authToken) || null;
    return token;
  },

  remove(value) {
    return cookies.remove(value);
  },

  getSessionKey() {
    const token = cookies.get("token");
    return token;
  },

  getToken() {
    const token = cookies.get("token") || null;
    return token;
  },

  isAuthenticated() {
    const token = cookies.get("token") || cookies.get("sessionKey");
    const isSessionValid = !!token;
    return isSessionValid;
  },

  removeToken() {
    deleteAllCookies();
    cookies.remove("token", { path: "/" });
    cookies.remove("apiToken", { path: "/" });
    cookies.remove("phone", { path: "/" });
    cookies.remove("email", { path: "/" });
    cookies.remove("isActive", { path: "/" });
    cookies.remove("_id", { path: "/" });
    cookies.remove("storeid", { path: "/" });
    cookies.remove("loginToken", { path: "/" });
  },
  storeLoginSessionDetails(details = "") {
    this.removeToken();
    const {
        loginToken = "",
        isActive = "",
        _id = "",
        phone = "",
        storeid = null,
        email = ""
    } = details;
    cookies.set("loginDetails", details);
    // cookies.set("token", access_token, expires);
    cookies.set("loginToken", loginToken);
    cookies.set("isActive", isActive);
    cookies.set("_id", _id);
    cookies.set("phone", phone);
    cookies.set("email", email);
    cookies.set("storeid",storeid)
  },

  setSessionKey(sessionKey) {
    cookies.set("sessionKey", sessionKey, {
      path: "/",
      expires: new Date(Date.now() + 12 * 60 * 60 * 1000)
    });
  },

  removeSessionKey() {
    deleteAllCookies();
    cookies.remove("sessionKey", { path: "/" });
  },

  getAuthHeaders() {
    const headers = {
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
      Accept: "application/json",
      Authorization: `${cookies.get("token")}`
    };
    return headers;
  },
  getLocalStorageItem(name) {
    const data = JSON.parse(localStorage.getItem(name)) || null;
    return data;
  }
};

const deleteAllCookies = () => {
  document.cookie.split(";").forEach(ck => {
    document.cookie = ck?.replace(/^ +/, "")?.replace(/=.*/, date);
  });
};

export default Auth;