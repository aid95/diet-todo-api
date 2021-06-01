import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLUpload } from 'apollo-server-express';
import { FileUpload } from 'graphql-upload';
import { GetAuthUser } from 'src/auth/decorators/auth-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { File } from './entities/file.entity';
import { UploadService } from './upload.service';

@Resolver()
export class UploadResolver {
  constructor(private readonly uploadService: UploadService) {}

  @Mutation(() => File)
  async fileUpload(
    @GetAuthUser() authUser: User,
    @Args({ name: 'file', type: () => GraphQLUpload })
    { createReadStream, filename }: FileUpload,
  ): Promise<File> {
    return this.uploadService.fileUpload(
      authUser,
      filename,
      createReadStream(),
    );
  }
}
