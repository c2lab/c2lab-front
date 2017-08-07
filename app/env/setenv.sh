#! /bin/bash

pushd .

cd app/env

ENVAR=`echo $ENV | tr [:upper:] [:lower:]`
CHOSEN="${ENVAR:-dev}.js"

cat $CHOSEN > active.js

popd