import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { EditToggleButton } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useGetUser } from "@/hooks/users";
import { Award, GraduationCap, Play } from "lucide-react";
import { Curriculum } from "./Curriculum";
import { Reviews } from "./Reviews";

export const CourseTab = ({
  courseId,
  description,
  certificate,
  instructorName,
  instructorTitle,
  instructorDesc,
  chapters,
  onDescriptionChange,
  onCertificateChange,
  onInstructorNameChange,
  onInstructorTitleChange,
  onChaptersChange,
  onInstructorDescChange,
}: any) => {
  return (
    <Tabs defaultValue='Overview' className='w-full mt-4 bg-black py-5 px-8 rounded-lg'>
      <TabsList>
        {courseTab.map((setting) => (
          <TabsTrigger value={setting.value} key={setting.value}>
            {setting.value}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className='border-b border-gray-800'></div>
      <div className='max-w-full'>
        {courseTab.map((setting) => (
          <TabsContent value={setting.value} key={setting.value} className='max-w-full mx-auto my-2 pb-20 navItems'>
            {setting.value === "Overview" ? (
              <Overview
                courseId={courseId}
                description={description}
                certificate={certificate} // Pass certificate to Overview
                onDescriptionChange={onDescriptionChange}
                onCertificateChange={onCertificateChange} // Pass curriculum change handler
              />
            ) : setting.value === "Instructor" ? (
              <Instructor
                courseId={courseId}
                instructorName={instructorName}
                instructorTitle={instructorTitle}
                instructorDesc={instructorDesc}
                onInstructorNameChange={onInstructorNameChange}
                onInstructorTitleChange={onInstructorTitleChange}
                onInstructorDescChange={onInstructorDescChange}
              />
            ) : setting.value === "Curriculum" ? (
              <Curriculum courseId={courseId} chapters={chapters} onChaptersChange={onChaptersChange} />
            ) : (
              <Reviews courseId={courseId} />
            )}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
};

const Overview = ({ courseId, description, certificate, onDescriptionChange, onCertificateChange }: any) => {
  const [editModeDescription, setEditModeDescription] = React.useState(false);
  const [editModeCertificate, setEditModeCertificate] = React.useState(false);

  const handleDescriptionChange = (e: any) => {
    const newDescription = e.target.value;
    onDescriptionChange(newDescription); // Call the parent's change handler
  };
  console.log(certificate);
  const handleCertificateChange = (e: any) => {
    const newCertificate = e.target.value;
    onCertificateChange(newCertificate); // Call the parent's change handler
  };

  return (
    <div>
      <FormLabel className='mt-[30px]'>Course Description</FormLabel>
      <EditableField
        field={{ name: "description", value: description }} // Assuming you handle registration differently
        className={`text-[#979797] placeholder:text-[#979797] text-[16px] border-4 py-0 leading-normal ${
          courseId === "add" && "mt-5"
        }`}
        placeHolder='Enter course description'
        courseId={courseId}
        isEditing={courseId === "add" ? !editModeDescription : editModeDescription}
        onToggleEdit={() => setEditModeDescription((prev) => !prev)}
        handleTextareaChange={handleDescriptionChange}
      />
      <FormLabel className='mt-[30px]'>Certification</FormLabel>

      <EditableField
        field={{ name: "certificate", value: certificate }} // Assuming you handle registration differently
        className={`text-[#979797] placeholder:text-[#979797] text-[16px] border-4 py-0 leading-normal ${
          courseId === "add" && "mt-5"
        }`}
        placeHolder='Enter certificate description'
        courseId={courseId}
        isEditing={courseId === "add" ? !editModeCertificate : editModeCertificate}
        onToggleEdit={() => setEditModeCertificate((prev) => !prev)}
        handleTextareaChange={handleCertificateChange}
      />
    </div>
  );
};

const Instructor = ({
  courseId,
  instructorName,
  instructorTitle,
  instructorDesc,
  onInstructorTitleChange,
  onInstructorNameChange,
  onInstructorDescChange,
}: any) => {
  const [editModeInstructorName, setEditModeInstructorName] = React.useState(false);
  const [editModeInstructorTitle, setEditModeInstructorTitle] = React.useState(false);
  const [editModeInstructorDesc, setEditModeInstructorDesc] = React.useState(false);

  const handleInstructorNameChange = (e: any) => onInstructorNameChange(e.target.value);

  const handleInstructorTitleChange = (e: any) => onInstructorTitleChange(e.target.value);

  const handleInstructorDescChange = (e: any) => onInstructorDescChange(e.target.value);

  const user = useGetUser();
  console.log(user);
  return (
    <div>
      <h6 className='text-[#979797] mt-10'>Instructor</h6>
      <div className='flex flex-col lg:flex-row gap-10'>
        <div className='flex flex-col gap-3'>
          <EditableField
            field={{ name: "instructorName", value: instructorName }} // Assuming you handle registration differently
            className={`text-[40px] leading-[40px] h-[90px] py-0 ${courseId === "add" && "mt-5"}`}
            placeHolder='Enter instructor name'
            courseId={courseId}
            isEditing={courseId === "add" ? !editModeInstructorName : editModeInstructorName}
            onToggleEdit={() => setEditModeInstructorName((prev) => !prev)}
            handleTextareaChange={handleInstructorNameChange}
          />
          <EditableField
            field={{ name: "instructorTitle", value: instructorTitle }} // Assuming you handle registration differently
            className='text-[#979797] h-[60px] placeholder:text-[#979797] text-[24px] leading-[30px]'
            placeHolder='Enter instructor title'
            courseId={courseId}
            isEditing={courseId === "add" ? !editModeInstructorTitle : editModeInstructorTitle}
            onToggleEdit={() => setEditModeInstructorTitle((prev) => !prev)}
            handleTextareaChange={handleInstructorTitleChange}
          />
        </div>
        <div className='flex gap-3'>
          <Image
            src={user?.data?.avatar?.url || "/noavatar.png"}
            alt='Avatar'
            width={520}
            height={520}
            className='w-[120px] object-cover h-[120px] rounded-full'
          />
          <div className='flex flex-col gap-3'>
            <span className='flex gap-2'>
              <Award className='w-5' />
              <p>{user?.data?.reviews || 0} Reviews</p>
            </span>
            <span className='flex gap-2'>
              <GraduationCap className='w-5' />
              <p>{user?.data?.students || 0} Students</p>
            </span>
            <span className='flex gap-2'>
              <Play className='w-5' />
              <p>{user?.data?.courses || 0} Courses</p>
            </span>
          </div>
        </div>
      </div>
      <EditableField
        field={{ name: "instructorDesc", value: instructorDesc }} // Assuming you handle registration differently
        className={`text-[#979797] placeholder:text-[#979797] text-[16px] leading-normal ${
          courseId === "add" && "mt-5"
        }`}
        placeHolder='Enter instructor description'
        courseId={courseId}
        isEditing={courseId === "add" ? !editModeInstructorDesc : editModeInstructorDesc}
        onToggleEdit={() => setEditModeInstructorDesc((prev) => !prev)}
        handleTextareaChange={handleInstructorDescChange}
      />
    </div>
  );
};

export const EditableField = ({
  field,
  className,
  isEditing,
  onToggleEdit,
  handleTextareaChange,
  placeHolder,
  courseId, // Added courseId prop
}: {
  field: any;
  className?: string;
  isEditing: boolean;
  onToggleEdit: any;
  handleTextareaChange: any;
  placeHolder: any;
  courseId: string; // Expect courseId as string or undefined
}) => (
  <FormItem>
    {courseId && courseId !== "add" && <EditToggleButton isEditing={isEditing} onClick={onToggleEdit} />}
    <Textarea
      className={`border-none ${className}`}
      {...field}
      onChange={(e) => {
        handleTextareaChange(e, field.name);
      }}
      placeholder={placeHolder}
      rows={1}
      disabled={!isEditing}
      style={{ overflow: "hidden" }}
    />
    <FormMessage />
  </FormItem>
);

const courseTab = [
  {
    value: "Overview",
  },
  {
    value: "Instructor",
  },
  {
    value: "Curriculum",
  },
  {
    value: "Reviews",
  },
];
