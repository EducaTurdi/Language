"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Exercise, Lesson } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import Mascot from "@/components/Mascot";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function LessonPlayer({
  lesson,
  trackId,
  trackName,
  startHearts,
}: {
  lesson: Lesson;
  trackId: string;
  trackName: string;
  startHearts: number;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [index, setIndex] = useState(0);
  const [hearts, setHearts] = useState(startHearts);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [orderPicked, setOrderPicked] = useState<string[]>([]);

  const exercise: Exercise = lesson.exercises[index];

  const shuffledTokens = useMemo(() => {
    if (exercise.kind === "order") return shuffle(exercise.tokens);
    return [];
  }, [exercise]);

  // Reage ao processo, não só ao resultado: parado = "pensando" (dúvida);
  // assim que a pessoa começa a escolher/digitar = "escrevendo" (atento);
  // se apagar tudo de novo, volta pra "pensando" sozinho.
  const emInteracao =
    (exercise.kind === "mcq" && selectedOption !== null) ||
    (exercise.kind === "text" && textAnswer.trim() !== "") ||
    (exercise.kind === "order" && orderPicked.length > 0);

  const mood =
    feedback === "correct"
      ? "excited"
      : feedback === "wrong"
        ? "sad"
        : emInteracao
          ? "escrevendo"
          : "pensando";

  function checkAnswer(): boolean {
    if (exercise.kind === "mcq") {
      return selectedOption === exercise.correctIndex;
    }
    if (exercise.kind === "text") {
      const normalized = textAnswer.trim().toLowerCase().replace(/\s+/g, " ");
      return exercise.accepted.some(
        (a) => a.toLowerCase().replace(/\s+/g, " ") === normalized
      );
    }
    if (exercise.kind === "order") {
      return (
        orderPicked.length === exercise.correctOrder.length &&
        orderPicked.every((t, i) => t === exercise.correctOrder[i])
      );
    }
    return false;
  }

  function handleCheck() {
    const isCorrect = checkAnswer();
    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
    } else {
      setHearts((h) => Math.max(0, h - 1));
    }
  }

  async function handleContinue() {
    if (hearts <= 0 && feedback === "wrong") {
      setFailed(true);
      await syncHearts(0);
      return;
    }

    const isLast = index === lesson.exercises.length - 1;
    if (isLast) {
      await completeLesson();
      return;
    }

    setIndex((i) => i + 1);
    setFeedback(null);
    setSelectedOption(null);
    setTextAnswer("");
    setOrderPicked([]);
  }

  async function syncHearts(value: number) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("profiles").update({ hearts: value }).eq("id", user.id);
  }

  async function completeLesson() {
    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const scorePct = Math.round((correctCount / lesson.exercises.length) * 100);

      await supabase.from("lesson_progress").upsert(
        {
          user_id: user.id,
          lesson_id: lesson.id,
          track_id: trackId,
          score: scorePct,
          xp_earned: lesson.xp,
        },
        { onConflict: "user_id,lesson_id" }
      );

      const { data: profile } = await supabase
        .from("profiles")
        .select("xp, streak, last_activity, hearts")
        .eq("id", user.id)
        .single();

      const today = new Date().toISOString().slice(0, 10);
      const wasToday = profile?.last_activity === today;
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const wasYesterday = profile?.last_activity === yesterday;

      const newStreak = wasToday
        ? profile?.streak ?? 0
        : wasYesterday
          ? (profile?.streak ?? 0) + 1
          : 1;

      await supabase
        .from("profiles")
        .update({
          xp: (profile?.xp ?? 0) + lesson.xp,
          streak: newStreak,
          hearts: Math.min(5, (hearts ?? 5) + (correctCount === lesson.exercises.length ? 1 : 0)),
          last_activity: today,
        })
        .eq("id", user.id);
    }

    setSaving(false);
    setFinished(true);
    router.refresh();
  }

  if (failed) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <Mascot mood="sad" size={150} className="mx-auto" />
        <h1 className="font-display font-bold text-2xl text-cream mt-6 mb-2">
          Suas vidas acabaram
        </h1>
        <p className="text-cream-muted mb-8">
          Sem problemas! Suas vidas se recuperam com o tempo. Volte para revisar a lição.
        </p>
        <button
          onClick={() => router.push(`/dashboard/course/${trackId}`)}
          className="bg-fossil hover:bg-fossil-dark text-night font-bold px-6 py-3.5 rounded-xl2 shadow-pop active:translate-y-1 active:shadow-none transition-all"
        >
          Voltar para a trilha
        </button>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <Mascot mood="excited" size={170} className="mx-auto" />
        <h1 className="font-display font-bold text-3xl text-cream mt-6 mb-2">
          Lição concluída!
        </h1>
        <p className="text-cream-muted mb-8">
          Você acertou {correctCount} de {lesson.exercises.length} exercícios e ganhou{" "}
          <span className="text-amber font-bold">+{lesson.xp} XP</span>.
        </p>
        <button
          onClick={() => router.push(`/dashboard/course/${trackId}`)}
          disabled={saving}
          className="bg-seafoam hover:bg-seafoam-dark text-night font-bold px-6 py-3.5 rounded-xl2 shadow-pop active:translate-y-1 active:shadow-none transition-all"
        >
          Continuar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* topo: progresso + vidas */}
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={() => router.push(`/dashboard/course/${trackId}`)}
          className="text-cream-faint hover:text-cream text-xl"
          aria-label="Sair da lição"
        >
          ✕
        </button>
        <div className="flex-1 h-3 bg-night-card rounded-full overflow-hidden border border-night-border">
          <div
            className="h-full bg-seafoam rounded-full transition-all duration-500"
            style={{ width: `${(index / lesson.exercises.length) * 100}%` }}
          />
        </div>
        <div className="flex items-center gap-1 text-fossil-light font-bold text-sm">
          ❤️ {hearts}
        </div>
      </div>

      <p className="text-cream-faint text-xs font-bold uppercase tracking-widest mb-2">
        {trackName} · {lesson.title}
      </p>
      <h1 className="font-display font-bold text-2xl sm:text-3xl text-cream mb-8 leading-snug">
        {exercise.prompt}
      </h1>

      {exercise.kind === "mcq" && (
        <div className="grid gap-3">
          {exercise.options.map((opt, i) => {
            const isSelected = selectedOption === i;
            const showCorrect = feedback && i === exercise.correctIndex;
            const showWrong = feedback === "wrong" && isSelected && i !== exercise.correctIndex;
            return (
              <button
                key={opt}
                disabled={!!feedback}
                onClick={() => setSelectedOption(i)}
                className={`text-left px-5 py-4 rounded-xl2 border-2 font-semibold transition-all ${
                  showCorrect
                    ? "border-seafoam bg-seafoam/10 text-seafoam"
                    : showWrong
                      ? "border-fossil bg-fossil/10 text-fossil-light"
                      : isSelected
                        ? "border-amber bg-amber/10 text-cream"
                        : "border-night-border bg-night-card text-cream hover:border-cream-faint"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {exercise.kind === "text" && (
        <div>
          <input
            type="text"
            disabled={!!feedback}
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            placeholder="Digite sua resposta"
            className="w-full bg-night-card border-2 border-night-border focus:border-seafoam rounded-xl2 px-5 py-4 text-cream text-lg outline-none transition-colors"
          />
          {exercise.hint && (
            <p className="text-cream-faint text-sm mt-2">💡 {exercise.hint}</p>
          )}
        </div>
      )}

      {exercise.kind === "order" && (
        <div>
          <div className="min-h-[64px] flex flex-wrap gap-2 border-2 border-dashed border-night-border rounded-xl2 p-4 mb-4">
            {orderPicked.map((tok, i) => (
              <button
                key={`${tok}-${i}`}
                disabled={!!feedback}
                onClick={() => setOrderPicked((p) => p.filter((_, idx) => idx !== i))}
                className="bg-seafoam text-night font-semibold px-4 py-2 rounded-lg"
              >
                {tok}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {shuffledTokens
              .filter((t) => orderPicked.filter((p) => p === t).length < shuffledTokens.filter((s) => s === t).length)
              .map((tok, i) => (
                <button
                  key={`${tok}-${i}`}
                  disabled={!!feedback}
                  onClick={() => setOrderPicked((p) => [...p, tok])}
                  className="bg-night-card border border-night-border text-cream font-semibold px-4 py-2 rounded-lg hover:border-seafoam transition-colors"
                >
                  {tok}
                </button>
              ))}
          </div>
        </div>
      )}

      {/* rodapé com mascote e ações */}
      <div className="mt-10 flex items-center justify-between gap-6">
        <Mascot mood={mood} size={80} floaty={!feedback} />

        <div className="flex-1 flex flex-col items-end gap-3">
          {feedback && (
            <p
              className={`font-bold text-sm px-4 py-2 rounded-xl w-full text-center sm:text-left sm:w-auto ${
                feedback === "correct"
                  ? "bg-seafoam/15 text-seafoam"
                  : "bg-fossil/15 text-fossil-light"
              }`}
            >
              {feedback === "correct" ? "Muito bem! 🎉" : "Quase! Continue tentando."}
            </p>
          )}

          {!feedback ? (
            <button
              onClick={handleCheck}
              disabled={
                (exercise.kind === "mcq" && selectedOption === null) ||
                (exercise.kind === "text" && textAnswer.trim() === "") ||
                (exercise.kind === "order" && orderPicked.length === 0)
              }
              className="bg-fossil hover:bg-fossil-dark disabled:opacity-40 disabled:cursor-not-allowed text-night font-bold px-8 py-3.5 rounded-xl2 shadow-pop active:translate-y-1 active:shadow-none transition-all"
            >
              Verificar
            </button>
          ) : (
            <button
              onClick={handleContinue}
              className="bg-seafoam hover:bg-seafoam-dark text-night font-bold px-8 py-3.5 rounded-xl2 shadow-pop active:translate-y-1 active:shadow-none transition-all"
            >
              Continuar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
