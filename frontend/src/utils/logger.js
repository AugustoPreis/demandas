//Evita usar o console.log diretamente em outros arquivos
export function logMessage(...messages) {
  // eslint-disable-next-line no-console
  console.log(...messages);
}