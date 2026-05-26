#!/bin/sh
# Copies the pre-built DSFR static assets into public/ so they can be
# served as <link rel="stylesheet"> + <link rel="font"> + <img>.
# Avoids running the giant DSFR CSS through webpack's CSS pipeline,
# which blows Acorn's stack on alpine/musl during `next build`.

set -eu

SRC="node_modules/@codegouvfr/react-dsfr/dsfr"
DEST="public/dsfr"

if [ ! -d "$SRC" ]; then
  echo "DSFR source not found at $SRC. Run npm install first." >&2
  exit 1
fi

mkdir -p "$DEST/utility/icons" "$DEST/fonts" "$DEST/icons"

cp "$SRC/dsfr.min.css" "$DEST/dsfr.min.css"
cp "$SRC/utility/icons/icons.min.css" "$DEST/utility/icons/icons.min.css"
cp -R "$SRC/fonts/." "$DEST/fonts/"
cp -R "$SRC/icons/." "$DEST/icons/"

echo "DSFR assets copied to $DEST"
