# E-learning-Platform-Api

## Table of Contents

- [Project Description](#project-description)
  - [Admin Dashboard](#admin-dashboard)
  - [Authentication Management](#authentication-management)
  - [Instructor](#instructor)
  - [Course Management](#course-management)
  - [User Interaction](#user-interaction)
  - [Dealing with images](#dealing-with-images)
  - [Robust Security System](#robust-security-system)
  - [Seamless Integration](#seamless-integration)
- [Used Technologies](#used-technologies)
- [How to Install and Run the Project](#how-to-install-and-run-the-project)
  - [Prerequisites](#prerequisites)
  - [Dependencies Installation via Docker-Compose](#dependencies-installation-via-docker-compose)
- [API Documentation](#api-documentation)

## Project Description

**The E-Learning API Project is a robust backend system for managing users, instructors, and courses. There is admin dashboard that can manages everything in the platform. The Platform offers the following key features:**

### _Admin Dashboard:_

- **The admin is able to view the full number of users and review all statistics of the platform.**
- **Admins have the ability to manage users, instructors, reviews and courses and everything in the platform. He can delete anything he deemed unsuitable.**

### _Authentication Management:_

- **Users can register as students who consume the courses or instructors who create and manage courses.**
- **It includes a password recovery feature, allowing users to receive a reset code via email and easily set a new password if they forget theirs.**

### _Instructor:_

- **Instructors can create and manage courses, providing important details such as course descriptions, prerequisites, what students will learn, and the course language.**

- **Instructors can also upload course images using Cloudinary, with built-in image compression to ensure optimized performance.**

### _Course Management:_

- **Instructors can create and manage courses with rich details such as course descriptions, prerequisites, learning outcomes, and course language.**

### _User Interaction:_

- **Students can browse and enroll in courses, leave reviews, and rate courses using a star-based rating system along with written feedback.**

### _Dealing with images:_

- **The platform integrates `Cloudinary` for image uploading for users' profile picture & courses'cover** - **Also use `compression` package to anutilizes image compression, making the process faster and more efficient.**

### _Robust Security System:_

**The platform includes a solid security system with multiple protections:**

- **CSRF Token Protection:** Prevents cross-site request forgery attacks.
- **Spam Request Prevention:** Limits the number of requests per second to block spam attacks.
- **Input Data Sanitization:** Ensures the application is safe from malicious scripts by cleaning user inputs.
- **Request Body Size Limitation:** Prevents overloading the server memory by restricting large request payloads.

### _Seamless Integration:_

- **The API is designed to work effortlessly with frontend applications, mobile apps, and desktop apps, ensuring compatibility and flexibility across platforms.**
- **This combination of user-friendly features and strong security measures makes the API a scalable and reliable solution for e-learning platforms.**

---

## _Used Technologies_

- **Node.js**
- **Nest.js**
- **MySQL.**
- **TypeORM**
- **Docker**
- **Docker-Compose**
- **JWT**
- **Bcrypt**
- **Class-Transformer.**
- **Class-Validator.**
- **Cloudinary.**
- **Compression.**
- **Helmet.**
- **Hpp.**
- **Nodemailer.**
- **Sanitize-Html.**
- **slugify.**

## How to Install and Run the Project

### _Prerequisites_

- **[Docker-Desktop](https://www.docker.com/products/docker-desktop/)**


### _dependencies Installation via `Docker-Compose`_

- **This command will install specific version of Nodejs and all packages with their versions which are exist in `package.json` and start the necessary containers for the project [ `phpmyadmin-ui` - `mysql-db`]. At the end the project gonna run .. all with one command**

  **Here You are the Command :**

```terminal
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d
```

- **Also you should create a `.env` file in the root directory of the project and add the following environment variables:**

```example.env
DB_HOST =
DB_PORT =
DB_NAME =
DB_USERNAME =
DB_PASSWORD =

jwtSecret =

CLOUDINARY_URL=
CLOUDINARY_CLOUD_NAME =
CLOUDINARY_API_KEY =
CLOUDINARY_API_SECRET=

#? NodeMailer - Email settings
# EMAIL_HOST=smtp.ethereal.email
# Email_PORT=587
EMAIL_USER=
EMAIL_PASSWORD=

COOKIE_SECRET_KEY=
```

- **Or you can see the file that includes all variables from here: [example.env](./example.env)**

---

## _API Documentation_

- **The API documentation is available at the following URL: [API Documentation](https://gold-water-721915.postman.co/workspace/Public-Collections~899f080b-3a13-42d0-895e-553e15ff281c/collection/31885780-ba7c45c9-d1f4-4192-b93c-dc629f65b059?action=share&creator=31885780&active-environment=31885780-d855adc6-c38e-47cc-b535-cb7f12eda7a2)**
- **You can also find the API documentation in the project's root directory in the [postman-collections](./docs/postman/graduation%20project.postman_collection.json) file.**
