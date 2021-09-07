import React from "react";
import { Paper, styled } from "@material-ui/core";
import { quotes } from "../data/quotes";
import { IQuoteItem } from "../utils/interfaces";

const OuterContainer = styled("div")({
  // background: "rgb(2,0,36)",
  // background:
  // "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(148,148,185,1) 35%, rgba(0,212,255,1) 100%)",
  display: "flex",
  flexDirection: "column",
  // height: "95vh",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  "& > *": {
    marginTop: "3rem",
    fontSize: "2rem",
    padding: "2rem 2rem",
    width: "30rem",
  },
});

// const InnerItem = styled(Paper)({
//   width: "30rem",
// });

const FaveQuotes = () => {
  return (
    <OuterContainer>
      {quotes?.map((quoteItem: IQuoteItem, index: number) => (
        <Paper key={index}>
          <q>{quoteItem?.quote}</q>
          <p>
            - {quoteItem?.book}, by {quoteItem?.author}
          </p>
        </Paper>
      ))}
    </OuterContainer>
  );
};

export default FaveQuotes;
