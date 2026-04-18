import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';
import { Readable } from 'stream';
import { UPLOAD_MESSAGES } from '../common/constants/messages';

export interface UploadResult {
  secure_url: string;
  public_id: string;
}

// CloudinaryService wraps the Cloudinary SDK so it can be injected into any
// module that needs file uploads. Making it a provider means it can be mocked
// in unit tests — you never want real HTTP calls in your test suite.
@Injectable()
export class CloudinaryService {
  constructor() {
    // ConfigModule.forRoot() runs before any other module, so process.env is
    // already populated with .env values by the time this constructor runs.
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  // UPLOAD IMAGE
  // upload_stream is Cloudinary's streaming API — it accepts a Node.js Readable
  // stream and pipes it directly to Cloudinary without writing to disk.
  // Multer gives us the file as a Buffer (file.buffer), so we wrap it in a
  // Readable stream with Readable.from() before piping.
  uploadStream(buffer: Buffer, folder: string): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image' },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error || !result) {
            reject(
              new InternalServerErrorException(UPLOAD_MESSAGES.UPLOAD_FAILED),
            );
            return;
          }
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        },
      );

      Readable.from(buffer).pipe(stream);
    });
  }

  // DELETE IMAGE
  // destroy() removes an asset from Cloudinary by its public_id.
  // Any SDK-level failure throws automatically — the caller decides whether to
  // surface it or swallow it. Room deletion swallows it so the DB row is always
  // removed even if Cloudinary is temporarily unreachable.
  async destroy(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  }
}
