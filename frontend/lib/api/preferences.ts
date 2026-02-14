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
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(PREFERENCES_URL, {
            method: 'POST',
            headers,
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

export interface UserPreferences {
    languages: string[];
    topics: string[];
    experienceLevel: string;
}

export async function getPreferences(): Promise<UserPreferences> {
    try {
        const response = await fetch(PREFERENCES_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Unauthorized - please login again');
            }
            throw new Error(`Failed to fetch preferences: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('❌ Error fetching preferences:', error);
        throw error;
    }
}


export async function syncEmail(userId: string): Promise<{ message: string; email: string }> {
    try {
        const response = await fetch(`/api/core/users/${userId}/sync-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to sync email: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('❌ Error syncing email:', error);
        throw error;
    }
}
