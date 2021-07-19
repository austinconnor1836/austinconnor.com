import React, { useEffect } from "react";
import { styled, Typography } from "@material-ui/core";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const AboutMeContainer = styled("div")({
  background: "hsl(204, 86%, 53%)",
  // background:
  // "url(https://i.pinimg.com/originals/44/6e/3b/446e3b79395a287ca32f7977dd83b290.jpg)",
  // backgroundSize: "cover",
  display: "flex",
  // flexFlow: "column",
  height: "80vh",
  justifyContent: "center",
});

const SmallerContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const Home = () => {
  return (
    <div style={{ height: "100%" }}>
      <AboutMeContainer>
        <SmallerContainer>
          <Canvas>
            <mesh>
              <OrbitControls />
              <ambientLight intensity={0.5} />
              <boxBufferGeometry attach="geometry" />
              <meshLambertMaterial attach="material" color="hotpink" />
            </mesh>
          </Canvas>
          <Typography variant="h3">Hello, my name is Austin.</Typography>
        </SmallerContainer>
      </AboutMeContainer>
    </div>
  );
};

export default Home;
