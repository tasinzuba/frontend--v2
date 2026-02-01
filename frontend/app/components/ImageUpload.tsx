"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2, Trash2 } from "lucide-react";

interface ImageUploadProps {
    value?: string | string[];
    onChange: (url: string | string[]) => void;
    multiple?: boolean;
    maxFiles?: number;
    disabled?: boolean;
}

export default function ImageUpload({
    value,
    onChange,
    multiple = false,
    maxFiles = 5,
    disabled = false
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

    const urls = Array.isArray(value) ? value : (value ? [value] : []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (multiple && urls.length + files.length > maxFiles) {
            alert(`You can only upload a maximum of ${maxFiles} images.`);
            return;
        }

        setIsUploading(true);
        const formData = new FormData();

        if (multiple) {
            Array.from(files).forEach(file => {
                formData.append("images", file);
            });
        } else {
            formData.append("image", files[0]);
        }

        try {
            const endpoint = multiple ? "/api/upload/multiple" : "/api/upload/single";
            const res = await fetch(`${backendUrl}${endpoint}`, {
                method: "POST",
                body: formData,
                credentials: "include" // Important for auth
            });

            const data = await res.json();

            if (data.success) {
                if (multiple) {
                    const newUrls = (data.data as any[]).map(file => file.url);
                    onChange([...urls, ...newUrls]);
                } else {
                    onChange(data.data.url);
                }
            } else {
                alert(data.error || "Upload failed");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Something went wrong during upload");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const removeImage = (urlToRemove: string) => {
        if (multiple) {
            onChange(urls.filter(url => url !== urlToRemove));
        } else {
            onChange("");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
                {urls.map((url, index) => (
                    <div key={index} className="relative w-32 h-32 rounded-xl overflow-hidden border border-slate-200 group">
                        <img src={url} alt="Uploaded" className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={() => removeImage(url)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {(multiple ? urls.length < maxFiles : urls.length === 0) && (
                <div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                        multiple={multiple}
                        disabled={disabled || isUploading}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={disabled || isUploading}
                        className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-slate-300 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isUploading ? (
                            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                        ) : (
                            <>
                                <Upload className="w-6 h-6 text-slate-400 mb-2" />
                                <span className="text-xs text-slate-500 font-medium">Upload</span>
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
