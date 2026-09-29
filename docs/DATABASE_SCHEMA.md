# DATABASE_SCHEMA.md: Production Cloud & Edge Relational Data Architecture
## Platform: VidyaSetu MP (विद्यासेतु)
**Engines:** PostgreSQL 16 (Cloud Central) + SQLite 3 / SQLCipher (Edge Device)

---

## 1. Cloud Database Schema (PostgreSQL 16 with `pgvector`)

```sql
-- ============================================================================
-- VIDYASETU MP: PRODUCTION CLOUD POSTGRESQL SCHEMA (v2.0.0)
-- Target: High-concurrency async read/write, vector search, CRDT synchronization
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- ----------------------------------------------------------------------------
-- 1. USERS & IDENTITY (Privacy-Preserving / DPDP Act 2023 Compliant)
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_hash VARCHAR(64) UNIQUE NOT NULL, -- SHA-256 hash of mobile number
    samagra_id VARCHAR(16) UNIQUE,          -- 9-digit MP Samagra Member ID
    full_name VARCHAR(128) NOT NULL,
    gender VARCHAR(16) NOT NULL CHECK (gender IN ('MALE', 'FEMALE', 'OTHER')),
    social_category VARCHAR(8) NOT NULL CHECK (social_category IN ('ST', 'SC', 'OBC', 'GEN')),
    tribal_community VARCHAR(64),           -- Bhil, Gond, Baiga, Sahariya, Bharia, etc.
    district VARCHAR(64) NOT NULL,
    tehsil VARCHAR(64) NOT NULL,
    college_code VARCHAR(32) NOT NULL,      -- e-Pravesh assigned college code
    course_enrolled VARCHAR(32) NOT NULL,    -- BA, BSC, BCOM, MA, MSC, MCOM
    year_of_study SMALLINT NOT NULL CHECK (year_of_study BETWEEN 1 AND 5),
    family_annual_income NUMERIC(10, 2),
    twelfth_percentage NUMERIC(5, 2),
    is_rural BOOLEAN DEFAULT TRUE,
    preferred_dialect VARCHAR(32) DEFAULT 'hi',
    device_fingerprint_hash VARCHAR(64),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX idx_users_district_category ON users(district, social_category);
CREATE INDEX idx_users_college ON users(college_code);

-- ----------------------------------------------------------------------------
-- 2. CURRICULUM & COURSE STRUCTURE
-- ----------------------------------------------------------------------------
CREATE TABLE universities (
    code VARCHAR(32) PRIMARY KEY,
    name_hindi VARCHAR(256) NOT NULL,
    name_english VARCHAR(256) NOT NULL,
    headquarters_district VARCHAR(64) NOT NULL,
    is_tribal_focus BOOLEAN DEFAULT FALSE
);

CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_code VARCHAR(32) REFERENCES universities(code),
    degree_type VARCHAR(16) NOT NULL, -- UG, PG, DIPLOMA
    subject_code VARCHAR(64) NOT NULL,
    title_hindi VARCHAR(256) NOT NULL,
    syllabus_academic_year INTEGER NOT NULL,
    total_credits SMALLINT DEFAULT 4,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    unit_number SMALLINT NOT NULL,
    lesson_order SMALLINT NOT NULL,
    title_hindi VARCHAR(256) NOT NULL,
    summary_devanagari TEXT NOT NULL,
    pack_s3_uri VARCHAR(512) NOT NULL,      -- MinIO / S3 path to .vsmp
    pack_sha256_hash VARCHAR(64) NOT NULL,
    pack_size_bytes INTEGER NOT NULL,       -- Max 2,000,000 bytes
    audio_duration_seconds INTEGER NOT NULL,
    version_number INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. STATE-LEVEL VECTOR KNOWLEDGE CORPUS (Hybrid RAG)
-- ----------------------------------------------------------------------------
CREATE TABLE curriculum_knowledge_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_code VARCHAR(32) REFERENCES universities(code),
    course_code VARCHAR(64) NOT NULL,
    subject VARCHAR(128) NOT NULL,
    chapter_unit VARCHAR(128) NOT NULL,
    text_hindi TEXT NOT NULL,
    text_dialect_glossary JSONB,
    embedding vector(1024),                 -- BAAI/bge-m3 1024-dim dense vector
    source_book_title VARCHAR(256) NOT NULL,-- e.g., 'म.प्र. हिंदी ग्रंथ अकादमी'
    page_number INTEGER NOT NULL,
    verified_by_faculty_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- HNSW Vector Index for Sub-Millisecond Cosine Similarity Search
CREATE INDEX idx_curriculum_vector_hnsw ON curriculum_knowledge_chunks 
USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);

-- Full-text search index for BM25 sparse keyword fusion
CREATE INDEX idx_knowledge_gin_hindi ON curriculum_knowledge_chunks 
USING gin(to_tsvector('simple', text_hindi));

-- ----------------------------------------------------------------------------
-- 4. ACADEMIC DOUBT TICKETS & HUMAN MENTORING ESCALATION
-- ----------------------------------------------------------------------------
CREATE TABLE doubt_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    client_mutation_id UUID UNIQUE NOT NULL,-- Prevent duplicate sync creation
    lesson_id UUID REFERENCES lessons(id),
    query_text_raw TEXT NOT NULL,
    normalized_query TEXT NOT NULL,
    detected_dialect VARCHAR(32) DEFAULT 'hi',
    audio_s3_uri VARCHAR(512),
    retrieval_confidence_score REAL,
    ai_generated_answer TEXT,
    citation_source TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'RESOLVED_AI' 
        CHECK (status IN ('RESOLVED_AI', 'ESCALATED_PEER', 'ESCALATED_FACULTY', 'CLOSED')),
    assigned_mentor_id UUID,
    mentor_resolution_text TEXT,
    mentor_voice_note_uri VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_doubts_user ON doubt_tickets(user_id);
CREATE INDEX idx_doubts_status ON doubt_tickets(status);

-- ----------------------------------------------------------------------------
-- 5. SCHOLARSHIP MASTER SCHEMAS (Audited Government Gazettes)
-- ----------------------------------------------------------------------------
CREATE TABLE scholarship_schemes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scheme_code VARCHAR(64) UNIQUE NOT NULL, -- e.g., 'MP_ST_POST_MATRIC'
    title_hindi VARCHAR(256) NOT NULL,
    administering_department VARCHAR(256) NOT NULL,
    official_portal_url VARCHAR(512) NOT NULL,
    max_annual_benefit_inr NUMERIC(10, 2) NOT NULL,
    eligibility_criteria_json JSONB NOT NULL,
    required_documents_json JSONB NOT NULL,
    application_deadline_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    last_verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. ASYNCHRONOUS CRDT SYNC AUDIT LOG
-- ----------------------------------------------------------------------------
CREATE TABLE sync_journal (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    device_id VARCHAR(64) NOT NULL,
    idempotency_hash VARCHAR(64) UNIQUE NOT NULL,
    mutations_count SMALLINT NOT NULL,
    compressed_bytes_received INTEGER NOT NULL,
    processing_time_ms INTEGER NOT NULL,
    client_timestamp BIGINT NOT NULL,
    server_sync_timestamp BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 2. Client-Side Edge SQLite Schema (Embedded on Device via WatermelonDB)

```sql
-- ============================================================================
-- VIDYASETU MP: CLIENT EDGE SQLITE / SQLCIPHER SCHEMA (v2.0.0)
-- Target: Ultra-fast local lookups, zero-battery drain, outbox sync queuing
-- ============================================================================

PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

CREATE TABLE local_student_profile (
    id TEXT PRIMARY KEY NOT NULL,
    samagra_id TEXT,
    full_name TEXT NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('MALE', 'FEMALE', 'OTHER')),
    social_category TEXT NOT NULL CHECK (social_category IN ('ST', 'SC', 'OBC', 'GEN')),
    district TEXT NOT NULL,
    tehsil TEXT NOT NULL,
    college_code TEXT NOT NULL,
    degree_course TEXT NOT NULL,
    year_of_study INTEGER NOT NULL,
    family_income REAL,
    twelfth_percent REAL,
    is_rural INTEGER DEFAULT 1,
    preferred_dialect TEXT DEFAULT 'hi'
);

CREATE TABLE local_downloaded_packs (
    id TEXT PRIMARY KEY NOT NULL, -- Lesson ID
    course_code TEXT NOT NULL,
    title_hindi TEXT NOT NULL,
    file_path TEXT NOT NULL,      -- Local sandbox absolute URI
    file_size_bytes INTEGER NOT NULL,
    sha256_hash TEXT NOT NULL,
    total_audio_seconds INTEGER NOT NULL,
    downloaded_at INTEGER NOT NULL,
    last_played_at INTEGER
);

CREATE TABLE local_learning_progress (
    lesson_id TEXT PRIMARY KEY NOT NULL,
    completed_seconds INTEGER DEFAULT 0,
    is_completed INTEGER DEFAULT 0,
    quiz_score INTEGER,
    vector_clock INTEGER DEFAULT 1,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY(lesson_id) REFERENCES local_downloaded_packs(id) ON DELETE CASCADE
);

CREATE TABLE local_scholarship_catalog (
    id TEXT PRIMARY KEY NOT NULL,
    scheme_code TEXT UNIQUE NOT NULL,
    title_hindi TEXT NOT NULL,
    department TEXT NOT NULL,
    benefit_description TEXT NOT NULL,
    max_benefit_amount REAL NOT NULL,
    eligibility_rules_json TEXT NOT NULL,
    required_docs_json TEXT NOT NULL,
    official_url TEXT NOT NULL
);

-- Cryptographic Outbox Mutation Queue (Drained over 40 kbps bursts)
CREATE TABLE local_sync_outbox (
    mutation_id TEXT PRIMARY KEY NOT NULL, -- UUIDv4
    entity_type TEXT NOT NULL,             -- 'progress', 'doubt', 'profile'
    entity_id TEXT NOT NULL,
    operation TEXT NOT NULL CHECK (operation IN ('UPSERT', 'DELETE')),
    payload_json TEXT NOT NULL,
    client_timestamp INTEGER NOT NULL,
    vector_clock INTEGER NOT NULL,
    sync_status TEXT DEFAULT 'PENDING' CHECK (sync_status IN ('PENDING', 'IN_FLIGHT', 'COMMITTED')),
    retry_count INTEGER DEFAULT 0
);

CREATE INDEX idx_outbox_status ON local_sync_outbox(sync_status);
CREATE INDEX idx_packs_course ON local_downloaded_packs(course_code);
```
