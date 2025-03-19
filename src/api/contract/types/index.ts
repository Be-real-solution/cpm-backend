import { ContractPaymentMethod, ContractPaymentStatus } from "src/common/database/Enums";

export type PaymentDataType = {
	payment_data: {
		id: number;
		date: number;
		price: number;
		method: ContractPaymentMethod,
		status: ContractPaymentStatus
	}[];
	first_name: string;
	last_name: string;
	total: number;
};