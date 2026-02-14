import {
  Controller,
  Post,
  Req,
  BadRequestException,
  Headers,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PaymentService } from 'src/common';
import { RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';

@Controller('orders')
export class WebhookController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly paymentService: PaymentService,
  ) {}

  @Post('webhook')
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    const rawBody = req.rawBody;

    if (!rawBody) {
      throw new BadRequestException('Missing raw body');
    }

    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    let event;
    try {
      event = this.paymentService.constructEvent(rawBody, signature);
    } catch (err) {
      throw new BadRequestException(
        `Webhook signature verification failed: ${err.message}`,
      );
    }

    return this.ordersService.handleStripeWebhook(event);
  }
}
