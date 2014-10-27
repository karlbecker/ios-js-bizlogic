#!/bin/bash
rm -rf out/
cp -r web/ out/
ts_opts=""
ts_dirs="defs/*.ts lib/base/*.ts lib/services/*.ts lib/**/*.ts"
if [[ $@ == *--test* ]]
then
  ts_dirs="${ts_dirs} test/*.ts"
  ts_opts="${ts_opts} --sourcemap"
  cp -r lib out #for source maps
fi

tsc --out out/js/tsapp-compiled.js --target ES5 ${ts_opts} ${ts_dirs}