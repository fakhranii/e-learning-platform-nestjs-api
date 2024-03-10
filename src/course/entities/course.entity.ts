import slugify from 'slugify';
import { Instructor } from 'src/instructor/entities/instructor.entity';
import { Review } from 'src/review/entities/review.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  BeforeInsert,
} from 'typeorm';

@Entity({ name: 'courses' })
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  courseName: string; // elzero js

  @Column()
  slug: string;

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

  @ManyToOne(() => User, (user) => user.courses)
  subscriber: User;

  @ManyToOne(() => Instructor, (Instructor) => Instructor.courses)
  creator: Instructor;

  @OneToMany(() => Review, (review) => review.course)
  reviews: Review[];

  @BeforeInsert()
  @BeforeInsert()
  async getSlug(): Promise<any> {
    try {
      this.slug = slugify(this.courseName, '-');
    } catch (e) {
      return 'there is an error with slugify';
    }
  }
}
