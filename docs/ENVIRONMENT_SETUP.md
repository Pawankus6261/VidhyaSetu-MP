# VidyaSetu MP (विद्यासेतु) — Environment Setup & Host Configuration

This guide details configuring and testing VidyaSetu MP across development, staging, and low-resource field deployments.

---

## 1. Port & Host Allocation

| Service Tier | Framework | Host & Port | Environment Variable | Notes |
|---|---|---|---|---|
| **FastAPI Cloud Gateway** | Python 3.13 / FastAPI | `0.0.0.0:8000` | `API_PORT=8000`, `API_HOST=0.0.0.0` | Provides REST API, Swagger docs (`/docs`), and Health check (`/health`) |
| **Mobile App (Web/Bundler)** | React Native / Expo SDK 57 | `localhost:8081` | Metro Bundler default port | Web desktop preview, iOS simulator, and Expo Go runner |
| **Android Emulator Mapping** | Android Virtual Device (AVD) | `10.0.2.2:8000` | `EXPO_PUBLIC_API_URL=http://10.0.2.2:8000` | Android loopback IP mapping to the host PC's `127.0.0.1:8000` |
| **Physical Device (WiFi/LAN)** | Physical Android Phone | `http://<LAN_IP>:8000` | Configurable in Settings Screen | For testing on real low-cost hardware (e.g. Redmi 9A / JioPhone Next) |

---

## 2. CORS Configuration

The FastAPI backend (`backend/main.py`) is configured with safe CORS middleware enabling web desktop, React Native web, and emulator clients:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Range", "Accept-Ranges", "ETag", "X-Idempotency-Key"]
)
```

**Key Exposed Headers:**
* `Content-Range` & `Accept-Ranges`: Required for resumable HTTP Range downloads of `.vsmp` packages.
* `ETag`: Required for package integrity and cache revalidation.
* `X-Idempotency-Key`: Required for duplicate write prevention over unstable connections.

---

## 3. Quickstart Commands

### 1. Launch FastAPI Backend
```bash
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
Verify health:
```bash
curl http://127.0.0.1:8000/health
```

### 2. Launch Mobile App
```bash
cd apps/mobile
npx expo start
```
* Press `w` to open in browser (Web mode).
* Press `a` to open in Android Emulator.
* Scan QR code with Expo Go on a physical phone.
