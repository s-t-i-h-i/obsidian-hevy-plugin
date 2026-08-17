import { HevyWorkout } from './types';

export function formatWorkout(workout: HevyWorkout, defaultBodyweight: number): string {

    const frontmatter = formatFrontmatter(workout, defaultBodyweight);

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
    return `${frontmatter}${title}\n\n${exercises.join('\n\n')}`;

}

export function formatFrontmatter(workout: HevyWorkout, defaultBodyweight: number): string {
    const totalVolume = workout.exercises.reduce((total, exercise) => {
        const isPullUp = exercise.title.toLowerCase().includes('pull up');
        const exerciseVolume = exercise.sets.reduce((sum, set) => {
            let weight = set.weight_kg;

            // gdy cwiczenie nie ma powtorzen to nie liczymy volume
            if (set.reps === null) {
                return sum
            }

            // jezeli ma powtorzenia ale waga null -> uzyj bodyweight tylko dla pull up
            if (weight === null) {
                weight = isPullUp ? defaultBodyweight : 0;
            }

            return sum + (weight * set.reps);
        }, 0);

        return total + exerciseVolume;
    }, 0);

    const frontmatter = {
        date: workout.start_time.split('T')[0],
        title: workout.title,
        volume: totalVolume,
    }
    return `---\n${Object.entries(frontmatter).map(([key, value]) => `${key}: ${value}`).join('\n')}\n---\n\n`;
}
