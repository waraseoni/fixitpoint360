# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-09-19

### Added
- Public marketing website (Home, Services, AMC, About, Contact) with Hindi/English language toggle.
- QR code sharing for the public site in the navbar and dashboard header.
- "Same day repair" mobile repair advertisement banner on the home page.
- Role-based user management (owner/admin/staff) with permission guards.
- Repair job management with job cards, scheduling, assignment, charges and payment tracking.
- Documents module — Bills, Invoices, Estimates and Quotations with line items,
  discount/GST, printable view, and per-job document generation.
- Inventory module with stock levels, low-stock alerts, pricing and stock in/out adjustments.
- Client management with ledger/balance tracking.
- AMC, attendance, salary, TA-DA, transactions and ledger bookkeeping modules.
- Supabase backend: schema, RLS policies, auth profile auto-creation.

### Changed
- Store hydrate now loads tables independently so one missing table cannot blank the whole app.

### Fixed
- Document counter stored under the wrong app_meta key.
- GitHub origin switched from `fixitpoint360-lab/fixitpoint360` to `waraseoni/fixitpoint360`.