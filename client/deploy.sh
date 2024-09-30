cd build

git init

git remote add origin https://github.com/kastorcode/blast-arena.git

git checkout -b client

git add .

git commit -m "Deploy"

git push origin client --force