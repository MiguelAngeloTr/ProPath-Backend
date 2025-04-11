import { Inject, Injectable, UnauthorizedException, BadRequestException, HttpException, HttpStatus} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { UsersManagementService } from '../users-management/users-management.service';
import { SmtpService } from '../smtp/smtp.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('Auth-Service') private readonly authClient: ClientProxy,
    private readonly usersService: UsersManagementService,
    private readonly smtpService: SmtpService
  ) {}

  async login(loginDto: LoginDto) {

    try {
      const loginResponse = await firstValueFrom(this.authClient.send({ cmd: 'login' }, loginDto));
      const userData = await this.usersService.getUserById(loginResponse.user.id);
      if (loginResponse.error) {
        throw new UnauthorizedException(loginResponse.error);
      }

      if (!userData) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      return {
        loginResponse, userData
      };


    } catch (error) {   
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async register(registerDto: RegisterDto) {
    try {

      const userProfile = {
        id: registerDto.id,
        documentId: registerDto.documentId,
        email: registerDto.email,
        role: registerDto.role,

        name: registerDto.name || 'Usuario Nuevo',
        idType: registerDto.idType || 'CC',
        country: registerDto.country || 'Colombia',
        city: registerDto.city || 'Bogotá',
        birthDate: registerDto.birthDate || new Date().toISOString().split('T')[0]
      };

      const createdUser = await this.usersService.createUser(userProfile);

      const authResponse = await firstValueFrom(
        this.authClient.send({ cmd: 'register' }, createdUser)
      );

      // Si hay una contraseña generada, enviar el correo
      if (authResponse.generatedPassword) {
        // Enviar correo con los datos y la contraseña
        await this.smtpService.sendPasswordEmail({
          email: createdUser.email,
          name: createdUser.name,
          password: authResponse.generatedPassword
        });
        
        console.log(`Correo enviado a ${createdUser.email} con su contraseña generada`);
      }

      return authResponse;
      
    } catch (error) {
      // throw new BadRequestException(`Error registrando usuario: ${error.message}`);
      if (error.response && error.response.validationErrors) {
        throw new HttpException({
          message: 'Validation failed',
          validationErrors: error.response.validationErrors
        }, HttpStatus.BAD_REQUEST);
      }
      
      // Handle other known error types with appropriate status codes
      if (error.name === 'ValidationError') {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      
      // Default fallback for unknown errors
      throw new BadRequestException(`Error registrando usuario: ${error.message}`);
    }
  }

  async verifyToken(token: string) {
    return firstValueFrom(
      this.authClient.send({ cmd: 'verify_token' }, token)
    );
  }

  async refreshToken(refreshToken: string) {
    return firstValueFrom(
      this.authClient.send({ cmd: 'refresh_token' }, refreshToken)
    );
  }

  async logout(userId: string) {
    return firstValueFrom(
      this.authClient.send({ cmd: 'logout' }, userId)
    );
  }
}