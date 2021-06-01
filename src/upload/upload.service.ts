import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { ReadStream } from 'fs';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as uuid from 'uuid4';
import { File } from './entities/file.entity';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(File) private readonly fileRepository: Repository<File>,
    private readonly configService: ConfigService,
  ) {}

  async fileUpload(
    user: User,
    filename: string,
    fileReadStream: ReadStream,
  ): Promise<File> {
    if (!user) {
      throw new UnauthorizedException();
    }

    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Key: `${uuid()}-${filename}`,
        Body: fileReadStream,
      })
      .promise();

    const newFile = this.fileRepository.create({
      key: uploadResult.Key,
      url: uploadResult.Location,
    });
    return this.fileRepository.save(newFile);
  }
}
