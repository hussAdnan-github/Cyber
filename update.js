const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.includes(path.sep + 'details' + path.sep) && file.endsWith('page.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('d:/projects/Security/app/dashboard');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('Object.entries') && content.includes('>{key}</div>')) {
    content = content.replace(/>\{key\}<\/div>/g, '>{translateField(key)}</div>');
    if (!content.includes('translateField')) {
      content = content.replace(/import \{ api \} from ["']@\/lib\/api["'];/, "import { api } from \"@/lib/api\";\nimport { translateField } from \"@/lib/translations\";");
    }
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
  }
});
