<?php

declare(strict_types=1);

namespace App\Http\Controllers\Settings;

use App\Constants\MediaDirectory;
use App\Dtos\MediaDto;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Services\MediaService;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

final class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request, MediaService $mediaService): RedirectResponse
    {
        $user = $request->user()->fresh();
        $user->fill($request->safe()->except(['avatar']));

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        if ($file = $request->file('avatar')) {
            $mediaDto = new MediaDto(file: $file, storageDirectory: MediaDirectory::AVATARS);
            $mediaService->storeFile($mediaDto);

            // Delete current pfp.
            if ($user->avatar) {
                Storage::delete($user->avatar);
            }

            $user->avatar = $mediaDto->getPath();
        }

        $user->save();

        return to_route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        if ($user->avatar) {
            Storage::delete($user->avatar);
        }

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
