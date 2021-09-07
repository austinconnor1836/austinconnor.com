import React, { Suspense } from "react";
import { Button, styled } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Boxes from "./Boxes";
import AssignmentIcon from "@material-ui/icons/Assignment";

const OuterContainer = styled("div")({
  height: "100%",
});

const AboutMeContainer = styled("div")({
  // background: "hsl(204, 86%, 53%)",
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

const Home = () => {
  const history = useHistory();

  const handleRoute = (route: string) => {
    history.push(`/${route}`);
  };

  return (
    // <div style={{ height: "100%" }}>
    <OuterContainer>
      <AboutMeContainer>
        <SmallerContainer>
          <b
            style={{
              color: "#fcc200",
              fontSize: "3rem",
              letterSpacing: "3px",
              padding: "1rem 1rem",
              textAlign: "center",
              WebkitTextStroke: "0.5px black",
            }}
          >
            Profit will never outpace the Spirit of Innovation.
          </b>
          <Button
            endIcon={<AssignmentIcon />}
            onClick={() => handleRoute("resume")}
          >
            Resume
          </Button>
          <Suspense fallback={null}>
            <Boxes />
          </Suspense>
        </SmallerContainer>
      </AboutMeContainer>
    </OuterContainer>
  );
};

export default Home;
