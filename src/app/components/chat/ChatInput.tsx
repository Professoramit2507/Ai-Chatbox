"use client";

import {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";

import {
  Paperclip,
  Send,
  X,
  FileText,
} from "lucide-react";

type ChatInputProps = {
  onSend: (
    message: string,
    file?: File | null
  ) => void;

  loading: boolean;
};

export default function ChatInput({
  onSend,
  loading,
}: ChatInputProps) {
  const [message, setMessage] =
    useState("");

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [previewUrl, setPreviewUrl] =
    useState<string | null>(null);

  const fileInputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "application/pdf",
    "text/plain",
    "text/csv",
  ];

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      alert(
        "Supported files: JPG, PNG, WEBP, GIF, PDF, TXT and CSV."
      );

      event.target.value = "";

      return;
    }

    const maxSize =
      10 * 1024 * 1024;

    if (file.size > maxSize) {
      alert(
        "File size must be less than 10MB."
      );

      event.target.value = "";

      return;
    }

    setSelectedFile(file);

    if (file.type.startsWith("image/")) {
      const url =
        URL.createObjectURL(file);

      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const removeFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSend = () => {
    const trimmedMessage =
      message.trim();

    /*
     * Message OR file must exist
     */

    if (
      (!trimmedMessage &&
        !selectedFile) ||
      loading
    ) {
      return;
    }

    onSend(
      trimmedMessage,
      selectedFile
    );

    setMessage("");

    /*
     * Clear file after sending
     */

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      handleSend();
    }
  };

  const formatFileSize = (
    bytes: number
  ) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(
        bytes / 1024
      ).toFixed(1)} KB`;
    }

    return `${(
      bytes /
      (1024 * 1024)
    ).toFixed(1)} MB`;
  };

  return (
    <div className="border-t bg-white p-4">
      <div className="mx-auto w-full max-w-4xl">

        {/* File Preview */}

        {selectedFile && (
          <div className="mb-3 flex items-center gap-3">
            <div className="relative overflow-hidden rounded-xl border bg-zinc-50">

              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt={selectedFile.name}
                  width={80}
                  height={80}
                  className="h-20 w-20 object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-20 w-20 flex-col items-center justify-center">
                  <FileText
                    size={28}
                    className="text-zinc-500"
                  />

                  <span className="mt-1 text-[10px] text-zinc-500">
                    FILE
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={removeFile}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
              >
                <X size={14} />
              </button>
            </div>

            <div className="min-w-0">
              <p className="max-w-[250px] truncate text-sm font-medium">
                {selectedFile.name}
              </p>

              <p className="text-xs text-zinc-500">
                {formatFileSize(
                  selectedFile.size
                )}
              </p>
            </div>
          </div>
        )}

        {/* Input */}

        <div className="flex items-end gap-2 rounded-2xl border bg-zinc-50 p-2">

          <input
            ref={fileInputRef}
            type="file"
            accept="
              image/jpeg,
              image/png,
              image/webp,
              image/gif,
              application/pdf,
              text/plain,
              text/csv
            "
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            disabled={loading}
            onClick={() =>
              fileInputRef.current?.click()
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-black hover:bg-zinc-200 hover:text-zinc-900"
          >
            <Paperclip size={20} />
          </button>

          <textarea
            value={message}
            onChange={(event) =>
              setMessage(
                event.target.value
              )
            }
            onKeyDown={handleKeyDown}
            disabled={loading}
            rows={1}
            placeholder={
              selectedFile
                ? "Ask something about this file..."
                : "Message Amit AI..."
            }
            className="max-h-32 min-h-10 flex-1 text-black resize-none bg-transparent px-2 py-2 text-sm outline-none"
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={
              loading ||
              (!message.trim() &&
                !selectedFile)
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-black hover:bg-zinc-700 disabled:bg-zinc-300"
          >
            <Send size={18} />
          </button>
        </div>

        <p className="mt-2 text-center text-xs text-zinc-400">
          Images, PDF, TXT and CSV up to 10MB
        </p>
      </div>
    </div>
  );
}