<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $authUser = auth()->user();
        if($authUser){
            if($authUser->type === 'industria') {
                return response()->json(Category::whereIn('id', [1,4])->get());
            }
        }

        return response()->json(Category::all());
    }
}
