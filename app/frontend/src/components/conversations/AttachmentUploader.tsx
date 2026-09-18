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
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-card">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-xs font-semibold text-slate-900">
            Multimodal attachment analysis
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Upload customer screenshots or invoices for automated OCR and brand mimicry detection.</p>
        </div>
        <span className="text-[11px] font-mono text-slate-500">
          Vision OCR
        </span>
      </div>

      {/* Upload Zone */}
      {!uploadedFile ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border border-dashed border-slate-300 hover:border-slate-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 group"
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*,application/pdf"
            onChange={handleFileSelect}
          />
          <div className="flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-slate-600 group-hover:text-slate-900 flex items-center justify-center transition-colors shadow-sm">
              {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
            </div>
            <p className="text-xs font-medium text-slate-800">
              {isUploading ? 'Uploading attachment...' : 'Upload screenshot or PDF'}
            </p>
            <p className="text-[11px] text-slate-400">PNG, JPG, or PDF up to 10MB</p>
          </div>
        </div>
      ) : (
        /* Staged File Item */
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-white border border-slate-200 text-slate-700">
              <FileText size={18} />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-900 truncate max-w-xs">{uploadedFile.name}</div>
              <div className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                <CheckCircle size={11} /> Staged for analysis
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunMultimodalAnalysis}
              disabled={isAnalyzing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold disabled:opacity-50 transition-colors shadow-sm"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  Running OCR...
                </>
              ) : (
                <>
                  <Eye size={13} />
                  Run vision analysis
                </>
              )}
            </button>
            <button
              onClick={() => {
                setUploadedFile(null);
                setAnalysisResult(null);
              }}
              className="text-xs text-slate-500 hover:text-slate-900 px-2 py-1 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {uploadError && (
        <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-lg">
          <AlertTriangle size={14} />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Multimodal Analysis Output */}
      {analysisResult && (
        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 shadow-card animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldAlert size={16} className="text-rose-600" />
              <span className="text-xs font-semibold text-slate-900">Vision analysis results</span>
            </div>
            {analysisResult.phishing_likelihood && (
              <RiskBadge level={analysisResult.phishing_likelihood} size="sm" />
            )}
          </div>

          {analysisResult.ocr_summary && (
            <div className="text-xs space-y-1">
              <span className="text-slate-500 text-[11px] block">OCR text extraction:</span>
              <p className="bg-slate-50 p-2.5 rounded border border-slate-200 font-mono text-[11px] text-slate-800 leading-relaxed">
                {analysisResult.ocr_summary}
              </p>
            </div>
          )}

          {analysisResult.visual_threat_indicators && (
            <div className="text-xs space-y-1">
              <span className="text-slate-500 text-[11px] block">Visual threat indicators:</span>
              <ul className="space-y-1">
                {analysisResult.visual_threat_indicators.map((ind, i) => (
                  <li key={i} className="flex items-start gap-2 text-rose-700 text-xs">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>{ind}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysisResult.detected_urls && analysisResult.detected_urls.length > 0 && (
            <div className="text-xs space-y-1">
              <span className="text-slate-500 text-[11px] block">Extracted URLs:</span>
              <div className="flex flex-wrap gap-2">
                {analysisResult.detected_urls.map((u, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-800 font-mono text-[11px]">
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
