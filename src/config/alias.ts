import tsconfig from '../../tsconfig.json';
import moduleAlias from 'module-alias';
import path from 'path';

const alias = tsconfig.compilerOptions.paths;

const mainFolder = __filename.endsWith('ts') ? 'src' : 'dist'

Object.entries(alias).forEach((x) => {
  const dirPath = x[1].shift()
  if (dirPath) {
    moduleAlias.addAlias(x[0].replace('/*', ''), path.resolve(mainFolder + '/' + dirPath).replace('/*', ''))
  }
})

moduleAlias()