"use client";

import { useState, useEffect } from "react";
import { AnalysisResult } from "@/components/result-card";

export interface HistoryItem {
  id: string;
  timestamp: number;
  queryType: "text" | "image";
  queryPreview: string;
  result: AnalysisResult;
}

const STORAGE_KEY = "satyacheck_history_v1";

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse history", e);
    }
  }, []);

  const addHistoryItem = (queryType: "text" | "image", queryPreview: string, result: AnalysisResult) => {
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
      queryType,
      queryPreview,
      result
    };
    
    setHistory(prev => {
      const newHistory = [newItem, ...prev].slice(0, 10); // Keep last 10
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { history, addHistoryItem, clearHistory };
}
