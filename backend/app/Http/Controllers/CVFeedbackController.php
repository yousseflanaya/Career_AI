<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class CVFeedbackController extends Controller
{
    public function analyze(Request $request)
    {
        $request->validate([
            'cv_data' => 'required|array',
        ]);

        $apiKey = env('GEMINI_API_KEY');
        if (!$apiKey) {
            return response()->json(['message' => 'Gemini API key missing'], 500);
        }

        $lang = $request->input('lang', 'en');
        $langMap = ['ar' => 'Arabic', 'fr' => 'French', 'en' => 'English'];
        $targetLang = $langMap[$lang] ?? 'English';

        $cvDataStr = json_encode($request->cv_data);
        $prompt = "Analyze this CV data: $cvDataStr. 
        Respond in {$targetLang}.
        Provide constructive feedback to improve it for modern ATS systems and recruiters.
        Focus on:
        1. Action verbs usage.
        2. Quantifiable results.
        3. Skills gap or missing sections.
        4. Summary strength.
        
        Respond ONLY with a JSON object:
        {
          \"overall_score\": 85,
          \"strengths\": [\"...\", \"...\"],
          \"improvements\": [\"...\", \"...\"],
          \"ats_suggestions\": \"...\"
        }";

        try {
            $response = Http::post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}", [
                'contents' => [['parts' => [['text' => $prompt]]]]
            ]);

            if (!$response->successful()) {
                throw new \Exception("Gemini API Error: " . $response->body());
            }

            $text = $response->json('candidates.0.content.parts.0.text');
            $text = str_replace(['```json', '```'], '', $text);
            $parsed = json_decode(trim($text), true);

            return response()->json($parsed);
        } catch (\Exception $e) {
            return response()->json(['message' => 'CV Analysis Failed: ' . $e->getMessage()], 500);
        }
    }
}
