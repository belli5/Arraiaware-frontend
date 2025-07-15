import { useBrutalFactsLogic } from "../../../hooks/useMentorBrutalFactsLogic";

const ScoreDisplay = ({ label, score }: { label: string; score: number }) => (
  <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-2xl font-bold text-gray-800">{score.toFixed(1)}</span>
  </div>
);

export default function MentorBrutalFactsPanel() {
  const { brutalFacts, isLoading, notification } = useBrutalFactsLogic();

  if (isLoading) {
    return <div className="text-center py-10 text-gray-500">Loading Performance Data...</div>;
  }
  
  if (notification) {
     return (
      <div className="text-center py-10 bg-red-50 text-red-700">
        <h3>{notification.title}</h3>
        <p>{notification.message}</p>
      </div>
    );
  }

  if (brutalFacts.length === 0) {
      return <div className="text-center py-10 text-gray-500">No Brutal Facts data found.</div>;
  }

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {brutalFacts.map((fact) => (
        <div key={fact.cycleId} className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Cabeçalho do Card */}
          <div className="bg-gray-800 p-4 text-white">
            <h2 className="text-xl font-bold">{fact.projectName}</h2>
            <p className="text-sm opacity-90">{fact.cycleName}</p>
          </div>

          <div className="p-6">
            {/* Seção de Pontuações */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="col-span-2 md:col-span-4 flex flex-col items-center justify-center p-4 bg-orange-500 text-white rounded-lg">
                <span className="text-md font-semibold">Final Score</span>
                <span className="text-5xl font-bold">{fact.finalScore.toFixed(1)}</span>
              </div>
              <ScoreDisplay label="Self Evaluation" score={fact.selfEvaluationScore} />
              <ScoreDisplay label="Peer Evaluation" score={fact.peerEvaluationScore} />
              <ScoreDisplay label="Leader Evaluation" score={fact.leaderEvaluationScore} />
            </div>

            {/* Resumo da IA */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Briefing</h3>
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-md">
                {fact.aiBriefing}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}