const CODES: Record<string, string> = {
  "México": "mx", "Sudáfrica": "za", "Corea del Sur": "kr",
  "Canadá": "ca", "Qatar": "qa", "Catar": "qa", "Suiza": "ch",
  "Brasil": "br", "Marruecos": "ma", "Haití": "ht", "Escocia": "gb-sct",
  "EE.UU.": "us", "Estados Unidos": "us", "Paraguay": "py", "Australia": "au",
  "Alemania": "de", "Curazao": "cw", "Costa de Marfil": "ci", "Ecuador": "ec",
  "Países Bajos": "nl", "Japón": "jp", "Túnez": "tn",
  "Bélgica": "be", "Egipto": "eg", "Irán": "ir", "Nueva Zelanda": "nz",
  "España": "es", "Cabo Verde": "cv", "Arabia Saudita": "sa", "Uruguay": "uy",
  "Francia": "fr", "Senegal": "sn", "Noruega": "no",
  "Argentina": "ar", "Argelia": "dz", "Austria": "at", "Jordania": "jo",
  "Portugal": "pt", "Uzbekistán": "uz", "Colombia": "co",
  "Inglaterra": "gb-eng", "Croacia": "hr", "Ghana": "gh", "Panamá": "pa",
  "Turquía": "tr", "Kosovo": "xk", "Dinamarca": "dk", "Chequia": "cz",
  "Italia": "it", "Bosnia": "ba", "Suecia": "se", "Polonia": "pl",
  "Irak": "iq", "Bolivia": "bo", "Jamaica": "jm",
  "Bosnia y Herzegovina": "ba", "Rep. Dem. del Congo": "cd",
};

export function flagUrl(team: string): string | null {
  const code = CODES[team];
  if (!code) return null;
  return `https://flagcdn.com/w40/${code}.png`;
}
