import { Instructor } from 'src/instructor/entities/instructor.entity';
import { Review } from 'src/review/entities/review.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'courses' })
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  courseName: string; // elzero js

  @Column()
  courseDescription: string; // in this course we'll learn ...........

  @Column()
  courseLink: string;

  @Column({ type: 'simple-array' })
  prerequisites: string; // before start learn nodejs you should know about js

  @Column({
    type: 'enum',
    enum: ['frontend', 'backend', 'mobile applications'],
  })
  courseType: string;

  // @ManyToOne(() => Instructor, (Instructor) => instructor.courses, {
  //   eager: true,
  // })
  // creator: Instructor;
  @ManyToOne(() => User, (user) => user.courses, {
    eager: true,
  })
  subscriber: User;

  @ManyToOne(() => Instructor, (Instructor) => Instructor.courses, {
    eager: true,
  })
  creator: Instructor;

  @OneToMany(() => Review, (review) => review.courses)
  reviews: Review[];
}
