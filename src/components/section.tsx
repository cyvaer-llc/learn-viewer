import { useEffect, useState } from "react";
import { SectionModel } from "../models/section";
import { StandardModel } from '../models/standard';
import { Standard } from "./standard";

type SectionProps = {
  section: SectionModel
}

export default function Section(props: SectionProps) {
  const { section } = props;

  const shouldBeOpen = () => {
    const sectionFromQS = decodeURIComponent(new URLSearchParams(window.location.search).get('section') || "");
    return sectionFromQS === section.name;
  };

  const [standards, setStandards] = useState<StandardModel[]>([]);
  const [loadingStandards, setLoadingStandards] = useState(false);
  const [lastError, setLastError] = useState<string>('');
  const [isOpen, setIsOpen] = useState(shouldBeOpen());

  const fetchStandards = async (signal?: AbortSignal) => {
    setLoadingStandards(true);
    setLastError('');
    try {
      const newStandards = await section.fetchStandardsConfig(signal);
      setLoadingStandards(false);
      setLastError('')
      setStandards(newStandards);
    } catch (err: any) {
      setLoadingStandards(false);
      setLastError(err.message);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (isOpen) {
      params.set('section', section.name);
    } else if (params.get('section') === section.name) {
      params.delete('section');
    }
    history?.pushState({}, '', '?' + params.toString());
  }, [isOpen, section.name]);

  // TODO: Uncomment this code if you decide you want to fetch all standards on mount.
  // useEffect(() => {
  //   const abortCtrl = new AbortController();
  //   fetchStandards(abortCtrl.signal);

  //   return () => abortCtrl.abort();
  // }, []);

  // Fetch on open instead of on mount
  const sectionToggled = (evt: any) => {
    if (evt.target.open) {
      fetchStandards();
    }
    setIsOpen(evt.target.open);
  }

  return (
    <li>
      <details open={ isOpen } onToggle={ sectionToggled }>
        <summary>
          {section.name}&nbsp;
          <a
            className="subtle-link"
            href={section.repoUrl} target="_blank"
            rel="noopener noreferrer"
          >repo</a>
        </summary>
        <ul>
          { loadingStandards && "Loading..." }
          { lastError && <span className="error">{ lastError }</span> }
          {
            standards && standards.map(standard =>
              <Standard standard={standard} key={standard.uid} />
            )
          }
        </ul>
      </details>
    </li>
  )
}