import type Link from "next/link";
import type { DefaultColorScheme } from "@codegouvfr/react-dsfr/next-app-router";

export const defaultColorScheme: DefaultColorScheme = "system";

declare module "@codegouvfr/react-dsfr/link" {
  interface RegisterLink {
    Link: typeof Link;
  }
}
