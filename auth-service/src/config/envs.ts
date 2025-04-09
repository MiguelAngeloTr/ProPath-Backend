import 'dotenv/config';
import * as Joi from 'joi';

// Definir la interfaz de variables de entorno
interface EnvVars {
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_SYNC: boolean;
  JWT_SECRET: string;
  JWT_EXPIRATION: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRATION: string;
}

// Validación de variables de entorno con Joi
const envsSchema = Joi.object({
  PORT: Joi.number().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_SYNC: Joi.boolean().default(true),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().default('1h'),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRATION: Joi.string().default('7d'),
}).unknown(true); // Permite otras variables en el `.env`

// Validar y obtener las variables de entorno
const { error, value } = envsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Convertir valores correctamente
const envVars: EnvVars = {
  PORT: Number(value.PORT),
  DB_HOST: value.DB_HOST,
  DB_PORT: Number(value.DB_PORT),
  DB_USERNAME: value.DB_USERNAME,
  DB_PASSWORD: value.DB_PASSWORD,
  DB_NAME: value.DB_NAME,
  DB_SYNC: value.DB_SYNC === 'true', // Convertir string a boolean
  JWT_SECRET: value.JWT_SECRET,
  JWT_EXPIRATION: value.JWT_EXPIRATION,
  JWT_REFRESH_SECRET: value.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRATION: value.JWT_REFRESH_EXPIRATION,
};

// Exportar variables de entorno
export const envs = envVars;
