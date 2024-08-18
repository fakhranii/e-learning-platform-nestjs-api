import slugify from 'slugify';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  BeforeInsert,
} from 'typeorm';

import { Instructor } from 'src/instructor/entities/instructor.entity';
import { Review } from 'src/review/entities/review.entity';

@Entity({ name: 'courses' })
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string; // elzero js

  @Column()
  slug: string;

  @Column()
  courseDescription: string; // in this course we'll learn ...........

  @Column()
  courseLink: string;

  @Column({ default: 0 })
  numberOfStudents: number;

  @Column({ default: 0 })
  numberOfRatings: number;

  @Column({ default: false })
  isBestSelling: boolean;

  @Column({ nullable: true })
  whatYouWillLearn: string;

  @Column({ default: '85%', length: 6 })
  passPercentage: string;

  @Column({ nullable: true })
  prerequisites: string; // before start learn nodejs you should know about js

  @Column({ type: 'enum', enum: ['arabic', 'english'], default: 'english' })
  language: string;

  @Column({
    type: 'enum',
    enum: ['frontend', 'backend', 'fullStack'],
  })
  category: string;

  @Column({ default: false })
  isCertified: boolean;

  @Column({
    type: 'enum',
    enum: ['intermediate', 'beginner', 'advanced'],
  })
  skillLevel: string;

  @Column({ nullable: true })
  thumbnails: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Instructor, (Instructor) => Instructor.courses)
  courseCreator: Instructor;

  @OneToMany(() => Review, (review) => review.course)
  reviews: Review[];

  @BeforeInsert()
  async getSlug(): Promise<any> {
    try {
      this.slug = slugify(this.title, '-');
    } catch (e) {
      return 'there is an error with slugify';
    }
  }
}
