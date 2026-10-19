import fs from 'fs';

const map = JSON.parse(fs.readFileSync('scratch/real-art-map.json', 'utf8'));
let file = fs.readFileSync('src/data/newSectionsData.ts', 'utf8');

let count = 0;
for (const [id, url] of Object.entries(map)) {
  const regex = new RegExp(`(id:\\s*['"]${id}['"],[\\s\\S]*?artworkUrl:\\s*['"])([^'"]+)(['"])`);
  if (regex.test(file)) {
    file = file.replace(regex, `$1${url}$3`);
    count++;
  }
}

fs.writeFileSync('src/data/newSectionsData.ts', file, 'utf8');
console.log(`Successfully updated ${count} thumbnails in src/data/newSectionsData.ts!`);
