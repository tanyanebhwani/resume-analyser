function scoreResume({ text, skillsMatched = [], skillsRequired = [], educationKeywords = [] }) {
  // --- Skills (50%) --- 
  const totalSkills = skillsRequired.length || 1;
  const skillsScore = Math.min((skillsMatched.length / totalSkills) * 50, 50);

  // --- Experience (30%) ---
  // Detect experience section
  const expHeader = /experience|work history|employment/i;
  const hasExpSection = expHeader.test(text);

  // Detect date ranges (years)
  const yearRegex = /(19|20)\d{2}\s*[-–]\s*(19|20)\d{2}|(19|20)\d{2}\s*[-–]\s*present/i;
  const matches = text.match(new RegExp(yearRegex, "gi")) || [];
  let years = 0;
  matches.forEach(m => {
    const parts = m.match(/(19|20)\d{2}/g);
    if (parts && parts.length === 2) {
      years += Math.abs(parseInt(parts[1]) - parseInt(parts[0]));
    } else if (parts && parts.length === 1 && /present/i.test(m)) {
      years += new Date().getFullYear() - parseInt(parts[0]);
    }
  });
  let expScore = 0;
  if (hasExpSection && years >= 2) expScore = 30;
  else if (hasExpSection && years >= 1) expScore = 15;
  else expScore = 0;

  // --- Education (10%) ---
  const eduHeader = /education|academics|qualification/i;
  const eduKeywords = educationKeywords.length
    ? educationKeywords
    : ["b.tech", "bachelors", "masters", "university", "college", "phd", "mba","mca","m.tech"];
  const hasEduSection = eduHeader.test(text);
  const hasEduKeyword = eduKeywords.some(k => text.toLowerCase().includes(k));
  const eduScore = (hasEduSection || hasEduKeyword) ? 10 : 0;

  // --- Formatting (10%) ---
  const wordCount = text.split(/\s+/).length;
  const bulletCount = (text.match(/^\s*[-•]/gm) || []).length;
  let fmtScore = 0;
  if (wordCount >= 400 && wordCount <= 800) fmtScore += 5;
  if (bulletCount >= 5) fmtScore += 5;

  // --- Total ---
  const totalScore = Math.round(skillsScore + expScore + eduScore + fmtScore);
  console.log(`Score Breakdown => Skills: ${skillsScore}, Experience: ${expScore}, Education: ${eduScore}, Formatting: ${fmtScore}, Total: ${totalScore}`);
  return {
    totalScore,
    breakdown: {
      skills: Math.round(skillsScore),
      experience: expScore,
      education: eduScore,
      formatting: fmtScore
    },
    yearsExperience: years,
    wordCount,
    bulletCount
  };
}

module.exports = scoreResume;