// VidyaSetu MP — Course Module Definition
// Backward-compatible export with full 6-language support (Hindi, English, Nimadi, Malwi, Bundeli, Bhili)
// Sourced from .vsmp specification container (HIS_BA1_MOD1_INDUS_VALLEY.vsmp)
import VSMP_DATA from './vsmp/HIS_BA1_MOD1_INDUS_VALLEY.vsmp.json';

export const COURSE_MODULE = {
  moduleId: VSMP_DATA.moduleId,
  degree_stream: VSMP_DATA.manifest.degreeStream,
  courseTitle: VSMP_DATA.manifest.subject,
  module_title_hindi: VSMP_DATA.manifest.titleHindi,
  module_title_english: VSMP_DATA.manifest.titleEnglish,
  lessonTitle: VSMP_DATA.manifest.titleHindi,
  university: VSMP_DATA.manifest.university,
  syllabusRef: VSMP_DATA.manifest.syllabusUnit,
  packSize: VSMP_DATA.manifest.packageSizeFormatted,
  totalDurationSeconds: VSMP_DATA.manifest.totalDurationSeconds,
  checksum: VSMP_DATA.manifest.checksumSha256,
  multimediaSpecs: VSMP_DATA.multimediaSpecs,
  timelineCues: VSMP_DATA.timelineCues,
  slides: VSMP_DATA.slides.map((s) => ({
    slideIndex: s.slideIndex,
    startTime: s.startTime,
    endTime: s.endTime,
    title: s.title,
    titleEn: s.titleEn,
    subtitle: s.subtitle,
    subtitleEn: s.subtitleEn,
    bullets: s.bullets,
    bulletsEn: s.bulletsEn,
    vectorCanvas: s.vectorCanvas,
    transcript: s.transcripts,
    glossary: s.glossary.hi,
    glossaryEn: s.glossary.en,
  })),
  quiz: VSMP_DATA.quiz.map((q) => ({
    id: q.id,
    question: q.questionHindi,
    questionEn: q.questionEnglish,
    options: q.optionsHindi,
    optionsEn: q.optionsEnglish,
    correctIndex: q.correctIndex,
    explanation: q.explanationHindi,
    explanationEn: q.explanationEnglish,
  })),
  rawVsmp: VSMP_DATA,
};
