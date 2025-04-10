import React from "react";

export const ReviewsCardWhite = ({
  review,
}: {
  review: { title?: string; totalCount: number; rating: number; count: number };
}) => {
  console.log(review);
  return (
    <div className='flex flex-col gap-2 max-w-full h-[120px] rounded-lg bg-white p-6'>
      <p className='text-[#666666]'> {review.title} </p>
      {review.totalCount >= 0 ? (
        <h6 className='text-black text-[24px]'> {review.totalCount} </h6>
      ) : (
        <div className='flex items-center gap-2'>
          <h6 className='text-black text-[24px]'> {review.count} </h6>
          <h6
            className={`rounded-md flex justify-center items-center w-[39px] text-sm h-[23px] ${
              review.rating === 1
                ? "bg-[#EF4444]"
                : review.rating === 2
                ? "bg-[#CA8A04]"
                : review.rating === 3
                ? "bg-[#FACC15]"
                : review.rating === 4
                ? "bg-[#4ADE80]"
                : "bg-[#16A34A]"
            }`}
          >
            {review.rating}.0
          </h6>
        </div>
      )}
    </div>
  );
};

export const ReviewsCardBlack = ({
  user,
}: {
  user: {
    title: string;
    percentage: number;
    count: number;
  };
}) => {
  console.log(user);
  return (
    <div className='flex flex-col gap-2 max-w-full h-[120px] rounded-lg border border-gray-800 bg-[#000000] py-3 px-5'>
      <p> {user.title} </p>
      {user.percentage >= 0 ? (
        <div className='flex items-center gap-2'>
          <h6 className='text-[24px]'> {user.percentage}%</h6>
        </div>
      ) : (
        <h6 className='text-[24px]'> {user.count > 999 ? <>{user.count / 1000}k</> : user.count}</h6>
      )}
    </div>
  );
};
