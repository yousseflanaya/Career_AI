<?php

namespace App\Http\Controllers;

use App\Models\CoverLetter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class CoverLetterController extends Controller
{
    public function generate(Request $request)
    {
        $request->validate([
            'job_description' => 'required|string',
        ]);

        $apiKey = env('GEMINI_API_KEY');
        if (!$apiKey) {
            return response()->json(['message' => 'Gemini API key is not configured.'], 500);
        }

        $prompt = "Write a highly professional, modern, and engaging cover letter targeted precisely for the following job description. Keep it concise and emphasize adaptability. Do not include random bracket placeholders for names (just write the body text seamlessly). Job Description: " . $request->job_description;

        try {
            $response = Http::post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}", [
                'contents' => [['parts' => [['text' => $prompt]]]]
            ]);

            if (!$response->successful()) {
                throw new \Exception("Gemini API Error: " . $response->body());
            }

            $json = $response->json();
            $generatedContent = $json['candidates'][0]['content']['parts'][0]['text'] ?? "Failed to generate Cover Letter content.";
        } catch (\Exception $e) {
             return response()->json(['message' => 'AI generation process failed: ' . $e->getMessage()], 500);
        }

        $coverLetter = CoverLetter::create([
            'user_id' => $request->user()->id,
            'job_offer_id' => $request->job_offer_id ?? null,
            'content' => $generatedContent
        ]);

        return response()->json($coverLetter);
    }
}
