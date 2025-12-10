export enum UserQK {
  GET_ALL_USERS = "GET_ALL_USERS",
}

export type UserResponse = {
  id: number;
  name: string;
  age: number;
};
