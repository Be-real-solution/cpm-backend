import { decodeBase64, encodeBase64 } from "bcryptjs";
import Application from "./api/app.service";

const text = "kSfO0x9dVURzWD18f4Ch9MuMzUoa" + ":42cOiZrgWwPUGqIE9A8dQ0_Ju0Aa";
const base64 = Buffer.from(text).toString("base64");
console.log(base64); // U2Fsb20gRHVueW8h

void Application.main();
