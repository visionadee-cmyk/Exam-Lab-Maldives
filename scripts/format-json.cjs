const fs = require('fs');
const path = require('path');

const papersDir = path.join(__dirname, '..', 'src', 'data', 'papers');
const files = [
  'biology-0610-2021-unit1-june-ms.json',
  'biology-0610-2021-unit1-november-ms.json',
  'biology-0610-2021-unit2-june-ms.json',
  'biology-0610-2021-unit2-november-ms.json',
  'biology-0610-2021-unit3-june-ms.json',
  'biology-0610-2021-unit3-november-ms.json',
  'biology-0610-2021-unit6-june-ms.json',
  'biology-0610-2021-unit6-november-ms.json'
];

files.forEach(file => {
  const filePath = path.join(papersDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log('Formatted', file);
});
