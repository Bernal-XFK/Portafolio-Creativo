import express from "express";
import { createServer as createViteServer } from "vite";
import { Client } from "@notionhq/client";
import path from "path";

// Notion Client Setup
const notion = new Client({ auth: process.env.NOTION_API_KEY || "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" });
// Force the new database ID, ignoring the stale environment variable if it matches the old one
const envDbId = process.env.NOTION_DATABASE_ID;
const DATABASE_ID = (envDbId && envDbId !== "15b7cf717aca46b58880fd78f359f3d0") ? envDbId : "44df6b1f0cc34a2da54f33fa5ecd39a4";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // API route to fetch projects from Notion
  app.get("/api/projects", async (req, res) => {
    try {
      const response = await notion.databases.query({
        database_id: DATABASE_ID,
      });

      // Map the Notion response to our portfolio format based on the new structure
      const projects = response.results.map((page: any) => {
        const props = page.properties;
        
        const title = props.Name?.title[0]?.plain_text || 'Sin título';
        const description = props.Description?.rich_text[0]?.plain_text || 'Sin descripción';
        
        // Helper to ensure URLs have https://
        const formatUrl = (url: string | undefined) => {
          if (!url) return '#';
          if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return `https://${url}`;
          }
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

      res.json(projects);
    } catch (error: any) {
      console.error("Error fetching from Notion:", error.message);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Only listen if not running as a serverless function (like on Vercel)
  if (process.env.VERCEL !== '1') {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }

  return app;
}

export const appPromise = startServer();
