"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  ShieldAlert,
  FileText,
  Image as ImageIcon,
  UploadCloud,
  X,
  Link as LinkIcon,
  Globe,
  Loader2,
  CircleAlert,
} from "lucide-react";
import { ResultCard, AnalysisResult } from "./result-card";
import { TerminalLoader } from "./terminal-loader";
import { useHistory } from "@/hooks/use-history";
import { motion, AnimatePresence } from "framer-motion";

type TabAction = "text" | "url" | "image";

interface UrlPreview {
  title: string;
  description: string;
  image: string;
  siteName: string;
  hostname: string;
  favicon: string;
  url: string;
  fetchFailed?: boolean;
}

export function VerificationEngine() {
  const [activeTab, setActiveTab] = useState<TabAction>("text");
  const [input, setInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [urlPreview, setUrlPreview] = useState<UrlPreview | null>(null);
  const [urlPreviewLoading, setUrlPreviewLoading] = useState(false);
  const [urlPreviewError, setUrlPreviewError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [clickRing, setClickRing] = useState(false);

  const { addHistoryItem } = useHistory();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file.");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleFetchPreview = async () => {
    if (!urlInput.trim()) return;
    setUrlPreviewLoading(true);
    setUrlPreviewError("");
    setUrlPreview(null);
    try {
      const res = await fetch("/api/url-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput.trim() }),
      });
      const data = await res.json();
      if (data.error) {
        setUrlPreviewError(data.error);
      } else {
        setUrlPreview(data);
      }
    } catch {
      setUrlPreviewError("Could not fetch URL preview.");
    } finally {
      setUrlPreviewLoading(false);
    }
  };

  const isVerifyDisabled =
    loading ||
    (activeTab === "text" && !input.trim()) ||
    (activeTab === "url" && !urlInput.trim()) ||
    (activeTab === "image" && !imagePreview);

  const handleAnalyze = async () => {
    if (isVerifyDisabled) return;

    // Micro-animation on click
    setClickRing(true);
    setTimeout(() => setClickRing(false), 600);

    setLoading(true);
    setResult(null);

    try {
      let endpoint = "/api/analyze";
      let payload: Record<string, unknown> = {};
      let historyPreview = "";

      if (activeTab === "text") {
        payload = { message: input };
        historyPreview = input;
      } else if (activeTab === "url") {
        payload = { message: `Please analyze this URL for misinformation: ${urlInput.trim()}` };
        historyPreview = urlInput.trim();
      } else {
        endpoint = "/api/image-analyze";
        const mimeType = imageFile?.type || "image/jpeg";
        const base64Data = imagePreview?.split(",")[1];
        payload = { imageBase64: base64Data, mimeType };
        historyPreview = "Image analysis";
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data && data.trustScore !== undefined) {
        setResult(data);
        addHistoryItem(
          activeTab === "image" ? "image" : "text",
          historyPreview,
          data
        );
      }
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const tabs: { id: TabAction; label: string; icon: React.ReactNode }[] = [
    { id: "text", label: "Text / SMS", icon: <FileText className="w-4 h-4" /> },
    { id: "url", label: "URL / Link", icon: <LinkIcon className="w-4 h-4" /> },
    { id: "image", label: "Image", icon: <ImageIcon className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center">

      {/* Tab Selector */}
      <div className="flex space-x-1 mb-6 bg-white/5 p-1 rounded-lg border border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setResult(null); }}
            className={`flex items-center space-x-2 px-5 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-white/10 text-truth shadow-sm"
                : "hover:text-foreground/80 text-foreground/50"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="w-full relative group">
        {/* Animated Glow Backdrop */}
        <div className="absolute -inset-1 bg-gradient-to-r from-truth via-suspicious to-truth rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />

        <div className="relative bg-background rounded-xl border border-white/10 p-2 shadow-2xl overflow-hidden backdrop-blur-sm bg-black/40">

          <AnimatePresence mode="wait">

            {/* TEXT TAB */}
            {activeTab === "text" && (
              <motion.div
                key="text-tab"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <Textarea
                  placeholder="Paste suspicious WhatsApp message, SMS, social media post, or news headline here..."
                  className="min-h-[160px] resize-none border-0 bg-transparent text-lg focus-visible:ring-0 focus-visible:ring-offset-0 px-4 py-3 placeholder:text-foreground/30 text-foreground/90"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </motion.div>
            )}

            {/* URL TAB */}
            {activeTab === "url" && (
              <motion.div
                key="url-tab"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="p-3 space-y-3"
              >
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 pointer-events-none" />
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => { setUrlInput(e.target.value); setUrlPreview(null); setUrlPreviewError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && handleFetchPreview()}
                      placeholder="https://example.com/suspicious-article"
                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-truth/40 text-foreground/90 placeholder:text-foreground/30 transition-colors"
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleFetchPreview}
                    disabled={!urlInput.trim() || urlPreviewLoading}
                    className="border-white/10 bg-white/5 hover:bg-white/10 text-foreground/60 hover:text-foreground shrink-0 px-4"
                  >
                    {urlPreviewLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Preview"}
                  </Button>
                </div>

                {/* URL Preview Card */}
                <AnimatePresence>
                  {urlPreview && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex gap-3 bg-black/40 border border-white/10 rounded-xl p-3 overflow-hidden"
                    >
                      {/* Favicon */}
                      <div className="shrink-0 w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={urlPreview.favicon}
                          alt={urlPreview.hostname}
                          className="w-6 h-6 object-contain"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground/40 font-semibold mb-0.5">{urlPreview.hostname}</p>
                        <p className="text-sm font-semibold text-foreground/90 line-clamp-1">{urlPreview.title}</p>
                        {urlPreview.description && (
                          <p className="text-xs text-foreground/50 line-clamp-2 mt-0.5">{urlPreview.description}</p>
                        )}
                        {urlPreview.fetchFailed && (
                          <p className="text-xs text-suspicious/70 mt-1 flex items-center gap-1">
                            <CircleAlert className="w-3 h-3" /> Could not load page preview — will still analyze the URL.
                          </p>
                        )}
                      </div>
                      {urlPreview.image && (
                        <div className="shrink-0 w-20 h-16 rounded-lg overflow-hidden border border-white/10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={urlPreview.image} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        </div>
                      )}
                    </motion.div>
                  )}
                  {urlPreviewError && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-destructive/80 flex items-center gap-1.5 px-1"
                    >
                      <CircleAlert className="w-3.5 h-3.5" /> {urlPreviewError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* IMAGE TAB */}
            {activeTab === "image" && (
              <motion.div
                key="image-tab"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="min-h-[160px] flex flex-col items-center justify-center p-4"
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
                {imagePreview ? (
                  <div className="relative w-full flex justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Upload preview"
                      className="max-h-64 object-contain rounded-lg border border-white/10 shadow-lg"
                    />
                    <button
                      onClick={clearImage}
                      className="absolute top-2 right-2 bg-black/60 hover:bg-black p-1.5 rounded-full backdrop-blur-md text-white transition-colors border border-white/20"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`w-full h-40 border-2 border-dashed transition-all rounded-lg flex flex-col items-center justify-center cursor-pointer group/drop ${
                      isDragging
                        ? "border-truth bg-truth/10 scale-[1.02]"
                        : "border-white/20 hover:border-truth/50 hover:bg-truth/5"
                    }`}
                  >
                    <UploadCloud
                      className={`w-10 h-10 mb-4 transition-colors ${
                        isDragging ? "text-truth" : "text-foreground/30 group-hover/drop:text-truth"
                      }`}
                    />
                    <p className="text-foreground/70 font-medium">
                      {isDragging ? "Drop to upload" : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-foreground/40 mt-1">Supports PNG, JPG, WebP</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Bar */}
          <div className="flex justify-between items-center px-2 py-3 border-t border-white/5 mt-2 bg-black/20">
            <div className="flex items-center text-xs text-foreground/40 space-x-2 px-2">
              <ShieldAlert className="h-4 w-4" />
              <span>End-to-end encrypted. No data saved.</span>
            </div>
            <div className="relative">
              {/* Shockwave ring */}
              <AnimatePresence>
                {clickRing && (
                  <motion.div
                    key="ring"
                    className="absolute inset-0 rounded-lg border-2 border-truth pointer-events-none"
                    initial={{ opacity: 0.8, scale: 1 }}
                    animate={{ opacity: 0, scale: 1.6 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                )}
              </AnimatePresence>
              <Button
                onClick={handleAnalyze}
                disabled={isVerifyDisabled}
                className="bg-truth hover:bg-truth/80 text-black font-bold tracking-wide rounded-lg px-8 shadow-[0_0_15px_rgba(20,184,166,0.5)] transition-shadow hover:shadow-[0_0_25px_rgba(20,184,166,0.6)]"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4" />
                    <span>Verify Now</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {loading && <TerminalLoader />}
      {result && !loading && <ResultCard result={result} />}
    </div>
  );
}
