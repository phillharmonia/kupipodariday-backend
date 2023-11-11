import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HashService } from '../hash/hash.service';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.hashService.hashPassword(
      createUserDto.password,
    );
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    try {
      await this.userRepository.save(user);
      return user;
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException(
          'Пользователь с такой почтой или именем уже существует',
        );
      }
      throw err;
    }
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async findByUsername(username: string): Promise<User> {
    const name = this.userRepository.findOneBy({ username });
    if (!name) {
      throw new NotFoundException('Пользователь не существует');
    }
    return name;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashService.hashPassword(
        updateUserDto.password,
      );
    }
    await this.userRepository.update(id, updateUserDto);
    return this.findById(id);
  }

  async findMany(query: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: [{ username: query }, { email: query }],
    });
    if (!user) {
      throw new NotFoundException(`Пользователь не существует`);
    }
    return user;
  }
  async findUserWishes(id: number): Promise<Wish[]> {
    const { wishes } = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        wishes: true,
      },
    });
    return wishes;
  }
}
