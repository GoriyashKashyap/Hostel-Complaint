# Hostel Issue Hub

This project supports running the backend on your own device while deploying the frontend separately (Vercel or similar).

## Split Deployment (Frontend + Self-hosted Backend)

### 1) Backend (your device)

1. Copy env example and update values:
	```bash
	cp backend/.env.example backend/.env
	```
2. Set `BACKEND_CORS_ORIGINS` to include your frontend URL (example: `https://your-app.vercel.app`).
3. Run the API:
	```bash
	uvicorn backend.main:app --host 0.0.0.0 --port 8000
	```

If your backend is not publicly reachable, use a tunnel like ngrok/cloudflared and use that public URL for the frontend.

### 2) Frontend (Vercel)

1. In Vercel project settings, add an env var:
	- `VITE_API_BASE_URL` = `https://your-backend-domain-or-tunnel/api/v1`
2. Build settings (already configured by `vercel.json`):
	- Build Command: `npm run build`
	- Output Directory: `dist/public`

### Local Development

Use the default local API by setting:
```bash
VITE_API_BASE_URL=http://localhost:8000/api/v1
```