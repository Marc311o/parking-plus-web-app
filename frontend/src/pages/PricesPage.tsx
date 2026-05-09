import {useEffect, useMemo, useState} from 'react';
import {Alert, Box} from '@mui/material';
import {useIntl} from 'react-intl';
import {getTariffs, updateTariff, type TariffDTO} from '@api/Tariffs';
import TariffSchedule from '@components/Pricing/TariffSchedule';
import TariffEditor from '@components/Pricing/TariffEditor';
import type {TariffVisualBlock} from '@components/Pricing/TariffScheduleTile';

type TariffBlock = {
    key: string;
    dayOfWeek: number;
    startHour: number;
    endHour: number;
    firstHourTariff?: TariffDTO;
    nextHourTariff?: TariffDTO;
};

const parsePrice = (value: string) => Number(value.replace(',', '.'));

const isFirstHourTariff = (tariff: TariffDTO) =>
    tariff.isFirstHour ?? tariff.firstHour ?? false;

const buildTariffBlocks = (tariffs: TariffDTO[]): TariffBlock[] => {
    const grouped = new Map<string, TariffBlock>();

    tariffs.forEach((tariff) => {
        const key = `${tariff.dayOfWeek}-${tariff.startHour}-${tariff.endHour}`;

        const current = grouped.get(key) ?? {
            key,
            dayOfWeek: tariff.dayOfWeek,
            startHour: tariff.startHour,
            endHour: tariff.endHour,
            firstHourTariff: undefined,
            nextHourTariff: undefined,
        };

        if (isFirstHourTariff(tariff)) {
            current.firstHourTariff = tariff;
        } else {
            current.nextHourTariff = tariff;
        }

        grouped.set(key, current);
    });

    return Array.from(grouped.values()).sort((a, b) => {
        if (a.startHour !== b.startHour) {
            return a.startHour - b.startHour;
        }

        return a.dayOfWeek - b.dayOfWeek;
    });
};

const buildVisualBlocks = (blocks: TariffBlock[]): TariffVisualBlock[] => {
    const visualBlocks: TariffVisualBlock[] = [];

    blocks.forEach((block) => {
        const firstHourPrice = block.firstHourTariff?.price ?? 0;
        const nextHourPrice = block.nextHourTariff?.price ?? 0;

        const previousBlock = visualBlocks[visualBlocks.length - 1];

        const canJoin =
            previousBlock &&
            previousBlock.startHour === block.startHour &&
            previousBlock.endHour === block.endHour &&
            previousBlock.firstHourPrice === firstHourPrice &&
            previousBlock.nextHourPrice === nextHourPrice &&
            previousBlock.days[previousBlock.days.length - 1] === block.dayOfWeek - 1;

        if (canJoin) {
            previousBlock.days.push(block.dayOfWeek);

            if (block.firstHourTariff) {
                previousBlock.firstHourTariffs.push(block.firstHourTariff);
            }

            if (block.nextHourTariff) {
                previousBlock.nextHourTariffs.push(block.nextHourTariff);
            }

            previousBlock.key = `${previousBlock.key}-${block.dayOfWeek}`;
            return;
        }

        visualBlocks.push({
            key: `${block.dayOfWeek}-${block.startHour}-${block.endHour}-${firstHourPrice}-${nextHourPrice}`,
            days: [block.dayOfWeek],
            startHour: block.startHour,
            endHour: block.endHour,
            firstHourTariffs: block.firstHourTariff ? [block.firstHourTariff] : [],
            nextHourTariffs: block.nextHourTariff ? [block.nextHourTariff] : [],
            firstHourPrice,
            nextHourPrice,
        });
    });

    return visualBlocks;
};

const PricesPage = () => {
    const intl = useIntl();

    const [tariffs, setTariffs] = useState<TariffDTO[]>([]);
    const [selectedBlock, setSelectedBlock] = useState<TariffVisualBlock | null>(null);

    const [firstHourPrice, setFirstHourPrice] = useState('');
    const [nextHourPrice, setNextHourPrice] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchTariffs = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const result = await getTariffs();

                if (!isMounted) {
                    return;
                }

                setTariffs(result);
            } catch (err) {
                console.error(err);

                if (isMounted) {
                    setError(intl.formatMessage({id: 'prices.errors.fetchTariffs'}));
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void fetchTariffs();

        return () => {
            isMounted = false;
        };
    }, [intl]);

    const visualBlocks = useMemo(() => {
        return buildVisualBlocks(buildTariffBlocks(tariffs));
    }, [tariffs]);

    const handleSelectBlock = (block: TariffVisualBlock) => {
        setSelectedBlock(block);
        setFirstHourPrice(String(block.firstHourPrice).replace('.', ','));
        setNextHourPrice(String(block.nextHourPrice).replace('.', ','));
        setSaveError(null);
    };

    const handleSave = async () => {
        if (!selectedBlock) {
            return;
        }

        const parsedFirstHourPrice = parsePrice(firstHourPrice);
        const parsedNextHourPrice = parsePrice(nextHourPrice);

        if (
            Number.isNaN(parsedFirstHourPrice) ||
            Number.isNaN(parsedNextHourPrice) ||
            parsedFirstHourPrice < 0 ||
            parsedNextHourPrice < 0
        ) {
            setSaveError(intl.formatMessage({id: 'prices.errors.invalidPrices'}));
            return;
        }

        setIsSaving(true);
        setSaveError(null);

        try {
            const updatedTariffs: TariffDTO[] = [];

            for (const tariff of selectedBlock.firstHourTariffs) {
                if (!tariff.id) {
                    continue;
                }

                const updated = await updateTariff(tariff.id, {
                    ...tariff,
                    price: parsedFirstHourPrice,
                });

                updatedTariffs.push(updated);
            }

            for (const tariff of selectedBlock.nextHourTariffs) {
                if (!tariff.id) {
                    continue;
                }

                const updated = await updateTariff(tariff.id, {
                    ...tariff,
                    price: parsedNextHourPrice,
                });

                updatedTariffs.push(updated);
            }

            setTariffs((current) =>
                current.map((tariff) => {
                    const updated = updatedTariffs.find((item) => item.id === tariff.id);

                    return updated ?? tariff;
                })
            );

            setSelectedBlock((current) =>
                current
                    ? {
                        ...current,
                        firstHourPrice: parsedFirstHourPrice,
                        nextHourPrice: parsedNextHourPrice,
                        firstHourTariffs: current.firstHourTariffs.map((tariff) => ({
                            ...tariff,
                            price: parsedFirstHourPrice,
                        })),
                        nextHourTariffs: current.nextHourTariffs.map((tariff) => ({
                            ...tariff,
                            price: parsedNextHourPrice,
                        })),
                    }
                    : current
            );
        } catch (err) {
            console.error(err);
            setSaveError(intl.formatMessage({id: 'prices.errors.saveTariff'}));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Box
            sx={{
                width: '100%',
                minHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
            }}
        >
            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 2,
                        borderRadius: 2,
                    }}
                >
                    {error}
                </Alert>
            )}

            <TariffSchedule
                blocks={visualBlocks}
                selectedBlockKey={selectedBlock?.key}
                isLoading={isLoading}
                onBlockClick={handleSelectBlock}
            />

            <TariffEditor
                selectedBlock={selectedBlock}
                firstHourPrice={firstHourPrice}
                nextHourPrice={nextHourPrice}
                isSaving={isSaving}
                saveError={saveError}
                onFirstHourPriceChange={setFirstHourPrice}
                onNextHourPriceChange={setNextHourPrice}
                onSave={handleSave}
            />
        </Box>
    );
};

export default PricesPage;