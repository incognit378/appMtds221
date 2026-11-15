<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Producto;
use App\Models\Solicitud;
use App\Models\User;

class CatalogoController extends Controller
{
    // US-04 y US-05: Listar y buscar productos
    public function index(Request $request)
    {
        $query = Producto::query();

        if ($request->filled('buscar')) {
            $termino = $request->buscar;
            $query->where(function ($q) use ($termino) {
                $q->where('nombre', 'LIKE', "%{$termino}%")
                  ->orWhere('categoria', 'LIKE', "%{$termino}%");
            });
        }

        return response()->json($query->get(), 200);
    }

    // US-06: Ver ficha técnica de un producto
    public function show($id)
    {
        $producto = Producto::find($id);

        if (!$producto) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }

        return response()->json($producto, 200);
    }

    // US-06: Guardar solicitud/pedido del carrito
    public function crearSolicitud(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'total' => 'required|numeric|min:0',
        ]);

        $solicitud = Solicitud::create([
            'user_id' => $request->user()->id,
            'items'   => $request->items,
            'total'   => $request->total,
            'estado'  => 'Pendiente',
        ]);

        return response()->json([
            'message'   => 'Solicitud registrada exitosamente',
            'solicitud' => $solicitud
        ], 201);
    }

    // Listar historial de solicitudes del usuario autenticado
    public function misSolicitudes(Request $request)
    {
        $solicitudes = Solicitud::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($sol) {
                if (is_string($sol->items)) {
                    $sol->items = json_decode($sol->items, true) ?? [];
                }
                return $sol;
            });

        return response()->json($solicitudes, 200);
    }

    // Panel Admin: Listar todos los usuarios con sus solicitudes e ítems
    public function listarClientes()
    {
        $clientes = User::with(['solicitudes' => function ($q) {
                $q->orderBy('created_at', 'desc');
            }])
            ->get()
            ->map(function ($user) {
                $user->solicitudes->transform(function ($sol) {
                    if (is_string($sol->items)) {
                        $sol->items = json_decode($sol->items, true) ?? [];
                    }
                    return $sol;
                });
                return $user;
            });

        return response()->json($clientes, 200);
    }

    // Cancelar solicitud propia (solo si sigue en Pendiente)
    public function cancelarSolicitud(Request $request, $id)
    {
        $solicitud = Solicitud::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$solicitud) {
            return response()->json(['message' => 'Solicitud no encontrada.'], 404);
        }

        if ($solicitud->estado !== 'Pendiente') {
            return response()->json([
                'message' => 'Solo se pueden cancelar solicitudes en estado Pendiente.'
            ], 422);
        }

        $solicitud->delete();

        return response()->json([
            'message' => 'Solicitud cancelada correctamente.'
        ], 200);
    }

    // Panel Admin: Aprobar o Rechazar solicitud
    public function cambiarEstado(Request $request, $id)
    {
        $request->validate([
            'estado' => 'required|in:Pendiente,Aprobada,Rechazada'
        ]);

        $solicitud = Solicitud::find($id);

        if (!$solicitud) {
            return response()->json(['message' => 'Solicitud no encontrada.'], 404);
        }

        $solicitud->estado = $request->estado;
        $solicitud->save();

        return response()->json([
            'message'   => 'Estado actualizado a ' . $solicitud->estado,
            'solicitud' => $solicitud
        ], 200);
    }
}