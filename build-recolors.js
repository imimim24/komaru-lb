import fs from 'fs';
import { execSync } from 'child_process';
import AdmZip from 'adm-zip';

const themes = [
  { name: 'red', file: 'src/recolors/red.scss' },
  { name: 'blue', file: 'src/recolors/blue.scss' },
  { name: 'green', file: 'src/recolors/green.scss' },
  { name: 'white', file: 'src/recolors/white.scss' },
  { name: 'darkred', file: 'src/recolors/darkred.scss' },
  { name: 'golden', file: 'src/recolors/golden.scss' },
  { name: 'mint', file: 'src/recolors/mint.scss' },
  { name: 'pink', file: 'src/recolors/pink.scss' },
  { name: 'purple', file: 'src/recolors/purple.scss' },
  { name: 'lime', file: 'src/recolors/lime.scss' }
];

themes.forEach(theme => {
  fs.copyFileSync(theme.file, 'src/colors.scss');
  execSync('npm run build', { stdio: 'inherit' });

  const zip = new AdmZip();
  zip.addLocalFolder('dist');
  zip.writeZip(`komaru-${theme.name}.zip`);

  fs.rmSync('dist', { recursive: true, force: true });
});
