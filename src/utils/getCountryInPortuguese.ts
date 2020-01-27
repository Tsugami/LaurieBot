import countries from '@assets/paises_em_portugues.json';

export default function getCountryInPortuguese(countryInEnglish: string): string {
  const country = countryInEnglish.toLowerCase();
  const findCountryByName = countries.find(x => x.nome_pais_int.toLowerCase() === country);
  if (findCountryByName) return findCountryByName.nome_pais;

  const initials = countryInEnglish.slice(0, 2).toLowerCase();
  const findCountryByInitials = countries.find(x => initials === x.sigla.toLowerCase());
  if (findCountryByInitials) return findCountryByInitials.nome_pais;

  return countryInEnglish;
}
