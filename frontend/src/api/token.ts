// import axios
const tokenKey = "auth-token";

export const getToken = () => {
  return localStorage.getItem(tokenKey);
};

const setToken = (token: string) => {
  localStorage.setItem(tokenKey, token);
};
function parseJwt(token: string) {
  try {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
  } catch (e) {
    return null;
  }
}
export const isTokenExpired = () => {
  const token = getToken();
  if (!token) {
    console.log("no token");
    return false;
  }
  const decoded = parseJwt(token);
  return decoded.iat > Date.now();
};

const getRefreshedToken = () => {
  return "new token";
};

export const refreshToken = async () => {
  const newToken = await getRefreshedToken();
  if (newToken) {
    setToken(newToken as string);
  }
};
