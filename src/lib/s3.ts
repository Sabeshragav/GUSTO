import {
    S3Client,
    PutObjectCommand,
} from "@aws-sdk/client-s3";

let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
    if (!s3Client) {
        s3Client = new S3Client({
            region: process.env.AWS_S3_REGION || "ap-south-1",
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
            },
        });
    }
    return s3Client;
}

export async function uploadToS3(
    buffer: Buffer,
    fileName: string,
    contentType: string
): Promise<string> {
    const bucket = process.env.AWS_S3_BUCKET;
    if (!bucket) {
        throw new Error("AWS_S3_BUCKET environment variable is not set");
    }

    const key = `payment-screenshots/${Date.now()}_${fileName}`;

    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
    });

    const client = getS3Client();
    await client.send(command);

    const region = process.env.AWS_S3_REGION || "ap-south-1";
    return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}
