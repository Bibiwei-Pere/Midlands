"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Notifications from "@/app/components/dashboard/Notifications";
import Profile from "@/app/components/dashboard/Profile";
import { ContainerDashboard } from "@/components/ui/containers";
import { PaymentSetup } from "@/app/components/dashboard/Payment";
import { DeletedAccount } from "@/app/components/dashboard/DeleteAccount";
import { useRouter } from "next/navigation";

const Settings = ({ params }: any) => {
  const { tab } = params;
  const navigation = useRouter();
  return (
    <ContainerDashboard>
      <h1 className='text-left sm:mb-2'>Settings</h1>
      <Tabs defaultValue={decodeURIComponent(tab)} className='w-full sm:mt-4'>
        <TabsList>
          {settings.map((setting) => (
            <TabsTrigger onClick={() => navigation.push(setting.value)} value={setting.value} key={setting.value}>
              {setting.value}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className='border-b border-gray-800'></div>
        <div className='max-w-full'>
          {settings.map((setting) => (
            <TabsContent value={setting.value} key={setting.value} className='max-w-full mx-auto sm:my-2 pb-20'>
              {setting.component}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </ContainerDashboard>
  );
};

const settings = [
  {
    value: "Profile",
    component: <Profile />,
  },
  {
    value: "Privacy and Notifications",
    component: <Notifications />,
  },
  {
    value: "Payment",
    component: <PaymentSetup />,
  },
  {
    value: "Account Deactivation",
    component: <DeletedAccount />,
  },
];

export default Settings;
