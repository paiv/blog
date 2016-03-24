#!/bin/bash
set -e

TARGETDIR="../mathjax"
TEMPDIR="mathjax-build"

MATHJAX_MINI=(MathJax.js \
  config/Tex-AMS_CHTML.js \
  jax/output/CommonHTML/jax.js \
  jax/output/CommonHTML/autoload/mtable.js \
  jax/output/CommonHTML/fonts/TeX/fontdata.js \
  fonts/HTML-CSS/TeX/woff/MathJax_Main-Regular.woff \
  fonts/HTML-CSS/TeX/woff/MathJax_Math-Italic.woff \
)

mkdir -p "$TEMPDIR"
pushd "$TEMPDIR"

if [ ! -d "MathJax-master" ]
then
  if [ ! -f "mathjax-archive.zip" ]
  then
    echo "downloading MathJax"
    curl -RL# "https://github.com/mathjax/MathJax/archive/master.zip" -o "mathjax-archive.zip"
  fi

  echo "unpacking MathJax"
  unzip -q "mathjax-archive.zip"
fi

if [ -d "build" ]
then
  rm -r "build"
fi
mkdir "build"

pushd "MathJax-master"
rsync -Rv ${MATHJAX_MINI[*]} ../build/

popd
popd

if [ -d "$TARGETDIR" ]
then
  rm -r "$TARGETDIR"
fi
cp -r "$TEMPDIR/build" "$TARGETDIR"
