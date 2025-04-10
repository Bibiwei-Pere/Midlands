"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useRef } from "react";
import { ContainerDashboard, DashboardHeader } from "@/components/ui/containers";
import { useSession } from "next-auth/react";
import { useGetSignal } from "@/hooks/signal";
import { SkeletonCard1 } from "@/components/ui/skeleton";
import { UpdateSignal } from "@/app/components/dashboard/Signal";

const Signal = ({ params }: any) => {
  const { signalId } = params;
  const { data: signal, isLoading } = useGetSignal(signalId);
  const { data: session } = useSession();

  if (isLoading) return <SkeletonCard1 />;
  else
    return (
      <>
        <DashboardHeader>
          <h2>Signal</h2>
        </DashboardHeader>
        <ContainerDashboard>
          {session?.user.role === "Admin" ? (
            <UpdateSignal signalId={signalId} />
          ) : (
            <>
              <div className='flex flex-col gap-5'>
                <h6>{signal?.currency}</h6>
                <div className='grid grid-cols-2 max-w-[400px]'>
                  <Button
                    type='button'
                    className='w-full m-0 rounded-e-sm'
                    variant={signal?.orderType === "BUY" ? "success" : "default"}
                  >
                    Buy
                  </Button>
                  <Button
                    className='w-full m-0 rounded-s-sm'
                    type='button'
                    variant={signal?.orderType === "SELL" ? "destructive" : "default"}
                  >
                    Sell
                  </Button>
                </div>
                <p>{signal?.info}</p>
                <div className='flex gap-10 items-center'>
                  <div className='flex gap'>
                    <h5 className='text-blue-600 pr-4'>TP1: {signal?.profit1}</h5>
                    <h5 className='text-blue-600 border-x border-blue-600 px-4'>TP2: {signal?.profit2}</h5>
                    <h5 className='text-blue-600 pl-4'>TP3: {signal?.profit3}</h5>
                  </div>
                  <span className='flex gap-1'>
                    <p className='text-[#979797]'>Entry Price:</p>
                    <h5>{signal?.price}</h5>
                  </span>
                  <span className='flex gap-1'>
                    <p className='text-[#979797]'>Stop Loss:</p>
                    <h5 className='text-red-600'>{signal?.stopLoss}</h5>
                  </span>
                </div>
              </div>

              <span className='h-[650px]'>
                <TradingViewWidget selectedPair={signal?.currency} />
              </span>
            </>
          )}
        </ContainerDashboard>
      </>
    );
};

export default Signal;

const TradingViewWidget = ({ selectedPair }: any) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = ""; // Clear the widget container
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    console.log(selectedPair);
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
  }, [selectedPair]); // Re-run when the selected pair changes

  return (
    <div className='tradingview-widget-container h-[80vh]' ref={containerRef}>
      <div className='tradingview-widget-container__widget'></div>
      <div className='tradingview-widget-copyright'></div>
    </div>
  );
};
