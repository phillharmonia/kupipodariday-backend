import { IsNumber, IsString, IsUrl, Length } from 'class-validator';

export class UpdateWishDto {
  @IsString()
  @Length(1, 250)
  name?: string;

  @IsUrl()
  link?: string;

  @IsUrl()
  image?: string;

  @IsNumber()
  price?: number;

  @IsString()
  description?: string;
}
