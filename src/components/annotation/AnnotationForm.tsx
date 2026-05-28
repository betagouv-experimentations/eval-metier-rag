"use client";

import { useState, useCallback } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Button } from "@codegouvfr/react-dsfr/Button";
import type { Question, Annotation, SourceEvaluation } from "@/db/schema";

interface AnnotationFormProps {
  question: Question;
  campaignMode: "comparison" | "single";
  sessionToken: string;
  existingAnnotation?: Annotation | null;
  existingSourceEvals?: SourceEvaluation[];
  onSaved?: (annotation: Annotation) => void;
}

type BooleanChoice = "true" | "false" | "";

function boolToChoice(val: boolean | null | undefined): BooleanChoice {
  if (val === true) return "true";
  if (val === false) return "false";
  return "";
}

export function AnnotationForm({
  question,
  campaignMode,
  sessionToken,
  existingAnnotation,
  existingSourceEvals = [],
  onSaved,
}: AnnotationFormProps): React.ReactElement {
  const [acceptableA, setAcceptableA] = useState<BooleanChoice>(
    boolToChoice(existingAnnotation?.acceptableA),
  );
  const [acceptableB, setAcceptableB] = useState<BooleanChoice>(
    boolToChoice(existingAnnotation?.acceptableB),
  );
  const [comparison, setComparison] = useState<string>(
    existingAnnotation?.comparison ?? "",
  );
  const [comment, setComment] = useState<string>(existingAnnotation?.comment ?? "");

  // Source evaluations: map `side-index` → "true"|"false"|""
  const buildSourceMap = (): Record<string, BooleanChoice> => {
    const map: Record<string, BooleanChoice> = {};
    for (const se of existingSourceEvals) {
      map[`${se.side}-${se.sourceIndex}`] = boolToChoice(se.isRelevant);
    }
    return map;
  };
  const [sourceEvals, setSourceEvals] = useState<Record<string, BooleanChoice>>(
    buildSourceMap,
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");
  const [currentAnnotationId, setCurrentAnnotationId] = useState<string | undefined>(
    existingAnnotation?.id,
  );

  const sourcesA = (question.sourcesA as string[]) ?? [];
  const sourcesB = (question.sourcesB as string[] | null) ?? [];

  async function saveAnnotation(): Promise<string | null> {
    const res = await fetch("/api/annotations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId: question.id,
        sessionToken,
        acceptableA: acceptableA === "true" ? true : acceptableA === "false" ? false : null,
        acceptableB: acceptableB === "true" ? true : acceptableB === "false" ? false : null,
        comparison: comparison || null,
        comment: comment.trim() || null,
      }),
    });
    if (!res.ok) return null;
    const annotation = (await res.json()) as Annotation;
    setCurrentAnnotationId(annotation.id);
    onSaved?.(annotation);
    return annotation.id;
  }

  async function saveSourceEval(
    annotationId: string,
    side: "a" | "b",
    sourceIndex: number,
    value: BooleanChoice,
  ): Promise<void> {
    await fetch("/api/source-evaluations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        annotationId,
        side,
        sourceIndex,
        isRelevant: value === "true" ? true : value === "false" ? false : null,
      }),
    });
  }

  const handleFieldChange = useCallback(async () => {
    setIsSaving(true);
    setSaveStatus("idle");
    try {
      const annotationId = await saveAnnotation();
      if (!annotationId) {
        setSaveStatus("error");
        return;
      }
      // Save all source evaluations
      const entries = Object.entries(sourceEvals);
      await Promise.all(
        entries.map(([key, value]) => {
          const parts = key.split("-");
          const side = parts[0] ?? "a";
          const indexStr = parts[1] ?? "0";
          return saveSourceEval(annotationId, side as "a" | "b", parseInt(indexStr, 10), value);
        }),
      );
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  }, [acceptableA, acceptableB, comparison, comment, sourceEvals, question.id, sessionToken]);

  function handleSourceChange(side: "a" | "b", index: number, value: BooleanChoice): void {
    setSourceEvals((prev) => ({ ...prev, [`${side}-${index}`]: value }));
  }

  return (
    <div>
      {/* Acceptability A */}
      <section aria-labelledby="acceptability-a-legend" className={fr.cx("fr-mb-4w")}>
        <RadioButtons
          legend="La réponse A est-elle acceptable ?"
          name={`acceptable-a-${question.id}`}
          orientation="horizontal"
          options={[
            {
              label: "OUI",
              nativeInputProps: {
                value: "true",
                checked: acceptableA === "true",
                onChange: () => setAcceptableA("true"),
              },
            },
            {
              label: "NON",
              nativeInputProps: {
                value: "false",
                checked: acceptableA === "false",
                onChange: () => setAcceptableA("false"),
              },
            },
          ]}
        />
      </section>

      {/* Acceptability B (only in comparison mode) */}
      {campaignMode === "comparison" && (
        <section aria-labelledby="acceptability-b-legend" className={fr.cx("fr-mb-4w")}>
          <RadioButtons
            legend="La réponse B est-elle acceptable ?"
            name={`acceptable-b-${question.id}`}
            orientation="horizontal"
            options={[
              {
                label: "OUI",
                nativeInputProps: {
                  value: "true",
                  checked: acceptableB === "true",
                  onChange: () => setAcceptableB("true"),
                },
              },
              {
                label: "NON",
                nativeInputProps: {
                  value: "false",
                  checked: acceptableB === "false",
                  onChange: () => setAcceptableB("false"),
                },
              },
            ]}
          />
        </section>
      )}

      {/* Comparison (only in comparison mode) */}
      {campaignMode === "comparison" && (
        <section className={fr.cx("fr-mb-4w")}>
          <RadioButtons
            legend="Quelle réponse est la meilleure ?"
            name={`comparison-${question.id}`}
            options={[
              {
                label: "A est meilleure que B",
                nativeInputProps: {
                  value: "a_better",
                  checked: comparison === "a_better",
                  onChange: () => setComparison("a_better"),
                },
              },
              {
                label: "Équivalentes",
                nativeInputProps: {
                  value: "equivalent",
                  checked: comparison === "equivalent",
                  onChange: () => setComparison("equivalent"),
                },
              },
              {
                label: "B est meilleure que A",
                nativeInputProps: {
                  value: "b_better",
                  checked: comparison === "b_better",
                  onChange: () => setComparison("b_better"),
                },
              },
            ]}
          />
        </section>
      )}

      {/* Sources A */}
      {sourcesA.length > 0 && (
        <section className={fr.cx("fr-mb-4w")}>
          <h3 className={fr.cx("fr-h6")}>
            Sources — Réponse A ({sourcesA.length} source{sourcesA.length > 1 ? "s" : ""})
          </h3>
          {sourcesA.map((src, i) => (
            <div
              key={i}
              className={fr.cx("fr-mb-2w", "fr-p-2w")}
              style={{ background: "#f6f6f6", borderRadius: "4px" }}
            >
              <p className={fr.cx("fr-mb-1w")}>
                <a
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={fr.cx("fr-link")}
                  title={`${src} (nouvelle fenêtre)`}
                >
                  {src}
                </a>
              </p>
              <RadioButtons
                legend="Cette source justifie-t-elle bien la réponse A ?"
                name={`source-a-${question.id}-${i}`}
                orientation="horizontal"
                small
                options={[
                  {
                    label: "OUI",
                    nativeInputProps: {
                      value: "true",
                      checked: sourceEvals[`a-${i}`] === "true",
                      onChange: () => handleSourceChange("a", i, "true"),
                    },
                  },
                  {
                    label: "NON",
                    nativeInputProps: {
                      value: "false",
                      checked: sourceEvals[`a-${i}`] === "false",
                      onChange: () => handleSourceChange("a", i, "false"),
                    },
                  },
                ]}
              />
            </div>
          ))}
        </section>
      )}

      {/* Sources B */}
      {campaignMode === "comparison" && sourcesB.length > 0 && (
        <section className={fr.cx("fr-mb-4w")}>
          <h3 className={fr.cx("fr-h6")}>
            Sources — Réponse B ({sourcesB.length} source{sourcesB.length > 1 ? "s" : ""})
          </h3>
          {sourcesB.map((src, i) => (
            <div
              key={i}
              className={fr.cx("fr-mb-2w", "fr-p-2w")}
              style={{ background: "#f6f6f6", borderRadius: "4px" }}
            >
              <p className={fr.cx("fr-mb-1w")}>
                <a
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={fr.cx("fr-link")}
                  title={`${src} (nouvelle fenêtre)`}
                >
                  {src}
                </a>
              </p>
              <RadioButtons
                legend="Cette source justifie-t-elle bien la réponse B ?"
                name={`source-b-${question.id}-${i}`}
                orientation="horizontal"
                small
                options={[
                  {
                    label: "OUI",
                    nativeInputProps: {
                      value: "true",
                      checked: sourceEvals[`b-${i}`] === "true",
                      onChange: () => handleSourceChange("b", i, "true"),
                    },
                  },
                  {
                    label: "NON",
                    nativeInputProps: {
                      value: "false",
                      checked: sourceEvals[`b-${i}`] === "false",
                      onChange: () => handleSourceChange("b", i, "false"),
                    },
                  },
                ]}
              />
            </div>
          ))}
        </section>
      )}

      {/* Comment */}
      <section className={fr.cx("fr-mb-4w")}>
        <Input
          label="Commentaire (optionnel)"
          hintText="Partagez vos observations sur cette question, les réponses ou les sources."
          textArea
          nativeTextAreaProps={{
            value: comment,
            onChange: (e) => setComment(e.target.value),
            rows: 3,
            maxLength: 2000,
          }}
        />
      </section>

      {/* Save button */}
      <div
        className={fr.cx(
          "fr-grid-row",
          "fr-grid-row--middle",
          "fr-grid-row--gutters",
          "fr-mb-2w",
        )}
      >
        <div style={{ flexShrink: 0 }}>
          <Button
            onClick={handleFieldChange}
            disabled={isSaving}
            iconId="fr-icon-save-line"
          >
            {isSaving ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </div>
        {saveStatus === "saved" && (
          <div className={fr.cx("fr-col")} aria-live="polite">
            <Alert severity="success" small description="Annotation enregistrée." />
          </div>
        )}
        {saveStatus === "error" && (
          <div className={fr.cx("fr-col")} aria-live="polite" role="alert">
            <Alert
              severity="error"
              small
              description="Erreur lors de l'enregistrement. Réessayez."
            />
          </div>
        )}
      </div>
    </div>
  );
}
