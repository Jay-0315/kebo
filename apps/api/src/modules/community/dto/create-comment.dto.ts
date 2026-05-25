import { IsOptional, IsString } from "class-validator";

export class CreateCommentDto {
  @IsString()
  userId: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  parentId?: string;
}
