export enum Roles {
	SUPER_ADMIN = "super_admin",
	ADMIN = "admin",
	STORE_ADMIN = "store_admin",
}

export enum OrderStatus {
	PENDING = "pending",
	APPROVED = "approved",
	DELIVERED = "delivered",
	CANCELLED = "cancelled",
	FINISHED = "finished",
}

export enum PaymentType {
	CASH = "cash",
	CARD = "card",
}

export enum ContractStatus {
	PAID = "paid",
	UNPAID = "unpaid",
	ARCHIVED = "archived"
}

export enum ContractPaymentStatus {
	PAID = "paid",
	UNPAID = "unpaid",
	PARTLYPAID = "partlypaid"
}

export enum ContractInitialPaymentType {
	PERCENT = "percent",
	SUMMA = "summa",
}

export enum ContractProductUnit {
	PCS = "pcs",
}

export enum ContractPaymentMethod {
	CASH = "cash",
	CARD = "card",
	BANK = "bank",
	ATMOS = "atmos",
	NOT_SELECTED = "not_selected",
}

export enum StorePaymentStatus {
	PAID = "paid",
	UNPAID = "unpaid",
	PARTLYPAID = "partlypaid"
}
