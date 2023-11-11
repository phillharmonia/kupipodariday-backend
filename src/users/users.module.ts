import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { HashModule } from '../hash/hash.module';
import {Wish} from "../wishes/entities/wish.entity";
import {Wishlist} from "../wishlists/entities/wishlist.entity";
import {Offer} from "../offers/entities/offer.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Wish, Wishlist, Offer]), HashModule],
  controllers: [UserController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
