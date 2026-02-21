import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.APP_AWS_S3_REGION!,
    credentials: {
        accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY!,
    },
});

const BUCKET = process.env.APP_AWS_S3_BUCKET!;

/**
 * Build the deterministic S3 URL for a payment screenshot without uploading.
 */
export function buildS3Url(
    category: string,
    userId: string,
    ext: string,
): string {
    return `https://${BUCKET}.s3.${process.env.APP_AWS_S3_REGION}.amazonaws.com/${category}/${userId}/payment.${ext}`;
}

/**
 * Upload a file to S3.
 * For payments: category='payments', key = payments/{userId}/payment.{ext}
 */
export async function uploadToS3(
    buffer: Buffer,
    fileName: string,
    contentType: string,
    category: "payments",
    userId: string,
): Promise<void> {
    const ext = fileName.split(".").pop() || "png";
    const key = `${category}/${userId}/payment.${ext}`;

    s3Client.send(
        new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            Body: buffer,
            ContentType: contentType,
        }),
    );
}
