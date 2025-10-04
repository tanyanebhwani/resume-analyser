import React, { useState } from "react";
import GrammerReadability from "./GrammerReadability";
import ATSSimulation from "./ATSSimulation";
export default function ResumeUploader() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [skills, setSkills] = useState({ found: [], missing: [] });
  const [jdMatch, setJdMatch] = useState(null);
  const [scoring, setScoring] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!file) {
      setError("Please choose a resume file first.");
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append("resume", file);
      form.append("jobDescription", jobDescription);
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/upload`, {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Upload failed");
      }

      const data = await res.json();
      setExtractedText(data.extractedText || "");
      setSkills(data.skills || { found: [], missing: [] });
      setJdMatch(data.jdMatch || null);
      setScoring(data.scoring || null);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 py-10 px-4">
      <div className="mx-auto">
        <h1 className="text-5xl font-extrabold text-center text-indigo-800 mb-2 drop-shadow-lg tracking-tight flex items-center justify-center gap-3">
          <span className="inline-block text-indigo-500 px-4 py-2 text-3xl font-bold">Resume Analyser</span>
        </h1>
        <p className="text-center text-md text-gray-600 mb-8 font-sm">
          Upload your resume and job description to see your matched and missing skills!
        </p>
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center gap-6 border border-gray-100">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full cursor-pointer bg-gray-50 hover:bg-gray-100 border border-dashed border-gray-300 rounded-lg p-6 transition"
            >
              <svg
                className="w-12 h-12 text-indigo-400 mb-2"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16V4m0 0L8 8m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                />
              </svg>
              <span className="text-indigo-700 font-medium text-base">
                Upload or drag your resume
              </span>
              <span className="text-gray-400 text-xs mt-1">
                PDF or DOCX, max 10MB
              </span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="sr-only"
              />
              {file && (
                <span className="mt-2 text-green-700 text-xs font-medium bg-green-50 px-2 py-1 rounded-full border border-green-100 flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  {file.name}
                </span>
              )}
            </label>
            <div className="w-full">
              <label
                htmlFor="jd-text"
                className="block text-indigo-700 font-semibold mb-2"
              >
                Job Description
              </label>
              <textarea
                id="jd-text"
                name="jobDescription"
                rows={5}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition resize-none shadow"
              />
            </div>
            <button
              type="submit"
              className="w-full max-w-xs rounded-lg bg-gradient-to-r from-indigo-600 to-purple-500 px-8 py-3 text-lg font-bold text-white shadow-lg hover:from-indigo-700 hover:to-purple-600 transition disabled:opacity-60 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                <>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  Upload & Analyze
                </>
              )}
            </button>
            {error && (
              <div className="w-full text-center text-red-600 font-semibold mt-2">
                <svg className="inline w-4 h-4 mr-1 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                {error}
              </div>
            )}
          </div>
        </form>
        {/* MAIN SCORE CARD - Minimal Design */}
        {scoring && (
          <div className="my-12 flex justify-center">
            <div className="bg-white rounded-xl shadow p-10 w-full border border-gray-100 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-7 h-7 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#fff" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 2" stroke="#f59e0b" strokeWidth="2" /></svg>
                <span className="text-xl font-semibold text-gray-800">Resume Score</span>
              </div>
              <div className="text-5xl font-bold text-yellow-500 mb-2">
                {scoring.totalScore}
                <span className="text-xl text-gray-400 font-semibold">/100</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-4">
                <div className="bg-indigo-50 rounded-lg p-3 text-center">
                  <div className="text-indigo-600 font-medium text-sm mb-1">Skills</div>
                  <div className="text-xl font-bold text-indigo-700">{scoring.breakdown.skills}/50</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <div className="text-purple-600 font-medium text-sm mb-1">Experience</div>
                  <div className="text-xl font-bold text-purple-700">{scoring.breakdown.experience}/30</div>
                  <div className="text-xs text-gray-400 mt-1">{scoring.yearsExperience} yrs</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-green-600 font-medium text-sm mb-1">Education</div>
                  <div className="text-xl font-bold text-green-700">{scoring.breakdown.education}/10</div>
                </div>
                <div className="bg-pink-50 rounded-lg p-3 text-center">
                  <div className="text-pink-600 font-medium text-sm mb-1">Formatting</div>
                  <div className="text-xl font-bold text-pink-700">{scoring.breakdown.formatting}/10</div>
                  <div className="text-xs text-gray-400 mt-1">{scoring.wordCount} words, {scoring.bulletCount} bullets</div>
                </div>
              </div>
              <div className="mt-4 text-center text-base font-medium text-gray-600">
                {scoring.totalScore >= 80
                  ? <span className="text-green-600">Excellent Resume!</span>
                  : scoring.totalScore >= 60
                  ? <span className="text-yellow-600">Good Resume, can be improved.</span>
                  : <span className="text-red-500">Needs improvement. Try adding more skills, experience, or formatting.</span>}
              </div>
            </div>
          </div>
        )}
        {(extractedText ||
          skills.found.length > 0 ||
          skills.missing.length > 0 ||
          jdMatch) && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Matched Skills Card - Minimal */}
            <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center border border-indigo-100">
              <h3 className="text-base font-semibold text-indigo-700 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Matched Skills
              </h3>
              {skills.found.length === 0 ? (
                <p className="text-gray-400 text-center text-sm">No matched skills found.</p>
              ) : (
                <ul className="flex flex-wrap gap-2 justify-center mt-1">
                  {skills.found.map((s) => (
                    <li key={s} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full text-xs font-medium border border-indigo-100">{s}</li>
                  ))}
                </ul>
              )}
            </div>
            {/* Missing Skills Card - Minimal */}
            <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center border border-pink-100">
              <h3 className="text-base font-semibold text-pink-700 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                Missing Skills
              </h3>
              {skills.missing.length === 0 ? (
                <p className="text-gray-400 text-center text-sm">No missing skills — nice!</p>
              ) : (
                <ul className="flex flex-wrap gap-2 justify-center mt-1">
                  {skills.missing.map((s) => (
                    <li key={s} className="bg-pink-50 text-pink-700 px-2 py-1 rounded-full text-xs font-medium border border-pink-100">{s}</li>
                  ))}
                </ul>
              )}
            </div>
            {/* JD Match Percentage Card - Minimal */}
            <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center border border-green-100">
              <h3 className="text-base font-semibold text-green-700 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
                JD Match %
              </h3>
              {jdMatch ? (
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-green-600 mb-1">{jdMatch.jdScore}%</span>
                  <span className="text-xs text-gray-500 mb-1">
                    {jdMatch.jdScore >= 70 ? "Great match!" : jdMatch.jdScore >= 40 ? "Decent match" : "Low match"}
                  </span>
                  <div className="mt-1">
                    <span className="text-xs text-gray-400">Matched JD keywords:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {jdMatch.jdFound.map((w) => (
                        <span key={w} className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs border border-green-100">{w}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <span className="text-gray-400 text-center text-sm">No job description provided.</span>
              )}
            </div>
            {/* Extracted Text Card - Minimal */}
            <div className="bg-white rounded-xl shadow p-5 flex flex-col border border-gray-100">
              <h3 className="text-base font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16h8M8 12h8m-8-4h8M4 6h16M4 18h16" /></svg>
                Extracted Text
              </h3>
              <pre className="text-gray-600 text-xs overflow-auto max-h-60 whitespace-pre-wrap bg-gray-50 rounded-lg p-3 border border-gray-50">{extractedText ? extractedText.slice(0, 1000) : "—"}</pre>
            </div>
          </div>
        )}
      </div>
      <div className="w-full">
        {extractedText && (
          <GrammerReadability
            text={extractedText}
            found={skills.found}
            missing={skills.missing}
          />
        )}
      </div>
      <div className="w-full">
        <ATSSimulation resumeText={extractedText} skills={skills} />
      </div>
    </div>
  );
}
