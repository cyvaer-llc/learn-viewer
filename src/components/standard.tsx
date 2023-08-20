import { useState } from "react";
import { StandardModel } from "../models/standard";
import ContentFile from "./content-file";

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
    <details onToggle={ detailsToggled }>
      <summary>{title}: {description}</summary>
      <ul>
        {
          contentFiles && contentFiles.map(contentFile =>
            <ContentFile contentFile={contentFile} load={loadContent} />
          )
        }
      </ul>
    </details>
  </li>);
}
