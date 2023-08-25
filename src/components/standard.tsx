import { useState } from "react";
import { StandardModel } from "../models/standard";
import ContentFile from "./content-file";

import './standard.css';

type StandardProps = {
  standard: StandardModel
}

export function Standard(props: StandardProps) {
  const { standard: { title, description, contentFiles } } = props;

  const [loadContent, setLoadContent] = useState(false);

  const detailsToggled = (evt: any) => {
    setLoadContent(evt.target.open)
  };

  return (<li>
    <details className="bordered" onToggle={ detailsToggled }>
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
  </li>);
}
