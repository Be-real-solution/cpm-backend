import * as dotenv from "dotenv";
import { Logger } from "@nestjs/common";

dotenv.config();

export type ConfigType = {
	PORT: number;
	DB_URL: string;
	ACCESS_SECRET_KEY: string;
	ACCESS_SECRET_TIME: string;
	REFRESH_SECRET_KEY: string;
	REFRESH_SECRET_TIME: string;
	NODE_ENV: string;
	APP_LOGS_PATH: string;
	OPERATION_LOGS_PATH: string;
	FILE_SIZE: number;
	PATH_FOR_FILE_UPLOAD: string;
	PAYMENT_MERCHANT_ID: string;
	PAYMENT_API_KEY: string;
	PAYMENT_API_SECRET_KEY: string;
	PAYMENT_SERVICE_ID: string;
	SMS_EMAIL: string;
	SMS_PASSWORD: string;
	PAYMENT_SUCCESS_URL: string;
	PAYMENT_FAILURE_URL: string;
	PAYMENT_CALLBACK_URL: string;
	YANDEX_TOKEN: string;
	DAYMALL_LATITUDE: number;
	DAYMALL_LONGTITUDE: number;
	DAYMALL_ADDRESS: string;
	DAYMALL_PHONE_NUMBER: string;
	DAYMALL_NAME: string;
};

const requiredVariables = [
	"PORT",
	"DEV_DB_URL",
	"PROD_DB_URL",
	"ACCESS_SECRET_KEY",
	"ACCESS_SECRET_TIME",
	"REFRESH_SECRET_KEY",
	"REFRESH_SECRET_TIME",
	"NODE_ENV",
	"APP_LOGS_PATH",
	"OPERATION_LOGS_PATH",
	"FILE_SIZE",
	"PATH_FOR_FILE_UPLOAD",
	"PAYMENT_MERCHANT_ID",
	"PAYMENT_API_KEY",
	"PAYMENT_API_SECRET_KEY",
	"PAYMENT_SERVICE_ID",
	"SMS_EMAIL",
	"SMS_PASSWORD",
	"PAYMENT_SUCCESS_URL",
	"PAYMENT_FAILURE_URL",
	"PAYMENT_CALLBACK_URL",
	"YANDEX_TOKEN",
	"DAYMALL_LATITUDE",
	"DAYMALL_LONGTITUDE",
	"DAYMALL_ADDRESS",
	"DAYMALL_PHONE_NUMBER",
	"DAYMALL_NAME",
];

const missingVariables = requiredVariables.filter((variable) => {
	const value = process.env[variable];
	return !value || value.trim() === "";
});

if (missingVariables.length > 0) {
	Logger.error(`Missing or empty required environment variables: ${missingVariables.join(", ")}`);
	process.exit(1);
}

export const config: ConfigType = {
	PORT: parseInt(process.env.PORT as string, 10),
	DB_URL:
		process.env.NODE_ENV === "dev"
			? (process.env.DEV_DB_URL as string)
			: (process.env.PROD_DB_URL as string),
	ACCESS_SECRET_KEY: process.env.ACCESS_SECRET_KEY as string,
	ACCESS_SECRET_TIME: process.env.ACCESS_SECRET_TIME as string,
	REFRESH_SECRET_KEY: process.env.REFRESH_SECRET_KEY as string,
	REFRESH_SECRET_TIME: process.env.REFRESH_SECRET_TIME as string,
	NODE_ENV: process.env.NODE_ENV as string,
	APP_LOGS_PATH: process.env.APP_LOGS_PATH as string,
	OPERATION_LOGS_PATH: process.env.OPERATION_LOGS_PATH as string,
	FILE_SIZE: parseInt(process.env.FILE_SIZE as string, 10),
	PATH_FOR_FILE_UPLOAD: process.env.PATH_FOR_FILE_UPLOAD as string,
	PAYMENT_MERCHANT_ID: process.env.PAYMENT_MERCHANT_ID as string,
	PAYMENT_API_KEY: process.env.PAYMENT_API_KEY as string,
	PAYMENT_API_SECRET_KEY: process.env.PAYMENT_API_SECRET_KEY as string,
	PAYMENT_SERVICE_ID: process.env.PAYMENT_SERVICE_ID as string,
	SMS_EMAIL: process.env.SMS_EMAIL as string,
	SMS_PASSWORD: process.env.SMS_PASSWORD as string,
	PAYMENT_SUCCESS_URL: process.env.PAYMENT_SUCCESS_URL as string,
	PAYMENT_FAILURE_URL: process.env.PAYMENT_FAILURE_URL as string,
	PAYMENT_CALLBACK_URL: process.env.PAYMENT_CALLBACK_URL as string,
	YANDEX_TOKEN: process.env.YANDEX_TOKEN as string,
	DAYMALL_LATITUDE: Number(process.env.DAYMALL_LATITUDE as string),
	DAYMALL_LONGTITUDE: Number(process.env.DAYMALL_LONGTITUDE as string),
	DAYMALL_ADDRESS: process.env.DAYMALL_ADDRESS as string,
	DAYMALL_PHONE_NUMBER: process.env.DAYMALL_PHONE_NUMBER as string,
	DAYMALL_NAME: process.env.DAYMALL_NAME as string
};
