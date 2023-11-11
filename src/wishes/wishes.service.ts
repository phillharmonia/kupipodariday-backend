import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { DataSource, Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createWishDto: CreateWishDto, user: User) {
    const wish = this.wishRepository.create({ ...createWishDto, owner: user });
    return await this.wishRepository.save(wish);
  }

  async findLastWishes() {
    return this.wishRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 40,
    });
  }
  async findTopWishes() {
    return this.wishRepository.find({
      order: {
        copied: 'DESC',
      },
      take: 20,
    });
  }
  async findWishById(id: number) {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: { offers: true, owner: true },
    });
    if (!wish) {
      throw new NotFoundException('Не удалось найти подарок');
    }
    return wish;
  }
  async updateWish(id: number, updateWishDto: UpdateWishDto, user: User) {
    const wish = await this.findWishById(id);

    if (wish.owner.id !== user.id) {
      throw new ForbiddenException('Вы не можете изменить эту карточку');
    }

    if (wish.raised > 0) {
      throw new ForbiddenException(
        'Нельзя изменить карточку, которую уже поддержали',
      );
    }

    Object.assign(wish, updateWishDto);
    await this.wishRepository.save(wish);

    return wish;
  }
  async removeWish(id: number, user: User) {
    const wish = await this.findWishById(id);
    if (wish.owner.id !== user.id) {
      throw new ForbiddenException('У вас нет прав на удаление этой карточки');
    }
    await this.wishRepository.remove(wish);
  }
  async copyWish(id: number, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const originalWish = await this.findWishById(id);

      const { name, link, image, price, description } = originalWish;
      const newWish = this.wishRepository.create({
        name,
        link,
        image,
        price,
        description,
        owner: user,
      });
      const copiedWish = await this.wishRepository.save(newWish);

      originalWish.copied += 1;
      await this.wishRepository.save(originalWish);

      await queryRunner.commitTransaction();

      return copiedWish;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
