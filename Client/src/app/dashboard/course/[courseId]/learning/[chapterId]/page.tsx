"use client";
import React, { useState, useEffect, useRef } from "react";
import { SkeletonCard2 } from "@/components/ui/skeleton";
import { ContainerDashboard, DashboardHeader } from "@/components/ui/containers";
import ReactPlayer from "react-player/lazy";
import { useGetCourse } from "@/hooks/course";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpenTextIcon, ChevronLeft, ChevronRight, Pause, PencilLine, Play, PlayCircle, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { AiOutlineFileWord } from "react-icons/ai";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Review } from "@/app/components/dashboard/Reviews";
import { Button } from "@/components/ui/button";
import { useGetUser } from "@/hooks/users";
import { useToast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";
import { Progress2 } from "@/components/ui/progress";
import { FaBackward, FaForward } from "react-icons/fa6";

const LearningPage = ({ params }: any) => {
  const { courseId, chapterId } = params;
  const router = useRouter();
  const [data, setData] = useState<any>({});
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false); // Track full-screen mode for PDF
  const course = useGetCourse(courseId);
  const chapters = course?.data?.chapters || [];
  const { toast } = useToast();
  const { data: user } = useGetUser();

  // Video Player State
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const playerRef = useRef<ReactPlayer | null>(null);

  useEffect(() => {
    if (chapters.length > 0) {
      if (chapterId !== "chapter") {
        if (currentChapterIndex > 0) {
          if (chapters[currentChapterIndex]?.uploadedFiles?.length > 0) {
            setData(chapters[currentChapterIndex].uploadedFiles[0]);
          }
        } else {
          setData(chapters[0].uploadedFiles[0]);
          setActiveFile(chapters[0].uploadedFiles[0].name);
        }
      } else if (chapters[0].uploadedFiles.length > 0) {
        // Default case when chapterId is "chapter"
        setData(chapters[0].uploadedFiles[0]);
        setActiveFile(chapters[0].uploadedFiles[0].name);
      }
    }
  }, [chapters, chapterId]);

  const toggleFullScreenPDF = () => setIsFullScreen((prev) => !prev);

  const handlePlayPause = () => setPlaying(!playing);

  const handleProgress = (state: { playedSeconds: number }) => {
    setPlayedSeconds(state.playedSeconds);
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handleSeek = (seconds: number) => {
    playerRef.current?.seekTo(seconds, "seconds");
    setPlayedSeconds(seconds);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleNext = () => {
    const chapter = chapters[currentChapterIndex];
    const nextChapter = chapters[currentChapterIndex + 1];
    const isCompleted = user?.activeCourseList
      ?.find((course: any) => course.courseId === courseId)
      ?.chapters?.find((ch: any) => ch.chapterId === chapter._id)?.completed;

    if (!chapter || !isCompleted)
      return toast({
        variant: "destructive",
        title: "Permission denied.",
        description: "Please complete the previous chapter to access this one.",
      });
    console.log(chapter);
    console.log(nextChapter);
    const { uploadedFiles, quiz } = chapter;

    if (currentFileIndex === uploadedFiles.length - 1) {
      if (quiz) {
        const encodedTitle = encodeURIComponent(quiz.title);
        router.push(`${nextChapter ? nextChapter._id : "chapter"}quiz/${encodedTitle}`);
        return;
      } else if (currentChapterIndex < chapters.length - 1) {
        setCurrentChapterIndex(currentChapterIndex + 1);
        setCurrentFileIndex(0);
        setData(chapters[currentChapterIndex + 1].uploadedFiles[0]);
        setActiveFile(chapters[currentChapterIndex + 1].uploadedFiles[0].name);
        return;
      }
    } else {
      setCurrentFileIndex(currentFileIndex + 1);
      setData(uploadedFiles[currentFileIndex + 1]);
      setActiveFile(uploadedFiles[currentFileIndex + 1].name);
    }
  };

  const handlePrevious = () => {
    if (currentFileIndex > 0) {
      setCurrentFileIndex(currentFileIndex - 1);
      setData(chapters[currentChapterIndex].uploadedFiles[currentFileIndex - 1]);
      setActiveFile(chapters[currentChapterIndex].uploadedFiles[currentFileIndex - 1].name);
    } else if (currentChapterIndex > 0) {
      const previousChapter = chapters[currentChapterIndex - 1];
      setCurrentChapterIndex(currentChapterIndex - 1);
      setCurrentFileIndex(previousChapter.uploadedFiles.length - 1);
      setData(previousChapter.uploadedFiles[previousChapter.uploadedFiles.length - 1]);
      setActiveFile(previousChapter.uploadedFiles[previousChapter.uploadedFiles.length - 1].name);
    }
  };

  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    // Calculate the progress value
    const chapters = user?.activeCourseList[0]?.chapters;
    if (chapters && chapters.length > 0) {
      // Count the chapters with completed: true
      const completedChapters = chapters.filter((chapter: any) => chapter.completed).length;
      const progressPercentage = (completedChapters / chapters.length) * 100;
      setProgressValue(progressPercentage);
    }

    // Set current chapter index based on chapterId
    const matchedChapterIndex = chapters?.findIndex((chapter: any) => chapter.chapterId === chapterId);
    if (matchedChapterIndex !== -1) {
      setCurrentChapterIndex(matchedChapterIndex);
    }
  }, [user, chapterId]);

  const renderContent = () => {
    const fileUrl = data?.url;
    console.log(data);
    console.log(fileUrl);
    if (!fileUrl) return null;

    const fileExtension = data?.type;
    if (fileExtension === "mp4" || fileExtension === "URL") {
      return (
        <div
          style={{
            height: isFullScreen ? "100vh" : "538px",
            width: isFullScreen ? "100vw" : "100%",
            position: isFullScreen ? "fixed" : "relative",
            top: 0,
            left: 0,
            zIndex: isFullScreen ? 1000 : "auto",
          }}
          className='relative h-[400px] sm:h-[600px] overflow-hidden group'
        >
          <button
            onClick={toggleFullScreenPDF}
            className='absolute z-10 hover:text-yellow-500 top-2 right-2 px-4 py-2 bg-gray-800 text-white rounded-md'
          >
            {isFullScreen ? "Exit Full Screen" : "Full Screen"}
          </button>
          <div className='relative w-full h-full'>
            <ReactPlayer
              ref={playerRef}
              url={fileUrl}
              playing={playing}
              controls={false} // Hide native controls for custom controls
              onProgress={handleProgress}
              onDuration={handleDuration}
              width='100%'
              height='100%'
              config={{
                youtube: {
                  playerVars: {
                    modestbranding: 1,
                    controls: 0,
                    rel: 0,
                    fs: 0,
                    iv_load_policy: 3,
                    showinfo: 0,
                  },
                },
              }}
            />
            <button
              onClick={handlePlayPause}
              className={`absolute inset-0 flex items-center justify-center bg-transparent bg-opacity-50 ${
                playing ? "hidden group-hover:flex" : "flex"
              }`}
            >
              {playing ? (
                <Pause className='text-yellow-500 h-10 w-10' />
              ) : (
                <Play className='text-yellow-500 h-10 w-10' />
              )}
            </button>
          </div>
          <div className='absolute bottom-0 left-0 right-0 flex flex-col items-center space-y-2 bg-white p-3 rounded-lg'>
            <div className='flex gap-6 w-full'>
              <button onClick={handlePlayPause}>
                {playing ? (
                  <Pause fill='#656565' className='text-gray-500 h-6 w-6' />
                ) : (
                  <Play fill='#656565' className='text-gray-500 h-6 w-6' />
                )}
              </button>
              <div className='flex gap-2 items-center'>
                <FaBackward
                  onClick={() => handleSeek(playedSeconds - 10)}
                  className='text-gray-500 hover:text-yellow-500 cursor-pointer w-6 h-6'
                />
                <p className='text-gray-700 text-sm'>10x</p>
                <FaForward
                  onClick={() => handleSeek(playedSeconds + 10)}
                  className='text-gray-500 hover:text-yellow-500 cursor-pointer w-6 h-6'
                />
              </div>
              <div className='w-full flex flex-col items-center'>
                <Slider
                  value={[playedSeconds]}
                  max={duration}
                  step={1}
                  onValueChange={(value) => handleSeek(value[0])} // The slider returns an array, so take the first element
                  className='w-full rounded-full bg-gray-500'
                />
                <div className='flex justify-between w-full text-black text-sm mt-1'>
                  <span>{formatTime(playedSeconds)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (fileExtension === "pdf") {
      return (
        <div
          style={{
            height: isFullScreen ? "100vh" : "538px",
            width: isFullScreen ? "100vw" : "100%",
            position: isFullScreen ? "fixed" : "relative",
            top: 0,
            left: 0,
            zIndex: isFullScreen ? 1000 : "auto",
          }}
        >
          <iframe
            src={`${fileUrl}#toolbar=0`}
            // type='application/pdf'
            width='100%'
            height='100%'
            style={{ border: "none" }}
          ></iframe>
          <button
            onClick={toggleFullScreenPDF}
            className='absolute hover:text-yellow-500 top-2 right-2 px-4 py-2 bg-gray-800 text-white rounded-md'
          >
            {isFullScreen ? "Exit Full Screen" : "Full Screen"}
          </button>
        </div>
      );
    } else if (fileExtension === "docx") {
      return (
        <div className='flex flex-col items-center gap-4'>
          <AiOutlineFileWord className='text-6xl text-blue-500' />
          <p>Download Word Document:</p>
          <a href={fileUrl} download className='text-blue-500 underline'>
            {data?.title || "Download"}
          </a>
        </div>
      );
    } else {
      return (
        <div className='text-red-500'>
          Unsupported file format. Please{" "}
          <a href={fileUrl} download>
            download the file
          </a>
          .
        </div>
      );
    }
  };
  console.log(user?.activeCourseList);
  if (course?.status !== "success") return <SkeletonCard2 />;
  else
    return (
      <>
        <DashboardHeader className='pb-4'>
          <h2>Courses</h2>

          {/* Full button layout for large screens */}
          <div className='hidden lg:flex gap-5 justify-between'>
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
              <AlertDialogTrigger asChild>
                <Button variant={"buy"}>Review</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <Review data={course?.data} setIsOpen={setIsOpen} />
              </AlertDialogContent>
            </AlertDialog>

            <Button
              variant={"outline"}
              onClick={handlePrevious}
              disabled={currentChapterIndex === 0 && currentFileIndex === 0}
            >
              Previous
            </Button>
            <Button variant={"outline"} onClick={handleNext}>
              Next
            </Button>
          </div>

          {/* Icon layout for mobile */}
          <div className='flex items-center lg:hidden gap-3'>
            <button
              className='rounded-full hover:border-white w-9 h-9 border border-yellow-500'
              onClick={handlePrevious}
              disabled={currentChapterIndex === 0 && currentFileIndex === 0}
            >
              <ChevronLeft className='hover:text-white w-8 text-yellow-500 h-7' />
            </button>

            <button onClick={() => setIsOpen(true)}>
              <Star size={24} className='text-yellow-500' />
            </button>

            <button className='rounded-full hover:border-white w-9 h-9 border border-yellow-500' onClick={handleNext}>
              <ChevronRight className='hover:text-white w-8 text-yellow-500 h-8' />
            </button>
          </div>

          <ContainerDashboard className='absolute left-0 top-[50px] md:top-[40px] w-full'>
            <Progress2 value={progressValue} className='' />
          </ContainerDashboard>
        </DashboardHeader>
        <ContainerDashboard>
          <div className='grid grid-flow-row lg:grid-cols-[306px,auto] gap-5 bg-black p-5'>
            <div className='flex flex-col gap-4 lg:border-r border-gray-800'>
              <h4 className='text-yellow-500'>Course Content</h4>
              <Accordion
                defaultValue={chapterId === "chapter" ? chapters[0] : chapterId}
                type='single'
                collapsible
                className='bg-black mt-5 pr-5 border-t border-gray-800 w-full'
              >
                {chapters.map((item: any, index: number) => {
                  const isCompleted = !!user?.activeCourseList
                    ?.find((course: any) => course.courseId === courseId)
                    ?.chapters?.find((ch: any) => ch.chapterId === item._id)?.completed;

                  return (
                    <AccordionItem value={item?._id} key={index} className='p-0'>
                      <AccordionTrigger className={`${currentChapterIndex === index && "text-yellow-500"}`}>
                        Module {index + 1}: {item.details?.title || "Untitled"}
                      </AccordionTrigger>
                      <AccordionContent className='p-0 m-0'>
                        {item?.uploadedFiles?.map((file: any) => (
                          <li
                            key={file.name}
                            onClick={() => {
                              if (isCompleted) {
                                setData(file);
                                setActiveFile(file.name);
                                setCurrentChapterIndex(index);
                                setCurrentFileIndex(item.uploadedFiles.indexOf(file));
                              } else {
                                toast({
                                  variant: "destructive",
                                  title: "Permission denied.",
                                  description: "Please complete the previous chapter to access this one.",
                                });
                              }
                            }}
                            className={`border-t cursor-pointer border-gray-800 py-2 ${
                              activeFile === file.name ? "text-yellow-500" : "hover:text-yellow-500"
                            }`}
                          >
                            {file.title}
                            <span className='flex items-center gap-3'>
                              {file?.type === "mp4" || file?.type === "URL" ? (
                                <PlayCircle fill='#FFBE00' className='text-black' />
                              ) : file?.type === "pdf" ? (
                                <BookOpenTextIcon fill='#FFBE00' className='text-black' />
                              ) : (
                                <PencilLine fill='#FFBE00' className='text-black' />
                              )}
                              {file?.type === "mp4" || file?.type === "URL" ? (
                                <p>{file.duration || "0:00"}m</p>
                              ) : (
                                <p className='uppercase'>{file?.type}</p>
                              )}
                            </span>
                          </li>
                        ))}

                        {isCompleted && item.quiz && (
                          <li
                            onClick={() =>
                              router.push(
                                `${
                                  chapters[currentChapterIndex + 1] ? chapters[currentChapterIndex + 1]._id : "chapter"
                                }/quiz/${encodeURIComponent(item.quiz.title)}`
                              )
                            }
                            className='border-t cursor-pointer border-gray-800 py-2 hover:text-yellow-500'
                          >
                            {item.quiz.title}
                            <span className='flex items-center gap-3'>
                              <BookOpenTextIcon fill='#FFBE00' className='text-black' />
                            </span>
                          </li>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>

            {data.type === "URL" || data?.type === "mp4" ? (
              <div className='flex flex-col gap-4'>
                <div className='relative w-full rounded-md'>{renderContent()}</div>
                <div className='flex flex-col gap-4 p-4'>
                  <h4 className='text-yellow-500'>{data?.title}</h4>
                  <p>{data?.description}</p>
                </div>
              </div>
            ) : (
              <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-4 p-4'>
                  <h4 className='text-yellow-500'>{data?.title}</h4>
                  <p>{data?.description}</p>
                </div>
                <div className='relative w-full rounded-md'>{renderContent()}</div>
              </div>
            )}
          </div>
        </ContainerDashboard>
      </>
    );
};

export default LearningPage;
