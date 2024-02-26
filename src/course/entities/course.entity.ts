import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity({ name: 'courses' })
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  courseName: string; // elzero js 

  @Column()
  courseDescription: string; // in this course we'll learn ...........

  @Column({ type: "simple-array" })
  prerequisites: string; // before start learn nodejs you should know about js 

  @Column({
    type: 'enum',
    enum: ['frontend development', 'backend development', 'mobile development'],
  })
  courseType: string;
  
  @ManyToOne(() => User, (user) => user.courses)
  user: User;
}
