import {useEffect, useMemo, useState} from 'react';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material';
import type {SelectChangeEvent} from '@mui/material/Select';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
import ElectricCarRoundedIcon from '@mui/icons-material/ElectricCarRounded';
import AccessibleRoundedIcon from '@mui/icons-material/AccessibleRounded';
import LocalParkingRoundedIcon from '@mui/icons-material/LocalParkingRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import {useIntl} from 'react-intl';

import {
    getParkingQuote,
    purchaseParking,
    type ParkingPurchaseDTO,
    type ParkingPurchaseMode,
    type ParkingQuoteDTO,
    type VehicleDTO,
} from '@api/ParkingPurchase';

import {getClientVehicles} from '@api/Clients';

// TODO: SEARCH FOR TODO
const MOCK_WALLET_BALANCE = 120;
const MOCK_WALLET_CURRENCY = 'PLN';

const toDateInputValue = (date: Date) => date.toISOString().slice(0, 10);

const toTimeInputValue = (date: Date) => date.toTimeString().slice(0, 5);

const addHours = (date: Date, hours: number) => {
    const nextDate = new Date(date);

    nextDate.setHours(nextDate.getHours() + hours);
    nextDate.setSeconds(0);
    nextDate.setMilliseconds(0);

    return nextDate;
};

const getCurrentDateTimeValue = () => {
    const now = new Date();

    now.setSeconds(0);
    now.setMilliseconds(0);

    return `${toDateInputValue(now)}T${toTimeInputValue(now)}:00`;
};

const buildDateTime = (date: string, time: string) => {
    if (!date || !time) {
        return null;
    }

    return `${date}T${time}:00`;
};

const getVehicleIcon = (carType: string) => {
    if (carType.includes('HANDICAPED')) {
        return <AccessibleRoundedIcon/>;
    }

    if (carType.includes('EV')) {
        return <ElectricCarRoundedIcon/>;
    }

    return <DirectionsCarRoundedIcon/>;
};

const formatMoney = (value: number, currency = 'PLN') =>
    new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency,
    }).format(value);

const formatDateTime = (value: string) =>
    new Intl.DateTimeFormat('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));

const ParkingPurchasePage = () => {
    const {formatMessage} = useIntl();

    const now = useMemo(() => new Date(), []);
    const defaultEndDate = addHours(now, 1);

    const [vehicles, setVehicles] = useState<VehicleDTO[]>([]);
    const [selectedVehicleId, setSelectedVehicleId] = useState('');

    const [mode, setMode] = useState<ParkingPurchaseMode>('PURCHASE');

    const [purchaseEndDate, setPurchaseEndDate] = useState(toDateInputValue(defaultEndDate));
    const [purchaseEndTime, setPurchaseEndTime] = useState(toTimeInputValue(defaultEndDate));

    const [reservationStartDate, setReservationStartDate] = useState(toDateInputValue(now));
    const [reservationStartTime, setReservationStartTime] = useState(toTimeInputValue(addHours(now, 1)));
    const [reservationEndDate, setReservationEndDate] = useState(toDateInputValue(addHours(now, 2)));
    const [reservationEndTime, setReservationEndTime] = useState(toTimeInputValue(addHours(now, 2)));

    // TODO: później podmienić na saldo z useAuthStore, np.
    // const balance = useAuthStore((state) => state.user?.walletBalance ?? null);
    // const currency = useAuthStore((state) => state.user?.currency ?? 'PLN');
    const [balance, setBalance] = useState<number | null>(MOCK_WALLET_BALANCE);
    const [currency, setCurrency] = useState(MOCK_WALLET_CURRENCY);

    const [quote, setQuote] = useState<ParkingQuoteDTO | null>(null);
    const [purchaseResult, setPurchaseResult] = useState<ParkingPurchaseDTO | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isQuoteLoading, setIsQuoteLoading] = useState(false);
    const [isPurchasing, setIsPurchasing] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [quoteError, setQuoteError] = useState<string | null>(null);
    const [purchaseError, setPurchaseError] = useState<string | null>(null);

    const selectedVehicle = useMemo(
        () => vehicles.find((vehicle) => String(vehicle.id) === selectedVehicleId) ?? null,
        [vehicles, selectedVehicleId],
    );

    const reservationStartDateTime = useMemo(
        () => buildDateTime(reservationStartDate, reservationStartTime),
        [reservationStartDate, reservationStartTime],
    );

    const reservationEndDateTime = useMemo(
        () => buildDateTime(reservationEndDate, reservationEndTime),
        [reservationEndDate, reservationEndTime],
    );

    const purchaseEndDateTime = useMemo(
        () => buildDateTime(purchaseEndDate, purchaseEndTime),
        [purchaseEndDate, purchaseEndTime],
    );

    const parkingStartDateTime = mode === 'PURCHASE'
        ? getCurrentDateTimeValue()
        : reservationStartDateTime;

    const parkingEndDateTime = mode === 'PURCHASE'
        ? purchaseEndDateTime
        : reservationEndDateTime;

    const isParkingTimeValid =
        Boolean(parkingStartDateTime) &&
        Boolean(parkingEndDateTime) &&
        new Date(parkingStartDateTime as string) < new Date(parkingEndDateTime as string);

    const canPurchase =
        Boolean(selectedVehicle?.id) &&
        Boolean(quote) &&
        isParkingTimeValid &&
        !isPurchasing &&
        !isQuoteLoading &&
        !purchaseError;

    useEffect(() => {
        let isMounted = true;

        const fetchInitialData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // TODO: podmienić na getMyVehicles(), gdy backend doda GET /vehicles/me.
                // Na razie mockowo pobieramy auta klienta po ID.
                const vehiclesResult = await getClientVehicles(4);

                if (!isMounted) {
                    return;
                }

                setVehicles(vehiclesResult);

                // TODO: usunąć, gdy saldo będzie brane z useAuthStore po /me.
                setBalance(MOCK_WALLET_BALANCE);
                setCurrency(MOCK_WALLET_CURRENCY);

                const firstVehicleWithId = vehiclesResult.find((vehicle) => vehicle.id !== undefined);

                if (firstVehicleWithId?.id) {
                    setSelectedVehicleId(String(firstVehicleWithId.id));
                }
            } catch (err) {
                console.error(err);

                if (isMounted) {
                    setError(formatMessage({
                        id: 'parkingPurchase.errors.initialData',
                        defaultMessage: 'Nie udało się pobrać danych potrzebnych do zakupu parkingu.',
                    }));
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void fetchInitialData();

        return () => {
            isMounted = false;
        };
    }, [formatMessage]);

    useEffect(() => {
        let isMounted = true;

        const fetchQuote = async () => {
            if (!isParkingTimeValid) {
                setQuote(null);
                return;
            }

            setIsQuoteLoading(true);
            setQuoteError(null);
            setPurchaseError(null);

            try {
                const result = await getParkingQuote({
                    mode,
                    startTime: parkingStartDateTime as string,
                    endTime: parkingEndDateTime as string,
                });

                if (!isMounted) {
                    return;
                }

                setQuote(result);
                setCurrency(result.currency ?? MOCK_WALLET_CURRENCY);
            } catch (err) {
                console.error(err);

                if (isMounted) {
                    setQuote(null);
                    setQuoteError(formatMessage({
                        id: 'parkingPurchase.errors.quote',
                        defaultMessage: 'Nie udało się wyliczyć ceny dla wybranego czasu.',
                    }));
                }
            } finally {
                if (isMounted) {
                    setIsQuoteLoading(false);
                }
            }
        };

        void fetchQuote();

        return () => {
            isMounted = false;
        };
    }, [
        mode,
        parkingStartDateTime,
        parkingEndDateTime,
        isParkingTimeValid,
        formatMessage,
    ]);

    const clearPurchaseState = () => {
        setPurchaseResult(null);
        setPurchaseError(null);
    };

    const handleVehicleChange = (event: SelectChangeEvent) => {
        setSelectedVehicleId(event.target.value);
        clearPurchaseState();
    };

    const handleModeChange = (
        _event: React.MouseEvent<HTMLElement>,
        nextMode: ParkingPurchaseMode | null,
    ) => {
        if (!nextMode) {
            return;
        }

        setMode(nextMode);
        clearPurchaseState();
    };

    const handleAddVehicle = () => {
        // TODO: podpiąć okienko dodawania auta.
    };

    const handlePurchase = async () => {
        const currentStartDateTime = mode === 'PURCHASE'
            ? getCurrentDateTimeValue()
            : reservationStartDateTime;

        const currentEndDateTime = mode === 'PURCHASE'
            ? purchaseEndDateTime
            : reservationEndDateTime;

        if (!selectedVehicle?.id || !currentStartDateTime || !currentEndDateTime) {
            return;
        }

        setIsPurchasing(true);
        setPurchaseError(null);
        setPurchaseResult(null);

        try {
            const result = await purchaseParking({
                vehicleId: selectedVehicle.id,
                mode,
                startTime: currentStartDateTime,
                endTime: currentEndDateTime,
            });

            setPurchaseResult(result);

            // TODO: po integracji z useAuthStore najlepiej aktualizować saldo w store,
            // np. useAuthStore.getState().setWalletBalance(result.balanceAfter)
            setBalance(result.balanceAfter);
            setCurrency(result.currency ?? MOCK_WALLET_CURRENCY);
        } catch (err) {
            console.error(err);
            setPurchaseError(formatMessage({
                id: 'parkingPurchase.errors.purchase',
                defaultMessage: 'Nie udało się kupić miejsca parkingowego.',
            }));
        } finally {
            setIsPurchasing(false);
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
                <Alert severity="error" sx={{borderRadius: '14px'}}>
                    {error}
                </Alert>
            )}

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        lg: 'minmax(0, 1fr) 360px',
                    },
                    gap: 2.5,
                    alignItems: 'start',
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        overflow: 'hidden',
                        borderRadius: '22px',
                        border: '1px solid rgba(139, 31, 158, 0.1)',
                        boxShadow: '0 18px 42px rgba(20, 30, 55, 0.08)',
                    }}
                >
                    <Box
                        sx={{
                            p: 3,
                            background: 'linear-gradient(135deg, #5E076E 0%, #C13BDB 100%)',
                            color: '#FFFFFF',
                        }}
                    >
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5}}>
                            <Avatar
                                sx={{
                                    width: 52,
                                    height: 52,
                                    bgcolor: 'rgba(255,255,255,0.18)',
                                    color: '#FFFFFF',
                                    border: '1px solid rgba(255,255,255,0.28)',
                                }}
                            >
                                <LocalParkingRoundedIcon/>
                            </Avatar>

                            <Box>
                                <Typography sx={{fontSize: 24, fontWeight: 900, lineHeight: 1.1}}>
                                    {formatMessage({
                                        id: 'parkingPurchase.title',
                                        defaultMessage: 'Kup lub zarezerwuj miejsce parkingowe',
                                    })}
                                </Typography>

                                <Typography sx={{fontSize: 14, opacity: 0.85, mt: 0.7}}>
                                    {formatMessage({
                                        id: 'parkingPurchase.subtitle',
                                        defaultMessage: 'Wybierz auto oraz czas postoju. Miejsce przydzieli backend.',
                                    })}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{p: {xs: 2, md: 3}, bgcolor: '#FBF7FC'}}>
                        {isLoading ? (
                            <Box
                                sx={{
                                    py: 8,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 2,
                                }}
                            >
                                <CircularProgress size={36}/>

                                <Typography sx={{fontSize: 14, color: '#777777'}}>
                                    {formatMessage({
                                        id: 'parkingPurchase.loading',
                                        defaultMessage: 'Ładowanie danych...',
                                    })}
                                </Typography>
                            </Box>
                        ) : vehicles.length === 0 ? (
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    borderRadius: '20px',
                                    bgcolor: '#FFFFFF',
                                    border: '1px dashed rgba(139, 31, 158, 0.28)',
                                    textAlign: 'center',
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        mx: 'auto',
                                        mb: 2,
                                        bgcolor: 'rgba(193, 59, 219, 0.1)',
                                        color: '#8B1F9E',
                                    }}
                                >
                                    <DirectionsCarRoundedIcon/>
                                </Avatar>

                                <Typography sx={{fontSize: 20, fontWeight: 900, color: '#202020'}}>
                                    {formatMessage({
                                        id: 'parkingPurchase.noVehiclesTitle',
                                        defaultMessage: 'Nie masz jeszcze żadnego samochodu',
                                    })}
                                </Typography>

                                <Typography sx={{fontSize: 14, color: '#777777', mt: 1, mb: 2.5}}>
                                    {formatMessage({
                                        id: 'parkingPurchase.noVehiclesDescription',
                                        defaultMessage: 'Dodaj samochód, aby móc kupić lub zarezerwować miejsce parkingowe.',
                                    })}
                                </Typography>

                                <Button
                                    variant="contained"
                                    startIcon={<AddRoundedIcon/>}
                                    onClick={handleAddVehicle}
                                    sx={{
                                        height: 42,
                                        px: 2.4,
                                        borderRadius: '13px',
                                        bgcolor: '#9C13B8',
                                        textTransform: 'none',
                                        fontWeight: 800,
                                        boxShadow: 'none',
                                        '&:hover': {
                                            bgcolor: '#7F0F96',
                                            boxShadow: 'none',
                                        },
                                    }}
                                >
                                    {formatMessage({
                                        id: 'parkingPurchase.addVehicle',
                                        defaultMessage: 'Dodaj samochód',
                                    })}
                                </Button>
                            </Paper>
                        ) : (
                            <Stack spacing={2.5}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2.5,
                                        borderRadius: '20px',
                                        bgcolor: '#FFFFFF',
                                        border: '1px solid rgba(139, 31, 158, 0.09)',
                                    }}
                                >
                                    <Stack spacing={2}>
                                        <Box>
                                            <Typography sx={{fontSize: 18, fontWeight: 900, color: '#202020'}}>
                                                {formatMessage({
                                                    id: 'parkingPurchase.formModeTitle',
                                                    defaultMessage: 'Rodzaj postoju',
                                                })}
                                            </Typography>

                                            <Typography sx={{fontSize: 13, color: '#777777', mt: 0.4}}>
                                                {formatMessage({
                                                    id: 'parkingPurchase.formModeDescription',
                                                    defaultMessage: 'Kup miejsce od teraz albo zarezerwuj je na później.',
                                                })}
                                            </Typography>
                                        </Box>

                                        <ToggleButtonGroup
                                            exclusive
                                            value={mode}
                                            onChange={handleModeChange}
                                            disabled={isPurchasing}
                                            sx={{
                                                alignSelf: 'flex-start',
                                                bgcolor: '#FBF7FC',
                                                borderRadius: '14px',
                                                p: 0.5,
                                                border: '1px solid rgba(139, 31, 158, 0.09)',
                                                '& .MuiToggleButton-root': {
                                                    px: 2,
                                                    py: 1,
                                                    border: 0,
                                                    borderRadius: '11px !important',
                                                    textTransform: 'none',
                                                    fontWeight: 800,
                                                    color: '#777777',
                                                },
                                                '& .Mui-selected': {
                                                    bgcolor: 'rgba(193, 59, 219, 0.12) !important',
                                                    color: '#8B1F9E !important',
                                                },
                                            }}
                                        >
                                            <ToggleButton value="PURCHASE">
                                                {formatMessage({
                                                    id: 'parkingPurchase.modePurchase',
                                                    defaultMessage: 'Kup od teraz',
                                                })}
                                            </ToggleButton>

                                            <ToggleButton value="RESERVATION">
                                                {formatMessage({
                                                    id: 'parkingPurchase.modeReservation',
                                                    defaultMessage: 'Zarezerwuj',
                                                })}
                                            </ToggleButton>
                                        </ToggleButtonGroup>
                                    </Stack>
                                </Paper>

                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2.5,
                                        borderRadius: '20px',
                                        bgcolor: '#FFFFFF',
                                        border: '1px solid rgba(139, 31, 158, 0.09)',
                                    }}
                                >
                                    <Stack spacing={2}>
                                        <Box>
                                            <Typography sx={{fontSize: 18, fontWeight: 900, color: '#202020'}}>
                                                {formatMessage({
                                                    id: 'parkingPurchase.vehicleSectionTitle',
                                                    defaultMessage: 'Samochód',
                                                })}
                                            </Typography>

                                            <Typography sx={{fontSize: 13, color: '#777777', mt: 0.4}}>
                                                {formatMessage({
                                                    id: 'parkingPurchase.vehicleSectionDescription',
                                                    defaultMessage: 'Wybierz pojazd, dla którego ma zostać przydzielone miejsce.',
                                                })}
                                            </Typography>
                                        </Box>

                                        <FormControl fullWidth>
                                            <InputLabel>
                                                {formatMessage({
                                                    id: 'parkingPurchase.vehicleLabel',
                                                    defaultMessage: 'Samochód',
                                                })}
                                            </InputLabel>

                                            <Select
                                                label={formatMessage({
                                                    id: 'parkingPurchase.vehicleLabel',
                                                    defaultMessage: 'Samochód',
                                                })}
                                                value={selectedVehicleId}
                                                onChange={handleVehicleChange}
                                                disabled={isPurchasing}
                                                sx={{
                                                    borderRadius: '14px',
                                                    bgcolor: '#FFFFFF',
                                                }}
                                            >
                                                {vehicles.map((vehicle) => (
                                                    <MenuItem
                                                        key={vehicle.id ?? vehicle.licensePlate}
                                                        value={String(vehicle.id)}
                                                        disabled={!vehicle.id}
                                                    >
                                                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                                            {getVehicleIcon(vehicle.carType)}
                                                            <span>{vehicle.licensePlate}</span>
                                                        </Box>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        {selectedVehicle && (
                                            <Card
                                                elevation={0}
                                                sx={{
                                                    borderRadius: '18px',
                                                    bgcolor: '#FBF7FC',
                                                    border: '1px solid rgba(139, 31, 158, 0.09)',
                                                }}
                                            >
                                                <CardContent sx={{p: 2.5}}>
                                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                                                        <Avatar
                                                            sx={{
                                                                width: 50,
                                                                height: 50,
                                                                bgcolor: 'rgba(193, 59, 219, 0.1)',
                                                                color: '#8B1F9E',
                                                            }}
                                                        >
                                                            {getVehicleIcon(selectedVehicle.carType)}
                                                        </Avatar>

                                                        <Box sx={{flex: 1, minWidth: 0}}>
                                                            <Typography
                                                                sx={{
                                                                    fontSize: 20,
                                                                    fontWeight: 900,
                                                                    color: '#202020',
                                                                    letterSpacing: 0.8,
                                                                }}
                                                            >
                                                                {selectedVehicle.licensePlate}
                                                            </Typography>

                                                            <Chip
                                                                size="small"
                                                                label={selectedVehicle.carType}
                                                                sx={{
                                                                    mt: 0.8,
                                                                    height: 24,
                                                                    borderRadius: '8px',
                                                                    fontSize: 11,
                                                                    fontWeight: 800,
                                                                    color: '#8B1F9E',
                                                                    bgcolor: 'rgba(193, 59, 219, 0.1)',
                                                                }}
                                                            />
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </Stack>
                                </Paper>

                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2.5,
                                        borderRadius: '20px',
                                        bgcolor: '#FFFFFF',
                                        border: '1px solid rgba(139, 31, 158, 0.09)',
                                    }}
                                >
                                    <Stack spacing={2}>
                                        <Box>
                                            <Typography sx={{fontSize: 18, fontWeight: 900, color: '#202020'}}>
                                                {formatMessage({
                                                    id: 'parkingPurchase.timeSectionTitle',
                                                    defaultMessage: 'Czas postoju',
                                                })}
                                            </Typography>

                                            <Typography sx={{fontSize: 13, color: '#777777', mt: 0.4}}>
                                                {mode === 'PURCHASE'
                                                    ? formatMessage({
                                                        id: 'parkingPurchase.purchaseTimeDescription',
                                                        defaultMessage: 'Postój rozpocznie się automatycznie od teraz. Wybierz tylko czas zakończenia.',
                                                    })
                                                    : formatMessage({
                                                        id: 'parkingPurchase.reservationTimeDescription',
                                                        defaultMessage: 'Wybierz dokładną datę i godzinę rozpoczęcia oraz zakończenia rezerwacji.',
                                                    })}
                                            </Typography>
                                        </Box>

                                        {mode === 'PURCHASE' ? (
                                            <Box
                                                sx={{
                                                    display: 'grid',
                                                    gridTemplateColumns: {
                                                        xs: '1fr',
                                                        md: '1fr 1fr',
                                                    },
                                                    gap: 2,
                                                }}
                                            >
                                                <TextField
                                                    fullWidth
                                                    type="date"
                                                    label={formatMessage({
                                                        id: 'parkingPurchase.purchaseEndDate',
                                                        defaultMessage: 'Dzień zakończenia',
                                                    })}
                                                    value={purchaseEndDate}
                                                    onChange={(event) => {
                                                        setPurchaseEndDate(event.target.value);
                                                        clearPurchaseState();
                                                    }}
                                                    disabled={isPurchasing}
                                                    InputLabelProps={{shrink: true}}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: '14px',
                                                            bgcolor: '#FFFFFF',
                                                        },
                                                    }}
                                                />

                                                <TextField
                                                    fullWidth
                                                    type="time"
                                                    label={formatMessage({
                                                        id: 'parkingPurchase.purchaseEndTime',
                                                        defaultMessage: 'Godzina zakończenia',
                                                    })}
                                                    value={purchaseEndTime}
                                                    onChange={(event) => {
                                                        setPurchaseEndTime(event.target.value);
                                                        clearPurchaseState();
                                                    }}
                                                    disabled={isPurchasing}
                                                    InputLabelProps={{shrink: true}}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: '14px',
                                                            bgcolor: '#FFFFFF',
                                                        },
                                                    }}
                                                />
                                            </Box>
                                        ) : (
                                            <Box
                                                sx={{
                                                    display: 'grid',
                                                    gridTemplateColumns: {
                                                        xs: '1fr',
                                                        md: '1fr 1fr',
                                                    },
                                                    gap: 2,
                                                }}
                                            >
                                                <TextField
                                                    fullWidth
                                                    type="date"
                                                    label={formatMessage({
                                                        id: 'parkingPurchase.parkingStartDate',
                                                        defaultMessage: 'Dzień od',
                                                    })}
                                                    value={reservationStartDate}
                                                    onChange={(event) => {
                                                        setReservationStartDate(event.target.value);
                                                        clearPurchaseState();
                                                    }}
                                                    disabled={isPurchasing}
                                                    InputLabelProps={{shrink: true}}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: '14px',
                                                            bgcolor: '#FFFFFF',
                                                        },
                                                    }}
                                                />

                                                <TextField
                                                    fullWidth
                                                    type="time"
                                                    label={formatMessage({
                                                        id: 'parkingPurchase.parkingStartTime',
                                                        defaultMessage: 'Godzina od',
                                                    })}
                                                    value={reservationStartTime}
                                                    onChange={(event) => {
                                                        setReservationStartTime(event.target.value);
                                                        clearPurchaseState();
                                                    }}
                                                    disabled={isPurchasing}
                                                    InputLabelProps={{shrink: true}}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: '14px',
                                                            bgcolor: '#FFFFFF',
                                                        },
                                                    }}
                                                />

                                                <TextField
                                                    fullWidth
                                                    type="date"
                                                    label={formatMessage({
                                                        id: 'parkingPurchase.parkingEndDate',
                                                        defaultMessage: 'Dzień do',
                                                    })}
                                                    value={reservationEndDate}
                                                    onChange={(event) => {
                                                        setReservationEndDate(event.target.value);
                                                        clearPurchaseState();
                                                    }}
                                                    disabled={isPurchasing}
                                                    InputLabelProps={{shrink: true}}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: '14px',
                                                            bgcolor: '#FFFFFF',
                                                        },
                                                    }}
                                                />

                                                <TextField
                                                    fullWidth
                                                    type="time"
                                                    label={formatMessage({
                                                        id: 'parkingPurchase.parkingEndTime',
                                                        defaultMessage: 'Godzina do',
                                                    })}
                                                    value={reservationEndTime}
                                                    onChange={(event) => {
                                                        setReservationEndTime(event.target.value);
                                                        clearPurchaseState();
                                                    }}
                                                    disabled={isPurchasing}
                                                    InputLabelProps={{shrink: true}}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: '14px',
                                                            bgcolor: '#FFFFFF',
                                                        },
                                                    }}
                                                />
                                            </Box>
                                        )}

                                        {!isParkingTimeValid && (
                                            <Alert severity="warning" sx={{borderRadius: '14px'}}>
                                                {formatMessage({
                                                    id: 'parkingPurchase.invalidParkingTime',
                                                    defaultMessage: 'Data i godzina zakończenia muszą być późniejsze niż rozpoczęcia.',
                                                })}
                                            </Alert>
                                        )}
                                    </Stack>
                                </Paper>

                                {quoteError && (
                                    <Alert severity="error" sx={{borderRadius: '14px'}}>
                                        {quoteError}
                                    </Alert>
                                )}

                                {purchaseError && (
                                    <Alert
                                        severity="error"
                                        icon={<ErrorOutlineRoundedIcon/>}
                                        sx={{borderRadius: '14px'}}
                                    >
                                        {purchaseError}
                                    </Alert>
                                )}

                                {purchaseResult && (
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 2.5,
                                            borderRadius: '20px',
                                            bgcolor: '#FFFFFF',
                                            border: '1px solid rgba(46, 125, 50, 0.16)',
                                            boxShadow: '0 12px 30px rgba(20, 30, 55, 0.06)',
                                        }}
                                    >
                                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1.4, mb: 2}}>
                                            <Avatar
                                                sx={{
                                                    width: 44,
                                                    height: 44,
                                                    bgcolor: 'rgba(46, 125, 50, 0.1)',
                                                    color: '#2E7D32',
                                                }}
                                            >
                                                <CheckCircleRoundedIcon/>
                                            </Avatar>

                                            <Box>
                                                <Typography sx={{fontSize: 18, fontWeight: 900, color: '#202020'}}>
                                                    {purchaseResult.mode === 'RESERVATION'
                                                        ? formatMessage({
                                                            id: 'parkingPurchase.reservationSuccessTitle',
                                                            defaultMessage: 'Miejsce zostało zarezerwowane',
                                                        })
                                                        : formatMessage({
                                                            id: 'parkingPurchase.successTitle',
                                                            defaultMessage: 'Miejsce zostało przydzielone',
                                                        })}
                                                </Typography>

                                                <Typography sx={{fontSize: 13, color: '#777777'}}>
                                                    {formatMessage({
                                                        id: 'parkingPurchase.successDescription',
                                                        defaultMessage: 'Poniżej znajdziesz szczegóły postoju.',
                                                    })}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Divider sx={{mb: 2}}/>

                                        <Box
                                            sx={{
                                                display: 'grid',
                                                gridTemplateColumns: {
                                                    xs: '1fr',
                                                    md: 'repeat(3, 1fr)',
                                                },
                                                gap: 1.5,
                                            }}
                                        >
                                            <Box>
                                                <Typography sx={{fontSize: 12, color: '#8B1F9E', fontWeight: 800}}>
                                                    {formatMessage({
                                                        id: 'parkingPurchase.assignedSpace',
                                                        defaultMessage: 'Miejsce',
                                                    })}
                                                </Typography>

                                                <Typography sx={{fontSize: 22, fontWeight: 900}}>
                                                    {purchaseResult.parkingSpace.id}
                                                </Typography>

                                                <Typography sx={{fontSize: 13, color: '#777777'}}>
                                                    {formatMessage(
                                                        {
                                                            id: 'parkingPurchase.level',
                                                            defaultMessage: 'Poziom {level}',
                                                        },
                                                        {level: purchaseResult.parkingSpace.level},
                                                    )}
                                                </Typography>
                                            </Box>

                                            <Box>
                                                <Typography sx={{fontSize: 12, color: '#8B1F9E', fontWeight: 800}}>
                                                    {formatMessage({
                                                        id: 'parkingPurchase.validTime',
                                                        defaultMessage: 'Czas postoju',
                                                    })}
                                                </Typography>

                                                <Typography sx={{fontSize: 14, fontWeight: 800}}>
                                                    {formatDateTime(purchaseResult.startTime)}
                                                </Typography>

                                                <Typography sx={{fontSize: 13, color: '#777777'}}>
                                                    {formatMessage({
                                                        id: 'parkingPurchase.to',
                                                        defaultMessage: 'do',
                                                    })} {formatDateTime(purchaseResult.endTime)}
                                                </Typography>
                                            </Box>

                                            <Box>
                                                <Typography sx={{fontSize: 12, color: '#8B1F9E', fontWeight: 800}}>
                                                    {formatMessage({
                                                        id: 'parkingPurchase.paid',
                                                        defaultMessage: 'Zapłacono',
                                                    })}
                                                </Typography>

                                                <Typography sx={{fontSize: 18, fontWeight: 900}}>
                                                    {formatMoney(purchaseResult.price, purchaseResult.currency ?? currency)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Paper>
                                )}

                                <Button
                                    variant="contained"
                                    size="large"
                                    disabled={!canPurchase}
                                    onClick={handlePurchase}
                                    sx={{
                                        alignSelf: {
                                            xs: 'stretch',
                                            sm: 'flex-start',
                                        },
                                        minWidth: 210,
                                        height: 44,
                                        borderRadius: '13px',
                                        bgcolor: '#9C13B8',
                                        textTransform: 'none',
                                        fontWeight: 800,
                                        boxShadow: 'none',
                                        '&:hover': {
                                            bgcolor: '#7F0F96',
                                            boxShadow: 'none',
                                        },
                                    }}
                                >
                                    {isPurchasing
                                        ? formatMessage({
                                            id: 'parkingPurchase.buyingButton',
                                            defaultMessage: 'Przetwarzanie...',
                                        })
                                        : mode === 'RESERVATION'
                                            ? formatMessage({
                                                id: 'parkingPurchase.reserveButton',
                                                defaultMessage: 'Zarezerwuj miejsce',
                                            })
                                            : formatMessage({
                                                id: 'parkingPurchase.buyButton',
                                                defaultMessage: 'Kup miejsce',
                                            })}
                                </Button>
                            </Stack>
                        )}
                    </Box>
                </Paper>

                <Stack spacing={2.5}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2.5,
                            borderRadius: '22px',
                            bgcolor: '#FFFFFF',
                            border: '1px solid rgba(139, 31, 158, 0.1)',
                            boxShadow: '0 18px 42px rgba(20, 30, 55, 0.08)',
                        }}
                    >
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5}}>
                            <Avatar
                                sx={{
                                    width: 46,
                                    height: 46,
                                    bgcolor: 'rgba(193, 59, 219, 0.1)',
                                    color: '#8B1F9E',
                                }}
                            >
                                <AccountBalanceWalletRoundedIcon/>
                            </Avatar>

                            <Box>
                                <Typography sx={{fontSize: 13, fontWeight: 800, color: '#8B1F9E'}}>
                                    {formatMessage({
                                        id: 'parkingPurchase.balance',
                                        defaultMessage: 'Twoje saldo',
                                    })}
                                </Typography>

                                <Typography sx={{fontSize: 26, fontWeight: 900, color: '#202020'}}>
                                    {balance === null ? '-' : formatMoney(balance, currency)}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 2.5,
                            borderRadius: '22px',
                            bgcolor: '#FFFFFF',
                            border: '1px solid rgba(139, 31, 158, 0.1)',
                            boxShadow: '0 18px 42px rgba(20, 30, 55, 0.08)',
                        }}
                    >
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5, mb: 2}}>
                            <Avatar
                                sx={{
                                    width: 46,
                                    height: 46,
                                    bgcolor: 'rgba(193, 59, 219, 0.1)',
                                    color: '#8B1F9E',
                                }}
                            >
                                <ConfirmationNumberRoundedIcon/>
                            </Avatar>

                            <Box>
                                <Typography sx={{fontSize: 18, fontWeight: 900, color: '#202020'}}>
                                    {formatMessage({
                                        id: 'parkingPurchase.summaryTitle',
                                        defaultMessage: 'Podsumowanie',
                                    })}
                                </Typography>

                                <Typography sx={{fontSize: 13, color: '#777777'}}>
                                    {formatMessage({
                                        id: 'parkingPurchase.summaryDescription',
                                        defaultMessage: 'Cena zostanie potwierdzona przez backend.',
                                    })}
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{mb: 2}}/>

                        <Stack spacing={1.6}>
                            <Box sx={{display: 'flex', justifyContent: 'space-between', gap: 2}}>
                                <Typography sx={{fontSize: 14, color: '#777777'}}>
                                    {formatMessage({
                                        id: 'parkingPurchase.summaryMode',
                                        defaultMessage: 'Tryb',
                                    })}
                                </Typography>

                                <Typography sx={{fontSize: 14, fontWeight: 800, textAlign: 'right'}}>
                                    {mode === 'RESERVATION'
                                        ? formatMessage({
                                            id: 'parkingPurchase.modeReservation',
                                            defaultMessage: 'Zarezerwuj',
                                        })
                                        : formatMessage({
                                            id: 'parkingPurchase.modePurchase',
                                            defaultMessage: 'Kup od teraz',
                                        })}
                                </Typography>
                            </Box>

                            <Box sx={{display: 'flex', justifyContent: 'space-between', gap: 2}}>
                                <Typography sx={{fontSize: 14, color: '#777777'}}>
                                    {formatMessage({
                                        id: 'parkingPurchase.summaryVehicle',
                                        defaultMessage: 'Auto',
                                    })}
                                </Typography>

                                <Typography sx={{fontSize: 14, fontWeight: 800, textAlign: 'right'}}>
                                    {selectedVehicle?.licensePlate ?? '-'}
                                </Typography>
                            </Box>

                            <Box sx={{display: 'flex', justifyContent: 'space-between', gap: 2}}>
                                <Typography sx={{fontSize: 14, color: '#777777'}}>
                                    {formatMessage({
                                        id: 'parkingPurchase.summaryStart',
                                        defaultMessage: 'Od',
                                    })}
                                </Typography>

                                <Typography sx={{fontSize: 14, fontWeight: 800, textAlign: 'right'}}>
                                    {mode === 'PURCHASE'
                                        ? formatMessage({
                                            id: 'parkingPurchase.now',
                                            defaultMessage: 'Teraz',
                                        })
                                        : reservationStartDateTime
                                            ? formatDateTime(reservationStartDateTime)
                                            : '-'}
                                </Typography>
                            </Box>

                            <Box sx={{display: 'flex', justifyContent: 'space-between', gap: 2}}>
                                <Typography sx={{fontSize: 14, color: '#777777'}}>
                                    {formatMessage({
                                        id: 'parkingPurchase.summaryEnd',
                                        defaultMessage: 'Do',
                                    })}
                                </Typography>

                                <Typography sx={{fontSize: 14, fontWeight: 800, textAlign: 'right'}}>
                                    {parkingEndDateTime ? formatDateTime(parkingEndDateTime) : '-'}
                                </Typography>
                            </Box>

                            <Box sx={{display: 'flex', justifyContent: 'space-between', gap: 2}}>
                                <Typography sx={{fontSize: 14, color: '#777777'}}>
                                    {formatMessage({
                                        id: 'parkingPurchase.summaryPrice',
                                        defaultMessage: 'Do zapłaty',
                                    })}
                                </Typography>

                                <Typography sx={{fontSize: 18, fontWeight: 900, color: '#202020'}}>
                                    {isQuoteLoading ? (
                                        <CircularProgress size={18}/>
                                    ) : quote ? (
                                        formatMoney(quote.price, quote.currency ?? currency)
                                    ) : (
                                        '-'
                                    )}
                                </Typography>
                            </Box>

                            <Box sx={{display: 'flex', justifyContent: 'space-between', gap: 2}}>
                                <Typography sx={{fontSize: 14, color: '#777777'}}>
                                    {formatMessage({
                                        id: 'parkingPurchase.summaryBalanceAfter',
                                        defaultMessage: 'Saldo po zakupie',
                                    })}
                                </Typography>

                                <Typography sx={{fontSize: 14, fontWeight: 800}}>
                                    {quote ? formatMoney(quote.balanceAfter, quote.currency ?? currency) : '-'}
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Stack>
            </Box>
        </Box>
    );
};

export default ParkingPurchasePage;