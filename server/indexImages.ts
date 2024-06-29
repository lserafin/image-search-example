/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable dot-notation */
import * as dotenv from "dotenv";
import {
  Pinecone,
  type PineconeRecord,
  type ServerlessSpecCloudEnum,
} from "@pinecone-database/pinecone";
import { embedder } from "./embeddings.ts";
import { getEnv, listFiles } from "./utils/util.ts";
import { chunkedUpsert } from "./utils/chunkedUpsert.ts";

dotenv.config();

// Index setup
const indexName = getEnv("PINECONE_INDEX");
const indexCloud = getEnv("PINECONE_CLOUD") as ServerlessSpecCloudEnum;
const indexRegion = getEnv("PINECONE_REGION");
const pinecone = new Pinecone();

function* chunkArray<T>(array: T[], chunkSize: number): Generator<T[]> {
  for (let i = 0; i < array.length; i += chunkSize) {
    yield array.slice(i, i + chunkSize);
  }
}

async function embedAndUpsert({
  imagePaths,
  chunkSize,
}: {
  imagePaths: string[];
  chunkSize: number;
}) {
  // Chunk the image paths into batches of size chunkSize
  const chunkGenerator = chunkArray(imagePaths, chunkSize);

  // Get the index
  const index = pinecone.index(indexName);

  // Embed each batch and upsert the embeddings into the index
  for await (const imagePaths of chunkGenerator) {
    await embedder.embedBatch(
      imagePaths,
      chunkSize,
      async (embeddings: PineconeRecord[]) => {
        await chunkedUpsert(index, embeddings, "default");
      }
    );
  }
}

const indexImages = async () => {
  try {
    // Create the index if it doesn't already exist
    const indexList = await pinecone.listIndexes();
    if (!indexList.indexes?.some((index) => index.name === indexName)) {
      await pinecone.createIndex({
        name: indexName,
        dimension: 512,
        spec: { serverless: { region: indexRegion, cloud: indexCloud } },
        waitUntilReady: true,
      });
    }

    await embedder.init("Xenova/clip-vit-base-patch32");
    const imagePaths = await listFiles("./logos");
    await embedAndUpsert({ imagePaths, chunkSize: 100 });
    return;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export { indexImages };
