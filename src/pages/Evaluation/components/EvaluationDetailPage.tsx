// src/pages/EvaluationDetailPage.tsx
import { useLocation, useNavigate } from 'react-router-dom';
import type { Evaluation } from '../../../types/evaluation';
// aqui o caminho e nome batem exatamente com o arquivo
import EvaluationsPanelBrutalFact, { type BrutalFact }
from '../../../components/BrutalFact/EvaluationsPanelBrutalFact';

export default function EvaluationDetailPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { evaluation } = state as { evaluation: Evaluation };

  const facts: BrutalFact[] = [
    { pillar: 'Comunicação', severity: 'Alta',  description: '…', impact: 85 },
    { pillar: 'Liderança',   severity: 'Média', description: '…', impact: 65 },
    { pillar: 'Técnico',     severity: 'Alta',  description: '…', impact: 90 },
  ];

  return (
    <EvaluationsPanelBrutalFact
          userName={evaluation.collaborator}
          equalizationDate={new Date().toLocaleDateString('pt-BR')}
          facts={facts}
          onViewDetails={() => navigate(-1)}
          onCreateActionPlan={() => { } } managerId={''} cycleId={''}    />
  );
}
