export interface Customer {
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