import { TransactionStatus } from "@prisma/client";

export interface TransactionResponse {
  message: string;
  data: {
    id: number;
    status: TransactionStatus;
    // Add other fields as needed
  };
}
