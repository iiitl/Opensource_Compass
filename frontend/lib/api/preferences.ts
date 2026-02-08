// Preferences API Client

const PREFERENCES_URL = '/api/core/preferences';

export interface SavePreferencesRequest {
    languages: string[];
    topics: string[];
    experienceLevel: string;
    githubUsername: string;
}

export async function savePreferences(data: SavePreferencesRequest): Promise<void> {
    try {
        const response = await fetch(PREFERENCES_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Unauthorized - please login again');
            }
            const errorText = await response.text();
            throw new Error(`Failed to save preferences: ${errorText}`);
        }

        const result = await response.json();
        console.log('✅ Preferences saved:', result);
    } catch (error) {
        console.error('❌ Error saving preferences:', error);
        throw error;
    }
}
