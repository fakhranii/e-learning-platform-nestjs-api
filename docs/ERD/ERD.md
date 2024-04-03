# ERD: Educational-platform-api.

This document explores the design of Educational-platform-api, a social experience for sharing useful your Educational-platform-api.

We'll use a basic server architecture, where the server is deployed
on a cloud provider next to a relational database, and serving HTTP traffic from
a public endpoint.

## Schema

We'll need at least the following entities to implement the service:

**Users**
| Column | Type |
|---------------------------|--------------------|
| id | NUMBER |
| fullName | STRING |
| username | STRING |
| email | STRING |
| password | STRING |
| avatar | STRING |
| isAdmin | BOOLEAN |
| CreatedAt | DATETIME |

**Courses**
| Column | Type |
|-----------------|-------------|
| id | NUMBER |
| title | STRING |
| slug | STRING |
| courseDescription | STRING |
| courseLink | STRING |
| Image | STRING |
| numberOfStudents | NUMBER |
| numberOfRatings | NUMBER |
| isBestSelling | BOOLEAN |
| whatYouWillLearn | STRING |
| passPercentage | STRING |
| prerequisites | STRING |
| language | STRING |
| category | STRING |
| skillLevel | STRING |
| thumbnails | STRING |
| courseCreatorId | NUMBER |
| CreatedAt | DATETIME |
| UpdatedAt | DATETIME |

**Reviews**
| Column | Type |
|-----------------|-------------|
| id | NUMBER |
| rating | NUMBER |
| reviewBody | STRING |
| reviewCreatorId | NUMBER |
| courseId | NUMBER |

**Instructors**
| Column | Type |
|-----------------|-------------|
| id | NUMBER |
| instructorDescription | STRING |
| username | STRING |
| fullName | STRING |
| avatar | STRING |
| email | STRING |
| studentsCount | NUMBER |
| coursesCount | NUMBER |
| ratingsCount | NUMBER |
| isInstructor | BOOLEAN |
| password | STRING |
| CreatedAt | DATETIME |

**Users_courses_courses**
| Column | Type |
|-----------------|-------------|
| userId | NUMBER |
| courseId | NUMBER |


## Server

A simple HTTP server is responsible for authentication, serving stored data, and
potentially ingesting and serving analytics data.

-  Node.js is selected for implementing the server for speed of development.
-  Nestjs.js is the web server framework.
-  TypeOrm to be used as an ORM.

### Auth

For v1, JWT-based auth mechanism is to be used, with passwords
encrypted and stored in the database. potentially added OAuth
for Google + Facebook and maybe others (Github?).
