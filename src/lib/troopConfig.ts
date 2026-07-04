export interface TroopDetails {
  name: string;
  shortName: string;
  logo: string;
  slogan: string;
  schoolName: string;
  address: string;
  phone: string;
  email: string;
  gslName: string;
  gslQuote: string;
}

export const DEFAULT_TROOP_DETAILS: TroopDetails = {
  name: "Ananda Sastralaya Kotte Scout Group",
  shortName: "ASK Kotte",
  logo: "ASK",
  slogan: "Official Maroon and Gold portal of the Ananda Sastralaya, Kotte Boy Scout Troop. Fast, secure, and passwordless.",
  schoolName: "Ananda Sastralaya, Kotte",
  address: "Ananda Sastralaya Kotte Campus, No 42, Kotte Road, Sri Lanka",
  phone: "+94 11 269 6681",
  email: "scouts@sastralaya.lk",
  gslName: "Kapila Jayawardene",
  gslQuote: "Scouting is a game with a purpose. It teaches self-reliance, leadership, and resilience that prepares our youth for the global stage."
};

export function getTroopDetails(): TroopDetails {
  const saved = localStorage.getItem('sastralaya_troop_details');
  if (saved) {
    try {
      return { ...DEFAULT_TROOP_DETAILS, ...JSON.parse(saved) };
    } catch (e) {
      // fallback
    }
  }
  return DEFAULT_TROOP_DETAILS;
}

export function saveTroopDetails(details: TroopDetails): void {
  localStorage.setItem('sastralaya_troop_details', JSON.stringify(details));
  window.dispatchEvent(new Event('troop_details_updated'));
}
