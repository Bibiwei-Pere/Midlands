"use client";
import React from "react";
import { ContainerDashboard, DashboardHeader } from "@/components/ui/containers";
import { useSession } from "next-auth/react";
import { CreateSignal } from "@/app/components/dashboard/Signal";

const Signal = () => {
  const { data: session } = useSession();
  return (
    <ContainerDashboard>
      <DashboardHeader>
        <h2>Signal</h2>
      </DashboardHeader>
      {session?.user.role === "Admin" && <CreateSignal />}
    </ContainerDashboard>
  );
};

export default Signal;

// const TradingViewWidget = ({ width = "100%", height = "100%", selectedPair }: any) => {
//   const containerRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     if (containerRef.current) {
//       containerRef.current.innerHTML = ""; // Clear the widget container
//     }
//     const script = document.createElement("script");
//     script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
//     script.async = true;
//     script.innerHTML = JSON.stringify({
//       colorTheme: "light",
//       dateRange: "12M",
//       showChart: true,
//       locale: "en",
//       isTransparent: false,
//       showSymbolLogo: true,
//       width,
//       height,
//       plotLineColorGrowing: "rgba(41, 98, 255, 1)",
//       plotLineColorFalling: "rgba(41, 98, 255, 1)",
//       gridLineColor: "rgba(42, 46, 57, 0)",
//       scaleFontColor: "rgba(19, 23, 34, 1)",
//       belowLineFillColorGrowing: "rgba(41, 98, 255, 0.12)",
//       belowLineFillColorFalling: "rgba(41, 98, 255, 0.12)",
//       belowLineFillColorGrowingBottom: "rgba(41, 98, 255, 0)",
//       belowLineFillColorFallingBottom: "rgba(41, 98, 255, 0)",
//       symbolActiveColor: "rgba(41, 98, 255, 0.12)",
//       tabs: [
//         {
//           title: "Forex",
//           symbols: [
//             { s: selectedPair ? `FX:${selectedPair.replace("/", "")}` : "FX:EURUSD" },
//             { s: "FX:EURUSD", d: "EUR to USD" },
//             { s: "FX:GBPUSD", d: "GBP to USD" },
//             { s: "FX:USDJPY", d: "USD to JPY" },
//             { s: "FX:USDCHF", d: "USD to CHF" },
//             { s: "FX:AUDUSD", d: "AUD to USD" },
//             { s: "FX:USDCAD", d: "USD to CAD" },
//           ],
//           originalTitle: "Forex",
//         },
//         {
//           title: "Futures",
//           symbols: [{ s: "FX:EURUSD" }, { s: "CME_MINI:MES1!" }],
//           originalTitle: "Futures",
//         },
//       ],
//     });
//     containerRef.current?.appendChild(script);
//   }, [width, height, selectedPair]);

//   return (
//     <div className='tradingview-widget-container' ref={containerRef}>
//       <div className='tradingview-widget-container__widget'></div>
//     </div>
//   );
// };
