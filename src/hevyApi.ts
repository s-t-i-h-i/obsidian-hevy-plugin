import { requestUrl } from 'obsidian';
import { HevyWorkoutsResponse } from './types';

export async function fetchHevyWorkouts(secretKey: string, page: number): Promise<HevyWorkoutsResponse> {
    const response = await requestUrl({
        url: `https://api.hevyapp.com/v1/workouts?page=${page}`,
        method: 'GET',
        headers: {'api-key': secretKey,}
     })
    
    return response.json as HevyWorkoutsResponse;
    }