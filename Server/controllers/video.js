import User from "../models/User.js";
import Video from "../models/Video.js";

export const getAllVideos = async (req, res) => {
  // Find videos and sort them by 'createdAt' in descending order
  const cousre = await Video.find().sort({ createdAt: -1 }).lean(); // Assuming 'createdAt' is the date field
  if (!cousre?.length) {
    return res.status(400).json({ message: "No cousre found" });
  }

  // Add username to each video before sending the response
  const cousreWithUser = await Promise.all(
    cousre.map(async (video) => {
      const user = await User.findById(video.user).lean().exec();
      return { ...video, username: user.username };
    })
  );

  res.json(cousreWithUser);
};

export const getVideoById = async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById(videoId).lean();
  if (!video) return res.status(400).json({ message: "No video found" });
  res.json(video);
};

export const getVideoByCategory = async (req, res) => {
  const { name } = req.params;

  try {
    const videos = await Video.find({ category: name }).lean();
    if (!videos || videos.length === 0)
      return res
        .status(404)
        .json({ message: "No videos found for this category" });

    res.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
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

  console.log("file", req.body);
  if (!category)
    return res.status(400).json({ message: "Category field is required" });
  if (!title)
    return res.status(400).json({ message: "Title field is required" });
  if (!description)
    return res.status(400).json({ message: "Description field is required" });
  if (!videoUrl)
    return res.status(400).json({ message: "Price field is required" });

  const user = await User.findById(userId).exec();
  if (!user) return res.status(400).json({ message: "User not found" });

  let rate;
  if (!rating) rate = 5;
  else rate = parseInt(rating);

  const video = await Video.create({
    user: userId,
    category,
    title,
    description,
    duration,
    videoUrl,
    views: 50,
    rating,
    isPublic,
  });

  if (video) {
    await video.save();

    return res.status(200).json({ message: "New video created successfully" });
  } else {
    return res.status(400).json({ message: "Invalid video data received" });
  }
};

export const updateVideo = async (req, res) => {
  const {
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

  const video = await Video.findById(videoId).exec();
  if (!video) return res.status(400).json({ message: "Video not found!" });

  if (category) video.category = category;
  if (title) video.title = title;
  if (description) video.description = description;
  if (videoUrl) video.videoUrl = videoUrl;
  if (description) video.description = description;
  if (views) video.views = views;
  if (duration) video.duration = duration;
  if (rating) video.rating = rating;
  if (isPublic) video.isPublic = isPublic;
  const updatedVideo = await video.save();

  res.json(`'${updatedVideo.title}' has been successfully updated`);
};

export const deleteVideo = async (req, res) => {
  const { videorId } = req.body;

  if (!videorId) {
    const result = await Video.deleteMany({});

    if (result.deletedCount > 0) res.json(`All videos deleted`);
    else res.status(400).json({ message: "No videos found to delete" });
  } else {
    const video = await Video.findById(id).exec();
    if (!video) return res.status(400).json({ message: "Video not found" });

    await video.deleteOne();
    res.json(`Video successfully deleted`);
  }
};
