#!/bin/bash
set -e

JEKYLL="bundle exec jekyll"
OPTS=(--source .. --destination ../_site)
OPTS=${OPTS[*]}

case "$1" in
  run)
    ${JEKYLL} serve --skip-initial-build $OPTS
    ;;

  watch)
    ${JEKYLL} serve --watch --incremental $OPTS
    ;;

  *)
    ${JEKYLL} build $OPTS
    ;;
esac
