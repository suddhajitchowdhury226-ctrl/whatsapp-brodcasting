# WhatsApp Broadcasting Website — Project Plan

## Overview
A SaaS website where users upload an Excel sheet of phone numbers, compose a message, and broadcast it to all numbers via WhatsApp.

---

## 1. How It Works (User Flow)

1. User visits the website and logs in
2. Uploads an Excel (.xlsx) file containing phone numbers
3. Composes a message (text, image, or PDF)
4. Clicks **Send** — messages are queued and delivered to all numbers

---

## 2. Core Features to Build

### Must-Have
- **Excel file upload** — parse `.xlsx` and extract phone numbers
- **Message composer** — support text, images, PDFs
- **Broadcast engine** — send messages to all numbers in the queue
- **User authentication** — login, register, plan management
- **Campaign dashboard** — view status, sent count, failed count
- **Rate limiter / delay** — add 1–3 second delay between messages to avoid WhatsApp ban

### Nice-to-Have (Later)
- Message scheduling (send at a specific time)
- Contact group management
- Message templates
- Analytics & reports
- Bulk contact import history

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js / Next.js |
| UI Styling | Tailwind CSS |
| Excel Parsing | SheetJS (`xlsx` npm package) |
| Backend | Node.js + Express.js |
| Database | MongoDB (with Mongoose) |
| Message Queue | Bull + Redis |
| Authentication | JWT + bcrypt |
| File Storage | AWS S3 / Cloudinary (for media) |
| Hosting | VPS (DigitalOcean / AWS EC2) |
| WhatsApp API | Meta Cloud API (recommended) |

---

## 4. WhatsApp Integration Options

### ✅ Option 1 — Meta Cloud API (Official, Recommended)
- Free tier available
- Approved by Meta, no ban risk
- Supports text, images, documents, templates
- Requires Meta Business verification
- Docs: https://developers.facebook.com/docs/whatsapp

### ⚡ Option 2 — Twilio / Vonage (Paid, Easiest)
- Quickest to integrate
- Pay-per-message pricing
- Good SDKs for Node.js
- Best for fast MVP launch

### ⚠️ Option 3 — whatsapp-web.js (Unofficial, Risky)
- Uses QR code to connect a real WhatsApp account
- No Meta approval needed
- **High risk of permanent account ban**
- Not suitable for production use

---

## 5. System Architecture

```
Browser (React App)
    │  Upload Excel + Compose Message
    ▼
Node.js API Server (REST)
    ├──▶ MongoDB (Users, Campaigns, Messages)
    └──▶ Redis Queue (Bull jobs)
              │
              ▼
        Bull Worker (processes with 1–3s delay)
              │
              ▼
        WhatsApp API (Meta Cloud / Twilio)
              │
              ▼
        Recipients (WhatsApp messages delivered)
```

---

## 6. Database Schema

### Collection: `users`
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "passwordHash": "string",
  "plan": "free | pro | business",
  "wa_token": "string (WhatsApp API key)",
  "wa_phone_id": "string",
  "createdAt": "Date"
}
```

### Collection: `campaigns`
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "message": "string",
  "mediaUrl": "string | null",
  "totalNumbers": "number",
  "sentCount": "number",
  "failedCount": "number",
  "status": "pending | running | completed | failed",
  "createdAt": "Date",
  "sentAt": "Date"
}
```

### Collection: `messages`
```json
{
  "_id": "ObjectId",
  "campaignId": "ObjectId",
  "phone": "string",
  "status": "sent | failed",
  "errorMsg": "string | null",
  "sentAt": "Date"
}
```

---

## 7. Pages to Build

| Page | Route | Description |
|---|---|---|
| Landing page | `/` | Features, pricing, CTA |
| Register | `/register` | Create new account |
| Login | `/login` | User login |
| Dashboard | `/dashboard` | List of past campaigns |
| New Campaign | `/campaign/new` | Upload Excel + compose + send |
| Campaign Detail | `/campaign/:id` | Status, sent/failed breakdown |
| Settings | `/settings` | Profile, API key, plan upgrade |

---

## 8. API Endpoints

### Auth
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Campaigns
```
POST   /api/campaigns         — Create new campaign
GET    /api/campaigns         — List all campaigns (paginated)
GET    /api/campaigns/:id     — Get campaign details
DELETE /api/campaigns/:id     — Delete campaign
```

### Messages
```
GET /api/campaigns/:id/messages   — Get message log for a campaign
```

### Upload
```
POST /api/upload/excel    — Upload .xlsx, returns parsed phone list
POST /api/upload/media    — Upload image/PDF for message
```

---

## 9. Development Phases

### Phase 1 — Week 1–2: Backend Foundation
- [ ] Set up Node.js + Express project structure
- [ ] Connect MongoDB
- [ ] Build auth API (register, login, JWT middleware)
- [ ] Set up Redis + Bull queue

### Phase 2 — Week 3: Excel Parser
- [ ] Accept `.xlsx` file upload (Multer)
- [ ] Parse with SheetJS
- [ ] Extract and validate phone numbers (E.164 format)
- [ ] Return cleaned list to frontend

### Phase 3 — Week 4: WhatsApp Integration
- [ ] Integrate Meta Cloud API
- [ ] Build message sender function
- [ ] Add Bull job for each number (with 1–3s delay)
- [ ] Log sent/failed status to MongoDB

### Phase 4 — Week 5–6: React Frontend
- [ ] Set up Next.js project with Tailwind CSS
- [ ] Build all pages (landing, auth, dashboard, new campaign)
- [ ] Excel file drag-and-drop upload UI
- [ ] Real-time progress bar using polling or WebSocket
- [ ] Campaign history with stats

### Phase 5 — Week 7: Testing & Deployment
- [ ] Test with real WhatsApp numbers
- [ ] Tune rate limiting to avoid bans
- [ ] Deploy backend to DigitalOcean / AWS
- [ ] Deploy frontend to Vercel
- [ ] Add SSL certificate (Let's Encrypt)
- [ ] Set up basic monitoring (UptimeRobot)

---

## 10. Important Rules

> ⚠️ **WhatsApp can permanently ban accounts that send spam.**

- Only send messages to users who have **opted in**
- Always include an unsubscribe/opt-out message
- Add **1–3 second delay** between each message
- Do **not** use unofficial libraries in production
- Follow [Meta's WhatsApp Business Policy](https://www.whatsapp.com/legal/business-policy/)
- Keep daily message volume within API tier limits

---

## 11. Monetization Plan

| Plan | Price | Limit | Features |
|---|---|---|---|
| Free | ₹0/month | 50 messages/day | 1 campaign at a time |
| Pro | ₹999/month | 5,000 messages/day | Scheduling, reports, media |
| Business | ₹4,999/month | Unlimited | API access, team seats, priority support |

Payment gateway: **Razorpay** (India) or **Stripe** (international)

---

## 12. Services Needed to Start

| Service | Purpose | Cost |
|---|---|---|
| Meta Business Account | WhatsApp Cloud API access | Free (pay per message after 1,000) |
| VPS (DigitalOcean / AWS) | Host backend + Redis + MongoDB | ~$12–20/month |
| Domain + SSL | Website address + HTTPS | ~$10–15/year |
| Cloudinary / AWS S3 | Store uploaded media files | Free tier available |
| Razorpay | Accept payments from users | 2% per transaction |
| Vercel | Host Next.js frontend | Free tier available |

---

## 13. Estimated Total Cost to Launch MVP

| Item | Cost |
|---|---|
| VPS (1 month) | ~₹1,500 |
| Domain | ~₹900/year |
| Development time | 6–7 weeks |
| WhatsApp API (free tier) | ₹0 |
| **Total to launch** | **~₹2,500 + your time** |

---

## 14. Folder Structure (Suggested)

```
/project-root
├── /client              ← Next.js frontend
│   ├── /pages
│   ├── /components
│   └── /utils
│
├── /server              ← Node.js backend
│   ├── /routes
│   ├── /controllers
│   ├── /models          ← Mongoose schemas
│   ├── /jobs            ← Bull queue workers
│   ├── /middleware
│   └── /utils
│
├── .env
├── docker-compose.yml   ← Redis + MongoDB (local dev)
└── README.md
```

---

*Plan version 1.0 — Ready for development*