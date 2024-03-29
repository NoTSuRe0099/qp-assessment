import { Response } from 'express';

interface ApiResponse {
  status: {
    message: string;
    success: boolean;
  };
  data?: object;
}

export function sendApiResponse(
  res: Response,
  data?: any,
  message: string = '',
  statusCode: number = 200
) {
  const response: ApiResponse = {
    status: {
      message,
      success: true,
    },
    data: data ?? null,
  };

  return res.status(statusCode).json(response);
}
