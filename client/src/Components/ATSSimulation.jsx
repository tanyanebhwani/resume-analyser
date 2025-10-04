import React from "react";

const ATSSimulation = ({ resumeText, skills }) => {
  // --- 1. Basic parsing of sections ---
  const sections = {
    education: /education[:\s]/i.test(resumeText),
    experience: /experience[:\s]/i.test(resumeText),
    projects: /projects?[:\s]/i.test(resumeText),
    skills: /skills?[:\s]/i.test(resumeText),
  };

  // --- 2. Extract skills mentioned in resume ---
  const foundSkills = skills.found;
  const missingSkills = skills.missing;

  return (
    <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 p-6 rounded-xl shadow-lg space-y-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-indigo-800 flex items-center gap-2 mb-2">
        <span className="inline-block bg-indigo-200 text-indigo-700 rounded-full px-3 py-1 text-base font-semibold shadow-sm">ATS Simulation Results</span>
      </h2>

      {/* Section presence check */}
      <div className="bg-white/80 p-4 rounded-lg border border-indigo-100 shadow-sm">
        <h3 className="font-semibold text-indigo-600 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" /></svg>
          Section Coverage
        </h3>
        <ul className="grid grid-cols-2 gap-3">
          {Object.entries(sections).map(([section, exists], idx) => (
            <li key={idx} className="flex items-center gap-2 text-base">
              {exists ? (
                <span className="flex items-center gap-1 text-green-600 font-medium">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  {section.charAt(0).toUpperCase() + section.slice(1)} found
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-500 font-medium">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  {section.charAt(0).toUpperCase() + section.slice(1)} missing
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Skills match */}
      <div className="bg-white/80 p-4 rounded-lg border border-purple-100 shadow-sm">
        <h3 className="font-semibold text-purple-600 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01" /></svg>
          Skill Match
        </h3>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <span className="block text-green-700 font-medium mb-1">Found Skills:</span>
            <div className="flex flex-wrap gap-2">
              {foundSkills.length > 0 ? foundSkills.map((skill, i) => (
                <span key={i} className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-semibold shadow-sm">{skill}</span>
              )) : <span className="text-gray-400">None</span>}
            </div>
          </div>
          <div className="flex-1">
            <span className="block text-red-600 font-medium mb-1">Missing Skills:</span>
            <div className="flex flex-wrap gap-2">
              {missingSkills.length > 0 ? missingSkills.map((skill, i) => (
                <span key={i} className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-semibold shadow-sm">{skill}</span>
              )) : <span className="text-gray-400">None</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white/80 p-4 rounded-lg border border-blue-100 shadow-sm">
        <h3 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 17l4 4 4-4m-4-5v9" /></svg>
          Summary
        </h3>
        <p className="text-gray-700 text-base">
          Your resume would pass through an ATS and extract the above key sections.<br />
          <span className="font-medium text-indigo-700">Improving missing sections/skills will increase your ATS score.</span>
        </p>
      </div>
    </div>
  );
};

export default ATSSimulation;
