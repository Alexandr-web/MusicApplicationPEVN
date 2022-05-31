import jwtDecode from "jwt-decode";

export default async ({ store, redirect, }) => {
  try {
    store.dispatch("auth/autoLogin");

    if (!store.getters["auth/getToken"]) {
      return redirect("/auth/login");
    }

    const data = jwtDecode(store.getters["auth/getToken"]);
    const res = await store.dispatch("auth/getUser", data.dataValues.id);

    if (!res.user) {
      store.commit("auth/clearToken");

      return redirect("/auth/login");
    }
  } catch (err) {
    throw err;
  }
};