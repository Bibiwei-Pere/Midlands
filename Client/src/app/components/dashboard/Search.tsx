"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { searchSchema } from "../schema/Forms";
import { useGetAllCourse } from "@/hooks/course";
import { ContainerDashboard } from "@/components/ui/containers";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CircleCheckbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Form, FormField } from "@/components/ui/form";
import { CourseCardCatalogue } from "./CourseCard";
import { SkeletonCard3 } from "@/components/ui/skeleton";
import Image from "next/image";
import empty from "../../components/assets/images/dashboard/empty.svg";
import { Star } from "lucide-react";
import { Input } from "@/components/ui/input";

const Search = ({ setIsSearch }: { setIsSearch: any }) => {
  // Update the filters state to include all possible filter fields
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [filters, setFilters] = useState<{
    searchQuery: string;
    category?: string;
    duration?: number;
    ratings?: number;
    price?: number;
  }>({ searchQuery });

  useEffect(() => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      searchQuery,
    }));
  }, [searchQuery]);

  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
  });

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value); // Update search query
  };

  // Modify the onSubmit function to update filters state properly
  const onSubmit = (values: z.infer<typeof searchSchema>) =>
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...values, // Update the filters with form values
    }));

  // Fetch filtered courses using the custom hook
  const { data: allCourses, status } = useGetAllCourse(filters);

  return (
    <ContainerDashboard
      onClick={(e) => e.stopPropagation()}
      className='bg-black grid grid-cols-1 gap-10 md:grid-cols-[300px,1fr] w-full'
    >
      {/* Main Accordion for All Filters */}
      <Accordion type='single' className='relative border-r pr-3 border-gray-800' collapsible defaultValue='filters'>
        <AccordionItem className='px-0' value='filters'>
          <Input
            onChange={handleSearchInput}
            placeholder='Search courses'
            className='hidden sm:flex bg-white placeholder:text-gray-600 text-black'
          />
          <AccordionTrigger>Filters</AccordionTrigger>
          <AccordionContent className=' max-w-full'>
            {/* Form Inside Accordion */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6 p-5'>
                {/* Nested Accordion for Category Filter */}
                <Accordion type='single' collapsible defaultValue='category'>
                  <AccordionItem className='max-w-full px-0' value='category'>
                    <AccordionTrigger>Category</AccordionTrigger>
                    <AccordionContent>
                      <ul className='flex flex-col gap-3'>
                        {categories.map((item) => (
                          <li className='flex items-center gap-3' key={item}>
                            <FormField
                              control={form.control}
                              name='category'
                              render={({ field }) => (
                                <>
                                  <CircleCheckbox
                                    checked={field.value === item}
                                    onCheckedChange={() => field.onChange(field.value === item ? "" : item)}
                                  />
                                  <p>{item}</p>
                                </>
                              )}
                            />
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Nested Accordion for Duration Filter */}
                <Accordion type='single' collapsible>
                  <AccordionItem className='max-w-full px-0' value='duration'>
                    <AccordionTrigger>Duration</AccordionTrigger>
                    <AccordionContent>
                      <ul className='flex flex-col gap-3'>
                        {duration.map((item) => (
                          <li className='flex items-center gap-3' key={item.name}>
                            <FormField
                              control={form.control}
                              name='duration'
                              render={({ field }) => (
                                <>
                                  <CircleCheckbox
                                    checked={field.value === item.id}
                                    onCheckedChange={() => field.onChange(field.value === item.id ? "" : item.id)}
                                  />
                                  <p>{item.name} hours</p>
                                </>
                              )}
                            />
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Nested Accordion for Ratings Filter */}
                <Accordion type='single' collapsible>
                  <AccordionItem className='max-w-full px-0' value='ratings'>
                    <AccordionTrigger>Ratings</AccordionTrigger>
                    <AccordionContent>
                      <ul className='flex flex-col gap-3'>
                        {rating.map((item) => (
                          <li className='flex items-center gap-3' key={item}>
                            <FormField
                              control={form.control}
                              name='ratings'
                              render={({ field }) => (
                                <>
                                  <CircleCheckbox
                                    checked={field.value === item}
                                    onCheckedChange={() => field.onChange(field.value === item ? "" : item)}
                                  />
                                  <p>{item}</p>
                                  <span className='flex gap-[2px]'>
                                    {Array.from({ length: item }).map((_, index) => (
                                      <Star fill='#34A853' className='text-[#34A853] h-4 w-4 m-0' key={index} />
                                    ))}
                                  </span>
                                </>
                              )}
                            />
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Nested Accordion for Price Filter */}
                <Accordion type='single' collapsible>
                  <AccordionItem className='max-w-full px-0' value='price'>
                    <AccordionTrigger>Price</AccordionTrigger>
                    <AccordionContent>
                      <AccordionContent>
                        <div className='border-b pb-4 border-gray-800 flex flex-col gap-5'>
                          <Label>Up to ₦{form.watch("price") || 500}k</Label>
                          <Slider
                            value={[form.watch("price") ?? 10]} // Initial value or form value
                            onValueChange={(value: number[]) => form.setValue("price", value[0])} // Handle array of values
                            max={500} // For example, you can set your max price here
                          />
                        </div>
                      </AccordionContent>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Apply Filters Button */}
                <Button type='submit' className='btn-primary mt-4'>
                  Apply Filters
                </Button>
              </form>
            </Form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Display Filtered Courses */}
      {status !== "success" ? (
        <SkeletonCard3 />
      ) : (
        <div className='flex flex-wrap items-start justify-start gap-6 mt-6'>
          {allCourses?.length ? (
            <div className='flex flex-col gap-3'>
              <h6>{allCourses?.length} results found</h6>
              <div className='flex flex-wrap gap-5'>
                {allCourses.map((course: any) => (
                  <div key={course._id} className='relative max-w-[380px] p-0 rounded-lg overflow-hidden'>
                    <CourseCardCatalogue
                      course={course}
                      setIsSearch={setIsSearch}
                      classname='border-2 overflow-hidden border-white'
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center w-full h-[200px] gap-4'>
              <Image src={empty} alt='empty' width={100} height={100} className='w-[100px] h-auto' />
              <p className='text-[#666666] text-center'>No result found</p>
            </div>
          )}
        </div>
      )}
    </ContainerDashboard>
  );
};

export default Search;

export const categories = ["Beginner", "Intermediate", "Advanced/Strategy"];
const rating = [5, 4, 3, 2, 1];
const duration = [
  {
    name: "0-3",
    id: 3,
  },
  {
    name: "3-10",
    id: 10,
  },
  {
    name: "10",
    id: 100,
  },
];
