import { Course } from 'src/course/entities/course.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';

@Entity({ name: 'instructors' })
export class Instructor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 70 })
  instructorDescription: string;

  @Column({ unique: true, length: 15 })
  username: string;

  @Column({ unique: true, length: 30 })
  email: string;

  @Column({ default: true })
  isInstructor: boolean;

  @Column({ select: false })
  password: string;

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
