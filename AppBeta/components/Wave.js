import React from "react";
import Svg, { Path } from "react-native-svg";

export default function Wave() {
  return (
    <Svg height="220" width="100%" viewBox="0 0 1440 320" style={{ position: "absolute", top: 0 }}>
      <Path
        fill="#4b6cb7"
        d="M0,160L48,165.3C96,171,192,181,288,170.7C384,160,480,128,576,138.7C672,149,768,203,864,197.3C960,192,1056,128,1152,90.7C1248,53,1344,43,1392,37.3L1440,32L1440,0L1392,0C1344,0,1248,0,1152..."
      />
    </Svg>
  );
}
