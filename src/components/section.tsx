import { useEffect, useState } from "react";
import { SectionModel } from "../models/section";
import { StandardModel } from '../models/standard';

type SectionProps = {
  section: SectionModel
}

export default function Section(props: SectionProps) {
  const { section } = props;
  const [standards, setStandards] = useState<StandardModel[]>([]);
  const [loadingStandards, setLoadingStandards] = useState(false);

  const fetchStandards = async (signal?: AbortSignal) => {
    setLoadingStandards(true);
    const newStandards = await section.fetchStandardsConfig(signal);
    setLoadingStandards(false);
    setStandards(newStandards);
  }

  // Uncomment this code if you decide you want to fetch all standards on mount.
  // useEffect(() => {
  //   const abortCtrl = new AbortController();
  //   fetchStandards(abortCtrl.signal);

  //   return () => abortCtrl.abort();
  // }, []);

  // Fetch on open instead of on mount
  const standardToggled = (evt: any) => {
    if (evt.target.open) {
      fetchStandards();
    }
  }

  return (
    <li>
      <details onToggle={ standardToggled }>
        <summary><a href={section.repoUrl}>{section.name}</a></summary>
        { loadingStandards && "Loading..." }
        { standards && standards.map(standard => 
          <ul>
            <li>
              <details>
                <summary>{ standard.title }: {standard.description}</summary>
                <ul>
                  {
                    standard.contentFiles && standard.contentFiles.map(contentFile =>
                      <li>
                        {contentFile.type}: { contentFile.path }
                      </li>
                    )
                  }
                </ul>
              </details>
            </li>
          </ul>
          )
        }
      </details>
    </li>
  )
}