import { Injectable } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { DecodedIdToken } from 'firebase-admin/auth';
import { CreatePaymentInput } from './dto/payment.input';

@Injectable()
export class PaymentsService {
  async create(
    // token: DecodedIdToken,
    createPaymentInput: CreatePaymentInput,
  ) {
    // console.log(token.phone_number);
    // console.log(token.uid);

    console.log(createPaymentInput);

    const { orderId, amount, paymentKey } = createPaymentInput;

    const testKey = '5zJ4xY7m0kODnyRpQWGrN2xqGlNvLrKwv1M9ENjbeoPaZdL6';
    try {
      const r = await axios.post(
        `https://api.tosspayments.com/v1/payments/${paymentKey}`,
        { orderId, amount },
        {
          headers: {
            Authorization:
              'Basic dGVzdF9za196WExrS0V5cE5BcldtbzUwblgzbG1lYXhZRzVSOg==',
            'Content-Type': 'application/json',
          },
        },
      );

      console.log(r.data);
      return { ok: true, payment: r.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Access to config, request, and response
        console.log('error : ', error);
        // console.log('error.response : ', error.response);
        // console.log('error.request : ', error.request);
        // console.log('error.response.data : ', error.response.data);
        return { ok: false, error: error.response.data.message };
      } else {
        // Just a stock error
        return { ok: false, error: '요청 중 서버에서 오류 발생!' };
      }
    }
  }
}
