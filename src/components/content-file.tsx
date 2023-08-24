import { SyntheticEvent, useContext, useEffect, useState } from "react";
import { ContentFileModel } from "../models/content-file";
import { CurrentMarkdownDispatchContext } from "../contexts/current-markdown";
import { SetMarkdownAction } from '../reducers/markdown-actions';

type ContentFileProps = {
  contentFile: ContentFileModel,
  load?: boolean
}

export default function ContentFile(props: ContentFileProps) {
  const { contentFile, load } = props;
  const [title, setTitle] = useState<string | null>(null);

  const dispatch = useContext(CurrentMarkdownDispatchContext);

  const fetchTitle = async (signal?: AbortSignal) => {
    setTitle(null);
    const newTitle = await contentFile.fetchTitle(signal);
    setTitle(newTitle);
  }

  useEffect(() => {
    if (load) {
      const abortCtrl = new AbortController();
      fetchTitle(abortCtrl.signal);
      return () => abortCtrl.abort();
    }
  }, [load]);

  const selectMarkdown = async (evt: SyntheticEvent<HTMLAnchorElement>) => {
    evt.preventDefault();
    const markdown = await contentFile.fetchMarkdown();
    dispatch?.(new SetMarkdownAction(markdown));
  };

  return (
    <li key={contentFile.path}>
      {
        load && title !== null ?
          <>{contentFile.type}: <a href="#" onClick={ selectMarkdown }>{title!}</a></> :
          "Loading..."
      }
    </li>
  )
}