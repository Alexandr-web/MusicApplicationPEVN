/**
  * Converts a path to a valid file path
  * @param {string} path path url
  * @returns {string} valid url file
  */
export default async (path) => {
  if (/^\/\_nuxt\//.test(path)) {
    return path;
  }

  const url = await require(`@/avatars/${path}`);

  return /^\/\_nuxt\//.test(url) ? url : "";
};