import React from "react";
import { View } from "react-native";
import { useAppTheme } from "@/store/theme-context";
import { useAuth } from "@/store/auth-context";
import { useTab } from "@/store/tab-context";
import { useAdminData } from "@/store/data-context";
import {
  SplashScreen,
  LoginScreen,
  DashboardScreen,
  ArticlesScreen,
  CategoriesScreen,
  AdminsScreen,
  CvScreen,
} from "@/components/pages";
import { AdminHeader, AdminTabBar } from "@/components/ui";

export default function AdminAppMain() {
  const { colors } = useAppTheme();
  const { admin, isLoading: isAuthLoading, login } = useAuth();
  const { activeTab, setActiveTab } = useTab();

  const {
    stats,
    blogs,
    categories,
    admins,
    cvs,
    isLoading: isLoadingData,
    refreshData,
    createBlog,
    updateBlog,
    deleteBlog,
    createCategory,
    deleteCategory,
    createAdmin,
    deleteAdmin,
    activateCv,
    deleteCv,
  } = useAdminData();

  // 1. Initial Splash State
  if (isAuthLoading) {
    return <SplashScreen />;
  }

  // 2. Unauthenticated State -> Login Screen
  if (!admin) {
    return <LoginScreen onLogin={login} />;
  }

  // 3. Authenticated Admin State -> Screen based on Active Tab with Safe Insets
  return (
    <View style={{ backgroundColor: colors.background }} className="flex-1">
      {/* Top Header */}
      <AdminHeader title="Keshab Bhatt" subtitle="Admin Portal v1.2.1" />

      {/* Main Tab Views */}
      <View className="flex-1">
        {activeTab === "dashboard" && (
          <DashboardScreen
            stats={stats}
            recentBlogs={blogs}
            isLoading={isLoadingData}
            onRefresh={refreshData}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === "articles" && (
          <ArticlesScreen
            blogs={blogs}
            categories={categories}
            isLoading={isLoadingData}
            onRefresh={refreshData}
            onCreateBlog={createBlog}
            onUpdateBlog={updateBlog}
            onDeleteBlog={deleteBlog}
          />
        )}

        {activeTab === "categories" && (
          <CategoriesScreen
            categories={categories}
            isLoading={isLoadingData}
            onRefresh={refreshData}
            onCreateCategory={createCategory}
            onDeleteCategory={deleteCategory}
          />
        )}

        {activeTab === "admins" && (
          <AdminsScreen
            admins={admins}
            currentAdmin={admin}
            isLoading={isLoadingData}
            onRefresh={refreshData}
            onCreateAdmin={createAdmin}
            onDeleteAdmin={deleteAdmin}
          />
        )}

        {activeTab === "cv" && (
          <CvScreen
            cvs={cvs}
            isLoading={isLoadingData}
            onRefresh={refreshData}
            onActivateCv={activateCv}
            onDeleteCv={deleteCv}
          />
        )}
      </View>

      {/* Bottom Navigation Bar */}
      <AdminTabBar />
    </View>
  );
}
