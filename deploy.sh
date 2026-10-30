#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
npm test
python3 - <<'BUILD'
from pathlib import Path
import shutil
out=Path('dist');out.mkdir(exist_ok=True)
for name in ('index.html','favicon.svg'):
    shutil.copyfile(name,out/name)
for name in ('catalog','creational','structural','behavioral','modern'):
    target=out/name;target.mkdir(exist_ok=True)
    for source in Path(name).glob('*.js'):
        shutil.copyfile(source,target/source.name)
BUILD
npx -y wrangler pages deploy dist --project-name=js-design-patterns --branch=master --commit-dirty=true
