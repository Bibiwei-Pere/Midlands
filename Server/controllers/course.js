// controllers/courseController.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllCoursesAdmin = async (_req, res) => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { username: true } } },
    });

    if (!courses?.length) {
      return res.status(200).json([]);
    }

    const coursesWithUser = courses.map((course) => ({
      ...course,
      username: course.user?.username || 'Unknown',
    }));

    res.json(coursesWithUser);
  } catch (error) {
    console.error('Get all courses admin error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const { category, searchQuery, durationHours, minRatings, maxPrice } = req.query;
    console.log(req.query);

    const filters = {
      status: 'Published',
    };

    if (category) filters.category = category;
    if (durationHours) filters.durationHours = { lte: parseInt(durationHours) };
    if (minRatings) filters.ratingsAverage = { gte: parseFloat(minRatings) };
    if (maxPrice) filters.price = { lte: parseFloat(maxPrice) };
    if (searchQuery) {
      filters.title = { contains: searchQuery, mode: 'insensitive' };
    }

    console.log('Filters', filters);

    const courses = await prisma.course.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
    });

    if (!courses?.length) {
      return res.status(200).json([]);
    }

    res.json(courses);
  } catch (error) {
    console.error('Get all courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllCoursesLanding = async (req, res) => {
  try {
    const filters = { status: 'Published' };
    console.log('Filters', filters);

    const courses = await prisma.course.findMany({
      where: filters,
    });

    if (!courses?.length) {
      return res.status(200).json([]);
    }

    res.json(courses);
  } catch (error) {
    console.error('Get all courses landing error:', error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    await prisma.$disconnect();
  }
};

export const getUserCourses = async (req, res) => {
  const { userId } = req.params;

  try {
    const courses = await prisma.course.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { createdAt: 'desc' },
    });

    if (!courses?.length) {
      return res.status(200).json([]);
    }

    res.json(courses);
  } catch (error) {
    console.error('Get user courses error:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
};

export const getCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
      include: { chapters: true },
    });

    if (!course) {
      return res.status(400).json({ message: 'No course found' });
    }

    res.json(course);
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
};


export const createCourse = async (req, res) => {
  const {
    userId,
    category,
    title,
    name,
    featuredImg,
    featuredVideo,
    description,
    price,
    instructor,
    chapters,
    certificate,
    commission,
    status,
    miniDescription,
    durationHours,
    selectedCourseIds,
  } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title field is required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const course = await prisma.course.create({
      data: {
        userId: parseInt(userId),
        category: category || '',
        title,
        name: name || '',
        featuredImgName: featuredImg?.name || '',
        featuredImgFileId: featuredImg?.fileId || '',
        featuredImgUrl: featuredImg?.url || '',
        featuredVideoName: featuredVideo?.name || '',
        featuredVideoFileId: featuredVideo?.fileId || null,
        featuredVideoUrl: featuredVideo?.url || '',
        description: description || '',
        certificate: certificate || '',
        price: price ? parseFloat(price) : 0,
        instructorName: instructor?.name || null,
        instructorTitle: instructor?.title || null,
        instructorDescription: instructor?.description || null,
        commission: commission ? parseFloat(commission) : 0,
        status: status || 'Archived',
        miniDescription: miniDescription || '',
        durationHours: durationHours ? parseInt(durationHours) : 1,
        selectedCourseIds: selectedCourseIds || [],
        chapters: chapters
          ? {
            create: chapters.map((chapter) => ({
              title: chapter.title || '',
              subtitle: chapter.subtitle || '',
              description: chapter.description || '',
              skills: chapter.skills || '',
              quizTitle: chapter.quizTitle || '',
              quizDescription: chapter.quizDescription || '',
              completed: chapter.completed || false,
              uploadedFiles: chapter.uploadedFiles
                ? {
                  create: chapter.uploadedFiles.map((file) => ({
                    name: file.name || '',
                    size: file.size || '',
                    type: file.type || '',
                    uniqueName: file.uniqueName || '',
                    url: file.url || '',
                    date: file.date || '',
                    title: file.title || '',
                    description: file.description || '',
                    duration: file.duration || null,
                    fileId: file.fileId || null,
                  })),
                }
                : undefined,
              questions: chapter.questions
                ? {
                  create: chapter.questions.map((question) => ({
                    question: question.question || '',
                    options: question.options || [],
                    answer: question.answer !== undefined ? parseInt(question.answer) : 0,
                  })),
                }
                : undefined,
            })),
          }
          : undefined,
      },
    });

    if (course) {
      return res.status(200).json({ message: 'New course created successfully' });
    } else {
      return res.status(400).json({ message: 'Invalid course data received' });
    }
  } catch (error) {
    console.error('Create course error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateCourse = async (req, res) => {
  const {
    userId,
    courseId,
    category,
    title,
    name,
    featuredImg,
    featuredVideo,
    certificate,
    description,
    price,
    instructor,
    chapters,
    commission,
    status,
    miniDescription,
    durationHours,
    selectedCourseIds,
  } = req.body;
  console.log(req.body);

  if (!courseId) {
    return res.status(400).json({ message: 'ID field is required' });
  }
  if (!userId) {
    return res.status(400).json({ message: 'User field is required' });
  }
  if (!durationHours) {
    return res.status(400).json({ message: 'Duration field is required' });
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
    });

    if (!course) {
      return res.status(400).json({ message: 'Course not found!' });
    }

    const updates = {};
    if (category) updates.category = category;
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (price) updates.price = parseFloat(price);
    if (durationHours) updates.durationHours = parseInt(durationHours);
    if (name) updates.name = name;
    if (featuredImg) {
      updates.featuredImgName = featuredImg.name || '';
      updates.featuredImgFileId = featuredImg.fileId || '';
      updates.featuredImgUrl = featuredImg.url || '';
    }
    if (featuredVideo) {
      updates.featuredVideoName = featuredVideo.name || '';
      updates.featuredVideoFileId = featuredVideo.fileId || null;
      updates.featuredVideoUrl = featuredVideo.url || '';
    }
    if (instructor) {
      updates.instructorName = instructor.name || null;
      updates.instructorTitle = instructor.title || null;
      updates.instructorDescription = instructor.description || null;
    }
    if (commission) updates.commission = parseFloat(commission);
    if (certificate) updates.certificate = certificate;
    if (status) updates.status = status;
    if (miniDescription) updates.miniDescription = miniDescription;
    if (selectedCourseIds) updates.selectedCourseIds = selectedCourseIds;

    if (chapters) {
      await prisma.$transaction(async (tx) => {
        const inputChapterIds = chapters
          .filter((chapter) => chapter.id)
          .map((chapter) => parseInt(chapter.id));
        await tx.chapter.deleteMany({
          where: {
            courseId: parseInt(courseId),
            id: { notIn: inputChapterIds },
          },
        });

        for (const chapter of chapters) {
          const chapterData = {
            title: chapter.title || '',
            subtitle: chapter.subtitle || '',
            description: chapter.description || '',
            skills: chapter.skills || '',
            quizTitle: chapter.quizTitle || '',
            quizDescription: chapter.quizDescription || '',
            completed: chapter.completed || false,
          };

          if (chapter.id) {
            await tx.chapter.update({
              where: { id: parseInt(chapter.id) },
              data: {
                ...chapterData,
                uploadedFiles: {
                  deleteMany: {},
                  create: chapter.uploadedFiles
                    ? chapter.uploadedFiles.map((file) => ({
                      name: file.name || '',
                      size: file.size || '',
                      type: file.type || '',
                      uniqueName: file.uniqueName || '',
                      url: file.url || '',
                      date: file.date || '',
                      title: file.title || '',
                      description: file.description || '',
                      duration: file.duration || null,
                      fileId: file.fileId || null,
                    }))
                    : [],
                },
                questions: {
                  deleteMany: {},
                  create: chapter.questions
                    ? chapter.questions.map((question) => ({
                      question: question.question || '',
                      options: question.options || [],
                      answer: question.answer !== undefined ? parseInt(question.answer) : 0,
                    }))
                    : [],
                },
              },
            });
          } else {
            await tx.chapter.create({
              data: {
                courseId: parseInt(courseId),
                ...chapterData,
                uploadedFiles: chapter.uploadedFiles
                  ? {
                    create: chapter.uploadedFiles.map((file) => ({
                      name: file.name || '',
                      size: file.size || '',
                      type: file.type || '',
                      uniqueName: file.uniqueName || '',
                      url: file.url || '',
                      date: file.date || '',
                      title: file.title || '',
                      description: file.description || '',
                      duration: file.duration || null,
                      fileId: file.fileId || null,
                    })),
                  }
                  : undefined,
                questions: chapter.questions
                  ? {
                    create: chapter.questions.map((question) => ({
                      question: question.question || '',
                      options: question.options || [],
                      answer: question.answer !== undefined ? parseInt(question.answer) : 0,
                    })),
                  }
                  : undefined,
              },
            });
          }
        }
      });
    }

    await prisma.course.update({
      where: { id: parseInt(courseId) },
      data: updates,
    });

    res.json('Course has been successfully updated');
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
    });

    if (!course) {
      return res.status(400).json({ message: 'Course not found' });
    }

    await prisma.chapter.deleteMany({
      where: { courseId: parseInt(courseId) },
    });

    await prisma.course.delete({
      where: { id: parseInt(courseId) },
    });

    res.json('Course successfully deleted');
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};