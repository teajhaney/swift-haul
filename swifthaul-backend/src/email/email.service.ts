import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: Transporter;
  private readonly fromAddress: string;

  constructor(private readonly configService: ConfigService) {
    const host = configService.getOrThrow<string>('SMTP_HOST');
    const port = configService.getOrThrow<number>('SMTP_PORT');
    const user = configService.getOrThrow<string>('SMTP_USER');
    const pass = configService.getOrThrow<string>('SMTP_PASS');
    const secure = configService.get<string>('SMTP_SECURE') === 'true';
    const fromName = configService.get<string>('SMTP_FROM_NAME', 'SwiftHaul');
    const fromEmail = configService.getOrThrow<string>('SMTP_FROM_EMAIL');

    this.fromAddress = `"${fromName}" <${fromEmail}>`;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });
  }

  async send(options: SendMailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
      this.logger.log(`Email sent to ${options.to}: ${options.subject}`);
    } catch (err) {
      this.logger.error(
        `Failed to send email to ${options.to}: ${String(err)}`,
      );
      // do not rethrow — email failure should never break the primary flow
    }
  }
}
