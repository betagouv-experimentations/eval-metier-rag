import type { Metadata } from "next";
import Link from "next/link";
import { DsfrProvider, StartDsfrOnHydration } from "@/lib/dsfr/DsfrProvider";
import { getHtmlAttributes } from "@/lib/dsfr/getHtmlAttributes";
import { Header } from "@codegouvfr/react-dsfr/Header";
import { Footer } from "@codegouvfr/react-dsfr/Footer";
import { headerFooterDisplayItem, Display } from "@codegouvfr/react-dsfr/Display";

export const metadata: Metadata = {
  title: "Éval Métier RAG",
  description: "Outil d'évaluation humaine de réponses générées par des systèmes RAG",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): React.ReactElement {
  const lang = "fr";
  return (
    <html {...getHtmlAttributes({ lang })}>
      <head>
        <link rel="stylesheet" href="/dsfr/dsfr.min.css" />
        <link rel="stylesheet" href="/dsfr/utility/icons/icons.min.css" />
      </head>
      <body>
        <DsfrProvider lang={lang}>
          <a className="fr-skiplink" href="#content">
            Aller au contenu
          </a>
          <Header
            brandTop={
              <>
                RÉPUBLIQUE
                <br />
                FRANÇAISE
              </>
            }
            homeLinkProps={{ href: "/", title: "Accueil — Éval Métier RAG" }}
            serviceTitle="Éval Métier RAG"
            serviceTagline="Évaluation humaine de systèmes RAG"
            quickAccessItems={[
              headerFooterDisplayItem,
              {
                iconId: "fr-icon-add-circle-line",
                text: "Nouvelle campagne",
                linkProps: { href: "/campagnes/nouvelle" },
              },
            ]}
            navigation={[
              { text: "Accueil", linkProps: { href: "/" } },
              { text: "Campagnes", linkProps: { href: "/campagnes" } },
            ]}
          />
          <main id="content" role="main" tabIndex={-1}>
            {children}
          </main>
          <Footer
            accessibility="partially compliant"
            contentDescription="Prototype beta.gouv.fr — Évaluation humaine de réponses RAG"
            brandTop={
              <>
                RÉPUBLIQUE
                <br />
                FRANÇAISE
              </>
            }
            homeLinkProps={{ href: "/", title: "Accueil — Éval Métier RAG" }}
            bottomItems={[
              headerFooterDisplayItem,
              {
                text: "Mentions légales",
                linkProps: { href: "/mentions-legales" },
              },
              {
                text: "Données personnelles",
                linkProps: { href: "/donnees-personnelles" },
              },
              {
                text: "Accessibilité : non conforme",
                linkProps: { href: "/accessibilite" },
              },
            ]}
          />
          <Display />
          <StartDsfrOnHydration />
        </DsfrProvider>
      </body>
    </html>
  );
}
