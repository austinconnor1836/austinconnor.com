import React from "react";
import { styled, Paper, Typography } from "@material-ui/core";
import logo from "../logo.svg";

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

const CustomPaper = styled(Paper)({
  // height: "40rem",
  margin: "2rem",
  width: "40rem",
});

const SmallerContainer = styled("div")({
  // flex: "1 1 auto",
  display: "flex",
  justifyContent: "center",
  // justifyItems: "center",
  alignItems: "center",
});

const Home = () => {
  return (
    <div style={{ height: "100%" }}>
      <AboutMeContainer>
        {/* <CustomPaper elevation={2}>Hello</CustomPaper> */}
        <SmallerContainer>
          {/* <CustomPaper elevation={2}>Hello</CustomPaper> */}
          <Typography variant="h3">Hello, my name is Austin.</Typography>
        </SmallerContainer>
      </AboutMeContainer>
    </div>
  );
};

export default Home;
