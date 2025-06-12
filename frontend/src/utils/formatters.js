export function formatPrioridadeDemanda(prioridade) {
  switch (prioridade) {
    case 'ALTA':
      return 'Alta';
    case 'MEDIA':
      return 'Média';
    case 'BAIXA':
      return 'Baixa';
    default:
      return prioridade;
  }
}