import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Roles } from 'src/auth/enum/roles.enum';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
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
  position?: string;

  @Column('simple-array', {
    nullable: false,
    array: true,
    default: [Roles.USER],
  })
  roles: string[];

  @Column({
    nullable: true,
  })
  @Exclude({ toPlainOnly: true })
  resetPasswordHash: string;

  @Column({
    nullable: true,
  })
  avatar: string;

  constructor(
    login: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
    position?: string,
  ) {
    this.login = login;
    this.password = password;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.position = position;
  }

  get isAdmin(): boolean {
    return this.roles.includes(Roles.ADMIN);
  }
}
