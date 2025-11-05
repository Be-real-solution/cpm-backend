import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsUUID } from "class-validator";
import { ContractPaymentMethod } from "src/common/database/Enums";

export class CreatePaymentDto {
  @ApiProperty({ example: 12323 })
  @IsNotEmpty()
  @IsNumber()
  public amount!: number;

  @ApiProperty({ example: "12323" })
  @IsNotEmpty()
  @IsUUID()
  public contract_payment_id!: string;

  @ApiProperty({ example: "12323" })
  @IsNotEmpty()
  @IsUUID()
  public contract_id!: string;

  @ApiProperty({ example: "cash" })
  @IsNotEmpty()
  @IsEnum(ContractPaymentMethod)
  public method!: ContractPaymentMethod;
}
