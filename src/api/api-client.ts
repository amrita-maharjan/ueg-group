const getAuthHeader = (): string => {
  const encodeCredentials = (username: string, password: string) => {
    return btoa(`${username}:${password}`);
  };

  const username = localStorage.getItem("uName") ?? "null";
  const password = localStorage.getItem("password") ?? "null";
  const authHeader = `Basic ${encodeCredentials(username, password)}`;

  return authHeader;
};

const getHeaders = (): HeadersInit => ({
  "Content-Type": "application/json",
  Authorization: getAuthHeader(),
});

export const fetchData = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: { ...getHeaders(), ...options.headers }, // Merge default and custom headers
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error; // Rethrow for handling at caller level
  }
};

export const postData = async <T>(
  url: string,
  body: any,
  options: RequestInit = {}
): Promise<T> => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { ...getHeaders(), ...options.headers }, // Merge default and custom headers
      body: JSON.stringify(body), // Serialize the body
      ...options, // Allow any other custom options like credentials, etc.
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Post error:", error);
    throw error; // Rethrow for handling at caller level
  }
};
