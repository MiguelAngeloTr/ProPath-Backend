import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    // Service Configuration
    PORT: number;
    HOST: string;
    MICROSERVICE_PORT: number;
    
    // SMTP Configuration
    SMTP_HOST: string;
    SMTP_PORT: number;
    SMTP_USER: string;
    SMTP_PASS: string;
    
    // Email Configuration
    EMAIL_FROM: string;
    EMAIL_SUBJECT: string;
    EMAIL_TEMPLATE: string;
}

// Validador de schema: Asegura de que si las variables requeridas no vienen lance una excepción
const envsSchema = joi.object({
    // Service Configuration
    PORT: joi.number().default(3003),
    HOST: joi.string().default('localhost'),
    MICROSERVICE_PORT: joi.number().default(3103),
    
    // SMTP Configuration
    SMTP_HOST: joi.string().default('smtp.gmail.com'),
    SMTP_PORT: joi.number().default(587),
    SMTP_USER: joi.string().required(),
    SMTP_PASS: joi.string().required(),
    
    // Email Configuration
    EMAIL_FROM: joi.string().default('ProPath@gmail.com'),
    EMAIL_SUBJECT: joi.string().default('Your ProPath Account Password'),
    EMAIL_TEMPLATE: joi.string().default('password-template.hbs'),
})
.unknown(true); // Ignora cualquier otra variable que no esté en el schema

const {error, value} = envsSchema.validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
    // Service Configuration
    PORT: envVars.PORT,
    HOST: envVars.HOST,
    MICROSERVICE_PORT: envVars.MICROSERVICE_PORT,
    
    // SMTP Configuration
    SMTP_HOST: envVars.SMTP_HOST,
    SMTP_PORT: envVars.SMTP_PORT,
    SMTP_USER: envVars.SMTP_USER,
    SMTP_PASS: envVars.SMTP_PASS,
    
    // Email Configuration
    EMAIL_FROM: envVars.EMAIL_FROM,
    EMAIL_SUBJECT: envVars.EMAIL_SUBJECT,
    EMAIL_TEMPLATE: envVars.EMAIL_TEMPLATE,
}