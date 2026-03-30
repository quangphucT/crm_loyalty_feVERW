
export interface LoginPayload {
  username: string;
  password: string;
  deviceId: string;
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
  deviceId: string;
}

export interface LoginResponse {
  message: string;
  data: AuthData;  
}