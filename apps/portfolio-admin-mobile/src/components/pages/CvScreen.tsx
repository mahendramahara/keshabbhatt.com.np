import React, { useState } from "react";
import { View, Text, FlatList, RefreshControl, Alert, TouchableOpacity } from "react-native";
import { FileBadge, CheckCircle, HardDrive, Info, Trash2 } from "lucide-react-native";
import { useAppTheme } from "@/store/theme-context";
import type { MobileCvItem } from "@/services/api";
import { AdminCard } from "../ui/AdminCard";
import { AdminBadge } from "../ui/AdminBadge";
import { AdminButton } from "../ui/AdminButton";
import { AdminEmptyState } from "../ui/AdminEmptyState";

export interface CvScreenProps {
  cvs: MobileCvItem[];
  isLoading: boolean;
  onRefresh: () => void;
  onActivateCv: (id: string) => Promise<void>;
  onDeleteCv?: (id: string) => Promise<void>;
}

export const CvScreen: React.FC<CvScreenProps> = ({
  cvs,
  isLoading,
  onRefresh,
  onActivateCv,
  onDeleteCv,
}) => {
  const { colors } = useAppTheme();
  const [activatingId, setActivatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const activeCv = cvs.find((c) => c.isActive);

  const handleActivate = async (cv: MobileCvItem) => {
    if (cv.isActive) return;

    Alert.alert(
      "Set Active CV",
      `Set "${cv.filename}" as the primary downloadable CV on the public portfolio?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            setActivatingId(cv.id);
            try {
              await onActivateCv(cv.id);
              Alert.alert("Success", `Active CV updated to ${cv.filename}`);
            } catch (err: any) {
              Alert.alert("Activation Failed", err.message || "Failed to set active CV.");
            } finally {
              setActivatingId(null);
            }
          },
        },
      ]
    );
  };

  const handleDelete = (cv: MobileCvItem) => {
    if (cv.isActive) {
      Alert.alert("Cannot Delete Active CV", "Please activate another CV before deleting this one.");
      return;
    }
    if (!onDeleteCv) return;

    Alert.alert(
      "Delete CV Document",
      `Are you sure you want to permanently delete "${cv.filename}" from the server?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeletingId(cv.id);
            try {
              await onDeleteCv(cv.id);
            } catch (err: any) {
              Alert.alert("Delete Failed", err.message || "Failed to delete CV document.");
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return "0 KB";
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <View className="flex-1 px-4 pt-3">
      {/* Header Info */}
      <View className="mb-3">
        <Text style={{ color: colors.textMain }} className="font-bold text-base tracking-tight">
          Executive Curriculum Vitae
        </Text>
        <Text style={{ color: colors.textMuted }} className="text-xs">
          Manage the public downloadable PDF document (/cv/keshabbhatt.com.np.pdf)
        </Text>
      </View>

      {/* Active CV Primary Card */}
      {activeCv && (
        <AdminCard className="mb-4 p-4 border-amber-500/40">
          <View style={{ gap: 12 }} className="flex-row items-center justify-between mb-3">
            <View style={{ gap: 10 }} className="flex-row items-center flex-1">
              <View
                style={{ backgroundColor: colors.gold }}
                className="w-9 h-9 rounded-xl items-center justify-center shadow-xs shrink-0"
              >
                <FileBadge size={18} color="#040e24" />
              </View>
              <View className="flex-1">
                <Text style={{ color: colors.textMain }} className="font-bold text-sm">
                  Active Public Document
                </Text>
                <Text style={{ color: colors.textMuted }} className="text-[11px]">
                  Streams directly to recruiters & clients
                </Text>
              </View>
            </View>

            <AdminBadge label="Primary Active" variant="success" size="sm" dot />
          </View>

          <View
            style={{
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.surfaceBorder,
              borderWidth: 1,
              gap: 4,
            }}
            className="p-3 rounded-xl mb-3"
          >
            <Text style={{ color: colors.textMain }} className="font-bold text-xs font-mono">
              {activeCv.filename}
            </Text>
            <View className="flex-row items-center justify-between">
              <Text style={{ color: colors.textMuted }} className="text-[11px]">
                Original: {activeCv.originalName}
              </Text>
              <Text style={{ color: colors.gold }} className="text-xs font-semibold">
                {formatSize(activeCv.size)}
              </Text>
            </View>
          </View>

          <View style={{ gap: 8 }} className="flex-row items-center">
            <View
              style={{
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.surfaceBorder,
                borderWidth: 1,
                gap: 8,
              }}
              className="flex-1 py-2 px-3 rounded-xl flex-row items-center"
            >
              <HardDrive size={14} color={colors.textMuted} />
              <Text style={{ color: colors.textSecondary }} className="text-xs">
                Stored in public/cv/
              </Text>
            </View>

            <View
              style={{
                backgroundColor: colors.goldSoft,
                borderColor: colors.goldBorder,
                borderWidth: 1,
                gap: 6,
              }}
              className="py-2 px-3 rounded-xl flex-row items-center"
            >
              <CheckCircle size={14} color={colors.gold} />
              <Text style={{ color: colors.gold }} className="text-xs font-semibold">
                Live Online
              </Text>
            </View>
          </View>
        </AdminCard>
      )}

      {/* FIFO Storage Policy Note */}
      <View
        style={{
          backgroundColor: colors.backgroundSecondary,
          borderColor: colors.surfaceBorder,
          borderWidth: 1,
          gap: 10,
        }}
        className="p-3 rounded-xl mb-3 flex-row items-center"
      >
        <Info size={16} color={colors.gold} />
        <Text style={{ color: colors.textSecondary }} className="text-xs flex-1 leading-relaxed">
          Storage FIFO limit: Only the 2 most recent CV documents are retained. Evicted files are automatically purged from the server.
        </Text>
      </View>

      {/* Stored CVs List */}
      <Text style={{ color: colors.textMuted }} className="text-xs font-semibold uppercase tracking-wider mb-2">
        Available CV Documents ({cvs.length})
      </Text>

      <FlatList
        data={cvs}
        keyExtractor={(item) => item.id || item.filename}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24, gap: 10 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            tintColor={colors.gold}
          />
        }
        ListEmptyComponent={
          <AdminEmptyState
            title="No CV Records"
            subtitle="Executive CV documents will appear here once loaded from the server."
          />
        }
        renderItem={({ item }) => (
          <AdminCard className="p-3.5">
            <View style={{ gap: 10 }} className="flex-row items-center justify-between">
              <View className="flex-1 mr-2">
                <View style={{ gap: 8 }} className="flex-row items-center">
                  <Text style={{ color: colors.textMain }} className="font-bold text-xs font-mono" numberOfLines={1}>
                    {item.filename}
                  </Text>
                  {item.isActive && (
                    <AdminBadge label="Active" variant="success" size="sm" />
                  )}
                </View>

                <Text style={{ color: colors.textMuted }} className="text-[11px] mt-0.5">
                  Size: {formatSize(item.size)} • Uploaded by: {item.uploadedBy || "System"}
                </Text>
              </View>

              <View style={{ gap: 8 }} className="flex-row items-center">
                {!item.isActive && (
                  <AdminButton
                    title="Make Active"
                    onPress={() => handleActivate(item)}
                    variant="outline"
                    size="sm"
                    loading={activatingId === item.id}
                  />
                )}

                {!item.isActive && onDeleteCv && (
                  <TouchableOpacity
                    onPress={() => handleDelete(item)}
                    activeOpacity={0.7}
                    disabled={deletingId === item.id}
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: colors.dangerSoft }}
                  >
                    <Trash2 size={14} color={colors.danger} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </AdminCard>
        )}
      />
    </View>
  );
};

export default CvScreen;
