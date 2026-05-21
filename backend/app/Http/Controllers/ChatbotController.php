<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatbotController extends Controller
{
    public function history(Request $request)
    {
        return $request->user()
            ->chatMessages()
            ->latest()
            ->limit(30)
            ->get()
            ->reverse()
            ->values();
    }

    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
            'lang' => 'nullable|string'
        ]);

        $user = $request->user()->load(['profile', 'skills', 'quizResults', 'cvAnalyses']);
        $lang = $request->input('lang', 'fr');
        $langMap = ['ar' => 'Arabic', 'fr' => 'French', 'en' => 'English'];
        $targetLang = $langMap[$lang] ?? 'French';
        $latestQuiz = $user->quizResults->sortByDesc('created_at')->first();
        $latestAts = $user->cvAnalyses->sortByDesc('created_at')->first();
        $skills = $user->skills->pluck('name')->join(', ') ?: 'Not provided yet';

        ChatMessage::create([
            'user_id' => $user->id,
            'role' => 'user',
            'message' => $request->message
        ]);

        $apiKey = env('GEMINI_API_KEY');
        if (!$apiKey) {
            return response()->json(['message' => 'Gemini API key is not configured in backend .env.'], 500);
        }

        try {
            $recentMessages = $user->chatMessages()
                ->latest()
                ->limit(8)
                ->get()
                ->reverse()
                ->map(fn ($message) => strtoupper($message->role) . ': ' . $message->message)
                ->join("\n");

            $prompt = "You are an expert career mentor. Respond in {$targetLang} with personalized, practical advice.\n\n"
                . "User profile:\n"
                . "- Name: {$user->name}\n"
                . "- RIASEC profile: " . ($latestQuiz?->personality_type ?? 'Not assessed yet') . "\n"
                . "- Skills: {$skills}\n"
                . "- Latest ATS score: " . ($latestAts?->score ?? 'Not analyzed yet') . "\n"
                . "- Summary: " . ($user->profile?->summary ?? 'Not provided yet') . "\n\n"
                . "Recent conversation:\n{$recentMessages}\n\n"
                . "User says: {$request->message}";

            $response = Http::post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}", [
                'contents' => [
                    ['parts' => [['text' => $prompt]]]
                ]
            ]);

            if (!$response->successful()) {
                throw new \Exception("Gemini API Error: " . $response->body());
            }

            $json = $response->json();
            $aiResponse = $json['candidates'][0]['content']['parts'][0]['text'] ?? 'Sorry, I could not generate a response. Please try again.';
        } catch (\Exception $e) {
            return response()->json(['message' => "AI Connection Error: " . $e->getMessage()], 500);
        }

        $assistantMsg = ChatMessage::create([
            'user_id' => $user->id,
            'role' => 'assistant',
            'message' => $aiResponse
        ]);

        return response()->json($assistantMsg);
    }
}
