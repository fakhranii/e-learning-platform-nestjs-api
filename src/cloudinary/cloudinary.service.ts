// import { Injectable } from '@nestjs/common';
// import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
// import * as streamifier from 'streamifier';
// import { CloudinaryResponse } from './cloudinary-response';

// @Injectable()
// export class CloudinaryService {
//   uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
//     return new Promise<CloudinaryResponse>((resolve, reject) => {
//       const uploadStream = v2.uploader.upload_stream((error, result) => {
//         if (error) return reject(error);
//         resolve(result);
//       });

//       streamifier.createReadStream(file.buffer).pipe(uploadStream);
//     });
//   }
// }

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v2 } from 'cloudinary';
import * as streamifier from 'streamifier';
import { CloudinaryResponse } from './cloudinary-response';


@Injectable()
export class CloudinaryService {
  async uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}