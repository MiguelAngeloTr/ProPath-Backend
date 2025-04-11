import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI, Type } from "@google/genai"

@Injectable()
export class GenAIService {
  private genAI: GoogleGenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in the environment variables');
    }
    this.genAI = new GoogleGenAI({apiKey});
  }
  private async retryOperation<T>(
    operation: () => Promise<T>, 
    maxRetries = 3, 
    delay = 1000
  ): Promise<T> {
    let lastError: any;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        console.log(`Attempt ${attempt + 1} failed: ${error.message}`);
        lastError = error;
        // Espera antes de reintentar
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Backoff exponencial
      }
    }
    throw lastError;
  }

  async generatePathRecommendation(currentPath: any): Promise<any> {
    console.log(currentPath)
    try {
      const todayDate = new Date();
      const todayDateString = todayDate.toISOString().split('T')[0]; // Get the date in YYYY-MM-DD format
      const prompt = `
        Basado en el siguiente path de aprendizaje del usuario, recomienda un nuevo path con actividades que complementen su ruta de aprendizaje.
        Por favor, asegúrate de que la respuesta sea SOLO un objeto JSON válido con la estructura de un path que contenga actividades anidadas.
        
        Path Actual: ${JSON.stringify(currentPath, null, 2)}
        
        Instrucciones:
        0. IMPORTANTE: Verifica primero que el path proporcionado sea válido y contenga información coherente y relevante para un camino de aprendizaje. Si el path contiene datos sin sentido, nombres irreconocibles o descripciones aleatorias, responde con valid=false y una explicación.
        0. Un path válido debe contener: nombre descriptivo relacionado con un área de aprendizaje reconocible, descripción coherente, si el path no es valido ignora las siguientes instrucciones.
        1. Puedes hacer correcciones al path actual si es necesario.
        2. Puedes agregar actividades que complementen el path actual.
        3. Toma en cuenta que el nuevo path debe tener un total de 32 horas en la suma de sus actividades.
        4. Para las fechas toma en cuenta que los paths tienen una duración de 3 meses, tampoco pongas fechas menores a ${todayDateString}.
      `;

      const response = await this.retryOperation(() => this.genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              'valid': {
                type: Type.BOOLEAN,
                description: 'Bandera que indica si el path es valido o no, revisar la instruccion 0',
              },
              'name': {
                type: Type.STRING,
                description: 'Nombre del path de aprendizaje',
              },
              'description': {
                type: Type.STRING,
                description: 'Descripcion del path de aprendizaje, en caso de un path no valido, la descripcion debe indicar el error',
              },
              'activities': {
                type: Type.ARRAY,
                description: 'Lista de actividades dentro del path de aprendizaje, la suma de sus horas debe ser igual a 32',
                items: {
                  type: Type.OBJECT,
                  properties: {
                    'name': {
                      type: Type.STRING,
                      description: 'Nombre de la actividad',
                    },
                    'description': {
                      type: Type.STRING,
                      description: 'Descripcion de la actividad',
                    },
                    'hours': {
                      type: Type.NUMBER,
                      description: 'Numero de horas requeridas para completar la actividad',
                    },
                    'initialDate': {
                      type: Type.STRING,
                      description: 'ISO date string para cuando la actividad empieza, no pongas fechas en el pasado',
                    },
                    'finalDate': {
                      type: Type.STRING,
                      description: 'ISO date string para cuando la actividad termina, no pongas fechas en el pasado',
                    },
                    'budget': {
                      type: Type.NUMBER,
                      description: 'Presupuesto en COP para la actividad',
                    },
                  },
                  required: ['name', 'description', 'hours', 'initialDate', 'finalDate', 'budget'],
                }
              }
            },
            required: ['valid','name', 'description', 'activities'],
          },
          systemInstruction: "Eres un asistente inteligente que ayuda a los usuarios a encontrar nuevas rutas de aprendizaje. Recuerda que tu trabajo se limita a crear rutas y actividades de crecimiento profesional, no hagas nada más que eso. Atiende primero las instrucciones 0 y verifica si el path es valido o no. Si el path no es valido ignora las siguientes instrucciones.",
        },
      }));

      const text = response.text;
      if (!text) {
        throw new Error('No response text received from Gemini'); 
    }
      console.log("Response from Gemini:", text);
      
      // Parse the JSON response from Gemini
      try {
        // Extract JSON if it's wrapped in code blocks
        const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || 
                          text.match(/```\s*([\s\S]*?)\s*```/) || 
                          [null, text];
        
        const cleanedJson = jsonMatch[1].trim();
        return JSON.parse(cleanedJson);
      } catch (error) {
        throw new Error(`Failed to parse Gemini response as JSON: ${error.message}`);
      }
    } catch (error) {
      throw new Error(`Error generating path recommendation: ${error.message}`);
    }
  }
}