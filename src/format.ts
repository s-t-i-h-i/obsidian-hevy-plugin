import { HevyWorkout } from './types';

export function formatWorkout(workout: HevyWorkout): string {
    
    const title = `# ${workout.title}\n\n${workout.description}\n\n${workout.start_time}`;
    
    // iteracja przez cwiczenia w treningu i tworzenie markdown dla kazdego cwiczenia
    const exercises: string[] = workout.exercises.map((exercise) => {

    // 1. Tworzymy tytuł dla obecnego ćwiczenia
    const exerciseTitle = `## ${exercise.title}`;

    // 2. Tworzymy tekst z seriami dla obecnego ćwiczenia
    const setsText = exercise.sets
        .map((set) => `- ${set.weight_kg}kg × ${set.reps}`)
        .join('\n');

    // 3. Łączymy tytuł i serie w jeden tekst i zwracamy z mapowania
    return `${exerciseTitle}\n${setsText}`;
});

    // zwraca string z markdown
    return `${title}\n\n${exercises.join('\n\n')}`;

}
