import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { UploadResolver } from './upload.resolver';
import { UploadService } from './upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  providers: [UploadService, UploadResolver],
})
export class UploadModule {}
