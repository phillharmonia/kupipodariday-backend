import { Controller, Post, Body, Request } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  async postOffer(@Request() req, @Body() createOfferDto: CreateOfferDto) {
    return this.offersService.createOffer(createOfferDto, req.user);
  }
}
