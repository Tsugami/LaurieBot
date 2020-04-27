import moduleAlias, { addAliases } from 'module-alias';
import { join } from 'path';

addAliases({
  '@categories': join(__dirname, '..', 'structures', 'categories'),
  '@services': join(__dirname, '..', 'services'),
  '@utils': join(__dirname, '..', 'utils'),
  '@database': join(__dirname, '..', 'database'),
  '@assets': join(__dirname, '..', '..', 'assets'),
  '@structures': join(__dirname, '..', 'structures'),
  '@config': join(__dirname, '..', 'config'),
});

moduleAlias();
