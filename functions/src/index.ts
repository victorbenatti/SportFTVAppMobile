import { onObjectFinalized } from "firebase-functions/v2/storage";
import * as admin from "firebase-admin";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";
import * as logger from "firebase-functions/logger";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ffmpeg = require("fluent-ffmpeg");

admin.initializeApp();

export const gerarThumbnail = onObjectFinalized({
  region: "southamerica-east1",
  timeoutSeconds: 300,
  memory: "1GiB",
}, async (event) => {
  const object = event.data;
  const fileBucket = object.bucket;
  const filePath = object.name;
  const contentType = object.contentType;

  // ---- 1. Validação (LÓGICA CORRIGIDA) ----

  if (!filePath) {
    logger.warn("Caminho do arquivo indefinido, saindo.");
    return;
  }

  // VALIDAÇÃO 1: A função SÓ deve rodar para arquivos na pasta 'videos_replays'.
  // Se não estiver lá, ignora e para a execução.
  if (!filePath.startsWith("videos_replays/")) {
    logger.log(`Arquivo ${filePath} não está na pasta 'videos_replays', ignorando.`);
    return;
  }

  // VALIDAÇÃO 2: Garante que o arquivo é um vídeo.
  if (!contentType?.startsWith("video/")) {
    logger.log(`Arquivo ${filePath} não é um vídeo, ignorando.`);
    return;
  }

  // VALIDAÇÃO 3: Garante que não vamos processar nossas próprias thumbnails.
  // Esta validação foi movida para depois da checagem da pasta.
  // E a duplicada foi removida.
  // OBS: Esta checagem não é estritamente necessária por causa da validação 1, mas é uma boa prática.
  if (filePath.includes("thumb_")) {
      logger.log("O arquivo já é uma thumbnail, ignorando.");
      return;
  }
  
  // ---- O resto do código continua igual ----

  const bucket = admin.storage().bucket(fileBucket);
  const fileName = path.basename(filePath);
  const tempFilePath = path.join(os.tmpdir(), fileName);
  const thumbnailFileName = `thumb_${path.parse(fileName).name}.jpg`;
  const tempThumbnailPath = path.join(os.tmpdir(), thumbnailFileName);
  const thumbnailUploadPath = `thumbnails/${thumbnailFileName}`;

  try {
    await bucket.file(filePath).download({ destination: tempFilePath });
    logger.log("Vídeo baixado para:", tempFilePath);

    await new Promise<void>((resolve, reject) => {
      ffmpeg(tempFilePath)
        .on("end", () => {
          logger.log("Thumbnail gerada com sucesso.");
          resolve();
        })
        .on("error", (err: Error) => {
          logger.error("Erro no FFmpeg:", err);
          reject(err);
        })
        .screenshots({
          timestamps: ["00:00:01.000"],
          filename: thumbnailFileName,
          folder: os.tmpdir(),
          size: "1280x720",
        });
    });

    await bucket.upload(tempThumbnailPath, {
      destination: thumbnailUploadPath,
      metadata: { contentType: "image/jpeg" },
    });
    logger.log("Thumbnail enviada para o Storage.");

    const videoId = path.parse(fileName).name;
    const firestore = admin.firestore();
    const videoDocRef = firestore.collection("videos").doc(videoId);

    const file = bucket.file(thumbnailUploadPath);
    await file.makePublic();
    const thumbnailUrl = file.publicUrl();

    await videoDocRef.update({ thumbnailUrl: thumbnailUrl });
    logger.log(`Documento ${videoId} no Firestore atualizado!`);
  } catch (error) {
    logger.error("Ocorreu um erro geral na função:", error);
  } finally {
    if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
    if (fs.existsSync(tempThumbnailPath)) fs.unlinkSync(tempThumbnailPath);
  }
});