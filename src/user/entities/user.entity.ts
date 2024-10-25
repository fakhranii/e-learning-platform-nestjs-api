import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
  ManyToMany,
  JoinTable,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Course } from 'src/course/entities/course.entity';
import { Review } from 'src/review/entities/review.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30 })
  fullName: string;

  @Column({ unique: true, length: 15 })
  username: string;

  @Column({ unique: true, length: 30 })
  email: string;

  @Column({ select: false }) // typeorm package
  password: string;

  @Column({ default: false, select: false })
  isAdmin: boolean; // true or false

  @Column({ default: true, select: false })
  active: boolean;

  @Column({ nullable: true }) // typeorm package
  avatar: string;

  @Column({ type: 'timestamp', nullable: true, select: false })
  passwordChangedAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  createdAt: Date;

  @Column({ nullable: true, select: false })
  passwordResetCode: string;

  @Column({ type: 'timestamp', nullable: true, select: false })
  passwordResetExpires: Date;

  @Column({ default: false, select: false })
  passwordResetVerified: Boolean;

  @OneToMany(() => Review, (reviews) => reviews.reviewCreator)
  reviews: Review[];

  @ManyToMany(() => Course, { cascade: ['insert'] })
  @JoinTable()
  courses: Course[];

  @BeforeInsert()
  @BeforeUpdate()
  async correctInputs(): Promise<any> {
    try {
      this.email = this.email.toLowerCase().trim();
      this.username = this.username.toLowerCase().trim();
      this.password = this.password.trim();
      this.fullName = this.fullName.trim();
      this.password = await bcrypt.hash(this.password, 10);
    } catch (e) {
      console.log(e);
      // (); // 500
    }
  }
}
