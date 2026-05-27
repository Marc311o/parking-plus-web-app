import {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert, Box, Popover, Button, Typography} from '@mui/material';
import {useIntl} from 'react-intl';
import {getTariffs, updateTariff, createTariff, deleteTariff, type TariffDTO} from '@api/Tariffs';
import TariffSchedule from '@components/Pricing/TariffSchedule';
import TariffEditor from '@components/Pricing/TariffEditor';
import type {TariffVisualBlock} from '@components/Pricing/TariffScheduleTile';
import {useAuthStore} from "@store/useAuthStore.tsx";
import {usePricingViewStore} from "@store/usePricingViewStore.ts";
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';

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
    tariff.isFirstHour === true || tariff.firstHour === true;

const getVisualBlockKey = (days: number[], startHour: number, endHour: number) =>
    `${days[0]}-${days[days.length - 1]}-${startHour}-${endHour}`;

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
        const firstHourPrice = block.firstHourTariff?.price ?? block.nextHourTariff?.price ?? 0;
        const nextHourPrice = block.nextHourTariff?.price ?? block.firstHourTariff?.price ?? 0;

        visualBlocks.push({
            key: getVisualBlockKey([block.dayOfWeek], block.startHour, block.endHour),
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

type EditState = {
    firstHourPrice: string;
    nextHourPrice: string;
    startHour: number;
    endHour: number;
    selectedDay: number;
    originalKey: string | null;
};

const PricesPage = () => {
    const intl = useIntl();
    const { view } = usePricingViewStore();

    const [serverTariffs, setServerTariffs] = useState<TariffDTO[]>([]);
    const [workingTariffs, setWorkingTariffs] = useState<TariffDTO[]>([]);

    const [selectedBlockKey, setSelectedBlockKey] = useState<string | null>(null);
    const [anchorEl, setAnchorEl] = useState<any | null>(null);

    const [editState, setEditState] = useState<EditState>({
        firstHourPrice: '0',
        nextHourPrice: '0',
        startHour: 0,
        endHour: 1,
        selectedDay: 1,
        originalKey: null
    });
    const [editorError, setEditorError] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const user = useAuthStore((state) => state.user);
    const isAdmin = user?.isOperator === true;

    const fetchTariffs = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await getTariffs();
            setServerTariffs(result);
            setWorkingTariffs(result.map(t => ({...t})));
        } catch (err) {
            console.error(err);
            setError(intl.formatMessage({id: 'prices.errors.fetchTariffs'}));
        } finally {
            setIsLoading(false);
        }
    }, [intl]);

    useEffect(() => {
        void fetchTariffs();
    }, [fetchTariffs]);

    const filteredTariffs = useMemo(() => {
        return workingTariffs.filter(t => {
            const isDaily = t.daily === true || t.isDaily === true;
            return view === 'daily' ? isDaily : !isDaily;
        });
    }, [workingTariffs, view]);

    const visualBlocks = useMemo(() => {
        return buildVisualBlocks(buildTariffBlocks(filteredTariffs));
    }, [filteredTariffs]);

    const hasChanges = useMemo(() => {
        return JSON.stringify(serverTariffs) !== JSON.stringify(workingTariffs);
    }, [serverTariffs, workingTariffs]);

    const isFull = useMemo(() => {
        if (view === 'daily') {
            const occupiedDays = new Set(filteredTariffs.map(t => t.dayOfWeek));
            return occupiedDays.size === 7;
        } else {
            for (let day = 1; day <= 7; day++) {
                const dayTariffs = filteredTariffs.filter(t => t.dayOfWeek === day);
                for (let h = 0; h < 24; h++) {
                    const isCovered = dayTariffs.some(t => h >= t.startHour && h < t.endHour);
                    if (!isCovered) return false;
                }
            }
            return true;
        }
    }, [filteredTariffs, view]);

    const handleSelectBlock = (block: TariffVisualBlock, event: React.MouseEvent<HTMLElement>) => {
        setSelectedBlockKey(block.key);
        setEditState({
            firstHourPrice: String(block.firstHourPrice).replace('.', ','),
            nextHourPrice: String(block.nextHourPrice).replace('.', ','),
            startHour: block.startHour,
            endHour: block.endHour,
            selectedDay: block.days[0],
            originalKey: block.key
        });
        setEditorError(null);
        if (isAdmin) {
            const rect = event.currentTarget.getBoundingClientRect();
            setAnchorEl({
                getBoundingClientRect: () => rect,
            });
        }
    };

    const handleBlockDelete = (block: TariffVisualBlock) => {
        if (!isAdmin) return;
        const blockBaseKey = `${block.days[0]}-${block.startHour}-${block.endHour}`;
        const idsToRemove = [...block.firstHourTariffs, ...block.nextHourTariffs].map(t => t.id).filter(id => id !== undefined);

        setWorkingTariffs(current => current.filter(t => {
            const tIsDaily = t.daily === true || t.isDaily === true;
            if (tIsDaily !== (view === 'daily')) return true;

            if (t.id !== undefined) return !idsToRemove.includes(t.id);
            const tKey = `${t.dayOfWeek}-${t.startHour}-${t.endHour}`;
            return tKey !== blockBaseKey;
        }));

        if (selectedBlockKey === block.key) {
            setAnchorEl(null);
            setSelectedBlockKey(null);
        }
    };

    const handleOpenAdd = (event: React.MouseEvent<HTMLElement>) => {
        let suggestedDay = 1;
        let start = 0;
        let end = view === 'daily' ? 24 : 1;

        if (view === 'daily') {
            const occupiedDays = new Set(filteredTariffs.map(t => t.dayOfWeek));
            for (let d = 1; d <= 7; d++) {
                if (!occupiedDays.has(d)) {
                    suggestedDay = d;
                    break;
                }
            }
        } else {
            outer: for (let d = 1; d <= 7; d++) {
                for (let h = 0; h < 24; h++) {
                    const overlaps = filteredTariffs.some(t => t.dayOfWeek === d && h < t.endHour && (h + 1) > t.startHour);
                    if (!overlaps) {
                        suggestedDay = d;
                        start = h;
                        end = h + 1;
                        break outer;
                    }
                }
            }
        }

        const base = {
            dayOfWeek: suggestedDay,
            startHour: start,
            endHour: end,
            daily: view === 'daily',
            isDaily: view === 'daily',
            price: 0
        };

        const newTariffs: TariffDTO[] = [];
        if (view === 'daily') {
            newTariffs.push({ ...base, isFirstHour: true, firstHour: true });
        } else {
            newTariffs.push({ ...base, isFirstHour: true, firstHour: true });
            newTariffs.push({ ...base, isFirstHour: false, firstHour: false });
        }

        setWorkingTariffs(curr => [...curr, ...newTariffs]);

        const newKey = `${suggestedDay}-${suggestedDay}-${start}-${end}`;
        setSelectedBlockKey(newKey);
        setEditState({
            firstHourPrice: '0',
            nextHourPrice: '0',
            startHour: start,
            endHour: end,
            selectedDay: suggestedDay,
            originalKey: newKey
        });
        setEditorError(null);
        if (isAdmin) {
            const rect = event.currentTarget.getBoundingClientRect();
            setAnchorEl({
                getBoundingClientRect: () => rect,
            });
        }
    };

    const handleFieldChange = (field: string, value: any) => {
        const nextState = { ...editState, [field]: value };
        setEditState(nextState);

        const parsedFirst = parsePrice(nextState.firstHourPrice);
        const parsedNext = view === 'daily' ? parsedFirst : parsePrice(nextState.nextHourPrice);

        if (Number.isNaN(parsedFirst) || Number.isNaN(parsedNext) || parsedFirst < 0 || parsedNext < 0) {
            setEditorError(intl.formatMessage({id: 'prices.errors.invalidPrices'}));
            return;
        }

        if (nextState.startHour >= nextState.endHour && view !== 'daily') {
            setEditorError(intl.formatMessage({id: 'prices.errors.invalidHours'}));
            return;
        }

        if (!nextState.originalKey) return;
        const [origDay, , origStart, origEnd] = nextState.originalKey.split('-').map(Number);

        const overlaps = filteredTariffs.some(t => {
            const isMatch = t.dayOfWeek === origDay && t.startHour === origStart && t.endHour === origEnd;
            if (isMatch) return false;

            if (t.dayOfWeek !== nextState.selectedDay) return false;
            return (nextState.startHour < t.endHour) && (nextState.endHour > t.startHour);
        });

        if (overlaps) {
            setEditorError(intl.formatMessage({id: 'prices.errors.overlapError'}));
            return;
        }

        setEditorError(null);

        const newKey = `${nextState.selectedDay}-${nextState.selectedDay}-${nextState.startHour}-${nextState.endHour}`;

        setWorkingTariffs(curr => {
            let hasFirst = false;
            let hasNext = false;
            let matchedAny = false;

            const nextTariffs = curr.map(t => {
                const isMatch = t.dayOfWeek === origDay && t.startHour === origStart && t.endHour === origEnd;
                const tIsDaily = t.daily === true || t.isDaily === true;
                if (!isMatch || tIsDaily !== (view === 'daily')) return t;

                matchedAny = true;
                const isFirst = isFirstHourTariff(t);
                if (isFirst) hasFirst = true;
                else hasNext = true;

                return {
                    ...t,
                    dayOfWeek: nextState.selectedDay,
                    startHour: nextState.startHour,
                    endHour: nextState.endHour,
                    price: isFirst ? parsedFirst : parsedNext
                };
            });

            if (matchedAny && view === 'hourly') {
                if (!hasFirst) {
                    nextTariffs.push({
                        dayOfWeek: nextState.selectedDay,
                        startHour: nextState.startHour,
                        endHour: nextState.endHour,
                        daily: false,
                        isDaily: false,
                        isFirstHour: true,
                        firstHour: true,
                        price: parsedFirst
                    });
                }
                if (!hasNext) {
                    nextTariffs.push({
                        dayOfWeek: nextState.selectedDay,
                        startHour: nextState.startHour,
                        endHour: nextState.endHour,
                        daily: false,
                        isDaily: false,
                        isFirstHour: false,
                        firstHour: false,
                        price: parsedNext
                    });
                }
            }

            return nextTariffs;
        });

        setEditState(s => ({ ...s, originalKey: newKey }));
        setSelectedBlockKey(newKey);
    };

    const handleGlobalSave = async () => {
        if (!isFull) return;
        setIsSaving(true);
        setError(null);
        try {
            const currentIds = workingTariffs.map(t => t.id).filter(id => id !== undefined);
            const toDelete = serverTariffs.filter(t => t.id !== undefined && !currentIds.includes(t.id));
            for (const t of toDelete) await deleteTariff(t.id!);

            for (const t of workingTariffs) {
                if (t.id === undefined) {
                    await createTariff(t);
                } else {
                    const original = serverTariffs.find(ot => ot.id === t.id);
                    if (JSON.stringify(original) !== JSON.stringify(t)) {
                        await updateTariff(t.id, t);
                    }
                }
            }
            await fetchTariffs();
            setAnchorEl(null);
        } catch (err) {
            console.error(err);
            setError(intl.formatMessage({id: 'prices.errors.saveTariff'}));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Box sx={{ width: '100%', minHeight: '100%', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 3, gap: 2, alignItems: 'center' }}>
                 {isAdmin && hasChanges && (
                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                         {!isFull && (
                             <Typography sx={{ color: '#DC2626', fontSize: 13, fontWeight: 500 }}>
                                 {intl.formatMessage({id: 'prices.errors.calendarNotFull'})}
                             </Typography>
                         )}
                         <Button
                            variant="contained"
                            disabled={!isFull || isSaving}
                            onClick={handleGlobalSave}
                            startIcon={<SaveRoundedIcon />}
                            sx={{
                                bgcolor: '#4CAF50',
                                '&:hover': { bgcolor: '#388E3C' },
                                textTransform: 'none',
                                borderRadius: 1.5,
                                px: 3
                            }}
                         >
                             {intl.formatMessage({id: isSaving ? 'prices.editor.savingButton' : 'prices.editor.saveButton'})}
                         </Button>
                     </Box>
                 )}
                 {isAdmin && !isFull && (
                     <Box
                        onClick={handleOpenAdd}
                        sx={{
                            bgcolor: '#9C13B8',
                            color: 'white',
                            px: 2.5,
                            py: 1,
                            borderRadius: 1.5,
                            cursor: 'pointer',
                            fontSize: 14,
                            fontWeight: 600,
                            boxShadow: '0 2px 8px rgba(156, 19, 184, 0.3)',
                            '&:hover': { bgcolor: '#7B158F' },
                            transition: '0.2s'
                        }}
                     >
                         {intl.formatMessage({id: 'prices.editor.addNew'})}
                     </Box>
                 )}
            </Box>

            <TariffSchedule
                view={view}
                blocks={visualBlocks}
                selectedBlockKey={selectedBlockKey}
                isLoading={isLoading}
                isAdmin={isAdmin}
                onBlockClick={handleSelectBlock}
                onBlockDelete={handleBlockDelete}
            />

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => { setAnchorEl(null); setSelectedBlockKey(null); }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                slotProps={{
                    paper: {
                        sx: {
                            p: 2,
                            borderRadius: '12px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                            border: '1px solid #E0E0E0',
                        }
                    }
                }}
            >
                {anchorEl && (
                    <TariffEditor
                        view={view}
                        firstHourPrice={editState.firstHourPrice}
                        nextHourPrice={editState.nextHourPrice}
                        startHour={editState.startHour}
                        endHour={editState.endHour}
                        selectedDay={editState.selectedDay}
                        onChange={handleFieldChange}
                    />
                )}
                {editorError && (
                    <Box sx={{ px: 2, pb: 2, pt: 1, width: 280 }}>
                        <Alert severity="error" sx={{ py: 0, borderRadius: 1, fontSize: 12 }}>
                            {editorError}
                        </Alert>
                    </Box>
                )}
            </Popover>
        </Box>
    );
};

export default PricesPage;