"use client";

import { useState } from "react";

import {
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
  Check,
  Menu,
  Settings,
  CircleHelp,
  User,
  MessageSquare,
} from "lucide-react";

import type { Conversation } from "@/app/lib/types/chat";

type SidebarProps = {
  conversations: Conversation[];

  activeConversationId: string | null;

  onNewChat: () => void;

  onSelectChat: (id: string) => void;

  onConversationDeleted?: (id: string) => void;

  onConversationRenamed?: (id: string, title: string) => void;
};

export default function Sidebar({
  conversations,
  activeConversationId,
  onNewChat,
  onSelectChat,
  onConversationDeleted,
  onConversationRenamed,
}: SidebarProps) {
  /*
   * =====================================
   * STATES
   * =====================================
   */

  const [collapsed, setCollapsed] = useState(false);

  const [search, setSearch] = useState("");

  const [menuId, setMenuId] = useState<string | null>(null);

  const [renameId, setRenameId] = useState<string | null>(null);

  const [renameTitle, setRenameTitle] = useState("");

  const [actionLoading, setActionLoading] = useState(false);

  /*
   * =====================================
   * FILTER CHAT
   * =====================================
   */

  const filteredConversations = conversations.filter((conversation) =>
    conversation.title.toLowerCase().includes(search.toLowerCase()),
  );

  /*
   * =====================================
   * RENAME START
   * =====================================
   */

  const startRename = (conversation: Conversation) => {
    setRenameId(conversation.id);

    setRenameTitle(conversation.title);

    setMenuId(null);
  };

  /*
   * =====================================
   * RENAME CHAT
   * =====================================
   */

  const handleRename = async () => {
    if (!renameId || !renameTitle.trim() || actionLoading) {
      return;
    }

    try {
      setActionLoading(true);

      const response = await fetch(`/api/conversations/${renameId}`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title: renameTitle.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to rename chat");
      }

      onConversationRenamed?.(renameId, data.title);

      setRenameId(null);
      setRenameTitle("");
    } catch (error) {
      console.error("RENAME ERROR:", error);

      alert(error instanceof Error ? error.message : "Failed to rename chat");
    } finally {
      setActionLoading(false);
    }
  };

  /*
   * =====================================
   * DELETE CHAT
   * =====================================
   */

  const handleDelete = async (id: string) => {
    if (actionLoading) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this chat?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);

      const response = await fetch(`/api/conversations/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete chat");
      }

      onConversationDeleted?.(id);

      setMenuId(null);
    } catch (error) {
      console.error("DELETE ERROR:", error);

      alert(error instanceof Error ? error.message : "Failed to delete chat");
    } finally {
      setActionLoading(false);
    }
  };

  /*
   * =====================================
   * COLLAPSED SIDEBAR
   * =====================================
   */

  if (collapsed) {
    return (
      <aside className="flex h-full w-[72px] shrink-0 flex-col border-r border-zinc-200 bg-white">
        {/* Logo / Open */}

        <div className="flex h-[73px] items-center justify-center border-b border-zinc-200">
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            title="Open sidebar"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-black transition hover:bg-zinc-100"
          >
            <Menu size={22} />
          </button>
        </div>

        {/* New + Search */}

        <div className="flex flex-col items-center gap-2 p-3">
          {/* New Chat */}

          <button
            type="button"
            onClick={onNewChat}
            title="New Chat"
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-white transition hover:bg-zinc-800"
          >
            <Plus size={20} />
          </button>

          {/* Search */}

          <button
            type="button"
            title="Search"
            onClick={() => setCollapsed(false)}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-black transition hover:bg-zinc-100"
          >
            <Search size={20} />
          </button>
        </div>

        {/* Mini Chat List */}

        <div className="flex-1 overflow-y-auto px-3">
          <div className="space-y-2">
            {conversations.slice(0, 8).map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                title={conversation.title}
                onClick={() => onSelectChat(conversation.id)}
                className={`flex h-11 w-full items-center justify-center rounded-xl transition ${
                  conversation.id === activeConversationId
                    ? "bg-zinc-100 text-black"
                    : "text-black hover:bg-zinc-50"
                }`}
              >
                <MessageSquare size={18} />
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Options */}

        <div className="border-t border-zinc-200 p-3">
          {/* Settings */}

          <button
            type="button"
            title="Settings"
            className="mb-1 flex h-11 w-full items-center justify-center rounded-xl text-black transition hover:bg-zinc-100"
          >
            <Settings size={19} />
          </button>

          {/* Help */}

          <button
            type="button"
            title="Help & Support"
            className="mb-1 flex h-11 w-full items-center justify-center rounded-xl text-black transition hover:bg-zinc-100"
          >
            <CircleHelp size={19} />
          </button>

          {/* Profile */}

          <button
            type="button"
            title="Profile"
            className="flex h-11 w-full items-center justify-center rounded-xl text-black transition hover:bg-zinc-100"
          >
            <User size={19} />
          </button>
        </div>
      </aside>
    );
  }

  /*
   * =====================================
   * FULL SIDEBAR
   * =====================================
   */

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-zinc-200 bg-white">
      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div className="flex h-[73px] items-center justify-between border-b border-zinc-200 px-4">
        {/* Logo */}

        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-sm font-bold text-white">
            A
          </div>

          <div>
            <h2 className="text-base font-bold text-black">Amit AI</h2>

            <p className="text-[11px] text-black">Personal Assistant</p>
          </div>
        </div>

        {/* Collapse */}

        <button
          type="button"
          onClick={() => setCollapsed(true)}
          title="Collapse sidebar"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-black transition hover:bg-zinc-100"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* ================================= */}
      {/* NEW CHAT + SEARCH */}
      {/* ================================= */}

      <div className="border-b border-zinc-200 p-3">
        {/* New Chat */}

        <button
          type="button"
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          <Plus size={18} />
          New Chat
        </button>

        {/* Search */}

        <div className="relative mt-3">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-black"
          />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search chats..."
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pl-9 pr-3 text-sm text-black outline-none placeholder:text-black focus:border-zinc-500"
          />
        </div>
      </div>

      {/* ================================= */}
      {/* CHAT LIST */}
      {/* ================================= */}

      <div className="flex-1 overflow-y-auto p-3">
        <p className="mb-2 px-2 text-xl font-bold uppercase tracking-wider text-blue-600">
          Recent
        </p>

        {filteredConversations.length === 0 ? (
          <div className="px-3 py-10 text-center">
            <MessageSquare size={25} className="mx-auto mb-2 text-black" />

            <p className="text-sm text-black">
              {search ? "No chats found" : "No conversations yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredConversations.map((conversation) => {
              const isActive = conversation.id === activeConversationId;

              const isRenaming = renameId === conversation.id;

              return (
                <div
                  key={conversation.id}
                  className={`group relative rounded-xl transition ${
                    isActive ? "bg-zinc-100" : "hover:bg-zinc-50"
                  }`}
                >
                  {/* ======================== */}
                  {/* RENAME INPUT */}
                  {/* ======================== */}

                  {isRenaming ? (
                    <div className="flex items-center gap-1 p-2">
                      <input
                        autoFocus
                        value={renameTitle}
                        onChange={(event) => setRenameTitle(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            handleRename();
                          }

                          if (event.key === "Escape") {
                            setRenameId(null);

                            setRenameTitle("");
                          }
                        }}
                        className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-sm text-black outline-none focus:border-black"
                      />

                      {/* Save */}
                      <button
                        type="button"
                        onClick={handleRename}
                        disabled={actionLoading}
                        title="Save"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-green-600 transition hover:bg-green-50 disabled:opacity-50"
                      >
                        <Check size={17} />
                      </button>

                      {/* Cancel */}
                      <button
                        type="button"
                        onClick={() => {
                          setRenameId(null);
                          setRenameTitle("");
                        }}
                        title="Cancel"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-50"
                      >
                        <X size={17} />
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* ====================== */}
                      {/* CHAT BUTTON */}
                      {/* ====================== */}

                      <button
                        type="button"
                        onClick={() => onSelectChat(conversation.id)}
                        className="w-full px-3 py-3 pr-10 text-left"
                      >
                        <p className="truncate text-sm font-medium text-black">
                          {conversation.title || "New Chat"}
                        </p>

                        <p className="mt-1 text-xs text-black">
                          {conversation.messages.length} messages
                        </p>
                      </button>

                      {/* ====================== */}
                      {/* MORE BUTTON */}
                      {/* ====================== */}

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();

                          setMenuId(
                            menuId === conversation.id ? null : conversation.id,
                          );
                        }}
                        title="Chat options"
                        className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-black opacity-0 transition hover:bg-zinc-200 group-hover:opacity-100"
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {/* ====================== */}
                      {/* MENU */}
                      {/* ====================== */}

                      {menuId === conversation.id && (
                        <div
                          onClick={(event) => event.stopPropagation()}
                          className="absolute right-2 top-12 z-50 w-36 overflow-hidden rounded-xl border border-zinc-200 bg-white p-1 shadow-xl"
                        >
                          {/* Rename */}

                          <button
                            type="button"
                            onClick={() => startRename(conversation)}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-black transition hover:bg-zinc-100"
                          >
                            <Pencil size={15} />
                            Rename
                          </button>

                          {/* Delete */}

                          <button
                            type="button"
                            onClick={() => handleDelete(conversation.id)}
                            disabled={actionLoading}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-zinc-100 disabled:opacity-50"
                          >
                            <Trash2 size={15} />
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================================= */}
      {/* BOTTOM OPTIONS */}
      {/* ================================= */}

      <div className="border-t border-zinc-200 p-3">
        {/* Settings */}

        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-black transition hover:bg-zinc-100"
        >
          <Settings size={18} />

          <span>Settings</span>
        </button>

        {/* Help */}

        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-black transition hover:bg-zinc-100"
        >
          <CircleHelp size={18} />

          <span>Help & Support</span>
        </button>

        {/* Profile */}

        <button
          type="button"
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-black transition hover:bg-zinc-100"
        >
          <User size={18} />

          <span>Profile</span>
        </button>
      </div>
    </aside>
  );
}
