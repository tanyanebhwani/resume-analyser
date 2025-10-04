// grammercheck.js (CommonJS + dynamic import)
async function errorIdentif() {
  const {
    fleschReadingEase,
    fleschKincaidGrade,
    colemanLiauIndex,
    automatedReadabilityIndex,
    daleChallReadabilityScore,
    difficultWords,
    linsearWriteFormula,
    gunningFog,
    textStandard
  } = await import("text-readability");

  const text = `Playing games has always been thought to be important 
  to the development of well-balanced and creative children; 
  however, what part, if any, they should play in the lives 
  of adults has never been researched that deeply.`;

  console.log("Flesch-Kincaid Grade:", fleschKincaidGrade(text));
  console.log("Flesch Reading Ease:", fleschReadingEase(text));
  console.log("Gunning Fog:", gunningFog(text));
  console.log("Text Standard:", textStandard(text));
}

module.exports = errorIdentif;
