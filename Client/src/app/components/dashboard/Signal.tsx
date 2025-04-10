"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signalSchema } from "@/app/components/schema/Forms";
import { Textarea } from "@/components/ui/textarea";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useGetSignal, usePostSignal, useUpdateSignal } from "@/hooks/signal";
import { SkeletonCard1 } from "@/components/ui/skeleton";

export const CreateSignal = () => {
  const [selectedPair, setSelectedPair] = useState<string | null>(null);
  const [orderType, setOrderType] = useState("");
  const { data: session } = useSession();
  const { mutation } = usePostSignal();

  const form = useForm<z.infer<typeof signalSchema>>({
    resolver: zodResolver(signalSchema),
  });

  const onSubmit = (values: z.infer<typeof signalSchema>) => {
    console.log(values);
    mutation.mutate({ ...values, orderType: orderType });
  };
  const handleDraftSubmit = (values: z.infer<typeof signalSchema>) => {
    console.log(values);
    mutation.mutate({ ...values, isDraft: "Draft", userId: session?.user?.id, orderType: orderType });
  };

  return (
    <div className='grid gap-10 md:grid-cols-[500px,1fr]'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
          <FormField
            control={form.control}
            name='currency'
            render={({ field }) => (
              <FormItem>
                <Popover>
                  <PopoverTrigger asChild className='text-black'>
                    <Button
                      variant='secondary'
                      className='rounded-md py-0 px-3 text-white ml-0 border-gray-800 w-full hover:text-white justify-between hover:bg-black'
                      role='combobox'
                      size={"sm"}
                    >
                      {!field.value ? "Select Currency Pair" : field.value}
                      <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-full p-0 bg-black'>
                    <Command>
                      <CommandInput placeholder='Search currency pairs...' />
                      <CommandList>
                        <CommandEmpty>No currency pair found.</CommandEmpty>
                        <CommandGroup>
                          {Pairs?.map((pair) => (
                            <CommandItem
                              value={pair}
                              key={pair}
                              onSelect={() => {
                                form.setValue("currency", pair);
                                setSelectedPair(pair);
                              }}
                            >
                              <Check
                                className={cn("mr-2 h-4 w-4", pair === field.value ? "opacity-100" : "opacity-0")}
                              />
                              {pair}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='grid grid-cols-2'>
            <Button
              type='button'
              className='w-full m-0 rounded-e-sm'
              variant={orderType === "BUY" ? "success" : "default"}
              onClick={() => setOrderType("BUY")}
            >
              Buy
            </Button>
            <Button
              className='w-full m-0 rounded-s-sm'
              type='button'
              variant={orderType === "SELL" ? "destructive" : "default"}
              onClick={() => setOrderType("SELL")}
            >
              Sell
            </Button>
          </div>

          <div className='flex flex-col gap-4'>
            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem>
                  <Input type='text' placeholder='Entry price' {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='profit1'
              render={({ field }) => (
                <FormItem>
                  <Input type='text' placeholder='Take profit Level 1' {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='profit2'
              render={({ field }) => (
                <FormItem>
                  <Input type='text' placeholder='Take profit Level 2' {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='profit3'
              render={({ field }) => (
                <FormItem>
                  <Input type='text' placeholder='Take profit Level 3' {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='stopLoss'
              render={({ field }) => (
                <FormItem>
                  <Input type='text' placeholder='Stop Loss' {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='info'
              render={({ field }) => (
                <FormItem>
                  <Textarea placeholder='Additional info...' {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid mt-5 grid-cols-2 gap-3'>
              <Button onClick={form.handleSubmit(handleDraftSubmit)} type='button' className='w-full'>
                {mutation.isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : "Save Draft"}
              </Button>
              <Button variant={"success"} className='w-full m-0' type='submit'>
                {mutation.isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : "Post"}
              </Button>
            </div>
          </div>
        </form>
      </Form>

      {/* Forex Chart Section */}
      <div className='flex w-full items-center justify-center'>
        {selectedPair ? (
          <span className='h-[650px] w-full'>
            <TradingViewWidget selectedPair={selectedPair} />
          </span>
        ) : (
          <p className='text-center'>Select a currency pair to view the live chart.</p>
        )}
      </div>
    </div>
  );
};

export const UpdateSignal = ({ signalId }: any) => {
  const [selectedPair, setSelectedPair] = useState<string | null>(null);
  const [orderType, setOrderType] = useState("");
  const { data: session } = useSession();
  const { data: signal, isLoading } = useGetSignal(signalId);
  const { mutation } = useUpdateSignal();

  const form = useForm<z.infer<typeof signalSchema>>({
    resolver: zodResolver(signalSchema),
  });

  useEffect(() => {
    if (signal) {
      form.reset({
        currency: signal.currency || "",
        price: signal.price || "",
        profit1: signal.profit1 || "",
        profit2: signal.profit2 || "",
        profit3: signal.profit3 || "",
        stopLoss: signal.stopLoss || "",
        info: signal.info || "",
      });
      setOrderType(signal.orderType);
    }
  }, [signal]);

  const onSubmit = (values: z.infer<typeof signalSchema>) => {
    console.log(values);
    mutation.mutate({ ...values, orderType: orderType, isDraft: "Undraft" });
  };

  const handleDraftSubmit = (values: z.infer<typeof signalSchema>) => {
    console.log(values);
    mutation.mutate({ ...values, isDraft: "Draft", userId: session?.user?.id, orderType: orderType });
  };

  if (isLoading) return <SkeletonCard1 />;
  else
    return (
      <div className='grid gap-10 md:grid-cols-[500px,1fr]'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
            <FormField
              control={form.control}
              name='currency'
              render={({ field }) => (
                <FormItem>
                  <Popover>
                    <PopoverTrigger asChild className='text-black'>
                      <Button
                        variant='secondary'
                        className='rounded-md py-0 px-3 text-white ml-0 border-gray-800 w-full hover:text-white justify-between hover:bg-black'
                        role='combobox'
                        size={"sm"}
                      >
                        {!field.value ? "Select Currency Pair" : field.value}
                        <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-full p-0 bg-black'>
                      <Command>
                        <CommandInput placeholder='Search currency pairs...' />
                        <CommandList>
                          <CommandEmpty>No currency pair found.</CommandEmpty>
                          <CommandGroup>
                            {Pairs?.map((pair) => (
                              <CommandItem
                                value={pair}
                                key={pair}
                                onSelect={() => {
                                  form.setValue("currency", pair);
                                  setSelectedPair(pair);
                                }}
                              >
                                <Check
                                  className={cn("mr-2 h-4 w-4", pair === field.value ? "opacity-100" : "opacity-0")}
                                />
                                {pair}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2'>
              <Button
                type='button'
                className='w-full m-0 rounded-e-sm'
                variant={orderType === "BUY" ? "success" : "default"}
                onClick={() => setOrderType("BUY")}
              >
                Buy
              </Button>
              <Button
                className='w-full m-0 rounded-s-sm'
                type='button'
                variant={orderType === "SELL" ? "destructive" : "default"}
                onClick={() => setOrderType("SELL")}
              >
                Sell
              </Button>
            </div>

            <div className='flex flex-col gap-4'>
              <FormField
                control={form.control}
                name='price'
                render={({ field }) => (
                  <FormItem>
                    <Input type='text' placeholder='Entry price' {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='profit1'
                render={({ field }) => (
                  <FormItem>
                    <Input type='text' placeholder='Take profit Level 1' {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='profit2'
                render={({ field }) => (
                  <FormItem>
                    <Input type='text' placeholder='Take profit Level 2' {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='profit3'
                render={({ field }) => (
                  <FormItem>
                    <Input type='text' placeholder='Take profit Level 3' {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='stopLoss'
                render={({ field }) => (
                  <FormItem>
                    <Input type='text' placeholder='Stop Loss' {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='info'
                render={({ field }) => (
                  <FormItem>
                    <Textarea placeholder='Additional info...' {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid mt-5 grid-cols-2 gap-3'>
                <Button onClick={form.handleSubmit(handleDraftSubmit)} type='button' className='w-full'>
                  {mutation.isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : "Save Draft"}
                </Button>
                <Button variant={"success"} className='w-full m-0' type='submit'>
                  {mutation.isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : "Post"}
                </Button>
              </div>
            </div>
          </form>
        </Form>

        {/* Forex Chart Section */}
        <div className='flex w-full items-center justify-center'>
          {selectedPair ? (
            <span className='h-[650px] w-full'>
              <TradingViewWidget selectedPair={selectedPair} />
            </span>
          ) : (
            <p className='text-center'>Select a currency pair to view the live chart.</p>
          )}
        </div>
      </div>
    );
};

const Pairs = [
  "EUR/USD", // Euro/US Dollar
  "USD/JPY", // US Dollar/Japanese Yen
  "GBP/USD", // British Pound/US Dollar
  "AUD/USD", // Australian Dollar/US Dollar
  "USD/CHF", // US Dollar/Swiss Franc
  "NZD/USD", // New Zealand Dollar/US Dollar
  "USD/CAD", // US Dollar/Canadian Dollar

  // Cross-Currency Pairs (Majors without USD)
  "EUR/JPY", // Euro/Japanese Yen
  "EUR/GBP", // Euro/British Pound
  "EUR/CHF", // Euro/Swiss Franc
  "EUR/AUD", // Euro/Australian Dollar
  "EUR/NZD", // Euro/New Zealand Dollar
  "GBP/JPY", // British Pound/Japanese Yen
  "GBP/CHF", // British Pound/Swiss Franc
  "GBP/AUD", // British Pound/Australian Dollar
  "GBP/CAD", // British Pound/Canadian Dollar
  "AUD/JPY", // Australian Dollar/Japanese Yen
  "AUD/CHF", // Australian Dollar/Swiss Franc
  "AUD/CAD", // Australian Dollar/Canadian Dollar
  "NZD/JPY", // New Zealand Dollar/Japanese Yen
  "NZD/CHF", // New Zealand Dollar/Swiss Franc
  "CAD/JPY", // Canadian Dollar/Japanese Yen
  "CHF/JPY", // Swiss Franc/Japanese Yen

  // Less Common Pairs (Exotics)
  "USD/HKD", // US Dollar/Hong Kong Dollar
  "USD/SGD", // US Dollar/Singapore Dollar
  "USD/TRY", // US Dollar/Turkish Lira
  "USD/MXN", // US Dollar/Mexican Peso
  "USD/ZAR", // US Dollar/South African Rand
  "USD/THB", // US Dollar/Thai Baht
  "USD/DKK", // US Dollar/Danish Krone
  "USD/SEK", // US Dollar/Swedish Krona
  "USD/NOK", // US Dollar/Norwegian Krone
  "USD/PLN", // US Dollar/Polish Zloty
  "USD/HUF", // US Dollar/Hungarian Forint
  "USD/CZK", // US Dollar/Czech Koruna

  // Exotic Cross-Currency Pairs
  "EUR/TRY", // Euro/Turkish Lira
  "EUR/ZAR", // Euro/South African Rand
  "GBP/SGD", // British Pound/Singapore Dollar
  "AUD/SGD", // Australian Dollar/Singapore Dollar
  "NZD/SGD", // New Zealand Dollar/Singapore Dollar
  "CHF/SGD", // Swiss Franc/Singapore Dollar
  "EUR/PLN", // Euro/Polish Zloty
  "EUR/HUF", // Euro/Hungarian Forint
  "EUR/CZK", // Euro/Czech Koruna
  "GBP/PLN", // British Pound/Polish Zloty
  "GBP/HUF", // British Pound/Hungarian Forint
  "GBP/CZK", // British Pound/Czech Koruna
  "CHF/PLN", // Swiss Franc/Polish Zloty
  "CHF/HUF", // Swiss Franc/Hungarian Forint
  "CHF/CZK", // Swiss Franc/Czech Koruna

  // Exotic Pairs from other Regions
  "USD/CNY", // US Dollar/Chinese Yuan
  "USD/INR", // US Dollar/Indian Rupee
  "USD/BRL", // US Dollar/Brazilian Real
  "USD/RUB", // US Dollar/Russian Ruble
  "USD/KRW", // US Dollar/South Korean Won
  "USD/IDR", // US Dollar/Indonesian Rupiah
  "USD/TWD", // US Dollar/Taiwan Dollar
  "USD/MYR", // US Dollar/Malaysian Ringgit
  "USD/PHP", // US Dollar/Philippine Peso
  "USD/VND", // US Dollar/Vietnamese Dong
];

const TradingViewWidget = ({ selectedPair }: any) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = ""; // Clear the widget container
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;

    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: selectedPair ? `FX:${selectedPair.replace("/", "")}` : "FX:EURUSD", // Set selected pair or default
      interval: "D",
      timezone: "Etc/UTC",
      theme: "light",
      style: "1",
      locale: "en",
      withdateranges: true,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      details: true,
      hotlist: true,
      calendar: false,
      show_popup_button: true,
      popup_width: "1000",
      popup_height: "650",
      support_host: "https://www.tradingview.com",
    });

    containerRef.current?.appendChild(script);
  }, [selectedPair]);

  return (
    <div className='tradingview-widget-container' ref={containerRef} style={{ height: "90vh", width: "100%" }}>
      <div className='tradingview-widget-container__widget' style={{ height: "90vh", width: "100%" }}></div>
    </div>
  );
};
