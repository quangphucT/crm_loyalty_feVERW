
export interface LoginPayload {
  username: string;
  password: string;
};
export interface ErrorResponse {
  message: string
}
export interface data {
    role: string;
    username: string;
}
export interface SignInResponse {
    message: string;
    data: data;
}
