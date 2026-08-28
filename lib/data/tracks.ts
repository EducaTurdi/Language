import { Track } from "@/lib/types";

export const tracks: Track[] = [
  {
    id: "ingles",
    name: "Inglês",
    tagline: "Do zero à primeira conversa",
    color: "seafoam",
    icon: "🌎",
    units: [
      {
        id: "ingles-u1",
        title: "Unidade 1 · Primeiros passos",
        description: "Cumprimentos, apresentações e o verbo to be.",
        lessons: [
          {
            id: "ingles-u1-l1",
            title: "Cumprimentos",
            emoji: "👋",
            xp: 10,
            exercises: [
              {
                kind: "mcq",
                id: "e1",
                prompt: "Como se diz 'Bom dia' em inglês?",
                options: ["Good night", "Good morning", "Good evening", "Goodbye"],
                correctIndex: 1,
              },
              {
                kind: "mcq",
                id: "e2",
                prompt: "O que significa 'Nice to meet you'?",
                options: [
                  "Até logo",
                  "Prazer em conhecê-lo",
                  "Como você está?",
                  "Muito obrigado",
                ],
                correctIndex: 1,
              },
              {
                kind: "text",
                id: "e3",
                prompt: "Traduza para o inglês: 'Olá, meu nome é...'",
                accepted: ["hello, my name is", "hi, my name is", "hello my name is"],
                hint: "Comece com Hello ou Hi.",
              },
              {
                kind: "order",
                id: "e4",
                prompt: "Organize a frase: 'How are you today?'",
                tokens: ["today?", "How", "you", "are"],
                correctOrder: ["How", "are", "you", "today?"],
              },
              {
                kind: "mcq",
                id: "e5",
                prompt: "'See you later' é usado para:",
                options: ["Cumprimentar", "Se despedir", "Pedir desculpas", "Agradecer"],
                correctIndex: 1,
              },
            ],
          },
          {
            id: "ingles-u1-l2",
            title: "To be: I am, you are",
            emoji: "🙋",
            xp: 10,
            exercises: [
              {
                kind: "mcq",
                id: "e1",
                prompt: "Complete: 'I ___ a student.'",
                options: ["am", "is", "are", "be"],
                correctIndex: 0,
              },
              {
                kind: "mcq",
                id: "e2",
                prompt: "Complete: 'You ___ my friend.'",
                options: ["am", "is", "are", "was"],
                correctIndex: 2,
              },
              {
                kind: "text",
                id: "e3",
                prompt: "Traduza: 'Ela é professora.'",
                accepted: ["she is a teacher", "she's a teacher"],
              },
              {
                kind: "mcq",
                id: "e4",
                prompt: "Qual é a contração de 'I am'?",
                options: ["I'm", "I's", "I'am", "Im"],
                correctIndex: 0,
              },
              {
                kind: "order",
                id: "e5",
                prompt: "Organize: 'We are best friends.'",
                tokens: ["friends.", "We", "best", "are"],
                correctOrder: ["We", "are", "best", "friends."],
              },
            ],
          },
        ],
      },
      {
        id: "ingles-u2",
        title: "Unidade 2 · Rotina do dia a dia",
        description: "Verbos comuns, horas e o presente simples.",
        lessons: [
          {
            id: "ingles-u2-l1",
            title: "Verbos do dia a dia",
            emoji: "☕",
            xp: 15,
            exercises: [
              {
                kind: "mcq",
                id: "e1",
                prompt: "'To wake up' significa:",
                options: ["Dormir", "Acordar", "Comer", "Trabalhar"],
                correctIndex: 1,
              },
              {
                kind: "mcq",
                id: "e2",
                prompt: "Complete: 'She ___ coffee every morning.'",
                options: ["drink", "drinks", "drinking", "to drink"],
                correctIndex: 1,
              },
              {
                kind: "text",
                id: "e3",
                prompt: "Traduza: 'Eu trabalho de segunda a sexta.'",
                accepted: [
                  "i work from monday to friday",
                  "i work monday to friday",
                ],
              },
              {
                kind: "mcq",
                id: "e4",
                prompt: "'To go to bed' significa:",
                options: ["Ir para a escola", "Ir dormir", "Ir ao mercado", "Cozinhar"],
                correctIndex: 1,
              },
              {
                kind: "order",
                id: "e5",
                prompt: "Organize: 'I usually study at night.'",
                tokens: ["at night.", "I", "usually", "study"],
                correctOrder: ["I", "usually", "study", "at night."],
              },
            ],
          },
          {
            id: "ingles-u2-l2",
            title: "Que horas são?",
            emoji: "⏰",
            xp: 15,
            exercises: [
              {
                kind: "mcq",
                id: "e1",
                prompt: "Como perguntar 'Que horas são?'",
                options: [
                  "What time is it?",
                  "What is the hour?",
                  "How much time?",
                  "Which hour now?",
                ],
                correctIndex: 0,
              },
              {
                kind: "text",
                id: "e2",
                prompt: "Traduza a hora: '8:00 da manhã' → 'It's eight ___'",
                accepted: ["o'clock", "oclock", "a.m.", "am"],
                hint: "Pense em 'o'clock' ou 'a.m.'",
              },
              {
                kind: "mcq",
                id: "e3",
                prompt: "'Half past six' significa:",
                options: ["6:00", "6:15", "6:30", "6:45"],
                correctIndex: 2,
              },
              {
                kind: "mcq",
                id: "e4",
                prompt: "'Quarter to nine' significa:",
                options: ["9:15", "8:45", "9:45", "8:15"],
                correctIndex: 1,
              },
              {
                kind: "order",
                id: "e5",
                prompt: "Organize: 'The meeting starts at noon.'",
                tokens: ["at noon.", "The", "starts", "meeting"],
                correctOrder: ["The", "meeting", "starts", "at noon."],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "programacao",
    name: "Programação",
    tagline: "Lógica e código do zero",
    color: "fossil",
    icon: "💻",
    units: [
      {
        id: "prog-u1",
        title: "Unidade 1 · Lógica de programação",
        description: "Variáveis, tipos e condicionais.",
        lessons: [
          {
            id: "prog-u1-l1",
            title: "Variáveis",
            emoji: "📦",
            xp: 10,
            exercises: [
              {
                kind: "mcq",
                id: "e1",
                prompt: "Uma variável serve para:",
                options: [
                  "Desenhar na tela",
                  "Guardar um valor na memória",
                  "Conectar à internet",
                  "Imprimir documentos",
                ],
                correctIndex: 1,
              },
              {
                kind: "mcq",
                id: "e2",
                prompt: "Em JavaScript, qual declara uma variável que pode mudar de valor?",
                options: ["const", "let", "final", "fixed"],
                correctIndex: 1,
              },
              {
                kind: "text",
                id: "e3",
                prompt: "Complete o código: '___ idade = 20;' (palavra-chave em JS)",
                accepted: ["let", "var"],
                hint: "É a palavra que declara uma variável mutável.",
              },
              {
                kind: "mcq",
                id: "e4",
                prompt: "Qual tipo de dado representa texto?",
                options: ["number", "boolean", "string", "array"],
                correctIndex: 2,
              },
              {
                kind: "order",
                id: "e5",
                prompt: "Organize a declaração: 'const nome = \"Ana\";'",
                tokens: ["\"Ana\";", "const", "nome", "="],
                correctOrder: ["const", "nome", "=", "\"Ana\";"],
              },
            ],
          },
          {
            id: "prog-u1-l2",
            title: "Condicionais",
            emoji: "🔀",
            xp: 12,
            exercises: [
              {
                kind: "mcq",
                id: "e1",
                prompt: "O que faz um 'if'?",
                options: [
                  "Repete um bloco de código",
                  "Executa código só se uma condição for verdadeira",
                  "Declara uma função",
                  "Importa uma biblioteca",
                ],
                correctIndex: 1,
              },
              {
                kind: "mcq",
                id: "e2",
                prompt: "Qual operador compara igualdade de valor em JS?",
                options: ["=", "==", ":=", "=>"],
                correctIndex: 1,
              },
              {
                kind: "text",
                id: "e3",
                prompt: "Complete: 'if (idade >= 18) { ___ }' — comando que roda quando é falso",
                accepted: ["else", "else {}"],
                hint: "É o par do if quando a condição não é verdadeira.",
              },
              {
                kind: "mcq",
                id: "e4",
                prompt: "'idade >= 18' é verdadeiro quando idade for:",
                options: ["Menor que 18", "Igual ou maior que 18", "Diferente de 18", "Sempre falso"],
                correctIndex: 1,
              },
              {
                kind: "order",
                id: "e5",
                prompt: "Organize: 'if (nota > 6) { aprovado(); }'",
                tokens: ["{ aprovado(); }", "if", "(nota > 6)"],
                correctOrder: ["if", "(nota > 6)", "{ aprovado(); }"],
              },
            ],
          },
        ],
      },
      {
        id: "prog-u2",
        title: "Unidade 2 · Fundamentos de JavaScript",
        description: "Funções, laços de repetição e arrays.",
        lessons: [
          {
            id: "prog-u2-l1",
            title: "Funções",
            emoji: "⚙️",
            xp: 15,
            exercises: [
              {
                kind: "mcq",
                id: "e1",
                prompt: "Uma função serve para:",
                options: [
                  "Guardar só um número",
                  "Agrupar um bloco de código reutilizável",
                  "Estilizar a página",
                  "Criar variáveis globais apenas",
                ],
                correctIndex: 1,
              },
              {
                kind: "text",
                id: "e2",
                prompt: "Palavra-chave para declarar uma função em JS: '___ somar() {}'",
                accepted: ["function"],
              },
              {
                kind: "mcq",
                id: "e3",
                prompt: "O que 'return' faz dentro de uma função?",
                options: [
                  "Reinicia o programa",
                  "Devolve um valor e encerra a função",
                  "Imprime na tela sempre",
                  "Cria um laço infinito",
                ],
                correctIndex: 1,
              },
              {
                kind: "mcq",
                id: "e4",
                prompt: "Qual chamada executa a função 'saudacao'?",
                options: ["saudacao;", "saudacao[]", "saudacao()", "run saudacao"],
                correctIndex: 2,
              },
              {
                kind: "order",
                id: "e5",
                prompt: "Organize: 'function dobro(x) { return x * 2; }'",
                tokens: ["{ return x * 2; }", "function", "dobro(x)"],
                correctOrder: ["function", "dobro(x)", "{ return x * 2; }"],
              },
            ],
          },
          {
            id: "prog-u2-l2",
            title: "Laços de repetição",
            emoji: "🔁",
            xp: 15,
            exercises: [
              {
                kind: "mcq",
                id: "e1",
                prompt: "Um laço 'for' é usado para:",
                options: [
                  "Criar uma variável só",
                  "Repetir um bloco de código várias vezes",
                  "Comparar dois valores",
                  "Importar arquivos",
                ],
                correctIndex: 1,
              },
              {
                kind: "mcq",
                id: "e2",
                prompt: "Em 'for (let i = 0; i < 5; i++)', quantas vezes o laço roda?",
                options: ["4", "5", "6", "Infinitas"],
                correctIndex: 1,
              },
              {
                kind: "text",
                id: "e3",
                prompt: "Qual laço repete 'enquanto' uma condição for verdadeira?",
                accepted: ["while"],
              },
              {
                kind: "mcq",
                id: "e4",
                prompt: "'array.length' retorna:",
                options: [
                  "O primeiro item",
                  "A quantidade de itens do array",
                  "O tipo do array",
                  "Sempre zero",
                ],
                correctIndex: 1,
              },
              {
                kind: "order",
                id: "e5",
                prompt: "Organize: 'for (let i = 0; i < 3; i++) {}'",
                tokens: ["{}", "for", "(let i = 0; i < 3; i++)"],
                correctOrder: ["for", "(let i = 0; i < 3; i++)", "{}"],
              },
            ],
          },
        ],
      },
    ],
  },
];

export function getTrack(trackId: string) {
  return tracks.find((t) => t.id === trackId);
}

export function getLesson(lessonId: string) {
  for (const track of tracks) {
    for (const unit of track.units) {
      const lesson = unit.lessons.find((l) => l.id === lessonId);
      if (lesson) return { track, unit, lesson };
    }
  }
  return null;
}

export function totalLessons(trackId: string) {
  const track = getTrack(trackId);
  if (!track) return 0;
  return track.units.reduce((acc, u) => acc + u.lessons.length, 0);
}
