import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllVideos = async (req, res) => {
  try {
    // Find videos with user information included
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    if (!videos?.length) {
      return res.status(400).json({ message: "No videos found" });
    }

    // Format the response to match the original structure
    const videosWithUser = videos.map(video => ({
      ...video,
      userId: video.user.id
    }));

    res.json(videosWithUser);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getVideoById = async (req, res) => {
  const { videoId } = req.params;

  try {
    const video = await prisma.video.findUnique({
      where: { id: parseInt(videoId) }
    });

    if (!video) return res.status(400).json({ message: "No video found" });
    res.json(video);
  } catch (error) {
    console.error("Error fetching video:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getVideoByCategory = async (req, res) => {
  const { name } = req.params;

  try {
    const videos = await prisma.video.findMany({
      where: { category: name }
    });

    if (!videos || videos.length === 0) {
      return res.status(404).json({ message: "No videos found for this category" });
    }

    res.json(videos);
  } catch (error) {
    console.error("Error fetching videos by category:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const createVideo = async (req, res) => {
  const {
    userId,
    category,
    title,
    description,
    duration,
    videoUrl,
    rating,
    isPublic,
  } = req.body;

  if (!category)
    return res.status(400).json({ message: "Category field is required" });
  if (!title)
    return res.status(400).json({ message: "Title field is required" });
  if (!description)
    return res.status(400).json({ message: "Description field is required" });
  if (!videoUrl)
    return res.status(400).json({ message: "Video URL field is required" });

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!user) return res.status(400).json({ message: "User not found" });

    const rate = rating ? parseInt(rating) : 5;

    const video = await prisma.video.create({
      data: {
        userId: parseInt(userId),
        category,
        title,
        description,
        duration,
        videoUrl,
        views: 50,
        rating: rate,
        isPublic,
      }
    });

    return res.status(200).json({ message: "New video created successfully" });
  } catch (error) {
    console.error("Error creating video:", error);
    return res.status(400).json({ message: "Invalid video data received" });
  }
};

export const updateVideo = async (req, res) => {
  const {
    videoId,
    userId,
    category,
    title,
    description,
    duration,
    videoUrl,
    views,
    rating,
    isPublic,
  } = req.body;

  if (!videoId)
    return res.status(400).json({ message: "ID field is required" });
  if (!userId)
    return res.status(400).json({ message: "User field is required" });

  try {
    const video = await prisma.video.findUnique({
      where: { id: parseInt(videoId) }
    });

    if (!video) return res.status(400).json({ message: "Video not found!" });

    const updatedVideo = await prisma.video.update({
      where: { id: parseInt(videoId) },
      data: {
        category: category || video.category,
        title: title || video.title,
        description: description || video.description,
        videoUrl: videoUrl || video.videoUrl,
        views: views || video.views,
        duration: duration || video.duration,
        rating: rating || video.rating,
        isPublic: isPublic !== undefined ? isPublic : video.isPublic,
      }
    });

    res.json(`'${updatedVideo.title}' has been successfully updated`);
  } catch (error) {
    console.error("Error updating video:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteVideo = async (req, res) => {
  const { videoId } = req.body;

  try {
    if (!videoId) {
      const result = await prisma.video.deleteMany({});

      if (result.count > 0) {
        res.json(`All videos deleted`);
      } else {
        res.status(400).json({ message: "No videos found to delete" });
      }
    } else {
      const video = await prisma.video.findUnique({
        where: { id: parseInt(videoId) }
      });

      if (!video) return res.status(400).json({ message: "Video not found" });

      await prisma.video.delete({
        where: { id: parseInt(videoId) }
      });

      res.json(`Video successfully deleted`);
    }
  } catch (error) {
    console.error("Error deleting video:", error);
    return res.status(500).json({ message: "Server error" });
  }
};