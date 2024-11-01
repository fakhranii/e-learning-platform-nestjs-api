import { Course } from 'src/course/entities/course.entity';
import { Instructor } from 'src/instructor/entities/instructor.entity';
import { Review } from 'src/review/entities/review.entity';
import { User } from 'src/user/entities/user.entity';

export function sanitizeUser(user: User) {
  return {
    id: user.id,
    username: user.username,
    fullname: user.fullName,
    avatar: user.avatar
  };
}

export function sanitizeInstructor(instructor: Instructor) {
  return {
    id: instructor.id,
    username: instructor.username,
    fullname: instructor.fullName,
    avatar: instructor.avatar,
  };
}

export function sanitizeCourse(course: Course) {
  return {
    slug: course.slug,
    id: course.id,
    title: course.title,
    category: course.category,
    link: course.courseLink,
    language: course.language,
    thumbnails: course.thumbnails,
    courseCreator: course.courseCreator,
  };
}
