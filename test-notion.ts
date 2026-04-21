import { Client } from "@notionhq/client";

const notion = new Client({ auth: "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" });
const DATABASE_ID = "44df6b1f0cc34a2da54f33fa5ecd39a4";

async function test() {
  try {
    const response = await notion.databases.query({ database_id: DATABASE_ID });
    console.log("SUCCESS! Found", response.results.length, "items.");
    if (response.results.length > 0) {
      console.log("First item properties:", JSON.stringify(response.results[0].properties, null, 2));
    }
  } catch (e: any) {
    console.error("ERROR:", e.message);
  }
}
test();
