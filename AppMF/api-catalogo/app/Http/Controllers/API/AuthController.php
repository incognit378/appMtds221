<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    // US-01: Inicio de sesión
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Credenciales incorrectas. Verifique su correo y contraseña.'
            ], 401);
        }

        $token = Str::random(60);
        $user->api_token = $token;
        $user->save();

        return response()->json([
            'message' => 'Bienvenido al sistema',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ]
        ], 200);
    }

    // US-03: Solicitar código/token de recuperación
    public function solicitarRecuperacion(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'No existe ninguna cuenta asociada a este correo institucional.'
            ], 404);
        }

        $codigo = rand(100000, 999999);
        $user->remember_token = (string) $codigo;
        $user->save();

        return response()->json([
            'message' => 'Código de verificación generado y enviado al correo.',
            'codigo_demo' => $codigo
        ], 200);
    }

    // US-03: Restablecer contraseña con el código
    public function restablecerPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'codigo' => 'required',
            'password' => 'required|min:6',
        ]);

        $user = User::where('email', $request->email)
                    ->where('remember_token', $request->codigo)
                    ->first();

        if (!$user) {
            return response()->json([
                'message' => 'El código de recuperación es inválido o ha expirado.'
            ], 400);
        }

        $user->password = Hash::make($request->password);
        $user->remember_token = null;
        $user->save();

        return response()->json([
            'message' => 'Contraseña restablecida exitosamente. Ya puede iniciar sesión.'
        ], 200);
    }

    // US-07: Cerrar sesión
    public function logout(Request $request)
    {
        $user = $request->user();
        if ($user) {
            $user->api_token = null;
            $user->save();
        }

        return response()->json([
            'message' => 'Sesión cerrada correctamente'
        ], 200);
    }
}