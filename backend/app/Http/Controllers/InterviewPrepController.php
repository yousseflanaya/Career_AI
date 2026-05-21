<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class InterviewPrepController extends Controller
{
    public function generate(Request $request)
    {
        $request->validate([
            'job_title' => 'required|string',
            'level' => 'required|string', // e.g., Junior, Senior
        ]);

        $apiKey = env('GEMINI_API_KEY');
        if (!$apiKey) {
            return response()->json(['message' => 'Gemini API key missing'], 500);
        }

        $lang = $request->input('lang', 'en');
        $langMap = ['ar' => 'Arabic', 'fr' => 'French', 'en' => 'English'];
        $targetLang = $langMap[$lang] ?? 'English';

        $prompt = "Generate 5 tailored interview questions for a {$request->level} {$request->job_title} position. 
        Respond in {$targetLang}.
        For each question, provide:
        1. Why the interviewer is asking this.
        2. A sample 'Star' answer outline.
        3. Key keywords to include.
        
        Respond ONLY with a JSON array of objects:
        [
          {
            \"question\": \"...\",
            \"rationale\": \"...\",
            \"sample_outline\": \"...\",
            \"keywords\": [\"...\", \"...\"]
          }
        ]";

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
            return response()->json(['message' => 'Interview Prep Generation Failed: ' . $e->getMessage()], 500);
        }
    }
}
