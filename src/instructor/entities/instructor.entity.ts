import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';

import { Course } from 'src/course/entities/course.entity';

@Entity({ name: 'instructors' })
export class Instructor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 70 })
  instructorDescription: string;

  @Column({ unique: true, length: 15 })
  username: string;

  @Column({ length: 30, nullable: true })
  fullName: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ unique: true, length: 30 })
  email: string;

  @Column({ default: 0 })
  studentsCount: number;

  @Column({ default: 0 })
  coursesCount: number;

  @Column({ default: 0 })
  ratingsCount: number;

  @Column({ default: true })
  isInstructor: boolean;

  @Column({ select: false })
  password: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => Course, (course) => course.courseCreator)
  courses: Course[];

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
}
