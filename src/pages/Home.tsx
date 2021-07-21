import React, { useRef, useState } from "react";
import { Button, styled, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { a, useSpring } from "@react-spring/three";
import Boxes from "./Boxes";
// import { OrbitControls } from "@react-three/drei";
// import { TextureLoader } from "three/src/loaders/TextureLoader";
// import DescriptionIcon from "@material-ui/icons/Description";

const AboutMeContainer = styled("div")({
  background: "hsl(204, 86%, 53%)",
  display: "flex",
  height: "80vh",
  justifyContent: "center",
});

const SmallerContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  width: "40%",
});

const StyledTypography = styled(Typography)({
  paddingTop: "1rem",
});

// function Box(props: any) {
//   // This reference will give us direct access to the THREE.Mesh object
//   const mesh = useRef();
//   // Set up state for the hovered and active state
//   const [hovered, setHover] = useState(false);
//   const [active, setActive] = useState(false);
//   // Subscribe this component to the render-loop, rotate the mesh every frame
//   // @ts-ignore
//   useFrame((state: any, delta: any) => (mesh.current.rotation.x += 0.01));
//   // Return the view, these are regular Threejs elements expressed in JSX
//   return (
//     <mesh
//       {...props}
//       ref={mesh}
//       scale={active ? 1.5 : 1}
//       onClick={(event) => setActive(!active)}
//       onPointerOver={(event) => setHover(true)}
//       onPointerOut={(event) => setHover(false)}
//     >
//       <boxGeometry args={[1, 1, 1]} />
//       <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
//     </mesh>
//   );
// }

const Home = () => {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  const props = useSpring({
    scale: active ? [1.5, 1.5, 1.5] : [1, 1, 1],
    color: hovered ? "hotpink" : "gray",
  });
  const history = useHistory();
  const meshRef = useRef<any>();

  const handleRoute = () => {
    history.push("/resume");
  };

  // useFrame(({ clock }) => {
  // const a = clock.getElapsedTime();
  // meshRef.current.rotation.x = a;
  // });

  return (
    <div style={{ height: "100%" }}>
      <AboutMeContainer>
        <SmallerContainer>
          {/* <Canvas>
            <mesh>
              <OrbitControls />
              <ambientLight intensity={0.5} />
              <boxBufferGeometry attach="geometry" />
              <meshLambertMaterial attach="material" color="hotpink" />
            </mesh>
          </Canvas> */}
          <StyledTypography variant="h3">
            Hello, my name is Austin.
          </StyledTypography>
          {/* <Canvas> */}
          {/* <ambientLight position={[10, 10, 10]} /> */}
          {/* <pointLight position={[-1.2, 0, 0]} /> */}
          {/* <Box position={[-1.2, 0, 0]} /> */}
          {/* </Canvas> */}
          <Button onClick={handleRoute}>Resume</Button>
          {/* <Canvas>
            <mesh
              // onPointerOver={() => setHovered(true)}
              // onPointerOut={() => setHovered(false)}
              // onClick={() => setActive(!active)}
              // ref={meshRef}
              // @ts-ignore
              // scale={props.scale}
              {...props}
              ref={meshRef}
              scale={active ? 1.5 : 1}
              onClick={(e) => setActive(!active)}
              onPointerOver={(e) => setHovered(true)}
              onPointerOut={(e) => setHovered(false)}
            >
              <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
              <meshBasicMaterial
                attach=""
                color={hovered ? "hotpink" : "gray"}
              />
            </mesh>
          </Canvas> */}
          <Boxes />
        </SmallerContainer>
      </AboutMeContainer>
    </div>
  );
};

export default Home;
