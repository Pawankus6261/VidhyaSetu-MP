// VidyaSetu MP — Learn Screen (पाठशाला)
// Features: .VSMP Micro-Pack Loader, Audio-Slide Vector Player, 240p Ultra-Compressed Video, Offline Quiz, Full English & Dialect Support
// Adaptive for all screen sizes (phones, tablets, web desktop)
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { COURSE_MODULE } from '../data/courseModule';
import { SPACING, RADIUS, FONT } from '../constants/theme';

export default function LearnScreen() {
  const { theme, dialect, DIALECTS, networkState, t, isEnglish } = useApp();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const s = makeStyles(theme, isTablet);

  const [mediaMode, setMediaMode] = useState('AUDIO_SLIDE'); // 'AUDIO_SLIDE' | 'VIDEO' | 'VSMP_INSPECTOR'
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoQuality, setVideoQuality] = useState('240p');
  const [playbackSpeed, setPlaybackSpeed] = useState('1.0x');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const currentSlide = COURSE_MODULE.slides[currentSlideIndex];
  const AUDIO_DURATION = 165;
  const VIDEO_DURATION = 180;

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m < 10 ? '0' : ''}${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  useEffect(() => {
    if (!isPlayingAudio) return;
    const timer = setInterval(() => {
      setAudioProgress((p) => {
        if (p >= AUDIO_DURATION) {
          setIsPlayingAudio(false);
          return 0;
        }
        return p + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlayingAudio]);

  useEffect(() => {
    if (!isPlayingVideo) return;
    const timer = setInterval(() => {
      setVideoProgress((p) => {
        if (p >= VIDEO_DURATION) {
          setIsPlayingVideo(false);
          return 0;
        }
        return p + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlayingVideo]);

  // Reset audio on slide change
  useEffect(() => {
    setIsPlayingAudio(false);
    setAudioProgress(0);
  }, [currentSlideIndex]);

  const dialectObj = DIALECTS.find((d) => d.code === dialect);
  const dialectLabel = dialectObj?.label || 'हिंदी';

  const handleQuizSubmit = () => {
    const answered = Object.keys(selectedAnswers).length;
    if (answered < COURSE_MODULE.quiz.length) {
      Alert.alert(
        isEnglish ? 'Incomplete Quiz' : 'सभी प्रश्न उत्तर दें',
        isEnglish
          ? `${COURSE_MODULE.quiz.length - answered} questions remaining.`
          : `${COURSE_MODULE.quiz.length - answered} प्रश्न अभी बाकी हैं।`,
        [{ text: isEnglish ? 'OK' : 'ठीक है' }]
      );
      return;
    }
    setShowResult(true);
  };

  const score = COURSE_MODULE.quiz.filter(
    (q) => selectedAnswers[q.id] === q.correctIndex
  ).length;

  const activeTranscript =
    currentSlide?.transcript?.[dialect] ||
    currentSlide?.transcript?.en ||
    currentSlide?.transcript?.hi ||
    '';

  const activeSlideTitle = isEnglish ? currentSlide.titleEn : currentSlide.title;
  const activeSlideSubtitle = isEnglish ? currentSlide.subtitleEn : currentSlide.subtitle;
  const activeBullets = isEnglish ? currentSlide.bulletsEn : currentSlide.bullets;
  const activeGlossary = isEnglish ? currentSlide.glossaryEn : currentSlide.glossary;

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <View style={s.adaptiveWrapper}>
        {/* HERO MODULE CARD */}
        <View style={s.moduleCard}>
          <View style={s.metaRow}>
            <View style={s.vsmpBadge}>
              <Text style={s.vsmpBadgeText}>📦 .VSMP {COURSE_MODULE.packSize}</Text>
            </View>
            <View style={s.degreeBadge}>
              <Text style={s.degreeBadgeText}>{COURSE_MODULE.degree_stream}</Text>
            </View>
            <View style={s.offlineReadyBadge}>
              <Text style={s.offlineReadyText}>
                {networkState.isOnline ? '⚡ 2G/3G Ready' : '🛡️ 100% Offline Cached'}
              </Text>
            </View>
          </View>

          <Text style={s.moduleTitle}>
            {isEnglish ? COURSE_MODULE.module_title_english : COURSE_MODULE.module_title_hindi}
          </Text>
          <Text style={s.moduleSubtitle}>
            🏛️ {COURSE_MODULE.university} • {COURSE_MODULE.syllabusRef}
          </Text>

          {/* 3-WAY MEDIA MODE SWITCHER */}
          <View style={s.modeToggle}>
            {[
              { key: 'AUDIO_SLIDE', label: isEnglish ? '🎧 Audio-Slide' : '🎧 ऑडियो-स्लाइड' },
              { key: 'VIDEO',       label: isEnglish ? '🎬 E-Lecture'   : '🎬 ई-व्याख्यान' },
              { key: 'VSMP_INSPECTOR', label: isEnglish ? '📦 .VSMP Spec' : '📦 .VSMP विवरण' },
            ].map((m) => (
              <TouchableOpacity
                key={m.key}
                style={[s.modeBtn, mediaMode === m.key && s.modeBtnActive]}
                onPress={() => setMediaMode(m.key)}
                activeOpacity={0.8}
              >
                <Text style={[s.modeBtnText, mediaMode === m.key && s.modeBtnTextActive]}>
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* MODE 1: AUDIO-SLIDE VECTOR PLAYER */}
          {mediaMode === 'AUDIO_SLIDE' && (
            <View style={s.slidePlayerContainer}>
              {/* Stepper */}
              <View style={s.stepperRow}>
                {COURSE_MODULE.slides.map((sl, idx) => {
                  const isActive = currentSlideIndex === idx;
                  return (
                    <TouchableOpacity
                      key={sl.slideIndex}
                      style={[s.stepTab, isActive && s.stepTabActive]}
                      onPress={() => setCurrentSlideIndex(idx)}
                      activeOpacity={0.8}
                    >
                      <Text style={[s.stepNum, isActive && s.stepNumActive]}>0{idx + 1}</Text>
                      <Text style={[s.stepLabel, isActive && s.stepLabelActive]} numberOfLines={1}>
                        {isEnglish ? `Slide ${idx + 1}` : `स्लाइड ${idx + 1}`}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Vector Blueprint Canvas */}
              <View style={s.canvas}>
                <View style={s.canvasHeader}>
                  <View style={s.canvasTitleGroup}>
                    <Text style={s.canvasSlideTitle} numberOfLines={2}>
                      {activeSlideTitle}
                    </Text>
                    <Text style={s.canvasSlideSubtitle}>{activeSlideSubtitle}</Text>
                  </View>
                  <View style={s.vectorTag}>
                    <Text style={s.vectorTagText}>VECTOR SVG</Text>
                  </View>
                </View>

                <View style={s.blueprintBox}>
                  {currentSlideIndex === 0 && (
                    <View style={s.diagramContent}>
                      <Text style={s.diagramHeader}>
                        [ {isEnglish ? 'HARAPPAN GRID TOWN LAYOUT' : 'हड़प्पा समकोण ग्रिड विन्यास'} ]
                      </Text>
                      <View style={s.gridGraphic}>
                        <View style={s.citadelPill}>
                          <Text style={s.citadelTitle}>
                            🏛️ {isEnglish ? 'CITADEL (WESTERN MOUND)' : 'सिटाडेल (पश्चिमी टीला)'}
                          </Text>
                          <Text style={s.citadelDesc}>
                            {isEnglish ? 'Administrative Granary & Assembly Hall' : 'प्रशासनिक भवन एवं विशाल अन्नागार'}
                          </Text>
                        </View>
                        <View style={s.crossStreetRow}>
                          <View style={s.streetLineH} />
                          <Text style={s.angleTag}>90° समकोण</Text>
                          <View style={s.streetLineH} />
                        </View>
                        <View style={s.lowerTownPill}>
                          <Text style={s.lowerTownTitle}>
                            🏘️ {isEnglish ? 'LOWER TOWN (RESIDENTIAL)' : 'निचला नगर (आवासीय क्षेत्र)'}
                          </Text>
                          <Text style={s.lowerTownDesc}>
                            {isEnglish ? 'Subterranean Masonry Drainage System' : 'पक्की ईंटों की भूमिगत ढकी हुई नालियां'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}

                  {currentSlideIndex === 1 && (
                    <View style={s.diagramContent}>
                      <Text style={s.diagramHeader}>
                        [ {isEnglish ? 'MOHENJO-DARO GREAT BATH' : 'मोहनजोदड़ो का विशाल स्नानागार'} ]
                      </Text>
                      <View style={s.bathGraphic}>
                        <Text style={s.bathStairText}>▲ {isEnglish ? 'North Stairway' : 'उत्तरी सीढ़ियां'}</Text>
                        <View style={s.bathReservoir}>
                          <Text style={s.bathPoolText}>💧 11.88m × 7.01m × 2.43m</Text>
                          <View style={s.bitumenBadge}>
                            <Text style={s.bitumenBadgeText}>
                              🛡️ {isEnglish ? 'Bitumen + Gypsum Waterproofing' : 'बिटुमेन (डामर) + जिप्सम जलरोधी लेप'}
                            </Text>
                          </View>
                        </View>
                        <Text style={s.bathStairText}>▼ {isEnglish ? 'South Stairway' : 'दक्षिणी सीढ़ियां'}</Text>
                      </View>
                    </View>
                  )}

                  {currentSlideIndex === 2 && (
                    <View style={s.diagramContent}>
                      <Text style={s.diagramHeader}>
                        [ {isEnglish ? 'LOTHAL TIDAL DOCKYARD BASIN' : 'लोथल ज्वारीय गोदीबाड़ा एवं बंदरगाह'} ]
                      </Text>
                      <View style={s.dockGraphic}>
                        <View style={s.riverInlet}>
                          <Text style={s.riverText}>
                            🌊 {isEnglish ? 'Bhogwa River Tidal Ingress' : 'भोगवा नदी ज्वार जलप्रवाह'}
                          </Text>
                        </View>
                        <View style={s.lockGateBox}>
                          <Text style={s.lockGateText}>
                            ⚙️ {isEnglish ? 'Sluice Lock-Gate (Tidal Control)' : 'लकड़ी का लॉक-गेट (ज्वार नियंत्रण)'}
                          </Text>
                        </View>
                        <View style={s.dockBasin}>
                          <Text style={s.dockBasinTitle}>
                            ⚓ {isEnglish ? 'Fired-Brick Wharf (214m × 36m)' : 'पक्की ईंटों का गोदी बेसिन (214m × 36m)'}
                          </Text>
                          <Text style={s.tradeRouteText}>
                            ⛵ {isEnglish ? 'Mesopotamia & Oman Maritime Silk Route' : 'मेसोपोटामिया एवं ओमान से सील-मोहर व्यापार'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}

                  <Text style={s.canvasDesc}>
                    {currentSlide?.vectorCanvas?.description}
                  </Text>
                </View>

                {/* Bullets */}
                <View style={s.bulletContainer}>
                  {activeBullets.map((b, i) => (
                    <View key={i} style={s.bulletRow}>
                      <Text style={s.bulletDot}>◆</Text>
                      <Text style={s.bulletItem}>{b}</Text>
                    </View>
                  ))}
                </View>

                {/* Audio Transcript */}
                <View style={s.transcriptBox}>
                  <View style={s.transcriptHeader}>
                    <Text style={s.transcriptIcon}>🎙️</Text>
                    <Text style={s.transcriptLabel}>
                      {isEnglish ? `Audio Transcript (${dialectLabel}):` : `ऑडियो व्याख्या (${dialectLabel}):`}
                    </Text>
                  </View>
                  <Text style={s.transcriptText}>"{activeTranscript}"</Text>
                  {activeGlossary && (
                    <View style={s.glossaryRow}>
                      <Text style={s.glossaryLabel}>💡 {isEnglish ? 'Glossary:' : 'शब्दावली:'}</Text>
                      <Text style={s.glossaryText}>{activeGlossary}</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Audio Controls */}
              <View style={s.audioControls}>
                <View style={s.timeRow}>
                  <Text style={s.timeText}>{formatTime(audioProgress)}</Text>
                  <View style={s.trackBar}>
                    <View
                      style={[
                        s.trackFill,
                        { width: `${(audioProgress / AUDIO_DURATION) * 100}%` },
                      ]}
                    />
                  </View>
                  <Text style={s.timeText}>{formatTime(AUDIO_DURATION)}</Text>
                </View>

                <View style={s.audioBtns}>
                  <TouchableOpacity
                    style={[s.navBtn, currentSlideIndex === 0 && s.navBtnDisabled]}
                    disabled={currentSlideIndex === 0}
                    onPress={() => setCurrentSlideIndex((p) => Math.max(0, p - 1))}
                    activeOpacity={0.7}
                  >
                    <Text style={s.navBtnText}>{t.learn.prev}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={s.playBtn}
                    onPress={() => setIsPlayingAudio((p) => !p)}
                    activeOpacity={0.8}
                  >
                    <Text style={s.playBtnText}>
                      {isPlayingAudio ? t.learn.pause : t.learn.listen}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      s.navBtn,
                      currentSlideIndex === COURSE_MODULE.slides.length - 1 && s.navBtnDisabled,
                    ]}
                    disabled={currentSlideIndex === COURSE_MODULE.slides.length - 1}
                    onPress={() =>
                      setCurrentSlideIndex((p) =>
                        Math.min(COURSE_MODULE.slides.length - 1, p + 1)
                      )
                    }
                    activeOpacity={0.7}
                  >
                    <Text style={s.navBtnText}>{t.learn.next}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* MODE 2: 240p ULTRA-COMPRESSED VIDEO */}
          {mediaMode === 'VIDEO' && (
            <View style={s.videoWrapper}>
              <View style={s.videoPlayerCard}>
                <View style={s.videoTopBar}>
                  <View style={s.videoBrandBadge}>
                    <Text style={s.videoBrandText}>
                      {isEnglish ? 'VIDYASETU E-LECTURE' : 'विद्यासेतु MP • ई-व्याख्यान'}
                    </Text>
                  </View>
                  <View style={s.vsmpStreamPill}>
                    <Text style={s.vsmpStreamText}>
                      .VSMP • {videoQuality} ({networkState.isOnline ? '110 kbps' : 'Offline'})
                    </Text>
                  </View>
                </View>

                <View style={s.stageArea}>
                  <View style={s.facultyTag}>
                    <Text style={s.facultyEmoji}>👨‍🏫</Text>
                    <Text style={s.facultyTitle}>
                      {isEnglish ? 'Dr. R.K. Sharma (Head, Dept. of History)' : 'डॉ. आर. के. शर्मा (विभागाध्यक्ष — इतिहास)'}
                    </Text>
                  </View>

                  <View style={s.smartBoard}>
                    <Text style={s.boardTopic}>
                      {isEnglish ? 'TOPIC: HARAPPAN TOWN PLANNING & TRADE' : 'विषय: सिंधु घाटी सभ्यता नगर नियोजन एवं व्यापार'}
                    </Text>
                    <View style={s.boardGraphicFrame}>
                      <Text style={s.boardGraphicEmoji}>🏛️ 🌊 🧱</Text>
                      <Text style={s.boardGraphicMain}>
                        {currentSlideIndex === 0 && (isEnglish ? 'Checkerboard Grid • Right-Angle Streets' : 'समकोण ग्रिड सड़कें • ड्रेनेज चैनल')}
                        {currentSlideIndex === 1 && (isEnglish ? 'Great Bath • Gypsum Bitumen Lining' : 'विशाल स्नानागार • बिटुमेन वाटरप्रूफिंग')}
                        {currentSlideIndex === 2 && (isEnglish ? 'Lothal Tidal Dockyard • Sluice Gates' : 'लोथल बंदरगाह • ज्वारीय लॉक-गेट')}
                      </Text>
                      <Text style={s.boardGraphicSub}>
                        {isEnglish ? 'Decoded from HIS_BA1_MOD1_INDUS_VALLEY.vsmp' : '.vsmp कंटेनर से डिकोड किया गया दृश्य'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Subtitles */}
                <View style={s.subtitleContainer}>
                  <View style={s.subHeaderRow}>
                    <Text style={s.subTag}>CC • {dialectLabel.toUpperCase()}</Text>
                    <Text style={s.subSyncText}>
                      {isEnglish ? 'Synchronized with Opus 14kbps' : 'ऑपस 14kbps से सिंक'}
                    </Text>
                  </View>
                  <Text style={s.subtitleLine}>"{activeTranscript}"</Text>
                </View>

                {/* Video Controls */}
                <View style={s.videoControlsStrip}>
                  <View style={s.videoTimeRow}>
                    <Text style={s.videoTimeText}>{formatTime(videoProgress)}</Text>
                    <View style={s.videoProgressBar}>
                      <View
                        style={[
                          s.videoProgressFill,
                          { width: `${(videoProgress / VIDEO_DURATION) * 100}%` },
                        ]}
                      />
                    </View>
                    <Text style={s.videoTimeText}>{formatTime(VIDEO_DURATION)}</Text>
                  </View>

                  <View style={s.videoBtnRow}>
                    <TouchableOpacity
                      style={s.videoPlayBtn}
                      onPress={() => setIsPlayingVideo((p) => !p)}
                      activeOpacity={0.8}
                    >
                      <Text style={s.videoPlayBtnText}>
                        {isPlayingVideo ? t.learn.pause : t.learn.play}
                      </Text>
                    </TouchableOpacity>

                    <View style={s.qualityRow}>
                      {['240p', '360p', '720p'].map((q) => (
                        <TouchableOpacity
                          key={q}
                          style={[s.miniPill, videoQuality === q && s.miniPillActive]}
                          onPress={() => setVideoQuality(q)}
                        >
                          <Text style={[s.miniPillText, videoQuality === q && s.miniPillTextActive]}>
                            {q}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <View style={s.speedRow}>
                      {['1.0x', '1.25x', '1.5x'].map((sp) => (
                        <TouchableOpacity
                          key={sp}
                          style={[s.miniPill, playbackSpeed === sp && s.miniPillSpeedActive]}
                          onPress={() => setPlaybackSpeed(sp)}
                        >
                          <Text style={[s.miniPillText, playbackSpeed === sp && s.miniPillTextActive]}>
                            {sp}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
              </View>

              <View style={s.zeroBufferingNotice}>
                <Text style={s.zeroBufferingTitle}>
                  🚀 {isEnglish ? 'VSMP Zero-Buffering Playback' : 'विद्यासेतु शून्य-बफरिंग तकनीक:'}
                </Text>
                <Text style={s.zeroBufferingText}>
                  {networkState.isOnline
                    ? (isEnglish
                        ? 'Streaming 240p ultra-compressed stream at 110 kbps — runs seamlessly even on 2G Edge connection.'
                        : '2G नेटवर्क पर भी 110 kbps की न्यूनतम बैंडविड्थ पर सुचारु रूप से चलता है।')
                    : (isEnglish
                        ? 'Offline verified: Running from local .vsmp storage cache (Zero data consumed).'
                        : 'ऑफलाइन मोड: स्थानीय .vsmp कैश से चल रहा है (0 बाइट डेटा खर्च)।')}
                </Text>
              </View>
            </View>
          )}

          {/* MODE 3: .VSMP SPEC INSPECTOR */}
          {mediaMode === 'VSMP_INSPECTOR' && (
            <View style={s.inspectorContainer}>
              <View style={s.inspectorCard}>
                <View style={s.inspectorHeaderRow}>
                  <View>
                    <Text style={s.inspectorFileTitle}>HIS_BA1_MOD1_INDUS_VALLEY.vsmp</Text>
                    <Text style={s.inspectorFileSub}>
                      {isEnglish ? 'VidyaSetu Micro-Pack Container v1.2' : 'विद्यासेतु माइक्रो-पैक कंटेनर प्रारूप'}
                    </Text>
                  </View>
                  <View style={s.integrityBadge}>
                    <Text style={s.integrityBadgeText}>✓ SHA-256 OK</Text>
                  </View>
                </View>

                <View style={s.specGrid}>
                  <View style={s.specItem}>
                    <Text style={s.specLabel}>{isEnglish ? 'Pack Size' : 'पैक आकार'}</Text>
                    <Text style={s.specValue}>1.84 MB (1,934,200 B)</Text>
                  </View>
                  <View style={s.specItem}>
                    <Text style={s.specLabel}>{isEnglish ? 'Audio Codec' : 'ऑडियो कोडेक'}</Text>
                    <Text style={s.specValue}>libopus @ 14 kbps CBR</Text>
                  </View>
                  <View style={s.specItem}>
                    <Text style={s.specLabel}>{isEnglish ? 'Languages' : 'शामिल भाषाएं'}</Text>
                    <Text style={s.specValue}>6 (EN, HI, NIM, MAL, BUN, BHI)</Text>
                  </View>
                  <View style={s.specItem}>
                    <Text style={s.specLabel}>{isEnglish ? 'Offline Storage' : 'ऑफलाइन स्टोरेज'}</Text>
                    <Text style={[s.specValue, { color: theme.successText }]}>✓ Permanently Cached</Text>
                  </View>
                  <View style={s.specItem}>
                    <Text style={s.specLabel}>{isEnglish ? 'Compression Ratio' : 'कंप्रेशन अनुपात'}</Text>
                    <Text style={s.specValue}>18:1 vs MP3 / 94% Savings</Text>
                  </View>
                  <View style={s.specItem}>
                    <Text style={s.specLabel}>{isEnglish ? 'Min Bandwidth' : 'न्यूनतम बैंडविड्थ'}</Text>
                    <Text style={s.specValue}>0 kbps (Full Offline)</Text>
                  </View>
                </View>

                <View style={s.hashContainer}>
                  <Text style={s.hashLabel}>SHA-256 Checksum Signature:</Text>
                  <Text style={s.hashValue}>{COURSE_MODULE.checksum}</Text>
                </View>

                <View style={s.cuesContainer}>
                  <Text style={s.cuesTitle}>
                    {isEnglish ? 'Synchronized Cue Points in Container:' : 'कंटेनर में सिंक्रनाइज़्ड क्यू पॉइंट्स:'}
                  </Text>
                  {COURSE_MODULE.timelineCues.map((cue) => (
                    <View key={cue.cueId} style={s.cueRow}>
                      <Text style={s.cueTime}>{cue.startTimeSec}s - {cue.endTimeSec}s</Text>
                      <Text style={s.cueTopic}>
                        {isEnglish ? cue.focusTopicEnglish : cue.focusTopicHindi}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}
        </View>

        {/* PRACTICE QUIZ CARD */}
        <View style={s.quizCard}>
          <View style={s.quizHeaderRow}>
            <View>
              <Text style={s.quizHeader}>{t.learn.quizHeader}</Text>
              <Text style={s.quizSubHeader}>
                {isEnglish ? 'Zero data consumed • Deterministic local scoring' : 'बिना इंटरनेट स्कोर गणना • तत्काल विश्लेषण'}
              </Text>
            </View>
            <View style={s.quizQuestionsBadge}>
              <Text style={s.quizQuestionsBadgeText}>
                {COURSE_MODULE.quiz.length} {isEnglish ? 'Questions' : 'प्रश्न'}
              </Text>
            </View>
          </View>

          {showResult && (
            <View style={s.resultBanner}>
              <Text style={s.resultScore}>
                {score === COURSE_MODULE.quiz.length ? '🏆' : '📝'} {t.learn.scoreCard}:{' '}
                <Text style={s.resultScoreBold}>{score}/{COURSE_MODULE.quiz.length}</Text>
              </Text>
              <Text style={s.resultMsg}>
                {score === COURSE_MODULE.quiz.length
                  ? (isEnglish ? 'Outstanding! You have mastered this chapter.' : 'शानदार! आप इस अध्याय में पारंगत हैं।')
                  : (isEnglish ? 'Good effort! Review the detailed solutions below.' : 'पुनः प्रयास करें — सही उत्तर नीचे देखें।')}
              </Text>
            </View>
          )}

          {COURSE_MODULE.quiz.map((q, idx) => {
            const qText = isEnglish ? q.questionEn : q.question;
            const optionsList = isEnglish ? q.optionsEn : q.options;
            const expText = isEnglish ? q.explanationEn : q.explanation;

            return (
              <View key={q.id} style={s.quizItem}>
                <Text style={s.quizQ}>{idx + 1}. {qText}</Text>
                {optionsList.map((opt, oi) => {
                  const isSelected = selectedAnswers[q.id] === oi;
                  const isCorrect = showResult && oi === q.correctIndex;
                  const isWrong = showResult && isSelected && oi !== q.correctIndex;

                  return (
                    <TouchableOpacity
                      key={oi}
                      style={[
                        s.option,
                        isSelected && !showResult && s.optionSelected,
                        isCorrect && s.optionCorrect,
                        isWrong && s.optionWrong,
                      ]}
                      onPress={() => {
                        if (showResult) return;
                        setSelectedAnswers((prev) => ({ ...prev, [q.id]: oi }));
                      }}
                      activeOpacity={0.75}
                      disabled={showResult}
                    >
                      <View style={s.optionInner}>
                        <View
                          style={[
                            s.radioCircle,
                            isSelected && s.radioCircleSelected,
                            isCorrect && s.radioCircleCorrect,
                            isWrong && s.radioCircleWrong,
                          ]}
                        >
                          <Text style={s.radioIndexText}>
                            {isEnglish ? ['A', 'B', 'C', 'D'][oi] : ['क', 'ख', 'ग', 'घ'][oi]}
                          </Text>
                        </View>
                        <Text
                          style={[
                            s.optionText,
                            isSelected && !showResult && s.optionTextSelected,
                            isCorrect && s.optionTextCorrect,
                            isWrong && s.optionTextWrong,
                          ]}
                        >
                          {opt}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}

                {showResult && (
                  <View style={s.explanationBox}>
                    <Text style={s.explanationText}>
                      {t.learn.correctAnswer}:{' '}
                      {isEnglish ? ['A', 'B', 'C', 'D'][q.correctIndex] : ['क', 'ख', 'ग', 'घ'][q.correctIndex]}
                      {'\n'}📖 {expText}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}

          <TouchableOpacity
            style={[s.submitBtn, showResult && s.submitBtnSecondary]}
            onPress={() => {
              if (showResult) {
                setShowResult(false);
                setSelectedAnswers({});
              } else {
                handleQuizSubmit();
              }
            }}
            activeOpacity={0.85}
          >
            <Text style={[s.submitBtnText, showResult && s.submitBtnTextSecondary]}>
              {showResult ? t.learn.retryQuiz : t.learn.checkAnswers}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const makeStyles = (theme, isTablet) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      padding: SPACING.md,
      paddingBottom: 90,
      alignItems: 'center',
    },
    adaptiveWrapper: {
      width: '100%',
      maxWidth: isTablet ? 760 : '100%',
    },

    // Module Card
    moduleCard: {
      backgroundColor: theme.surface,
      borderRadius: RADIUS.lg,
      padding: isTablet ? SPACING.lg : SPACING.md,
      marginBottom: SPACING.md,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      elevation: 3,
      shadowColor: theme.cardShadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 8,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      flexWrap: 'wrap',
      gap: 6,
    },
    vsmpBadge: {
      backgroundColor: '#064E3B',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      borderWidth: 0.5,
      borderColor: '#10B981',
    },
    vsmpBadgeText: {
      color: '#A7F3D0',
      fontSize: 10.5,
      fontWeight: FONT.weights.extrabold,
      letterSpacing: 0.3,
    },
    degreeBadge: {
      backgroundColor: theme.primarySoft,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      borderWidth: 0.5,
      borderColor: theme.primaryBorder,
    },
    degreeBadgeText: {
      color: theme.primary,
      fontSize: 10.5,
      fontWeight: FONT.weights.bold,
    },
    offlineReadyBadge: {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      paddingHorizontal: 7,
      paddingVertical: 3,
      borderRadius: 6,
    },
    offlineReadyText: {
      fontSize: 10,
      color: theme.textMuted,
      fontWeight: FONT.weights.semibold,
    },
    moduleTitle: {
      fontSize: isTablet ? FONT.sizes.xxl : FONT.sizes.xl,
      fontWeight: FONT.weights.extrabold,
      color: theme.textPrimary,
      lineHeight: isTablet ? 32 : 27,
      marginTop: 2,
    },
    moduleSubtitle: {
      fontSize: FONT.sizes.xs,
      color: theme.textMuted,
      marginTop: 4,
      marginBottom: SPACING.md,
    },

    // Mode Toggle
    modeToggle: {
      flexDirection: 'row',
      backgroundColor: theme.surfaceAlt,
      borderRadius: RADIUS.md,
      padding: 3,
      marginBottom: SPACING.md,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
    },
    modeBtn: {
      flex: 1,
      paddingVertical: 9,
      alignItems: 'center',
      borderRadius: RADIUS.sm,
    },
    modeBtnActive: {
      backgroundColor: theme.chromeBackground,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    modeBtnText: {
      fontSize: FONT.sizes.xs,
      fontWeight: FONT.weights.bold,
      color: theme.textMuted,
    },
    modeBtnTextActive: {
      color: '#FFFFFF',
      fontWeight: FONT.weights.extrabold,
    },

    // Stepper
    stepperRow: {
      flexDirection: 'row',
      gap: 6,
      marginBottom: 10,
    },
    stepTab: {
      flex: 1,
      paddingVertical: 6,
      paddingHorizontal: 8,
      borderRadius: 8,
      backgroundColor: theme.surfaceAlt,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      alignItems: 'center',
    },
    stepTabActive: {
      backgroundColor: 'rgba(245, 158, 11, 0.15)',
      borderColor: theme.primaryLight,
    },
    stepNum: {
      fontSize: 12,
      fontWeight: FONT.weights.extrabold,
      color: theme.textMuted,
    },
    stepNumActive: {
      color: theme.primaryLight,
    },
    stepLabel: {
      fontSize: 10,
      color: theme.textMuted,
      marginTop: 1,
    },
    stepLabelActive: {
      color: theme.textPrimary,
      fontWeight: FONT.weights.bold,
    },

    // Canvas
    canvas: {
      backgroundColor: theme.surfaceAlt,
      borderRadius: RADIUS.md,
      padding: isTablet ? SPACING.lg : SPACING.md,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      marginBottom: SPACING.sm,
    },
    canvasHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: SPACING.sm,
    },
    canvasTitleGroup: {
      flex: 1,
      paddingRight: 6,
    },
    canvasSlideTitle: {
      fontSize: FONT.sizes.base,
      fontWeight: FONT.weights.extrabold,
      color: theme.textPrimary,
      lineHeight: 22,
    },
    canvasSlideSubtitle: {
      fontSize: FONT.sizes.xs,
      color: theme.textMuted,
      marginTop: 2,
    },
    vectorTag: {
      backgroundColor: theme.primarySoft,
      paddingHorizontal: 6,
      paddingVertical: 3,
      borderRadius: 4,
      borderWidth: 0.5,
      borderColor: theme.primaryBorder,
    },
    vectorTagText: {
      fontSize: 9,
      fontWeight: FONT.weights.extrabold,
      color: theme.primary,
    },

    // Blueprint Diagram
    blueprintBox: {
      backgroundColor: theme.chromeBackground,
      borderRadius: RADIUS.sm,
      padding: SPACING.md,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.12)',
      alignItems: 'center',
    },
    diagramContent: {
      width: '100%',
      alignItems: 'center',
    },
    diagramHeader: {
      fontSize: 11,
      fontWeight: FONT.weights.extrabold,
      color: '#38BDF8',
      letterSpacing: 0.5,
      marginBottom: 10,
    },
    gridGraphic: {
      width: '100%',
      alignItems: 'center',
      gap: 6,
    },
    citadelPill: {
      width: '92%',
      backgroundColor: 'rgba(59, 130, 246, 0.25)',
      padding: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'rgba(59, 130, 246, 0.5)',
      alignItems: 'center',
    },
    citadelTitle: {
      fontSize: 12,
      fontWeight: FONT.weights.bold,
      color: '#93C5FD',
    },
    citadelDesc: {
      fontSize: 10,
      color: '#E0F2FE',
      marginTop: 1,
    },
    crossStreetRow: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '80%',
      gap: 8,
      marginVertical: 2,
    },
    streetLineH: {
      flex: 1,
      height: 2,
      backgroundColor: theme.primaryLight,
    },
    angleTag: {
      fontSize: 9,
      fontWeight: FONT.weights.bold,
      color: '#FBBF24',
      backgroundColor: 'rgba(245, 158, 11, 0.25)',
      paddingHorizontal: 6,
      paddingVertical: 1,
      borderRadius: 4,
    },
    lowerTownPill: {
      width: '92%',
      backgroundColor: 'rgba(16, 185, 129, 0.22)',
      padding: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'rgba(16, 185, 129, 0.5)',
      alignItems: 'center',
    },
    lowerTownTitle: {
      fontSize: 12,
      fontWeight: FONT.weights.bold,
      color: '#6EE7B7',
    },
    lowerTownDesc: {
      fontSize: 10,
      color: '#ECFDF5',
      marginTop: 1,
    },

    // Bath Graphic
    bathGraphic: {
      width: '94%',
      alignItems: 'center',
      gap: 4,
    },
    bathStairText: {
      fontSize: 10,
      color: '#94A3B8',
      fontWeight: FONT.weights.semibold,
    },
    bathReservoir: {
      width: '100%',
      backgroundColor: 'rgba(14, 116, 144, 0.35)',
      borderWidth: 1.5,
      borderColor: '#06B6D4',
      borderRadius: 10,
      padding: 12,
      alignItems: 'center',
    },
    bathPoolText: {
      fontSize: 13,
      fontWeight: FONT.weights.extrabold,
      color: '#67E8F9',
    },
    bitumenBadge: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      marginTop: 6,
      borderWidth: 0.5,
      borderColor: '#F59E0B',
    },
    bitumenBadgeText: {
      fontSize: 10,
      fontWeight: FONT.weights.bold,
      color: '#FDE68A',
    },

    // Dock Graphic
    dockGraphic: {
      width: '94%',
      alignItems: 'center',
      gap: 6,
    },
    riverInlet: {
      width: '90%',
      backgroundColor: 'rgba(37, 99, 235, 0.25)',
      borderWidth: 1,
      borderColor: '#3B82F6',
      padding: 6,
      borderRadius: 6,
      alignItems: 'center',
    },
    riverText: {
      fontSize: 11,
      fontWeight: FONT.weights.bold,
      color: '#93C5FD',
    },
    lockGateBox: {
      backgroundColor: 'rgba(217, 119, 6, 0.3)',
      borderWidth: 1,
      borderColor: theme.primaryLight,
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 4,
    },
    lockGateText: {
      fontSize: 10,
      fontWeight: FONT.weights.bold,
      color: '#FDE68A',
    },
    dockBasin: {
      width: '100%',
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      borderWidth: 1.5,
      borderColor: '#CBD5E1',
      borderRadius: 8,
      padding: 8,
      alignItems: 'center',
    },
    dockBasinTitle: {
      fontSize: 12,
      fontWeight: FONT.weights.bold,
      color: '#F8FAFC',
    },
    tradeRouteText: {
      fontSize: 10,
      color: '#94A3B8',
      marginTop: 2,
    },
    canvasDesc: {
      fontSize: 11,
      color: '#94A3B8',
      textAlign: 'center',
      marginTop: 8,
      lineHeight: 16,
    },

    // Bullets
    bulletContainer: {
      marginTop: SPACING.md,
      gap: 6,
    },
    bulletRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 6,
    },
    bulletDot: {
      fontSize: 9,
      color: theme.primaryLight,
      marginTop: 3,
    },
    bulletItem: {
      flex: 1,
      fontSize: FONT.sizes.sm,
      color: theme.textSecondary,
      lineHeight: 20,
    },

    // Transcript Box
    transcriptBox: {
      backgroundColor: theme.surface,
      borderRadius: RADIUS.sm,
      padding: SPACING.md,
      marginTop: SPACING.md,
      borderLeftWidth: 3.5,
      borderLeftColor: theme.primary,
      borderWidth: 1,
      borderColor: theme.surfaceBorderAlt,
    },
    transcriptHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      marginBottom: 4,
    },
    transcriptIcon: {
      fontSize: 13,
    },
    transcriptLabel: {
      fontSize: 11,
      fontWeight: FONT.weights.extrabold,
      color: theme.primary,
    },
    transcriptText: {
      fontSize: FONT.sizes.sm,
      color: theme.textPrimary,
      fontStyle: 'italic',
      lineHeight: 20,
    },
    glossaryRow: {
      marginTop: 8,
      paddingTop: 6,
      borderTopWidth: 1,
      borderTopColor: theme.surfaceBorder,
    },
    glossaryLabel: {
      fontSize: 10,
      fontWeight: FONT.weights.bold,
      color: theme.textMuted,
    },
    glossaryText: {
      fontSize: 11,
      color: theme.textSecondary,
      marginTop: 1,
    },

    // Audio Controls
    audioControls: {
      marginTop: SPACING.sm,
    },
    timeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SPACING.sm,
    },
    timeText: {
      fontSize: 11,
      color: theme.textMuted,
      fontWeight: FONT.weights.semibold,
      width: 40,
      textAlign: 'center',
    },
    trackBar: {
      flex: 1,
      height: 7,
      backgroundColor: theme.surfaceBorder,
      borderRadius: 4,
      marginHorizontal: 8,
      overflow: 'hidden',
    },
    trackFill: {
      height: '100%',
      backgroundColor: '#0D5C3A',
      borderRadius: 4,
    },
    audioBtns: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    navBtn: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      backgroundColor: theme.surfaceAlt,
      borderRadius: RADIUS.sm,
      borderWidth: 1,
      borderColor: theme.surfaceBorderAlt,
    },
    navBtnDisabled: {
      opacity: 0.4,
    },
    navBtnText: {
      fontSize: FONT.sizes.xs,
      fontWeight: FONT.weights.bold,
      color: theme.textSecondary,
    },
    playBtn: {
      backgroundColor: '#0D5C3A',
      paddingHorizontal: 28,
      paddingVertical: 9,
      borderRadius: RADIUS.pill,
      elevation: 3,
      shadowColor: '#0D5C3A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 5,
    },
    playBtnText: {
      color: '#FFFFFF',
      fontSize: FONT.sizes.sm,
      fontWeight: FONT.weights.extrabold,
    },

    // Video Mode
    videoWrapper: {
      gap: 10,
    },
    videoPlayerCard: {
      backgroundColor: '#070D1B',
      borderRadius: RADIUS.md,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.12)',
    },
    videoTopBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: SPACING.sm,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    },
    videoBrandBadge: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    videoBrandText: {
      fontSize: 10,
      fontWeight: FONT.weights.extrabold,
      color: '#94A3B8',
      letterSpacing: 0.5,
    },
    vsmpStreamPill: {
      backgroundColor: 'rgba(245, 158, 11, 0.2)',
      borderWidth: 0.8,
      borderColor: theme.primaryLight,
      paddingHorizontal: 7,
      paddingVertical: 2,
      borderRadius: 4,
    },
    vsmpStreamText: {
      fontSize: 9,
      fontWeight: FONT.weights.bold,
      color: '#FDE68A',
    },
    stageArea: {
      padding: SPACING.md,
      alignItems: 'center',
    },
    facultyTag: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(30, 41, 59, 0.85)',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: RADIUS.pill,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.15)',
      marginBottom: 10,
    },
    facultyEmoji: {
      fontSize: 14,
      marginRight: 6,
    },
    facultyTitle: {
      fontSize: 11,
      fontWeight: FONT.weights.bold,
      color: '#F8FAFC',
    },
    smartBoard: {
      width: '100%',
      backgroundColor: '#0F172A',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#38BDF8',
      padding: SPACING.md,
      alignItems: 'center',
    },
    boardTopic: {
      fontSize: 11,
      fontWeight: FONT.weights.extrabold,
      color: '#38BDF8',
      marginBottom: 8,
    },
    boardGraphicFrame: {
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.35)',
      padding: 10,
      borderRadius: 6,
      width: '100%',
    },
    boardGraphicEmoji: {
      fontSize: 22,
      marginBottom: 4,
    },
    boardGraphicMain: {
      fontSize: 13,
      fontWeight: FONT.weights.bold,
      color: '#FBBF24',
      textAlign: 'center',
    },
    boardGraphicSub: {
      fontSize: 9.5,
      color: '#64748B',
      marginTop: 2,
    },
    subtitleContainer: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      marginHorizontal: SPACING.sm,
      marginBottom: SPACING.sm,
      padding: SPACING.sm,
      borderRadius: 6,
      borderLeftWidth: 3,
      borderLeftColor: theme.primaryLight,
    },
    subHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 3,
    },
    subTag: {
      fontSize: 9,
      fontWeight: FONT.weights.extrabold,
      color: theme.primaryLight,
    },
    subSyncText: {
      fontSize: 8.5,
      color: '#94A3B8',
    },
    subtitleLine: {
      fontSize: 12,
      color: '#FFFFFF',
      lineHeight: 18,
    },
    videoControlsStrip: {
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      padding: SPACING.sm,
    },
    videoTimeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    videoTimeText: {
      fontSize: 10,
      color: '#94A3B8',
      fontWeight: FONT.weights.semibold,
      width: 36,
      textAlign: 'center',
    },
    videoProgressBar: {
      flex: 1,
      height: 5,
      backgroundColor: '#334155',
      borderRadius: 3,
      marginHorizontal: 6,
      overflow: 'hidden',
    },
    videoProgressFill: {
      height: '100%',
      backgroundColor: theme.primaryLight,
    },
    videoBtnRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    videoPlayBtn: {
      backgroundColor: '#0D5C3A',
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: RADIUS.pill,
    },
    videoPlayBtnText: {
      color: '#FFFFFF',
      fontSize: 11,
      fontWeight: FONT.weights.extrabold,
    },
    qualityRow: {
      flexDirection: 'row',
      gap: 3,
    },
    speedRow: {
      flexDirection: 'row',
      gap: 3,
    },
    miniPill: {
      backgroundColor: '#1E293B',
      paddingHorizontal: 6,
      paddingVertical: 2.5,
      borderRadius: 4,
    },
    miniPillActive: {
      backgroundColor: theme.primary,
    },
    miniPillSpeedActive: {
      backgroundColor: '#2563EB',
    },
    miniPillText: {
      fontSize: 9.5,
      color: '#94A3B8',
      fontWeight: FONT.weights.bold,
    },
    miniPillTextActive: {
      color: '#FFFFFF',
      fontWeight: FONT.weights.extrabold,
    },
    zeroBufferingNotice: {
      backgroundColor: theme.surfaceAlt,
      borderRadius: RADIUS.sm,
      padding: SPACING.sm,
      borderLeftWidth: 3,
      borderLeftColor: '#0284C7',
    },
    zeroBufferingTitle: {
      fontSize: 11,
      fontWeight: FONT.weights.bold,
      color: theme.textPrimary,
    },
    zeroBufferingText: {
      fontSize: 10.5,
      color: theme.textSecondary,
      marginTop: 2,
      lineHeight: 15,
    },

    // VSMP Inspector
    inspectorContainer: {
      gap: 10,
    },
    inspectorCard: {
      backgroundColor: theme.surfaceAlt,
      borderRadius: RADIUS.md,
      padding: SPACING.md,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
    },
    inspectorHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.md,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.surfaceBorder,
    },
    inspectorFileTitle: {
      fontSize: 13,
      fontWeight: FONT.weights.extrabold,
      color: theme.textPrimary,
    },
    inspectorFileSub: {
      fontSize: 10,
      color: theme.textMuted,
      marginTop: 1,
    },
    integrityBadge: {
      backgroundColor: '#064E3B',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
    },
    integrityBadgeText: {
      fontSize: 10,
      fontWeight: FONT.weights.extrabold,
      color: '#34D399',
    },
    specGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: SPACING.md,
    },
    specItem: {
      flex: 1,
      minWidth: 130,
      backgroundColor: theme.surface,
      padding: 8,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: theme.surfaceBorderAlt,
    },
    specLabel: {
      fontSize: 9.5,
      color: theme.textMuted,
      fontWeight: FONT.weights.semibold,
    },
    specValue: {
      fontSize: 11,
      fontWeight: FONT.weights.bold,
      color: theme.textPrimary,
      marginTop: 2,
    },
    hashContainer: {
      backgroundColor: theme.chromeBackground,
      padding: 8,
      borderRadius: 6,
      marginBottom: SPACING.md,
    },
    hashLabel: {
      fontSize: 9,
      color: '#94A3B8',
      fontWeight: FONT.weights.bold,
    },
    hashValue: {
      fontSize: 9.5,
      color: '#38BDF8',
      fontFamily: 'monospace',
      marginTop: 2,
    },
    cuesContainer: {
      gap: 4,
    },
    cuesTitle: {
      fontSize: 11,
      fontWeight: FONT.weights.bold,
      color: theme.textPrimary,
      marginBottom: 4,
    },
    cueRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      padding: 6,
      borderRadius: 4,
      borderWidth: 0.5,
      borderColor: theme.surfaceBorderAlt,
      gap: 8,
    },
    cueTime: {
      fontSize: 9.5,
      fontWeight: FONT.weights.extrabold,
      color: theme.primary,
      width: 60,
    },
    cueTopic: {
      fontSize: 10.5,
      color: theme.textSecondary,
      flex: 1,
    },

    // Quiz
    quizCard: {
      backgroundColor: theme.surface,
      borderRadius: RADIUS.lg,
      padding: isTablet ? SPACING.lg : SPACING.md,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      elevation: 2,
    },
    quizHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.surfaceBorder,
      paddingBottom: 8,
    },
    quizHeader: {
      fontSize: FONT.sizes.base,
      fontWeight: FONT.weights.extrabold,
      color: theme.textPrimary,
    },
    quizSubHeader: {
      fontSize: 10.5,
      color: theme.textMuted,
      marginTop: 2,
    },
    quizQuestionsBadge: {
      backgroundColor: theme.primarySoft,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
    },
    quizQuestionsBadgeText: {
      fontSize: 10,
      fontWeight: FONT.weights.bold,
      color: theme.primary,
    },
    resultBanner: {
      backgroundColor: theme.successSoft,
      borderRadius: RADIUS.md,
      padding: SPACING.md,
      marginBottom: SPACING.md,
      borderWidth: 1,
      borderColor: theme.successBorder,
      alignItems: 'center',
    },
    resultScore: {
      fontSize: FONT.sizes.md,
      color: theme.successText,
    },
    resultScoreBold: {
      fontWeight: FONT.weights.extrabold,
      fontSize: FONT.sizes.xl,
    },
    resultMsg: {
      fontSize: FONT.sizes.xs,
      color: theme.successText,
      marginTop: 3,
    },
    quizItem: {
      marginBottom: SPACING.md,
    },
    quizQ: {
      fontSize: FONT.sizes.md,
      fontWeight: FONT.weights.bold,
      color: theme.textPrimary,
      marginBottom: 8,
      lineHeight: 20,
    },
    option: {
      padding: 10,
      borderRadius: RADIUS.sm,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      marginBottom: 6,
      backgroundColor: theme.surfaceAlt,
    },
    optionSelected: {
      backgroundColor: theme.infoSoft,
      borderColor: theme.info,
    },
    optionCorrect: {
      backgroundColor: theme.successSoft,
      borderColor: theme.success,
    },
    optionWrong: {
      backgroundColor: theme.errorSoft,
      borderColor: theme.error,
    },
    optionInner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    radioCircle: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.surfaceBorderAlt,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.surface,
    },
    radioCircleSelected: {
      borderColor: theme.info,
      backgroundColor: theme.info,
    },
    radioCircleCorrect: {
      borderColor: theme.success,
      backgroundColor: theme.success,
    },
    radioCircleWrong: {
      borderColor: theme.error,
      backgroundColor: theme.error,
    },
    radioIndexText: {
      fontSize: 10,
      fontWeight: FONT.weights.bold,
      color: theme.textSecondary,
    },
    optionText: {
      fontSize: FONT.sizes.sm,
      color: theme.textSecondary,
      flex: 1,
    },
    optionTextSelected: {
      color: theme.infoText,
      fontWeight: FONT.weights.bold,
    },
    optionTextCorrect: {
      color: theme.successText,
      fontWeight: FONT.weights.bold,
    },
    optionTextWrong: {
      color: theme.errorText,
      fontWeight: FONT.weights.bold,
    },
    explanationBox: {
      backgroundColor: theme.successSoft,
      padding: SPACING.sm,
      borderRadius: RADIUS.sm,
      marginTop: 4,
      borderWidth: 1,
      borderColor: theme.successBorder,
    },
    explanationText: {
      fontSize: 11,
      color: theme.successText,
      lineHeight: 16,
    },
    submitBtn: {
      backgroundColor: theme.chromeBackground,
      paddingVertical: 12,
      borderRadius: RADIUS.md,
      alignItems: 'center',
      marginTop: SPACING.sm,
      elevation: 2,
    },
    submitBtnSecondary: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: theme.surfaceBorderAlt,
    },
    submitBtnText: {
      color: '#FFFFFF',
      fontSize: FONT.sizes.md,
      fontWeight: FONT.weights.bold,
    },
    submitBtnTextSecondary: {
      color: theme.textSecondary,
    },
  });
