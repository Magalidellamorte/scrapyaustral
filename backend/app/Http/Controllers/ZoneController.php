<?php

namespace App\Http\Controllers;

use App\Models\Polygon;
use App\Models\Zone;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ZoneController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([]);
        $per_page = $validated['per_page'] ?? 10;

        $user = auth()->user();
        $zones = Zone::where('localidad_id', $user->localidad_id)
            ->paginate($per_page);

        return response()->json($zones);
    }

    public function subzones(Zone $zone, Request $request): JsonResponse
    {
        $this->authorize('view', $zone);

        $validated = $request->validate([]);
        $per_page = $validated['per_page'] ?? 10;

        $subZones = $zone->subZones()
            ->paginate($per_page);

        return response()->json($subZones);
    }

    public function schedules(Zone $zone, Request $request): JsonResponse
    {
        $this->authorize('view', $zone);

        $validated = $request->validate([]);
        $per_page = $validated['per_page'] ?? 10;

        $schedules = $zone->schedules()
            ->paginate($per_page);

        return response()->json($schedules);
    }

    public function polygon(Zone $zone): JsonResponse
    {
        $this->authorize('view', $zone);

        $polygon = $zone->polygon()->with('polygonPoints')->first();

        return response()->json($polygon);
    }

    public function show(Zone $zone): JsonResponse
    {
        $this->authorize('view', $zone);
        $zone->load(['polygon.polygonPoints']);

        return response()->json($zone);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'polygon.points' => 'required|array|min:3',
            'polygon.points.*.latitude' => 'required|numeric',
            'polygon.points.*.longitude' => 'required|numeric',
            'polygon.points.*.order' => 'required|numeric|min:0',
        ]);

        // PolygonPoints order validation.
        $orders = array_filter(array_column($validated['polygon']['points'], 'order'));
        if (count($orders) > 0) {
            $duplicates = array_diff_key($orders, array_unique($orders));
            if (!empty($duplicates)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Hay puntos con el mismo valor de "order". Deben ser únicos.',
                ], 400);
            }
        }

        DB::beginTransaction();
        try {
            // Zone creation.
            $user = auth()->user();
            $zone = Zone::create([
                'name' => $validated['name'],
                'localidad_id' => $user->localidad_id,
            ]);

            // Zone's Polygon creation.
            $polygon = new Polygon();
            $zone->polygon()->save($polygon);
            foreach ($validated['polygon']['points'] as $pointData) {
                $polygon->polygonPoints()->create([
                    'latitude' => $pointData['latitude'],
                    'longitude' => $pointData['longitude'],
                    'order' => $pointData['order'],
                ]);
            }
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Zona creada correctamente.',
                'data' => $zone->load('polygon.polygonPoints'),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al crear la Zona.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, Zone $zone): JsonResponse
    {
        $this->authorize('update', $zone);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);
        $zone->update([
            'name' => $validated['name'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Zona actualizada correctamente.',
            'data' => $zone,
        ]);
    }

    public function destroy(Zone $zone): JsonResponse
    {
        $this->authorize('delete', $zone);

        DB::transaction(function () use ($zone) {
            // Delete Zone Schedules.
            $zone->schedules()->delete();

            // Delete Zone's Polygon (& Points).
            if ($zone->polygon) {
                $zone->polygon->polygonPoints()->delete();
                $zone->polygon->delete();
            }

            // Delete related SubZones.
            foreach ($zone->subZones as $subZone) {
                // Delete SubZone Schedules.
                $subZone->schedules()->delete();

                // Delete SubZone's Polygon (& Points).
                if ($subZone->polygon) {
                    $subZone->polygon->polygonPoints()->delete();
                    $subZone->polygon->delete();
                }

                // Delete SubZone.
                $subZone->delete();
            }

            // Delete Zone.
            $zone->delete();
        });

        return response()->json([
            'success' => true,
            'message' => 'La Zona y todos los elementos relacionados fueron eliminados correctamente.',
        ]);
    }
}
