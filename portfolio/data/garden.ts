/**
 * The five stones of the sand garden hero, one per company. Size follows
 * months spent there; every figure is taken from the resume (see chapters.ts).
 */
export interface Stone {
  company: string;
  years: string;
  fact: string;
  months: number;
  /** Garden position in world units: [x, z] for desktop, then phone. */
  at: [number, number];
  atPhone: [number, number];
}

export const STONES: Stone[] = [
  { company: "Runo", years: "2024 to now", fact: "20k+ users, 3k+ concurrent calls", months: 28, at: [1.6, -0.6], atPhone: [0.7, 1.6] },
  { company: "R3Factory", years: "2024", fact: "10k+ records a week", months: 6, at: [5.4, -2.0], atPhone: [-0.9, 2.5] },
  { company: "Finaccru", years: "2024", fact: "500+ documents a day", months: 1, at: [6.4, 1.5], atPhone: [1.0, 3.3] },
  { company: "XEV Charging", years: "2023", fact: "10k+ charge points", months: 1, at: [3.7, 1.9], atPhone: [-0.6, 4.2] },
  { company: "Otomator", years: "2021 to 2023", fact: "1,200+ employees", months: 26, at: [-0.9, 2.2], atPhone: [0.6, 5.0] },
];

export const GARDEN_LEDE = "Full-stack engineer in Hyderabad. I build the calling platform at Runo, used by 20k+ people.";
