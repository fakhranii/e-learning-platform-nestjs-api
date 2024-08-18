# ERD: Educational-platform-api.

This document explores the design of Educational-platform-api, a social experience for sharing useful your Educational-platform-api.

We'll use a basic server architecture, where the server is deployed
on a cloud provider next to a relational database, and serving HTTP traffic from
a public endpoint.

## Database Schema

We'll need at least the following entities to implement the service:

**Users**
| Column | Type |
|---------------------------|--------------------|
| id | number |
| fullName | string |
| username | string |
| email | string |
| password | string |
| avatar | string |
| isAdmin | boolean |
| CreatedAt | datatime |

**Courses**
| Column | Type |
|-----------------|-------------|
| id | number |
| title | string |
| slug | string |
| courseDescription | string |
| courseLink | string |
| Image | string |
| numberOfStudents | number |
| numberOfRatings | number |
| isBestSelling | boolean |
| whatYouWillLearn | string |
| passPercentage | string |
| prerequisites | string |
| language | string |
| category | string |
| skillLevel | string |
| thumbnails | string |
| courseCreatorId | number |
| CreatedAt | datatime |
| UpdatedAt | datatime |

**Reviews**
| Column | Type |
|-----------------|-------------|
| id | number |
| rating | number |
| reviewBody | string |
| reviewCreatorId | number |
| courseId | number |

**Instructors**
| Column | Type |
|-----------------|-------------|
| id | number |
| instructorDescription | string |
| username | string |
| fullName | string |
| avatar | string |
| email | string |
| studentsCount | number |
| coursesCount | number |
| ratingsCount | number |
| isInstructor | boolean |
| password | string |
| CreatedAt | datatime |

**Users_courses_courses**
| Column | Type |
|-----------------|-------------|
| userId | number |
| courseId | number |

## Server

A simple HTTP server is responsible for authentication, serving stored data, and
potentially ingesting and serving analytics data.

- Node.js is selected for implementing the server for speed of development.
- Nestjs.js is the web server framework.
- TypeOrm to be used as an ORM.

### Auth

For v1, JWT-based auth mechanism is to be used, with passwords
encrypted and stored in the database. potentially added OAuth
for Google + Facebook and maybe others (Github?).

### API

**Auth**:

```
/v1/auth/user/signin         [POST]
/v1/auth/instructor/signin   [POST]
/v1/auth/user/profile        [GET]
```

**Users**

```
/v1/users                      [POST]
/v1/users                      [GET]
/v1/users/5                    [GET]
/v1/users/                     [PATCH]
/v1/users/                     [DELETE]
/v1/users/avatar               [DELETE]
```

**Courses**

```
/v1/courses             [POST]
/v1/courses             [GET]
/v1/courses/18          [GET]
/v1/course/16           [PATCH]
/v1/courses/5           [DELETE]
/v1/courses/5/thumbnail [DELETE]
```

**Instructors**

```
/v1/instructors           [POST]
/v1/instructors           [GET]
/v1/instructors/1         [GET]
/v1/instructors           [PATCH]
/v1/instructors           [DELETE]
/v1/instructors/avatar    [DELETE]
```

**Reviews**

```
/v1/reviews/PG-in-arabic       [POST]
/v1/reviews/7                  [PATCH]
/v1/reviews/python-in-arabic   [DELETE]
```

**instructor/courses**

```
/v1/instructors/courses  [GET]
```

**course/reviews**

```
/v1/courses/PG-in-arabic/reviews [GET]
```

**course enroll**

```
/v1/courses/php-in-arabic/enroll    [POST]
/v1/courses/php-in-arabic/unenroll  [DELETE]
```
