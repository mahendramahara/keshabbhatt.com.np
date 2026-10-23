"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  Trash2,
  AlertCircle,
  ExternalLink,
  Shield,
  Copy,
  Check,
  RefreshCw,
  HardDrive,
} from "lucide-react";
import { AdminCard, AdminButton, AdminBadge } from "../ui";
import { toast } from "sonner";

interface CvItem {
  id: string;
  filename: string;
  originalName: string;
  filePath?: string;
  url?: string;
  size: number;
  mimeType: string;
  isActive: boolean;
  uploadedBy?: string;
  createdAt: string;
  updatedAt: string;
  downloadUrl: string;
}

export const CvManager: React.FC = () => {
  const [cvs, setCvs] = useState<CvItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const fetchCvs = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/admin/cv");
      const json = await res.json();
      if (res.ok && json.success) {
        setCvs(json.data || []);
      } else {
        setErrorMessage(json.message || "Failed to load CV documents.");
      }
    } catch {
      setErrorMessage("Network error while retrieving CVs.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    async function initialFetch() {
      try {
        const res = await fetch("/api/admin/cv");
        const json = await res.json();
        if (isSubscribed && res.ok && json.success) {
          setCvs(json.data || []);
        } else if (isSubscribed) {
          setErrorMessage(json.message || "Failed to load CV documents.");
        }
      } catch {
        if (isSubscribed) {
          setErrorMessage("Network error while retrieving CVs.");
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    }

    initialFetch();

    return () => {
      isSubscribed = false;
    };
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      setErrorMessage("Please select a valid PDF (.pdf) file.");
      setSelectedFile(null);
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage("The selected file exceeds the 15MB size limit.");
      setSelectedFile(null);
      return;
    }

    setErrorMessage(null);
    setSelectedFile(file);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMessage("Please choose a PDF file to upload.");
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/admin/cv", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setSuccessMessage("New executive CV successfully uploaded and activated.");
        toast.success("New executive CV uploaded and activated!");
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        await fetchCvs();
      } else {
        const err = json.message || json.error?.message || "Upload failed. Please try again.";
        setErrorMessage(err);
        toast.error(err);
      }
    } catch {
      const err = "An unexpected network error occurred during upload.";
      setErrorMessage(err);
      toast.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSetActive = async (id: string) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const res = await fetch(`/api/admin/cv/${id}/active`, {
        method: "PATCH",
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setSuccessMessage("Active CV updated successfully.");
        toast.success("Active CV updated successfully!");
        await fetchCvs();
      } else {
        const err = json.message || "Failed to activate CV.";
        setErrorMessage(err);
        toast.error(err);
      }
    } catch {
      const err = "Failed to update active CV.";
      setErrorMessage(err);
      toast.error(err);
    }
  };

  const handleDelete = async (id: string, filename: string) => {
    if (!confirm(`Are you sure you want to delete "${filename}"?`)) {
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const res = await fetch(`/api/admin/cv/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setSuccessMessage("CV document deleted successfully.");
        toast.success("CV document deleted.");
        await fetchCvs();
      } else {
        const err = json.message || "Failed to delete CV.";
        setErrorMessage(err);
        toast.error(err);
      }
    } catch {
      const err = "Failed to delete CV document.";
      setErrorMessage(err);
      toast.error(err);
    }
  };

  const copyPublicUrl = () => {
    const url = `${window.location.origin}/cv/keshabbhatt.com.np.pdf`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    toast.success("Public CV URL copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const activeCv = cvs.find((c) => c.isActive) || cvs[0];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
            Curriculum Vitae (CV) Management
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Upload, update, and manage the official executive CV. Automatically retains the latest 2 versions with Vercel cloud storage persistence.
          </p>
        </div>

        <AdminButton
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fetchCvs()}
          icon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />}
        >
          Refresh
        </AdminButton>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Live Active CV Banner */}
      <AdminCard className="p-6 border-[var(--border-card)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent-gold-soft)] border border-[var(--accent-gold-border)] flex items-center justify-center text-[var(--accent-gold)] shrink-0 shadow-2xs">
              <FileText className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-[var(--text-main)]">
                  Current Public Downloadable CV
                </span>
                <AdminBadge variant="success">Active (Live)</AdminBadge>
              </div>

              <h2 className="text-base font-bold text-[var(--text-main)] tracking-tight">
                {activeCv ? activeCv.filename : "keshabbhatt.com.np.pdf (Default)"}
              </h2>

              <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] flex-wrap">
                {activeCv && (
                  <>
                    <span>Size: {formatFileSize(activeCv.size)}</span>
                    <span>•</span>
                    <span>Updated: {new Date(activeCv.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Uploaded by: {activeCv.uploadedBy || "Admin"}</span>
                  </>
                )}
                {!activeCv && (
                  <span>Using default static executive portfolio curriculum vitae.</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
            <AdminButton
              type="button"
              variant="outline"
              size="sm"
              onClick={copyPublicUrl}
              icon={copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copiedLink ? "Link Copied" : "Copy Public URL"}
            </AdminButton>

            <AdminButton
              type="button"
              variant="primary"
              size="sm"
              onClick={() => window.open("/api/cv/download", "_blank")}
              icon={<ExternalLink className="w-3.5 h-3.5" />}
            >
              Preview Live CV
            </AdminButton>
          </div>
        </div>
      </AdminCard>

      {/* Two-Column Grid: Upload New CV + Storage History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Upload Box */}
        <div className="lg:col-span-5">
          <AdminCard className="p-6 border-[var(--border-card)] space-y-5 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-[var(--accent-gold)]" />
                <h3 className="text-sm font-bold text-[var(--text-main)]">
                  Upload & Activate New CV
                </h3>
              </div>

              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Upload a newly updated PDF resume. The system will sanitize the file name, store the file persistently in the database, and automatically activate it for public downloads.
              </p>

              <form onSubmit={handleUpload} className="space-y-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                    selectedFile
                      ? "border-[var(--accent-gold)] bg-[var(--accent-gold-soft)]/20"
                      : "border-[var(--border-card)] hover:border-[var(--accent-gold)] bg-[var(--bg-card-inner)]/50"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <FileText className="w-8 h-8 text-[var(--accent-gold)] mx-auto mb-2 opacity-80" />
                  
                  {selectedFile ? (
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-[var(--text-main)] truncate max-w-xs mx-auto">
                        {selectedFile.name}
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {formatFileSize(selectedFile.size)} • Ready to upload
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-[var(--text-main)]">
                        Click or drag PDF file here
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Supports PDF up to 15MB
                      </p>
                    </div>
                  )}
                </div>

                <AdminButton
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={isUploading}
                  disabled={!selectedFile || isUploading}
                  icon={<Upload className="w-4 h-4" />}
                >
                  {isUploading ? "Uploading & Activating..." : "Upload & Activate CV"}
                </AdminButton>
              </form>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] space-y-1.5 text-[11px] text-[var(--text-muted)]">
              <div className="flex items-center gap-1.5 font-bold text-[var(--text-main)]">
                <Shield className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                <span>Hosting Rotation Policy</span>
              </div>
              <p>
                To conserve storage and guarantee high performance on Vercel, the system maintains <strong>only the last 2 CV versions</strong>. When a 3rd is uploaded, the oldest archive is permanently deleted.
              </p>
            </div>
          </AdminCard>
        </div>

        {/* Stored CVs (Max 2) */}
        <div className="lg:col-span-7">
          <AdminCard className="p-6 border-[var(--border-card)] space-y-5 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-[var(--accent-gold)]" />
                  <h3 className="text-sm font-bold text-[var(--text-main)]">
                    Stored CV Versions ({cvs.length}/2)
                  </h3>
                </div>
                <span className="text-[11px] text-[var(--text-muted)]">
                  Maximum 2 versions retained
                </span>
              </div>

              {isLoading ? (
                <div className="p-8 text-center text-xs text-[var(--text-muted)]">
                  Loading CV documents...
                </div>
              ) : cvs.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] space-y-2">
                  <FileText className="w-8 h-8 text-[var(--text-muted)] mx-auto opacity-40" />
                  <p className="text-xs font-semibold text-[var(--text-main)]">
                    No custom CVs uploaded yet
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] max-w-sm mx-auto">
                    The public site is currently serving the default executive portfolio PDF from the filesystem. Upload your updated CV to take control.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cvs.map((cv) => (
                    <div
                      key={cv.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        cv.isActive
                          ? "bg-[var(--accent-gold-soft)]/20 border-[var(--accent-gold-border)]"
                          : "bg-[var(--bg-card-inner)] border-[var(--border-subtle)]"
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] shrink-0 text-[var(--accent-gold)]">
                          <FileText className="w-4 h-4" />
                        </div>

                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-[var(--text-main)] truncate max-w-[220px]">
                              {cv.filename}
                            </span>
                            {cv.isActive ? (
                              <AdminBadge variant="success">Active</AdminBadge>
                            ) : (
                              <AdminBadge variant="default">Archive</AdminBadge>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] flex-wrap">
                            <span>{formatFileSize(cv.size)}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(cv.createdAt).toLocaleDateString()}
                            </span>
                            <span>•</span>
                            <span>By {cv.uploadedBy || "Admin"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                        {!cv.isActive && (
                          <AdminButton
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetActive(cv.id)}
                          >
                            Set as Active
                          </AdminButton>
                        )}

                        <AdminButton
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(cv.downloadUrl, "_blank")}
                          title="Preview PDF"
                          icon={<ExternalLink className="w-3.5 h-3.5" />}
                        />

                        {!cv.isActive && (
                          <AdminButton
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                            onClick={() => handleDelete(cv.id, cv.filename)}
                            title="Delete Archived CV"
                            icon={<Trash2 className="w-3.5 h-3.5" />}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="text-[11px] text-[var(--text-muted)] border-t border-[var(--border-subtle)] pt-3">
              Visitor download URL: <code className="font-mono text-[var(--text-main)]">/cv/keshabbhatt.com.np.pdf</code>
            </div>
          </AdminCard>
        </div>

      </div>
    </div>
  );
};

export default CvManager;
