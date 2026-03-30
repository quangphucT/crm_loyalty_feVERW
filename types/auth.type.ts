
export interface LoginPayload {
  username: string;
  password: string;
};
export interface ErrorResponse {
  message: string
}
export interface SignInResponse {
  role: string;     
  username: string;  
}

export interface AuthData {
  signInResponse: SignInResponse;
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  message: string;
  data: AuthData;  
}