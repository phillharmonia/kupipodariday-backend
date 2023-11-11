import { IsInt, IsDate } from 'class-validator';
import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

export class DefaultEntity {
    @PrimaryGeneratedColumn()
    @IsInt()
    id: number;

    @CreateDateColumn()
    @IsDate()
    createdAt: Date;

    @UpdateDateColumn()
    @IsDate()
    updatedAt: Date;
}