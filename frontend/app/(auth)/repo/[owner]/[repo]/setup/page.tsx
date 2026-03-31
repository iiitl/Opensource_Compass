"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { getSetupGuide, SetupGuide } from '@/lib/api/core-service';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PageWrapper from '@/components/ui/page-wrapper';

export default function SetupGuidePage() {
    const { owner, repo } = useParams() as { owner: string; repo: string };
    const { userId, isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const [guide, setGuide] = useState<SetupGuide | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            // Redirect to home or login if not authenticated
            // For now, show error state
            return;
        }

        if (isAuthenticated && userId && owner && repo) {
            fetchGuide();
        }
    }, [authLoading, isAuthenticated, userId, owner, repo]);

    const fetchGuide = async () => {
        if (!userId) return;

        setLoading(true);
        setError(null);
        try {
            const data = await getSetupGuide(owner, repo, userId);
            setGuide(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load setup guide');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="flex-1 flex items-center justify-center text-white">
                <p>Loading user data...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-white">
                <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
                <p className="mb-4">Please log in to view the setup guide.</p>
                <Button onClick={() => router.push('/')}>Go Home</Button>
            </div>
        );
    }

    return (
        <PageWrapper className="text-white font-sans">
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Setup Guide: {owner}/{repo}
                    </h1>
                    <p className="text-gray-400">
                        AI-generated setup instructions tailored to your experience level.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg mb-8">
                        <h3 className="font-bold">Error</h3>
                        <p>{error}</p>
                        <Button className="mt-2" onClick={fetchGuide}>Retry</Button>
                    </div>
                )}

                {loading && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400">Generating your personalized guide...</p>
                    </div>
                )}

                {guide && !loading && (
                    <div className="space-y-8">
                        {/* Prerequisites */}
                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">Prerequisites</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {guide.prerequisites.map((req, i) => (
                                    <Card key={i} className="p-4 bg-zinc-900/60 backdrop-blur-md border-zinc-800">
                                        <div className="flex items-start gap-3">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                                            <span className="text-gray-300">{req}</span>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </section>

                        {/* Installation Steps */}
                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">Installation Steps</h2>
                            <div className="space-y-6">
                                {guide.installation_steps.map((step, i) => (
                                    <div key={i} className="relative pl-8 border-l-2 border-zinc-800 pb-2">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-zinc-800 border-2 border-black flex items-center justify-center text-xs font-bold text-gray-400">
                                            {i + 1}
                                        </div>
                                        <div className="mb-2">
                                            <h3 className="text-lg font-medium text-white">{step.description}</h3>
                                        </div>
                                        {step.command && (
                                            <div className="bg-zinc-900/60 backdrop-blur-md rounded-lg p-4 font-mono text-sm border border-zinc-800 overflow-x-auto relative group">
                                                <code className="text-green-400">{step.command}</code>
                                                <Button
                                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs h-8 px-2"
                                                    onClick={() => navigator.clipboard.writeText(step.command)}
                                                >
                                                    Copy
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Environment Variables */}
                        {guide.environment_variables && guide.environment_variables.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-white">Environment Variables</h2>
                                <div className="overflow-hidden rounded-lg border border-zinc-800">
                                    <table className="w-full text-left text-sm text-gray-400">
                                        <thead className="bg-zinc-900/80 backdrop-blur-md text-gray-200">
                                            <tr>
                                                <th className="px-6 py-3">Variable</th>
                                                <th className="px-6 py-3">Description</th>
                                                <th className="px-6 py-3">Required</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-800 bg-black/40 backdrop-blur-md">
                                            {guide.environment_variables.map((env, i) => (
                                                <tr key={i} className="hover:bg-zinc-900/50">
                                                    <td className="px-6 py-4 font-mono text-purple-400">{env.name}</td>
                                                    <td className="px-6 py-4">{env.description}</td>
                                                    <td className="px-6 py-4">
                                                        {env.required ? (
                                                            <span className="inline-flex items-center rounded-full bg-red-400/10 px-2 py-1 text-xs font-medium text-red-400">Required</span>
                                                        ) : (
                                                            <span className="inline-flex items-center rounded-full bg-green-400/10 px-2 py-1 text-xs font-medium text-green-400">Optional</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        )}

                        {/* Common Errors */}
                        {guide.common_errors && guide.common_errors.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-white">Common Pitfalls</h2>
                                <div className="grid gap-4">
                                    {guide.common_errors.map((item, i) => (
                                        <div key={i} className="p-4 bg-orange-950/40 backdrop-blur-md border border-orange-900/30 rounded-lg">
                                            <h3 className="text-orange-400 font-medium mb-1 flex items-center gap-2">
                                                ⚠️ {item.error}
                                            </h3>
                                            <p className="text-gray-400 text-sm ml-6">
                                                <span className="font-semibold text-gray-300">Fix:</span> {item.fix}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Contribution Tips */}
                        {guide.contribution_tips && guide.contribution_tips.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-white">Contribution Tips</h2>
                                <div className="bg-zinc-900/60 backdrop-blur-md p-6 rounded-xl border border-zinc-800">
                                    <ul className="space-y-3">
                                        {guide.contribution_tips.map((tip, i) => (
                                            <li key={i} className="flex gap-3 text-gray-300">
                                                <span className="text-blue-500">💡</span>
                                                <span>{tip}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </section>
                        )}

                    </div>
                )}
            </main>
        </PageWrapper>
    );
}
