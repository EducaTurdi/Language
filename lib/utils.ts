export function metaPontosDoMes(ano: number, mes: number): number {
  const diasNoMes = new Date(ano, mes, 0).getDate();
  return diasNoMes - 5;
}

export function mesAtual(): { ano: number; mes: number } {
  const agora = new Date();
  return { ano: agora.getFullYear(), mes: agora.getMonth() + 1 };
}

export function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export const nomesMeses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export const rotuloTipo: Record<string, string> = {
  admin: "Administrador",
  colaborador: "Colaborador",
  professor: "Professor",
  aluno: "Aluno",
};

export function gerarSenhaTemporaria(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let senha = "";
  for (let i = 0; i < 8; i++) {
    senha += chars[Math.floor(Math.random() * chars.length)];
  }
  return senha;
}
