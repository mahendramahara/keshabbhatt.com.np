import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Plus, User, Mail, Trash2 } from "lucide-react-native";
import { useAppTheme } from "@/store/theme-context";
import type { AdminUser } from "@keshab-bhatt/types";
import { AdminCard } from "../ui/AdminCard";
import { AdminBadge } from "../ui/AdminBadge";
import { AdminButton } from "../ui/AdminButton";
import { AdminInput } from "../ui/AdminInput";
import { AdminModal } from "../ui/AdminModal";
import { AdminEmptyState } from "../ui/AdminEmptyState";

export interface AdminsScreenProps {
  admins: AdminUser[];
  currentAdmin: AdminUser | null;
  isLoading: boolean;
  onRefresh: () => void;
  onCreateAdmin: (data: Partial<AdminUser> & { password?: string }) => Promise<void>;
  onDeleteAdmin?: (id: string) => Promise<void>;
}

export const AdminsScreen: React.FC<AdminsScreenProps> = ({
  admins,
  currentAdmin,
  isLoading,
  onRefresh,
  onCreateAdmin,
  onDeleteAdmin,
}) => {
  const { colors } = useAppTheme();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "superadmin">("admin");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isSuperadmin = currentAdmin?.role === "superadmin";

  const handleOpenAdd = () => {
    if (!isSuperadmin) {
      Alert.alert("Permission Denied", "Only Superadmins can invite or create new administrators.");
      return;
    }
    setName("");
    setEmail("");
    setUsername("");
    setPassword("");
    setRole("admin");
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Required", "Full name is required.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      Alert.alert("Invalid Email", "Please enter a valid corporate email.");
      return;
    }
    if (!username.trim() || username.length < 3) {
      Alert.alert("Invalid Username", "Username must be at least 3 characters.");
      return;
    }
    if (!password || password.length < 6) {
      Alert.alert("Password Too Short", "Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreateAdmin({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        username: username.trim().toLowerCase(),
        password,
        role,
        isActive: true,
      });
      setIsModalOpen(false);
    } catch (err: any) {
      Alert.alert("Creation Failed", err.message || "Failed to create administrator.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (adminItem: AdminUser) => {
    if (!isSuperadmin) {
      Alert.alert("Permission Denied", "Only Superadmins can remove administrators.");
      return;
    }
    if (adminItem.id === currentAdmin?.id) {
      Alert.alert("Action Not Allowed", "You cannot delete your own active administrator account.");
      return;
    }
    if (!onDeleteAdmin) return;

    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete administrator account "@${adminItem.username}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeletingId(adminItem.id);
            try {
              await onDeleteAdmin(adminItem.id);
            } catch (err: any) {
              Alert.alert("Delete Failed", err.message || "Failed to delete administrator.");
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 px-4 pt-3">
      {/* Header Bar */}
      <View className="flex-row items-center justify-between mb-3">
        <View>
          <Text style={{ color: colors.textMain }} className="font-bold text-base tracking-tight">
            Administrator Accounts
          </Text>
          <Text style={{ color: colors.textMuted }} className="text-xs">
            {admins.length} Authorized credentials
          </Text>
        </View>

        {isSuperadmin && (
          <AdminButton
            title="Add Admin"
            onPress={handleOpenAdd}
            variant="gold"
            size="sm"
            icon={<Plus size={14} color="#040e24" />}
          />
        )}
      </View>

      {/* Admins FlatList */}
      <FlatList
        data={admins}
        keyExtractor={(item) => item.id || item.username}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24, gap: 12 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            tintColor={colors.gold}
          />
        }
        ListEmptyComponent={
          <AdminEmptyState
            title="No Admin Records"
            subtitle="Administrator credentials will appear here once retrieved from the database."
          />
        }
        renderItem={({ item }) => (
          <AdminCard className="p-4">
            <View style={{ gap: 12 }} className="flex-row items-center justify-between mb-3">
              <View style={{ gap: 12 }} className="flex-row items-center flex-1">
                <View
                  style={{ backgroundColor: colors.gold }}
                  className="w-10 h-10 rounded-xl items-center justify-center shadow-xs shrink-0"
                >
                  <Text className="text-slate-950 font-bold text-sm">
                    {item.name?.charAt(0) || "A"}
                  </Text>
                </View>

                <View className="flex-1">
                  <Text style={{ color: colors.textMain }} className="font-bold text-sm">
                    {item.name}
                  </Text>
                  <Text style={{ color: colors.textMuted }} className="text-xs font-mono">
                    @{item.username}
                  </Text>
                </View>
              </View>

              <View style={{ gap: 8 }} className="flex-row items-center">
                <AdminBadge
                  label={item.role || "admin"}
                  variant={item.role === "superadmin" ? "gold" : "neutral"}
                  size="sm"
                />

                {isSuperadmin && item.id !== currentAdmin?.id && onDeleteAdmin && (
                  <TouchableOpacity
                    onPress={() => handleDelete(item)}
                    activeOpacity={0.7}
                    disabled={deletingId === item.id}
                    className="p-1.5 rounded-lg"
                    style={{ backgroundColor: colors.dangerSoft }}
                  >
                    <Trash2 size={14} color={colors.danger} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View
              style={{
                borderTopColor: colors.surfaceBorder,
                borderTopWidth: 1,
              }}
              className="pt-2.5 flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-1.5 flex-1 mr-2">
                <Mail size={12} color={colors.textMuted} />
                <Text style={{ color: colors.textSecondary }} className="text-xs font-mono" numberOfLines={1}>
                  {item.email}
                </Text>
              </View>

              <View className="flex-row items-center gap-1">
                <View
                  style={{
                    backgroundColor: item.isActive ? colors.success : colors.danger,
                  }}
                  className="w-2 h-2 rounded-full"
                />
                <Text style={{ color: colors.textMuted }} className="text-[11px] font-semibold">
                  {item.isActive ? "Active" : "Disabled"}
                </Text>
              </View>
            </View>
          </AdminCard>
        )}
      />

      {/* Add Admin Modal */}
      <AdminModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Administrator Account"
        footer={
          <View style={{ gap: 10 }} className="flex-row pb-2">
            <AdminButton
              title="Cancel"
              onPress={() => setIsModalOpen(false)}
              variant="outline"
              size="md"
              className="flex-1"
            />
            <AdminButton
              title="Create Account"
              onPress={handleSave}
              variant="gold"
              size="md"
              loading={isSubmitting}
              className="flex-1"
            />
          </View>
        }
      >
        <View style={{ gap: 14 }} className="pb-4">
          <AdminInput
            label="Full Name *"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Keshab Datt Bhatt"
            icon={<User size={16} color={colors.textMuted} />}
          />

          <AdminInput
            label="Corporate Email *"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="e.g. admin@keshabbhatt.com.np"
            icon={<Mail size={16} color={colors.textMuted} />}
            autoCapitalize="none"
          />

          <AdminInput
            label="Username *"
            value={username}
            onChangeText={setUsername}
            placeholder="e.g. keshabbhatt"
            autoCapitalize="none"
          />

          <AdminInput
            label="Temporary Password *"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="At least 6 characters"
          />

          {/* Role Picker */}
          <View style={{ gap: 6 }}>
            <Text style={{ color: colors.textMuted }} className="text-xs font-semibold uppercase tracking-wider">
              Assigned Role
            </Text>
            <View style={{ gap: 8 }} className="flex-row">
              <TouchableOpacity
                onPress={() => setRole("admin")}
                activeOpacity={0.7}
                style={{
                  backgroundColor: role === "admin" ? colors.gold : colors.inputBg,
                  borderColor: role === "admin" ? colors.gold : colors.surfaceBorder,
                  borderWidth: 1,
                }}
                className="flex-1 py-2 rounded-xl items-center"
              >
                <Text
                  style={{
                    color: role === "admin" ? "#040e24" : colors.textSecondary,
                    fontWeight: "700",
                  }}
                  className="text-xs"
                >
                  Admin
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setRole("superadmin")}
                activeOpacity={0.7}
                style={{
                  backgroundColor: role === "superadmin" ? colors.gold : colors.inputBg,
                  borderColor: role === "superadmin" ? colors.gold : colors.surfaceBorder,
                  borderWidth: 1,
                }}
                className="flex-1 py-2 rounded-xl items-center"
              >
                <Text
                  style={{
                    color: role === "superadmin" ? "#040e24" : colors.textSecondary,
                    fontWeight: "700",
                  }}
                  className="text-xs"
                >
                  Superadmin
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </AdminModal>
    </View>
  );
};

export default AdminsScreen;
