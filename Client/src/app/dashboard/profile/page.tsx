"use client";
import { Button, EditToggleButton2 } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { SkeletonCard2 } from "@/components/ui/skeleton";
import { ContainerDashboard, DashboardHeader } from "@/components/ui/containers";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useGetUser, useUpdateUser } from "@/hooks/users";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { RequestPayout } from "@/app/components/dashboard/RequestPayout";
import { CourseCard2 } from "@/app/components/dashboard/CourseCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useGetUserCourses } from "@/hooks/course";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditableField } from "@/app/components/dashboard/Chapters";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import empty from "../../components/assets/images/dashboard/empty.svg";

const Profile = () => {
  const { data: user, status } = useGetUser();

  if (status !== "success") return <SkeletonCard2 />;
  else
    return (
      <>
        <DashboardHeader>
          <h2>Profile</h2>
        </DashboardHeader>
        <ContainerDashboard>
          <div className='flex flex-col sm:flex-row justify-between'>
            <div className='flex flex-col gap-4'>
              <div className='flex items-center gap-3'>
                <Image
                  src={user?.avatar?.url || "/noavatar.png"}
                  alt='Avatar'
                  width={500}
                  height={500}
                  className='object-cover rounded-full w-20 h-20'
                />
                <div className='flex flex-col gap-3'>
                  <h4>
                    {user?.firstName} {user?.lastName || user.username}
                  </h4>
                  <div className='flex gap-3 items-center'>
                    <p className='bg-yellow-500 text-black rounded-full py-1 px-4'>
                      {user?.role === "User" ? "Student" : user?.role}
                    </p>
                    <p className='hidden sm:block'>{user?.email}</p>
                  </div>
                  <p>{user?.phone}</p>
                </div>
              </div>
            </div>
            <div className='mt-10  sm:mt-0 flex flex-col gap-3 items-end'>
              <p className='font-medium'>Lifetime Affiliate Earnings: ₦ {user.affiliate.lifetimeEarnings || 0}</p>
              <h4>
                Available Payout: <b className='font-normal'>₦ {user.affiliate.balance || 0}</b>
              </h4>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className='mr-0' variant={"ghost"}>
                    Request Withdrawal
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <RequestPayout />
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          <Tabs defaultValue='Profile' className='bg-black py-4 px-6 w-full mt-4'>
            <TabsList>
              <TabsTrigger value='Profile'>Profile</TabsTrigger>
              <TabsTrigger value='Courses'>Courses</TabsTrigger>
            </TabsList>
            {profileTab.map((profile) => (
              <TabsContent value={profile.value} key={profile.value}>
                {profile.component}
              </TabsContent>
            ))}
          </Tabs>
        </ContainerDashboard>
      </>
    );
};

const Courses = () => {
  const { data: user, status } = useGetUser();
  const { data: courses, status: courseStatus } = useGetUserCourses();

  const plugin = React.useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  console.log(courses);
  if (status !== "success" && courseStatus !== "success") return <SkeletonCard2 />;
  return (
    <div className='flex flex-col gap-6 mt-5'>
      {user?.role !== "User" ? <h4>Created course(s)</h4> : <h4>Enrolled course(s)</h4>}
      <Carousel plugins={[plugin.current]} onMouseEnter={plugin.current.stop} onMouseLeave={plugin.current.reset}>
        <CarouselContent className='flex gap-4 mb-5 relative'>
          {user?.activeCourseList.length ? (
            user?.activeCourseList.map((course: any) => (
              <CarouselItem key={course.courseId} className='relative max-w-[383px] p-0 rounded-lg overflow-hidden'>
                <CourseCard2 data={course} />
              </CarouselItem>
            ))
          ) : (
            <div className='flex flex-col items-center justify-center w-full h-[200px] gap-4'>
              <Image src={empty} alt='empty' width={100} height={100} className='w-[100px] h-auto' />
              <p className='text-[#666666] text-center'>No courses yet</p>
            </div>
          )}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

const ProfilePage = () => {
  const { data: user, status } = useGetUser();
  const { mutation } = useUpdateUser();
  const [formDirty, setFormDirty] = useState(false);

  const chapterSchema = z.object({
    skills: z.array(z.string()).optional(),
    about: z.string().optional(),
  });

  const form = useForm<z.infer<typeof chapterSchema>>({
    resolver: zodResolver(chapterSchema),
    mode: "onChange",
  });
  const [skills, setSkills] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      form.reset({
        about: user.about || "",
        skills: user.skills || [],
      });
      setSkills(user.skills);
    }
  }, [user]);

  const onSubmit = (values: z.infer<typeof chapterSchema>) => {
    mutation.mutate(
      {
        ...values,
        userId: user?._id,
      },
      {
        onSuccess: () => window.location.reload(),
      }
    );
  };

  const [editAbout, setEditAbout] = useState(false);
  const [editSkills, setEditSkills] = useState(false);
  // Handle textarea change for about section
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormDirty(true);
    const textarea = e.target;
    const newValue = textarea.value;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
    form.setValue("about", newValue); // Update the form state for the 'about' field
  };

  // Handle adding a skill
  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setFormDirty(true);
    if (e.key === "Enter") {
      e.preventDefault();
      const skill = e.currentTarget.value.trim();
      if (skill && !skills.includes(skill)) {
        const updatedSkills = [...skills, skill];
        setSkills(updatedSkills); // Update the skills state
        form.setValue("skills", updatedSkills); // Update the form state
        e.currentTarget.value = ""; // Reset the input field
      }
    }
  };

  // Handle removing a skill
  const handleRemoveSkill = (skill: string) => {
    setFormDirty(true);
    const updatedSkills = skills.filter((s) => s !== skill);
    setSkills(updatedSkills); // Update the skills state
    form.setValue("skills", updatedSkills); // Update the form state
  };

  // If the user data is not yet loaded, show a skeleton loading screen
  if (status !== "success") return <SkeletonCard2 />;
  else
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='max-w-[640px] flex flex-col gap-10 mx-auto sm:px-5 py-4 sm:mt-14 mb-10'>
            <div className='flex flex-col gap-4'>
              <h6 className='mb-2'>Complete your profile</h6>
              <p>
                Please complete your profile{" "}
                {user.about && user.skills.length ? "(3/3)" : user.about || user.skills.length ? "(2/3)" : "(1/3)"}
              </p>
            </div>
            <div className='flex flex-col gap-4 relative'>
              <h6>About</h6>
              <EditableField
                field={form.register("about")}
                className='text-[16px] leading-normal z-50 p-0 h-[75px] border-4'
                placeHolder='Enter description'
                onToggleEdit={() => setEditAbout(!editAbout)}
                handleTextareaChange={handleTextareaChange}
                isEditing={editAbout}
              />
            </div>

            {/* Skills Section */}
            <div className='flex flex-col gap-4 relative'>
              <h6>Skills</h6>
              <EditToggleButton2 isEditing={editSkills} onClick={() => setEditSkills(!editSkills)} />

              <div className='flex gap-2 flex-wrap'>
                {skills.length > 0
                  ? skills?.map((skill, index) => (
                      <div className='border flex gap-2 border-gray-800 rounded-lg px-4 py-1' key={index}>
                        {skill}
                        <span
                          onClick={() => handleRemoveSkill(skill)}
                          className='text-yellow-500 hover:text-white cursor-pointer'
                        >
                          &times;
                        </span>
                      </div>
                    ))
                  : "..."}
              </div>
              {editSkills && (
                <Input
                  type='text'
                  placeholder='Type and press Enter to add a skill'
                  className='border-2 border-gray-800 rounded-lg p-2 mt-2 w-full'
                  onKeyDown={handleAddSkill}
                />
              )}
            </div>
            {formDirty && (
              <Button variant={"success"} className='max-w-[150px] mr-0' type='submit'>
                {mutation.isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : "Save"}
              </Button>
            )}
          </div>
        </form>
      </Form>
    );
};

export default Profile;

const profileTab = [
  {
    value: "Profile",
    component: <ProfilePage />,
  },
  {
    value: "Courses",
    component: <Courses />,
  },
];
