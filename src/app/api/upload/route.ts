import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Convert File to base64 data URL
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString("base64");
        const dataURI = `data:${file.type};base64,${base64}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: "campusshare",
            resource_type: "image",
        });

        return NextResponse.json({
            url: result.secure_url,
            public_id: result.public_id,
        }, { status: 200 });
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
