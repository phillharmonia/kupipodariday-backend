import { IsNumber, IsString, IsUrl, Length} from "class-validator";

export class CreateWishlistDto {
    @IsString()
    @Length(2,30)
    name: string;

    @IsUrl()
    image: string;

    @IsNumber({}, { each: true })
    itemsId: number[];
}
