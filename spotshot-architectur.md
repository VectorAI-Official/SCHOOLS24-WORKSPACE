## **7. TECHNOLOGY STACK & ARCHITECTURE**

### **Simple Overview**

We will build SpotShot using **proven, reliable technologies**:

#### **Desktop Applications**

| Platform | Technology | Why |
|----------|-----------|-----|
| **Windows** | C# (.NET 8) + Electron | Native hardware access (USB), modern UI |
| **macOS** | Swift + ImageCaptureCore | Native, zero permissions issues |

#### **Web Platform**

| Component | Technology | Why |
|-----------|-----------|-----|
| **Guest UI** | React 18 + TypeScript | Fast, responsive, mobile-friendly |
| **Backend API** | Go (Gin) or Node.js | Scalable, handles many concurrent uploads |
| **Database** | PostgreSQL | Reliable, structured data (events, users, stats) |
| **Cache** | Redis | Fast retrieval of embeddings and search indexes |

#### **Cloud Services**

| Service | Provider | Why |
|---------|----------|-----|
| **Photo Storage** | Cloudinary | CDN delivery, automatic optimization |
| **AI/ML Models** | ONNX Runtime (CPU) | Lightweight, no GPU dependency |
| **Vector Search** | FAISS | Ultra-fast similarity search for faces |
| **Hosting** | Hetzner or DigitalOcean | Cost-effective, high performance |

#### **Infrastructure**

- **Server:** 8-core CPU, 16GB RAM (no GPU needed)
- **Cost:** ₹3,000-6,000/month
- **Capacity:** Handles 50+ simultaneous events, 100K+ photos, 10K+ face embeddings per event

### **Architecture Diagram (Simplified)**

```
┌─────────────────────────────────────────────────────────────┐
│                     SPOTSHOT ARCHITECTURE                    │
└─────────────────────────────────────────────────────────────┘

PHOTOGRAPHER                    SPOTSHOT PLATFORM               GUESTS
┌─────────────┐                ┌──────────────────┐           ┌─────────┐
│ Desktop App │                │  spotshot.com    │           │ Browser │
│ (C# + Elec) │──Upload───────▶│  (React + Go)    │◀──QR──────│ (Mobile)│
└─────────────┘                │                  │           └─────────┘
       │                       └──────────────────┘                │
       │                              │                            │
       │                              │                            │
       └──────────────────────────────┼────────────────────────────┘
                                      │
                        ┌─────────────┴─────────────┐
                        │                           │
                   ┌────▼─────┐              ┌──────▼────┐
                   │Cloudinary │              │PostgreSQL │
                   │(Photos)   │              │(Metadata) │
                   └───────────┘              └───────────┘
                        │                           │
                        │                           │
                   ┌────▼─────┐              ┌──────▼────┐
                   │  FAISS    │              │   Redis   │
                   │ (Face     │              │(Embeddings│
                   │Embeddings)│              │  Cache)   │
                   └───────────┘              └───────────┘
```

---

