import React from "react";
import { Link, styled } from "@material-ui/core";
import { useHistory } from "react-router";

const FlexContainer = styled("div")(({ theme }) => ({
  display: "flex",
}));

const OuterContainer = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderBottom: "0.3rem solid black",
  display: "flex",
  height: "3.5rem",
  justifyContent: "space-between",
  // position: "fixed",
  // width: "100%",
}));

const StyledLink = styled(Link)({
  padding: "1rem",
});

const Navbar = () => {
  const history = useHistory();

  const handleRoute = (route: string) => history.push(`/${route}`);

  return (
    <OuterContainer>
      <StyledLink onClick={() => handleRoute("")}>Home</StyledLink>
      <FlexContainer>
        <StyledLink
          href="/fave-quotes"
          onClick={() => handleRoute("fave-quotes")}
        >
          Fave Quotes
        </StyledLink>
        <StyledLink href="/resume" onClick={() => handleRoute("resume")}>
          Resume
        </StyledLink>
      </FlexContainer>
    </OuterContainer>
  );
};

export default Navbar;
