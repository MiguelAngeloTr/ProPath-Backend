import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    // console.log('Exception Filter:', exception);
    // console.log('Request:', request.url, request.method, request.body);
    // Obtener la respuesta completa de la excepción
    const exceptionResponse = exception.getResponse();

    // Preparar la respuesta básica
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: typeof exceptionResponse === 'string' 
        ? exceptionResponse 
        : exception.message,
    };

    // Verificar si hay errores de validación (class-validator)
    if (
      typeof exceptionResponse === 'object' && 
      'message' in exceptionResponse && 
      Array.isArray(exceptionResponse['message'])
    ) {
      // Agregar los errores de validación a la respuesta
      errorResponse['validationErrors'] = exceptionResponse['message'];
    } else if (
      typeof exceptionResponse === 'object' && 
      'validationErrors' in exceptionResponse
    ) {
      // En caso de que ya tengamos un formato personalizado
      errorResponse['validationErrors'] = exceptionResponse['validationErrors'];
    }

    response
      .status(status)
      .json(errorResponse);
  }
}