# OFFLINE_ARCHITECTURE.md: Offline-First Engine, CRDTs & .vsmp Micro-Packs

---

## 1. The Offline-First Operating Paradigm

VidyaSetu MP operates on a fundamental systems principle: **The network is an intermittent synchronization bus, not a runtime dependency.**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          LOCAL-FIRST STATE MACHINE                          │
└─────────────────────────────────────────────────────────────────────────────┘
                [User Interaction / Navigation / Player]
                                   │
                                   ▼
             [WatermelonDB Reactive Layer (In-Memory Cache)]
                                   │
                                   ▼
              [Embedded SQLite Database (Encrypted SQLCipher)]
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
         [Read Queries (Instant)]      [Write Mutations (Outbox)]
         - Lesson metadata             - Quiz progress
         - Scholarship rules           - Doubt tickets
         - Downloaded transcripts      - Profile updates
                    │                             │
                    └──────────────┬──────────────┘
                                   ▼
                        [Sync Outbox Daemon]
                                   │
                    [Probe Network Condition]
                    ├── 0 kbps: Hold in SQLite
                    └── >20 kbps: Drain Batch Payload
```

---

## 2. Anatomy of the .vsmp (VidyaSetu Micro-Pack) Format

Traditional streaming video (H.264/AV1) is prohibited in the VidyaSetu architecture. Instead, lessons are authored and distributed as **.vsmp (VidyaSetu Micro-Pack)** archives.

### 2.1 File Structure Inside a .vsmp Archive
```text
ba_hist_mod1_indus_valley.vsmp (Compressed ZIP ~ 1.8 MB)
│
├── manifest.json            # Module ID, curriculum mapping, checksums
├── audio.opus               # 45-min Mono Opus Voice Audio @ 14 kbps (~1.4 MB)
├── slides.json              # Vector Canvas Drawing Commands (~120 KB)
├── sync_map.bin             # Millisecond audio-to-slide synchronization (~15 KB)
├── transcript.br            # Dual-language Brotli-compressed text (~45 KB)
└── assessment.json          # 10 Concept-Check diagnostic questions (~12 KB)
```

### 2.2 Vector Slide Format (`slides.json`)
Instead of 1080p raster slides (which average 15 MB for a 20-slide presentation), visuals are represented as lightweight vector path drawing commands rendered natively by the mobile device's graphics engine:

```json
{
  "slides": [
    {
      "slide_number": 1,
      "start_time_ms": 0,
      "end_time_ms": 142000,
      "title_hindi": "हड़प्पा सभ्यता: नगर नियोजन (Town Planning)",
      "canvas_elements": [
        {
          "type": "vector_grid",
          "color": "#1E3A8A",
          "stroke_width": 2,
          "paths": [
            {"cmd": "M", "x": 50, "y": 100},
            {"cmd": "L", "x": 350, "y": 100},
            {"cmd": "M", "x": 50, "y": 150},
            {"cmd": "L", "x": 350, "y": 150}
          ]
        },
        {
          "type": "text_label",
          "text": "समकोण पर काटती सड़कें (Grid System)",
          "x": 60,
          "y": 125,
          "font_size": 16,
          "color": "#065F46"
        },
        {
          "type": "highlight_box",
          "x": 220,
          "y": 90,
          "w": 120,
          "h": 50,
          "label": "विशाल स्नानागार (Great Bath)"
        }
      ]
    }
  ]
}
```

*Result:* The entire visual track of a 45-minute lecture weighs only **120 Kilobytes**, requiring zero video decoding hardware, running at 60 FPS on 2GB RAM Android phones without battery drain.

---

## 3. Resumable Chunked Downloader Protocol

On volatile 2G/3G connections, TCP connections drop frequently. The downloader implements HTTP `Range` header resumption:

```
Step 1: Client queries: HEAD /api/v1/content/pack/LESSON_001
        Server returns: 200 OK | Content-Length: 1845200 | Accept-Ranges: bytes

Step 2: Client downloads bytes 0 to 655360 (Drops connection at 35%)

Step 3: Network re-established 4 hours later.
        Client checks local disk: 655360 bytes on disk.
        Client queries: GET /api/v1/content/pack/LESSON_001
        Header: Range: bytes=655360-

Step 4: Server returns: 206 Partial Content | Bytes 655360-1845199

Step 5: Client appends bytes and performs SHA-256 integrity verification.
```

---

## 4. Conflict Resolution & CRDTs

When multiple state changes occur offline:
1. **Academic Progress:** Solved via **State-based Last-Write-Wins with Vector Clocks**. If the client completed 1,840 seconds of a lesson at 3:00 PM offline, and the server records 1,200 seconds from 10:00 AM, the local record with the higher clock vector dominates.
2. **Doubt Tickets & Forum Notes:** Solved via **Append-Only Event Logs**. Each doubt query is assigned a client-generated UUIDv4 mutation ID. If the sync packet is retried 5 times due to packet drop, the server's `X-Idempotency-Key` deduplicates the mutation, ensuring no double tickets are created.
