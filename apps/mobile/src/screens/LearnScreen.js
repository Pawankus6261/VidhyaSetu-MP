// VidyaSetu MP — Learn Screen (पाठशाला)
// Features: Student Audio-Slide Vector Player, 240p Ultra-Compressed E-Lecture, Offline Quiz, Full English & Dialect Support
// Real Vector Icons via @expo/vector-icons, Optimistic UI Navigation, Zero Emojis
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
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COURSE_MODULE } from '../data/courseModule';
import { SPACING, RADIUS, FONT } from '../constants/theme';
import { contentApi } from '../api/index.js';
import { downloadManager } from '../services/DownloadManager.js';
import { syncEngine } from '../services/SyncEngine.js';
import { lectureMediaService } from '../services/LectureMediaService.js';

export default function LearnScreen() {
  const { theme, dialect, DIALECTS, networkState, t, isEnglish, showToast } = useApp();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const s = makeStyles(theme, isTablet);

  const [mediaMode, setMediaMode] = useState('AUDIO_SLIDE'); // 'AUDIO_SLIDE' | 'VIDEO'
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoQuality, setVideoQuality] = useState('240p');
  const [playbackSpeed, setPlaybackSpeed] = useState('1.0x');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [showPlayOverlay, setShowPlayOverlay] = useState(false);
  const [eqBars, setEqBars] = useState([6, 14, 20, 10, 24, 16, 8, 18]);

  // Local-first .VSMP download & cache tracking
  const [isDownloaded, setIsDownloaded] = useState(
    downloadManager.isPackDownloaded('HIS_BA1_MOD1_INDUS_VALLEY')
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(100);

  useEffect(() => {
    const unsub = downloadManager.addListener(() => {
      setIsDownloaded(downloadManager.isPackDownloaded('HIS_BA1_MOD1_INDUS_VALLEY'));
    });
    return unsub;
  }, []);

  const handleDownloadPack = async () => {
    if (isDownloaded || isDownloading) return;
    setIsDownloading(true);
    const res = await downloadManager.startDownload(
      {
        id: 'HIS_BA1_MOD1_INDUS_VALLEY',
        title_hindi: COURSE_MODULE.module_title_hindi,
        title_english: COURSE_MODULE.module_title_english,
        pack_size_bytes: 17684,
      },
      (pct) => setDownloadProgress(pct)
    );
    setIsDownloading(false);
    if (res.isSuccess) {
      setIsDownloaded(true);
      if (showToast) {
        showToast(
          isEnglish ? 'History Module 1 cached for 0 kbps playback!' : 'इतिहास मॉड्यूल 1 0 kbps प्लेबैक हेतु सुरक्षित!',
          'success'
        );
      }
    }
  };

  const currentSlide = COURSE_MODULE.slides[currentSlideIndex];
  const AUDIO_DURATION = 165;
  const VIDEO_DURATION = 180;

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const sRem = sec % 60;
    return `${m < 10 ? '0' : ''}${m}:${sRem < 10 ? '0' : ''}${sRem}`;
  };

  const dialectObj = DIALECTS.find((d) => d.code === dialect);
  const dialectLabel = dialectObj?.label || 'हिंदी';

  const activeTranscript =
    currentSlide?.transcript?.[dialect] ||
    currentSlide?.transcript?.en ||
    currentSlide?.transcript?.hi ||
    '';

  const activeSlideTitle = (isEnglish ? currentSlide?.titleEn : currentSlide?.title) || '';
  const activeSlideSubtitle = (isEnglish ? currentSlide?.subtitleEn : currentSlide?.subtitle) || '';
  const activeBullets = (isEnglish ? currentSlide?.bulletsEn : currentSlide?.bullets) || [];
  const activeGlossary = (isEnglish ? currentSlide?.glossaryEn : currentSlide?.glossary) || '';

  // Calculate dynamic laser pointer focus sector in video mode
  const activeLaserSector = Math.floor((videoProgress % 18) / 6); // 0, 1, 2

  // Animate Equalizer Waveform bars while playing audio or video
  useEffect(() => {
    let waveInterval;
    if (isPlayingAudio || isPlayingVideo) {
      waveInterval = setInterval(() => {
        setEqBars([
          Math.floor(Math.random() * 16) + 6,
          Math.floor(Math.random() * 22) + 8,
          Math.floor(Math.random() * 28) + 10,
          Math.floor(Math.random() * 18) + 6,
          Math.floor(Math.random() * 26) + 8,
          Math.floor(Math.random() * 16) + 6,
          Math.floor(Math.random() * 24) + 8,
          Math.floor(Math.random() * 14) + 6,
        ]);
      }, 120);
    } else {
      setEqBars([4, 4, 4, 4, 4, 4, 4, 4]);
    }
    return () => clearInterval(waveInterval);
  }, [isPlayingAudio, isPlayingVideo]);

  // Clean up speech synthesis on component unmount
  useEffect(() => {
    return () => {
      lectureMediaService.stopLectureAudio();
    };
  }, []);

  // Audio timer
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

  // Video timer
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

  // Real offline speech synthesis narration helper
  const playLectureSpeech = (rate = playbackSpeed, slideText = activeTranscript) => {
    const rateVal = parseFloat(rate) || 1.0;
    const isEn = dialect === 'en' || isEnglish;
    lectureMediaService.playLectureAudio({
      text: slideText,
      lang: isEn ? 'en' : 'hi',
      rate: rateVal,
      onEnd: () => {
        setIsPlayingAudio(false);
        setIsPlayingVideo(false);
      },
    });
  };

  const handleToggleAudioPlay = () => {
    if (isPlayingAudio) {
      lectureMediaService.stopLectureAudio();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingVideo(false);
      setIsPlayingAudio(true);
      playLectureSpeech(playbackSpeed);
    }
  };

  const handleToggleVideoPlay = () => {
    setShowPlayOverlay(true);
    setTimeout(() => setShowPlayOverlay(false), 650);

    if (isPlayingVideo) {
      lectureMediaService.stopLectureAudio();
      setIsPlayingVideo(false);
    } else {
      setIsPlayingAudio(false);
      setIsPlayingVideo(true);
      playLectureSpeech(playbackSpeed);
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (isPlayingAudio || isPlayingVideo) {
      playLectureSpeech(speed);
    }
  };

  const handleSlideChange = (newIndex) => {
    lectureMediaService.stopLectureAudio();
    setIsPlayingAudio(false);
    setIsPlayingVideo(false);
    setAudioProgress(0);
    setVideoProgress(0);
    setCurrentSlideIndex(newIndex);
  };

  const handleSwitchMediaMode = (mode) => {
    lectureMediaService.stopLectureAudio();
    setIsPlayingAudio(false);
    setIsPlayingVideo(false);
    setMediaMode(mode);
  };

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

    const calculatedScore = COURSE_MODULE.quiz.filter(
      (q) => selectedAnswers[q.id] === q.correctIndex
    ).length;

    setShowResult(true);

    // Enqueue learning progress mutation for background sync
    const pctScore = Math.round((calculatedScore / COURSE_MODULE.quiz.length) * 100);
    syncEngine.enqueueMutation('learning_progress', 'HIS_BA1_MOD1_INDUS_VALLEY', 'UPSERT', {
      lesson_id: 'HIS_BA1_MOD1_INDUS_VALLEY',
      course_id: 'COURSE_HIS_BA1',
      quiz_score: pctScore,
      completed_seconds: audioProgress || 165,
      is_completed: true,
      timestamp: Date.now(),
    });

    if (showToast) {
      showToast(
        isEnglish
          ? `Quiz passed (${calculatedScore}/${COURSE_MODULE.quiz.length})! Progress saved locally & queued for sync.`
          : `प्रश्नोत्तरी संपन्न (${calculatedScore}/${COURSE_MODULE.quiz.length})! प्रगति सुरक्षित, सिग्नल पर स्वतः सिंक होगी।`,
        'success'
      );
    }
  };

  const score = COURSE_MODULE.quiz.filter(
    (q) => selectedAnswers[q.id] === q.correctIndex
  ).length;

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <View style={s.adaptiveWrapper}>
        {/* HERO MODULE CARD */}
        <View style={s.moduleCard}>
          <View style={s.metaRow}>
            <View style={s.vsmpBadge}>
              <Ionicons name="book-outline" size={11} color="#34D399" />
              <Text style={s.vsmpBadgeText}>{isEnglish ? 'History Module 1' : 'इतिहास भाग 1'}</Text>
            </View>
            <View style={s.degreeBadge}>
              <Text style={s.degreeBadgeText}>{COURSE_MODULE.degree_stream}</Text>
            </View>
            <TouchableOpacity
              style={[
                s.offlineReadyBadge,
                isDownloaded && { borderColor: 'rgba(52, 211, 153, 0.4)', backgroundColor: 'rgba(52, 211, 153, 0.1)' }
              ]}
              onPress={handleDownloadPack}
              activeOpacity={0.7}
              disabled={isDownloaded || isDownloading}
            >
              <Ionicons
                name={
                  isDownloaded
                    ? 'shield-checkmark'
                    : isDownloading
                    ? 'sync-outline'
                    : 'cloud-download-outline'
                }
                size={11}
                color={isDownloaded ? '#34D399' : theme.primaryLight}
              />
              <Text
                style={[
                  s.offlineReadyText,
                  isDownloaded && { color: '#34D399', fontWeight: '700' }
                ]}
              >
                {isDownloaded
                  ? (isEnglish ? '100% Offline (.VSMP)' : '100% ऑफलाइन (.VSMP)')
                  : isDownloading
                  ? `${downloadProgress}% ...`
                  : (isEnglish ? 'Download .VSMP' : '.VSMP डाउनलोड')}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={s.moduleTitle}>
            {isEnglish ? COURSE_MODULE.module_title_english : COURSE_MODULE.module_title_hindi}
          </Text>
          <View style={s.universityRow}>
            <Ionicons name="school-outline" size={13} color={theme.textMuted} />
            <Text style={s.moduleSubtitle}>
              {COURSE_MODULE.university} • {COURSE_MODULE.syllabusRef}
            </Text>
          </View>

          {/* 2-WAY MEDIA MODE SWITCHER */}
          <View style={s.modeToggle}>
            {[
              { key: 'AUDIO_SLIDE', icon: 'headset-outline', label: isEnglish ? 'Audio-Slide' : 'ऑडियो-स्लाइड' },
              { key: 'VIDEO',       icon: 'videocam-outline', label: isEnglish ? 'E-Lecture'   : 'ई-व्याख्यान' },
            ].map((m) => {
              const active = mediaMode === m.key;
              return (
                <TouchableOpacity
                  key={m.key}
                  style={[s.modeBtn, active && s.modeBtnActive]}
                  onPress={() => handleSwitchMediaMode(m.key)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={m.icon}
                    size={14}
                    color={active ? '#FFFFFF' : theme.textMuted}
                  />
                  <Text style={[s.modeBtnText, active && s.modeBtnTextActive]}>
                    {m.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* MODE 1: AUDIO-SLIDE VECTOR PLAYER */}
          {mediaMode === 'AUDIO_SLIDE' && (
            <View style={s.slidePlayerContainer}>
              {/* Stepper */}
              <View style={s.stepperRow}>
                {(COURSE_MODULE?.slides || []).map((sl, idx) => {
                  const isActive = currentSlideIndex === idx;
                  return (
                    <TouchableOpacity
                      key={sl.slideIndex}
                      style={[s.stepTab, isActive && s.stepTabActive]}
                      onPress={() => handleSlideChange(idx)}
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
                          <View style={s.pillIconRow}>
                            <Ionicons name="business-outline" size={13} color="#93C5FD" />
                            <Text style={s.citadelTitle}>
                              {isEnglish ? 'CITADEL (WESTERN MOUND)' : 'सिटाडेल (पश्चिमी टीला)'}
                            </Text>
                          </View>
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
                          <View style={s.pillIconRow}>
                            <Ionicons name="home-outline" size={13} color="#6EE7B7" />
                            <Text style={s.lowerTownTitle}>
                              {isEnglish ? 'LOWER TOWN (RESIDENTIAL)' : 'निचला नगर (आवासीय क्षेत्र)'}
                            </Text>
                          </View>
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
                        <Text style={s.bathStairText}>{isEnglish ? '▲ North Stairway' : '▲ उत्तरी सीढ़ियां'}</Text>
                        <View style={s.bathReservoir}>
                          <View style={s.pillIconRow}>
                            <Ionicons name="water-outline" size={14} color="#67E8F9" />
                            <Text style={s.bathPoolText}>11.88m × 7.01m × 2.43m</Text>
                          </View>
                          <View style={s.bitumenBadge}>
                            <Ionicons name="shield-outline" size={11} color="#FDE68A" />
                            <Text style={s.bitumenBadgeText}>
                              {isEnglish ? 'Bitumen + Gypsum Waterproofing' : 'बिटुमेन (डामर) + जिप्सम जलरोधी लेप'}
                            </Text>
                          </View>
                        </View>
                        <Text style={s.bathStairText}>{isEnglish ? '▼ South Stairway' : '▼ दक्षिणी सीढ़ियां'}</Text>
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
                          <View style={s.pillIconRow}>
                            <Ionicons name="git-branch-outline" size={13} color="#93C5FD" />
                            <Text style={s.riverText}>
                              {isEnglish ? 'Bhogwa River Tidal Ingress' : 'भोगवा नदी ज्वार जलप्रवाह'}
                            </Text>
                          </View>
                        </View>
                        <View style={s.lockGateBox}>
                          <View style={s.pillIconRow}>
                            <Ionicons name="cog-outline" size={12} color="#FDE68A" />
                            <Text style={s.lockGateText}>
                              {isEnglish ? 'Sluice Lock-Gate (Tidal Control)' : 'लकड़ी का लॉक-गेट (ज्वार नियंत्रण)'}
                            </Text>
                          </View>
                        </View>
                        <View style={s.dockBasin}>
                          <View style={s.pillIconRow}>
                            <Ionicons name="boat-outline" size={13} color="#F8FAFC" />
                            <Text style={s.dockBasinTitle}>
                              {isEnglish ? 'Fired-Brick Wharf (214m × 36m)' : 'पक्की ईंटों का गोदी बेसिन (214m × 36m)'}
                            </Text>
                          </View>
                          <Text style={s.tradeRouteText}>
                            {isEnglish ? 'Mesopotamia & Oman Maritime Silk Route' : 'मेसोपोटामिया एवं ओमान से सील-मोहर व्यापार'}
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
                  {(activeBullets || []).map((b, i) => (
                    <View key={i} style={s.bulletRow}>
                      <View style={s.bulletDot} />
                      <Text style={s.bulletItem}>{b}</Text>
                    </View>
                  ))}
                </View>

                {/* Audio Transcript */}
                <View style={s.transcriptBox}>
                  <View style={s.transcriptHeader}>
                    <Ionicons name="mic-outline" size={13} color={theme.primaryLight} />
                    <Text style={s.transcriptLabel}>
                      {isEnglish ? `Audio Transcript (${dialectLabel}):` : `ऑडियो व्याख्या (${dialectLabel}):`}
                    </Text>
                  </View>
                  <Text style={s.transcriptText}>"{activeTranscript}"</Text>
                  {activeGlossary && (
                    <View style={s.glossaryRow}>
                      <Ionicons name="bulb-outline" size={12} color={theme.primaryLight} />
                      <Text style={s.glossaryLabel}>{isEnglish ? 'Glossary:' : 'शब्दावली:'}</Text>
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

                {/* Animated EQ Bars when audio playing */}
                <View style={s.audioEqRow}>
                  {eqBars.map((h, i) => (
                    <View
                      key={i}
                      style={[
                        s.audioEqBar,
                        { height: isPlayingAudio ? h : 3 },
                        isPlayingAudio && { backgroundColor: theme.primaryLight },
                      ]}
                    />
                  ))}
                </View>

                <View style={s.audioBtns}>
                  <TouchableOpacity
                    style={[s.navBtn, currentSlideIndex === 0 && s.navBtnDisabled]}
                    disabled={currentSlideIndex === 0}
                    onPress={() => handleSlideChange(Math.max(0, currentSlideIndex - 1))}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="chevron-back" size={15} color={theme.textSecondary} />
                    <Text style={s.navBtnText}>{t.learn.prev}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={s.audioJumpBtn}
                    onPress={() => setAudioProgress((p) => Math.max(0, p - 10))}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="play-back-outline" size={14} color={theme.textSecondary} />
                    <Text style={s.audioJumpText}>-10s</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={s.playBtn}
                    onPress={handleToggleAudioPlay}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={isPlayingAudio ? 'pause' : 'play'}
                      size={18}
                      color="#FFFFFF"
                    />
                    <Text style={s.playBtnText}>
                      {isPlayingAudio ? t.learn.pause : t.learn.listen}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={s.audioJumpBtn}
                    onPress={() => setAudioProgress((p) => Math.min(AUDIO_DURATION, p + 10))}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="play-forward-outline" size={14} color={theme.textSecondary} />
                    <Text style={s.audioJumpText}>+10s</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      s.navBtn,
                      currentSlideIndex === COURSE_MODULE.slides.length - 1 && s.navBtnDisabled,
                    ]}
                    disabled={currentSlideIndex === COURSE_MODULE.slides.length - 1}
                    onPress={() =>
                      handleSlideChange(
                        Math.min(COURSE_MODULE.slides.length - 1, currentSlideIndex + 1)
                      )
                    }
                    activeOpacity={0.7}
                  >
                    <Text style={s.navBtnText}>{t.learn.next}</Text>
                    <Ionicons name="chevron-forward" size={15} color={theme.textSecondary} />
                  </TouchableOpacity>
                </View>

                {/* Speed Row for Audio */}
                <View style={s.audioSpeedRow}>
                  <Text style={s.audioSpeedLabel}>{isEnglish ? 'Playback Speed:' : 'ऑडियो गति:'}</Text>
                  {['1.0x', '1.25x', '1.5x'].map((sp) => (
                    <TouchableOpacity
                      key={sp}
                      style={[s.miniPill, playbackSpeed === sp && s.miniPillSpeedActive]}
                      onPress={() => handleSpeedChange(sp)}
                    >
                      <Text style={[s.miniPillText, playbackSpeed === sp && s.miniPillTextActive]}>
                        {sp}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* MODE 2: 240p ULTRA-COMPRESSED VIDEO (VECTOR CINEMA) */}
          {mediaMode === 'VIDEO' && (
            <View style={s.videoWrapper}>
              <View style={s.videoPlayerCard}>
                {/* VIDEO TOP HUD */}
                <View style={s.videoTopBar}>
                  <View style={s.videoBrandBadge}>
                    <View style={[s.recDot, isPlayingVideo && s.recDotLive]} />
                    <Text style={[s.videoBrandText, isPlayingVideo && s.videoBrandTextLive]}>
                      {isPlayingVideo
                        ? (isEnglish ? 'REC • LIVE E-LECTURE' : 'लाइव • ई-व्याख्यान प्रसारण')
                        : (isEnglish ? 'E-LECTURE CINEMA' : 'ई-व्याख्यान सिनेमा')}
                    </Text>
                  </View>
                  <View style={s.videoMetaRight}>
                    <View style={s.vsmpStreamPill}>
                      <Text style={s.vsmpStreamText}>
                        .VSMP • {videoQuality} ({networkState.isOnline ? '110 kbps' : '0 kbps Offline'})
                      </Text>
                    </View>
                    <View style={s.slideCountPill}>
                      <Text style={s.slideCountText}>
                        {isEnglish ? `Part ${currentSlideIndex + 1}/3` : `भाग ${currentSlideIndex + 1}/3`}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* 16:9 CINEMA STAGE & INTERACTIVE CANVAS */}
                <TouchableOpacity
                  style={s.cinemaStage}
                  activeOpacity={0.95}
                  onPress={handleToggleVideoPlay}
                >
                  {/* Topic Title Ribbon */}
                  <View style={s.stageTopicBar}>
                    <Ionicons name="film-outline" size={13} color="#38BDF8" />
                    <Text style={s.stageTopicTitle} numberOfLines={1}>
                      {activeSlideTitle}
                    </Text>
                  </View>

                  {/* Archaeological Vector Reconstruction Stage */}
                  <View style={s.cinemaCanvasArea}>
                    {currentSlideIndex === 0 && (
                      <View style={s.videoDiagram}>
                        <Text style={s.videoDiagramTitle}>
                          [ {isEnglish ? 'HARAPPAN URBAN GRID PLANNING' : 'हड़प्पा समकोण नगर नियोजन ग्रिड'} ]
                        </Text>
                        
                        <View style={s.videoGridGraphic}>
                          {/* Western Citadel */}
                          <View
                            style={[
                              s.videoSectorCard,
                              s.citadelVideoCard,
                              activeLaserSector === 0 && s.videoSectorActive,
                            ]}
                          >
                            <View style={s.pillIconRow}>
                              <Ionicons name="business" size={14} color="#93C5FD" />
                              <Text style={s.citadelVideoTitle}>
                                {isEnglish ? 'CITADEL (UPPER FORTRESS)' : 'सिटाडेल (पश्चिमी दुर्ग)'}
                              </Text>
                              {activeLaserSector === 0 && (
                                <View style={s.laserMarker}>
                                  <View style={s.laserDot} />
                                  <Text style={s.laserText}>FOCUS</Text>
                                </View>
                              )}
                            </View>
                            <Text style={s.videoSectorDesc}>
                              {isEnglish ? 'Monumental Granary & Public Assembly' : 'विशाल अन्नागार व प्रशासनिक भवन'}
                            </Text>
                          </View>

                          {/* 90° Cross Streets */}
                          <View
                            style={[
                              s.videoSectorCard,
                              s.streetVideoCard,
                              activeLaserSector === 1 && s.videoSectorActive,
                            ]}
                          >
                            <View style={s.crossStreetRow}>
                              <View style={s.streetLineH} />
                              <View style={s.angleBadge}>
                                <Ionicons name="git-commit-outline" size={12} color="#FBBF24" />
                                <Text style={s.angleTag}>90° Orthogonal Streets</Text>
                              </View>
                              <View style={s.streetLineH} />
                            </View>
                            {activeLaserSector === 1 && (
                              <View style={s.laserMarkerCenter}>
                                <View style={s.laserDot} />
                                <Text style={s.laserText}>GRID AXIS FOCUS</Text>
                              </View>
                            )}
                          </View>

                          {/* Lower Town Drains */}
                          <View
                            style={[
                              s.videoSectorCard,
                              s.lowerTownVideoCard,
                              activeLaserSector === 2 && s.videoSectorActive,
                            ]}
                          >
                            <View style={s.pillIconRow}>
                              <Ionicons name="home" size={14} color="#6EE7B7" />
                              <Text style={s.lowerTownVideoTitle}>
                                {isEnglish ? 'LOWER TOWN RESIDENTIAL' : 'निचला आवासीय नगर'}
                              </Text>
                              {activeLaserSector === 2 && (
                                <View style={s.laserMarker}>
                                  <View style={s.laserDot} />
                                  <Text style={s.laserText}>FOCUS</Text>
                                </View>
                              )}
                            </View>
                            <Text style={s.videoSectorDesc}>
                              {isEnglish ? 'Kiln-Fired Subterranean Brick Drainage' : 'भूमिगत पक्की ईंटों की ढकी हुई नालियां'}
                            </Text>
                          </View>
                        </View>
                      </View>
                    )}

                    {currentSlideIndex === 1 && (
                      <View style={s.videoDiagram}>
                        <Text style={s.videoDiagramTitle}>
                          [ {isEnglish ? 'MOHENJO-DARO GREAT BATH' : 'मोहनजोदड़ो का विशाल स्नानागार'} ]
                        </Text>
                        
                        <View style={s.videoBathGraphic}>
                          <Text style={s.videoStairText}>▲ {isEnglish ? 'North Entrance Stairway' : 'उत्तरी सीढ़ियां'}</Text>
                          
                          <View
                            style={[
                              s.videoPoolReservoir,
                              activeLaserSector === 1 && s.videoSectorActive,
                            ]}
                          >
                            <View style={s.pillIconRow}>
                              <Ionicons name="water" size={16} color="#67E8F9" />
                              <Text style={s.videoPoolDimensions}>11.88m × 7.01m × 2.43m</Text>
                            </View>
                            <View style={s.waterRippleBar}>
                              <View style={s.rippleWave} />
                              <View style={[s.rippleWave, { opacity: 0.6 }]} />
                              <View style={[s.rippleWave, { opacity: 0.3 }]} />
                            </View>
                            <View
                              style={[
                                s.videoBitumenPill,
                                activeLaserSector === 2 && s.videoSectorActive,
                              ]}
                            >
                              <Ionicons name="shield-checkmark" size={12} color="#FDE68A" />
                              <Text style={s.videoBitumenText}>
                                {isEnglish ? 'Natural Bitumen & Gypsum Waterproofing' : 'प्राकृतिक बिटुमेन (डामर) + जिप्सम जलरोधी लेप'}
                              </Text>
                              {activeLaserSector === 2 && (
                                <View style={s.laserDot} />
                              )}
                            </View>
                          </View>

                          <Text style={s.videoStairText}>▼ {isEnglish ? 'South Entrance Stairway' : 'दक्षिणी सीढ़ियां'}</Text>
                        </View>
                      </View>
                    )}

                    {currentSlideIndex === 2 && (
                      <View style={s.videoDiagram}>
                        <Text style={s.videoDiagramTitle}>
                          [ {isEnglish ? 'LOTHAL MARITIME TIDAL DOCKYARD' : 'लोथल ज्वारीय गोदीबाड़ा एवं बंदरगाह'} ]
                        </Text>
                        
                        <View style={s.videoDockGraphic}>
                          {/* River Ingress */}
                          <View
                            style={[
                              s.videoRiverCard,
                              activeLaserSector === 0 && s.videoSectorActive,
                            ]}
                          >
                            <View style={s.pillIconRow}>
                              <Ionicons name="git-branch" size={14} color="#93C5FD" />
                              <Text style={s.videoRiverTitle}>
                                {isEnglish ? 'Bhogwa River Tidal Ingress Canal' : 'भोगवा नदी ज्वार जलप्रवाह नहर'}
                              </Text>
                              {activeLaserSector === 0 && <View style={s.laserDot} />}
                            </View>
                          </View>

                          {/* Sluice Gate */}
                          <View
                            style={[
                              s.videoLockGate,
                              activeLaserSector === 1 && s.videoSectorActive,
                            ]}
                          >
                            <View style={s.pillIconRow}>
                              <Ionicons name="cog" size={13} color="#FDE68A" />
                              <Text style={s.videoLockGateTitle}>
                                {isEnglish ? 'Wooden Sluice Lock-Gate (Tidal Control)' : 'लकड़ी का स्लूइस लॉक-गेट (ज्वार नियंत्रण)'}
                              </Text>
                              {activeLaserSector === 1 && <View style={s.laserDot} />}
                            </View>
                          </View>

                          {/* Wharf Basin */}
                          <View
                            style={[
                              s.videoBasinCard,
                              activeLaserSector === 2 && s.videoSectorActive,
                            ]}
                          >
                            <View style={s.pillIconRow}>
                              <Ionicons name="boat" size={15} color="#F8FAFC" />
                              <Text style={s.videoBasinTitle}>
                                {isEnglish ? 'Fired-Brick Basin (214m × 36m)' : 'पक्की ईंटों का गोदी बेसिन (214m × 36m)'}
                              </Text>
                            </View>
                            <Text style={s.videoTradeRoute}>
                              {isEnglish ? 'Maritime Route: Dilmun (Bahrain) & Mesopotamia' : 'समुद्री व्यापार: दिलमुन (बहरीन) एवं मेसोपोटामिया'}
                            </Text>
                          </View>
                        </View>
                      </View>
                    )}
                  </View>

                  {/* FACULTY PIP INSET (Picture-in-Picture) */}
                  <View style={s.facultyPipCard}>
                    <View style={s.pipAvatarWrap}>
                      <Ionicons name="person" size={22} color="#60A5FA" />
                      <View style={[s.pipMicBadge, isPlayingVideo && s.pipMicBadgeActive]}>
                        <Ionicons name="mic" size={9} color="#FFFFFF" />
                      </View>
                    </View>
                    <View style={s.pipInfo}>
                      <View style={s.pipStatusRow}>
                        <View style={[s.liveDot, isPlayingVideo && s.liveDotActive]} />
                        <Text style={[s.pipLiveText, isPlayingVideo && s.pipLiveTextActive]}>
                          {isPlayingVideo ? (isEnglish ? 'LIVE LECTURE' : 'लाइव व्याख्यान') : (isEnglish ? 'PAUSED' : 'विराम')}
                        </Text>
                      </View>
                      <Text style={s.pipNameText} numberOfLines={1}>
                        {isEnglish ? 'Dr. R.K. Sharma' : 'डॉ. आर. के. शर्मा'}
                      </Text>
                      {/* Bouncing Audio EQ Bars */}
                      <View style={s.pipEqRow}>
                        {eqBars.slice(0, 6).map((h, i) => (
                          <View
                            key={i}
                            style={[
                              s.pipEqBar,
                              { height: isPlayingVideo ? Math.min(18, h) : 3 },
                            ]}
                          />
                        ))}
                      </View>
                    </View>
                  </View>

                  {/* BIG CENTER PLAY OVERLAY WHEN PAUSED */}
                  {!isPlayingVideo && (
                    <View style={s.centerPlayOverlay}>
                      <View style={s.centerPlayCircle}>
                        <Ionicons name="play" size={28} color="#FFFFFF" style={{ marginLeft: 3 }} />
                      </View>
                      <View style={s.centerPlayBanner}>
                        <Ionicons name="flash-outline" size={12} color="#FDE68A" />
                        <Text style={s.centerPlayBannerText}>
                          {isEnglish ? 'Tap to Play E-Lecture • 0 kbps' : 'ई-व्याख्यान शुरू करें • 0 kbps'}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* TAP FEEDBACK RIPPLE */}
                  {showPlayOverlay && isPlayingVideo && (
                    <View style={s.tapFeedbackOverlay}>
                      <View style={s.tapFeedbackCircle}>
                        <Ionicons name="pause" size={24} color="#FFFFFF" />
                      </View>
                    </View>
                  )}
                </TouchableOpacity>

                {/* CLOSED CAPTIONS / SUBTITLE RIBBON */}
                <View style={s.subtitleContainer}>
                  <View style={s.subHeaderRow}>
                    <View style={s.ccBadge}>
                      <Ionicons name="chatbox-ellipses" size={11} color="#F59E0B" />
                      <Text style={s.subTag}>CC • {dialectLabel.toUpperCase()}</Text>
                    </View>
                    <View style={s.subSyncRow}>
                      <Ionicons name="volume-medium" size={11} color="#34D399" />
                      <Text style={s.subSyncText}>
                        {isEnglish ? 'Synchronized Indic Audio' : 'ऑडियो व्याख्या सिंक्रोनाइज्ड'}
                      </Text>
                    </View>
                  </View>
                  <Text style={s.subtitleLine}>"{activeTranscript}"</Text>
                </View>

                {/* VIDEO CONTROLS TOOLBAR */}
                <View style={s.videoControlsStrip}>
                  {/* Progress Timecode & Scrubber */}
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

                  {/* Main Action Buttons */}
                  <View style={s.videoBtnRow}>
                    {/* Prev Chapter */}
                    <TouchableOpacity
                      style={[s.videoNavIconBtn, currentSlideIndex === 0 && s.navBtnDisabled]}
                      disabled={currentSlideIndex === 0}
                      onPress={() => handleSlideChange(Math.max(0, currentSlideIndex - 1))}
                    >
                      <Ionicons name="play-skip-back" size={14} color="#CBD5E1" />
                    </TouchableOpacity>

                    {/* -10s */}
                    <TouchableOpacity
                      style={s.videoNavIconBtn}
                      onPress={() => setVideoProgress((p) => Math.max(0, p - 10))}
                    >
                      <Ionicons name="play-back-outline" size={14} color="#CBD5E1" />
                    </TouchableOpacity>

                    {/* PLAY / PAUSE BUTTON */}
                    <TouchableOpacity
                      style={s.videoPlayBtn}
                      onPress={handleToggleVideoPlay}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={isPlayingVideo ? 'pause' : 'play'}
                        size={15}
                        color="#FFFFFF"
                      />
                      <Text style={s.videoPlayBtnText}>
                        {isPlayingVideo ? t.learn.pause : t.learn.play}
                      </Text>
                    </TouchableOpacity>

                    {/* +10s */}
                    <TouchableOpacity
                      style={s.videoNavIconBtn}
                      onPress={() => setVideoProgress((p) => Math.min(VIDEO_DURATION, p + 10))}
                    >
                      <Ionicons name="play-forward-outline" size={14} color="#CBD5E1" />
                    </TouchableOpacity>

                    {/* Next Chapter */}
                    <TouchableOpacity
                      style={[
                        s.videoNavIconBtn,
                        currentSlideIndex === COURSE_MODULE.slides.length - 1 && s.navBtnDisabled,
                      ]}
                      disabled={currentSlideIndex === COURSE_MODULE.slides.length - 1}
                      onPress={() =>
                        handleSlideChange(
                          Math.min(COURSE_MODULE.slides.length - 1, currentSlideIndex + 1)
                        )
                      }
                    >
                      <Ionicons name="play-skip-forward" size={14} color="#CBD5E1" />
                    </TouchableOpacity>

                    {/* Quality pills */}
                    <View style={s.qualityRow}>
                      {['240p', '360p'].map((q) => (
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

                    {/* Speed pills */}
                    <View style={s.speedRow}>
                      {['1.0x', '1.25x', '1.5x'].map((sp) => (
                        <TouchableOpacity
                          key={sp}
                          style={[s.miniPill, playbackSpeed === sp && s.miniPillSpeedActive]}
                          onPress={() => handleSpeedChange(sp)}
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
                <View style={s.zeroBufferingHeader}>
                  <Ionicons name="flash" size={14} color={theme.primaryLight} />
                  <Text style={s.zeroBufferingTitle}>
                    {isEnglish ? 'VSMP Zero-Buffering Playback' : 'विद्यासेतु शून्य-बफरिंग तकनीक'}
                  </Text>
                </View>
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
                {(COURSE_MODULE?.quiz || []).length} {isEnglish ? 'Questions' : 'प्रश्न'}
              </Text>
            </View>
          </View>

          {showResult && (
            <View style={s.resultBanner}>
              <View style={s.scoreRow}>
                <Ionicons
                  name={score === (COURSE_MODULE?.quiz || []).length ? 'trophy-outline' : 'ribbon-outline'}
                  size={20}
                  color={theme.successText}
                />
                <Text style={s.resultScore}>
                  {t.learn.scoreCard}:{' '}
                  <Text style={s.resultScoreBold}>{score}/{(COURSE_MODULE?.quiz || []).length}</Text>
                </Text>
              </View>
              <Text style={s.resultMsg}>
                {score === (COURSE_MODULE?.quiz || []).length
                  ? (isEnglish ? 'Outstanding! You have mastered this chapter.' : 'शानदार! आप इस अध्याय में पारंगत हैं।')
                  : (isEnglish ? 'Good effort! Review the detailed solutions below.' : 'पुनः प्रयास करें — सही उत्तर नीचे देखें।')}
              </Text>
            </View>
          )}

          {(COURSE_MODULE?.quiz || []).map((q, idx) => {
            const qText = isEnglish ? q.questionEn : q.question;
            const optionsList = (isEnglish ? q.optionsEn : q.options) || [];
            const expText = isEnglish ? q.explanationEn : q.explanation;

            return (
              <View key={q.id} style={s.quizItem}>
                <Text style={s.quizQ}>{idx + 1}. {qText}</Text>
                {(optionsList || []).map((opt, oi) => {
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
                          {showResult && isCorrect ? (
                            <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                          ) : showResult && isWrong ? (
                            <Ionicons name="close" size={13} color="#FFFFFF" />
                          ) : (
                            <Text style={s.radioIndexText}>
                              {isEnglish ? ['A', 'B', 'C', 'D'][oi] : ['क', 'ख', 'ग', 'घ'][oi]}
                            </Text>
                          )}
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
                    <View style={s.explanationHeader}>
                      <Ionicons name="book-outline" size={13} color={theme.successText} />
                      <Text style={s.explanationAnswerTag}>
                        {t.learn.correctAnswer}:{' '}
                        {isEnglish ? ['A', 'B', 'C', 'D'][q.correctIndex] : ['क', 'ख', 'ग', 'घ'][q.correctIndex]}
                      </Text>
                    </View>
                    <Text style={s.explanationText}>{expText}</Text>
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
      paddingBottom: 95,
      alignItems: 'center',
    },
    adaptiveWrapper: {
      width: '100%',
      maxWidth: isTablet ? 760 : '100%',
    },

    // Module Card
    moduleCard: {
      backgroundColor: theme.surface,
      borderRadius: RADIUS.xl,
      padding: isTablet ? SPACING.lg : SPACING.md,
      marginBottom: SPACING.md,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      elevation: 4,
      shadowColor: theme.cardShadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 10,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      flexWrap: 'wrap',
      gap: 6,
    },
    vsmpBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(16, 185, 129, 0.12)',
      paddingHorizontal: 8,
      paddingVertical: 3.5,
      borderRadius: RADIUS.pill,
      borderWidth: 1,
      borderColor: 'rgba(16, 185, 129, 0.35)',
      gap: 4,
    },
    vsmpBadgeText: {
      color: '#34D399',
      fontSize: 10,
      fontWeight: FONT.weights.black,
      letterSpacing: 0.4,
    },
    degreeBadge: {
      backgroundColor: theme.primarySoft,
      paddingHorizontal: 8,
      paddingVertical: 3.5,
      borderRadius: RADIUS.pill,
      borderWidth: 1,
      borderColor: theme.primaryBorder,
    },
    degreeBadgeText: {
      color: theme.primaryLight,
      fontSize: 10,
      fontWeight: FONT.weights.bold,
    },
    offlineReadyBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
      paddingHorizontal: 8,
      paddingVertical: 3.5,
      borderRadius: RADIUS.pill,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      gap: 4,
    },
    offlineReadyText: {
      fontSize: 9.5,
      color: theme.textMuted,
      fontWeight: FONT.weights.semibold,
    },
    moduleTitle: {
      fontSize: isTablet ? FONT.sizes.xxl : FONT.sizes.xl,
      fontWeight: FONT.weights.extrabold,
      color: theme.textPrimary,
      lineHeight: isTablet ? 32 : 28,
      letterSpacing: 0.2,
      marginTop: 2,
    },
    universityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      marginTop: 4,
      marginBottom: SPACING.md,
    },
    moduleSubtitle: {
      fontSize: FONT.sizes.xs,
      color: theme.textMuted,
      fontWeight: FONT.weights.medium,
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
      flexDirection: 'row',
      justifyContent: 'center',
      paddingVertical: 8,
      alignItems: 'center',
      borderRadius: RADIUS.sm,
      gap: 5,
    },
    modeBtnActive: {
      backgroundColor: theme.chromeBackground,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    modeBtnText: {
      fontSize: FONT.sizes.xs,
      fontWeight: FONT.weights.semibold,
      color: theme.textMuted,
    },
    modeBtnTextActive: {
      color: '#FFFFFF',
      fontWeight: FONT.weights.extrabold,
    },

    // Slide Player
    slidePlayerContainer: {
      gap: 10,
    },
    stepperRow: {
      flexDirection: 'row',
      gap: 6,
      marginBottom: 6,
    },
    stepTab: {
      flex: 1,
      paddingVertical: 6,
      paddingHorizontal: 8,
      borderRadius: RADIUS.sm,
      backgroundColor: theme.surfaceAlt,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      alignItems: 'center',
    },
    stepTabActive: {
      backgroundColor: 'rgba(245, 158, 11, 0.12)',
      borderColor: theme.primaryLight,
    },
    stepNum: {
      fontSize: 11,
      fontWeight: FONT.weights.extrabold,
      color: theme.textMuted,
    },
    stepNumActive: {
      color: theme.primaryLight,
    },
    stepLabel: {
      fontSize: 9.5,
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
      borderRadius: RADIUS.lg,
      padding: isTablet ? SPACING.lg : SPACING.md,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      marginBottom: SPACING.xs,
    },
    canvasHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: SPACING.sm,
      gap: 8,
    },
    canvasTitleGroup: {
      flex: 1,
    },
    canvasSlideTitle: {
      fontSize: FONT.sizes.base,
      fontWeight: FONT.weights.extrabold,
      color: theme.textPrimary,
      lineHeight: 20,
    },
    canvasSlideSubtitle: {
      fontSize: 10.5,
      color: theme.textMuted,
      marginTop: 2,
    },
    vectorTag: {
      backgroundColor: 'rgba(245, 158, 11, 0.15)',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: RADIUS.xs,
      borderWidth: 0.5,
      borderColor: theme.primaryLight,
    },
    vectorTagText: {
      fontSize: 8.5,
      fontWeight: FONT.weights.extrabold,
      color: theme.primaryLight,
      letterSpacing: 0.4,
    },

    // Blueprint Box
    blueprintBox: {
      backgroundColor: '#090F1E',
      borderRadius: RADIUS.md,
      padding: SPACING.md,
      borderWidth: 1,
      borderColor: 'rgba(56, 189, 248, 0.25)',
      alignItems: 'center',
    },
    diagramContent: {
      width: '100%',
      alignItems: 'center',
    },
    diagramHeader: {
      fontSize: 10,
      color: '#38BDF8',
      fontWeight: FONT.weights.extrabold,
      letterSpacing: 0.8,
      marginBottom: 10,
    },
    gridGraphic: {
      width: '100%',
      alignItems: 'center',
      gap: 6,
    },
    citadelPill: {
      width: '92%',
      backgroundColor: 'rgba(30, 58, 138, 0.4)',
      padding: 10,
      borderRadius: RADIUS.sm,
      borderWidth: 1,
      borderColor: '#3B82F6',
      alignItems: 'center',
    },
    pillIconRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    citadelTitle: {
      fontSize: 11.5,
      fontWeight: FONT.weights.extrabold,
      color: '#93C5FD',
    },
    citadelDesc: {
      fontSize: 10,
      color: '#DBEAFE',
      marginTop: 2,
    },
    crossStreetRow: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '85%',
      justifyContent: 'center',
      gap: 8,
      marginVertical: 2,
    },
    streetLineH: {
      flex: 1,
      height: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    angleTag: {
      fontSize: 9.5,
      color: '#FBBF24',
      fontWeight: FONT.weights.bold,
      backgroundColor: 'rgba(245, 158, 11, 0.15)',
      paddingHorizontal: 6,
      paddingVertical: 1.5,
      borderRadius: 4,
    },
    lowerTownPill: {
      width: '92%',
      backgroundColor: 'rgba(6, 78, 59, 0.35)',
      padding: 10,
      borderRadius: RADIUS.sm,
      borderWidth: 1,
      borderColor: 'rgba(16, 185, 129, 0.4)',
      alignItems: 'center',
    },
    lowerTownTitle: {
      fontSize: 11.5,
      fontWeight: FONT.weights.extrabold,
      color: '#6EE7B7',
    },
    lowerTownDesc: {
      fontSize: 10,
      color: '#D1FAE5',
      marginTop: 2,
    },

    // Bath Graphic
    bathGraphic: {
      width: '94%',
      alignItems: 'center',
      gap: 4,
    },
    bathStairText: {
      fontSize: 9.5,
      color: '#94A3B8',
      fontWeight: FONT.weights.semibold,
    },
    bathReservoir: {
      width: '100%',
      backgroundColor: 'rgba(14, 116, 144, 0.3)',
      borderWidth: 1.5,
      borderColor: '#06B6D4',
      borderRadius: RADIUS.md,
      padding: 12,
      alignItems: 'center',
    },
    bathPoolText: {
      fontSize: 12.5,
      fontWeight: FONT.weights.extrabold,
      color: '#67E8F9',
    },
    bitumenBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      marginTop: 6,
      borderWidth: 0.5,
      borderColor: '#F59E0B',
      gap: 4,
    },
    bitumenBadgeText: {
      fontSize: 9.5,
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
      borderRadius: RADIUS.xs,
      alignItems: 'center',
    },
    riverText: {
      fontSize: 10.5,
      fontWeight: FONT.weights.bold,
      color: '#93C5FD',
    },
    lockGateBox: {
      backgroundColor: 'rgba(217, 119, 6, 0.25)',
      borderWidth: 1,
      borderColor: theme.primaryLight,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 4,
    },
    lockGateText: {
      fontSize: 9.5,
      fontWeight: FONT.weights.bold,
      color: '#FDE68A',
    },
    dockBasin: {
      width: '100%',
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      borderWidth: 1.5,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: RADIUS.sm,
      padding: 8,
      alignItems: 'center',
    },
    dockBasinTitle: {
      fontSize: 11.5,
      fontWeight: FONT.weights.bold,
      color: '#F8FAFC',
    },
    tradeRouteText: {
      fontSize: 9.5,
      color: '#94A3B8',
      marginTop: 2,
    },
    canvasDesc: {
      fontSize: 10.5,
      color: '#94A3B8',
      textAlign: 'center',
      marginTop: 8,
      lineHeight: 15,
    },

    // Bullets
    bulletContainer: {
      marginTop: SPACING.md,
      gap: 6,
    },
    bulletRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
    },
    bulletDot: {
      width: 5,
      height: 5,
      borderRadius: 2.5,
      backgroundColor: theme.primaryLight,
      marginTop: 6,
    },
    bulletItem: {
      flex: 1,
      fontSize: FONT.sizes.xs + 1,
      color: theme.textSecondary,
      lineHeight: 19,
    },

    // Transcript Box
    transcriptBox: {
      backgroundColor: theme.surface,
      borderRadius: RADIUS.md,
      padding: SPACING.md,
      marginTop: SPACING.md,
      borderLeftWidth: 3.5,
      borderLeftColor: theme.primaryLight,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
    },
    transcriptHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 4,
    },
    transcriptLabel: {
      fontSize: 10,
      fontWeight: FONT.weights.extrabold,
      color: theme.primaryLight,
      letterSpacing: 0.3,
    },
    transcriptText: {
      fontSize: FONT.sizes.xs + 0.5,
      color: theme.textPrimary,
      fontStyle: 'italic',
      lineHeight: 18,
    },
    glossaryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 8,
      paddingTop: 6,
      borderTopWidth: 1,
      borderTopColor: theme.surfaceBorder,
    },
    glossaryLabel: {
      fontSize: 10,
      fontWeight: FONT.weights.bold,
      color: theme.primaryLight,
    },
    glossaryText: {
      fontSize: 10.5,
      color: theme.textMuted,
      flex: 1,
    },

    // Audio Controls
    audioControls: {
      backgroundColor: theme.surfaceAlt,
      borderRadius: RADIUS.lg,
      padding: SPACING.md,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
    },
    timeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    timeText: {
      fontSize: 10,
      color: theme.textMuted,
      fontWeight: FONT.weights.semibold,
      width: 36,
      textAlign: 'center',
    },
    trackBar: {
      flex: 1,
      height: 6,
      backgroundColor: theme.surfaceBorder,
      borderRadius: 3,
      marginHorizontal: 8,
      overflow: 'hidden',
    },
    trackFill: {
      height: '100%',
      backgroundColor: theme.primaryLight,
      borderRadius: 3,
    },
    audioBtns: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    audioEqRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'center',
      gap: 4,
      height: 24,
      marginVertical: 6,
    },
    audioEqBar: {
      width: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 2,
    },
    audioJumpBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      paddingHorizontal: 8,
      paddingVertical: 6,
      backgroundColor: theme.surface,
      borderRadius: RADIUS.sm,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
    },
    audioJumpText: {
      fontSize: 10,
      color: theme.textSecondary,
      fontWeight: FONT.weights.bold,
    },
    audioSpeedRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 10,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: theme.surfaceBorder,
    },
    audioSpeedLabel: {
      fontSize: 10,
      color: theme.textMuted,
      fontWeight: FONT.weights.semibold,
    },
    navBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 12,
      paddingVertical: 7,
      backgroundColor: theme.surface,
      borderRadius: RADIUS.sm,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
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
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.primary,
      paddingHorizontal: 22,
      paddingVertical: 9,
      borderRadius: RADIUS.pill,
      elevation: 4,
      shadowColor: theme.primaryLight,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      gap: 6,
    },
    playBtnText: {
      color: '#FFFFFF',
      fontSize: FONT.sizes.xs + 1,
      fontWeight: FONT.weights.extrabold,
    },

    // Video Mode
    videoWrapper: {
      gap: 10,
    },
    videoPlayerCard: {
      backgroundColor: '#070D1B',
      borderRadius: RADIUS.lg,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    videoTopBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: SPACING.sm + 2,
      paddingVertical: 8,
      backgroundColor: 'rgba(0, 0, 0, 0.55)',
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    },
    videoBrandBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    recDot: {
      width: 7,
      height: 7,
      borderRadius: 3.5,
      backgroundColor: '#64748B',
    },
    recDotLive: {
      backgroundColor: '#EF4444',
    },
    videoBrandText: {
      fontSize: 9.5,
      fontWeight: FONT.weights.extrabold,
      color: '#94A3B8',
      letterSpacing: 0.5,
    },
    videoBrandTextLive: {
      color: '#FCA5A5',
    },
    videoMetaRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    vsmpStreamPill: {
      backgroundColor: 'rgba(245, 158, 11, 0.15)',
      borderWidth: 0.8,
      borderColor: theme.primaryLight,
      paddingHorizontal: 7,
      paddingVertical: 2,
      borderRadius: RADIUS.xs,
    },
    vsmpStreamText: {
      fontSize: 8.5,
      fontWeight: FONT.weights.bold,
      color: '#FDE68A',
    },
    slideCountPill: {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: RADIUS.xs,
    },
    slideCountText: {
      fontSize: 8.5,
      color: '#CBD5E1',
      fontWeight: FONT.weights.bold,
    },

    // 16:9 Cinema Stage & Stage Graphics
    cinemaStage: {
      width: '100%',
      minHeight: 250,
      backgroundColor: '#060B17',
      position: 'relative',
      overflow: 'hidden',
    },
    stageTopicBar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    },
    stageTopicTitle: {
      fontSize: 11,
      fontWeight: FONT.weights.extrabold,
      color: '#38BDF8',
      letterSpacing: 0.3,
    },
    cinemaCanvasArea: {
      width: '100%',
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 180,
    },
    videoDiagram: {
      width: '100%',
      alignItems: 'center',
    },
    videoDiagramTitle: {
      fontSize: 9.5,
      fontWeight: FONT.weights.black,
      color: '#94A3B8',
      letterSpacing: 0.8,
      marginBottom: 8,
    },
    videoGridGraphic: {
      width: '100%',
      alignItems: 'center',
      gap: 6,
    },
    videoSectorCard: {
      width: '96%',
      padding: 8,
      borderRadius: RADIUS.sm,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    citadelVideoCard: {
      backgroundColor: 'rgba(30, 58, 138, 0.35)',
      borderColor: '#3B82F6',
    },
    citadelVideoTitle: {
      fontSize: 11,
      fontWeight: FONT.weights.extrabold,
      color: '#93C5FD',
    },
    streetVideoCard: {
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      borderColor: 'rgba(255, 255, 255, 0.15)',
      alignItems: 'center',
    },
    lowerTownVideoCard: {
      backgroundColor: 'rgba(6, 78, 59, 0.35)',
      borderColor: 'rgba(16, 185, 129, 0.4)',
    },
    lowerTownVideoTitle: {
      fontSize: 11,
      fontWeight: FONT.weights.extrabold,
      color: '#6EE7B7',
    },
    videoSectorDesc: {
      fontSize: 9.5,
      color: '#CBD5E1',
      marginTop: 2,
    },
    videoSectorActive: {
      borderColor: '#F59E0B',
      backgroundColor: 'rgba(245, 158, 11, 0.18)',
      borderWidth: 1.5,
    },
    angleBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: 'rgba(245, 158, 11, 0.15)',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    laserMarker: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: 'rgba(239, 68, 68, 0.25)',
      paddingHorizontal: 5,
      paddingVertical: 1.5,
      borderRadius: 4,
      marginLeft: 'auto',
    },
    laserMarkerCenter: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: 'rgba(239, 68, 68, 0.25)',
      paddingHorizontal: 6,
      paddingVertical: 1.5,
      borderRadius: 4,
      marginTop: 4,
    },
    laserDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#EF4444',
    },
    laserText: {
      fontSize: 8,
      fontWeight: FONT.weights.black,
      color: '#FCA5A5',
      letterSpacing: 0.5,
    },
    videoBathGraphic: {
      width: '96%',
      alignItems: 'center',
      gap: 4,
    },
    videoStairText: {
      fontSize: 9,
      color: '#94A3B8',
      fontWeight: FONT.weights.semibold,
    },
    videoPoolReservoir: {
      width: '100%',
      backgroundColor: 'rgba(14, 116, 144, 0.3)',
      borderWidth: 1.5,
      borderColor: '#06B6D4',
      borderRadius: RADIUS.sm,
      padding: 8,
      alignItems: 'center',
    },
    videoPoolDimensions: {
      fontSize: 12,
      fontWeight: FONT.weights.extrabold,
      color: '#67E8F9',
    },
    waterRippleBar: {
      flexDirection: 'row',
      gap: 4,
      marginVertical: 4,
    },
    rippleWave: {
      width: 24,
      height: 2,
      backgroundColor: '#38BDF8',
      borderRadius: 1,
    },
    videoBitumenPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 4,
      marginTop: 4,
      borderWidth: 0.5,
      borderColor: '#F59E0B',
    },
    videoBitumenText: {
      fontSize: 9,
      fontWeight: FONT.weights.bold,
      color: '#FDE68A',
    },
    videoDockGraphic: {
      width: '96%',
      alignItems: 'center',
      gap: 6,
    },
    videoRiverCard: {
      width: '100%',
      backgroundColor: 'rgba(37, 99, 235, 0.25)',
      borderWidth: 1,
      borderColor: '#3B82F6',
      padding: 6,
      borderRadius: RADIUS.xs,
      alignItems: 'center',
    },
    videoRiverTitle: {
      fontSize: 10,
      fontWeight: FONT.weights.bold,
      color: '#93C5FD',
    },
    videoLockGate: {
      width: '92%',
      backgroundColor: 'rgba(217, 119, 6, 0.25)',
      borderWidth: 1,
      borderColor: theme.primaryLight,
      padding: 5,
      borderRadius: 4,
      alignItems: 'center',
    },
    videoLockGateTitle: {
      fontSize: 9.5,
      fontWeight: FONT.weights.bold,
      color: '#FDE68A',
    },
    videoBasinCard: {
      width: '100%',
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      borderWidth: 1.5,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: RADIUS.sm,
      padding: 7,
      alignItems: 'center',
    },
    videoBasinTitle: {
      fontSize: 11,
      fontWeight: FONT.weights.bold,
      color: '#F8FAFC',
    },
    videoTradeRoute: {
      fontSize: 9,
      color: '#94A3B8',
      marginTop: 2,
    },

    // Faculty PIP (Picture in Picture)
    facultyPipCard: {
      position: 'absolute',
      bottom: 8,
      right: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: 'rgba(15, 23, 42, 0.94)',
      borderWidth: 1,
      borderColor: 'rgba(56, 189, 248, 0.45)',
      paddingHorizontal: 8,
      paddingVertical: 6,
      borderRadius: RADIUS.sm,
      zIndex: 10,
    },
    pipAvatarWrap: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: 'rgba(59, 130, 246, 0.25)',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    pipMicBadge: {
      position: 'absolute',
      bottom: -2,
      right: -2,
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: '#64748B',
      alignItems: 'center',
      justifyContent: 'center',
    },
    pipMicBadgeActive: {
      backgroundColor: '#10B981',
    },
    pipInfo: {
      justifyContent: 'center',
    },
    pipStatusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    liveDot: {
      width: 5,
      height: 5,
      borderRadius: 2.5,
      backgroundColor: '#64748B',
    },
    liveDotActive: {
      backgroundColor: '#EF4444',
    },
    pipLiveText: {
      fontSize: 7.5,
      fontWeight: FONT.weights.black,
      color: '#94A3B8',
      letterSpacing: 0.3,
    },
    pipLiveTextActive: {
      color: '#FCA5A5',
    },
    pipNameText: {
      fontSize: 9.5,
      fontWeight: FONT.weights.extrabold,
      color: '#FFFFFF',
    },
    pipEqRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 2,
      marginTop: 2,
      height: 14,
    },
    pipEqBar: {
      width: 2.5,
      backgroundColor: '#38BDF8',
      borderRadius: 1.2,
    },

    // Center Play Overlay
    centerPlayOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
      zIndex: 5,
    },
    centerPlayCircle: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: 'rgba(245, 158, 11, 0.9)',
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 6,
    },
    centerPlayBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: 'rgba(15, 23, 42, 0.88)',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: RADIUS.pill,
      marginTop: 8,
      borderWidth: 1,
      borderColor: 'rgba(245, 158, 11, 0.4)',
    },
    centerPlayBannerText: {
      fontSize: 9.5,
      fontWeight: FONT.weights.bold,
      color: '#FDE68A',
    },
    tapFeedbackOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 5,
    },
    tapFeedbackCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Subtitles
    subtitleContainer: {
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      padding: SPACING.sm + 2,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.08)',
    },
    subHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    ccBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: 'rgba(245, 158, 11, 0.15)',
      paddingHorizontal: 5,
      paddingVertical: 1.5,
      borderRadius: 3,
    },
    subTag: {
      fontSize: 8.5,
      fontWeight: FONT.weights.black,
      color: '#F59E0B',
    },
    subSyncRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    subSyncText: {
      fontSize: 9,
      color: '#64748B',
    },
    subtitleLine: {
      fontSize: 11.5,
      color: '#FFFFFF',
      lineHeight: 16,
      fontStyle: 'italic',
    },

    // Video Controls
    videoControlsStrip: {
      backgroundColor: '#070D1B',
      padding: SPACING.sm + 2,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.08)',
    },
    videoTimeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    videoTimeText: {
      fontSize: 9.5,
      color: '#94A3B8',
      fontWeight: FONT.weights.semibold,
      width: 36,
      textAlign: 'center',
    },
    videoProgressBar: {
      flex: 1,
      height: 5,
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      borderRadius: 2.5,
      marginHorizontal: 8,
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
    videoNavIconBtn: {
      padding: 6,
      borderRadius: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
    videoPlayBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.primary,
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: RADIUS.pill,
      gap: 4,
    },
    videoPlayBtnText: {
      color: '#FFFFFF',
      fontSize: 10.5,
      fontWeight: FONT.weights.bold,
    },
    qualityRow: {
      flexDirection: 'row',
      gap: 4,
    },
    miniPill: {
      paddingHorizontal: 7,
      paddingVertical: 3,
      borderRadius: RADIUS.xs,
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
    miniPillActive: {
      backgroundColor: theme.primary,
    },
    miniPillSpeedActive: {
      backgroundColor: '#0284C7',
    },
    miniPillText: {
      fontSize: 9,
      color: '#94A3B8',
      fontWeight: FONT.weights.bold,
    },
    miniPillTextActive: {
      color: '#FFFFFF',
    },
    speedRow: {
      flexDirection: 'row',
      gap: 4,
    },
    zeroBufferingNotice: {
      backgroundColor: theme.surfaceAlt,
      padding: SPACING.md,
      borderRadius: RADIUS.md,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
    },
    zeroBufferingHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 3,
    },
    zeroBufferingTitle: {
      fontSize: 11,
      fontWeight: FONT.weights.bold,
      color: theme.primaryLight,
    },
    zeroBufferingText: {
      fontSize: 10.5,
      color: theme.textMuted,
      lineHeight: 15,
    },

    // VSMP Spec Inspector
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
      alignItems: 'flex-start',
      marginBottom: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.surfaceBorder,
      paddingBottom: 8,
    },
    inspectorFileTitle: {
      fontSize: 12,
      fontWeight: FONT.weights.extrabold,
      color: theme.textPrimary,
      fontFamily: 'monospace',
    },
    inspectorFileSub: {
      fontSize: 10,
      color: theme.textMuted,
      marginTop: 2,
    },
    integrityBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: RADIUS.pill,
      borderWidth: 1,
      borderColor: 'rgba(16, 185, 129, 0.35)',
      gap: 4,
    },
    integrityBadgeText: {
      fontSize: 9.5,
      fontWeight: FONT.weights.bold,
      color: '#34D399',
    },
    specGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: SPACING.md,
    },
    specItem: {
      width: '48%',
      backgroundColor: theme.surface,
      padding: 8,
      borderRadius: RADIUS.sm,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
    },
    specLabel: {
      fontSize: 9,
      color: theme.textMuted,
      fontWeight: FONT.weights.semibold,
    },
    specValue: {
      fontSize: 10.5,
      fontWeight: FONT.weights.bold,
      color: theme.textPrimary,
      marginTop: 2,
    },
    hashContainer: {
      backgroundColor: '#070D1B',
      padding: 8,
      borderRadius: RADIUS.xs,
      marginBottom: SPACING.md,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    hashLabel: {
      fontSize: 8.5,
      color: '#94A3B8',
      fontWeight: FONT.weights.bold,
    },
    hashValue: {
      fontSize: 9,
      color: '#38BDF8',
      fontFamily: 'monospace',
      marginTop: 2,
    },
    cuesContainer: {
      gap: 4,
    },
    cuesTitle: {
      fontSize: 10.5,
      fontWeight: FONT.weights.bold,
      color: theme.textPrimary,
      marginBottom: 4,
    },
    cueRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      padding: 6,
      borderRadius: RADIUS.xs,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      gap: 8,
    },
    cueTime: {
      fontSize: 9,
      fontWeight: FONT.weights.extrabold,
      color: theme.primaryLight,
      width: 55,
    },
    cueTopic: {
      fontSize: 10,
      color: theme.textSecondary,
      flex: 1,
    },

    // Practice Quiz
    quizCard: {
      backgroundColor: theme.surface,
      borderRadius: RADIUS.xl,
      padding: isTablet ? SPACING.lg : SPACING.md,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      elevation: 3,
      shadowColor: theme.cardShadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 8,
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
      fontSize: 10,
      color: theme.textMuted,
      marginTop: 2,
    },
    quizQuestionsBadge: {
      backgroundColor: theme.primarySoft,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: RADIUS.pill,
      borderWidth: 1,
      borderColor: theme.primaryBorder,
    },
    quizQuestionsBadgeText: {
      fontSize: 9.5,
      fontWeight: FONT.weights.bold,
      color: theme.primaryLight,
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
    scoreRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
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
      fontSize: FONT.sizes.sm + 1,
      fontWeight: FONT.weights.bold,
      color: theme.textPrimary,
      marginBottom: 8,
      lineHeight: 20,
    },
    option: {
      padding: 10,
      borderRadius: RADIUS.md,
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
      width: 22,
      height: 22,
      borderRadius: 11,
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
      fontSize: 9.5,
      fontWeight: FONT.weights.bold,
      color: theme.textSecondary,
    },
    optionText: {
      fontSize: FONT.sizes.xs + 1,
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
      padding: SPACING.sm + 2,
      borderRadius: RADIUS.sm,
      marginTop: 4,
      borderWidth: 1,
      borderColor: theme.successBorder,
    },
    explanationHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      marginBottom: 2,
    },
    explanationAnswerTag: {
      fontSize: 10.5,
      fontWeight: FONT.weights.extrabold,
      color: theme.successText,
    },
    explanationText: {
      fontSize: 10.5,
      color: theme.successText,
      lineHeight: 16,
    },
    submitBtn: {
      backgroundColor: theme.primary,
      paddingVertical: 12,
      borderRadius: RADIUS.md,
      alignItems: 'center',
      marginTop: SPACING.sm,
      elevation: 3,
      shadowColor: theme.primaryLight,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.35,
      shadowRadius: 5,
    },
    submitBtnSecondary: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: theme.surfaceBorderAlt,
      elevation: 0,
      shadowOpacity: 0,
    },
    submitBtnText: {
      color: '#FFFFFF',
      fontSize: FONT.sizes.sm + 1,
      fontWeight: FONT.weights.extrabold,
    },
    submitBtnTextSecondary: {
      color: theme.textSecondary,
    },
  });
