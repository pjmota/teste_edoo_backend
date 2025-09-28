// Types for API responses used in E2E tests

export interface BenefitResponse {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export type CreateBenefitResponse = BenefitResponse;

export type UpdateBenefitResponse = BenefitResponse;

export interface ListBenefitsResponse {
  data: BenefitResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export interface ValidationErrorResponse {
  statusCode: number;
  message: string[];
  error: string;
}
