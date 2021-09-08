import React from "react";
import { Link, styled } from "@material-ui/core";

const FlexContainer = styled("div")(({ theme }) => ({
  display: "flex",
}));

const OuterContainer = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderBottom: "0.3rem solid black",
  display: "flex",
  height: "3.5rem",
  justifyContent: "space-between",
  position: "fixed",
  width: "100%",
}));

const StyledLink = styled(Link)({
  padding: "1rem",
});

const Navbar = () => {
  return (
    <OuterContainer>
      <StyledLink href="/">Home</StyledLink>
      <FlexContainer>
        <StyledLink href="/fave-quotes">Fave Quotes</StyledLink>
        <StyledLink href="/resume">Resume</StyledLink>
      </FlexContainer>
    </OuterContainer>
  );
};

export default Navbar;
