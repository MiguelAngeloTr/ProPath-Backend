import 'dotenv/config';
import * as Joi from 'joi';

// Definir la interfaz de variables de entorno
interface EnvVars {
  PORT: number;
  HOST: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_SYNC: boolean;
}

// Validación de variables de entorno con Joi
const envsSchema = Joi.object({
  PORT: Joi.number().required(),
  HOST: Joi.string().default('localhost'),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_SYNC: Joi.boolean().default(true),
}).unknown(true); // Permite otras variables en el `.env`

// Validar y obtener las variables de entorno
const { error, value } = envsSchema.validate(process.env);
if (error) {
  throw new Error(`❌ Config validation error: ${error.message}`);
}

// Convertir valores correctamente
const envVars: EnvVars = {
  PORT: Number(value.PORT),
  HOST: value.HOST,
  DB_HOST: value.DB_HOST,
  DB_PORT: Number(value.DB_PORT),
  DB_USERNAME: value.DB_USERNAME,
  DB_PASSWORD: value.DB_PASSWORD,
  DB_NAME: value.DB_NAME,
  DB_SYNC: value.DB_SYNC === 'true', // Convertir string a boolean
};

// Exportar variables de entorno
export const envs = envVars;
