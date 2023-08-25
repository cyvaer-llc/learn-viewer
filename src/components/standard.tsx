import { useEffect, useState } from "react";
import { StandardModel } from "../models/standard";
import ContentFile from "./content-file";

import './standard.css';

type StandardProps = {
  standard: StandardModel
}

export function Standard(props: StandardProps) {
  const { standard: { title, description, contentFiles, uid } } = props;

  const shouldBeOpen = () => { 
    const standardFromQS = decodeURIComponent(new URLSearchParams(window.location.search).get('standard') || "");
    return standardFromQS === uid;
  };

  const [loadContent, setLoadContent] = useState(false);
  const [isOpen, setIsOpen] = useState(shouldBeOpen());

  const detailsToggled = (evt: any) => {
    setLoadContent(evt.target.open)
    setIsOpen(evt.target.open);
    evt.stopPropagation();
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (isOpen) {
      params.set('standard', uid);
    } else if (params.get('standard') === uid) {
      params.delete('standard');
    }
    console.log("New params", params.toString());
    history?.pushState({}, '', '?' + params.toString());
  }, [isOpen, uid]);

  return (
    <li>
      <details className="bordered" open={ isOpen } onToggle={ detailsToggled }>
        <summary>
          <div className="__title">{title}</div>
          <div className="desc">{description}</div>
        </summary>
        <ul>
          {
            contentFiles && contentFiles.map(contentFile =>
              <ContentFile key={contentFile.uid} contentFile={contentFile} load={loadContent} />
            )
          }
        </ul>
      </details>
    </li>
  );
}
