import { InternalServerErrorException } from '@nestjs/common';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Course } from 'src/course/entities/course.entity';
import { Review } from 'src/review/entities/review.entity';

//* table name
@Entity({ name: 'users' })
export class User {
  //* table schema
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 15 })
  username: string;

  @Column({ unique: true, length: 30 })
  email: string;

  @Column({ select: false }) // typeorm package
  password: string;

  @Column({ default: false })
  isAdmin: boolean; // true or false

  @BeforeInsert()
  async correctInputs(): Promise<any> {
    try {
      this.email = this.email.toLowerCase().trim();
      this.username = this.username.toLowerCase().trim();
      this.password = this.password.trim();
      this.password = await bcrypt.hash(this.password, 10);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(); // 500
    }
  }

  @OneToMany(() => Course, (courses) => courses.subscriber)
  courses: Course[];

  @OneToMany(() => Review, (reviews) => reviews.creator)
  reviews: Review[];
}
