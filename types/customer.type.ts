export interface Customer {
  id: number;
  customerCode: string;
  fullName: string;
  email: string;
  phone: string;
  province: string;
  totalPoints: number;
  referralCode: string | null;
}
export interface CustomerResponse {
  message: string;
  data: Customer[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

export interface CustomerQueryParams {
	phone?: string;
	fullName?: string;
	province?: string;
	page?: number;
	size?: number;
}

export interface CreateCustomerRequest {
  fullName: string;
  phone: string;
  email?: string;
  province?: string;
  referralCode?: string;
};
export interface CreateCustomerResponse {
  message: string;
}

export interface UpdateCustomerRequest {
  fullName?: string;
  phone?: string;
  email?: string;
  province?: string;
  referralCode?: string | null;
}

export interface UpdateCustomerResponse {
  message: string;
}

export interface DeleteCustomerResponse {
  status: number;
  message: string;
  error: string
}
export interface UpdateCustomerVariables {
  id: number;
  payload: UpdateCustomerRequest;
}

export interface RedeemPointsRequest {
  points: number;
  reason: string;
}

export interface RedeemPointsResponse {
  message: string;
}

export interface RedeemPointsVariables {
  id: number;
  payload: RedeemPointsRequest;
}

export interface EarnPointsRequest {
  points: number;
  reason: string;
}

export interface EarnPointsResponse {
  message: string;
}

export interface EarnPointsVariables {
  id: number;
  payload: EarnPointsRequest;
}

export interface PointHistoryItem {
  id: number;
  changeAmount: number;
  reason: string;
  createdAt: string;
  user?: {
    username?: string;
    role?: string;
  };
}

export interface PointHistoryResponse {
  message: string;
  data: PointHistoryItem[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

export interface PointHistoryQuery {
  page?: number;
  size?: number;
}