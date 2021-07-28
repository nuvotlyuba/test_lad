import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import User from './User';

@Entity('session')
export default class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  token: string;

  @CreateDateColumn({ type: 'timestamp without time zone', default: null })
  created: Date;

  @ManyToOne(() => User, (user) => user.session, { onDelete: 'CASCADE' })
  user: User;
}
