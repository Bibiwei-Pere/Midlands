import React from "react";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUpdateUser } from "@/hooks/users";

const Role = ({ userId, handleRoleUpdate, currentRole }: any) => {
  const { mutation } = useUpdateUser();
  const userSchema = z.object({
    role: z.string().min(1, "Role field is required.").default(currentRole),
  });

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: { role: currentRole },
  });

  const onSubmit = (values: z.infer<typeof userSchema>) => {
    handleRoleUpdate(userId, values.role);
    mutation.mutate({
      ...values,
      userId,
    });
  };

  console.log(userId);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-3 max-w-[500px]'>
        <FormField
          control={form.control}
          name='role'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Roles</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder='Select user role' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='User'>User</SelectItem>
                  <SelectItem value='Teacher'>Teacher</SelectItem>
                  <SelectItem value='Admin'>Admin</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant='ghost' className='w-full mt-10' type='submit'>
          Update
        </Button>
      </form>
    </Form>
  );
};

export default Role;
