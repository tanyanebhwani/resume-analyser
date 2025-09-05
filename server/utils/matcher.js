// utils/matcher.js
const SKILLS = require("../skills");

// Escape special regex chars: . * + ? ^ $ { } ( ) | [ ] \
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Build a safe regex for a token (handles things like C++, Node.js)
// For pure alphanumerics -> use \bword\b
// Otherwise -> use non-alnum boundaries: (^|[^A-Za-z0-9])token(?=[^A-Za-z0-9]|$)
function makeTokenRegex(token) {
  const esc = escapeRegExp(token);
  if (/^[A-Za-z0-9]+$/.test(token)) {
    return new RegExp(`\\b${esc}\\b`, "i");
  }
  return new RegExp(`(?:^|[^A-Za-z0-9])${esc}(?=[^A-Za-z0-9]|$)`, "i");
}

function matchSkills(text) {
  const found = [];
  const missing = [];

  for (const skill of SKILLS) {
    const tokens = [skill.name, ...(skill.aliases || [])];
    const hit = tokens.some((t) => makeTokenRegex(t).test(text));
    if (hit) found.push(skill.name);
    else missing.push(skill.name);
  }
  return { found, missing };
}

module.exports = matchSkills;
