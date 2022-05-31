import jwtDecode from "jwt-decode";

export default async ({ store, redirect, }) => {
  try {
    store.dispatch("auth/autoLogin");

    const token = store.getters["auth/getToken"];

    if (token) {
      const data = jwtDecode(store.getters["auth/getToken"]);
      const res = await store.dispatch("auth/getUser", data.dataValues.id);

      if (!res.user) {
        return store.commit("auth/clearToken");
      }

      return redirect("/");
    }
  } catch (err) {
    throw err;
  }
};