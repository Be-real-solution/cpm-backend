class Result {
	code!: string;
	description!: string;
}

class Data {
	card_id!: number;
	pan!: string;
	expiry!: string;
	card_holder!: string;
	balance!: number;
	phone!: string;
	card_token!: string;
}

export class BindClientCardDto {
	client_id!: string;
	result!: Result;
	data!: Data;
	transaction_id!: number;
}
