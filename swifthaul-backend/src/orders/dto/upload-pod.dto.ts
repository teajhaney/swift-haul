import { IsOptional, IsString } from 'class-validator';

export class UploadPodDto {
  @IsOptional()
  @IsString()
  signedBy?: string;

  @IsOptional()
  @IsString()
  signatureDataUrl?: string;
}
