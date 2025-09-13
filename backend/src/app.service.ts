import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  getHello(): string {
    return 'Hello World!';
  }
    getnest(): string {
        return 'Hello from nestJS!';
    }
}
