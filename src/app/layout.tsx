import type { Metadata } from "next";
import Link from "next/link";
import { DsfrProvider, StartDsfrOnHydration } from "@/lib/dsfr/DsfrProvider";
import { getHtmlAttributes } from "@/lib/dsfr/getHtmlAttributes";

export const metadata: Metadata = {
  title: "Prototype beta.gouv",
  description: "Prototype de service public numérique français",
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
          <a className="fr-skiplinks" href="#content">
            Aller au contenu
          </a>
          <header role="banner" className="fr-header">
            <div className="fr-header__body">
              <div className="fr-container">
                <div className="fr-header__body-row">
                  <div className="fr-header__brand fr-enlarge-link">
                    <div className="fr-header__brand-top">
                      <div className="fr-header__logo">
                        <p className="fr-logo">
                          République
                          <br />
                          Française
                        </p>
                      </div>
                    </div>
                    <div className="fr-header__service">
                      <Link href="/" title="Accueil">
                        <p className="fr-header__service-title">Prototype beta.gouv</p>
                      </Link>
                      <p className="fr-header__service-tagline">
                        Service public numérique en construction
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <main id="content" role="main">
            {children}
          </main>
          <footer className="fr-footer" role="contentinfo">
            <div className="fr-container">
              <div className="fr-footer__body">
                <div className="fr-footer__brand fr-enlarge-link">
                  <p className="fr-logo">
                    République
                    <br />
                    Française
                  </p>
                </div>
                <div className="fr-footer__content">
                  <p className="fr-footer__content-desc">
                    Prototype développé dans le cadre de beta.gouv.fr
                  </p>
                </div>
              </div>
              <div className="fr-footer__bottom">
                <ul className="fr-footer__bottom-list">
                  <li className="fr-footer__bottom-item">
                    <Link className="fr-footer__bottom-link" href="/mentions-legales">
                      Mentions légales
                    </Link>
                  </li>
                  <li className="fr-footer__bottom-item">
                    <Link className="fr-footer__bottom-link" href="/donnees-personnelles">
                      Données personnelles
                    </Link>
                  </li>
                  <li className="fr-footer__bottom-item">
                    <Link className="fr-footer__bottom-link" href="/accessibilite">
                      Accessibilité : non conforme
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </footer>
          <StartDsfrOnHydration />
        </DsfrProvider>
      </body>
    </html>
  );
}
