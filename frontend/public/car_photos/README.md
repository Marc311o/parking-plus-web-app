# Car Photo Naming Convention

To ensure that the automatic car photo assignment mechanism works correctly, please follow these rules:

1. **Folder Location:** `frontend/public/car_photos/`
2. **File Format:** `.png` (lowercase extension)
3. **Naming Pattern:**
   - Barrier photo (entry): `car_{index}_barrier.png`
   - Parking spot photo: `car_{index}_spot.png`
4. **Index Range:** `0` to `9` (Total of 10 pairs).

### Example Files:
- `car_0_barrier.png`
- `car_0_spot.png`
- `car_1_barrier.png`
- `car_1_spot.png`
- ...
- `car_9_barrier.png`
- `car_9_spot.png`

### How it works:
The system uses the `vehicle_id % 10` to deterministically select a photo pair for each parking session. This ensures that the same vehicle in the same session will always have the same photos assigned.
