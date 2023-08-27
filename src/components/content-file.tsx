import { SyntheticEvent, useContext, useEffect, useState } from "react";
import { ContentFileModel } from "../models/content-file";
import { CurrentMarkdownDispatchContext } from "../contexts/current-markdown";
import { SetMarkdownAction } from '../reducers/markdown-actions';
import { GithubUrl } from "../models/github-url";

type ContentFileProps = {
  contentFile: ContentFileModel,
  load?: boolean
}

export default function ContentFile(props: ContentFileProps) {
  const { contentFile, load } = props;
  const [title, setTitle] = useState<string | null>(null);

  const ghUrl = new GithubUrl(contentFile.path).githubUrl();

  const dispatch = useContext(CurrentMarkdownDispatchContext);

  const stashUidInQueryParams = () => {
    const params = new URLSearchParams(window.location.search);
    params.set('content-file-uid', contentFile.uid);
    history?.pushState({}, '', '?' + params.toString());
  }

  const fetchTitle = async (signal?: AbortSignal) => {
    setTitle(null);
    const newTitle = await contentFile.fetchTitle(signal);
    setTitle(newTitle);
  }

  const fetchMarkdown = async (signal?: AbortSignal) => {
    const markdown = await contentFile.fetchMarkdown(signal);
    dispatch?.(new SetMarkdownAction(markdown, contentFile.path));
    const title = await contentFile.fetchTitle(signal);
    setTitle(title);
    stashUidInQueryParams();
  }

  useEffect(() => {
    if (load) {
      const abortCtrl = new AbortController();

      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('content-file-uid') === contentFile.uid) {
        fetchMarkdown(abortCtrl.signal);
      } else {
        fetchTitle(abortCtrl.signal);
      }

      return () => abortCtrl.abort();
    }
  }, [load]);

  const selectMarkdown = async (evt: SyntheticEvent<HTMLAnchorElement>) => {
    evt.preventDefault();
    fetchMarkdown();
    window?.scrollTo({ top: 0 });
  };

  return (
    <li key={contentFile.path}>
      {
        load && title !== null ?
          <>
            {contentFile.type}:&nbsp;
            <a href="#" onClick={ selectMarkdown }>{title!}</a>
            &nbsp;<a
              className="subtle-link"
              href={ghUrl} target="_blank"
              rel="noopener noreferrer"
            >repo</a>
          </> :
          "Loading..."
      }
    </li>
  )
}