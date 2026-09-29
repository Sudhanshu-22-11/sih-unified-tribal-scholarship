# Aakanksha (आकांक्षा)
### Unified Tribal Scholarship Portal (UTSP)
### Smart India Hackathon 2026 — Working Prototype
**Ministry:** Ministry of Tribal Affairs (MoTA), Government of India  
**Theme:** "One Student Profile + One Scholarship Dashboard + One Verification Layer + Multiple Government Systems"

---

## 🏛️ Executive Summary

Tribal students across India currently interact with multiple disconnected government scholarship systems across different educational stages and awarding bodies:
1. **Pre-Matric Scholarship for ST Students** (Classes 9 & 10)
2. **Post-Matric Scholarship for ST Students** (Class 11 to Post-Graduation / PhD)
3. **Top Class Education for ST Students** (Premier Institutes — IITs, NITs, IIMs, AIIMS)
4. **National Fellowship for ST Students (NFST)** (M.Phil & PhD Fellowships)
5. **National Overseas Scholarship (NOS)** (Masters & Doctoral Degrees Abroad)

### The Core Challenge
Previously, students had to repeatedly register, upload repetitive certificates, endure fragmented verification channels, face surprise income-mismatches, and wonder where their Direct Benefit Transfer (DBT) was delayed.

### The Architectural Solution
This platform **does NOT pretend to replace existing government systems** (NSP, SFMP, NFST, NOS, or state portals). Instead, it acts as a **unified student-facing orchestration and integration layer** over existing systems.

> **Important Regulatory Notice:**
> Government integrations shown in this prototype are simulated using mock adapters. Production deployment requires authorised API access, security review, data-sharing agreements, and official government approval.

---

## 🎨 UI/UX Design System

The application strictly implements an authentic, accessible Indian public-service design language using the curated palette:
- **Primary Brand Color:** `Emerald Ink` (`HEX: #064E3B`)
- **Secondary Accent:** `Champagne` (`HEX: #F8E7C9`)
- **Neutral Surface:** Crisp slate & white (`#F8F9FA`, `#FFFFFF`)
- **Status Colors:** Standard government semantic alerts (Emerald for Verified/Credit, Amber for MoTA Review, Rose for Attention/Outage)
- **Typography:** Accessible system font `Inter`

---

## 🚀 Key Modules & Capabilities

### 1. Unified Scholarship Dashboard
- Shows real-time aggregate statistics: **Active Benefits**, **Under Verification**, **Potentially Eligible**, and **Not Applied**.
- Dynamic scheme cards for all 5 MoTA schemes with direct eligibility calculators and tracking shortcuts.
- **Cross-System Existing Benefit Check:** Prevents conflicting scholarship applications in accordance with government regulations.

### 2. Rule-Based Eligibility Engine
- Multi-dimensional rule engine evaluating:
  - Scheduled Tribe (ST) category & PVTG indicator
  - Educational tier and course accreditation
  - Family income limits (e.g. ₹2.5L for Pre/Post-Matric, ₹6L for Top Class/NFST/NOS)
  - Duplicate/conflicting active scholarship check
- Outputs transparent status: `POTENTIALLY_ELIGIBLE`, `NOT_ELIGIBLE`, or `MORE_INFORMATION_REQUIRED` accompanied by mandatory disclaimer notice.

### 3. Digital Document Wallet & DigiLocker
- Secure repository for ST Certificate, Income Certificate, Aadhaar Verification, Academic Marksheet, Bonafide Certificate, and Bank Details.
- **"Fetch from DigiLocker"** mock integration retrieving digitally certified records.
- Status badges: `Verified`, `Pending`, `Needs Review`, `Missing`.

### 4. Smart Verification Matrix & Mismatch Handling
- Automated cross-verification checklist against:
  - **Identity:** UIDAI / DigiLocker
  - **ST Category:** State e-District
  - **Income:** e-District Revenue Records
  - **Academic:** APAAR (One Nation One Student ID)
  - **Institution:** UDISE+ / AISHE
  - **Banking:** PFMS / NPCI
- **Human-Centered Conflict Resolution:** If an income mismatch occurs (e.g. Profile ₹1,80,000 vs e-District ₹1,95,000), the system does **NOT** auto-reject the tribal student. Instead, it flags `Manual Review Required` and provides a one-click `Raise Verification Request` button.
- **External Outage Resilience:** When external services like UDISE+ fail, the portal gracefully flags the issue without fabricating false verification.

### 5. JAGO AI Scholarship Assistant
- Built on a **deterministic tool-based architecture**.
- JAGO executes backend tools:
  - `getStudentProfile()`
  - `getScholarshipEligibility()`
  - `getApplications()`
  - `getApplicationStatus()`
  - `getMissingDocuments()`
  - `getVerificationStatus()`
  - `getPaymentStatus()`
  - `getExistingBenefits()`
  - `getSchemeInformation()`
- **Safety Principle:** AI assists; official rules and authorities decide. JAGO never invents statuses or makes independent approval/rejection decisions.

### 6. Beneficiary Gap Detection (Outreach Module)
- Ingests data from **UDISE+ + APAAR + OTR + Active Beneficiary Data**.
- Identifies enrolled ST students who are potentially eligible but have never applied for scholarships (e.g. 630 potentially unreached out of 24,680 records).
- One-click **"Send Guidance"** action to trigger targeted SMS/WhatsApp advisories.

### 7. End-to-End Application Tracking & DBT
- 8-stage vertical timeline:
  `Application Submitted` ➔ `Document Verification` ➔ `Institution Verification` ➔ `State Verification` ➔ `MoTA Review` ➔ `Sanction` ➔ `Payment Processing` ➔ `DBT Disbursement`
- Integrated DBT details: Sanction amount, PFMS transaction reference (`DBT-2026-784521`), and masked bank credit details.

---

## 🛠️ Technology Stack

- **Frontend:**
  - React 18 with TypeScript
  - Tailwind CSS (Configured with Emerald Ink `#064E3B` and Champagne `#F8E7C9`)
  - React Router DOM v6
  - Lucide React Icons
  - Recharts (Analytics, scheme distributions, and state metrics)
  - Vite 5

- **Backend:**
  - Node.js & Express.js with TypeScript
  - JWT Authentication & Role-Based Access Control (`student`, `institution`, `admin`)
  - Repository-pattern In-Memory Data Store (Easily swappable with PostgreSQL/Prisma)
  - Modular integration adapters (`NSPAdapter`, `SFMPAdapter`, `NFSTAdapter`, `NOSAdapter`, `DigiLockerAdapter`, `UDISEAdapter`, `APAARAdapter`, `AISHEAdapter`, `EDistrictAdapter`, `DBTAdapter`)

---

## 👥 Demo Personas & Credentials

The portal features quick one-click persona switching in the demo banner and login page:

| Persona | Mobile Number | Role | State & Course | Current Situation |
|---|---|---|---|---|
| **Rahul Kumar** (Primary) | `9876543210` | Student | Jharkhand (B.Tech) | Application APP001 under MoTA Review with simulated income mismatch |
| **Priya Munda** | `9876543211` | Student | Odisha (NIT Rourkela) | Application APP002 DBT Disbursed (₹18,000) |
| **Amit Oraon** | `9876543212` | Student | Jharkhand (IIT Dhanbad) | Top Class Education Application Sanctioned |
| **Sunita Bhil** | `9876543213` | Student | Rajasthan (Class 10) | Pre-Matric Eligible Scholar |
| **Vikash Gond** | `9876543214` | Student | MP (PhD Anthropology) | NFST Fellowship Under Verification |
| **MoTA Administrator** | `9876543230` | Admin | National MoTA HQ | National Analytics & Beneficiary Gap Outreach Desk |

**Demo OTP:** `123456` (displayed visibly on the login screen).

---

## ⚙️ How to Run the Application

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Start the Backend API Server
```bash
cd backend
npm install
npm run dev
```
*Backend API will run on `http://localhost:5001`.*

### 2. Start the Frontend Application
```bash
cd frontend
npm install
npm run dev
```
*Frontend will run on `http://localhost:3000` (or `http://localhost:5173`).*

---

## 🎬 5-Minute Jury Demonstration Script

1. **Public Landing Page (`/`):**
   - Review the MoTA hero: *"One Platform. Five Scholarship Schemes. One Connected Student Experience."*
   - Point out the 5 central sector tribal schemes and the 6-step workflow.
2. **Login as Rahul Kumar (`/login`):**
   - Click the "Rahul Kumar" demo card or enter `9876543210` + OTP `123456`.
3. **Unified Dashboard (`/dashboard`):**
   - Highlight: Profile Completion (92%), Active/Review counters, and 5 scheme cards.
   - Point out the active **Existing Benefit Check**.
4. **Eligibility Engine (`/eligibility/SCH002`):**
   - Check criteria breakdown for Post-Matric and note the official disclaimer.
5. **Digital Document Wallet (`/documents`):**
   - Click **"Fetch from DigiLocker"** to simulate real-time certified record retrieval.
6. **Multi-Step Application (`/apply/SCH003`):**
   - Demonstrate that profile information is pre-filled (*"Enter once, reuse everywhere"*).
   - Advance through the steps and click **Submit**.
7. **Smart Verification & Exception Resolution (`/verification/APP001`):**
   - Show the simulated income mismatch (Profile ₹1.80L vs e-District ₹1.95L).
   - Highlight that the student is NOT rejected; demonstrate the **"Raise Verification Request"** action.
8. **Application Timeline & DBT (`/applications/APP001` & `/payments/APP001`):**
   - Review the vertical milestone progress.
   - Use the **Demo Banner** to advance the application: click `2. MoTA Approve` ➔ `3. Sanction ₹18k` ➔ `4. DBT Disburse` and watch the timeline and payment screens react live!
9. **Interactive JAGO AI Assistant:**
   - Click the floating **"Ask JAGO"** button.
   - Click *"Where is my scholarship application?"* or *"Am I eligible for Post-Matric scholarship?"*.
   - Point out the executed backend tools badge (`getApplications()`, `getScholarshipEligibility()`).
10. **Admin Portal & Beneficiary Outreach (`/admin` & `/admin/beneficiary-gap`):**
    - Switch to Admin role in the Demo Banner or navigate to `/admin`.
    - Review the national scheme distribution charts and verification exception tables.
    - Open **Beneficiary Gap Detection**: Review the 24,680 analyzed records and 630 unreached students. Click **"Send Guidance"** to dispatch outreach alerts.
11. **Resilience Testing (Simulate External Outage):**
    - In Demo Controls, toggle `UDISE+: Failing`. Return to `/verification/APP001` to show how the system gracefully handles downstream downtime without falsifying approvals.

---

## 🔒 Security & Privacy Practices
- Sensitive identifiers like Aadhaar are masked (`XXXX XXXX 4821`).
- JWT token authentication with RBAC guards.
- Structured audit logs for all administrative and outreach actions.
- Client-side proxy routing preventing CORS leaks.

---
*Built for the Smart India Hackathon (SIH 2026) — Ministry of Tribal Affairs (MoTA)*
