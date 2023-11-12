import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { Wish } from '../wishes/entities/wish.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async createOffer(createOfferDto: CreateOfferDto, user: User) {
    const wish = await this.wishRepository.findOne({
      where: {
        id: createOfferDto.itemId,
      },
      relations: { owner: true },
    });
    if (wish.owner.id === user.id) {
      throw new ConflictException('Нельзя скидываться на свой подарок');
    }
    if (createOfferDto.amount > wish.price - wish.raised) {
      throw new BadRequestException(
        'Сумма собранных средств не может превышать стоимость подарка',
      );
    }
    await this.offerRepository.save({
      ...createOfferDto,
      item: wish,
      user,
    });

    await this.wishRepository.increment(
      { id: wish.id },
      'raised',
      createOfferDto.amount,
    );
  }
}
