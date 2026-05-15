import { IsBoolean, IsOptional } from "class-validator";

export class UpdateUserSettingsDto {
  @IsOptional()
  @IsBoolean()
  notifications?: boolean;

  @IsOptional()
  @IsBoolean()
  darkMode?: boolean;

  @IsOptional()
  @IsBoolean()
  autoBackup?: boolean;
}
