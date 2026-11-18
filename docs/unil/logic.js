// CalmCampus dans UNIL Campus : la logique de la démo, sans DOM (testée par test/unil.test.mjs).
//
// Règle : le message dépend des réponses de l'étudiant·e (humeur maintenant, semaine,
// sommeil) et des semaines précédentes. Les données de sommeil du téléphone, si
// l'étudiant·e les autorise, ajoutent seulement du contexte : elles ne changent jamais
// le message. Sans elles, les quatre réponses suffisent.

/** Une semaine est « plus difficile » quand la moyenne des réponses données est de 2,5 ou moins (échelle 1 à 5). */
export const LOW_WEEK = 2.5;

/** Moyenne des réponses données (les questions passées ne comptent pas). Null si aucune réponse. */
export function weekScore(answers) {
  const vals = ["now", "week", "sleep"].map((k) => answers?.[k]).filter((v) => Number.isInteger(v) && v >= 1 && v <= 5);
  if (!vals.length) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

export const isLowWeek = (answers) => {
  const s = weekScore(answers);
  return s !== null && s <= LOW_WEEK;
};

/**
 * "calm"     : semaine ordinaire, juste le merci.
 * "gentle"   : une semaine plus difficile, un mot doux et un lien léger vers les services.
 * "support"  : cette semaine et au moins les deux précédentes plus difficiles :
 *              une suggestion calme de regarder les services de l'UNIL, listés.
 */
export function outcome(answers, previousWeeks = []) {
  if (!isLowWeek(answers)) return "calm";
  let lowRun = 0;
  for (const w of [...previousWeeks].reverse()) { if (w.low) lowRun++; else break; }
  return lowRun >= 2 ? "support" : "gentle";
}

/** Les cas simulés. Les réponses sont pré-remplies ; la personne qui teste peut les changer. */
export const CASES = {
  A: {
    title: "Une semaine normale",
    answers: { now: 4, week: 4, sleep: 4, note: "" },
    previous: [{ low: false }, { low: false }],
    data: { sleep: true, steps: false, screen: false },
    sleepContext: "proche de d’habitude",
    logic: "Réponses dans la moyenne : seul l’écran de remerciement s’affiche. Pas de message, pas de lien en plus.",
  },
  B: {
    title: "Une semaine difficile",
    answers: { now: 2, week: 2, sleep: 3, note: "" },
    previous: [{ low: false }, { low: false }],
    data: { sleep: true, steps: false, screen: false },
    sleepContext: "un peu plus court que d’habitude",
    logic: "Une seule semaine plus basse : un mot rassurant et un lien discret vers les services, sans inciter à consulter.",
  },
  C: {
    title: "Plusieurs semaines difficiles",
    answers: { now: 2, week: 2, sleep: 2, note: "" },
    previous: [{ low: true }, { low: true }],
    data: { sleep: true, steps: false, screen: false },
    sleepContext: "plus court que d’habitude depuis trois semaines",
    logic: "Trois semaines plus basses d’affilée (humeur et sommeil) : une suggestion calme de regarder les services de l’UNIL, listés avec leurs coordonnées. Le ton reste calme, sans pression.",
  },
  D: {
    title: "Refuse l’accès aux données",
    answers: { now: 4, week: 3, sleep: 4, note: "" },
    previous: [{ low: false }, { low: false }],
    data: { sleep: false, steps: false, screen: false },
    sleepContext: null,
    logic: "Aucune donnée du téléphone : tout fonctionne avec les quatre réponses seules. Le message suit les mêmes règles que pour les autres cas.",
  },
};
