import React from "react";
import { Button, styled, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
// import { useFrame } from "@react-three/fiber";
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
  const history = useHistory();

  const handleRoute = () => {
    history.push("/resume");
  };

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
        </SmallerContainer>
      </AboutMeContainer>
    </div>
  );
};

export default Home;
