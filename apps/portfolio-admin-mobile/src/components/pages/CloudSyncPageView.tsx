import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

export interface CloudSyncPageViewProps {
  isChecking: boolean;
  lastCheckResult: { success: boolean; message: string; timestamp: string } | null;
  latencyMs: number | null;
  onTriggerKeepAlive: () => void;
  totalArticles: number;
}

export function CloudSyncPageView({
  isChecking,
  lastCheckResult,
  latencyMs,
  onTriggerKeepAlive,
  totalArticles,
}: CloudSyncPageViewProps) {
  return (
    <ScrollView className="flex-1 bg-slate-950 px-4 py-4">
      <View className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-5 shadow-sm">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-2.5">
            <View className="w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-emerald-300" />
            <Text className="text-base font-bold text-slate-100">
              Supabase PostgreSQL
            </Text>
          </View>
          <Badge label="Active Pooler" variant="emerald" />
        </View>

        <Text className="text-xs text-slate-300 leading-relaxed mb-4">
          Direct connection to Supabase Transaction Pooler (ap-southeast-1). Synchronized across Next.js Portfolio and Expo Mobile CMS.
        </Text>

        <View className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
          <View className="flex-row justify-between items-center">
            <Text className="text-[11px] text-slate-400">Total Synchronized Posts</Text>
            <Text className="text-xs font-bold text-amber-300">{totalArticles} Articles</Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-[11px] text-slate-400">Last Ping Latency</Text>
            <Text className="text-xs font-mono text-emerald-400">
              {latencyMs !== null ? `${latencyMs} ms` : "Pending ping"}
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-[11px] text-slate-400">Host Region</Text>
            <Text className="text-xs font-mono text-slate-300">aws-0-ap-southeast-1</Text>
          </View>
        </View>
      </View>

      <View className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 mb-5">
        <View className="flex-row items-center gap-2 mb-2">
          <Ionicons name="pulse-outline" size={18} color="#d4af37" />
          <Text className="text-sm font-bold text-slate-200">
            24/7 Keep-Alive Heartbeat
          </Text>
        </View>
        <Text className="text-xs text-slate-400 leading-relaxed mb-4">
          Supabase free projects automatically pause after a period of inactivity. This mobile application and our Next.js API route (`/api/cron/keep-alive`) perform continuous heartbeat pings to ensure 100% database availability for visitors.
        </Text>

        <Button
          title={isChecking ? "Pinging Supabase Server..." : "Ping Keep-Alive Endpoint Now"}
          onPress={onTriggerKeepAlive}
          variant="primary"
          loading={isChecking}
          icon={<Ionicons name="flash-outline" size={16} color="#0f172a" />}
        />
      </View>

      {lastCheckResult ? (
        <View className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-5">
          <View className="flex-row items-center gap-2 mb-2">
            <Ionicons
              name={lastCheckResult.success ? "checkmark-circle" : "alert-circle"}
              size={18}
              color={lastCheckResult.success ? "#10b981" : "#ef4444"}
            />
            <Text className="text-xs font-bold text-slate-200">
              Heartbeat Response
            </Text>
          </View>
          <Text className="text-xs text-slate-300 mb-1">
            {lastCheckResult.message}
          </Text>
          <Text className="text-[10px] text-slate-500 font-mono">
            Timestamp: {lastCheckResult.timestamp}
          </Text>
        </View>
      ) : null}

      <View className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4">
        <Text className="text-xs font-bold text-slate-300 mb-2">
          Enterprise Security & Consistency
        </Text>
        <View className="space-y-1.5">
          <Text className="text-[11px] text-slate-400">
            • SSL encrypted PostgreSQL connection via Supabase pooler
          </Text>
          <Text className="text-[11px] text-slate-400">
            • Instant cache revalidation on Next.js frontend upon mobile edits
          </Text>
          <Text className="text-[11px] text-slate-400">
            • Validated with `@keshab-bhatt/validation` Zod schema
          </Text>
        </View>
      </View>

      <View className="h-10" />
    </ScrollView>
  );
}
