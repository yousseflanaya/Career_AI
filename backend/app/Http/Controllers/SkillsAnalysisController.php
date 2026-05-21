<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class SkillsAnalysisController extends Controller
{
    public function analyze(Request $request)
    {
        $request->validate([
            'user_skills' => 'required|array',
            'job_description' => 'required|string',
        ]);

        $apiKey = env('GEMINI_API_KEY');
        if (!$apiKey) {
            return response()->json(['message' => 'Gemini API key missing'], 500);
        }

        $lang = $request->input('lang', 'en');
        $langMap = ['ar' => 'Arabic', 'fr' => 'French', 'en' => 'English'];
        $targetLang = $langMap[$lang] ?? 'English';

        $userSkillsStr = implode(', ', $request->user_skills);
        $prompt = "Compare these user skills: [$userSkillsStr] against this job description: \"{$request->job_description}\".
        Respond in {$targetLang}.
        Identify:
        1. Matching skills.
        2. Missing critical skills.
        3. Recommended certifications or courses to bridge the gap.
        4. Match percentage.
        
        Respond ONLY with a JSON object:
        {
          \"match_percentage\": 75,
          \"matching_skills\": [\"...\", \"...\"],
          \"missing_skills\": [\"...\", \"...\"],
          \"recommendations\": [\"...\", \"...\"],
          \"verdict\": \"A short overall assessment...\"
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
            return response()->json(['message' => 'Skills Analysis Failed: ' . $e->getMessage()], 500);
        }
    }
}
