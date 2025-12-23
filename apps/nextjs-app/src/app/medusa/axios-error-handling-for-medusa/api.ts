import api from "./axios-client";

export async function getUserById(userId: number) {
  const data = await api.get(
    `test-errors/http-errors/get-user-by-id/${userId}`,
  );
  return data;
}

export async function getNonExistentEndpoint() {
  const data = await api.get(`test-errors/http-errors/non-existent-endpoint`);
  return data;
}
