export interface ApiErrorShape {
  success: false;
  message: string;
  errorCode: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}
