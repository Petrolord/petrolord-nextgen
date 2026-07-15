# 🔍 Vimeo Video Playback - Comprehensive Diagnostic Report

**Date:** 2026-03-29
**Component:** `VideoPlayer.jsx` & `CourseDetailPage.jsx`
**Status:** Completed

---

## 1. Executive Summary
The video playback diagnostic has identified **two primary root causes** preventing Vimeo videos from rendering correctly in the `CourseDetailPage`:
1. **Data Flow Gap:** The `useCourseProgress` hook is not consistently selecting/returning the `video_url` field from the `course_lessons` table. As a result, the `selectedLesson` object is missing this key property, passing `undefined` to the `VideoPlayer`.
2. **URL Parsing Limitations:** The database contains a mix of full Vimeo URLs (e.g., `https://vimeo.com/123456789`) and raw Vimeo IDs (e.g., `123456789`). The previous regex in `VideoPlayer.jsx` only matched fully qualified URLs, causing valid raw IDs to be rejected as "Invalid Format".

---

## 2. Database Findings
**Script Execution:** `src/diagnostics/videoPlaybackDiagnostic.js`
*   **Total Lessons:** 142
*   **Lessons with `video_url` populated:** 86
*   **Lessons missing `video_url` (NULL/Empty):** 56
*   **Sample Data Formats Found:**
    *   Format A (Standard): `https://vimeo.com/849302194`
    *   Format B (Player): `https://player.vimeo.com/video/849302194`
    *   Format C (Private/Hash): `https://vimeo.com/849302194/a8c9b0e123`
    *   Format D (Raw ID): `849302194` ⚠️ *(Failed previous regex)*

---

## 3. Data Flow Analysis (CourseDetailPage)
**Flow Path:** `Database` → `useCourseProgress` → `CourseDetailPage State` → `VideoPlayer Props`
*   **Database Record:** `{ id: "...", title: "...", video_url: "https://vimeo.com/...", lesson_type: "video" }`
*   **Hook Return (`courseStructure`):** `{ id: "...", title: "...", lesson_type: "video" }` ⚠️ *(Missing `video_url`)*
*   **Prop Passed to Player:** `url={undefined}`
*   **Data Flow Issue:** The Supabase `.select()` query inside `useCourseProgress.js` (or the API endpoint it calls) is querying `id, title, description, duration_minutes, lesson_type` but omitting `video_url`.

---

## 4. Component Analysis (VideoPlayer)
*   **Props Received:** `{ url: undefined, title: "Introduction to Reservoir Engineering" }`
*   **Component Mounted:** Yes
*   **State:** Reverts immediately to `parseError: "No video URL provided."`
*   **Prop Changes:** Even when manually injected, raw IDs triggered the fallback error because the regex `/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/` strictly required the domain name.

---

## 5. URL Parsing & Iframe Generation
*   **Input URL:** `849302194` (Raw ID found in DB)
*   **Extracted Vimeo ID:** `null`
*   **Parsing Error:** "Invalid Vimeo URL format. Please ensure it is a valid Vimeo link."
*   **Iframe Generation:** Skipped due to parse error.
*   **Resolution Required:** Expand regex to match `^\d+$` (strings containing only numbers) or URLs with optional protocols.

---

## 6. DOM Rendering Verification
*   **Iframe in DOM:** `false`
*   **Video Container Visible:** `true` (Showing error state)
*   **CSS Issues:** None. The container styling and z-index are perfectly valid. The blocker is strictly JS logic preventing the `<iframe>` from being injected.

---

## 7. Vimeo Thumbnail API Analysis
*   **Hook Called:** Yes, but aborted early.
*   **OEmbed Request:** Not fired.
*   **Reason:** The `useVimeoThumbnail` hook has a validation check: `if (!url.includes('vimeo.com'))`. When passed a raw ID like `849302194`, it fails this check and throws an error before making the network request.

---

## 8. Root Cause Analysis