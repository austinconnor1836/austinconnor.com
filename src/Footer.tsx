import React from "react";
import { Link, styled, Typography } from "@material-ui/core";

const FlexContainer = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.secondary.light,
  display: "flex",
  // height: "100%",
  height: "15vh",
  justifyContent: "space-between",
}));

const Footer = () => {
  return <FlexContainer></FlexContainer>;
};

export default Footer;
