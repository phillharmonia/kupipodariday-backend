import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Param,
  Patch,
  Delete,
  ConflictException,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { JwtGuard } from '../guards/jwt.guard';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistService: WishlistsService) {}

  @UseGuards(JwtGuard)
  @Get()
  async getAllWishlists() {
    return await this.wishlistService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getWishlist(@Param('id') id: string): Promise<Wishlist> {
    return await this.wishlistService.findWishlistById(+id);
  }

  @UseGuards(JwtGuard)
  @Post()
  async createWishlist(
    @Request() req,
    @Body() createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    return await this.wishlistService.createWishlist(
      req.user,
      createWishlistDto,
    );
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateWishlist(
    @Request() req,
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    const { owner } = await this.wishlistService.findWishlistById(+id);
    if (req.user.id !== owner.id) {
      throw new ConflictException('Вы не можете изменять чужой вишлист');
    }
    return await this.wishlistService.updateWishlist(+id, updateWishlistDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async removeWishlist(@Request() req, @Param('id') id: string) {
    const { owner } = await this.wishlistService.findWishlistById(+id);
    if (req.user.id !== owner.id) {
      throw new ConflictException('Вы не можете удалить чужой вишлист');
    }
    await this.wishlistService.removeWishlist(+id);
  }
}
