import React, { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/ui/containers";
import Chapter from "./Chapters";
import { Pen, PlayCircle } from "lucide-react";

export const Curriculum = ({ courseId, chapters, onChaptersChange }: any) => {
  const [active, setActive] = useState(false);
  const [editingChapter, setEditingChapter] = useState<any>(null);
  // New state to store the chapter being edited
  console.log(chapters);
  const handleChaptersChange = (newChapter: any) => {
    if (editingChapter) {
      // If we are editing an existing chapter
      const updatedChapters = chapters.map((chapter: any, index: number) =>
        index === editingChapter?.index ? newChapter : chapter
      );
      onChaptersChange(updatedChapters);
    } else {
      // If it's a new chapter
      onChaptersChange([...chapters, newChapter]);
    }
    setActive(false);
    setEditingChapter(null); // Reset editing state after submission
  };

  const handleEditChapter = (chapter: any, index: number) => {
    setEditingChapter({ ...chapter, index }); // Store chapter data and its index
    setActive(true); // Open the form
  };

  return (
    <>
      {active ? (
        <Chapter
          courseId={courseId}
          onChaptersChange={handleChaptersChange}
          setActive={setActive}
          editingChapter={editingChapter} // Pass the editing chapter to the form
        />
      ) : (
        <div className='flex flex-col gap-4 mt-[20px]'>
          <DashboardHeader className='pb-5'>
            <h4>Curriculum</h4>
            <Button onClick={() => setActive(true)} variant={"buy"} className='mr-0 w-[163px]'>
              Add Chapter
            </Button>
          </DashboardHeader>
          <Accordion type='single' collapsible>
            {chapters.map((item: any, index: number) => {
              const video = item.uploadedFiles
                ? item.uploadedFiles.filter((file: any) => file.type === "mp4" || file.type === "URL")
                : [];

              return (
                <AccordionItem value={item.details?.title} key={index} className='p-0 max-w-full'>
                  <AccordionTrigger>
                    <div className='flex flex-col gap-1'>
                      Module {index + 1}: {item.details?.title || "Untitled"}
                      <div className='flex items-center'>
                        <p>{video.length} Videos</p>
                        <p className='border-x mx-5 px-5 border-gray-700'>
                          {item?.uploadedFiles ? item.uploadedFiles.length : 0} Lectures
                        </p>
                        <p>{item.quiz?.questions ? item.quiz.questions.length : 0} Quiz</p>
                        <Pen
                          className='hover:text-yellow-500 h-4 w-4 ml-5 cursor-pointer'
                          onClick={() => handleEditChapter(item, index)} // Trigger editing mode
                        />
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='p-0 m-0'>
                    {video.length > 0 && (
                      <ul>
                        {video.map((file: any, i: number) => (
                          <li key={i} className='border-t border-gray-800 py-2'>
                            {file.title}
                            <span className='flex items-center gap-3'>
                              <PlayCircle fill='#FFBE00' className='text-black' />
                              <p>{file.duration || "0:00"}m</p>
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      )}
    </>
  );
};
