import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import Session from './Session';

@Entity('user')
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  login: string;

  @Column({ type: 'varchar', nullable: false, select: false })
  password: string;

  @OneToMany(() => Session, (session) => session.user)
  session: Session;
}
