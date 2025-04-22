
// Follow these steps to deploy this Edge Function to your Supabase project:
// 1. Install Supabase CLI: npm install -g supabase
// 2. Login to Supabase: supabase login
// 3. Link to your project: supabase link --project-ref <project-ref>
// 4. Deploy function: supabase functions deploy analyze-skin --project-ref <project-ref>
// 5. Set OpenAI API key: supabase secrets set OPENAI_API_KEY=<your-api-key> --project-ref <project-ref>

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.2.1';

interface SkinFormData {
  concernDescription?: string;
  duration?: string;
  recentChanges?: string;
  isPainful?: string;
  age?: string;
  skinType?: string;
  hasCondition?: string;
  additionalInfo?: string;
}

// Get environment variables
const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// Setup OpenAI configuration
const configuration = new Configuration({
  apiKey: openaiApiKey,
});

const openai = new OpenAIApi(configuration);

// Initialize Supabase client with service role key
const supabase = createClient(
  supabaseUrl || '',
  supabaseServiceKey || ''
);

serve(async (req) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Content-Type': 'application/json',
  };

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers });
  }

  try {
    // Parse request body
    const { imageUrl, formData } = await req.json() as { 
      imageUrl: string, 
      formData: SkinFormData 
    };

    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: 'Image URL is required' }),
        { status: 400, headers }
      );
    }

    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers }
      );
    }

    // Construct a detailed prompt based on the form data
    const systemPrompt = `You are a dermatology AI assistant. Analyze the skin image and form data to provide an assessment. 
    Focus on identifying potential skin conditions, estimating skin age, determining skin type, and providing personalized recommendations.
    Your response should be detailed and in JSON format with the following structure:
    {
      "skinAge": number,
      "skinType": string,
      "hydrationLevel": string,
      "skinTone": string,
      "uvSensitivity": string,
      "poreSize": string,
      "conditions": [
        {
          "name": string,
          "probability": number (0-1),
          "description": string,
          "riskLevel": "low" | "medium" | "high",
          "symptoms": string[],
          "recommendations": string[]
        }
      ],
      "skinInsights": {
        "strengths": string[],
        "concerns": string[],
        "recommendations": string[]
      },
      "recommendedProducts": [
        {
          "id": string,
          "name": string,
          "description": string,
          "imageUrl": string,
          "price": string,
          "link": string
        }
      ]
    }`;

    const userPrompt = `Please analyze this skin image. The person is ${formData.age || 'unknown'} years old with 
    ${formData.skinType || 'unknown'} skin type. They described their concern as: "${formData.concernDescription || 'N/A'}" 
    which they've had for ${formData.duration || 'an unknown period'}. 
    ${formData.recentChanges === 'yes' ? 'They have noticed recent changes.' : 'They have not noticed recent changes.'} 
    ${formData.isPainful === 'yes' ? 'The area is painful or irritating.' : 'The area is not painful or irritating.'} 
    ${formData.hasCondition === 'yes' ? 'They reported having known skin conditions.' : 'They reported no known skin conditions.'} 
    Additional information: "${formData.additionalInfo || 'N/A'}"
    
    Image URL: ${imageUrl}
    
    Provide a detailed JSON analysis.`;

    // Call OpenAI vision API
    const response = await openai.createChatCompletion({
      model: "gpt-4-vision-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { 
          role: "user", 
          content: [
            { type: "text", text: userPrompt },
            { type: "image_url", image_url: { url: imageUrl } }
          ]
        }
      ],
      max_tokens: 2048
    });

    // Parse the response to get the JSON data
    const responseText = response.data.choices[0]?.message?.content || '';
    let analysisResult;
    
    try {
      // Extract the JSON part from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No valid JSON found in the response");
      }
    } catch (error) {
      console.error("Error parsing OpenAI response:", error);
      
      // Fallback to a simpler response structure
      analysisResult = {
        skinAge: parseInt(formData.age) || 30,
        skinType: formData.skinType || "Normal",
        hydrationLevel: "Moderate",
        conditions: [
          {
            name: "Unable to determine",
            probability: 0,
            description: "The AI was unable to determine specific conditions from this image.",
            riskLevel: "low",
            symptoms: ["N/A"],
            recommendations: ["Consult a dermatologist for in-person evaluation"]
          }
        ],
        skinInsights: {
          strengths: ["Unable to determine specific strengths"],
          concerns: ["Image analysis unsuccessful"],
          recommendations: ["Please consult a dermatologist for professional advice"]
        },
        recommendedProducts: []
      };
    }

    // Generate an ID for the analysis
    const analysisId = crypto.randomUUID();
    analysisResult.id = analysisId;

    return new Response(
      JSON.stringify(analysisResult),
      { headers }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Error processing request', 
        message: error.message
      }),
      { status: 500, headers }
    );
  }
});
