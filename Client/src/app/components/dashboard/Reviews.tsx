"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { formSchemaReview } from "@/app/components/schema/Forms";
import { Loader2, Star, ThumbsUp, XCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useGetStatistics } from "@/hooks/statistics";
import Star1 from "@/app/components/assets/images/dashboard/star1.svg";
import Star2 from "@/app/components/assets/images/dashboard/star2.svg";
import Star3 from "@/app/components/assets/images/dashboard/star3.svg";
import Star4 from "@/app/components/assets/images/dashboard/star4.svg";
import Star5 from "@/app/components/assets/images/dashboard/star5.svg";
import { Label } from "@/components/ui/label";
import { useGetReview, useGetReviewByCourseId, usePostReview, useUpdateReview } from "@/hooks/review";
import { useSession } from "next-auth/react";
import { ReviewsCardBlack, ReviewsCardWhite } from "./ReviewsCard";
import { AlertDialogCancel } from "@/components/ui/alert-dialog";
import { SkeletonCard1 } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { formatDateShort } from "@/hooks/auth";

export const Reviews = ({ courseId }: any) => {
  const { data: reviews, status } = useGetReviewByCourseId(courseId);
  console.log(reviews);

  // Initialize review counts state
  const [reviewsCount, setReviewsCount] = useState([
    { icon: Star5, count: 0 },
    { icon: Star4, count: 0 },
    { icon: Star3, count: 0 },
    { icon: Star2, count: 0 },
    { icon: Star1, count: 0 },
  ]);

  useEffect(() => {
    if (reviews) {
      const counts = [0, 0, 0, 0, 0]; // Array to hold counts for stars 1 to 5

      // Count the reviews based on star ratings
      reviews.forEach((review: any) => {
        if (review.star >= 1 && review.star <= 5) {
          counts[review.star - 1]++; // Increment the appropriate index
        }
      });

      // Update the reviewsCount state based on the calculated counts
      setReviewsCount((prev) =>
        prev.map((item, index) => ({
          ...item,
          count: counts[index],
        }))
      );
    }
  }, [reviews]); // Run effect when reviews change

  if (status !== "success") return <SkeletonCard1 />;
  else
    return (
      <div className='flex flex-col max-w-screen-xl px-4 sm:px-0 mx-auto'>
        <h6 className='mt-[20px] text-[#979797]'>Learner Reviews</h6>
        <div className='flex flex-col lg:flex-row gap-16 mt-8 justify-between'>
          <div className='flex flex-col gap-5'>
            <span className='flex items-center gap-4'>
              <span className='flex gap-2 items-center'>
                <Star fill='#FFBE00' className='text-[#FFBE00] w-5' />
                <h4>{reviews.length}</h4>
                <p> reviews</p>
              </span>
            </span>
            {reviewsCount.map((review, index) => (
              <span key={index} className='flex items-center gap-3'>
                <Image src={review.icon} alt='Reviews' width={100} height={20} className='w-[100px] h-[20px]' />
                <p>{review.count} reviews</p>
              </span>
            ))}
          </div>
          <div className='flex flex-col sm:gap-5 gap-8 max-w-[645px]'>
            {reviews?.length > 0 ? (
              reviews.map((review: any) => (
                <div className='flex flex-col sm:flex-row w-full gap-4 sm:gap-10 md:gap-32 justify-between'>
                  <span className='flex gap-3 items-center'>
                    <Image
                      src={review?.user?.avatar?.url || "/noavatar.png"}
                      alt='Avatar'
                      width={500}
                      height={500}
                      className='w-[60px] object-cover h-[60px] rounded-full'
                    />
                    <h4>
                      {review?.user?.firstName || review?.user?.username} {review?.user?.lastName}
                    </h4>
                  </span>
                  <div className='flex flex-col gap-3'>
                    <span className='flex items-center gap-4'>
                      <span className='flex gap-2 items-center'>
                        <Star fill='#FFBE00' className='text-[#FFBE00] w-5' />
                        <h4>{review?.star}</h4>
                      </span>
                      <p>{formatDateShort(review?.createdAt)}</p>
                    </span>
                    <Label className='text-[#979797]'>{review?.response}</Label>
                  </div>
                </div>
              ))
            ) : (
              <h6>No Reviews</h6>
            )}
          </div>
        </div>
      </div>
    );
};

export const ReviewsStats = () => {
  const { data: statistics } = useGetStatistics();

  const reviewStats = [
    {
      title: "Total Reviews",
      totalCount: statistics?.reviewStats?.total || 0,
    },
    {
      title: "1 Star Reviews",
      rating: 1,
      count: statistics?.reviewStats?.one,
    },
    {
      title: "2 Star Reviews",
      rating: 2,
      count: statistics?.reviewStats?.two,
    },
    {
      title: "3 Star Reviews",
      rating: 3,
      count: statistics?.reviewStats?.three,
    },
    {
      title: "4 Star Reviews",
      rating: 4,
      count: statistics?.reviewStats?.four,
    },
    {
      title: "5 Star Reviews",
      rating: 5,
      count: statistics?.reviewStats?.five,
    },
  ];
  return (
    <div className='grid grid-cols-2 lg:grid-cols-3 max-w-full gap-4'>
      {reviewStats?.map((review: any) => (
        <ReviewsCardWhite review={review} />
      ))}
    </div>
  );
};

export const UsersStats = ({ course }: any) => {
  const { data: statistics } = useGetStatistics();

  console.log(statistics);
  const userStats = [
    {
      title: "Total Users",
      count: statistics?.userStats?.totalUsers || 0,
    },
    {
      title: "Active Users",
      count: statistics?.userStats?.totalUsers - statistics?.userStats?.inactiveUsers || 0,
    },
    {
      title: "Inactive Users",
      count: statistics?.userStats?.inactiveUsers || 0,
    },
    {
      title: "Courses Completed",
      percentage: statistics?.userStats?.courseCompleted || 0,
    },
    {
      title: "Users Enrollment Rate",
      percentage: statistics?.userStats?.userEnrolleRate || 0,
    },
    {
      title: "Users Churn Rate",
      percentage: statistics?.userStats?.userChunRate || 0,
    },
  ];
  return (
    <div className={`grid grid-cols-2 ${!course && "lg:grid-cols-3"} max-w-full gap-4`}>
      {userStats.map((item: any) => (
        <ReviewsCardBlack user={item} />
      ))}
    </div>
  );
};

export const Review = ({ data, setIsOpen }: any) => {
  const { mutation } = usePostReview();
  const { mutation: update } = useUpdateReview();
  const { data: review } = useGetReview(data?._id);
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof formSchemaReview>>({
    resolver: zodResolver(formSchemaReview),
  });

  React.useEffect(() => {
    if (review) {
      form.reset({
        response: review.response || "",
        star: review.star || 1, // Set the default star to review.star
      });
    }
  }, [review, form]); // Make sure to include form in the dependency array

  const onSubmit = (values: z.infer<typeof formSchemaReview>) => {
    console.log(review);
    console.log(values);

    if (review)
      update.mutate(
        {
          ...values,
          reviewId: review?._id,
        },
        {
          onSuccess: () => setIsOpen(false),
        }
      );
    else
      mutation.mutate(
        {
          ...values,
          userId: session?.user?.id,
          courseId: data?._id,
          instructorId: data?.user,
        },
        {
          onSuccess: () => setIsOpen(false),
        }
      );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='grid grid-cols-[40px,1fr] gap-8 items-start'>
        <div className={`p-[5px] rounded-full w-10 bg-[#FFFAEB]`}>
          <div className='flex items-center justify-center p-[5px] rounded-full w-full bg-[#FFF3CD]'>
            <ThumbsUp className='w-4 text-red-600' />
          </div>
        </div>
        <div>
          <div className='flex mb-5 justify-between items-center'>
            <h6>Rate this Course</h6>
            <AlertDialogCancel>
              <XCircle className='hover:text-yellow-500 cursor-pointer' />
            </AlertDialogCancel>
          </div>

          <FormField
            control={form.control}
            name='star'
            render={({ field }) => (
              <FormItem className='mt-4'>
                <StarRating
                  onRatingSelect={(value) => form.setValue("star", value)}
                  defaultStar={field.value} // Pass the current star value to StarRating
                />
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Review Text Area */}
          <FormField
            control={form.control}
            name='response'
            render={({ field }) => (
              <FormItem className='mt-4'>
                <Textarea placeholder='Enter response' className='h-20 w-full border-white' {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' variant={"success"} className='mr-0 mt-5'>
            {mutation.isPending || update.isPending ? <Loader2 className='h-4 w-5 animate-spin' /> : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

const StarRating = ({
  onRatingSelect,
  defaultStar,
}: {
  onRatingSelect: (rating: number) => void;
  defaultStar?: number;
}) => {
  const [rating, setRating] = React.useState<number>(defaultStar || 0); // Initialize with defaultStar

  React.useEffect(() => {
    setRating(defaultStar || 0); // Update rating if defaultStar changes
  }, [defaultStar]);

  const handleRating = (ratingValue: number) => {
    setRating(ratingValue);
    onRatingSelect(ratingValue); // Pass the selected rating back to the parent
  };

  return (
    <div className='flex'>
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <Star
            key={index}
            fill={starValue <= rating ? "#FFD700" : "none"}
            className='cursor-pointer h-7 ml-1 w-7 text-[#FFD700]'
            onClick={() => handleRating(starValue)}
          />
        );
      })}
    </div>
  );
};
