package com.focusflow.android.usage

import android.app.usage.UsageStats
import android.app.usage.UsageStatsManager
import android.content.Context
import android.os.Build
import java.util.Calendar

/**
 * FocusFlow Android UsageStatsBridge
 * Interfaces with Android UsageStatsManager to compute active foreground duration per application.
 * PRIVACY GUARANTEE: Does NOT inspect private notifications, messages, or keystrokes.
 */
class UsageStatsBridge(private val context: Context) {

    fun hasUsagePermission(): Boolean {
        val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val calendar = Calendar.getInstance()
        val endTime = calendar.timeInMillis
        calendar.add(Calendar.DAY_OF_YEAR, -1)
        val startTime = calendar.timeInMillis

        val stats = usageStatsManager.queryUsageStats(
            UsageStatsManager.INTERVAL_DAILY,
            startTime,
            endTime
        )
        return stats != null && stats.isNotEmpty()
    }

    fun getDailyAppUsage(): List<AppUsageModel> {
        val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val calendar = Calendar.getInstance()
        calendar.set(Calendar.HOUR_OF_DAY, 0)
        calendar.set(Calendar.MINUTE, 0)
        calendar.set(Calendar.SECOND, 0)
        val startTime = calendar.timeInMillis
        val endTime = System.currentTimeMillis()

        val stats: List<UsageStats> = usageStatsManager.queryUsageStats(
            UsageStatsManager.INTERVAL_DAILY,
            startTime,
            endTime
        ) ?: return emptyList()

        val packageManager = context.packageManager

        return stats
            .filter { it.totalTimeInForeground > 60000 } // Minimum 1 minute active foreground
            .map { stat ->
                val appName = try {
                    val appInfo = packageManager.getApplicationInfo(stat.packageName, 0)
                    packageManager.getApplicationLabel(appInfo).toString()
                } catch (e: Exception) {
                    stat.packageName
                }

                AppUsageModel(
                    packageName = stat.packageName,
                    appName = appName,
                    foregroundMinutes = (stat.totalTimeInForeground / 60000).toInt(),
                    lastTimeUsed = stat.lastTimeUsed
                )
            }
            .sortedByDescending { it.foregroundMinutes }
    }
}

data class AppUsageModel(
    val packageName: String,
    val appName: String,
    val foregroundMinutes: Int,
    val lastTimeUsed: Long
)
