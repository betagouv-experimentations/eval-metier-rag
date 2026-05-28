"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { fr } from "@codegouvfr/react-dsfr";
import { Upload } from "@codegouvfr/react-dsfr/Upload";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { CallOut } from "@codegouvfr/react-dsfr/CallOut";

export function CampagneUploadForm(): React.ReactElement {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (!file) {
      setError("Veuillez sélectionner un fichier.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/campagnes", {
        method: "POST",
        body: formData,
      });

      const data: unknown = await res.json();

      if (!res.ok) {
        const errData = data as { error?: string };
        setError(errData.error ?? "Une erreur est survenue lors de l'import.");
        return;
      }

      const campaign = data as { id: string };
      router.push(`/campagnes/${campaign.id}`);
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate>
      <CallOut
        title="Format attendu du fichier"
        iconId="ri-information-line"
        bodyAs="div"
      >
        <p className={fr.cx("fr-mb-1w")}>
          Votre fichier Excel ou CSV doit contenir ces colonnes (dans n'importe quel ordre) :
        </p>
        <ul className={fr.cx("fr-mb-0")}>
          <li>
            <strong>question</strong> — la question posée au système
          </li>
          <li>
            <strong>réponse_A</strong> — la réponse du modèle A
          </li>
          <li>
            <strong>réponse_B</strong> — la réponse du modèle B (optionnel)
          </li>
          <li>
            <strong>sources_A</strong> — les sources du modèle A (optionnel)
          </li>
          <li>
            <strong>sources_B</strong> — les sources du modèle B (optionnel)
          </li>
        </ul>
      </CallOut>

      <div className={fr.cx("fr-mt-4w")}>
        <Upload
          label="Fichier Excel ou CSV"
          hint="Formats acceptés : .xlsx, .xls, .csv — Taille max : 5 Mo"
          nativeInputProps={{
            name: "file",
            accept: ".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv",
            required: true,
            "aria-describedby": error ? "upload-error" : undefined,
          }}
          state={error ? "error" : "default"}
          stateRelatedMessage={error ? error : undefined}
        />
      </div>

      {error && (
        <div className={fr.cx("fr-mt-2w")} id="upload-error" role="alert" aria-live="polite">
          <Alert
            severity="error"
            small
            description={error}
          />
        </div>
      )}

      <div className={fr.cx("fr-mt-4w")}>
        <Button type="submit" disabled={isLoading} iconId="fr-icon-upload-2-line">
          {isLoading ? "Import en cours…" : "Importer et créer la campagne"}
        </Button>
      </div>
    </form>
  );
}
