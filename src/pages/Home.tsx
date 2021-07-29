import React from "react";
import { Button, styled, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Boxes from "./Boxes";

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

const Home = () => {
  const history = useHistory();

  const handleRoute = () => {
    history.push("/resume");
  };

  return (
    <div style={{ height: "100%" }}>
      <AboutMeContainer>
        <SmallerContainer>
          <StyledTypography variant="h3">
            Hello, my name is Austin.
          </StyledTypography>
          <Button onClick={handleRoute}>Resume</Button>
          <Boxes />
        </SmallerContainer>
      </AboutMeContainer>
    </div>
  );
};

export default Home;
