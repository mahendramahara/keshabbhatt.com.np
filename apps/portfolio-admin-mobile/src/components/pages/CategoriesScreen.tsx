import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Plus, Trash2 } from "lucide-react-native";
import { useAppTheme } from "@/store/theme-context";
import type { BlogCategory } from "@keshab-bhatt/types";
import { AdminCard } from "../ui/AdminCard";
import { AdminButton } from "../ui/AdminButton";
import { AdminInput } from "../ui/AdminInput";
import { AdminModal } from "../ui/AdminModal";
import { AdminEmptyState } from "../ui/AdminEmptyState";

export interface CategoriesScreenProps {
  categories: BlogCategory[];
  isLoading: boolean;
  onRefresh: () => void;
  onCreateCategory: (data: Partial<BlogCategory>) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
}

export const CategoriesScreen: React.FC<CategoriesScreenProps> = ({
  categories,
  isLoading,
  onRefresh,
  onCreateCategory,
  onDeleteCategory,
}) => {
  const { colors } = useAppTheme();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#c98516");
  const [order, setOrder] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableColors = [
    { label: "Gold", hex: "#c98516" },
    { label: "Slate", hex: "#0284c7" },
    { label: "Deep Navy", hex: "#1d4ed8" },
    { label: "Amber", hex: "#b45309" },
    { label: "Emerald", hex: "#059669" },
    { label: "Violet", hex: "#7c3aed" },
  ];

  const handleOpenAdd = () => {
    setName("");
    setSlug("");
    setDescription("");
    setColor("#c98516");
    setOrder(String(categories.length + 1));
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Required", "Category name is required.");
      return;
    }

    const finalSlug =
      slug.trim() ||
      name
        .toLowerCase()
        .replace(/[\s\W-]+/g, "-")
        .replace(/^-+|-+$/g, "");

    setIsSubmitting(true);
    try {
      await onCreateCategory({
        name: name.trim(),
        slug: finalSlug,
        description: description.trim(),
        color,
        order: Number(order) || 0,
      });
      setIsModalOpen(false);
    } catch (err: any) {
      Alert.alert("Save Failed", err.message || "Failed to create category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (cat: BlogCategory) => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete category "${cat.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await onDeleteCategory(cat.id);
            } catch (err: any) {
              Alert.alert("Delete Failed", err.message || "Could not delete category.");
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
            Research Categories
          </Text>
          <Text style={{ color: colors.textMuted }} className="text-xs">
            {categories.length} Curricula and taxonomy topics
          </Text>
        </View>

        <AdminButton
          title="Add Category"
          onPress={handleOpenAdd}
          variant="gold"
          size="sm"
          icon={<Plus size={14} color="#040e24" />}
        />
      </View>

      {/* Categories FlatList */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id || item.slug}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            tintColor={colors.gold}
          />
        }
        ListEmptyComponent={
          <AdminEmptyState
            title="No Categories Available"
            subtitle="Add your first professional finance category."
            actionTitle="Add Category"
            onAction={handleOpenAdd}
          />
        }
        renderItem={({ item }) => (
          <AdminCard className="mb-2.5 p-3.5">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3 flex-1 mr-2">
                <View
                  style={{ backgroundColor: item.color || colors.gold }}
                  className="w-4 h-4 rounded-full shadow-xs"
                />
                <View className="flex-1">
                  <Text style={{ color: colors.textMain }} className="font-bold text-sm">
                    {item.name}
                  </Text>
                  <Text style={{ color: colors.textMuted }} className="text-xs font-mono">
                    /{item.slug}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-2">
                <View
                  style={{ backgroundColor: colors.backgroundSecondary }}
                  className="px-2 py-0.5 rounded border border-[var(--border-subtle)]"
                >
                  <Text style={{ color: colors.textMuted }} className="text-[11px] font-mono">
                    #{item.order}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => handleDelete(item)}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: colors.dangerSoft,
                    borderColor: colors.dangerBorder,
                    borderWidth: 1,
                  }}
                  className="p-1.5 rounded-lg"
                >
                  <Trash2 size={13} color={colors.danger} />
                </TouchableOpacity>
              </View>
            </View>

            {item.description ? (
              <Text style={{ color: colors.textSecondary }} className="text-xs mt-2 leading-relaxed" numberOfLines={2}>
                {item.description}
              </Text>
            ) : null}
          </AdminCard>
        )}
      />

      {/* Add Category Modal */}
      <AdminModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Category"
        footer={
          <View className="flex-row gap-2.5 pb-2">
            <AdminButton
              title="Cancel"
              onPress={() => setIsModalOpen(false)}
              variant="outline"
              size="md"
              className="flex-1"
            />
            <AdminButton
              title="Create Category"
              onPress={handleSave}
              variant="gold"
              size="md"
              loading={isSubmitting}
              className="flex-1"
            />
          </View>
        }
      >
        <View className="space-y-3.5 pb-4">
          <AdminInput
            label="Category Name *"
            value={name}
            onChangeText={(text) => {
              setName(text);
              setSlug(
                text
                  .toLowerCase()
                  .replace(/[\s\W-]+/g, "-")
                  .replace(/^-+|-+$/g, "")
              );
            }}
            placeholder="e.g. Accounting & Financial Reporting"
          />

          <AdminInput
            label="Slug *"
            value={slug}
            onChangeText={setSlug}
            placeholder="e.g. accounting-financial-reporting"
          />

          <AdminInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Curricula summary and thematic scope..."
            multiline
            numberOfLines={3}
          />

          {/* Color Picker Swatches */}
          <View className="space-y-1.5">
            <Text style={{ color: colors.textMuted }} className="text-xs font-semibold uppercase tracking-wider">
              Accent Color
            </Text>
            <View className="flex-row gap-2.5 flex-wrap">
              {availableColors.map((c) => {
                const isSelected = color === c.hex;
                return (
                  <TouchableOpacity
                    key={c.hex}
                    onPress={() => setColor(c.hex)}
                    activeOpacity={0.7}
                    style={{
                      borderColor: isSelected ? colors.textMain : colors.surfaceBorder,
                      borderWidth: isSelected ? 2 : 1,
                      backgroundColor: colors.inputBg,
                    }}
                    className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-xl"
                  >
                    <View
                      style={{ backgroundColor: c.hex }}
                      className="w-3.5 h-3.5 rounded-full"
                    />
                    <Text style={{ color: colors.textSecondary }} className="text-xs font-medium">
                      {c.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <AdminInput
            label="Display Order Number"
            value={order}
            onChangeText={setOrder}
            keyboardType="numeric"
            placeholder="1"
          />
        </View>
      </AdminModal>
    </View>
  );
};

export default CategoriesScreen;
