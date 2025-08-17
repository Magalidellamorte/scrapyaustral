<?php

namespace App\Http\Controllers;

use App\Models\SubZone;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubzoneController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([]);
        $per_page = $validated['per_page'] ?? 10;

        $user = auth()->user();
        $subZones = SubZone::whereHas('zone', function ($query) use ($user) {
            $query->where('localidad_id', $user->localidad_id);
        })->paginate($per_page);

        return response()->json($subZones);
    }

    public function schedules(SubZone $subZone, Request $request): JsonResponse
    {
        $this->authorize('view', $subZone);

        $validated = $request->validate([]);
        $per_page = $validated['per_page'] ?? 10;

        $schedules = $subZone->schedules()
            ->paginate($per_page);

        return response()->json($schedules);
    }

    public function polygon(SubZone $subZone): JsonResponse
    {
        $this->authorize('view', $subZone);

        $polygon = $subZone->polygon()->with('polygonPoints')->first();

        return response()->json($polygon);
    }
}
