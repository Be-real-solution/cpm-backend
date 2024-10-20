enum CategorySize {
	BIG = "big",
	SMALL = "small",
}

export enum Roles {
	SUPER_ADMIN = 'super_admin',
	ADMIN = 'admin',
	STORE_ADMIN = 'store_admin',
}

export enum OrderStatus {
	PENDING = "pending",
	APPROVED = "approved",
	DELIVERED = "delivered",
	CANCELLED = "cancelled",
	FINISHED = "finished"
}

export enum PaymentType {
	CASH = "cash",
	CARD = "card"
}

export enum OrderType {
	WEB = "web",
	MOBILE = "mobile"
}

export { CategorySize };
