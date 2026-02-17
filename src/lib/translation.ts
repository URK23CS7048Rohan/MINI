// Multi-language translation service for patient communication

export const SUPPORTED_LANGUAGES = {
    en: { name: 'English', native: 'English', flag: '🇺🇸' },
    es: { name: 'Spanish', native: 'Español', flag: '🇪🇸' },
    fr: { name: 'French', native: 'Français', flag: '🇫🇷' },
    de: { name: 'German', native: 'Deutsch', flag: '🇩🇪' },
    it: { name: 'Italian', native: 'Italiano', flag: '🇮🇹' },
    pt: { name: 'Portuguese', native: 'Português', flag: '🇧🇷' },
    zh: { name: 'Chinese', native: '中文', flag: '🇨🇳' },
    ja: { name: 'Japanese', native: '日本語', flag: '🇯🇵' },
    ko: { name: 'Korean', native: '한국어', flag: '🇰🇷' },
    ar: { name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
    hi: { name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
    bn: { name: 'Bengali', native: 'বাংলা', flag: '🇧🇩' },
    ta: { name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
    te: { name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
    mr: { name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
    gu: { name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
    kn: { name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
    ml: { name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
    pa: { name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    ur: { name: 'Urdu', native: 'اردو', flag: '🇵🇰' },
    ru: { name: 'Russian', native: 'Русский', flag: '🇷🇺' },
    tr: { name: 'Turkish', native: 'Türkçe', flag: '🇹🇷' },
    vi: { name: 'Vietnamese', native: 'Tiếng Việt', flag: '🇻🇳' },
    th: { name: 'Thai', native: 'ไทย', flag: '🇹🇭' },
    id: { name: 'Indonesian', native: 'Bahasa Indonesia', flag: '🇮🇩' },
    ms: { name: 'Malay', native: 'Bahasa Melayu', flag: '🇲🇾' },
    nl: { name: 'Dutch', native: 'Nederlands', flag: '🇳🇱' },
    pl: { name: 'Polish', native: 'Polski', flag: '🇵🇱' },
    uk: { name: 'Ukrainian', native: 'Українська', flag: '🇺🇦' },
    he: { name: 'Hebrew', native: 'עברית', flag: '🇮🇱' },
    sw: { name: 'Swahili', native: 'Kiswahili', flag: '🇰🇪' },
} as const;

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

// Medical terminology translations (common terms)
const MEDICAL_TERMS: Record<string, Record<LanguageCode, string>> = {
    'diagnosis': {
        en: 'Diagnosis', es: 'Diagnóstico', fr: 'Diagnostic', de: 'Diagnose',
        hi: 'निदान', ar: 'التشخيص', zh: '诊断', ja: '診断', ko: '진단',
        bn: 'রোগ নির্ণয়', ta: 'நோய் கண்டறிதல்', te: 'రోగ నిర్ధారణ',
        it: 'Diagnosi', pt: 'Diagnóstico', ru: 'Диагноз', tr: 'Tanı',
        mr: 'निदान', gu: 'નિદાન', kn: 'ರೋಗನಿರ್ಣಯ', ml: 'രോഗനിർണയം',
        pa: 'ਤਸ਼ਖ਼ੀਸ', ur: 'تشخیص', vi: 'Chẩn đoán', th: 'การวินิจฉัย',
        id: 'Diagnosis', ms: 'Diagnosis', nl: 'Diagnose', pl: 'Diagnoza',
        uk: 'Діагноз', he: 'אבחון', sw: 'Uchunguzi',
    },
    'treatment': {
        en: 'Treatment', es: 'Tratamiento', fr: 'Traitement', de: 'Behandlung',
        hi: 'उपचार', ar: 'العلاج', zh: '治疗', ja: '治療', ko: '치료',
        bn: 'চিকিৎসা', ta: 'சிகிச்சை', te: 'చికిత్స',
        it: 'Trattamento', pt: 'Tratamento', ru: 'Лечение', tr: 'Tedavi',
        mr: 'उपचार', gu: 'સારવાર', kn: 'ಚಿಕಿತ್ಸೆ', ml: 'ചികിത്സ',
        pa: 'ਇਲਾਜ', ur: 'علاج', vi: 'Điều trị', th: 'การรักษา',
        id: 'Pengobatan', ms: 'Rawatan', nl: 'Behandeling', pl: 'Leczenie',
        uk: 'Лікування', he: 'טיפול', sw: 'Matibabu',
    },
    'medication': {
        en: 'Medication', es: 'Medicamento', fr: 'Médicament', de: 'Medikament',
        hi: 'दवा', ar: 'دواء', zh: '药物', ja: '薬', ko: '약',
        bn: 'ওষুধ', ta: 'மருந்து', te: 'మందు',
        it: 'Farmaco', pt: 'Medicamento', ru: 'Лекарство', tr: 'İlaç',
        mr: 'औषध', gu: 'દવા', kn: 'ಔಷಧಿ', ml: 'മരുന്ന്',
        pa: 'ਦਵਾਈ', ur: 'دوا', vi: 'Thuốc', th: 'ยา',
        id: 'Obat', ms: 'Ubat', nl: 'Medicijn', pl: 'Lek',
        uk: 'Ліки', he: 'תרופה', sw: 'Dawa',
    },
    'follow_up': {
        en: 'Follow-up', es: 'Seguimiento', fr: 'Suivi', de: 'Nachsorge',
        hi: 'अनुवर्ती', ar: 'المتابعة', zh: '随访', ja: 'フォローアップ', ko: '후속 조치',
        bn: 'ফলো-আপ', ta: 'தொடர்நடவடிக்கை', te: 'ఫాలో-అప్',
        it: 'Follow-up', pt: 'Acompanhamento', ru: 'Наблюдение', tr: 'Takip',
        mr: 'पाठपुरावा', gu: 'ફોલો-અપ', kn: 'ಅನುಸರಣೆ', ml: 'ഫോളോ-അപ്പ്',
        pa: 'ਫਾਲੋ-ਅੱਪ', ur: 'فالو اپ', vi: 'Tái khám', th: 'การติดตามผล',
        id: 'Tindak lanjut', ms: 'Susulan', nl: 'Opvolging', pl: 'Wizyta kontrolna',
        uk: 'Спостереження', he: 'מעקב', sw: 'Ufuatiliaji',
    },
};

// Patient-friendly explanations generator
export interface PatientExplanation {
    condition: string;
    simpleExplanation: string;
    whatItMeans: string;
    whatToDo: string[];
    warning: string[];
    followUp: string;
    language: LanguageCode;
}

// Generate patient-friendly explanation in their language
export async function generatePatientExplanation(
    condition: string,
    severity: string,
    recommendations: string[],
    targetLanguage: LanguageCode = 'en'
): Promise<PatientExplanation> {
    // Simulate API call for translation
    await new Promise(resolve => setTimeout(resolve, 300));

    // Generate base explanation
    const baseExplanation = getConditionExplanation(condition, severity);

    // Translate to target language (simulated)
    const translated = await translateContent(baseExplanation, targetLanguage);

    return {
        ...translated,
        language: targetLanguage,
    };
}

// Get simple explanation for condition
function getConditionExplanation(condition: string, severity: string): Omit<PatientExplanation, 'language'> {
    const conditionLower = condition.toLowerCase();

    const explanations: Record<string, Omit<PatientExplanation, 'language'>> = {
        'melanoma': {
            condition: 'Melanoma',
            simpleExplanation: 'A type of skin cancer that develops from the cells that give your skin its color.',
            whatItMeans: 'This needs immediate attention. Early detection is very good for treatment success.',
            whatToDo: [
                'Schedule an appointment with a dermatologist immediately',
                'Do not scratch or irritate the area',
                'Protect the area from sun exposure',
                'Take photos to track any changes',
            ],
            warning: [
                'If the area changes rapidly in size or color, seek emergency care',
                'Watch for any bleeding or crusting',
            ],
            followUp: 'You will need to see a specialist within 1-2 days for a biopsy.',
        },
        'pneumonia': {
            condition: 'Pneumonia',
            simpleExplanation: 'An infection in your lungs that causes inflammation and fluid buildup.',
            whatItMeans: 'Your lungs are fighting an infection. With proper treatment, most people recover well.',
            whatToDo: [
                'Take all prescribed medications as directed',
                'Get plenty of rest',
                'Drink lots of fluids to stay hydrated',
                'Use a humidifier to help with breathing',
                'Avoid smoking and smoke exposure',
            ],
            warning: [
                'If you have difficulty breathing, go to emergency room',
                'If fever exceeds 103°F (39.4°C), seek immediate care',
                'Watch for blue lips or fingernails',
            ],
            followUp: 'You should have a follow-up chest X-ray in 6-8 weeks.',
        },
        'fracture': {
            condition: 'Bone Fracture',
            simpleExplanation: 'A break in your bone that needs time and proper care to heal.',
            whatItMeans: 'Your bone has a break that will heal with proper immobilization and rest.',
            whatToDo: [
                'Keep the affected area immobilized',
                'Take pain medication as prescribed',
                'Keep the injury elevated when possible',
                'Follow up with orthopedic specialist',
                'Do not put weight on the affected area unless cleared',
            ],
            warning: [
                'If you experience numbness or tingling, contact your doctor',
                'Watch for increased swelling or color changes',
                'If pain suddenly increases, seek care immediately',
            ],
            followUp: 'You will need follow-up X-rays in 2-4 weeks to check healing.',
        },
        'cavity': {
            condition: 'Dental Cavity',
            simpleExplanation: 'A hole in your tooth caused by decay that needs to be filled.',
            whatItMeans: 'Bacteria have caused some damage to your tooth, but it can be easily treated.',
            whatToDo: [
                'Schedule a dental appointment for filling',
                'Avoid very hot or cold foods on that side',
                'Maintain good oral hygiene',
                'Reduce sugar intake',
            ],
            warning: [
                'If you experience severe pain, see your dentist sooner',
                'Watch for swelling in the gum area',
            ],
            followUp: 'Schedule a dental filling within 1-2 weeks.',
        },
    };

    return explanations[conditionLower] || {
        condition: condition,
        simpleExplanation: `We detected ${condition} which requires medical attention.`,
        whatItMeans: `Your doctor has identified a condition that needs to be addressed. ${severity === 'critical' || severity === 'high' ? 'This is urgent and requires prompt attention.' : 'With proper care, this can be managed effectively.'}`,
        whatToDo: [
            'Follow your doctor\'s recommendations carefully',
            'Take all prescribed medications',
            'Attend all scheduled follow-up appointments',
            'Monitor for any changes and report them',
        ],
        warning: [
            'Contact your doctor if symptoms worsen',
            'Seek emergency care if you experience severe symptoms',
        ],
        followUp: 'Your doctor will schedule appropriate follow-up care.',
    };
}

// Translate content to target language (simulated - in production, use real translation API)
async function translateContent(
    content: Omit<PatientExplanation, 'language'>,
    targetLanguage: LanguageCode
): Promise<Omit<PatientExplanation, 'language'>> {
    // In production, this would call GPT-4 or Google Translate API
    // For demo, we return as-is with language indicator

    if (targetLanguage === 'en') {
        return content;
    }

    // Simulated translation prefix for demo
    const langInfo = SUPPORTED_LANGUAGES[targetLanguage];

    // In real implementation, each field would be translated
    // For demo, we add a note about translation
    return {
        ...content,
        simpleExplanation: `[${langInfo.native}] ${content.simpleExplanation}`,
        whatItMeans: `[${langInfo.native}] ${content.whatItMeans}`,
        followUp: `[${langInfo.native}] ${content.followUp}`,
    };
}

// Generate patient summary in their language
export async function generatePatientSummary(
    consultation: {
        diagnosis: string;
        treatment: string[];
        medications: { name: string; dosage: string; frequency: string }[];
        followUp: string;
        warnings: string[];
    },
    patientName: string,
    patientLanguage: LanguageCode = 'en'
): Promise<string> {
    const langInfo = SUPPORTED_LANGUAGES[patientLanguage];

    // Build summary structure
    let summary = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 PATIENT CONSULTATION SUMMARY
   ${langInfo.flag} ${langInfo.native}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 Patient: ${patientName}
📅 Date: ${new Date().toLocaleDateString()}

🔍 DIAGNOSIS:
${consultation.diagnosis}

💊 MEDICATIONS:
${consultation.medications.map(m => `  • ${m.name} - ${m.dosage}, ${m.frequency}`).join('\n')}

📝 TREATMENT PLAN:
${consultation.treatment.map(t => `  • ${t}`).join('\n')}

⚠️ IMPORTANT WARNINGS:
${consultation.warnings.map(w => `  ⚠ ${w}`).join('\n')}

📆 FOLLOW-UP:
${consultation.followUp}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
If you have any questions or concerns,
please contact your healthcare provider.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    return summary;
}

// Text-to-speech for patient communication
export function speakToPatient(text: string, language: LanguageCode = 'en'): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);

        // Map language codes to speech synthesis language tags
        const langMap: Partial<Record<LanguageCode, string>> = {
            en: 'en-US', es: 'es-ES', fr: 'fr-FR', de: 'de-DE',
            hi: 'hi-IN', ar: 'ar-SA', zh: 'zh-CN', ja: 'ja-JP',
            ko: 'ko-KR', it: 'it-IT', pt: 'pt-BR', ru: 'ru-RU',
        };

        utterance.lang = langMap[language] || 'en-US';
        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.pitch = 1;

        window.speechSynthesis.speak(utterance);
    }
}

// Stop speaking
export function stopSpeaking(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
}

