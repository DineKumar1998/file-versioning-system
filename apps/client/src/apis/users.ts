import axioBaseApi from ".";

// Login Api
export function login(body: any) {
  return axioBaseApi("/auth/login", {
    method: "POST",
    body,
  });
}

// Logout Api
// Create User Api
export function createUser(body: any) {
  return axioBaseApi("/user/create", {
    method: "POST",
    body,
  });
}

// ** Get Users
export function getUsers(search: string) {
  return axioBaseApi("/user/" + search, {
    method: "GET",
  });
}
