import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Roles } from 'src/auth/enum/roles.enum';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    unique: true,
  })
  login: string;

  @Exclude({ toPlainOnly: true })
  @Column({
    nullable: false,
  })
  password: string;

  @Column({
    nullable: false,
  })
  email: string;

  @Column({
    nullable: false,
  })
  firstName: string;

  @Column({
    nullable: false,
  })
  lastName: string;

  @Column({
    nullable: true,
  })
  position: string;

  @Column('simple-array', {
    nullable: false,
    array: true,
    default: [Roles.USER],
  })
  roles: string[];

  @Column({
    nullable: true,
  })
  // @Exclude({ toPlainOnly: true })
  resetPasswordHash: string;
}
