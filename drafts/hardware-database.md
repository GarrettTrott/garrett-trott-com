---
title: Building a Self-Hosted Hardware Specifications Database
excerpt: How I built a full-stack application to catalog IoT devices, automate documentation collection, and deploy it on my own infrastructure.
---

## The Problem

At work, I kept running into the same issue: researching meters, sensors, and LoRaWAN devices meant digging through dozens of manufacturer websites, downloading scattered PDFs, and manually comparing specifications in spreadsheets. There had to be a better way.

So I built one.

## What I Built

Hardware Database is a searchable catalog of IoT devices—water meters, electricity meters, LoRaWAN sensors, and gateways—with their complete specifications, documentation, and communication protocols in one place.

**Key features:**

- **Advanced filtering** by category, manufacturer, communication outputs (Modbus, LoRaWAN, 4-20mA), power options, and pipe sizes
- **PDF documentation** automatically downloaded and linked to each device
- **Real-time updates** via PocketBase subscriptions
- **Role-based access** with email-restricted registration and admin controls
- **Responsive design** that works on desktop and mobile

## The Stack

| Layer | Technology |
|-------|------------|
| Database | PocketBase (SQLite-based, self-hosted) |
| Frontend | Vanilla JavaScript, CSS |
| Deployment | Docker + Coolify on personal server |
| DNS/Email | AWS Route 53 + iCloud Custom Domains |

I intentionally avoided heavy frameworks. The entire frontend is ~2,000 lines of vanilla JS—fast, maintainable, and zero build step required.

## Technical Highlights

### PocketBase Hooks for Access Control

Registration is restricted to company email domains using server-side hooks:

```javascript
onRecordCreate((e) => {
    const email = e.record.get("email")?.toLowerCase();
    if (!email.endsWith("@milvian.group")) {
        throw new BadRequestError("Registration restricted");
    }
}, "users");
```

### Advanced Filtering System

The filtering system supports multiple simultaneous filters across categories, manufacturers, communication protocols, and power options. Users can filter by specific outputs like "LoRaWAN + Modbus RTU" to find devices that support both protocols.

### Real-Time Sync

PocketBase's real-time subscriptions mean when a coworker adds a device, everyone sees it instantly without refreshing.

## AI-Powered Data Entry with Claude Code

One of the more interesting aspects of this project is how I integrated Claude Code into the data entry workflow. I built custom slash commands that let me orchestrate the entire process through natural language:

| Command | Action |
|---------|--------|
| `/add-device` | Add a new meter or sensor to PocketBase |
| `/scrape [URL]` | Scrape product page, download PDFs, extract specs |
| `/scan-inbox` | Process PDFs dropped in the inbox folder |
| `/find-products` | Search the web for new products to add |
| `/check-links` | Verify documentation URLs are still valid |

Instead of manually filling out forms, I can say "scrape the ONICON F-3500 product page" and Claude will fetch the page, download all PDFs, extract specifications, and present the data for confirmation before uploading.

## The Inbox Workflow

The simplest way to add devices: drop a PDF datasheet into the `inbox/` folder and run `/scan-inbox`. The system automatically:

1. Identifies the manufacturer and product from the PDF
2. Extracts specifications using PDF text analysis
3. Moves the file to the organized `manuals/` folder structure
4. Presents extracted data for confirmation
5. Uploads to the live database

This turns a 15-minute manual data entry task into a 30-second review-and-confirm.

## Documentation Priority System

Not all documentation is equal. I learned that datasheets often omit critical information like wiring diagrams and Modbus register maps. The system follows a strict priority hierarchy:

| Priority | Document Type | Why It's Needed |
|----------|--------------|-----------------|
| 1 | Installation Manual | Wiring diagrams, mounting, physical install |
| 2 | Technical/Operation Manual | Configuration, programming, setup |
| 3 | Protocol Documentation | Modbus registers, BACnet objects |
| 4 | Datasheet | Specifications summary, accuracy, ratings |
| 5 | Brochure/Overview | Basic product info (lowest priority) |

The scraping tools search for all five types, not just datasheets. A meter without its installation manual is only half-documented.

## Source Traceability

Every device in the database has a corresponding `sources/[Manufacturer]_[Product]_sources.md` file that documents exactly where each data point came from:

```markdown
# ONICON F-3500 Sources

## Specifications
- Accuracy: ±0.5% (F-3500 Datasheet, p.2)
- Pipe sizes: 1/2" to 240" (Installation Manual, p.8)
- Power: 100-240 VAC (Datasheet, p.3)

## Documentation
- Datasheet: https://onicon.com/f-3500-datasheet.pdf
- Installation Manual: https://onicon.com/f-3500-install.pdf
```

This matters when specifications conflict between sources or when I need to verify data months later.

## The Tooling Ecosystem

Beyond the Claude Code integration, there's a suite of 15+ specialized Python tools:

**Core Database Tools:**
- `add_meter.py` — Upload device data to PocketBase
- `export_pocketbase_to_csv.py` — Backup database to CSV
- `cleanup_duplicates.py` — Find and remove duplicate entries

**Documentation Tools:**
- `batch_download_docs.py` — Bulk download PDFs for all products
- `organize_inbox_pdfs.py` — Sort inbox files into folder structure
- `pdf_preprocessor.py` — Extract text from PDFs for analysis

**Discovery & Quality Tools:**
- `find_new_products.py` — Search the web for products not in the database
- `check_links.py` — Verify all documentation URLs are valid
- `analyze_missing_pdfs.py` — Find products without complete documentation

The product discovery tool is particularly useful. It searches DuckDuckGo for products by category and manufacturer, compares results against the existing database, and suggests additions:

```bash
python tools/find_new_products.py --category "LoRaWAN Sensor" --show-stats
```

## Data Quality Rules

Three rules that keep the database trustworthy:

1. **No guessing** — Missing data stays empty rather than estimated
2. **PDF over web** — Specification sheets override marketing copy
3. **Confirm before upload** — Every addition requires human review

The tools automate collection and extraction, but a human always approves the final data.

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│              Coolify (Docker)           │
├─────────────────────────────────────────┤
│  nginx (reverse proxy + static files)   │
│              ↓                          │
│  PocketBase (API + auth + database)     │
│              ↓                          │
│  Persistent Volume (pb_data)            │
└─────────────────────────────────────────┘
```

Everything runs in a single container with supervisor managing both nginx and PocketBase. The ~500MB of PDF documentation is baked into the Docker image for simplicity.

## What I Learned

1. **PocketBase is underrated** — For internal tools, it eliminates the need for a separate auth service, ORM, and admin panel.

2. **Vanilla JS is fine** — Not every project needs React. For data-driven UIs with filtering and sorting, vanilla JS with good organization is plenty.

3. **Self-hosting is worth it** — Running on my own server with Coolify costs a fraction of cloud services and gives me full control.

4. **AI accelerates tedious work** — The Claude Code integration turned hours of manual data entry into minutes of review-and-confirm.

5. **Documentation matters** — The most useful feature isn't the fancy filters—it's having every datasheet and manual in one searchable place.

## By the Numbers

- **150+** devices cataloged
- **400+** PDF documents downloaded and organized
- **30+ manufacturers** covered
- **15+ Python tools** for automation
- **Research time reduced** from 30 minutes to 2 minutes per device

## Try It

The database is live at [hardwaredb.apps.garrett-trott.com](https://hardwaredb.apps.garrett-trott.com) (requires company email to register).

Source code available on [GitHub](https://github.com/GarrettTrott/hardware-database).

---

*Built with PocketBase, vanilla JavaScript, and Docker. Deployed on Coolify. Data entry powered by Claude Code.*
