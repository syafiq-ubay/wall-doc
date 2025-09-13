import { Injectable } from '@nestjs/common';
import * as bip39 from 'bip39';

@Injectable()
export class RegisterService {
    generateMnemonic(): string {
        return bip39.generateMnemonic();
    }

    validateMnemonic(mnemonic: string): boolean {
        return bip39.validateMnemonic(mnemonic);
    }
}