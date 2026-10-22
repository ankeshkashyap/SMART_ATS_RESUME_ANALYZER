# Backend Deployment Guide — Render

## Resource estimates (measured on Python 3.11.9, Windows)

| Component | Disk (installed) | RAM (RSS, measured) |
|---|---|---|
| Python + FastAPI + uvicorn | ~50 MB | ~40 MB |
| PyTorch 2.13.0+cpu (CPU-only wheel) | ~700 MB installed (183 MB wheel) | ~170 MB |
| spaCy 3.8.15 + en_core_web_sm 3.8.0 | ~45 MB | ~90 MB |
| sentence-transformers 6.0.1 + all-MiniLM-L6-v2 | ~100 MB (model cached on first run) | ~200 MB (lazy-loaded) |
| Other deps (pdfplumber, docx, rapidfuzz, etc.) | ~80 MB | ~20 MB |
| **Total** | **~1 GB** | **~520 MB after first analysis request** |

**Startup RSS (before any analysis):** ~380 MB (torch + spacy loaded; ST model deferred).
**After first `/analyses/` call:** ~520 MB (all models loaded).

Render free tier = 512 MB RAM. The app fits at startup but will OOM under concurrent load or during peak inference. **Use Render Starter ($7/mo, 1 GB RAM) for production.** Free tier works only for single-user demo.

## Build & start commands

**Root directory:** `backend`

**Build command:**
```bash
pip install --extra-index-url https://download.pytorch.org/whl/cpu -r requirements.txt
```

The `--extra-index-url` is required because `requirements.txt` pins `torch==2.13.0+cpu`, which only exists in PyTorch's CPU index, not on PyPI. Verified: pip successfully downloads `torch-2.13.0+cpu-cp311-cp311-manylinux_2_28_x86_64.whl` (183 MB).

**Start command:**
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT --workers 1
```

Use `--workers 1`. Each worker forks a process that loads its own copy of all models. Two workers = double RAM = guaranteed OOM on free tier.

## Required environment variables (Render)

Set these in Render Dashboard → your service → Environment:

| Variable | Example | Secret? | Notes |
|---|---|---|---|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/dbname?sslmode=require` | **Yes** | Use Render PostgreSQL internal connection string. Append `?sslmode=require` if using external hosted Postgres. |
| `SECRET_KEY` | (generate via `python -c "import secrets; print(secrets.token_urlsafe(32))"`) | **Yes** | JWT signing key. Generate once, never rotate unless invalidating all tokens. |
| `ALGORITHM` | `HS256` | No | JWT algorithm. |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `60` | No | Token lifetime. |
| `GEMINI_API_KEY` | (from https://aistudio.google.com/apikey) | **Yes** | Server-side only. Never expose to frontend. **Rotate before production** — current local `.env` value has been on disk in plaintext. |
| `CORS_ORIGINS` | `https://your-app.vercel.app` | No | Comma-separated. Defaults to `http://localhost:5173,http://127.0.0.1:5173` for dev. Must match your Vercel domain exactly. Never use `*` with credentials. |

Do NOT set `PYTHON_VERSION` — Render defaults to 3.11 which matches our codebase (verified: Python 3.11.9).

## Required environment variables (Vercel)

Set these in Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Value | Scope |
|---|---|---|
| `VITE_API_BASE_URL` | `https://your-render-service.onrender.com` | Production only |

For local development, create `frontend/.env.development` with `VITE_API_BASE_URL=http://localhost:8000` (not committed). See `frontend/.env.example` for reference.

## Database setup

Tables are created automatically via `Base.metadata.create_all(bind=engine)` in `main.py` at startup.
- Fresh DB: tables auto-create on first boot. ✓
- Existing data: `create_all` does NOT drop or reset tables. Safe. ✓
- Schema changes after deploy: no Alembic migrations exist. You must manually alter tables.

## Health check

`GET /health` returns `{"status": "ok", "database": "connected"}` (200) or `{"status": "error", ...}` (503).
Uses `SELECT 1` — read-only, non-destructive. Verified working with TestClient.

## Object storage for resume files

### The problem
Uploaded PDFs/DOCX files are saved to `backend/uploads/` on local disk. Render's filesystem is ephemeral — files are lost on every restart or redeploy. Parsed text is stored in PostgreSQL and survives, but the original file does not.

### Comparison

| Provider | Cost | Pros | Cons |
|---|---|---|---|
| **Cloudflare R2** | $0.015/GB storage, $0 egress | S3-compatible API, no egress fees, generous free tier (10 GB) | Requires Cloudflare account, manual bucket setup |
| **AWS S3** | $0.023/GB storage + egress | Industry standard, boto3 ecosystem | Egress costs add up, more complex IAM |
| **Supabase Storage** | Free tier 1 GB | Already using Postgres, simple API | Vendor lock-in, limited free tier |
| **Backblaze B2** | $0.006/GB storage | Cheapest storage, S3-compatible | Smaller ecosystem |

### Recommendation: Cloudflare R2
S3-compatible, zero egress fees, 10 GB free. Best fit for a resume storage use case where files are uploaded once and downloaded occasionally.

### Migration steps (when ready)
1. Create R2 bucket, get S3-compatible endpoint + access keys.
2. Add `boto3` to `requirements.txt`.
3. Add `R2_ENDPOINT_URL`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME` env vars.
4. Replace `UPLOAD_DIR` file writes in `routers/resume.py` with `boto3.client('s3').upload_fileobj()`.
5. Replace file reads in parsers with `download_fileobj()` to temp file.
6. Replace file deletes in `delete_resume` with `delete_object()`.
7. Run migration script to upload existing local files to R2.

**Not implemented yet — waiting for provider selection approval.**

## Known limitations

1. **File uploads are ephemeral** until object storage is configured (see above).
2. **First analysis request is slow** (~5-15s) because SentenceTransformer lazy-loads on first use. Subsequent requests are fast.
3. **No Alembic migrations.** Schema changes require manual DDL.
4. **Gemini model name** `gemini-3.5-flash-lite` — verify this exists in your SDK version. If it 500s, check https://ai.google.dev/gemini-api/docs/models.
5. **JWT tokens in localStorage** (not httpOnly cookies). Functional but XSS-prone. Acceptable for MVP, should be upgraded later.
