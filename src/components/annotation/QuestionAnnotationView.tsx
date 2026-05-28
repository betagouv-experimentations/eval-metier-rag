"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Tabs } from "@codegouvfr/react-dsfr/Tabs";
import { AnnotationForm } from "./AnnotationForm";
import type { Question, Annotation, SourceEvaluation } from "@/db/schema";

interface QuestionAnnotationViewProps {
  token: string;
  question: Question;
  campaignMode: "comparison" | "single";
  prevQuestionId: string | null;
  nextQuestionId: string | null;
  existingAnnotation?: Annotation | null;
  existingSourceEvals?: SourceEvaluation[];
}

const SESSION_TOKEN_KEY = "eval_session_token";

function getOrCreateSessionToken(): string {
  if (typeof window === "undefined") return "";
  let token = localStorage.getItem(SESSION_TOKEN_KEY);
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem(SESSION_TOKEN_KEY, token);
  }
  return token;
}

export function QuestionAnnotationView({
  token,
  question,
  campaignMode,
  prevQuestionId,
  nextQuestionId,
  existingAnnotation,
  existingSourceEvals = [],
}: QuestionAnnotationViewProps): React.ReactElement {
  const router = useRouter();
  const [sessionToken, setSessionToken] = useState<string>("");
  const [savedAnnotation, setSavedAnnotation] = useState<Annotation | null>(
    existingAnnotation ?? null,
  );

  useEffect(() => {
    setSessionToken(getOrCreateSessionToken());
  }, []);

  const sourcesA = (question.sourcesA as string[]) ?? [];
  const sourcesB = (question.sourcesB as string[] | null) ?? [];

  const tabs =
    campaignMode === "comparison"
      ? [
          {
            label: "Réponse A",
            content: (
              <div className={fr.cx("fr-mt-3w")}>
                <p style={{ whiteSpace: "pre-wrap" }}>{question.responseA}</p>
                {sourcesA.length > 0 && (
                  <div className={fr.cx("fr-mt-2w")}>
                    <p className={fr.cx("fr-text--bold", "fr-mb-1w")}>
                      Sources ({sourcesA.length})
                    </p>
                    <ul>
                      {sourcesA.map((src, i) => (
                        <li key={i}>
                          <a
                            href={src}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={fr.cx("fr-link")}
                            title={`${src} (nouvelle fenêtre)`}
                          >
                            {src}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ),
          },
          {
            label: "Réponse B",
            content: (
              <div className={fr.cx("fr-mt-3w")}>
                <p style={{ whiteSpace: "pre-wrap" }}>{question.responseB ?? "—"}</p>
                {sourcesB.length > 0 && (
                  <div className={fr.cx("fr-mt-2w")}>
                    <p className={fr.cx("fr-text--bold", "fr-mb-1w")}>
                      Sources ({sourcesB.length})
                    </p>
                    <ul>
                      {sourcesB.map((src, i) => (
                        <li key={i}>
                          <a
                            href={src}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={fr.cx("fr-link")}
                            title={`${src} (nouvelle fenêtre)`}
                          >
                            {src}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ),
          },
        ]
      : null;

  return (
    <div className={fr.cx("fr-container", "fr-my-4w")}>
      {/* Navigation header */}
      <div
        className={fr.cx("fr-grid-row", "fr-grid-row--middle", "fr-mb-3w")}
        style={{ justifyContent: "space-between" }}
      >
        {prevQuestionId ? (
          <Button
            priority="tertiary no outline"
            iconId="fr-icon-arrow-left-line"
            linkProps={{ href: `/annotation/${token}/${prevQuestionId}` }}
          >
            Précédent
          </Button>
        ) : (
          <Button priority="tertiary no outline" iconId="fr-icon-arrow-left-line" disabled>
            Précédent
          </Button>
        )}
        <Badge severity="info" small noIcon>
          Question {question.position}
        </Badge>
        {nextQuestionId ? (
          <Button
            priority="tertiary no outline"
            iconId="fr-icon-arrow-right-line"
            iconPosition="right"
            linkProps={{ href: `/annotation/${token}/${nextQuestionId}` }}
          >
            Suivant
          </Button>
        ) : (
          <Button
            priority="tertiary no outline"
            iconId="fr-icon-arrow-right-line"
            iconPosition="right"
            disabled
          >
            Suivant
          </Button>
        )}
      </div>

      {/* Question text */}
      <div
        className={fr.cx("fr-p-3w", "fr-mb-4w")}
        style={{ background: "#f5f5fe", borderLeft: "4px solid #6a6af4" }}
      >
        <h1 className={fr.cx("fr-h6", "fr-mb-1w")}>Question {question.position}</h1>
        <p className={fr.cx("fr-mb-0")} style={{ whiteSpace: "pre-wrap" }}>
          {question.questionText}
        </p>
      </div>

      {/* Responses: tabs (comparison) or single */}
      {campaignMode === "comparison" && tabs ? (
        <div className={fr.cx("fr-mb-4w")}>
          <Tabs tabs={tabs} />
        </div>
      ) : (
        <div
          className={fr.cx("fr-p-3w", "fr-mb-4w")}
          style={{ background: "#f6f6f6", borderRadius: "4px" }}
        >
          <p className={fr.cx("fr-text--bold", "fr-mb-1w")}>Réponse</p>
          <p style={{ whiteSpace: "pre-wrap" }}>{question.responseA}</p>
          {sourcesA.length > 0 && (
            <div className={fr.cx("fr-mt-2w")}>
              <p className={fr.cx("fr-text--bold", "fr-mb-1w")}>
                Sources ({sourcesA.length})
              </p>
              <ul>
                {sourcesA.map((src, i) => (
                  <li key={i}>
                    <a
                      href={src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={fr.cx("fr-link")}
                    >
                      {src}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Annotation form */}
      <div
        className={fr.cx("fr-p-4w")}
        style={{ border: "1px solid #ddd", borderRadius: "4px" }}
      >
        <h2 className={fr.cx("fr-h5", "fr-mb-3w")}>Votre évaluation</h2>
        {sessionToken ? (
          <AnnotationForm
            question={question}
            campaignMode={campaignMode}
            sessionToken={sessionToken}
            existingAnnotation={savedAnnotation}
            existingSourceEvals={existingSourceEvals}
            onSaved={(a) => setSavedAnnotation(a)}
          />
        ) : (
          <p>Chargement…</p>
        )}
      </div>

      {/* Bottom navigation */}
      <div
        className={fr.cx("fr-grid-row", "fr-grid-row--gutters", "fr-mt-4w")}
        style={{ justifyContent: "space-between" }}
      >
        {prevQuestionId ? (
          <Button
            priority="secondary"
            iconId="fr-icon-arrow-left-s-line"
            linkProps={{ href: `/annotation/${token}/${prevQuestionId}` }}
          >
            Question précédente
          </Button>
        ) : (
          <Button priority="secondary" iconId="fr-icon-arrow-left-s-line" disabled>
            Question précédente
          </Button>
        )}
        {nextQuestionId ? (
          <Button
            iconId="fr-icon-arrow-right-s-line"
            iconPosition="right"
            linkProps={{ href: `/annotation/${token}/${nextQuestionId}` }}
          >
            Question suivante
          </Button>
        ) : (
          <Button
            iconId="fr-icon-check-line"
            linkProps={{ href: `/annotation/${token}` }}
          >
            Terminer
          </Button>
        )}
      </div>
    </div>
  );
}
