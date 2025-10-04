import { useEffect, useState } from "react";
import SkillPie from "./SkillPie";
import ReadabilityChart from "./ReadabilityChart";
// utils/resumeReadabilityHelper.js
function analyzeResumeReadability(readability) {
  const grades = [
    readability.flesch_kincaid_grade,
    readability.coleman_liau_index,
    readability.automated_readability_index,
    readability.gunning_fog,
  ]
    .map(Number)
    .filter((v) => !isNaN(v));

  const avgGrade = grades.length
    ? grades.reduce((a, b) => a + b, 0) / grades.length
    : null;

  let verdict = "";
  let tips = [];

  if (avgGrade !== null) {
    if (avgGrade <= 8) {
      verdict = `Too simple (around grade ${avgGrade.toFixed(1)}).`;
      tips.push(
        "Use stronger action verbs (e.g., implemented, achieved, optimized)."
      );
      tips.push(
        "Add technical or domain-specific terms to sound professional."
      );
    } else if (avgGrade <= 12) {
      verdict = `Good readability (around grade ${avgGrade.toFixed(1)}).`;
      tips.push("Resume is professional and clear.");
      tips.push(
        "Keep sentences concise and highlight achievements with numbers."
      );
    } else {
      verdict = `Quite complex (around grade ${avgGrade.toFixed(1)}).`;
      tips.push("Break long sentences into shorter bullet points.");
      tips.push(
        "Avoid jargon unless necessary; recruiters should quickly scan your resume."
      );
    }
  } else {
    verdict = "Not enough data to calculate readability.";
  }

  if (readability.flesch_reading_ease) {
    const ease = readability.flesch_reading_ease;
    if (ease < 40) {
      tips.push(
        "Your resume may be too dense. Use bullet points instead of long paragraphs."
      );
    } else if (ease > 70) {
      tips.push("Text may be too casual. Keep it concise and professional.");
    }
  }

  return { avgGrade, verdict, tips };
}

export default function GrammerReadability(props) {
  const [activePanel, setActivePanel] = useState("readability");
  const [readability, setReadability] = useState();
  const [issues, setIssues] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    async function fetchResults() {
      try {
        console.log(props.text);
        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${apiUrl}/grammar`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: props.text,
          }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Upload failed");
        }

        const data = await res.json();
        setIssues(data.grammar_issues);
        setReadability(data.readability);
      } catch (err) {
        setError(err.message || "Something went wrong");
      }
    }
    fetchResults();
  }, []);
  return (
    <div className="w-full my-12 mx-auto">
      {/* Tabs */}
      <div className="flex border-b border-gray-300 mx-4">
        <button
          onClick={() => setActivePanel("grammar")}
          className={`px-4 py-2 font-medium mr-2 ${
            activePanel === "grammar" ? "border-b-2 border-blue-500" : ""
          }`}
        >
          Grammar
        </button>
        <button
          onClick={() => setActivePanel("readability")}
          className={`px-4 py-2 font-medium ${
            activePanel === "readability" ? "border-b-2 border-blue-500" : ""
          }`}
        >
          Readability
        </button>
      </div>
      {error && (
        <div className="w-full text-center text-red-600 font-semibold mt-2">
          {error}
        </div>
      )}
      {/* Panel Content */}
      {activePanel === "grammar" && (
        <div className="bg-white p-4 rounded-lg shadow">
          {issues.length === 0 ? (
            <p className="text-green-600">✅ No grammar issues found!</p>
          ) : (
            <ul className="space-y-3">
              {issues.map((issue, idx) => (
                <li key={idx} className="border-b pb-2">
                  <p className="text-red-600 font-semibold">{issue.message}</p>
                  <p className="text-gray-700">
                    Context: <span className="italic">{issue.context}</span>
                  </p>
                  {issue.suggestions?.length > 0 && (
                    <div className="mt-1">
                      Suggestions: {issue.suggestions.join(", ")}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {activePanel === "readability" && (
        <div className="bg-white p-4 rounded-lg shadow space-y-2">
          <h2 className="text-lg font-semibold mb-4 text-teal-700">
            Readability Metrics
          </h2>
          { readability ? 
          (
            <>
            <div className="overflow-x-auto">
              <table className="min-w-full rounded-lg overflow-hidden shadow-md mb-4">
                <thead className="bg-gradient-to-r from-purple-100 via-indigo-100 to-white">
                  <tr>
                    <th className="text-center px-4 py-2 text-indigo-700 font-semibold">
                      Metric
                    </th>
                    <th className="text-center px-4 py-2 text-indigo-700 font-semibold">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(readability).map(([metric, value], idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? "bg-white" : "bg-purple-50"}
                    >
                      <td className="px-4 py-2 text-indigo-500">
                        {metric.replace(/_/g, " ")}
                      </td>
                      <td className="px-4 py-2 text-black font-medium">
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {(() => {
            const { verdict, tips } = analyzeResumeReadability(readability);
            return (
              <div className="mt-3 p-3 bg-blue-50 rounded">
                <h2 className="text-green-700 font-bold mb-2">
                  Summary & Tips
                </h2>
                <p className="mb-2 text-red-400">{verdict}</p>
                <div className="p-3 bg-gradient-to-br from-indigo-100 drop-shadow-sm rounded-xl">
                  <ul className="list-disc pl-5 text-gray-700 space-y-1 text-left">
                    {tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })()}
          </>
          ) : (
            <div className="bg-white p-4 rounded-lg shadow">
              <span className="text-red-400">Loading...</span>
            </div>
            ) }
        </div>
      )}
      {readability && (
        <div className="p-2 flex">
          <ReadabilityChart readability={readability} />
          <SkillPie found={props.found} missing={props.missing}/>
        </div>
      )}
    </div>
  );
}

// Example usage:
// <AnalysisPanels analysis={yourApiResponse} />
