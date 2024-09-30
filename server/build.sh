folder="build"

if [ -d $folder ]; then
  rm -rf $folder
fi

yarn esbuild src/index.ts --bundle --platform=node --outfile=$folder/index.js

cp package.json $folder/