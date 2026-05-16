import { BigBangStage } from './stages/BigBangStage';
import { GalaxyStage } from './stages/GalaxyStage';
import { SolarSystemStage } from './stages/SolarSystemStage';
import { EarthStage } from './stages/EarthStage';

export const UniverseStages = () => {
    return (
        <group>
            <BigBangStage />
            <GalaxyStage />
            <SolarSystemStage />
            <EarthStage />
        </group>
    );
};
