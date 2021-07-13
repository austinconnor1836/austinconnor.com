import React from "react";
import { Button, Link, styled, Typography } from "@material-ui/core";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";
import { Omit } from "@material-ui/types";

const FlexContainer = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderBottom: "0.3rem solid black",
  display: "flex",
  height: "3rem",
  justifyContent: "space-between",
}));

const StyledLink = styled(Link)({
  padding: "1rem",
});

const Navbar = () => {
  return (
    <FlexContainer>
      <StyledLink href="/">
        {/* <Typography variant="body1">Home</Typography> */}
        Home
      </StyledLink>
      <StyledLink href="/resume">Resume</StyledLink>
    </FlexContainer>
  );
};

export default Navbar;
