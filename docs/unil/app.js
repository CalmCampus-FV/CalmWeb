// CalmCampus dans UNIL Campus : maquette interactive. Aucun appel réseau, aucun stockage :
// tout l'état vit en mémoire et disparaît au rechargement.
import { CASES, outcome } from "./logic.js";

const $ = (s, el = document) => el.querySelector(s);
const NB = " "; // espace fine insécable avant ? : ; (typographie française)

// ---------- Icônes (traits simples, décoratives) ----------
const P = {
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M7 14h2M11 14h2M15 14h2M7 17h2M11 17h2"/>',
  cap: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
  doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  fork: '<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M16 3c-2 1-3 4-3 7h3v11"/>',
  news: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M7 9h5v4H7zM14 9h3M14 13h3M7 16h10"/>',
  star: '<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6-5.3-3-5.3 3 1.2-6L3.4 9.3l6-.7z"/>',
  card: '<rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 10h20M6 15h4"/>',
  people: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-4 3-6 6-6s6 2 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14c3 0 5 2 5 5"/>',
  map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
  bus: '<rect x="5" y="3" width="14" height="15" rx="3"/><path d="M5 11h14M8 21v-3M16 21v-3"/><circle cx="8.5" cy="14.5" r="1"/><circle cx="15.5" cy="14.5" r="1"/>',
  print: '<path d="M7 8V3h10v5"/><rect x="3" y="8" width="18" height="8" rx="2"/><path d="M7 13h10v8H7z"/>',
  heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  leaf: '<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15"/><path d="M5 19l7-7"/>',
  chev: '<path d="M9 5l7 7-7 7"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  out: '<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
};
const icon = (n, cls = "ic") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${P[n]}</svg>`;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// ---------- Services de l'UNIL (vérifiés sur unil.ch le 18.11.2026, voir HANDOFF.md) ----------
const U = "https://www.unil.ch/unil/fr/home/";
const SERVICES = [
  {
    id: "sante", name: "Accueil Santé",
    what: "Consultations infirmières gratuites et confidentielles, pour la santé physique et mentale, sur rendez-vous.",
    contact: [{ t: "021 692 25 77", tel: "+41216922577" }, { t: "accueilsante@unil.ch", mail: "accueilsante@unil.ch" }],
    url: U + "menuinst/campus/aides-et-soutiens/sante.html",
  },
  {
    id: "psy", name: "Consultation psychothérapeutique",
    what: "Psychiatres et psychologues du Département de psychiatrie du CHUV, pour les étudiant·es de l’UNIL. De 1 à 4 entretiens, la première consultation est gratuite. Rendez-vous par e-mail.",
    contact: [{ t: "consult.psy-unil@chuv.ch", mail: "consult.psy-unil@chuv.ch" }],
    url: U + "menuinst/campus/aides-et-soutiens/sante/sante-mentale.html",
  },
  {
    id: "social", name: "Consultations sociales (SASME)",
    what: "Écoute et orientation pour les questions personnelles, administratives ou financières liées aux études. Gratuit et confidentiel.",
    contact: [{ t: "021 692 60 30", tel: "+41216926030" }, { t: "affaires.sociales@unil.ch", mail: "affaires.sociales@unil.ch" }],
    url: U + "menuinst/campus/aides-et-soutiens/soutien-social.html",
  },
  {
    id: "finance", name: "Aides financières de l’UNIL (SASME)",
    what: "Aides financières et dispenses de taxes pour les étudiant·es en difficulté financière.",
    contact: [{ t: "affaires.sociales@unil.ch", mail: "affaires.sociales@unil.ch" }],
    url: U + "menuinst/campus/aides-et-soutiens/aides-financieres-et-administratives/aides-financieres-unil.html",
  },
  {
    id: "soc", name: "Service d’orientation et carrières (SOC)",
    what: "Pour faire le point sur ses études, se réorienter ou préparer la suite, en entretien individuel.",
    contact: [{ t: "021 692 21 30", tel: "+41216922130" }, { t: "orientation@unil.ch", mail: "orientation@unil.ch" }],
    url: U + "menuinst/universite/organisation-universite/unites-et-services/service-orientation-et-carrieres.html",
  },
];
const URGENCES_URL = U + "urgences.html";
const EMERGENCY = [
  { label: "Urgence sur le campus, 24 h/24", t: "021 692 20 00", tel: "+41216922000", note: "115 depuis un téléphone interne de l’UNIL" },
  { label: "Ambulance, urgences médicales", t: "144", tel: "144" },
  { label: "Médecin de garde (Vaud), urgences non vitales", t: "0848 133 133", tel: "0848133133" },
];

const QUESTIONS = [
  { key: "now", q: `Comment vous sentez-vous maintenant${NB}?`, lo: "Très mal", hi: "Très bien" },
  { key: "week", q: `Et cette semaine, globalement${NB}?`, lo: "Très difficile", hi: "Très bonne" },
  { key: "sleep", q: `Comment avez-vous dormi cette semaine${NB}?`, lo: "Très mal", hi: "Très bien" },
  { key: "note", q: `Quelque chose à ajouter${NB}?`, free: true },
];

// ---------- État (en mémoire seulement) ----------
const state = {};
function resetState(caseId) {
  const c = CASES[caseId];
  Object.assign(state, {
    caseId,
    view: "home",          // home | health
    cardDismissed: false,
    done: false,
    answers: { ...c.answers },
    data: { ...c.data },
    sheet: null,           // null | { step }
    announce: "",
  });
}

// ---------- Rendu ----------
const view = $("#phone-view");
const layer = $("#sheet-layer");
let lastFocus = null;

const LIST = [
  ["calendar", "Mon horaire"], ["cap", "Mes notes"], ["doc", "Supports de cours"], ["fork", "Restaurants"],
  ["news", "Actualités"], ["star", "Événements"], ["card", "Campuscard"], ["people", "Annuaire"],
  ["map", "Plan du campus"], ["print", "Impression"], ["bus", "Transports"],
];

function appBar(title, { back = false } = {}) {
  return `<div class="appbar">
    ${back ? `<button type="button" class="appbar-btn" data-act="home">${icon("back")}<span>Accueil</span></button>` : `<span class="appbar-ic">${icon("gear")}</span>`}
    <h2 class="appbar-title" tabindex="-1">${title}</h2>
    <span class="appbar-spacer"></span>
  </div>`;
}

function renderHome() {
  const showCard = !state.cardDismissed && !state.done;
  view.innerHTML = `
    ${appBar('UNIL <span class="sc">Campus</span>')}
    <div class="app-body">
      ${showCard ? `
      <div class="cc-card" role="group" aria-labelledby="cc-card-h">
        <span class="cc-card-ic">${icon("leaf")}</span>
        <div class="cc-card-text">
          <h3 id="cc-card-h">Votre point bien-être de la semaine</h3>
          <p>Quatre questions, moins d’une minute. Vos réponses restent sur votre téléphone.</p>
          <div class="cc-card-actions">
            <button type="button" class="app-btn" data-act="open">Commencer</button>
            <button type="button" class="app-link" data-act="later">Plus tard</button>
          </div>
        </div>
      </div>` : ""}
      <p class="phone-live sr" aria-live="polite">${esc(state.announce)}</p>
      <ul class="app-list" aria-label="Rubriques d’UNIL Campus (contenu existant, non simulé)">
        ${LIST.map(([i, l]) => `<li class="app-row is-static">${icon(i, "ic row-ic")}<span>${l}</span></li>`).join("")}
        <li><button type="button" class="app-row" data-act="health">${icon("heart", "ic row-ic")}<span>Santé et bien-être</span>${icon("chev", "ic row-chev")}</button></li>
      </ul>
      <p class="app-foot">Toucher pour masquer ou réordonner les éléments</p>
    </div>`;
}

function contactLinks(s) {
  return s.contact.map((c) => c.tel
    ? `<a href="tel:${c.tel}">${esc(c.t)}</a>`
    : `<a href="mailto:${c.mail}">${esc(c.t)}</a>`).join(" · ");
}
const pageLink = (url, text = "Page de l’UNIL") =>
  `<a class="ext" href="${url}" target="_blank" rel="noopener noreferrer" hreflang="fr">${text}<span class="lang" aria-hidden="true">FR</span>${icon("out", "ic ext-ic")}<span class="sr"> (unil.ch, en français, s’ouvre dans un nouvel onglet)</span></a>`;

function serviceCard(s, h = "h4") {
  return `<li class="svc"><${h} class="svc-h">${esc(s.name)}</${h}><p>${esc(s.what)}</p><p class="svc-c">${contactLinks(s)}</p><p>${pageLink(s.url)}</p></li>`;
}

function switchRow(key, label, desc) {
  const on = !!state.data[key];
  return `<div class="sw-row">
    <div><p class="sw-l" id="sw-${key}-l">${label}</p>${desc ? `<p class="sw-d" id="sw-${key}-d">${desc}</p>` : ""}</div>
    <button type="button" class="sw" role="switch" aria-checked="${on}" aria-labelledby="sw-${key}-l"${desc ? ` aria-describedby="sw-${key}-d"` : ""} data-act="toggle" data-key="${key}"><span></span></button>
  </div>`;
}

function renderHealth() {
  view.innerHTML = `
    ${appBar("Santé et bien-être", { back: true })}
    <div class="app-body pad">
      <p class="small-cap">Avec CalmCampus</p>
      <p>Un point d’une minute par semaine, et un guide vers l’aide de l’UNIL. Le but&#8239;: repérer tôt une période plus difficile et vous orienter vers l’aide de l’UNIL.</p>
      ${state.done
        ? `<p class="done-note">Point de la semaine fait. Le prochain vous sera proposé la semaine prochaine.</p>`
        : `<button type="button" class="app-btn wide" data-act="open">Faire le point de la semaine</button>`}
      <p class="phone-live sr" aria-live="polite">${esc(state.announce)}</p>

      <h3 class="sec-h">Les services de l’UNIL</h3>
      <ul class="svc-list">${SERVICES.map((s) => serviceCard(s)).join("")}</ul>

      <h3 class="sec-h">En cas d’urgence</h3>
      <ul class="emg">${EMERGENCY.map((e) => `<li><span>${esc(e.label)}${e.note ? `<small>${esc(e.note)}</small>` : ""}</span><a href="tel:${e.tel}">${esc(e.t)}</a></li>`).join("")}</ul>
      <p>${pageLink(URGENCES_URL, "Urgences UNIL")}</p>

      <h3 class="sec-h">Données du téléphone</h3>
      <p class="sw-intro">Facultatif. Sans données, vos quatre réponses suffisent.</p>
      ${switchRow("sleep", "Utiliser mes données de sommeil (facultatif)", "Durée du sommeil, lue et traitée uniquement sur le téléphone.")}
      <p class="sw-group">Autres données, désactivées par défaut</p>
      ${switchRow("steps", "Nombre de pas (facultatif)")}
      ${switchRow("screen", "Temps d’écran (facultatif)")}

      <details class="how">
        <summary>Comment ça marche</summary>
        <ul>
          <li>Tout est calculé sur votre téléphone. Rien ne quitte le téléphone.</li>
          <li>Ni CalmCampus ni l’UNIL ne reçoivent vos réponses ou vos données.</li>
          <li>Le sommeil ajoute du contexte. Ce sont vos réponses qui comptent.</li>
          <li>Si vous refusez l’accès aux données, les quatre réponses suffisent.</li>
          <li>Une fois par semaine au plus. Vous pouvez toujours répondre «&#8239;Plus tard&#8239;».</li>
          <li>CalmCampus ne remplace pas un avis médical. Il aide à repérer tôt une période plus difficile et à vous orienter vers l’aide de l’UNIL.</li>
        </ul>
      </details>
      <p class="cc-disc">CalmCampus est un prototype. Nous ne sommes pas des professionnels de santé. En cas de besoin, parlez à un médecin ou aux services de l’UNIL.</p>
    </div>`;
}

function sleepNote() {
  const ctx = CASES[state.caseId].sleepContext;
  if (!state.data.sleep || !ctx) return "";
  return `<p class="ctx"><span class="tag">Exemple</span> Selon votre téléphone, sommeil ${esc(ctx)}.</p>`;
}

function renderQuestion(i) {
  const q = QUESTIONS[i];
  const val = state.answers[q.key];
  let body;
  if (q.free) {
    body = `<label class="q" for="q-note">${q.q}</label>
      <p class="q-sub" id="q-note-d">Facultatif. Reste sur votre téléphone.</p>
      <textarea id="q-note" rows="4" aria-describedby="q-note-d">${esc(val || "")}</textarea>`;
  } else {
    body = `<fieldset class="scale-f">
      <legend class="q">${q.q}</legend>
      <div class="scale">${[1, 2, 3, 4, 5].map((n) => `
        <label class="scale-o"><input type="radio" name="q-${q.key}" value="${n}"${val === n ? " checked" : ""}>
        <span aria-hidden="true">${n}</span><span class="sr">${n} sur 5${n === 1 ? `, ${q.lo.toLowerCase()}` : n === 5 ? `, ${q.hi.toLowerCase()}` : ""}</span></label>`).join("")}
      </div>
      <div class="scale-ends" aria-hidden="true"><span>${q.lo}</span><span>${q.hi}</span></div>
    </fieldset>
    ${q.key === "sleep" ? sleepNote() : ""}`;
  }
  const last = i === QUESTIONS.length - 1;
  const answered = q.free ? true : Number.isInteger(val);
  return `<div class="sheet-head">
      <p class="step" id="sheet-step">Question ${i + 1} sur 4</p>
      <button type="button" class="x" data-act="close" aria-label="Fermer, plus tard">${icon("close")}</button>
    </div>
    <div class="progress" data-step="${i + 1}" aria-hidden="true"><span></span></div>
    ${body}
    <div class="sheet-actions">
      ${i > 0 ? `<button type="button" class="app-link" data-act="prev">Retour</button>` : "<span></span>"}
      <button type="button" class="app-btn" data-act="${last ? "finish" : "next"}">${last ? "Terminer" : answered ? "Suivant" : "Passer"}</button>
    </div>`;
}

function renderThanks() {
  const res = outcome(state.answers, CASES[state.caseId].previous);
  const extra = {
    calm: `<p>À la semaine prochaine.</p>`,
    gentle: `<p class="msg">Une semaine difficile, ça arrive.</p>
      <p>Si vous avez envie d’en parler, l’UNIL propose des services gratuits et confidentiels.</p>
      <p><button type="button" class="app-link inline" data-act="health">Voir les services de l’UNIL</button></p>`,
    support: `<p class="msg">Ces dernières semaines semblent plus lourdes que d’habitude.</p>
      <p>Vous n’avez pas à attendre que ça aille plus mal pour en parler. Ces services de l’UNIL sont là pour ça, gratuitement et en toute confidentialité&#8239;:</p>
      <ul class="svc-list compact">${SERVICES.filter((s) => s.id !== "finance").map((s) => serviceCard(s, "h3")).join("")}</ul>
      <p><button type="button" class="app-link inline" data-act="health">Tout le guide Santé et bien-être</button></p>
      <p class="small-txt">Si c’est urgent&#8239;: <a href="tel:144">144</a>, ou <a href="tel:+41216922000">021 692 20 00</a> sur le campus.</p>`,
  }[res];
  const noData = !state.data.sleep
    ? `<p class="ctx">Sans données du téléphone&#8239;: vos quatre réponses suffisent.</p>`
    : (res !== "calm" ? sleepNote() : "");
  return `<div class="sheet-head">
      <p class="step">Point de la semaine</p>
      <button type="button" class="x" data-act="close" aria-label="Fermer">${icon("close")}</button>
    </div>
    <div class="thanks" data-outcome="${res}">
      <h2 class="thanks-h" tabindex="-1">Merci.</h2>
      <p>Vos réponses restent sur votre téléphone.</p>
      ${extra}
      ${noData}
      <button type="button" class="app-btn wide" data-act="close">Fermer</button>
      <p class="cc-disc">CalmCampus est un prototype. Nous ne sommes pas des professionnels de santé. En cas de besoin, parlez à un médecin ou aux services de l’UNIL.</p>
    </div>`;
}

function renderSheet(focus = true) {
  if (!state.sheet) { layer.hidden = true; layer.innerHTML = ""; view.inert = false; return; }
  const s = state.sheet.step;
  layer.hidden = false;
  view.inert = true;
  layer.innerHTML = `<div class="sheet" role="dialog" aria-modal="true" aria-label="Point bien-être de la semaine">${s < 4 ? renderQuestion(s) : renderThanks()}</div>`;
  if (!focus) return;
  const target = s === 4 ? $(".thanks-h", layer)
    : $("input:checked", layer) || $("input, textarea", layer);
  target?.focus();
}

function render({ focus = null } = {}) {
  state.view === "health" ? renderHealth() : renderHome();
  renderSheet(false);
  if (focus === "title") $(".appbar-title", view)?.focus();
  else if (focus) $(focus, view)?.focus();
}

// ---------- Actions ----------
function openSheet() {
  lastFocus = document.activeElement;
  state.sheet = { step: 0 };
  renderSheet();
}
function closeSheet() {
  const wasDone = state.sheet?.step === 4;
  state.sheet = null;
  if (!wasDone) state.announce = "Point de la semaine reporté.";
  render();
  const back = (lastFocus && document.contains(lastFocus) && lastFocus) || $('[data-act="health"]', view) || $(".appbar-title", view);
  back?.focus();
}

layer.addEventListener("change", (e) => {
  const m = e.target.name?.match(/^q-(\w+)$/);
  if (!m) return;
  state.answers[m[1]] = Number(e.target.value);
  const next = $('[data-act="next"]', layer);
  if (next) next.textContent = "Suivant";
});
layer.addEventListener("input", (e) => { if (e.target.id === "q-note") state.answers.note = e.target.value; });

document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-act]");
  if (!b) return;
  const act = b.dataset.act;
  if (act === "open") openSheet();
  else if (act === "later") {
    state.cardDismissed = true;
    state.announce = "Carte masquée. Le point reste disponible dans Santé et bien-être.";
    render({ focus: '[data-act="health"]' });
  } else if (act === "health") {
    state.sheet = null; state.view = "health"; state.announce = "";
    render({ focus: "title" });
    view.scrollTop = 0;
  } else if (act === "home") {
    state.view = "home"; state.announce = "";
    render({ focus: '[data-act="health"]' });
  } else if (act === "next") { state.sheet.step++; renderSheet(); }
  else if (act === "prev") { state.sheet.step--; renderSheet(); }
  else if (act === "finish") { state.done = true; state.sheet.step = 4; state.announce = ""; render(); renderSheet(); }
  else if (act === "close") closeSheet();
  else if (act === "toggle") {
    const k = b.dataset.key;
    state.data[k] = !state.data[k];
    b.setAttribute("aria-checked", String(state.data[k]));
  }
});

// Clavier : Échap ferme la feuille, Tab reste dans la feuille tant qu'elle est ouverte.
document.addEventListener("keydown", (e) => {
  if (!state.sheet) return;
  if (e.key === "Escape") { e.preventDefault(); closeSheet(); return; }
  if (e.key !== "Tab") return;
  const f = [...layer.querySelectorAll("button, a[href], input:not([type=radio]), input[type=radio]:checked, textarea")]
    .filter((el) => !el.disabled && el.offsetParent !== null);
  const radios = layer.querySelectorAll("input[type=radio]");
  if (radios.length && !layer.querySelector("input[type=radio]:checked")) f.unshift(radios[0]);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

// ---------- Simulateur ----------
function setCase(id, { jump = false } = {}) {
  resetState(id);
  $("#case-letter").textContent = id;
  $("#case-logic").textContent = CASES[id].logic;
  if (jump) { state.done = true; state.sheet = { step: 4 }; }
  render();
  renderSheet(jump);
}
document.querySelectorAll('input[name="case"]').forEach((r) => r.addEventListener("change", () => setCase(r.value)));
$("#reset").addEventListener("click", () => setCase(state.caseId));
$("#jump-result").addEventListener("click", () => { lastFocus = $("#jump-result"); setCase(state.caseId, { jump: true }); });

// ?cas=B ouvre directement un cas (utile pour les captures d'écran).
const fromUrl = new URLSearchParams(location.search).get("cas")?.toUpperCase();
const initial = CASES[fromUrl] ? fromUrl : "A";
const radio = document.querySelector(`input[name="case"][value="${initial}"]`);
if (radio) radio.checked = true;
setCase(initial);
