import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { User } from '../users/entities/user.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  async createWishlist(user: User, createWishlistDto: CreateWishlistDto) {
    const { name, image, itemsId } = createWishlistDto;

    if (!itemsId || itemsId.length === 0) {
      throw new BadRequestException(
        'Для создания вишлиста необходимо указать хотя бы одно желание.',
      );
    }
    const wishes = await this.wishRepository.findBy({ id: In(itemsId) });

    const wishlist = this.wishlistRepository.create({
      name,
      image,
      owner: user,
      items: wishes,
    });

    return this.wishlistRepository.save(wishlist);
  }
  findAll(): Promise<Wishlist[]> {
    return this.wishlistRepository.find();
  }
  async findWishlistById(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: { owner: true, items: true },
    });
    if (!wishlist) {
      throw new NotFoundException('Вишлист не найден');
    }
    return wishlist;
  }
  async updateWishlist(id: number, updateWishlistDto: UpdateWishlistDto): Promise<Wishlist> {
    const wishlist = await this.findWishlistById(id);

    if (!wishlist) {
      throw new NotFoundException('Вишлист не найден');
    }

    Object.assign(wishlist, updateWishlistDto);
    await this.wishRepository.save(wishlist);

    return this.wishlistRepository.save(wishlist);
  }

  async removeWishlist(id: number) {
    const wishlist = await this.findWishlistById(id);

    if (!wishlist) {
      throw new NotFoundException('Вишлист не найден');
    }

    await this.wishlistRepository.remove(wishlist);
  }
}
