import React, { useState, useEffect } from "react";

export default function ResolutionChecker() {
  const [resolution, setResolution] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setResolution({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (resolution.width < 1430 || resolution.height < 700) {
    return (
      <div
        style={{
          background: "black",
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "white", textAlign: "center", padding: "50px" }}>
          Your resolution is too low. Please increase it to at least 1430x700
        </p>
      </div>
    );
  }

  return null;
}
