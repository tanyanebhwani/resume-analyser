const sw = require("stopword");
const natural = require("natural");
const stemmer = natural.PorterStemmer;
const regex = require("regex");
// ✅ Your skills dictionary (expand as needed)
const skills = require("../skills");

// ✅ Escape special characters in regex
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ✅ Preprocess text: lowercase, remove stopwords, stem
function preprocess(text) {
  const words = text.toLowerCase().split(/\s+/);        // split into words
  const noStopwords = sw.removeStopwords(words);        // remove filler words
  const stemmed = noStopwords.map(w => stemmer.stem(w));// reduce to base form
  return stemmed.join(" ");
}

function skillExists(text,skill){
    const match = skill.aliases.some(alias => {
      const regex = new RegExp(`\\b${escapeRegex(alias)}\\b`, "i");
      return regex.test(text);
    });
    if (match) {
        return true;
    }
    return false;
}
// ✅ Main function to compare Resume & JD
function matchResumeWithJD(resumeText, jdText) {
  // Preprocess both texts
  resumeText = preprocess(resumeText);
  const cleanResume = escapeRegex(resumeText);
  jdText = preprocess(jdText);
  const cleanJD = escapeRegex(jdText);

  // Check skills
  const jdFound = [];
  const jdMiss = [];

  skills.forEach(skill => {
    if (skillExists(cleanJD, skill) && skillExists(cleanResume, skill)) {
      jdFound.push(skill);
    } else if (skillExists(cleanJD, skill) && !skillExists(cleanResume, skill)) {
      jdMiss.push(skill);
    }
  });

  // Score = matched skills ÷ required skills
  const totalRelevant = jdFound.length + jdMiss.length;
  const jdScore = totalRelevant > 0 ? (jdFound.length / totalRelevant) * 100 : 0;
  return {jdScore:jdScore.toFixed(2),jdFound: jdFound.map(s => s.name), jdMiss: jdMiss.map(s => s.name) };
}

module.exports = matchResumeWithJD;