import React from "react";
import { Paper, styled, useMediaQuery } from "@material-ui/core";
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
});

// const InnerItem = styled(Paper)({
//   width: "30rem",
// });

const DesktopPaper = styled(Paper)({
  fontSize: "2rem",
  margin: "1rem 0 1rem 0",
  padding: "2rem 2rem",
  width: "30rem",
});

const MobilePaper = styled(Paper)({
  fontSize: "1.5rem",
  margin: "1rem",
  padding: "10px",
  width: "20rem",
});

const FaveQuotes = () => {
  const isDesktop = useMediaQuery("(min-width:600px)");

  return (
    <OuterContainer>
      {quotes?.map((quoteItem: IQuoteItem, index: number) =>
        isDesktop ? (
          <DesktopPaper
            key={index}
            // style={{ margin: index === 0 ? "4rem 0 1rem 0" : "1rem" }}
          >
            <q>{quoteItem?.quote}</q>
            <p>
              {quoteItem?.book !== ""
                ? `- ${quoteItem?.book} by ${quoteItem?.author}`
                : `- ${quoteItem?.author}`}
            </p>
          </DesktopPaper>
        ) : (
          <MobilePaper
            key={index}
            // style={{ margin: index === 0 ? "4rem 0 1rem 0" : "1rem" }}
          >
            <q>{quoteItem?.quote}</q>
            <p>
              {quoteItem?.book !== ""
                ? `- ${quoteItem?.book} by ${quoteItem?.author}`
                : `- ${quoteItem?.author}`}
            </p>
          </MobilePaper>
        )
      )}
    </OuterContainer>
  );
};

export default FaveQuotes;
