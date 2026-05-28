"use client";

import { useState } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Alert } from "@codegouvfr/react-dsfr/Alert";

interface ShareLinkBoxProps {
  token: string;
}

export function ShareLinkBox({ token }: ShareLinkBoxProps): React.ReactElement {
  const [copied, setCopied] = useState(false);
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/annotation/${token}`
      : `/annotation/${token}`;

  async function handleCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback for browsers that don't support clipboard API
      const input = document.createElement("input");
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  }

  return (
    <div
      className={fr.cx("fr-p-4w")}
      style={{ background: "#f5f5fe", border: "1px solid #6a6af4", borderRadius: "4px" }}
    >
      <p className={fr.cx("fr-text--bold", "fr-mb-2w")}>
        <span className="fr-icon-link-line" aria-hidden="true" /> Lien d'annotation
        à partager avec vos experts
      </p>
      <div className={fr.cx("fr-grid-row", "fr-grid-row--middle", "fr-grid-row--gutters")}>
        <div className={fr.cx("fr-col")}>
          <code
            style={{
              display: "block",
              padding: "8px 12px",
              background: "white",
              border: "1px solid #ddd",
              borderRadius: "4px",
              wordBreak: "break-all",
              fontSize: "0.875rem",
            }}
            aria-label="Lien de partage de la campagne"
          >
            {shareUrl}
          </code>
        </div>
        <div style={{ flexShrink: 0 }}>
          <Button
            onClick={handleCopy}
            priority="secondary"
            iconId="fr-icon-clipboard-line"
            size="small"
          >
            {copied ? "Copié !" : "Copier"}
          </Button>
        </div>
      </div>
      {copied && (
        <div aria-live="polite" className={fr.cx("fr-mt-2w")}>
          <Alert severity="success" small description="Lien copié dans le presse-papier." />
        </div>
      )}
    </div>
  );
}
