"use client";
import React, { useEffect } from "react";

const TawkTo: React.FC = () => {
  useEffect(() => {
    // Inject Tawk.to script when the component mounts
    const script = document.createElement("script");
    script.src = "https://embed.tawk.to/671cc7644304e3196ad895ea/1ib46loug";
    script.async = true;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    document.body.appendChild(script);

    // Clean up the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null; // The component doesn't render anything
};

export default TawkTo;
