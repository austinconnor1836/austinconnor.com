import React from "react";
import { styled, TextField } from "@material-ui/core";

const FlexContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  "& > *": {
    margin: "1rem",
  },
});

const EmailForm = () => {
  return (
    <div style={{ width: "40%" }}>
      <form noValidate autoComplete="off">
        <FlexContainer>
          <TextField label="Name" />
          <TextField label="Email" />
          <TextField multiline rowsMax={4} label="Message" />
        </FlexContainer>
      </form>
    </div>
  );
};

export default EmailForm;
