import {Controller, Post, Body, Request, UseGuards} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import {JwtGuard} from "../guards/jwt.guard";

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @UseGuards(JwtGuard)
  @Post()
  async postOffer(@Request() req, @Body() createOfferDto: CreateOfferDto) {
    return this.offersService.createOffer(createOfferDto, req.user);
  }
}
