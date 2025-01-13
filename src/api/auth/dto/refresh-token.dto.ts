import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenDto {
  @ApiProperty({
    name: "token",
    example: "",
  })
  @IsNotEmpty()
  @IsString()
  public token!: string
}