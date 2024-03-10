import { Course } from 'src/course/entities/course.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: [1, 2, 3, 4, 5],
  })
  rating: number;

  @Column({ length: 50 })
  reviewBody: string;

  @ManyToOne(() => User, (user) => user.reviews)
  creator: User;

  @ManyToOne(() => Course, (course) => course.reviews)
  course: Course;
}
