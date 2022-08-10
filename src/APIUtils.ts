import { User } from "firebase/auth";

export const apiBaseURL =
  process.env.NODE_ENV === "production"
    ? "https://academy-kata-progress.herokuapp.com"
    : "http://localhost:4000";

export async function createAuthHeaders(u: User) {
  return { Authorization: "Bearer " + (await u.getIdToken()) };
}
