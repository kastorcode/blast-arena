cd build

git init

git remote add origin https://github.com/kastorcode/blast-arena.git

git checkout -b server

git add .

git commit -m "Deploy"

git push origin server --force