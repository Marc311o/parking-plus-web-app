import type {ParkingLevel, ParkingSpot} from '@api/types.ts';

export type SpotOrientation = 'left' | 'bottom' | 'middleTop' | 'middleBottom';
const middleStartX = 250;
const middleGap = 85;

export interface ParkingSpotLayout {
    id: string;
    x: number;
    y: number;
    orientation: SpotOrientation;
}

const createLevelLayout = (level: ParkingLevel): ParkingSpotLayout[] => {
    const leftSideRow: ParkingSpotLayout[] = [12, 13, 14].map((number, index) => ({
        id: `${level}${number}`,
        x: 20,
        y: 56 + index * 96,
        orientation: 'left',
    }));

    const topMiddleRow: ParkingSpotLayout[] = Array.from({length: 7}, (_, index) => ({
        id: `${level}${index + 15}`,
        x: middleStartX + index * middleGap,
        y: 100,
        orientation: 'middleTop',
    }));

    const lowerMiddleRow: ParkingSpotLayout[] = Array.from({length: 7}, (_, index) => ({
        id: `${level}${index + 22}`,
        x: middleStartX + index * middleGap,
        y: 232,
        orientation: 'middleBottom',
    }));

    const bottomRow: ParkingSpotLayout[] = Array.from({length: 11}, (_, index) => ({
        id: `${level}${String(index + 1).padStart(2, '0')}`,
        x: 58 + index * 82,
        y: 480,
        orientation: 'bottom',
    }));

    return [...leftSideRow, ...topMiddleRow, ...lowerMiddleRow, ...bottomRow];
};

export const parkingLayoutByLevel: Record<ParkingLevel, ParkingSpotLayout[]> = {
    A: createLevelLayout('A'),
    B: createLevelLayout('B'),
};

const createMockParkingSpots = (level: ParkingLevel): ParkingSpot[] => {
    const specialConfig: Partial<Record<string, Partial<ParkingSpot>>> = {
        [`${level}01`]: {spaceType: 'REGULAR_HANDICAPED'},
        [`${level}02`]: {spaceType: 'REGULAR_HANDICAPED'},
        [`${level}07`]: {spaceType: 'EV_ABLEBODIED'},
        [`${level}08`]: {spaceType: 'EV_ABLEBODIED'},
        [`${level}13`]: {spaceType: 'REGULAR_HANDICAPED'},
        [`${level}14`]: {spaceType: 'REGULAR_HANDICAPED'},
        [`${level}18`]: {spaceType: 'EV_HANDICAPED'},
        [`${level}19`]: {spaceType: 'EV_ABLEBODIED'},
        [`${level}24`]: {spaceType: 'REGULAR_BOTH'},
        [`${level}27`]: {spaceType: 'EV_BOTH'},

        [`${level}03`]: {status: 'occupied'},
        [`${level}05`]: {status: 'reserved'},
        [`${level}09`]: {status: 'occupied'},
        [`${level}17`]: {status: 'occupied'},
        [`${level}21`]: {status: 'reserved'},
        [`${level}25`]: {status: 'occupied'},
    };

    return parkingLayoutByLevel[level].map(({id}) => ({
        id,
        label: id,
        status: 'available',
        spaceType: 'REGULAR_ABLEBODIED',
        ...specialConfig[id],
    }));
};

export const mockParkingSpotsByLevel: Record<ParkingLevel, ParkingSpot[]> = {
    A: createMockParkingSpots('A'),
    B: createMockParkingSpots('B'),
};