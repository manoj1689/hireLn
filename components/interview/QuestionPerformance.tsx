import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

const QuestionPerformance: React.FC = () => {
  const { evaluations, loading, error } = useSelector(
    (state: RootState) => state.autoEvaluateAnswer
  );

  if (loading) {
    return (
      <div className="p-4 bg-yellow-100 rounded-md text-yellow-700">
        Evaluating answer...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 rounded-md text-red-700">
        Evaluation failed: {error}
      </div>
    );
  }

  if (!evaluations || evaluations.length === 0) return null;

  return (
    <>
    <div className="flex justify-center items-center py-4">
     AI Evaluation
    </div>
    <div className="space-y-6 max-h-[600px] overflow-y-auto">
      {evaluations.map((evalItem, index) => (
        <div
          key={evalItem.id || index}
          className="p-4 bg-green-50 rounded-xl shadow"
        >
          <h2 className="text-lg font-semibold text-green-700 mb-1">
            Question {index + 1}
          </h2>
          <p className="mb-2">
            <strong className="text-gray-700">Q:</strong> {evalItem.questionText}
          </p>
          <p className="mb-2">
            <strong className="text-gray-700">Your Answer:</strong> {evalItem.answerText}
          </p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>
              <strong>Final Verdict:</strong> {evalItem.finalEvaluation}
            </li>
            <li>
              <strong>Score:</strong> {evalItem.score}
            </li>
            <li>
              <strong>Factual Accuracy:</strong> {evalItem.factualAccuracy}
            </li>
            <li>
              <strong>Completeness:</strong> {evalItem.completeness}
            </li>
            <li>
              <strong>Relevance:</strong> {evalItem.relevance}
            </li>
            <li>
              <strong>Coherence:</strong> {evalItem.coherence}
            </li>
          </ul>
        </div>
      ))}
    </div>
    </>
    
  );
};

export default QuestionPerformance;
