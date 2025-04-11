import { Injectable } from '@nestjs/common';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

@Injectable()
export class TemplateEngineService {
  async compile(templateName: string, context: any): Promise<string> {
    try {
      // Primero intentamos buscar en la ruta relativa al directorio actual
      let templatePath = path.join(__dirname, templateName);
      
      // Si el archivo no existe, intentamos buscar en el directorio src
      if (!fs.existsSync(templatePath)) {
        templatePath = path.join(process.cwd(), 'src', 'email', 'templates', templateName);
      }
      
      // Si aún no existe, intentamos buscar en el directorio raíz del proyecto
      if (!fs.existsSync(templatePath)) {
        templatePath = path.join(process.cwd(), 'templates', templateName);
      }

      console.log(`Trying to load template from: ${templatePath}`);
      
      if (!fs.existsSync(templatePath)) {
        throw new Error(`Template ${templateName} not found at ${templatePath}`);
      }

      const template = await readFile(templatePath, 'utf-8');
      const compiledTemplate = handlebars.compile(template);
      return compiledTemplate(context);
    } catch (error) {
      console.error(`Error compilando plantilla ${templateName}: ${error.message}`);
      throw error;
    }
  }
}