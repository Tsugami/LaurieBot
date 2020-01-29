"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _paises_em_portuguesjson = require('@assets/paises_em_portugues.json'); var _paises_em_portuguesjson2 = _interopRequireDefault(_paises_em_portuguesjson);

 function getCountryInPortuguese(countryInEnglish) {
  const country = countryInEnglish.toLowerCase();
  const findCountryByName = _paises_em_portuguesjson2.default.find(x => x.nome_pais_int.toLowerCase() === country);
  if (findCountryByName) return findCountryByName.nome_pais;

  const initials = countryInEnglish.slice(0, 2).toLowerCase();
  const findCountryByInitials = _paises_em_portuguesjson2.default.find(x => initials === x.sigla.toLowerCase());
  if (findCountryByInitials) return findCountryByInitials.nome_pais;

  return countryInEnglish;
} exports.default = getCountryInPortuguese;
