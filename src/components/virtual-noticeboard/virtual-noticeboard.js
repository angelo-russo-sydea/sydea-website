import React, { useContext, useEffect, useState, useRef } from "react";
import "./virtual-noticeboard.scss";
import { Filemanager, getMenuOptions } from "@svar-ui/react-filemanager";
import "@svar-ui/react-filemanager/all.css";
import { AppContext } from "../../services/translationContext";
import { Link, useParams } from "react-router-dom";
import { Willow } from "@svar-ui/react-filemanager";
import DocumentsGrid from "./DocumentsGrid";


export const VirtualNoticeboard = () => {
  const {services: { TranslationsService }} = useContext(AppContext);
  const { lang } = useParams();

  const [rawData, setRawData] = useState([]);

useEffect(() => {
    // fetch(server + "/files")
    //   .then((res) => res.json())
    //   .then((data) => setRawData(data));
  }, []);
  
  const files = [
    {
      id: "/Code",
      size: 4096,
      date: new Date(2023, 11, 2, 17, 25),
      type: "folder",
    },
    {
      id: "/Music",
      size: 4096,
      date: new Date(2023, 11, 1, 14, 45),
      type: "folder",
    },
    {
      id: "/Info.txt",
      size: 1000,
      date: new Date(2023, 10, 30, 6, 13),
      type: "file",
    },
    {
      // parent: "/Code/Datepicker",
      id: "/Code/Datepicker/Year.jsx",
      size: 1595,
      date: new Date(2023, 11, 7, 15, 23),
      type: "file",
    },
    {
      id: "/Pictures/162822515312968813.png",
      size: 510885,
      date: new Date(2023, 11, 1, 14, 45),
      type: "file",
    },
  ];

  function menuOptions(mode, item) {
    switch (mode) {
      case "folder":
        if (item.id === "/Pictures")
          return [
            {
              icon: "wxi-edit",
              text: "Rename",
              hotkey: "Ctrl+R",
              id: "rename",
            },
          ];
      default:
        return getMenuOptions(mode);
    }
  }

  return (
    <div className="section-home light position-relative p-4">
        <DocumentsGrid />
        <Willow>
            <Filemanager data={files} menuOptions={menuOptions} mode="cards" activePanel={1}/>
        </Willow>
    </div>
  );
};
