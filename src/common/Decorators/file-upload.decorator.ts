import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';

export interface FileUploadOptions {
  fieldName?: string;
  maxSize?: number;
  fileType?: string;
  fileIsRequired?: boolean;
}

export function FileUpload(options: FileUploadOptions = {}) {
  const { fieldName = 'logo' } = options;

  return applyDecorators(UseInterceptors(FileInterceptor(fieldName)));
}

export function UploadedFileValidated(options: FileUploadOptions = {}) {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    fileType = 'image/(jpeg|png|jpg)',
    fileIsRequired = false,
  } = options;

  return UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize }),
        new FileTypeValidator({
          fileType,
          skipMagicNumbersValidation: true,
        }),
      ],
      fileIsRequired,
    }),
  );
}
