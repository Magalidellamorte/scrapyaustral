<?php

namespace App\Http\Controllers;

use App\Models\Zone;
use App\Models\ZoneSchedule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ZoneScheduleController extends Controller
{
    public function storeZoneSchedule(Request $request, Zone $zone): JsonResponse
    {
        $this->authorize('createSchedule', $zone);
        $validated = $request->validate([
            'day_of_week' => 'required|integer|between:0,6',
            'start_time' => 'required|date_format:H:i:s',
            'end_time' => 'required|date_format:H:i:s|after:start_time',
        ]);
        $schedule = $zone->schedules()->create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Zone schedule created.',
            'data' => $schedule,
        ], 201);
    }

    public function show(ZoneSchedule $zoneSchedule): JsonResponse
    {
        $this->authorize('view', $zoneSchedule);

        return response()->json($zoneSchedule);
    }

    public function update(Request $request, ZoneSchedule $zoneSchedule): JsonResponse
    {
        $this->authorize('update', $zoneSchedule);
        $validated = $request->validate([
            'day_of_week' => 'sometimes|integer|between:0,6',
            'start_time' => 'sometimes|date_format:H:i:s',
            'end_time' => 'sometimes|date_format:H:i:s|after:start_time',
        ]);
        if (empty($validated)) {
            return response()->json(
                [
                    'success' => false,
                    'message' => 'No se enviaron campos para actualizar.'],
                400
            );
        }

        $zoneSchedule->update($validated);

        return response()->json(['success' => true,
            'message' => 'Zone schedule updated.',
            'data' => $zoneSchedule]);
    }

    public function destroy(ZoneSchedule $zoneSchedule): JsonResponse
    {
        $this->authorize('delete', $zoneSchedule);
        $zoneSchedule->delete();

        return response()->json(['success' => true, 'message' => 'Eliminado correctamente.']);
    }
}
