import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertTriangle, Loader2, Eye, ShieldAlert, Sparkles } from 'lucide-react';
import { uploadAttachment, analyzeMultimodal } from '../../services/analysisApi';
import { MultimodalAnalysisResult } from '../../types/analysis';
import { RiskBadge } from '../common/RiskBadge';

export const AttachmentUploader: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ id: string; name: string; url: string } | null>(null);
  const [analysisResult, setAnalysisResult] = useState<MultimodalAnalysisResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds maximum allowed limit of 10MB.');
      return;
    }

    setUploadError(null);
    setIsUploading(true);
    setAnalysisResult(null);

    try {
      const res = await uploadAttachment(file);
      setUploadedFile({
        id: res.attachment_id,
        name: res.name || file.name,
        url: res.url,
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to upload attachment.';
      setUploadError(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRunMultimodalAnalysis = async () => {
    if (!uploadedFile) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeMultimodal(uploadedFile.id);
      setAnalysisResult(result);
    } catch (err) {
      setUploadError('Failed to complete multimodal vision analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl p-5 space-y-4 shadow-card">
      <div className="flex items-center justify-between pb-3 border-b border-surface-border">
        <div>
          <h2 className="text-xs font-semibold text-white font-sans">
            Multimodal Attachment OCR & Vision Forensics
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Upload customer screenshots or invoices for automated OCR and brand mimicry detection.</p>
        </div>
        <span className="text-[10px] font-mono text-brand-cyan px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 font-bold">
          VISION ENGINE
        </span>
      </div>

      {/* Upload Zone */}
      {!uploadedFile ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border border-dashed border-slate-700 hover:border-brand-cyan/60 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-surface-elevated/40 hover:bg-surface-elevated/70 group"
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*,application/pdf"
            onChange={handleFileSelect}
          />
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-surface-card border border-surface-border text-slate-400 group-hover:text-brand-cyan group-hover:scale-110 flex items-center justify-center transition-all shadow-sm">
              {isUploading ? <Loader2 size={18} className="animate-spin text-brand-cyan" /> : <Upload size={18} />}
            </div>
            <p className="text-xs font-medium text-slate-200 font-sans">
              {isUploading ? 'Uploading attachment...' : 'Upload screenshot or invoice PDF'}
            </p>
            <p className="text-[11px] text-slate-500 font-mono">PNG, JPG, or PDF up to 10MB</p>
          </div>
        </div>
      ) : (
        /* Staged File Item */
        <div className="bg-surface-elevated/80 border border-surface-border rounded-xl p-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-surface-card border border-surface-border text-slate-300">
              <FileText size={18} />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-200 truncate max-w-xs">{uploadedFile.name}</div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono font-medium">
                <CheckCircle size={11} /> Staged for analysis
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunMultimodalAnalysis}
              disabled={isAnalyzing}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-brand-cyan to-blue-600 text-slate-950 text-xs font-mono font-bold uppercase tracking-wider disabled:opacity-50 transition-all shadow-glow-cyan/25"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  Running OCR...
                </>
              ) : (
                <>
                  <Eye size={13} />
                  Run Vision OCR
                </>
              )}
            </button>
            <button
              onClick={() => {
                setUploadedFile(null);
                setAnalysisResult(null);
              }}
              className="text-xs text-slate-500 hover:text-slate-300 px-2 py-1 transition-colors font-mono"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {uploadError && (
        <div className="flex items-center gap-2 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/30 p-2.5 rounded-xl">
          <AlertTriangle size={14} className="text-rose-400" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Multimodal Analysis Output */}
      {analysisResult && (
        <div className="p-4 rounded-xl bg-surface-elevated/70 border border-surface-border space-y-3 shadow-card animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-surface-border">
            <div className="flex items-center gap-2">
              <ShieldAlert size={16} className="text-rose-400" />
              <span className="text-xs font-semibold text-slate-100">Vision Analysis Diagnostics</span>
            </div>
            {analysisResult.phishing_likelihood && (
              <RiskBadge level={analysisResult.phishing_likelihood} size="sm" />
            )}
          </div>

          {analysisResult.ocr_summary && (
            <div className="text-xs space-y-1">
              <span className="text-slate-500 text-[10px] font-mono uppercase block">OCR Text Extraction:</span>
              <p className="bg-surface-card p-3 rounded-xl border border-surface-border font-mono text-[11px] text-slate-300 leading-relaxed">
                {analysisResult.ocr_summary}
              </p>
            </div>
          )}

          {analysisResult.visual_threat_indicators && (
            <div className="text-xs space-y-1">
              <span className="text-slate-500 text-[10px] font-mono uppercase block">Visual Threat Indicators:</span>
              <ul className="space-y-1">
                {analysisResult.visual_threat_indicators.map((ind, i) => (
                  <li key={i} className="flex items-start gap-2 text-rose-300 text-xs">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{ind}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysisResult.detected_urls && analysisResult.detected_urls.length > 0 && (
            <div className="text-xs space-y-1">
              <span className="text-slate-500 text-[10px] font-mono uppercase block">Extracted URLs:</span>
              <div className="flex flex-wrap gap-2">
                {analysisResult.detected_urls.map((u, i) => (
                  <span key={i} className="px-2.5 py-0.5 rounded-lg bg-surface-card border border-surface-border text-brand-cyan font-mono text-[11px]">
                    {u}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
