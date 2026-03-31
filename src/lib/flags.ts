export const FLAGS: Record<string, string> = {
  "México": "🇲🇽", "Sudáfrica": "🇿🇦", "Corea del Sur": "🇰🇷",
  "Canadá": "🇨🇦", "Qatar": "🇶🇦", "Suiza": "🇨🇭",
  "Brasil": "🇧🇷", "Marruecos": "🇲🇦", "Haití": "🇭🇹",
  "Escocia": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "EE.UU.": "🇺🇸", "Paraguay": "🇵🇾",
  "Australia": "🇦🇺", "Alemania": "🇩🇪", "Curazao": "🇨🇼",
  "Costa de Marfil": "🇨🇮", "Ecuador": "🇪🇨", "Países Bajos": "🇳🇱",
  "Japón": "🇯🇵", "Túnez": "🇹🇳", "Bélgica": "🇧🇪",
  "Egipto": "🇪🇬", "Irán": "🇮🇷", "Nueva Zelanda": "🇳🇿",
  "España": "🇪🇸", "Cabo Verde": "🇨🇻", "Arabia Saudita": "🇸🇦",
  "Uruguay": "🇺🇾", "Francia": "🇫🇷", "Senegal": "🇸🇳",
  "Noruega": "🇳🇴", "Austria": "🇦🇹", "Jordania": "🇯🇴",
  "Argentina": "🇦🇷", "Argelia": "🇩🇿", "Portugal": "🇵🇹",
  "Uzbekistán": "🇺🇿", "Colombia": "🇨🇴", "Inglaterra": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "Croacia": "🇭🇷", "Ghana": "🇬🇭", "Panamá": "🇵🇦",
};

export function flag(team: string): string {
  return FLAGS[team] ?? "🏴";
}
