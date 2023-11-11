import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}
  @UseGuards(JwtGuard)
  @Post()
  create(@Request() req, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(createWishDto, req.user);
  }
  @Get('last')
  getLastWishes() {
    return this.wishesService.findLastWishes();
  }
  @Get('top')
  getTopWishes() {
    return this.wishesService.findTopWishes();
  }
  @UseGuards(JwtGuard)
  @Get(':id')
  getWishById(@Param('id') id: string) {
    return this.wishesService.findWishById(+id);
  }
  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateWish(
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
    @Request() req,
  ) {
    return this.wishesService.updateWish(+id, updateWishDto, req.user);
  }
  @UseGuards(JwtGuard)
  @Post(':id/copy')
  postWishCopy(@Request() req, @Param('id') id) {
    return this.wishesService.copyWish(+id, req.user);
  }
  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteWish(@Param('id') id: string, @Request() req) {
    return this.wishesService.removeWish(+id, req.user);
  }
}
