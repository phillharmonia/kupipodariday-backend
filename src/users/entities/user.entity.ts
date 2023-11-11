import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Wish } from '../../wishes/entities/wish.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import {IsEmail, IsString, IsUrl, Length} from "class-validator";
import {Exclude} from "class-transformer";
import {DefaultEntity} from "../../entity/default-entity";

@Entity()
export class User extends DefaultEntity {
  @Column({ unique: true})
  @IsString()
  @Length(2, 30)
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @IsString()
  @Length(2, 200)
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  avatar: string;

  @Exclude()
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Exclude()
  @Column()
  @IsString()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.id)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
