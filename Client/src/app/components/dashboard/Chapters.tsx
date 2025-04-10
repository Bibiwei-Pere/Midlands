"use client";
import React, { useEffect, useState } from "react";
import { Button, EditToggleButton2 } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/ui/containers";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { GripVertical, Plus, XCircle, Trash2 } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FileUpload } from "@/app/components/dashboard/FileUpload";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { chapterSchema } from "../schema/Forms";

const Chapter = ({ courseId, onChaptersChange, setActive, editingChapter }: any) => {
  const form = useForm<z.infer<typeof chapterSchema>>({
    resolver: zodResolver(chapterSchema),
    mode: "onChange",
  });

  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  useEffect(() => {
    if (editingChapter) {
      form.reset(editingChapter);
      setUploadedFiles(editingChapter.uploadedFiles || []);
    }
  }, [editingChapter]);

  const onSubmit = (values: z.infer<typeof chapterSchema>) => {
    const submissionData = {
      ...values,
      uploadedFiles,
      ...(editingChapter?._id && { _id: editingChapter._id }),
    };
    console.log(submissionData);
    onChaptersChange(submissionData);
  };

  const onDelete = () => {
    if (editingChapter?._id) {
      onChaptersChange({ _id: editingChapter._id, deleted: true });
      setActive(false); // Close the form after deletion
    }
  };

  const handleCancel = () => {
    setActive(false); // Close the form without confirmation
  };

  return (
    <Form {...form}>
      <form className='flex flex-col gap-5'>
        <DashboardHeader className='py-10 flex-wrap'>
          <h4>{editingChapter ? "Edit Chapter" : "Add Chapter"}</h4>
          <div className='flex gap-3'>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type='button' variant={"destructive"} className='m-0 bg-red-500 w-[163px]'>
                  Cancel
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogTitle>Confirm Cancel</AlertDialogTitle>
                <p>Are you sure you want to cancel? Any unsaved changes will be lost.</p>
                <div className='flex justify-end'>
                  <div className='flex gap-2 max-w-[300px]'>
                    <Button variant={"destructive"} onClick={handleCancel}>
                      Yes, Cancel
                    </Button>
                    <Button variant={"success"}>
                      <AlertDialogCancel>No, Go Back</AlertDialogCancel>
                    </Button>
                  </div>
                </div>
              </AlertDialogContent>
            </AlertDialog>

            {editingChapter && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type='button' variant={"destructive"} className='m-0 bg-red-700 w-[163px]'>
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                  <p>Are you sure you want to delete this chapter? This action cannot be undone.</p>
                  <div className='flex justify-end'>
                    <div className='flex gap-2 max-w-[300px]'>
                      <Button variant={"destructive"} onClick={onDelete}>
                        Yes, Delete
                      </Button>
                      <Button variant={"success"}>
                        <AlertDialogCancel>No, Keep It</AlertDialogCancel>
                      </Button>
                    </div>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <Button type='submit' onClick={form.handleSubmit(onSubmit)} variant={"buy"} className='mr-0 w-[163px]'>
              {editingChapter ? "Update Chapter" : "Add Chapter"}
            </Button>
          </div>
        </DashboardHeader>

        <Tabs defaultValue='Details' className='w-full bg-black px-8 rounded-lg'>
          {/* Details Tab */}
          <TabsList>
            {chapterTab.map((setting) => (
              <TabsTrigger value={setting.value} key={setting.value}>
                {setting.value}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className='border-b border-gray-800'></div>
          <div className='max-w-full'>
            {chapterTab.map((setting) => (
              <TabsContent value={setting.value} key={setting.value} className='max-w-full mx-auto my-2 pb-20 navItems'>
                {setting.value === "Details" ? (
                  <Details form={form} />
                ) : setting.value === "Activities" ? (
                  <Activities form={form} />
                ) : (
                  <FileUpload courseId={courseId} uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} />
                )}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </form>
    </Form>
  );
};

export default Chapter;

// const populateFormData = (form) => {
//   form.setValue("details.title", "Real-Time Market Analysis");
//   form.setValue(
//     "details.subtitle",
//     "Apply all acquired skills in a live trading environment for high-probability setups."
//   );
//   form.setValue(
//     "details.description",
//     `
// 1. Live Market Analysis
//    - Objective: Conduct real-time analysis to identify trading opportunities.
//    - Competencies:
//      • Apply a structured approach to trade management from entry to exit.
//      • Execute trades in live market environments with confidence.

// 2. Evaluation of Practical Skills
//    - Objective: Assess proficiency through a one-month practical trading period.
//    - Competencies:
//      • Engage in live trading with strategies learned throughout the course.
//      • Receive evaluation based on trade quality and decision-making.

// 3. Supplementary Learning
//    - Resources: mywebsite eBook: "Live Market Analysis for Elite Traders"
// `
//   );
//   form.setValue(
//     "details.skills",
//     `
// - Proficiency in real-time trade analysis.
// - Effective trade management strategies.
// - Readiness for independent trading.
// `
//   );
// };

// const quizData = [
//   {
//     question: "What defines a bullish trend in market structure?",
//     options: [
//       "Lower highs and lower lows",
//       "Higher highs and higher lows",
//       "Consolidation near support",
//       "Decreasing volume with price rise",
//     ],
//     answer: 1,
//   },
//   {
//     question:
//       "Which term describes the breaking of a key support or resistance level that signals a potential trend change?",
//     options: [
//       "Break of Structure (BOS)",
//       "Change of Character (Choke)",
//       "Internal Liquidity Shift",
//       "Breaker Block Formation",
//     ],
//     answer: 0,
//   },
//   {
//     question: "What is the role of resistance in market structure?",
//     options: [
//       "It supports price rises",
//       "It prevents further price declines",
//       "It creates reversal patterns during a correction",
//       "It acts as a ceiling, preventing further price rise",
//     ],
//     answer: 3,
//   },
//   {
//     question: "In a bearish trend, what does a lower low signal?",
//     options: ["Price correction", "Trend reversal", "Continuation of the downtrend", "Bullish Choke"],
//     answer: 2,
//   },
//   {
//     question: "How can you visually identify a Break of Structure (BOS)?",
//     options: [
//       "The price makes a higher high followed by a higher low",
//       "The price breaks a key support or resistance level",
//       "The price moves sideways for a prolonged period",
//       "The price retraces to a key level and reverses",
//     ],
//     answer: 1,
//   },
//   {
//     question: "Which graphical pattern indicates a potential price continuation?",
//     options: ["Head and Shoulders", "Ascending Triangle", "Double Bottom", "Falling Wedge"],
//     answer: 1,
//   },
//   {
//     question: "What is the primary role of support in a graphical chart?",
//     options: [
//       "It prevents a price from moving lower",
//       "It acts as a mid-range price level",
//       "It facilitates liquidity",
//       "It confirms price consolidation",
//     ],
//     answer: 0,
//   },
//   {
//     question: "What is a Change of Character (Choke)?",
//     options: [
//       "A complete trend reversal",
//       "A signal that a trend is losing strength and might reverse",
//       "A breakout from a consolidation zone",
//       "A bullish pattern found in liquidity zones",
//     ],
//     answer: 1,
//   },
//   {
//     question: "What does it mean when the price moves between internal and external liquidity zones?",
//     options: [
//       "The market is in a state of equilibrium",
//       "The price is oscillating between two significant levels",
//       "The market has no clear direction",
//       "The price has broken through support and resistance",
//     ],
//     answer: 1,
//   },
//   {
//     question: "What happens when price touches a significant resistance level but fails to break through?",
//     options: [
//       "The price will continue to rise",
//       "A bullish breakout will occur",
//       "The price will likely reverse and decline",
//       "A consolidation phase will begin",
//     ],
//     answer: 2,
//   },
//   {
//     question: "What is the purpose of using multi-time frame analysis?",
//     options: [
//       "To confirm trade setups across different time frames",
//       "To reduce market noise by focusing on one time frame",
//       "To find small price movements in a larger trend",
//       "To increase the number of trades entered daily",
//     ],
//     answer: 0,
//   },
//   {
//     question: "In a top-down analysis, what is the first step?",
//     options: [
//       "Identify key levels on the 1-hour chart",
//       "Determine the overall trend on the higher time frames",
//       "Look for Break of Structure (BOS) on the lower time frames",
//       "Set entry points using candlestick patterns",
//     ],
//     answer: 1,
//   },
//   {
//     question: "Which of the following would you use lower time frames to confirm?",
//     options: ["Trend continuation", "Long-term trend", "Monthly trend analysis", "Market sentiment"],
//     answer: 0,
//   },
//   {
//     question: "What should traders look for after a Break of Structure (BOS) to confirm a valid trade entry?",
//     options: [
//       "Volume divergence",
//       "A retest of the broken level",
//       "A change in trend on the monthly chart",
//       "An immediate reversal pattern",
//     ],
//     answer: 1,
//   },
//   {
//     question: "What is the purpose of trading from zone to zone?",
//     options: [
//       "To capture quick profits within a trending market",
//       "To trade between key support and resistance levels",
//       "To wait for complete trend reversals",
//       "To avoid entry during high volatility",
//     ],
//     answer: 1,
//   },
//   {
//     question: "How does a breaker block formation help in trade execution?",
//     options: [
//       "It confirms a price reversal",
//       "It indicates consolidation within a trend",
//       "It provides a strong retest zone after a break of resistance",
//       "It signals a pause in trend before reversal",
//     ],
//     answer: 2,
//   },
//   {
//     question: "When is a price likely to correct after a strong move?",
//     options: [
//       "After it breaks through a liquidity zone",
//       "When it touches a significant key level",
//       "When the RSI crosses below 30",
//       "When volume increases",
//     ],
//     answer: 1,
//   },
//   {
//     question: "When using live charts, how should traders identify support and resistance levels?",
//     options: [
//       "By drawing horizontal lines at swing highs and swing lows",
//       "By following moving averages",
//       "By observing candlestick patterns only",
//       "By using Fibonacci levels exclusively",
//     ],
//     answer: 0,
//   },
//   {
//     question: "What is the key advantage of practicing marking key levels on live charts?",
//     options: [
//       "It ensures better profit maximization",
//       "It helps traders react dynamically to price movements",
//       "It guarantees trade profitability",
//       "It reduces the need for stop-losses",
//     ],
//     answer: 1,
//   },
//   {
//     question: "Which technique is essential for making informed trade decisions based on real-time price action?",
//     options: [
//       "Using lower time frames exclusively",
//       "Combining market structure with graphical illustrations",
//       "Ignoring higher time frames",
//       "Entering trades only during high volatility",
//     ],
//     answer: 1,
//   },
//   {
//     question: "Where should stop-losses be placed in a bullish trade?",
//     options: [
//       "Below a significant support level",
//       "Above the entry price",
//       "At the breakout point",
//       "Below the previous resistance",
//     ],
//     answer: 0,
//   },
//   {
//     question: "What is an appropriate risk-reward ratio for a trade?",
//     options: ["1:1", "1:2", "2:1", "3:1"],
//     answer: 2,
//   },
// ];

// const initializeQuestions = (quizData: any) => {
//   return quizData.map((item: any) => ({
//     question: item.question,
//     options: item.options,
//     answer: item.answer,
//   }));
// };

const Details = ({ form }: any) => {
  // populateFormData(form);
  const [editMode, setEditMode] = React.useState({
    title: false,
    subtitle: false,
    description: false,
    skills: false,
  });

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>, field: string) => {
    const textarea = e.target;
    const newValue = textarea.value;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
    form.setValue(`details.${field}`, newValue); // Update this line to reference the correct nested field
  };

  return (
    <div className='flex flex-col'>
      <h4 className='mt-[30px]'>Chapter details</h4>

      <div className='flex flex-col gap-5 py-4'>
        <div className='border border-gray-800 relative bg-black p-3 rounded-lg'>
          <p className='text-[#979797] p-0'>
            Title <b className='font-normal text-red-500'>*</b>
          </p>

          <EditableField
            field={form.register("details.title")} // Update this line for nested field registration
            className='text-[16px] leading-normal p-0 h-[25px]'
            placeHolder='Enter title'
            required
            onToggleEdit={() => setEditMode((prev) => ({ ...prev, title: !prev.title }))}
            handleTextareaChange={handleTextareaChange}
            isEditing={editMode.title}
          />
        </div>
        <div className='border border-gray-800 relative bg-black p-3 rounded-lg'>
          <p className='text-[#979797] p-0'>Subtitle</p>
          <EditableField
            field={form.register("details.subtitle")} // Update this line for nested field registration
            className='text-[16px] leading-normal p-0 h-[35px]'
            placeHolder='Enter subtitle'
            onToggleEdit={() => setEditMode((prev) => ({ ...prev, subtitle: !prev.subtitle }))}
            handleTextareaChange={handleTextareaChange}
            isEditing={editMode.subtitle}
          />
        </div>
        <div className='border border-gray-800 relative bg-black p-3 rounded-lg'>
          <p className='text-[#979797] p-0'>Description</p>
          <EditableField
            field={form.register("details.description")} // Update this line for nested field registration
            className='text-[16px] leading-normal p-0 h-[75px]'
            placeHolder='Enter description'
            onToggleEdit={() =>
              setEditMode((prev) => ({
                ...prev,
                description: !prev.description,
              }))
            }
            handleTextareaChange={handleTextareaChange}
            isEditing={editMode.description}
          />
        </div>
        <div className='border border-gray-800 relative bg-black p-3 rounded-lg'>
          <p className='text-[#979797] p-0'>Key Skills and Competencies:</p>
          <EditableField
            field={form.register("details.skills")} // Update this line for nested field registration
            className='text-[16px] leading-normal p-0 h-[75px]'
            placeHolder='Enter skills'
            onToggleEdit={() => setEditMode((prev) => ({ ...prev, skills: !prev.skills }))}
            handleTextareaChange={handleTextareaChange}
            isEditing={editMode.skills}
          />
        </div>
      </div>
    </div>
  );
};

const QuestionNumber = ({ onSubmit, closeDialog }: any) => {
  const [number, setNumber] = useState<string>("");
  const [options, setOptions] = useState<string>("");

  const handleSave = () => {
    const parsedNumber = Number(number);
    const parsedOptions = Number(options);

    if (!isNaN(parsedNumber) && parsedNumber > 0 && !isNaN(parsedOptions) && parsedOptions > 0) {
      onSubmit(parsedNumber, parsedOptions); // Pass both values to onSubmit
      closeDialog();
    } else {
      alert("Please enter valid numbers for both questions and options.");
    }
  };

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex mb-10 justify-between items-center'>
        <h6>Enter Number of Questions and Options</h6>
        <AlertDialogCancel>
          <XCircle className='hover:text-yellow-500 cursor-pointer' />
        </AlertDialogCancel>
      </div>

      <div className='mt-2'>
        <label className='block mb-1 text-sm font-medium'>Number of Questions</label>
        <Input
          type='text'
          pattern='[0-9]*'
          placeholder='Enter number of questions'
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
      </div>

      <div className='mt-2'>
        <label className='block mb-1 text-sm font-medium'>Number of Options per Question</label>
        <Input
          type='text'
          pattern='[0-9]*'
          placeholder='Enter number of options per question'
          value={options}
          onChange={(e) => setOptions(e.target.value)}
        />
      </div>

      <Button type='button' onClick={handleSave} variant={"buy"} className='w-full mt-10'>
        Save
      </Button>
    </div>
  );
};

const Activities = ({ form }: any) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [questions, setQuestions] = useState(
    form.getValues("quiz")?.questions?.length > 0
      ? form.getValues("quiz").questions
      : Array.from({ length: 1 }, () => ({
          question: "",
          options: Array.from({ length: 4 }, () => ""), // Default 4 options per question
          answer: 0,
        }))
  );

  const handleDeleteQuestion = () => {
    if (deleteIndex !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions.splice(deleteIndex, 1);
      setQuestions(updatedQuestions);
      form.setValue("quiz.questions", updatedQuestions);
      setDeleteIndex(null); // Reset the index after deletion
      setDialogOpen(false); // Close the dialog
    }
  };

  const openDeleteDialog = (index: number) => {
    setDeleteIndex(index);
    setDialogOpen(true);
  };

  const handleQuestionChange = (e: any, index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = e.target.value;
    setQuestions(updatedQuestions);
    form.setValue("quiz.questions", updatedQuestions);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const updatedQuestions = [...questions];
    const [reorderedQuestion] = updatedQuestions.splice(result.source.index, 1);
    updatedQuestions.splice(result.destination.index, 0, reorderedQuestion);
    setQuestions(updatedQuestions);
    form.setValue("quiz.questions", updatedQuestions);
  };

  return (
    <div className='flex flex-col'>
      <div className='flex justify-between items-center mb-5'>
        <h4 className='mt-[30px]'>Create Quizzes/Exams</h4>
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button type='button' variant={"buy"} className='mr-0 w-[163px] mt-5'>
              Add Questions
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <p>Are you sure you want to delete this question?</p>
            <div className='flex justify-end'>
              <div className='flex gap-2 max-w-[300px]'>
                <Button variant={"success"}>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                </Button>
                <Button variant={"destructive"} onClick={handleDeleteQuestion}>
                  Delete
                </Button>
              </div>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId='questions'>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <Accordion type='single' collapsible>
                {questions.map((question: any, questionIndex: number) => (
                  <Draggable key={questionIndex} draggableId={`question-${questionIndex}`} index={questionIndex}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className='mb-4'
                      >
                        <AccordionItem value={`question-${questionIndex}`} className='max-w-[1000px]'>
                          <AccordionTrigger className='py-1'>
                            <div className='grid grid-cols-[40px,1fr] gap-3 justify-between items-center'>
                              <Trash2
                                className='cursor-pointer hover:text-yellow-500 text-red-500'
                                onClick={() => openDeleteDialog(questionIndex)}
                              />
                              <p className='text-yellow-500'>Question {questionIndex + 1}</p>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <textarea
                              className='text-[16px] leading-normal w-full border-b border-gray-800 bg-transparent outline-none rounded-lg'
                              placeholder={`Enter question ${questionIndex + 1}`}
                              value={question.question}
                              onChange={(e) => handleQuestionChange(e, questionIndex)}
                            />
                            {/* Options handling */}
                            <div className='mt-4'>
                              {question.options.map((option: any, optionIndex: number) => (
                                <div key={optionIndex} className='flex items-center gap-2 mb-2'>
                                  <GripVertical />
                                  <input
                                    type='text'
                                    value={option}
                                    onChange={(e) => {
                                      const updatedQuestions = [...questions];
                                      updatedQuestions[questionIndex].options[optionIndex] = e.target.value;
                                      setQuestions(updatedQuestions);
                                      form.setValue("quiz.questions", updatedQuestions);
                                    }}
                                    className='text-[16px] p-0 h-[45px] w-full border-b border-gray-800 outline-none bg-transparent'
                                    placeholder={`Option ${optionIndex + 1}`}
                                  />
                                  <Trash2
                                    className='cursor-pointer'
                                    onClick={() => {
                                      const updatedQuestions = [...questions];
                                      updatedQuestions[questionIndex].options.splice(optionIndex, 1);
                                      setQuestions(updatedQuestions);
                                      form.setValue("quiz.questions", updatedQuestions);
                                    }}
                                  />
                                </div>
                              ))}
                              <Button
                                type='button'
                                variant={"buy"}
                                onClick={() => {
                                  const updatedQuestions = [...questions];
                                  updatedQuestions[questionIndex].options.push("");
                                  setQuestions(updatedQuestions);
                                }}
                                className='flex items-center gap-1 w-[160px] mt-5 bg-green-600'
                              >
                                <Plus className='h-4 w-4' /> Add Option
                              </Button>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </div>
                    )}
                  </Draggable>
                ))}
              </Accordion>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Button
        type='button'
        onClick={() =>
          setQuestions([
            ...questions,
            {
              question: "",
              options: ["", "", "", ""], // Default options
              answer: 0,
            },
          ])
        }
        className='w-[163px] mt-4'
      >
        Add Single Question
      </Button>
    </div>
  );
};

const chapterTab = [
  {
    value: "Details",
    component: <Details form={undefined} />,
  },
  {
    value: "Resources",
    component: <FileUpload />,
  },
  {
    value: "Activities",
    component: <Activities form={undefined} />,
  },
];

export const EditableField = ({
  field,
  className,
  isEditing,
  onToggleEdit,
  handleTextareaChange,
  placeHolder,
}: any) => {
  const { ref, ...inputProps } = field;

  return (
    <FormItem>
      <EditToggleButton2 isEditing={isEditing} onClick={onToggleEdit} />
      <Textarea
        className={`border-none p-0 ${className} ${isEditing ? "cursor-text" : "cursor-not-allowed"}`}
        ref={ref}
        {...inputProps}
        onChange={(e) => {
          // Call both handleTextareaChange and the form's onChange
          handleTextareaChange(e, field.name); // Custom logic for auto-resizing and form update
          inputProps.onChange(e); // This ensures form state is updated
        }}
        placeholder={placeHolder}
        rows={1}
        disabled={!isEditing}
        style={{ overflow: "hidden" }}
      />
    </FormItem>
  );
};
