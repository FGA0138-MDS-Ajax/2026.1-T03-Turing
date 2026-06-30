import { ProfessorLayout } from '../../components/professor/ProfessorLayout';
import { AccessibilitySettingsPanel } from '../../components/acessibilidade/PainelConfiguracoesAcessibilidade';

export function ProfessorConfiguracoes() {
  return (
    <ProfessorLayout>
      <AccessibilitySettingsPanel />
    </ProfessorLayout>
  );
}