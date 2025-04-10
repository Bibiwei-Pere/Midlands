"use client";
import { Button } from "@/components/ui/button";
import { ContainerDashboard } from "@/components/ui/containers";
import { SkeletonCard2 } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useGetCourse } from "@/hooks/course";
import { useUpdateUser } from "@/hooks/users";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Quiz = ({ params }: any) => {
  const { courseId, title, chapterId: nextChapterId } = params;
  const { mutation } = useUpdateUser();
  const [quizData, setQuizData] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [chapterId, setChapterId] = useState("");
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [lastAnswered, setLastAnswered] = useState<number | null>(null); // Track the last answered question
  const [showAnswerScreen, setShowAnswerScreen] = useState<boolean>(false); // Control answer display screen
  const course = useGetCourse(courseId);
  const [isLastChapter, setIsLastChapter] = useState(false);
  const chapters = course?.data?.chapters || [];
  const { data: session } = useSession();
  const { toast } = useToast();
  const navigation = useRouter();

  useEffect(() => {
    if (course?.data) {
      const decodedTitle = decodeURIComponent(title);

      const matchingChapter = chapters.find((chapter: any) => chapter.quiz?.title === decodedTitle);
      if (matchingChapter) {
        const matchingQuiz = matchingChapter.quiz;
        setQuizData(matchingQuiz);
        setChapterId(matchingChapter._id);
        if (chapters[chapters.length - 1]._id === matchingChapter._id) {
          setIsLastChapter(true);
        }
      }
    }
  }, [course?.data, title]);

  const handleSubmitScore = () => {
    let correctAnswersCount = 0;
    quizData.questions.forEach((question: any, index: number) => {
      if (userAnswers[index] === question.answer) {
        correctAnswersCount += 1;
      }
    });

    const percentageScore = (correctAnswersCount / quizData.questions.length) * 100;
    setScore(percentageScore);

    submitQuizScore({ courseId, quizTitle: quizData.title, score: percentageScore, chapterId })
      .then(() => {
        console.log("Score submitted successfully");
      })
      .catch((error) => console.error("Error submitting score:", error));
  };

  const handleFinish = () => {
    mutation.mutate(
      {
        userId: session?.user?.id,
        quizData: { courseId, quizTitle: quizData.title, score, chapterId },
      },
      {
        onSuccess: () => {
          if (isLastChapter) navigation.push(`/dashboard/course/${courseId}/learning/chapter/certificate`);
          else {
            window.location.href = `/dashboard/course/${courseId}/learning/${nextChapterId}`;
          }
        },
      }
    );
  };

  const submitQuizScore = async (scoreData: {
    courseId: string;
    quizTitle: string;
    score: number;
    chapterId: string;
  }) => {
    console.log(scoreData);
    toast({
      variant: "success",
      title: "Quiz Submitted",
      description: `Your score: ${scoreData.score.toFixed(2)}%`,
    });
  };

  if (!quizData) return <SkeletonCard2 />;

  const totalSteps = quizData.questions.length + 1;

  const handleAnswerSelect = (selectedIndex: number) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentStep - 1] = selectedIndex;
    setUserAnswers(updatedAnswers);
    setLastAnswered(currentStep - 1); // Set the last answered question index
  };

  const optionLetter = (index: number) => String.fromCharCode(97 + index).toUpperCase();

  const goToNextScreen = () => {
    if (!showAnswerScreen) {
      setShowAnswerScreen(true); // Show the answer screen
    } else {
      setShowAnswerScreen(false); // Move to the next question
      setCurrentStep((prevStep) => prevStep + 1);

      // Calculate score when the last question answer screen is shown
      if (currentStep === quizData.questions.length) {
        handleSubmitScore();
      }
    }
  };

  const goToPreviousScreen = () => {
    if (showAnswerScreen) {
      setShowAnswerScreen(false); // Go back to question screen if on answer screen
    } else if (currentStep > 1) {
      setCurrentStep((prevStep) => prevStep - 1);
      setLastAnswered(currentStep - 2); // Update last answered question index
    }
  };

  return (
    <ContainerDashboard className='bg-black pb-20'>
      <div>
        {currentStep === 0 && (
          <div className='text-center'>
            <h2 className='text-yellow-500 mb-3'>{quizData.title}</h2>
            <p className='mb-5'>{quizData.description}</p>
            <Button onClick={() => setCurrentStep(1)}>Start Quiz</Button>
          </div>
        )}

        {/* Question Screen */}
        {currentStep > 0 && currentStep <= quizData.questions.length && !showAnswerScreen && (
          <div className='mt-5 max-w-[800px] mx-auto'>
            <h3 className='text-lg mb-3 text-center text-yellow-500'>Question {currentStep}:</h3>
            <h4 className='uppercase text-center'>{quizData.questions[currentStep - 1].question}</h4>

            {/* Display answer options */}
            <ul className='mt-10 flex flex-col gap-2'>
              {quizData.questions[currentStep - 1].options.map((option: string, index: number) => (
                <div
                  key={index}
                  className={`mb-2 flex py-2 px-4 sm:px-8 rounded-full items-center w-full gap-3 justify-start ${
                    userAnswers[currentStep - 1] === index
                      ? "bg-green-500 text-white hover:bg-green-500 hover:text-white"
                      : "bg-white text-black hover:bg-green-500"
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                  // disabled={userAnswers[currentStep - 1] !== undefined} // Disable further selections once an answer is chosen
                >
                  <span className='flex items-center justify-center border rounded-full p-[1px] w-[20px] h-[20px] font-bold'>
                    {`${optionLetter(index)} `}
                  </span>
                  {option}
                </div>
              ))}
            </ul>
          </div>
        )}

        {/* Answer Screen */}
        {showAnswerScreen && (
          <div className='mt-5 text-center'>
            <h4 className='text-lg mb-3 text-center text-green-500'>
              Correct Answer: {optionLetter(quizData.questions[lastAnswered!].answer)}
            </h4>
            <h6 className='text uppercase mb-3'>
              {quizData.questions[lastAnswered!].options[quizData.questions[lastAnswered!].answer]}
            </h6>
          </div>
        )}

        {currentStep === totalSteps && !showAnswerScreen && (
          <div className='mt-5 text-center'>
            <h2 className='text-yellow-500 mb-3'>End of Quiz</h2>
            {score !== null ? (
              <div className='flex flex-col gap-3 items-center'>
                <p>
                  Your Score:{" "}
                  <b className={`${score > 70 ? "text-green-500" : score >= 50 ? "text-yellow-500" : "text-red-500"}`}>
                    {score.toFixed(2)}%
                  </b>
                </p>
                <p
                  className={`p-4 border rounded-lg ${
                    score > 70
                      ? "bg-green-100 text-green-700 border-green-700"
                      : score >= 50
                      ? "bg-yellow-100 text-yellow-500 border-yellow-500"
                      : "bg-red-100 text-red-700 border-red-700"
                  }`}
                >
                  {score > 70
                    ? "Excellent, You nailed it"
                    : score >= 50
                    ? "Good, there's still room for improvement"
                    : "Poor Performance, Try harder next time"}
                </p>
              </div>
            ) : (
              <p>Thank you for completing this quiz!</p>
            )}
            <Button
              variant={"success"}
              disabled={mutation.isPending}
              onClick={handleFinish}
              className='mt-10 max-w-[350px] mb-20'
            >
              {mutation.isPending ? <Loader2 className='w-4 h-4 animate-spin' /> : "Finish"}
            </Button>
          </div>
        )}

        {/* Navigation Buttons */}
        {currentStep > 0 && currentStep <= totalSteps && (
          <div className='flex justify-between mt-20 mb-32 max-w-[800px] mx-auto'>
            <Button
              variant={"buy"}
              className='max-w-[100px] ml-0 disabled:hidden'
              onClick={goToPreviousScreen}
              disabled={currentStep === 1 && !showAnswerScreen} // Disable "Previous" on the first question screen
            >
              Previous
            </Button>

            <Button
              variant={"buy"}
              className='max-w-[130px] mr-0 disabled:hidden'
              onClick={goToNextScreen}
              disabled={userAnswers[currentStep - 1] === undefined && !showAnswerScreen} // Ensure answer selection before moving
            >
              {showAnswerScreen ? "Next Question" : "Show Answer"}
            </Button>
          </div>
        )}
      </div>
    </ContainerDashboard>
  );
};

export default Quiz;
