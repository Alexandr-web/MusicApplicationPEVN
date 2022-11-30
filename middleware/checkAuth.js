import jwtDecode from "jwt-decode";

/**
 * This middleware is used on all pages, except pages with authorization
 * Checks if the user is logged in
 * Also, if the user exists, then set it to the store with a valid avatar
 */
export default async ({ store, redirect, }) => {
  try {
    store.dispatch("auth/autoLogin");

    const token = store.getters["auth/getToken"];

    if (!token) {
      return redirect("/auth/login");
    }

    const data = jwtDecode(token);
    const res = await store.dispatch("profile/getOne", data.id);

    if (!res.user) {
      store.commit("auth/clearToken");

      return redirect("/auth/login");
    }

    const { id, } = data;
    const { ok, user, } = await store.dispatch("profile/getOne", id);

    if (ok) {
      const avatar = await store.dispatch("profile/getValidAvatarUrl", user.avatar);

      store.commit("profile/setUser", {
        ...user,
        avatar,
      });
    }
  } catch (err) {
    throw err;
  }
};