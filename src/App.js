import "./App.css";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
// import { Button } from "antd";
// import { dataURItoBlob } from "./DataUri";
import bw from "./bw.pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

async function calculatePageLength(page) {
  const textContent = await page.getTextContent();
  return textContent.items.reduce((sum, item) => sum + item.str.length, 0);
}
function highlightPattern(text, pattern) {
  const splitText = text?.split(pattern);

  if (splitText?.length <= 1) {
    return text;
  }

  const matches = text?.match(pattern);

  return splitText?.reduce(
    (arr, element, index) =>
      matches[index]
        ? [
            ...arr,
            element,
            <mark key={index} style={{ backgroundColor: "orange" }}>
              {matches[index]}
            </mark>,
          ]
        : [...arr, element],
    []
  );
}

export default function App({ file }) {
  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(8);
  // console.log(file, "url");

  const previousPage = () => {
    setPageNumber(pageNumber - 1);
  };

  const nextPage = () => {
    setPageNumber(pageNumber + 1);
  };
  // function removeTextLayerOffset() {
  //   // alert("hi");
  //   const textLayers = document.querySelectorAll(
  //     ".react-pdf__Page__textContent"
  //   );
  //   textLayers.forEach((layer) => {
  //     const { style } = layer;
  //     style.display = none;
  //   });
  // }

  const makeTextRenderer = (textItem) =>
    highlightPattern(textItem?.str, searchText);

  function onChange(event) {
    setSearchText(event.target.value);
  }

  return (
    <>
      <div>
        <label htmlFor="search">Search:</label>
        <input
          type="search"
          id="search"
          value={searchText}
          onChange={onChange}
        />
      </div>
      <Document file={bw}>
        <Page pageNumber={pageNumber} customTextRenderer={makeTextRenderer} />
      </Document>
      {/* <div className="buttonc">
        <Button
          type="button"
          disabled={pageNumber <= 1}
          onClick={previousPage}
          className="Pre"
        >
          Previous
        </Button>
        <Button
          type="button"
          disabled={pageNumber >= numPages}
          onClick={nextPage}
        >
          Next
        </Button>
      </div> */}
    </>
  );
}
