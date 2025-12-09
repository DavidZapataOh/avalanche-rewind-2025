'use client';

import { useState } from 'react';
import type { AvalancheRewind } from '@/lib/types';
import { SceneManager } from '@/components/rewind/SceneManager';

// Scene components
import { IntroScene } from '@/components/rewind/IntroScene';
import { PersonaScene } from '@/components/rewind/PersonaScene';
import { ActivityScene } from '@/components/rewind/ActivityScene';
import { TokensScene } from '@/components/rewind/TokensScene';
import { NftsScene } from '@/components/rewind/NftsScene';
import { HighlightsScene } from '@/components/rewind/HighlightsScene';
import { FinalCardScene } from '@/components/rewind/FinalCardScene';

interface RewindExperienceProps {
    rewind: AvalancheRewind;
}

// Scene Configuration
const SCENES = [
    { id: 'intro', component: IntroScene },
    { id: 'persona', component: PersonaScene },
    { id: 'activity', component: ActivityScene },
    { id: 'tokens', component: TokensScene },
    { id: 'nfts', component: NftsScene },
    { id: 'highlights', component: HighlightsScene },
    { id: 'final', component: FinalCardScene },
] as const;

export function RewindExperience({ rewind }: RewindExperienceProps) {
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

    const renderScene = () => {
        const sceneConfig = SCENES[currentSceneIndex];

        switch (sceneConfig.id) {
            case 'intro':
                return <IntroScene address={rewind.address} year={rewind.year} />;
            case 'persona':
                return <PersonaScene persona={rewind.persona} />;
            case 'activity':
                return (
                    <ActivityScene
                        activeDays={rewind.activeDays}
                        longestStreakDays={rewind.longestStreakDays}
                        dailyActivity={rewind.dailyActivity}
                        totalTransactions={rewind.totalTransactions}
                    />
                );
            case 'tokens':
                return <TokensScene tokens={rewind.tokens} />;
            case 'nfts':
                return <NftsScene nfts={rewind.nfts} />;
            case 'highlights':
                return (
                    <HighlightsScene
                        longestStreakDays={rewind.longestStreakDays}
                        biggestDay={rewind.biggestDay}
                        totalVolumeUSD={rewind.totalVolumeUSD}
                        totalGasSpentAVAX={rewind.totalGasSpentAVAX}
                    />
                );
            case 'final':
                return <FinalCardScene rewind={rewind} />;
            default:
                return null;
        }
    };

    return (
        <SceneManager
            totalScenes={SCENES.length}
            currentSceneIndex={currentSceneIndex}
            onSceneChange={setCurrentSceneIndex}
        >
            {renderScene()}
        </SceneManager>
    );
}
