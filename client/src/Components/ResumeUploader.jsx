import React, { useState } from "react";

export default function ResumeUploader() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [skills, setSkills] = useState({ found: [], missing: [] });
  const [jdMatch, setJdMatch] = useState(null);

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

      const res = await fetch("http://localhost:5000/upload", {
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
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center text-indigo-700 mb-2 drop-shadow">
          Resume Analyser
        </h1>
        <p className="text-center text-lg text-gray-500 mb-8">
          Upload your resume and job description to see your matched and missing skills!
        </p>
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-6">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full cursor-pointer bg-indigo-50 hover:bg-indigo-100 border-2 border-dashed border-indigo-300 rounded-xl p-8 transition"
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
              <span className="text-indigo-700 font-semibold text-lg">
                Click to upload or drag and drop
              </span>
              <span className="text-gray-500 text-sm mt-1">
                PDF or DOCX up to 10MB
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
                <span className="mt-2 text-green-600 text-sm font-medium">
                  Selected: {file.name}
                </span>
              )}
            </label>
            <div className="w-full">
              <label htmlFor="jd-text" className="block text-indigo-700 font-semibold mb-2">
                Job Description
              </label>
              <textarea
                id="jd-text"
                name="jobDescription"
                rows={5}
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full max-w-xs rounded-lg bg-gradient-to-r from-indigo-600 to-purple-500 px-8 py-3 text-lg font-bold text-white shadow-lg hover:from-indigo-700 hover:to-purple-600 transition disabled:opacity-60"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
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
                "Upload & Analyze"
              )}
            </button>
            {error && (
              <div className="w-full text-center text-red-600 font-semibold mt-2">
                {error}
              </div>
            )}
          </div>
        </form>

        {(extractedText || skills.found.length > 0 || skills.missing.length > 0 || jdMatch) && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Matched Skills Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border-t-4 border-indigo-400">
              <h3 className="text-xl font-bold text-indigo-700 mb-3 flex items-center gap-2">
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Matched Skills
              </h3>
              {skills.found.length === 0 ? (
                <p className="text-gray-400 text-center">No matched skills found.</p>
              ) : (
                <ul className="flex flex-wrap gap-2 justify-center mt-2">
                  {skills.found.map((s) => (
                    <li
                      key={s}
                      className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium shadow"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Missing Skills Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border-t-4 border-pink-400">
              <h3 className="text-xl font-bold text-pink-700 mb-3 flex items-center gap-2">
                <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Missing Skills
              </h3>
              {skills.missing.length === 0 ? (
                <p className="text-gray-400 text-center">No missing skills — nice!</p>
              ) : (
                <ul className="flex flex-wrap gap-2 justify-center mt-2">
                  {skills.missing.map((s) => (
                    <li
                      key={s}
                      className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium shadow"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* JD Match Percentage Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border-t-4 border-green-400">
              <h3 className="text-xl font-bold text-green-700 mb-3 flex items-center gap-2">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                </svg>
                JD Match %
              </h3>
              {jdMatch ? (
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-extrabold text-green-600 mb-2">
                    {jdMatch.jdScore}%
                  </span>
                  <span className="text-sm text-gray-500">
                    {jdMatch.jdScore >= 70
                      ? "Great match!"
                      : (jdMatch.jdScore >= 40
                      ? "Decent match"
                      : "Low match")
                      }
                  </span>
                  <div className="mt-3">
                    <span className="text-xs text-gray-400">Matched JD keywords:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {jdMatch.jdFound.map((w) => (
                        <span key={w} className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <span className="text-gray-400 text-center">No job description provided.</span>
              )}
            </div>
            {/* Extracted Text Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col border-t-4 border-gray-300">
              <h3 className="text-xl font-bold text-gray-700 mb-3 flex items-center gap-2">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16h8M8 12h8m-8-4h8M4 6h16M4 18h16" />
                </svg>
                Extracted Text
              </h3>
              <pre className="text-gray-600 text-xs overflow-auto max-h-60 whitespace-pre-wrap bg-gray-50 rounded-lg p-3 border border-gray-100">
                {extractedText ? extractedText.slice(0, 1000) : "—"}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}