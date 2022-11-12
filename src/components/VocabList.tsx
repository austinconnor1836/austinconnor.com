import React from "react";
import ReactMarkdown from 'react-markdown';
import { Nav } from "../Styles";
import { markdown } from './markdown';

const VocabList = () => {
  return (
    <div style={{ padding: '20px'}}>
      <Nav />
      <ReactMarkdown children={markdown} />
    </div>
  );
};

export default VocabList;
