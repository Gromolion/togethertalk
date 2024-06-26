import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Meet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  theme: string;

  @Column()
  description: string;

  @Column({
    nullable: false,
  })
  meetAt: number;

  @ManyToOne(() => User)
  initiator: User;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'meet_participants',
  })
  participants: User[];

  @Column({
    nullable: false,
  })
  hash: string;

  constructor(
    theme: string,
    description: string = '',
    meetAt: number,
    initiator: User,
    hash: string,
  ) {
    this.theme = theme;
    this.description = description;
    this.meetAt = meetAt;
    this.initiator = initiator;
    this.hash = hash;
  }
}
