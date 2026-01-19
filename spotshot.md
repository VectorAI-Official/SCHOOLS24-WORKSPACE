# SpotPic – AI Photo Sharing with QR & Face Recognition  
## **Project Proposal**

---

## **DOCUMENT DETAILS**

| Field | Details |
|-------|---------|
| **Proposal Title** | SpotPic – AI-Powered Real-Time Photo Sharing Platform |
| **Prepared By** | UpCraft Solutions |
| **Prepared For** | Krithik Kumar |
| **Date** | January 14, 2026 |
| **Valid Until** | February 13, 2026 (30 days) |
| **Status** | For Review & Negotiation |

---

## **COMPANY INTRODUCTION**

### **About UpCraft Solutions**

**UpCraft Solutions** UpCraft is a specialized optimization partner that helps MVPs scale. We focus on making early-stage products ready for growth by offering services like Security & Performance Audits

### **Contact Information**

**UpCraft Solutions Private Limited**

- **Operating From:** Tiruchirapalli, Tamilnadu, India
- **Website:** https://upcraft.in
- **Email:** upcraft.consulting@gmail.com
- **Phone:** +91-8870986738

---

## **1. EXECUTIVE SUMMARY**

**SpotPic** is a real-time photo delivery and AI-powered face matching platform for event photographers and organizers. 

**The Problem:** Event photos are shared days/weeks late, guests can't find themselves in hundreds of photos, and photographers spend 5-8 hours on post-production filtering and manual delivery.

**The Solution:** SpotPic provides instant photo uploads, AI-powered face recognition so guests see only their photos via a QR scan, and zero manual work for photographers.

**Key Differentiators:** Live uploads during events, CPU-optimized face recognition (low costs), ephemeral 24-hour architecture, and plug-and-play desktop app with zero setup friction.

---

## **2. WHAT PROBLEM ARE WE SOLVING?**

### **Current Pain Points in Event Photography**

**For Photographers:**
- Manual photo filtering takes 2-3 hours per event
- Sending individual photos to 50-100 guests is tedious
- Expected to provide "instant" delivery but it's actually days later
- Archiving photos manually, managing storage across events

**For Guests:**
- "Can you send me my photos?" – vague, unclear what they want
- Hundreds of photos to scroll through to find themselves
- Wait days/weeks for delivery

**For Event Organizers:**
- No data on guest engagement with photos
- Can't measure ROI on photography spend
- Negative perception if photos are slow/hard to access
- Opportunity to differentiate with modern tech is missed

### **Business Impact of Current System**

- Photographers lose 5-8 hours per event on post-production
- 30-40% of guests never receive/see their photos
- Low social media engagement (photos shared days later)
- Photographer reputation depends on speed, not quality

### **SpotPic's Solution**

Photographers: Automatic background uploads, zero manual sorting  
Guests: Instant AI-powered photo discovery via selfie scan  
Organizers: Professional, tech-forward event experience  
Everyone: Modern, delightful user experience  

---

## **3. HOW SpotPic WORKS (High-Level Flow)**

### **Step 1 – Event Setup (30 seconds)**

```
Photographer logs into SpotPic.com
         ↓
Clicks "Create Event"
         ↓
Enters: Event name, date, expected photo count, etc
         ↓
SpotPic creates:
  • Unique subdomain (e.g., abcwedding.SpotPic.com)
  • QR code for guests to scan
  • Cloudinary storage folder for that event
  • Event valid for 24 hours
         ↓
Photographer downloads desktop app + Login with SpotPic Acc
```

### **Step 2 – Photographer Side (Desktop App – Automated)**

```
Photographer's Workflow:

1. Desktop app runs in background
2. Camera connected via USB
3. App auto-detects device (Canon/Nikon/Sony)
4. Photographer just shoots normally
5. Each new photo is uploaded in background & indexed for face recognition
6. Real-time notification shows upload progress
```

### **Step 3 – Guest Experience (At the Event – Less than 1 minute)**

```
Guest at event venue:

1. Sees QR code (on screen, banner, or table cards)
2. Scans QR to access SpotPic
3. Takes a selfie and AI instantly finds all their photos
4. Guest can download, share, or view their gallery
```

---

## **4. KEY FEATURES & CAPABILITIES**

### **For Photographers**

| Feature | Benefit |
|---------|---------|
| **Auto-detecting desktop app (Windows + macOS)** | No driver installation, plug any camera |
| **Background async uploads** | Keep shooting, uploads happen silently |
| **Real-time progress dashboard** | Monitor uploads live in the app |
| **Multi-brand support** | Works with Canon, Nikon, Sony and other professional cameras |
| **Original quality preserved** | No forced compression, RAW preview support |
| **Event isolation** | Each event has separate folder + subdomain |
| **24-hour event window** | Automatic cleanup after event expires |

### **For Guests**

| Feature | Benefit |
|---------|---------|
| **QR-based access** | One scan, instant access (no login, no app) |
| **AI face recognition (99%+ accurate)** | Each person sees only their photos, no scrolling |
| **Fast results** | Photo matching in < 1 second |
| **High-quality downloads** | Full resolution originals + thumbnails |
| **Social sharing** | One-click share to WhatsApp, Instagram, Facebook |
| **Mobile-friendly interface** | Works perfectly on any smartphone |

### **For Event Organizers / Your Client**

| Feature | Benefit |
|---------|---------|
| **Professional branded event page** | Your logo, colors, custom messaging |
| **Real-time photo count & stats** | See uploads happening live |
| **Guest engagement metrics** | Track how many guests accessed photos |
| **24-hour auto-cleanup** | GDPR-compliant, privacy-first by default |
| **Scalable architecture** | Handle 50-1000+ guest events simultaneously |
| **API for future integrations** | Connect to CRM, email platforms, etc. |

---

## **5. AI FACE RECOGNITION**

Our face recognition technology is **accurate, fast, and cost-effective**:

- **Accuracy:** 99%+ match rate across varying lighting, angles, and conditions (even with glasses or makeup)
- **Speed:** Results delivered in < 1 second
- **Privacy:** Guest selfies are processed and discarded immediately – not stored
- **Cost-effective:** CPU-optimized models (no expensive GPU servers needed)

---

## **6. PRIVACY & DATA SECURITY**

SpotPic is **built with privacy as the default**:

### **Data Handling**

- Photos are stored in **secure Cloudinary infrastructure**
- Guest selfies are **not stored** (processed on-the-fly)
- Face embeddings are **deleted after 24 hours**
- All data transmission uses **HTTPS encryption**
- Compliant with **GDPR, CCPA, and Indian data protection laws**

### **24-Hour Auto-Delete**

Every event automatically:
- Expires after 24 hours
- 🗑️ Deletes all photos and associated data
- 🚫 Becomes inaccessible to guests
- 📦 Can be archived/backed up by photographer (optional future feature)

### **No Long-Term Storage by Default**

- Events are **ephemeral** (temporary)
- Photographer can manually archive important events
- No data lingering on our servers indefinitely

---

## **7. INVESTMENT & PRICING**

### **Project Cost Breakdown**

| Component | Cost (₹) | Details |
|-----------|---------|---------|
| **Desktop Software** | 30,000 | Complete working desktop application (Windows + macOS) with auto-detect, async uploads, and real-time progress tracking |
| **Backend System** | 20,000 | Complete working backend infrastructure including face recognition, vector embedding, and photo indexing |
| **Website & Subdomain Processing** | 15,000 | Guest-facing website, dynamic subdomain generation, QR code generation, and AI-powered face search interface |
| **TOTAL DEVELOPMENT** | **65,000** | Complete, production-ready SpotPic platform |

**Note:** For Maintenance 40% per Subcription to be Paid to us. Backend server costs will be transparently communicated to you with detailed billing of all cloud services used (Cloudinary, databases, etc.) – you only pay for what's actually consumed.

### **Payment Schedule**

To reduce your financial risk, we structure payments **milestone-based**:

| Milestone | % | Amount (₹) | Condition |
|-----------|---|-----------|-----------|
| **Advance** | 30% | 19,500 | Upon signing agreement |
| **Balance** | 70% | 45,500 | Upon completion and deployment |

### **What's Included**

Full source code ownership (IP transfers to you)   
Cloud infrastructure setup and configuration  

---

## **8. WHY PARTNER WITH UPCRAFT SOLUTIONS?**

### **Our Proven Track Record**

Full-Stack Capability: 
We handle everything from desktop apps to backend APIs to web frontends to DevOps.

Client-Focused: 
We've worked with educational institutions, and startups. We understand your pain points.

### **Partnership Benefits**

If you partner with us to build SpotPic:
You get,
1. **IP Ownership:** You own all code, technology, and intellectual property
2. **First-mover advantage:** Launch before competitors recognize the opportunity
3. **Continuous innovation:** We become your ongoing technology partner
4. **Support & maintenance:** Included for 24/7 Support available

### **Quality Assurance Process**

- Unit testing (70%+ code coverage)
- Integration testing across all APIs
- End-to-end testing with real cameras
- Load testing (1000+ concurrent users)
- Security testing (OWASP Top 10)
- Beta testing with early photographer partners

---


## **9. SUCCESS METRICS & KPIs**

Once SpotPic launches, we'll measure success by:

### **Photographer Metrics**

- **Upload success rate:** Target > 99% (zero lost photos)
- **Time saved per event:** Target 3-4 hours saved (post-production elimination)
- **App stability:** Target > 99.5% uptime
- **Satisfaction:** Target NPS > 50

### **Guest Metrics**

- **Match accuracy:** Target > 98% (correct faces matched)
- **Response time:** Target < 1 second for face search
- **Engagement rate:** Target > 60% of guests scan QR
- **Download rate:** Target > 40% of matched guests download photos

### **Platform Metrics**

- **Storage utilization:** Monitor Cloudinary costs
- **Concurrent events:** Track max simultaneous events
- **Unique photographers:** Growth trajectory
- **Photo volume:** Growth in photos processed/month

---

## **10. COMMITMENT & AGREEMENT**

### **UpCraft's Commitment to You**

We commit to:

Quality: Deliver production-ready code with proper testing  
Timeline: Hit agreed milestones or communicate delays immediately  
Support: 24/7 support  
Transparency: Weekly progress updates and open communication  
Ownership: You own all IP and code generated  

### **Next Action**

**This proposal is valid for 30 days** (until **February 13, 2026**).

To move forward, please:

1. Review this proposal carefully
2. Schedule a **30-minute kickoff call** with our team
3. Confirm project details and timeline
4. Sign the **Statement of Work (SOW)** agreement

---

## **CONTACT & CALL TO ACTION**

### **Ready to Bring SpotPic to Life?**

We're excited about this opportunity and confident SpotPic will be a game-changer for event photographers and organizers.

**Let's Grow Together...**

### **Contact Information**

**UpCraft Solutions Private Limited**

- **Email:** upcraft.consulting@gmail.com
- **Phone:** +91-8870986738
- **Website:** https://upcraft.in

## **DOCUMENT FOOTER**

**Proposal Status:** Ready for Review  
**Valid Until:** February 13, 2026  
**Prepared By:** UpCraft Solutions 
**Document Version:** 1.0  
**Last Updated:** January 14, 2026  

---

**THIS PROPOSAL CONTAINS CONFIDENTIAL INFORMATION**

This proposal is prepared exclusively for Krithik Kumar. Unauthorized reproduction, distribution, or disclosure is prohibited.

---

**© 2026 UpCraft Solutions. All Rights Reserved.**

For more information, visit **https://upcraft.in**
