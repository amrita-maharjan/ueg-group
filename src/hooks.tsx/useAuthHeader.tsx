export const useAuthHeader = () => {
  const encodeCredentials = (username: string, password: string) => {
    return btoa(`${username}:${password}`);
  };

  const username = localStorage.getItem("uName") ?? "null";
  const password = localStorage.getItem("password") ?? "null";
  const authHeader = `Basic ${encodeCredentials(username, password)}`;

  return authHeader;
};
