import { Controller, Post, Get, Body, BadRequestException } from '@nestjs/common';
import { RegisterService } from './register.service';

@Controller('register')
export class RegisterController {
    constructor(private readonly registerService: RegisterService) {}

    @Get('mnemonic')
    generateMnemonic() {
        try {
            const mnemonic = this.registerService.generateMnemonic();
            return {
                success: true,
                mnemonic
            };
        } catch (error) {
            throw new BadRequestException('Failed to generate mnemonic');
        }
    }

    @Post('validate')
    validateMnemonic(@Body('mnemonic') mnemonic: string) {
        // Validasi input
        if (!mnemonic || typeof mnemonic !== 'string') {
            throw new BadRequestException('Mnemonic is required and must be a string');
        }

        try {
            const isValid = this.registerService.validateMnemonic(mnemonic);
            return {
                success: true,
                valid: isValid
            };
        } catch (error) {
            throw new BadRequestException('Failed to validate mnemonic');
        }
    }
}