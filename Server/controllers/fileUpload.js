import B2 from "backblaze-b2";
import { v4 as uuidv4 } from "uuid"; // You can install this with npm: npm install uuid
import Course from "../models/Course.js"; // Import the Course model
import path from "path";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const { BACKBAZE_KEY_ID, BACKBAZE_BUCKET_ID, BACKBAZE_KEY, BACKBAZE_KEY_NAME } = process.env;

const b2 = new B2({
  applicationKeyId: BACKBAZE_KEY_ID, // Backblaze Key ID
  applicationKey: BACKBAZE_KEY, // Backblaze Application Key
});

export const uploadFileToB2 = async (file) => {
  try {
    // Authorize with B2
    await b2.authorize();

    // Get the original file extension (e.g., .png, .jpg)
    const ext = path.extname(file.originalname);

    // Generate a unique identifier (e.g., using UUID)
    const uniqueId = uuidv4();

    // Combine the unique ID with the original name to create a unique filename
    const uniqueName = `${path.basename(file.originalname, ext)}_${uniqueId}${ext}`;

    // Get upload URL for your Backblaze bucket
    const uploadUrlResponse = await b2.getUploadUrl({
      bucketId: BACKBAZE_BUCKET_ID,
    });
    const { uploadUrl, authorizationToken } = uploadUrlResponse.data;

    // Upload file to B2 with the unique filename
    const uploadResponse = await b2.uploadFile({
      uploadUrl,
      uploadAuthToken: authorizationToken,
      fileName: uniqueName, // Using the unique file name
      data: file.buffer, // File data from the buffer
    });

    // Generate the signed URL for accessing the file (if private)
    const signedUrl = await generateSignedUrl(uniqueName);

    return {
      success: true,
      signedUrl, // Return the signed URL
      fileId: uploadResponse.data.fileId, // Also return the file ID
      uniqueName, // Return the unique file name
    };
  } catch (error) {
    console.error("Error uploading file to Backblaze:", error);
    return {
      success: false,
      error: "Upload failed",
    };
  }
};

// Regenerate signed URL based on file name
export const regenerateSignedUrl = async (req, res) => {
  const { fileName } = req.params;
  try {
    const signedUrl = await generateSignedUrl(fileName); // Your signed URL logic
    return res.json({ signedUrl });
  } catch (error) {
    console.error("Error regenerating signed URL:", error);
    return res.status(500).json({ error: "Failed to regenerate signed URL" });
  }
};

export const generateSignedUrl = async (fileName) => {
  try {
    // Authorize with Backblaze
    await b2.authorize();

    // Set expiration to 25 hours
    const expiresIn = 90000; // Expiration in seconds (25 hours)
    const downloadAuthResponse = await b2.getDownloadAuthorization({
      bucketId: BACKBAZE_BUCKET_ID,
      fileNamePrefix: fileName, // The file name for which the authorization is requested
      validDurationInSeconds: expiresIn, // Validity duration
    });

    const downloadAuthToken = downloadAuthResponse.data.authorizationToken;

    // Construct the signed URL for the private file
    const signedUrl = `https://f005.backblazeb2.com/file/${BACKBAZE_KEY_NAME}/${fileName}?Authorization=${downloadAuthToken}`;

    return signedUrl;
  } catch (error) {
    console.error("Error generating signed URL:", error.message);
    throw error;
  }
};



export const deleteFileFromB2 = async (req, res) => {
  const { fileName, fileId, courseId, fileType } = req.body; // Include courseId and fileType in the request body
  console.log(req.body);

  if (!fileType) {
    return res.status(400).json({ message: 'File type is required' });
  }

  try {
    // Delete file from Backblaze B2 if fileName and fileId are provided
    if (fileName && fileId) {
      await b2.authorize();
      await b2.deleteFileVersion({
        fileName,
        fileId,
      });
    }

    // Prepare update data based on fileType
    let updateData = {};

    if (fileType === 'featuredImg') {
      updateData = {
        featuredImgName: '',
        featuredImgFileId: '',
        featuredImgUrl: '',
      };
    } else if (fileType === 'featuredVideo') {
      updateData = {
        featuredVideoName: '',
        featuredVideoFileId: '',
        featuredVideoUrl: '',
      };
    } else if (fileType === 'uploadedFiles') {
      // Fetch the course to get current chapters
      const course = await prisma.course.findUnique({
        where: { id: parseInt(courseId) },
        include: { chapters: true },
      });

      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      // Update chapters by filtering out the file with matching fileId
      const updatedChapters = course.chapters.map((chapter) => ({
        ...chapter,
        uploadedFiles: chapter.uploadedFiles?.filter((file) => file.fileId !== fileId) || [],
      }));

      updateData = {
        chapters: {
          set: updatedChapters.map((chapter) => ({
            id: chapter.id,
            ...chapter,
          })),
        },
      };
    }

    // Update the course in the database
    await prisma.course.update({
      where: { id: parseInt(courseId) },
      data: updateData,
    });

    // Return success response
    return res.json({
      success: true,
      message: 'File successfully deleted from Backblaze and course.',
    });
  } catch (error) {
    console.error('Error deleting file from Backblaze or course:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete file from Backblaze or course.',
    });
  }
};
