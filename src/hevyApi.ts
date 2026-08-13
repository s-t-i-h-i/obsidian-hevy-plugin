import { requestUrl } from 'obsidian';
import { HevyWorkoutsResponse } from './types';

export async function fetchHevyWorkouts(secretKey: string): Promise<HevyWorkoutsResponse> {
    const response = await requestUrl({
        url: 'https://api.hevyapp.com/v1/workouts',
        method: 'GET',
        headers: {'api-key': secretKey,}
     })
    
    return response.json as HevyWorkoutsResponse;
    }