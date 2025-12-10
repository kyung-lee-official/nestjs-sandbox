import { api } from "./axios-client";

export async function getUserById(userId: number) {
  const response = await api.get(
    `test-errors/http-errors/get-user-by-id/${userId}`,
  );
  return response.data;
}

export async function getNonExistentEndpoint() {
  const response = await api.get(
    `test-errors/http-errors/non-existent-endpoint`,
  );
  return response.data;
}
