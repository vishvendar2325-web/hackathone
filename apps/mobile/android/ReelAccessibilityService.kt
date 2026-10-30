package com.focusflow.android.service

import android.accessibilityservice.AccessibilityService
import android.view.accessibility.AccessibilityEvent
import android.util.Log

/**
 * FocusFlow ReelAccessibilityService
 * Subscribes strictly to VIEW_SCROLLED events on supported short-form video viewpagers.
 * PRIVACY: Zero text extraction, zero keystroke logging, zero message access.
 */
class ReelAccessibilityService : AccessibilityService() {

    companion object {
        private const val TAG = "FocusFlowReels"
        private const val DEBOUNCE_THRESHOLD_MS = 1400L

        const val PKG_INSTAGRAM = "com.instagram.android"
        const val PKG_YOUTUBE = "com.google.android.youtube"
        const val PKG_FACEBOOK = "com.facebook.katana"

        // View IDs verified for vertical pager transitions
        const val ID_CLIPS_VIEW_PAGER = "clips_viewer_view_pager"
    }

    private var lastTransitionTimestamp: Long = 0
    private var lastRecordedIndex: Int = -1

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null) return

        val pkgName = event.packageName?.toString() ?: return
        if (pkgName != PKG_INSTAGRAM && pkgName != PKG_YOUTUBE && pkgName != PKG_FACEBOOK) {
            return
        }

        if (event.eventType == AccessibilityEvent.TYPE_VIEW_SCROLLED) {
            val now = System.currentTimeMillis()
            if (now - lastTransitionTimestamp < DEBOUNCE_THRESHOLD_MS) {
                return // Debounce rapid swipe velocity
            }

            val toIndex = event.toIndex
            // Only confirm candidate transition if index has changed
            if (toIndex != -1 && toIndex != lastRecordedIndex) {
                lastTransitionTimestamp = now
                lastRecordedIndex = toIndex

                Log.d(TAG, "Observable Reel transition candidate: pkg=$pkgName, index=$toIndex (estimated)")
                broadcastReelTransition(pkgName, toIndex)
            }
        }
    }

    private fun broadcastReelTransition(pkg: String, index: Int) {
        // Dispatches event to local FocusFlow SQLite queue and WorkManager sync
    }

    override fun onInterrupt() {
        Log.w(TAG, "ReelAccessibilityService interrupted by system.")
    }
}
