const FIFA_TO_ISO2: Record<string, string> = {
  MEX: 'mx', RSA: 'za', KOR: 'kr', CZE: 'cz',
  CAN: 'ca', SUI: 'ch', BIH: 'ba', QAT: 'qa',
  BRA: 'br', SCO: 'gb',  MAR: 'ma', HAI: 'ht',
  USA: 'us', TUR: 'tr', PAR: 'py', AUS: 'au',
  GER: 'de', ECU: 'ec', CIV: 'ci', CUW: 'cw',
  NED: 'nl', JPN: 'jp', TUN: 'tn', SWE: 'se',
  FRA: 'fr', NOR: 'no', SEN: 'sn', IRQ: 'iq',
  ESP: 'es', URU: 'uy', KSA: 'sa', CPV: 'cv',
  BEL: 'be', IRN: 'ir', NZL: 'nz', EGY: 'eg',
  ENG: 'gb', CRO: 'hr', PAN: 'pa', GHA: 'gh',
  POR: 'pt', COL: 'co', UZB: 'uz', COD: 'cd',
  ARG: 'ar', ALG: 'dz', JOR: 'jo', AUT: 'at',
};

export function flagUrl(fifaCode: string): string {
  const iso2 = FIFA_TO_ISO2[fifaCode.toUpperCase()];
  if (!iso2) return '';
  return `https://flagcdn.com/w40/${iso2}.png`;
}

export function flagUrl2x(fifaCode: string): string {
  const iso2 = FIFA_TO_ISO2[fifaCode.toUpperCase()];
  if (!iso2) return '';
  return `https://flagcdn.com/w80/${iso2}.png`;
}
