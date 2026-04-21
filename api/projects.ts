import { Client } from "@notionhq/client";
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Notion Client Setup
const NOTION_KEY = process.env.NOTION_API_KEY || "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";
const envDbId = process.env.NOTION_DATABASE_ID;
// Si el ID en el entorno es el antiguo o no existe, usamos el nuevo por defecto
const DATABASE_ID = (envDbId && envDbId !== "15b7cf717aca46b58880fd78f359f3d0") ? envDbId : "44df6b1f0cc34a2da54f33fa5ecd39a4";

const notion = new Client({ auth: NOTION_KEY });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Solo se permiten peticiones GET' });
  }

  try {
    // Validar configuración mínima
    if (!NOTION_KEY || NOTION_KEY.startsWith("MY_")) {
      throw new Error("NOTION_API_KEY no está configurada correctamente en Vercel.");
    }

    const response = await notion.databases.query({
      database_id: DATABASE_ID,
    });

    const projects = response.results.map((page: any) => {
      const props = page.properties;
      
      const title = props.Name?.title[0]?.plain_text || 'Sin título';
      const description = props.Description?.rich_text[0]?.plain_text || 'Sin descripción';
      
      const formatUrl = (url: string | undefined) => {
        if (!url) return '#';
        if (!url.startsWith('http')) return `https://${url}`;
        return url;
      };

      const image = formatUrl(props.Image?.url) !== '#' ? formatUrl(props.Image?.url) : 'https://picsum.photos/seed/project/800/600';
      const demo = formatUrl(props.Demo?.url);
      const github = formatUrl(props.Github?.url);
      
      const tech = props.Tech?.multi_select?.map((t: any) => t.name) || [];
      const stars = props.Stars?.number || 0;

      return {
        id: page.id,
        title,
        description,
        image,
        demo,
        github,
        tech,
        stars
      };
    });

    // Cache por 1 minuto
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return res.status(200).json(projects);
  } catch (error: any) {
    console.error("Notion Fetch Error:", error);
    
    // Devolvemos un mensaje de error más descriptivo para el frontend
    let message = "Error al conectar con Notion.";
    if (error.code === 'object_not_found') message = "Base de datos de Notion no encontrada. Revisa el ID.";
    if (error.code === 'unauthorized') message = "Llave de API de Notion inválida.";
    
    return res.status(500).json({ 
      error: message,
      details: error.message,
      code: error.code
    });
  }
}
