"use client";

import Link from "next/link";
import {
  DsfrProviderBase,
  StartDsfrOnHydration,
  type DsfrProviderProps,
} from "@codegouvfr/react-dsfr/next-app-router";
import { defaultColorScheme } from "./config";

export function DsfrProvider(props: DsfrProviderProps): React.ReactElement {
  return (
    <DsfrProviderBase {...props} Link={Link} defaultColorScheme={defaultColorScheme} />
  );
}

export { StartDsfrOnHydration };
