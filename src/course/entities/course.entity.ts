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
  ManyToMany,
  JoinTable,
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

  @Column()
  coursesCount: number;

  @Column()
  reviewsCount: number;

  @Column({ type: 'simple-array' })
  prerequisites: string; // before start learn nodejs you should know about js

  @Column({ type: 'enum', enum: ['Arabic', 'English'], default: 'English' })
  courseLanguage: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({
    type: 'enum',
    enum: ['frontend', 'backend', 'mobile applications'],
  })
  courseType: string;

  @Column({
    type: 'enum',
    enum: [true, false],
    default: false,
  })
  isCertified: boolean;

  @Column({
    type: 'enum',
    enum: ['intermediate', 'beginner', 'advanced'],
  })
  skillLevel: string;

  @Column({ nullable: true })
  thumbnails: string;

  @ManyToOne(() => Instructor, (Instructor) => Instructor.courses, {
    eager: true,
    onDelete: 'CASCADE',
  })
  courseCreator: Instructor;

  @OneToMany(() => Review, (review) => review.course)
  reviews: Review[];

  @BeforeInsert()
  async getSlug(): Promise<any> {
    try {
      this.slug = slugify(this.courseName, '-');
    } catch (e) {
      return 'there is an error with slugify';
    }
  }
}
