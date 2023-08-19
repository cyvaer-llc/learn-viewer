import { useEffect, useState } from "react";
import { SectionModel, StandardModel } from "../models/section";

type SectionProps = {
  section: SectionModel
}

export default function Section(props: SectionProps) {
  const { section } = props;
  const [standards, setStandards] = useState<StandardModel[]>([]);

  const fetchStandards = async (signal: AbortSignal | undefined) => {
    const newStandards = await section.fetchStandardsConfig(signal);
    setStandards(newStandards);
  }

  useEffect(() => {
    const abortCtrl = new AbortController();
    fetchStandards(abortCtrl.signal);

    return () => abortCtrl.abort();
  }, []);

  return (
    <li>
      <details>
        <summary><a href={section.repoUrl}>{section.name}</a></summary>
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