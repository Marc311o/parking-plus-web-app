import {useEffect, useMemo, useState} from 'react';
import {Alert, Box, Button, CircularProgress, Paper, Stack, Typography} from '@mui/material';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
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

import {useAuthStore} from '@store/useAuthStore';

import {
    addHours,
    buildDateTime,
    getCurrentDateTimeValue,
    MOCK_WALLET_CURRENCY,
    ParkingPurchaseEmptyState,
    ParkingPurchaseHero,
    ParkingPurchaseModeCard,
    ParkingPurchaseResultCard,
    ParkingPurchaseSummary,
    ParkingPurchaseTimeCard,
    ParkingPurchaseVehicleCard,
    toDateInputValue,
    toTimeInputValue,
} from '@components/parkingPurchase';

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

    const balance = useAuthStore((state) => state.user?.balance ?? null);
    const userId = useAuthStore((state) => state.user?.id ?? null);

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
            if (userId == null) {
                setIsLoading(false);
                return;
            }

            const clientId = Number(userId);

            if (Number.isNaN(clientId)) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const vehiclesResult = await getClientVehicles(clientId);

                if (!isMounted) {
                    return;
                }

                setVehicles(vehiclesResult);

                const firstVehicleWithId = vehiclesResult.find((vehicle) => vehicle.id !== undefined);

                if (firstVehicleWithId?.id) {
                    setSelectedVehicleId(String(firstVehicleWithId.id));
                }
            } catch (err) {
                console.error(err);

                if (isMounted) {
                    setError(formatMessage({id: 'parkingPurchase.errors.initialData'}));
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
    }, [formatMessage, userId]);

    useEffect(() => {
        let isMounted = true;

        const fetchQuote = async () => {
            if (purchaseResult || !isParkingTimeValid) {
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
                    setQuoteError(formatMessage({id: 'parkingPurchase.errors.quote'}));
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
        purchaseResult,
        formatMessage,
    ]);

    const clearPurchaseState = () => {
        setPurchaseResult(null);
        setPurchaseError(null);
    };

    const handleAddVehicle = () => {
        // TODO: podpiąć okienko dodawania auta.
    };

    const handleBackToForm = () => {
        setPurchaseResult(null);
        setPurchaseError(null);
        setQuoteError(null);
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
            useAuthStore.getState().setBalance(result.balanceAfter);
            setCurrency(result.currency ?? MOCK_WALLET_CURRENCY);
        } catch (err) {
            console.error(err);
            setPurchaseError(formatMessage({id: 'parkingPurchase.errors.purchase'}));
        } finally {
            setIsPurchasing(false);
        }
    };

    if (purchaseResult) {
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
                <Box
                    sx={{
                        p: {
                            xs: 2,
                            md: 3,
                        },
                    }}
                >
                    <Stack
                        spacing={2.5}
                        sx={{
                            maxWidth: 760,
                            mx: 'auto',
                        }}
                    >
                        <ParkingPurchaseResultCard
                            purchaseResult={purchaseResult}
                            currency={currency}
                        />

                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleBackToForm}
                            sx={{
                                alignSelf: {
                                    xs: 'stretch',
                                    sm: 'center',
                                },
                                minWidth: 240,
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
                            {formatMessage({id: 'parkingPurchase.backToFormButton'})}
                        </Button>
                    </Stack>
                </Box>
            </Box>
        );
    }

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
                    <ParkingPurchaseHero/>

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
                                    {formatMessage({id: 'parkingPurchase.loading'})}
                                </Typography>
                            </Box>
                        ) : vehicles.length === 0 ? (
                            <ParkingPurchaseEmptyState onAddVehicle={handleAddVehicle}/>
                        ) : (
                            <Stack spacing={2.5}>
                                <ParkingPurchaseModeCard
                                    mode={mode}
                                    isDisabled={isPurchasing}
                                    onModeChange={(nextMode) => {
                                        setMode(nextMode);
                                        clearPurchaseState();
                                    }}
                                />

                                <ParkingPurchaseVehicleCard
                                    vehicles={vehicles}
                                    selectedVehicle={selectedVehicle}
                                    selectedVehicleId={selectedVehicleId}
                                    isDisabled={isPurchasing}
                                    onVehicleChange={(vehicleId) => {
                                        setSelectedVehicleId(vehicleId);
                                        clearPurchaseState();
                                    }}
                                />

                                <ParkingPurchaseTimeCard
                                    mode={mode}
                                    isDisabled={isPurchasing}
                                    isParkingTimeValid={isParkingTimeValid}
                                    purchaseEndDate={purchaseEndDate}
                                    purchaseEndTime={purchaseEndTime}
                                    reservationStartDate={reservationStartDate}
                                    reservationStartTime={reservationStartTime}
                                    reservationEndDate={reservationEndDate}
                                    reservationEndTime={reservationEndTime}
                                    onPurchaseEndDateChange={(value) => {
                                        setPurchaseEndDate(value);
                                        clearPurchaseState();
                                    }}
                                    onPurchaseEndTimeChange={(value) => {
                                        setPurchaseEndTime(value);
                                        clearPurchaseState();
                                    }}
                                    onReservationStartDateChange={(value) => {
                                        setReservationStartDate(value);
                                        clearPurchaseState();
                                    }}
                                    onReservationStartTimeChange={(value) => {
                                        setReservationStartTime(value);
                                        clearPurchaseState();
                                    }}
                                    onReservationEndDateChange={(value) => {
                                        setReservationEndDate(value);
                                        clearPurchaseState();
                                    }}
                                    onReservationEndTimeChange={(value) => {
                                        setReservationEndTime(value);
                                        clearPurchaseState();
                                    }}
                                />

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
                                        ? formatMessage({id: 'parkingPurchase.processingButton'})
                                        : mode === 'RESERVATION'
                                            ? formatMessage({id: 'parkingPurchase.reserveButton'})
                                            : formatMessage({id: 'parkingPurchase.buyButton'})}
                                </Button>
                            </Stack>
                        )}
                    </Box>
                </Paper>

                <Box
                    sx={{
                        position: {
                            xs: 'static',
                            lg: 'sticky',
                        },
                        top: {
                            lg: 0,
                        },
                    }}
                >
                    <ParkingPurchaseSummary
                        mode={mode}
                        selectedVehicle={selectedVehicle}
                        balance={balance}
                        currency={currency}
                        quote={quote}
                        isQuoteLoading={isQuoteLoading}
                        reservationStartDateTime={reservationStartDateTime}
                        parkingEndDateTime={parkingEndDateTime}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default ParkingPurchasePage;