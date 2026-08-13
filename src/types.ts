// Only "warmup" and "normal" appear in the sample data; the Hevy API is
// documented to also use "failure" and "dropset" for other set types.
export type SetType = "warmup" | "normal" | "failure" | "dropset";

export interface HevySet {
	index: number;
	type: SetType;
	weight_kg: number | null;
	reps: number | null;
	distance_meters: number | null;
	duration_seconds: number | null;
	rpe: number | null;
	custom_metric: number | null;
}

export interface HevyExercise {
	index: number;
	title: string;
	notes: string;
	exercise_template_id: string;
	superset_id: string | null;
	sets: HevySet[];
}

export interface HevyWorkout {
	id: string;
	title: string;
	routine_id: string | null;
	description: string;
	start_time: string;
	end_time: string;
	updated_at: string;
	created_at: string;
	exercises: HevyExercise[];
}

export interface HevyWorkoutsResponse {
	page: number;
	page_count: number;
	workouts: HevyWorkout[];
}
