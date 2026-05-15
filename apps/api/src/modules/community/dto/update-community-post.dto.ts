import {
  ArrayUnique,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class SharedExpenseSnapshotDto {
  @IsString()
  expenseId: string;

  @IsString()
  category: string;

  @IsString()
  memo: string;

  @IsString()
  expenseDate: string;

  @IsNumber()
  spentAmount: number;

  @IsString()
  spentCurrency: "KRW" | "JPY" | "USD" | "EUR";

  @IsNumber()
  baseAmount: number;

  @IsString()
  baseCurrency: "KRW" | "JPY" | "USD" | "EUR";

  @IsNumber()
  exchangeRate: number;

  @IsString()
  countryCode: string;
}

export class UpdateCommunityPostDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique((item: SharedExpenseSnapshotDto) => item.expenseId)
  @ValidateNested({ each: true })
  @Type(() => SharedExpenseSnapshotDto)
  sharedExpenses?: SharedExpenseSnapshotDto[];
}
