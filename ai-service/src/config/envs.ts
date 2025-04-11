import 'dotenv/config';
import * as Joi from 'joi';

// Definir la interfaz de variables de entorno
interface EnvVars {
    PORT: number;
    HOST: string;
    GEMINI_API_KEY: string;
}

// Validación de variables de entorno con Joi
const envsSchema = Joi.object({
    PORT: Joi.number().required(),
    HOST: Joi.string().default('localhost'),
    GEMINI_API_KEY: Joi.string().required(),
}).unknown(true); // Permite otras variables en el `.env`

// Validar y obtener las variables de entorno
const { error, value } = envsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Convertir valores correctamente
const envVars: EnvVars = {
    PORT: Number(value.PORT),
    HOST: value.HOST,
    GEMINI_API_KEY: value.GEMINI_API_KEY,
};

// Exportar variables de entorno
export const envs = envVars;
