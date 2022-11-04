import jwtDecode from "jwt-decode";
import getValidAvatarUrl from "@/helpers/getValidAvatarUrl";

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
    const res = await store.dispatch("profile/getOne", data.dataValues.id);

    if (!res.user) {
      store.commit("auth/clearToken");

      return redirect("/auth/login");
    }

    const { id, } = data.dataValues;
    const { ok, user, } = await store.dispatch("profile/getOne", id);

    if (ok) {
      getValidAvatarUrl(user.avatar)
        .then((avatar) => {
          store.commit("profile/setUser", {
            ...user,
            avatar,
          });
        }).catch((err) => {
          throw err;
        });
    }
  } catch (err) {
    throw err;
  }
};