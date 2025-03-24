
import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {

    PORT: number;
    PATH_MICROSERVICE_HOST: string;
    PATH_MICROSERVICE_PORT: number;
    //user
    USER_MICROSERVICE_HOST: string;
    USER_MICROSERVICE_PORT: number;
    
  
    

}


//Validador de schema : Asegura de que si el puerto no viene lance una excepcion si no tengo un puerto 

const envsSchema = joi.object({
    
    PORT: joi.number().required(),
    PATH_MICROSERVICE_HOST: joi.string().required(),
    PATH_MICROSERVICE_PORT: joi.number().required(),
    //user
    USER_MICROSERVICE_HOST: joi.string().required(),
    USER_MICROSERVICE_PORT: joi.number().required()


})
.unknown(true); // Ignora cualquier otra variable que no este en el schema

const {error,value}= envsSchema.validate(process.env); //desestructura el resultado de la validacion
if (error) { // Si hay un error lanza una excepcion
    throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs={
    PORT: envVars.PORT,
    pathMicroserviceHost: envVars.PATH_MICROSERVICE_HOST,
    pathMicroservicePort: envVars.PATH_MICROSERVICE_PORT,
    //user
    UserMicroserviceHost: envVars.USER_MICROSERVICE_HOST,
    UserMicroservicePort: envVars.USER_MICROSERVICE_PORT

}