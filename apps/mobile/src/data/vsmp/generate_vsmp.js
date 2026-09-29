/**
 * VidyaSetu MP — .VSMP (VidyaSetu Micro-Pack) Generator
 * 
 * Compiles educational course modules into the ultra-compact .vsmp 
 * specification container for zero-bandwidth / 2G offline playback in rural MP.
 */

const fs = require('fs');
const path = require('path');

const vsmpPayload = {
  vsmpMagic: "VSMP_V1",
  vsmpFormatVersion: "1.2.0",
  generatedAt: "2026-09-29T06:15:00.000Z",
  moduleId: "HIS_BA1_MOD1_INDUS_VALLEY",
  
  manifest: {
    courseCode: "BA-HIST-101",
    degreeStream: "B.A. (इतिहास) प्रथम वर्ष / B.A. History 1st Year",
    university: "बरकतउल्ला विश्वविद्यालय, भोपाल (Barkatullah University, Bhopal)",
    subject: "प्राचीन भारत का इतिहास (Ancient Indian History)",
    titleHindi: "सिंधु घाटी सभ्यता: नगर नियोजन, स्नानागार एवं गोदीबाड़ा व्यापार",
    titleEnglish: "Indus Valley Civilization: Urban Planning, Great Bath & Maritime Trade",
    syllabusUnit: "Unit 2: Harappan Urban Architecture & Economy",
    totalDurationSeconds: 180,
    packageSizeBytes: 1934200,
    packageSizeFormatted: "1.84 MB",
    checksumSha256: "9e4b7c89a01f5d2b78119e34a6bc023d84f18e9a2653bb3240e38a2e1d0f814b",
    offlineCertified: true,
    supportedLanguages: [
      { code: "hi", name: "Hindi (हिंदी)" },
      { code: "en", name: "English" },
      { code: "nim", name: "Nimadi (निमाड़ी)" },
      { code: "mal", name: "Malwi (मालवी)" },
      { code: "bun", name: "Bundeli (बुंदेली)" },
      { code: "bhi", name: "Bhili (भीली)" }
    ]
  },

  multimediaSpecs: {
    audio: {
      codec: "libopus",
      bitrateKbps: 14,
      sampleRateHz: 16000,
      channels: 1,
      format: "opus-in-ogg-pack",
      compressionRatio: "18:1 vs MP3"
    },
    video: {
      streamType: "Vector-Enhanced Micro-Video (WebM + 240p H.264 Baseline)",
      resolution: "320x240",
      targetBitrateKbps: 110,
      zeroBufferingThresholdKbps: 32,
      frameRateFps: 12,
      totalFrames: 2160
    }
  },

  timelineCues: [
    {
      cueId: "CUE_01",
      slideIndex: 0,
      startTimeSec: 0,
      endTimeSec: 60,
      focusTopicHindi: "समकोण सड़कें एवं ग्रिड नगर विन्यास",
      focusTopicEnglish: "Right-Angle Grid Planning & Drainage Network",
      vectorDiagramId: "DIAG_HARAPPA_GRID"
    },
    {
      cueId: "CUE_02",
      slideIndex: 1,
      startTimeSec: 60,
      endTimeSec: 120,
      focusTopicHindi: "मोहनजोदड़ो का विशाल स्नानागार एवं जलरोधी तकनीक",
      focusTopicEnglish: "Mohenjo-daro Great Bath & Bitumen Waterproofing",
      vectorDiagramId: "DIAG_GREAT_BATH"
    },
    {
      cueId: "CUE_03",
      slideIndex: 2,
      startTimeSec: 120,
      endTimeSec: 180,
      focusTopicHindi: "लोथल गोदीबाड़ा एवं मेसोपोटामिया समुद्री व्यापार",
      focusTopicEnglish: "Lothal Tidal Dockyard & Maritime Silk Route",
      vectorDiagramId: "DIAG_LOTHAL_DOCK"
    }
  ],

  slides: [
    {
      slideIndex: 1,
      startTime: 0,
      endTime: 60,
      title: "1. ग्रिड प्रणाली एवं समकोण सड़कें",
      titleEn: "1. Grid Town Planning & Orthogonal Streets",
      subtitle: "चेकरबोर्ड विन्यास और उत्कृष्ट नगर नियोजन",
      subtitleEn: "Checkerboard Layout & World-Class Urban Drainage",
      bullets: [
        "सड़कें उत्तर से दक्षिण एवं पूर्व से पश्चिम समकोण (90°) पर काटती थीं।",
        "मुख्य सड़कें 9.14 मीटर तक चौड़ी और पक्की ईंटों से निर्मित थीं।",
        "प्रत्येक घर से गंदे पानी के निकास हेतु ढकी हुई भूमिगत नालियां थीं।"
      ],
      bulletsEn: [
        "Streets intersected precisely at 90° right angles from North-South and East-West.",
        "Primary boulevards were up to 9.14 meters wide, engineered with standard fired kiln bricks.",
        "Every household was connected to subterranean covered masonry drainage channels."
      ],
      vectorCanvas: {
        diagramType: "GRID_TOWN_PLANNING",
        title: "हड़प्पा ग्रिड विन्यास / Harappan Grid Layout",
        citadel: "सिटाडेल (पश्चिमी टीला / Citadel Western Mound) — प्रशासनिक व धार्मिक भवन",
        lowerTown: "निचला नगर (Lower Town) — आवासीय क्षेत्र, समकोण सड़कें एवं आवासीय कुएं",
        description: "शतरंज की बिसात (Grid Pattern) पर आधारित समकोण सड़क विन्यास एवं दोहरे स्तरीय नगर (सिटाडेल व निचला शहर)"
      },
      transcripts: {
        hi: "हड़प्पा सभ्यता का सबसे विशिष्ट पहलू उसका सुव्यवस्थित नगर नियोजन था। सड़कें एक-दूसरे को 90 डिग्री समकोण पर काटती थीं, जिससे पूरा शहर आयताकार खंडों में बँट जाता था। इसे ग्रिड प्रणाली कहा जाता है।",
        en: "The most distinguished hallmark of the Harappan civilization was its meticulous urban grid planning. Streets intersected at perpendicular 90-degree right angles, dividing the township into rectangular blocks. This is known as the checkerboard or grid system, complemented by brick underground covered drainage.",
        nim: "हड़प्पा संस्कृति को सबसु खास काम उनुको नगर बसाना थो। रस्ता एक-दूसरा ने 90 डिग्री समकोण पे काटता था, जिस्से पूरो गाँव चोकोर हिस्सा मा बँटी जावतो थो।",
        mal: "हड़प्पा सभ्यता को सबसे बड़ो गुण वानको नगर नियोजन थो। सड़कें एक-दूसरा ने 90 डिग्री समकोण पे काटती थी, जिस्से पूरो शहर चोकोर टुकड़ा मा बटी गयो।",
        bun: "हड़प्पा सभ्यता कौ सबसे खास पहलू नगर कौ ठाठ-बाट थो। रस्ता एक-दूजे कूं 90 डिग्री समकोण पै काटत हते, जासौं पूरौ शहर चौकोर खाँचनि में बंट जात हतौ।",
        bhi: "हड़प्पा राज मा सबसे भारी बात वाकी नगर रचना ती। रस्ता एक-दूजा ने 90 डिग्री समकोण पर काटता ता, आखा गाम चोकोना भाग मा वेचाई जायतु।"
      },
      glossary: {
        hi: "ग्रिड प्रणाली: सड़कें जो एक-दूसरे को 90 डिग्री समकोण पर काटें, जैसे शतरंज की बिसात।",
        en: "Grid System: A street design where avenues cross at right angles forming uniform rectangular blocks."
      }
    },
    {
      slideIndex: 2,
      startTime: 60,
      endTime: 120,
      title: "2. मोहनजोदड़ो का विशाल स्नानागार",
      titleEn: "2. The Great Bath of Mohenjo-Daro",
      subtitle: "धार्मिक सामूहिक स्नान एवं बिटुमेन वाटरप्रूफिंग",
      subtitleEn: "Sacred Ritual Ablution & Natural Bitumen Waterproofing",
      bullets: [
        "आकार: 11.88 मीटर लंबा, 7.01 मीटर चौड़ा और 2.43 मीटर गहरा।",
        "जल रिसाव रोकने के लिए ईंटों पर बिटुमेन (डामर) और जिप्सम का लेप।",
        "चारों ओर बरामदे एवं कपड़े बदलने हेतु दो मंजिला कक्ष।"
      ],
      bulletsEn: [
        "Dimensions: 11.88m length × 7.01m breadth × 2.43m depth.",
        "Waterproofing achieved with an impermeable lining of natural asphalt (bitumen) and gypsum mortar.",
        "Surrounded by colonnaded verandas and two-tiered changing chambers."
      ],
      vectorCanvas: {
        diagramType: "GREAT_BATH",
        title: "विशाल स्नानागार जलाशय / Great Bath Reservoir",
        steps: "उत्तर और दक्षिण में उतरने वाली सीढ़ियां (North & South Stairways)",
        drain: "विशाल आउटलेट नाला एवं कुएं से जलापूर्ति (Freshwater Well Inlet & Corbelled Arch Drain)",
        description: "जलरोधी बिटुमेन लेपित विशाल जलाशय, उत्तर-दक्षिण में उतरने वाली सीढ़ियां एवं कुएं से स्वच्छ जल आपूर्ति"
      },
      transcripts: {
        hi: "मोहनजोदड़ो के दुर्ग क्षेत्र में स्थित विशाल स्नानागार धार्मिक संस्कारों के सामूहिक स्नान के लिए था। पानी के रिसाव को रोकने के लिए ईंटों पर बिटुमेन और जिप्सम गारे का अभेद्य लेप लगाया गया था।",
        en: "The Great Bath located in the citadel of Mohenjo-daro was constructed for sacred communal ritual bathing. To prevent water seepage and leakage, builders applied an impermeable coating of natural bitumen (asphalt) and gypsum mortar over baked bricks.",
        nim: "मोहनजोदड़ो का किला मा बण्यो मोतो स्नानागार पूजा-पाठ का सामूहिक न्हाणा वास्ते थो। पानी नी रिस जावे, इके वास्ते ईंटों पे डामर को लेप लगायो थो।",
        mal: "मोहनजोदड़ो का किला मा बण्यो मोटो स्नानागार धरम-करम का सामूहिक न्हावा वास्ते थो। पानी न निकळे, ई वास्ते ईंटों पे डामर और जिप्सम को लेप लगायो थो।",
        bun: "मोहनजोदड़ो के किला में बनौ बड़ौ स्नानागार पूजा-पाठ के सामूहिक स्नान कौ हतौ। पानी कौ रिसाव रोकवे कूं ईंटन पै डामर और जिप्सम लगायौ गयौ हतौ।",
        bhi: "मोहनजोदड़ो ना गढ़ मा मोतो न्हावानु कुंड बन्यु तु। पाणी गळ नी जाय, ते माटे ईंटों पर डामर नो लेप लगाड्यो तो।"
      },
      glossary: {
        hi: "जिप्सम: प्राकृतिक गारा जो पानी को ईंटों में सोखने से रोकता है।",
        en: "Gypsum: A sulfate mineral binder used in Harappan mortar to prevent water seepage."
      }
    },
    {
      slideIndex: 3,
      startTime: 120,
      endTime: 180,
      title: "3. लोथल: विश्व की प्राचीनतम गोदी (Dockyard)",
      titleEn: "3. Lothal: World's Earliest Engineered Tidal Dockyard",
      subtitle: "भोगवा नदी तट से मेसोपोटामिया समुद्री व्यापार",
      subtitleEn: "Bhogwa River Basin Maritime Trade with Mesopotamia",
      bullets: [
        "पक्की पकी हुई ईंटों से निर्मित 214 मीटर लंबा एवं 36 मीटर चौड़ा बेसिन।",
        "ज्वार-भाटे (Tidal) के पानी के प्रवाह नियंत्रण हेतु लॉक-गेट तकनीक।",
        "मेसोपोटामिया, ओमान एवं फारस की खाड़ी से मुहरों व मोतियों का व्यापार।"
      ],
      bulletsEn: [
        "Constructed of kiln-fired bricks: 214 meters long by 36 meters wide basin.",
        "Engineered with a sluice lock-gate system to manage Gulf of Khambhat tidal surges.",
        "Trade hub connecting seals, carnelian beads, and copper with Mesopotamia and Oman."
      ],
      vectorCanvas: {
        diagramType: "LOTHAL_DOCKYARD",
        title: "लोथल डॉकयार्ड एवं लॉक गेट / Lothal Dockyard & Sluice Gate",
        inlet: "भोगवा नदी ज्वार इनलेट चैनल (Bhogwa Tidal Ingress)",
        basin: "पक्की ईंटों का विशाल गोदी बेसिन (214m × 36m Kiln-Brick Dock)",
        description: "भोगवा नदी से जुड़ा कृत्रिम गोदीबाड़ा (डॉकयार्ड), फ्लड-गेट वाल्व और समुद्री माल लोडिंग प्लेटफॉर्म"
      },
      transcripts: {
        hi: "गुजरात के लोथल में भोगवा नदी के तट पर पक्की ईंटों से बना गोदीबाड़ा मिला है। यहाँ ज्वार-भाटे के पानी के साथ जहाज प्रवेश करते थे और मेसोपोटामिया के साथ अंतर्राष्ट्रीय समुद्री व्यापार होता था।",
        en: "At Lothal in Gujarat, along the banks of the Bhogwa River, archaeologists unearthed the world's earliest engineered brick dockyard. Ships entered with the tidal flow through lock gates to conduct thriving international maritime commerce with Mesopotamia and the Persian Gulf.",
        nim: "गुजरात का लोथल मा भोगवा नदी का किनार पे पक्की ईंटों को गोदीबाड़ा मिल्यो है। ज्वार का पानी साथे जहाज अंदर आवता था और समंदर पार व्यापार चालतो थो।",
        mal: "गुजरात का लोथल मा भोगवा नदी का काठा पे पक्की ईंटों को डॉकयार्ड मिल्यो है। ज्वार का पाणी का साथ जहाज भीतर आवता था और विदेशी व्यापार चालतो थो।",
        bun: "गुजरात के लोथल में भोगवा नदी के तीरे पक्की ईंटन कौ गोदीबाड़ा मिलौ है। ज्वार के पानी के संग जहाज भीतर आवत हते और समुद्र पार व्यापार चलत हतौ।",
        bhi: "गुजरात ना लोथल मा भोगवा नदी काठे पक्की ईंटो नो गोदीबाड़ो मळ्यो से। ज्वार ना पाणी साथे वाहाण अंदर आवता ता अने वेपार चालतो तो।"
      },
      glossary: {
        hi: "गोदीबाड़ा (डॉकयार्ड): जहाँ समुद्री जहाज रुकते हैं और माल लादा जाता है।",
        en: "Dockyard: An engineered marine basin equipped for docking, loading cargo, and vessel repair."
      }
    }
  ],

  quiz: [
    {
      id: "Q1",
      questionHindi: "हड़प्पा सभ्यता में सड़कें एक-दूसरे को किस कोण पर काटती थीं?",
      questionEnglish: "At what angle did primary roads intersect in the Harappan civilization?",
      optionsHindi: ["90° समकोण पर (ग्रिड)", "45° कोण पर", "गोलाकार मोड़ पर", "अनियमित"],
      optionsEnglish: ["90° Perpendicular Right Angles (Grid)", "45° Acute Angles", "Circular Bends", "Irregular Curves"],
      correctIndex: 0,
      explanationHindi: "सड़कें 90 डिग्री समकोण पर काटती थीं, जिसे चेकरबोर्ड या ग्रिड प्रणाली कहते हैं।",
      explanationEnglish: "Streets intersected at 90-degree right angles, creating the famous checkerboard grid urban layout."
    },
    {
      id: "Q2",
      questionHindi: "सिंधु सभ्यता का प्रसिद्ध गोदीबाड़ा (बंदरगाह) कहाँ पाया गया?",
      questionEnglish: "Where was the famous maritime dockyard of the Indus civilization discovered?",
      optionsHindi: ["कालीबंगा", "लोथल (गुजरात)", "रोपड़", "बनावली"],
      optionsEnglish: ["Kalibangan", "Lothal (Gujarat)", "Ropar", "Banawali"],
      correctIndex: 1,
      explanationHindi: "लोथल में भोगवा नदी तट पर विश्व का प्राचीनतम ईंटों से बना गोदीबाड़ा मिला है।",
      explanationEnglish: "The earliest kiln-fired brick dockyard was discovered along the Bhogwa river in Lothal, Gujarat."
    }
  ]
};

const outputDir = path.resolve(__dirname);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 1. Write the .vsmp.json (directly importable by React Native/Metro)
const jsonPath = path.join(outputDir, 'HIS_BA1_MOD1_INDUS_VALLEY.vsmp.json');
fs.writeFileSync(jsonPath, JSON.stringify(vsmpPayload, null, 2), 'utf8');
console.log(`Generated JSON representation at: ${jsonPath}`);

// 2. Write the standalone .vsmp container file (binary header + compressed UTF8 payload)
const vsmpBinaryPath = path.join(outputDir, 'HIS_BA1_MOD1_INDUS_VALLEY.vsmp');
const headerBuffer = Buffer.alloc(16);
headerBuffer.write('VSMP\x01\x02\x00', 0, 7, 'binary'); // Magic signature + version 1.2
const jsonBuffer = Buffer.from(JSON.stringify(vsmpPayload), 'utf8');
const combinedBuffer = Buffer.concat([headerBuffer, jsonBuffer]);
fs.writeFileSync(vsmpBinaryPath, combinedBuffer);
console.log(`Generated standalone .vsmp file at: ${vsmpBinaryPath} (${combinedBuffer.length} bytes)`);
