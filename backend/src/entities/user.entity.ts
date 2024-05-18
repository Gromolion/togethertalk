import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Roles } from 'src/auth/enum/roles.enum';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    unique: true,
  })
  login: string;

  @Exclude()
  @Column({
    nullable: false,
  })
  password: string;

  @Exclude()
  @Column({
    nullable: false,
  })
  email: string;

  @Exclude()
  @Column({
    nullable: false,
  })
  firstName: string;

  @Exclude()
  @Column({
    nullable: false,
  })
  lastName: string;

  @Exclude()
  @Column({
    nullable: true,
  })
  position: string;

  @Exclude()
  @Column('simple-array', {
    nullable: false,
    array: true,
    default: [Roles.USER],
  })
  roles: string[];
}
