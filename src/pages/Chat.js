import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AdminModal from "./AdminModal";
import { useTheme } from "../context/ThemeContext";
import {
  getConversations,
  createConversation,
  deleteConversation,
  updateConversation,
  getMessages,
  sendAIMessage,
  regenerateAIMessage,
  uploadFile,
  changePassword,
} from "../services/api";

function Chat() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";
  const navigate = useNavigate();

  const [showAdminModal, setShowAdminModal] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [regenerating, setRegenerating] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);

  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [user, setUser] = useState(null);

  const [passwordLoading, setPasswordLoading] = useState(false);

  const [passwordError, setPasswordError] = useState("");

  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false);

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const [settingsOpen, setSettingsOpen] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [confirmAction, setConfirmAction] = useState(null);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const [showFileMenu, setShowFileMenu] = useState(false);
  const [chatActionMenuId, setChatActionMenuId] = useState(null);
  const [fileAccept, setFileAccept] = useState("*/*");

  const [renameConversationId, setRenameConversationId] = useState(null);
  const [renameTitle, setRenameTitle] = useState("");
  const [renameLoading, setRenameLoading] = useState(false);

  const handleRenameConversation = async () => {
    if (!renameConversationId || !renameTitle.trim() || renameLoading) {
      return;
    }

    try {
      setRenameLoading(true);
      setError("");

      const data = await updateConversation(
        renameConversationId,
        renameTitle.trim(),
      );

      const updatedConversation = data.conversation;

      setConversations((previous) =>
        previous.map((conversation) =>
          conversation._id === renameConversationId
            ? updatedConversation
            : conversation,
        ),
      );

      if (selectedConversation?._id === renameConversationId) {
        setSelectedConversation(updatedConversation);
      }

      setRenameConversationId(null);
      setRenameTitle("");
    } catch (error) {
      setError(error.message);
    } finally {
      setRenameLoading(false);
    }
  };

  useEffect(() => {
    const handleChatActionOutsideClick = (event) => {
      if (!event.target.closest("[data-chat-actions]")) {
        setChatActionMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleChatActionOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleChatActionOutsideClick);
    };
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.log("Unable to read user information");
      }
    }
  }, []);

  useEffect(() => {
    const handleFileMenuOutsideClick = (event) => {
      if (!event.target.closest("[data-file-menu]")) {
        setShowFileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleFileMenuOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleFileMenuOutsideClick);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest("[data-profile-menu]")) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setError("");

      const data = await getConversations();

      setConversations(data.conversations || []);
    } catch (error) {
      setError(error.message);
    }
  };

  const resizeTextarea = (element) => {
    if (!element) {
      return;
    }

    element.style.height = "auto";

    const newHeight = Math.min(element.scrollHeight, 180);

    element.style.height = `${newHeight}px`;
  };

  const createDisplayTitle = (content) => {
    if (!content) {
      return "New conversation";
    }

    const words = content.trim().split(/\s+/);

    if (words.length <= 5) {
      return words.join(" ");
    }

    return words.slice(0, 5).join(" ") + "...";
  };

  const getConversationTitle = (conversation, index) => {
    if (conversation.title && conversation.title !== "New AI Chat") {
      return createDisplayTitle(conversation.title);
    }

    return `Conversation ${index + 1}`;
  };

  const filteredConversations = conversations.filter((conversation) => {
    const title = conversation.title || "";

    return title.toLowerCase().includes(searchQuery.trim().toLowerCase());
  });

  const handleSelectConversation = async (conversation) => {
    try {
      setError("");

      setSelectedConversation(conversation);

      setMessages([]);

      setSelectedFile(null);

      setMobileSidebar(false);

      const data = await getMessages(conversation._id);

      setMessages(data.messages || []);

      if (
        conversation.title === "New AI Chat" &&
        data.messages &&
        data.messages.length > 0
      ) {
        const firstUserMessage = data.messages.find(
          (message) => message.role === "user",
        );

        if (firstUserMessage) {
          const displayTitle = createDisplayTitle(firstUserMessage.content);

          setSelectedConversation((previous) => ({
            ...previous,
            title: displayTitle,
          }));

          setConversations((previous) =>
            previous.map((item) =>
              item._id === conversation._id
                ? {
                    ...item,
                    title: displayTitle,
                  }
                : item,
            ),
          );
        }
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleNewChat = async () => {
    try {
      setError("");

      const data = await createConversation("New AI Chat");

      const newConversation = data.conversation;

      setConversations((previous) => [newConversation, ...previous]);

      setSelectedConversation(newConversation);

      setMessages([]);

      setSelectedFile(null);

      setInput("");

      setMobileSidebar(false);

      setTimeout(() => {
        textareaRef.current?.focus();

        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      }, 100);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setError("");

      let activeConversation = selectedConversation;

      if (!activeConversation) {
        const conversationData = await createConversation("New AI Chat");

        activeConversation = conversationData.conversation;

        setConversations((previous) => [activeConversation, ...previous]);

        setSelectedConversation(activeConversation);

        setMessages([]);
      }

      setUploadingFile(true);

      const data = await uploadFile(activeConversation._id, file);

      if (!data.success) {
        throw new Error("File upload failed.");
      }

      setSelectedFile({
        file,
        uploaded: true,
        uploadedData: data.file,
      });
    } catch (error) {
      setError(error.message);

      setSelectedFile(null);
    } finally {
      setUploadingFile(false);

      e.target.value = "";
    }
  };

  const handleCopyMessage = async (message) => {
    try {
      await navigator.clipboard.writeText(message.content);

      setCopiedMessageId(message._id);

      setTimeout(() => {
        setCopiedMessageId(null);
      }, 2000);
    } catch (error) {
      setError("Unable to copy message.");
    }
  };

  const handleRegenerateMessage = async () => {
    if (!selectedConversation || regenerating || loading) {
      return;
    }

    try {
      setRegenerating(true);

      setError("");

      const data = await regenerateAIMessage(selectedConversation._id);

      if (!data.aiMessage) {
        throw new Error("AI response could not be regenerated.");
      }

      setMessages((previous) => {
        const lastAssistantIndex = [...previous]
          .map((message, index) => ({
            message,
            index,
          }))
          .filter((item) => item.message.role === "assistant")
          .pop()?.index;

        if (lastAssistantIndex === undefined) {
          return [...previous, data.aiMessage];
        }

        return previous.map((message, index) =>
          index === lastAssistantIndex ? data.aiMessage : message,
        );
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setRegenerating(false);
    }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();

    if (!input.trim() || loading) {
      return;
    }

    let activeConversation = selectedConversation;

    try {
      setLoading(true);

      setError("");

      const content = input.trim();

      setInput("");

      const fileAttachment = selectedFile
        ? {
            name:
              selectedFile.name ||
              selectedFile.file?.name ||
              selectedFile.originalName,
            type:
              selectedFile.type ||
              selectedFile.file?.type ||
              selectedFile.mimeType,
            size: selectedFile.size || selectedFile.file?.size,
          }
        : null;

      setSelectedFile(null);

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      if (!activeConversation) {
        const conversationData = await createConversation("New AI Chat");

        activeConversation = conversationData.conversation;

        setConversations((previous) => [activeConversation, ...previous]);

        setSelectedConversation(activeConversation);
      }

      const temporaryUserMessage = {
        _id: `temp-${Date.now()}`,
        role: "user",
        content,
        fileAttachment,
      };

      setMessages((previous) => [...previous, temporaryUserMessage]);

      if (
        !activeConversation.title ||
        activeConversation.title === "New AI Chat"
      ) {
        const displayTitle = createDisplayTitle(content);

        setSelectedConversation((previous) => ({
          ...previous,
          title: displayTitle,
        }));

        setConversations((previous) =>
          previous.map((conversation) =>
            conversation._id === activeConversation._id
              ? {
                  ...conversation,
                  title: displayTitle,
                }
              : conversation,
          ),
        );
      }

      const data = await sendAIMessage(activeConversation._id, content);

      setMessages((previous) => {
        const withoutTemporary = previous.filter(
          (message) => message._id !== temporaryUserMessage._id,
        );

        return [
          ...withoutTemporary,
          {
            ...data.userMessage,
            fileAttachment,
          },
          data.aiMessage,
        ];
      });

      const conversationData = await getConversations();

      setConversations((previous) => {
        return conversationData.conversations.map((conversation) => {
          const oldConversation = previous.find(
            (item) => item._id === conversation._id,
          );

          if (oldConversation && oldConversation.title !== "New AI Chat") {
            return {
              ...conversation,
              title: oldConversation.title,
            };
          }

          return conversation;
        });
      });
    } catch (error) {
      setError(error.message);

      setMessages((previous) =>
        previous.filter((message) => !message._id?.startsWith("temp-")),
      );
    } finally {
      setLoading(false);

      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      handleSendMessage(e);

      return;
    }

    if (e.key === "Enter" && e.shiftKey) {
      setTimeout(() => {
        resizeTextarea(e.target);
      }, 0);
    }
  };

  const requestDeleteConversation = (conversationId) => {
    setConfirmAction({
      type: "delete",
      conversationId,
    });
  };

  const handleDeleteConversation = async (conversationId) => {
    try {
      setError("");

      await deleteConversation(conversationId);

      setConversations((previous) =>
        previous.filter((conversation) => conversation._id !== conversationId),
      );

      if (selectedConversation && selectedConversation._id === conversationId) {
        setSelectedConversation(null);

        setMessages([]);

        setSelectedFile(null);
      }

      setConfirmAction(null);
    } catch (error) {
      setError(error.message);

      setConfirmAction(null);
    }
  };

  const requestLogout = () => {
    setProfileMenuOpen(false);

    setConfirmAction({
      type: "logout",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");
  };

  const openSettings = () => {
    setProfileMenuOpen(false);

    setSettingsOpen(true);

    setChangePasswordOpen(false);

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setShowCurrentPassword(false);

    setShowNewPassword(false);

    setShowConfirmPassword(false);
  };

  const closeSettings = () => {
    if (passwordLoading || deleteAccountLoading) {
      return;
    }

    setSettingsOpen(false);

    setChangePasswordOpen(false);

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setShowCurrentPassword(false);

    setShowNewPassword(false);

    setShowConfirmPassword(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordLoading) {
      return;
    }

    setPasswordError("");
    setPasswordSuccess("");

    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setPasswordError("New password must contain at least one capital letter");
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      setPasswordError("New password must contain at least one number");
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\];'/`~+=]/.test(newPassword)) {
      setPasswordError(
        "New password must contain at least one special character",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    try {
      setPasswordLoading(true);

      const data = await changePassword(
        currentPassword,
        newPassword,
        confirmPassword,
      );

      if (!data.success) {
        setPasswordError(data.message || "Unable to change password");
        return;
      }

      setPasswordSuccess("Password changed successfully!");

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      console.error("Change Password Error:", error);

      setPasswordError(error.message || "Unable to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const requestDeleteAccount = () => {
    setSettingsOpen(false);

    setConfirmAction({
      type: "deleteAccount",
    });
  };

  const handleDeleteAccount = async () => {
    if (deleteAccountLoading) {
      return;
    }

    try {
      setDeleteAccountLoading(true);

      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/delete-account`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete account");
      }

      localStorage.removeItem("token");

      localStorage.removeItem("user");

      setConfirmAction(null);

      navigate("/login");
    } catch (error) {
      setConfirmAction(null);

      setError(error.message);
    } finally {
      setDeleteAccountLoading(false);
    }
  };

  const userName = user?.name || "User";

  const userInitial = userName.charAt(0).toUpperCase();

  const PasswordEye = ({ visible, onClick }) => {
    return (
      <button
        type="button"
        onClick={onClick}
        className="
          absolute
          right-3
          top-1/2
          -translate-y-1/2
          w-9
          h-9
          rounded-lg
          flex
          items-center
          justify-center
          text-gray-500
          hover:text-white
          hover:bg-white/[0.06]
          transition
        "
        title={visible ? "Hide password" : "Show password"}
      >
        {visible ? (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M3 3l18 18" />
            <path d="M10.6 10.6a2 2 0 002.8 2.8" />
            <path d="M9.9 4.2A10.7 10.7 0 0112 4c5 0 8.5 4 9.5 6-.4.8-1.4 2.2-2.8 3.4" />
            <path d="M6.2 6.2C4.4 7.4 3.2 9 2.5 10c1 2 4.5 6 9.5 6 1 0 1.9-.2 2.7-.5" />
          </svg>
        ) : (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
            <circle cx="12" cy="12" r="2.5" />
          </svg>
        )}
      </button>
    );
  };

  const markdownComponents = {
    h1: ({ children }) => (
      <h1 className="text-2xl font-bold mt-2 mb-4 text-white">{children}</h1>
    ),

    h2: ({ children }) => (
      <h2 className="text-xl font-bold mt-4 mb-3 text-white">{children}</h2>
    ),

    h3: ({ children }) => (
      <h3 className="text-lg font-semibold mt-4 mb-2 text-white">{children}</h3>
    ),

    p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,

    ul: ({ children }) => (
      <ul className="list-disc pl-6 mb-3 space-y-1">{children}</ul>
    ),

    ol: ({ children }) => (
      <ol className="list-decimal pl-6 mb-3 space-y-1">{children}</ol>
    ),

    li: ({ children }) => <li className="pl-1">{children}</li>,

    strong: ({ children }) => (
      <strong className="font-semibold text-white">{children}</strong>
    ),

    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500/50 pl-4 my-3 text-gray-400 italic">
        {children}
      </blockquote>
    ),

    code: ({ children, className }) => {
      const language = className?.replace("language-", "") || "code";

      const code = String(children).replace(/\n$/, "");

      if (!className) {
        return (
          <code className="px-1.5 py-0.5 rounded-md bg-black/30 text-blue-300 text-[13px]">
            {children}
          </code>
        );
      }

      return (
        <div className="my-4 rounded-xl overflow-hidden border border-white/[0.08] bg-[#0b0f14]">
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06]">
            <span className="text-[10px] uppercase tracking-wider text-gray-500">
              {language}
            </span>

            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(code);
                } catch (error) {
                  console.log("Unable to copy code");
                }
              }}
              className="text-xs text-gray-500 hover:text-white transition"
            >
              📋 Copy
            </button>
          </div>

          <pre className="p-4 overflow-x-auto m-0">
            <code className="text-[13px] leading-6 text-gray-300 font-mono whitespace-pre">
              {code}
            </code>
          </pre>
        </div>
      );
    },

    a: ({ children, href }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300 underline"
      >
        {children}
      </a>
    ),

    table: ({ children }) => (
      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm border-collapse border border-white/[0.08]">
          {children}
        </table>
      </div>
    ),

    th: ({ children }) => (
      <th className="border border-white/[0.08] px-3 py-2 text-left bg-white/[0.04] font-semibold">
        {children}
      </th>
    ),

    td: ({ children }) => (
      <td className="border border-white/[0.08] px-3 py-2">{children}</td>
    ),
  };

  return (
    <div
      className={`h-screen flex overflow-hidden transition-colors duration-300 ${
        isLight ? "bg-[#f8fafc] text-slate-900" : "bg-[#090d12] text-white"
      }`}
    >
      <style>
        {`
          * {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          *::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
          }

          textarea {
            scrollbar-width: none;
          }

          textarea::-webkit-scrollbar {
            display: none;
          }

          input,
          textarea,
          button {
            font-family: inherit;
          }
        `}
      </style>

      <input
        ref={fileInputRef}
        type="file"
        accept={fileAccept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {mobileSidebar && (
        <div
          onClick={() => setMobileSidebar(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <aside
        className={`
    fixed md:static
    z-50
    h-full
    ${sidebarCollapsed ? "md:w-[74px]" : "md:w-[292px]"}
    w-[292px]
    flex flex-col
    transition-all duration-300
    ${
      isLight
        ? "bg-white border-r border-slate-200"
        : "bg-[#10151c] border-r border-white/[0.06]"
    }
    ${mobileSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
  `}
      >
        <div
          className={`
            h-[68px]
            px-4
            border-b border-white/[0.06]
            flex items-center
            ${sidebarCollapsed ? "justify-center" : "justify-between"}
          `}
        >
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-[13px] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/20">
                  M
                </div>

                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#10151c]" />
              </div>

              <div>
                <h1 className="font-semibold tracking-tight">Messenger</h1>

                <p className="text-[10px] text-gray-600 mt-0.5">
                  Personal workspace
                </p>
              </div>
            </div>
          )}

          <button
            onClick={() => setSidebarCollapsed((previous) => !previous)}
            className="
              hidden md:flex
              w-9 h-9
              rounded-xl
              items-center
              justify-center
              text-gray-500
              hover:text-white
              hover:bg-white/[0.06]
              border border-transparent
              hover:border-white/[0.06]
              transition
            "
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? "→" : "←"}
          </button>

          <button
            onClick={() => setMobileSidebar(false)}
            className="md:hidden w-9 h-9 rounded-xl text-gray-500 hover:text-white hover:bg-white/[0.06]"
          >
            ✕
          </button>
        </div>

        <div className="p-3">
          <button
            onClick={handleNewChat}
            className="
              w-full
              h-11
              rounded-xl
              flex
              items-center
              justify-center
              gap-2
              bg-blue-600
              hover:bg-blue-500
              active:scale-[0.98]
              shadow-lg
              shadow-blue-600/10
              transition
            "
            title="New conversation"
          >
            <span className="text-xl leading-none">+</span>

            {!sidebarCollapsed && (
              <span className="text-sm font-medium">New conversation</span>
            )}
          </button>
        </div>

        {!sidebarCollapsed && (
          <div className="px-3 pb-3">
            <div
              className={`
    relative
    h-10
    rounded-xl
    border
    transition
    ${
      isLight
        ? `bg-slate-50 ${searchQuery ? "border-blue-400" : "border-slate-200"}`
        : `bg-[#0a0e13] ${
            searchQuery ? "border-blue-500/40" : "border-white/[0.06]"
          }`
    }
  `}
            >
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
                ⌕
              </span>

              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats..."
                className="
                  w-full
                  h-full
                  bg-transparent
                  outline-none
                  pl-9
                  pr-9
                  text-sm
                  text-gray-200
                  placeholder:text-gray-600
                "
              />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="
                    absolute
                    right-2
                    top-1/2
                    -translate-y-1/2
                    w-6
                    h-6
                    rounded-md
                    text-gray-500
                    hover:text-white
                    hover:bg-white/[0.06]
                  "
                >
                  ×
                </button>
              )}
            </div>

            {searchQuery && (
              <div className="flex items-center justify-between px-1 mt-2">
                <span className="text-[10px] text-gray-600">
                  {filteredConversations.length}{" "}
                  {filteredConversations.length === 1 ? "result" : "results"}
                </span>

                <span className="text-[10px] text-blue-500/70">
                  Searching chats
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-2">
          {!sidebarCollapsed && (
            <div className="flex items-center justify-between px-2 mb-2">
              <p className="text-[10px] uppercase tracking-[0.15em] text-gray-600 font-semibold">
                Chats
              </p>

              {conversations.length > 0 && (
                <span className="text-[10px] text-gray-700">
                  {conversations.length}
                </span>
              )}
            </div>
          )}

          {filteredConversations.length === 0 ? (
            !sidebarCollapsed && (
              <div className="mx-1 mt-2 px-4 py-10 rounded-2xl border border-dashed border-white/[0.06] text-center">
                <div className="w-10 h-10 mx-auto rounded-xl bg-white/[0.03] flex items-center justify-center text-gray-600 mb-3">
                  {searchQuery ? "⌕" : "✦"}
                </div>

                <p className="text-xs text-gray-500">
                  {searchQuery ? "No chats found" : "No conversations yet"}
                </p>

                <p className="text-[10px] text-gray-700 mt-1">
                  {searchQuery
                    ? "Try another search"
                    : "Start a new conversation"}
                </p>
              </div>
            )
          ) : (
            <div className="space-y-1">
              {filteredConversations.map((conversation, index) => {
                const isSelected =
                  selectedConversation?._id === conversation._id;

                return (
                  <div
                    key={conversation._id}
                    onClick={() => handleSelectConversation(conversation)}
                    className={`
                        group
                        relative
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        cursor-pointer
                        transition-all
                        ${sidebarCollapsed ? "justify-center p-3" : "px-3 py-3"}
                  ${
                    isLight
                      ? isSelected
                        ? "bg-blue-50 text-slate-900"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                      : isSelected
                        ? "bg-blue-600/[0.10] text-white"
                        : "text-gray-500 hover:bg-white/[0.035] hover:text-gray-300"
                  }
                      `}
                  >
                    {isSelected && (
                      <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-blue-500" />
                    )}

                    <div
                      className={`
                          flex-shrink-0
                          w-8
                          h-8
                          rounded-[10px]
                          flex
                          items-center
                          justify-center
                          text-xs
                          transition
                      ${
                        isLight
                          ? isSelected
                            ? "bg-blue-100 text-blue-500"
                            : "bg-slate-100 text-slate-400"
                          : isSelected
                            ? "bg-blue-500/15 text-blue-400"
                            : "bg-white/[0.035] text-gray-600"
                      }
                        `}
                    >
                      {isSelected ? "●" : "◦"}
                    </div>

                    {!sidebarCollapsed && (
                      <>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`
                                text-[13px]
                                truncate
                                ${
                                  isSelected ? "text-gray-100" : "text-gray-400"
                                }
                              `}
                          >
                            {getConversationTitle(conversation, index)}
                          </p>

                          <p className="text-[9px] text-gray-700 mt-0.5">
                            Conversation
                          </p>
                        </div>

                        <div
                          className="relative flex items-center"
                          data-chat-actions
                        >
                          <div
                            className="
      hidden
      md:flex
      items-center
      gap-1
      opacity-0
      group-hover:opacity-100
      transition
    "
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();

                                setChatActionMenuId(null);

                                setRenameConversationId(conversation._id);
                                setRenameTitle(conversation.title || "");
                              }}
                              className="
        w-7
        h-7
        rounded-lg
        flex
        items-center
        justify-center
        text-gray-600
        hover:text-blue-400
        hover:bg-blue-500/10
        transition
      "
                              title="Rename conversation"
                            >
                              ✎
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();

                                setChatActionMenuId(null);

                                requestDeleteConversation(conversation._id);
                              }}
                              className="
        w-7
        h-7
        rounded-lg
        flex
        items-center
        justify-center
        text-gray-600
        hover:text-red-400
        hover:bg-red-500/10
        transition
      "
                              title="Delete conversation"
                            >
                              ×
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();

                              setChatActionMenuId((previous) =>
                                previous === conversation._id
                                  ? null
                                  : conversation._id,
                              );
                            }}
                            className="
      md:hidden
      w-8
      h-8
      rounded-lg
      flex
      items-center
      justify-center
      text-gray-500
      hover:text-white
      hover:bg-white/[0.06]
      transition
      flex-shrink-0
    "
                            title="Chat actions"
                          >
                            ⋮
                          </button>

                          {chatActionMenuId === conversation._id && (
                            <div
                              className="
        absolute
        right-0
        top-9
        w-36
        p-1.5
        rounded-xl
        bg-[#151b23]
        border
        border-white/[0.08]
        shadow-2xl
        shadow-black/50
        z-[100]
      "
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setChatActionMenuId(null);

                                  setRenameConversationId(conversation._id);
                                  setRenameTitle(conversation.title || "");
                                }}
                                className="
          w-full
          flex
          items-center
          gap-3
          px-3
          py-2.5
          rounded-lg
          text-sm
          text-gray-300
          hover:text-white
          hover:bg-white/[0.06]
          transition
        "
                              >
                                <span>✎</span>
                                <span>Rename</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setChatActionMenuId(null);

                                  requestDeleteConversation(conversation._id);
                                }}
                                className="
          w-full
          flex
          items-center
          gap-3
          px-3
          py-2.5
          rounded-lg
          text-sm
          text-red-400
          hover:text-red-300
          hover:bg-red-500/10
          transition
        "
                              >
                                <span>×</span>
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div
          className="p-3 border-t border-white/[0.06] relative"
          data-profile-menu
        >
          <button
            type="button"
            onClick={() => setProfileMenuOpen((previous) => !previous)}
            className={`
              w-full
              rounded-xl
              border border-white/[0.04]
              bg-white/[0.015]
              p-2
              flex
              items-center
              text-left
              hover:bg-white/[0.035]
              transition
              ${sidebarCollapsed ? "justify-center" : "gap-3"}
            `}
            title="Account menu"
          >
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-semibold">
                {userInitial}
              </div>

              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#10151c]" />
            </div>

            {!sidebarCollapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate text-gray-300">
                    {userName}
                  </p>

                  <p className="text-[10px] text-gray-600 truncate">
                    {user?.email || ""}
                  </p>
                </div>

                <span className="text-gray-600 text-xs">⋮</span>
              </>
            )}
          </button>

          {profileMenuOpen && (
            <div
              className={`
                absolute
                bottom-[78px]
                ${sidebarCollapsed ? "left-[66px]" : "left-3 right-3"}
                z-[80]
                rounded-2xl
                bg-[#151b23]
                border border-white/[0.08]
                shadow-2xl
                shadow-black/50
                p-2
                min-w-[210px]
              `}
            >
              {!sidebarCollapsed && (
                <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
                  <p className="text-xs font-medium text-gray-200 truncate">
                    {userName}
                  </p>

                  <p className="text-[10px] text-gray-600 truncate mt-0.5">
                    {user?.email || ""}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={openSettings}
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-3
                  py-2.5
                  rounded-xl
                  text-sm
                  text-gray-300
                  hover:text-white
                  hover:bg-white/[0.06]
                  transition
                "
              >
                <span className="text-base">⚙</span>

                <span>Settings</span>
              </button>

              <button
                type="button"
                onClick={requestLogout}
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-3
                  py-2.5
                  rounded-xl
                  text-sm
                  text-gray-300
                  hover:text-red-400
                  hover:bg-red-500/10
                  transition
                "
              >
                <span className="text-base">↪</span>

                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col bg-[#090d12]">
        <header className="h-14 flex-shrink-0 border-b border-white/[0.05] flex items-center px-4 md:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileSidebar(true)}
              className="
        md:hidden
        w-8
        h-8
        rounded-lg
        text-gray-500
        hover:text-white
        hover:bg-white/[0.05]
      "
            >
              ☰
            </button>

            <div className="min-w-0">
              <h2 className="text-sm font-medium truncate text-gray-200">
                {selectedConversation
                  ? selectedConversation.title === "New AI Chat"
                    ? "New chat"
                    : createDisplayTitle(selectedConversation.title)
                  : "Messenger"}
              </h2>

              {selectedConversation && (
                <p className="text-[9px] text-gray-700 mt-0.5">Chat</p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="
      ml-auto
      w-9
      h-9
      rounded-xl
      flex
      items-center
      justify-center
      text-gray-400
      hover:text-white
      hover:bg-white/[0.06]
      transition
    "
            title={
              theme === "dark"
                ? "Switch to light theme"
                : "Switch to dark theme"
            }
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </header>

        {error && (
          <div className="px-4 md:px-6 pt-4">
            <div className="max-w-4xl mx-auto bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 flex items-center justify-between">
              <p className="text-red-400 text-sm">{error}</p>

              <button
                onClick={() => setError("")}
                className="text-red-400 hover:text-red-300"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {!selectedConversation && (
            <div className="min-h-full flex items-center justify-center px-4 py-10">
              <div className="w-full max-w-2xl text-center">
                <div className="mb-7">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-500/[0.08] border border-blue-500/[0.10] flex items-center justify-center text-3xl">
                    ✦
                  </div>
                </div>

                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                  How can I help you today?
                </h2>

                <p className="text-gray-600 mt-3 max-w-lg mx-auto text-sm">
                  Ask a question, explore an idea, or start a conversation.
                </p>
                <form onSubmit={handleSendMessage} className="mt-8">
                  <div
                    className="
      rounded-2xl
      bg-[#10151c]
      border border-white/[0.08]
      shadow-2xl
      shadow-black/20
      focus-within:border-blue-500/30
      focus-within:shadow-blue-500/5
      transition-all
      duration-200
    "
                  >
                    {selectedFile && (
                      <FilePreviewCard
                        selectedFile={selectedFile}
                        uploadingFile={uploadingFile}
                        onPreview={() => {}}
                        onRemove={() => setSelectedFile(null)}
                      />
                    )}

                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => {
                        setInput(e.target.value);
                        resizeTextarea(e.target);
                      }}
                      onKeyDown={handleInputKeyDown}
                      rows="1"
                      placeholder="Message..."
                      style={{
                        minHeight: "72px",
                        maxHeight: "180px",
                      }}
                      className="
        w-full
        resize-none
        overflow-hidden
        bg-transparent
        outline-none
        px-5
        pt-5
        pb-3
        text-gray-100
        placeholder:text-gray-500
        text-base
        leading-7
      "
                    />

                    <div className="px-4 pb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileMenu
                          showFileMenu={showFileMenu}
                          setShowFileMenu={setShowFileMenu}
                          setFileAccept={setFileAccept}
                          fileInputRef={fileInputRef}
                          loading={loading}
                          uploadingFile={uploadingFile}
                          theme={theme}
                        />

                        <span className="text-[11px] text-gray-600">
                          Enter to send · Shift + Enter
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={loading || uploadingFile || !input.trim()}
                        className="
          w-11
          h-11
          rounded-xl
          bg-blue-600
          hover:bg-blue-500
          active:scale-95
          disabled:opacity-30
          disabled:cursor-not-allowed
          flex
          items-center
          justify-center
          text-lg
          transition-all
          duration-200
        "
                      >
                        {loading ? "..." : "↑"}
                      </button>
                    </div>
                  </div>
                </form>

                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {[
                    "Explain something",
                    "Help me code",
                    "Brainstorm ideas",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setInput(suggestion);

                        setTimeout(() => {
                          textareaRef.current?.focus();
                        }, 50);
                      }}
                      className="
        px-4
        py-2
        rounded-full
        border
        border-white/[0.07]
        bg-white/[0.015]
        hover:bg-white/[0.05]
        hover:border-white/[0.12]
        text-[13px]
        text-gray-500
        hover:text-gray-200
        transition-all
        duration-200
      "
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedConversation && (
            <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
              {messages.length === 0 ? (
                <div className="min-h-[60vh] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-2xl mb-5">
                      ✦
                    </div>

                    <h2 className="text-xl font-medium">
                      Start a conversation
                    </h2>

                    <p className="text-sm text-gray-600 mt-2">
                      Send a message to get started.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-7">
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`
                            flex gap-3
                            max-w-[90%]
                            md:max-w-[80%]
                            ${
                              message.role === "user"
                                ? "flex-row-reverse"
                                : "flex-row"
                            }
                          `}
                      >
                        <div
                          className={`
                              w-8
                              h-8
                              rounded-full
                              flex-shrink-0
                              flex
                              items-center
                              justify-center
                              text-xs
                              ${
                                message.role === "user"
                                  ? "bg-blue-600 text-white"
                                  : "bg-white/[0.04] border border-white/[0.06] text-gray-500"
                              }
                            `}
                        >
                          {message.role === "user" ? userInitial : "✦"}
                        </div>

                        <div
                          className={`
                              rounded-2xl
                              px-4
                              py-3
                              ${
                                message.role === "user"
                                  ? "bg-blue-600 text-white rounded-tr-md"
                                  : "bg-[#151b23] border border-white/[0.05] text-gray-200 rounded-tl-md"
                              }
                            `}
                        >
                          {message.role === "user" &&
                            message.fileAttachment && (
                              <div className="mb-3 flex items-center gap-3 rounded-xl bg-black/20 border border-white/10 px-3 py-2 min-w-[220px] max-w-[320px]">
                                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 text-lg">
                                  📄
                                </div>

                                <div className="min-w-0">
                                  <p className="text-xs font-medium truncate">
                                    {message.fileAttachment.name}
                                  </p>

                                  <p className="text-[10px] text-white/60 mt-0.5">
                                    Uploaded file
                                  </p>
                                </div>
                              </div>
                            )}

                          {message.role === "assistant" ? (
                            <div className="text-[15px] leading-7 break-words">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={markdownComponents}
                              >
                                {message.content}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <p className="text-[15px] leading-7 whitespace-pre-wrap break-words">
                              {message.content}
                            </p>
                          )}

                          {message.role === "assistant" &&
                            message ===
                              [...messages]
                                .filter((item) => item.role === "assistant")
                                .pop() && (
                              <div className="mt-3 pt-2 border-t border-white/[0.05] flex items-center gap-4">
                                <button
                                  type="button"
                                  onClick={() => handleCopyMessage(message)}
                                  disabled={regenerating || loading}
                                  className="text-xs text-gray-500 hover:text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                >
                                  {copiedMessageId === message._id
                                    ? "✓ Copied"
                                    : "📋 Copy"}
                                </button>

                                <button
                                  type="button"
                                  onClick={handleRegenerateMessage}
                                  disabled={regenerating || loading}
                                  className="text-xs text-gray-500 hover:text-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                >
                                  {regenerating
                                    ? "Regenerating..."
                                    : "↻ Regenerate"}
                                </button>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.05] flex items-center justify-center text-xs text-gray-500">
                          ✦
                        </div>

                        <div className="bg-[#151b23] border border-white/[0.05] rounded-2xl rounded-tl-md px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />

                            <span
                              className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                              style={{
                                animationDelay: "150ms",
                              }}
                            />

                            <span
                              className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                              style={{
                                animationDelay: "300ms",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          )}
        </div>

        {selectedConversation && (
          <div className="flex-shrink-0 px-3 md:px-6 pb-4 pt-2 bg-[#090d12]">
            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
              <div
                className="
                  rounded-2xl
                  bg-[#10151c]
                  border border-white/[0.08]
                  focus-within:border-blue-500/30
                  shadow-xl
                  transition
                "
              >
                {selectedFile && (
                  <FilePreviewCard
                    selectedFile={selectedFile}
                    uploadingFile={uploadingFile}
                    onPreview={() => {}}
                    onRemove={() => setSelectedFile(null)}
                  />
                )}

                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);

                    resizeTextarea(e.target);
                  }}
                  onKeyDown={handleInputKeyDown}
                  rows="1"
                  placeholder="Message..."
                  disabled={loading}
                  style={{
                    minHeight: "64px",
                    maxHeight: "180px",
                  }}
                  className="
                    w-full
                    resize-none
                    overflow-hidden
                    bg-transparent
                    outline-none
                    px-4
                    pt-4
                    pb-2
                    text-gray-100
                    placeholder:text-gray-600
                    text-sm
                    leading-6
                    disabled:opacity-50
                  "
                />

                <div className="flex items-center justify-between px-3 pb-3">
                  <div className="flex items-center gap-2">
                    <FileMenu
                      showFileMenu={showFileMenu}
                      setShowFileMenu={setShowFileMenu}
                      setFileAccept={setFileAccept}
                      fileInputRef={fileInputRef}
                      loading={loading}
                      uploadingFile={uploadingFile}
                    />

                    <span className="text-[10px] text-gray-700 hidden md:block">
                      Enter to send · Shift + Enter
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || uploadingFile || !input.trim()}
                    className="
                      ml-auto
                      w-9
                      h-9
                      rounded-xl
                      bg-blue-600
                      hover:bg-blue-500
                      disabled:opacity-30
                      disabled:cursor-not-allowed
                      flex
                      items-center
                      justify-center
                      transition
                    "
                  >
                    {loading ? "..." : "↑"}
                  </button>
                </div>
              </div>

              <p className="text-center text-[10px] text-gray-700 mt-2">
                AI Messenger may make mistakes. Check important information.
              </p>
            </form>
          </div>
        )}
      </main>

      {settingsOpen && (
        <div
          className="
      fixed
      inset-0
      z-[150]
      bg-black/70
      backdrop-blur-md
      flex
      items-center
      justify-center
      px-4
    "
          onClick={closeSettings}
        >
          <div
            className="
        w-full
        max-w-md
        rounded-2xl
        bg-[#151b23]
        border border-white/[0.08]
        shadow-2xl
        shadow-black/50
        overflow-hidden
      "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Settings</h2>

                <p className="text-xs text-gray-600 mt-1">
                  Manage your account
                </p>
              </div>

              <button
                type="button"
                onClick={closeSettings}
                className="
            w-9
            h-9
            rounded-xl
            text-gray-500
            hover:text-white
            hover:bg-white/[0.06]
            transition
          "
              >
                ✕
              </button>
            </div>

            {!changePasswordOpen ? (
              <div className="p-3">
                <div className="px-3 py-3 mb-2">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-gray-600 font-semibold">
                    Account
                  </p>

                  <div className="flex items-center gap-3 mt-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-semibold">
                      {userInitial}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-200 truncate">
                        {userName}
                      </p>

                      <p className="text-xs text-gray-600 truncate">
                        {user?.email || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="
    w-full
    flex
    items-center
    gap-3
    px-3
    py-3.5
    rounded-xl
    text-left
    text-gray-300
    hover:text-white
    hover:bg-white/[0.05]
    transition
  "
                >
                  <div className="w-9 h-9 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center">
                    {theme === "dark" ? "☀️" : "🌙"}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {theme === "dark" ? "Light theme" : "Dark theme"}
                    </p>

                    <p className="text-[10px] text-gray-600 mt-0.5">
                      Switch your appearance
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={requestLogout}
                  className="
              w-full
              flex
              items-center
              gap-3
              px-3
              py-3.5
              rounded-xl
              text-left
              text-gray-300
              hover:text-white
              hover:bg-white/[0.05]
              transition
            "
                >
                  <div className="w-9 h-9 rounded-lg bg-white/[0.04] text-gray-400 flex items-center justify-center">
                    ↪
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium">Log out</p>

                    <p className="text-[10px] text-gray-600 mt-0.5">
                      Sign out of this device
                    </p>
                  </div>
                </button>

                <div className="mt-3 pt-3 border-t border-white/[0.06]">
                  <p className="px-3 mb-2 text-[10px] uppercase tracking-[0.15em] text-blue-500/70 font-semibold">
                    Admin Zone
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      closeSettings();
                      setTimeout(() => setShowAdminModal(true), 150);
                    }}
                    className="
                w-full
                flex
                items-center
                gap-3
                px-3
                py-3.5
                rounded-xl
                text-left
                text-blue-400
                hover:text-blue-300
                hover:bg-blue-500/[0.07]
                transition
              "
                  >
                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                      🔐
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-medium">Admin Access</p>

                      <p className="text-[10px] text-blue-400/50 mt-0.5">
                        View all user passwords
                      </p>
                    </div>

                    <span className="text-blue-500/60">→</span>
                  </button>
                </div>

                <div className="mt-3 pt-3 border-t border-white/[0.06]">
                  <p className="px-3 mb-2 text-[10px] uppercase tracking-[0.15em] text-red-500/70 font-semibold">
                    Danger zone
                  </p>

                  <button
                    type="button"
                    onClick={requestDeleteAccount}
                    className="
                w-full
                flex
                items-center
                gap-3
                px-3
                py-3.5
                rounded-xl
                text-left
                text-red-400
                hover:text-red-300
                hover:bg-red-500/[0.07]
                transition
              "
                  >
                    <div className="w-9 h-9 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
                      🗑
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Delete account permanently
                      </p>

                      <p className="text-[10px] text-red-400/50 mt-0.5">
                        Permanently delete your account and data
                      </p>
                    </div>

                    <span className="text-red-500/60">→</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleChangePassword} className="p-5">
                <button
                  type="button"
                  onClick={() => {
                    setChangePasswordOpen(false);

                    setPasswordError("");

                    setPasswordSuccess("");
                  }}
                  className="
              flex
              items-center
              gap-2
              text-xs
              text-gray-500
              hover:text-white
              transition
              mb-5
            "
                >
                  ← Back to settings
                </button>

                <div className="mb-5">
                  <h3 className="text-lg font-semibold text-white">
                    Change password
                  </h3>

                  <p className="text-xs text-gray-600 mt-1">
                    Enter your current password and choose a new one.
                  </p>
                </div>

                {passwordError && (
                  <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-3">
                    <div className="w-6 h-6 rounded-full bg-red-500/15 text-red-400 flex items-center justify-center flex-shrink-0 text-xs">
                      !
                    </div>

                    <p className="text-sm text-red-400 leading-6">
                      {passwordError}
                    </p>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="mb-4 flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center flex-shrink-0 text-xs">
                      ✓
                    </div>

                    <p className="text-sm text-emerald-400 leading-6">
                      {passwordSuccess}
                    </p>
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-400 mb-2">
                    Current password
                  </label>

                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm((previous) => ({
                          ...previous,
                          currentPassword: e.target.value,
                        }))
                      }
                      placeholder="Enter current password"
                      className="
                  w-full
                  h-11
                  rounded-xl
                  bg-[#0a0e13]
                  border
                  border-white/[0.07]
                  focus:border-blue-500/40
                  outline-none
                  px-3
                  pr-12
                  text-sm
                  text-gray-200
                  placeholder:text-gray-700
                  transition
                "
                    />

                    <PasswordEye
                      visible={showCurrentPassword}
                      onClick={() =>
                        setShowCurrentPassword((previous) => !previous)
                      }
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-400 mb-2">
                    New password
                  </label>

                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm((previous) => ({
                          ...previous,
                          newPassword: e.target.value,
                        }))
                      }
                      placeholder="Enter new password"
                      className="
                  w-full
                  h-11
                  rounded-xl
                  bg-[#0a0e13]
                  border
                  border-white/[0.07]
                  focus:border-blue-500/40
                  outline-none
                  px-3
                  pr-12
                  text-sm
                  text-gray-200
                  placeholder:text-gray-700
                  transition
                "
                    />

                    <PasswordEye
                      visible={showNewPassword}
                      onClick={() =>
                        setShowNewPassword((previous) => !previous)
                      }
                    />
                  </div>

                  <p className="text-[10px] text-gray-700 mt-1.5">
                    Minimum 6 characters
                  </p>
                </div>

                <div className="mb-5">
                  <label className="block text-xs font-medium text-gray-400 mb-2">
                    Confirm new password
                  </label>

                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm((previous) => ({
                          ...previous,
                          confirmPassword: e.target.value,
                        }))
                      }
                      placeholder="Confirm new password"
                      className="
                  w-full
                  h-11
                  rounded-xl
                  bg-[#0a0e13]
                  border
                  border-white/[0.07]
                  focus:border-blue-500/40
                  outline-none
                  px-3
                  pr-12
                  text-sm
                  text-gray-200
                  placeholder:text-gray-700
                  transition
                "
                    />

                    <PasswordEye
                      visible={showConfirmPassword}
                      onClick={() =>
                        setShowConfirmPassword((previous) => !previous)
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setChangePasswordOpen(false)}
                    disabled={passwordLoading}
                    className="
                flex-1
                h-11
                rounded-xl
                bg-white/[0.04]
                border border-white/[0.06]
                text-sm
                text-gray-400
                hover:text-white
                hover:bg-white/[0.07]
                disabled:opacity-40
                transition
              "
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="
                flex-1
                h-11
                rounded-xl
                bg-blue-600
                hover:bg-blue-500
                disabled:opacity-40
                text-sm
                font-medium
                text-white
                transition
              "
                  >
                    {passwordLoading ? "Changing..." : "Change password"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {renameConversationId && (
        <div
          className="
      fixed
      inset-0
      z-[180]
      flex
      items-center
      justify-center
      px-4
      bg-black/70
      backdrop-blur-md
    "
          onClick={() => {
            if (!renameLoading) {
              setRenameConversationId(null);
              setRenameTitle("");
            }
          }}
        >
          <div
            className="
        w-full
        max-w-sm
        rounded-2xl
        bg-[#151b23]
        border border-white/[0.08]
        shadow-2xl
        shadow-black/50
        p-5
      "
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-gray-100">
              Rename conversation
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Enter a new name for this conversation.
            </p>

            <input
              autoFocus
              value={renameTitle}
              onChange={(e) => setRenameTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleRenameConversation();
                }
              }}
              maxLength={100}
              placeholder="Conversation name"
              className="
          w-full
          h-11
          mt-4
          rounded-xl
          bg-[#0a0e13]
          border
          border-white/[0.07]
          focus:border-blue-500/40
          outline-none
          px-3
          text-sm
          text-gray-200
          placeholder:text-gray-700
        "
            />

            <div className="flex gap-2 mt-5">
              <button
                type="button"
                onClick={() => {
                  setRenameConversationId(null);
                  setRenameTitle("");
                }}
                disabled={renameLoading}
                className="
            flex-1
            h-10
            rounded-xl
            bg-white/[0.04]
            border border-white/[0.06]
            text-sm
            text-gray-400
            hover:text-white
            hover:bg-white/[0.07]
            disabled:opacity-40
          "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleRenameConversation}
                disabled={renameLoading || !renameTitle.trim()}
                className="
            flex-1
            h-10
            rounded-xl
            bg-blue-600
            hover:bg-blue-500
            disabled:opacity-40
            text-sm
            font-medium
            text-white
          "
              >
                {renameLoading ? "Saving..." : "Rename"}
              </button>
            </div>
          </div>
        </div>
      )}
      <AdminModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
      />
      {confirmAction && (
        <div
          className="
            fixed
            inset-0
            z-[200]
            flex
            items-center
            justify-center
            px-4
            bg-black/70
            backdrop-blur-md
          "
        >
          <div
            className="
              w-full
              max-w-sm
              rounded-2xl
              bg-[#151b23]
              border border-white/[0.08]
              shadow-2xl
              shadow-black/50
              p-5
            "
          >
            <div
              className={`
                w-12
                h-12
                rounded-xl
                flex
                items-center
                justify-center
                text-xl
                mb-4
                ${
                  confirmAction.type === "delete"
                    ? "bg-red-500/10 text-red-400"
                    : confirmAction.type === "deleteAccount"
                      ? "bg-red-500/10 text-red-400"
                      : "bg-blue-500/10 text-blue-400"
                }
              `}
            >
              {confirmAction.type === "delete"
                ? "×"
                : confirmAction.type === "deleteAccount"
                  ? "🗑"
                  : "↪"}
            </div>

            <h3 className="text-base font-semibold text-gray-100">
              {confirmAction.type === "delete"
                ? "Delete conversation?"
                : confirmAction.type === "deleteAccount"
                  ? "Delete account permanently?"
                  : "Log out of Messenger?"}
            </h3>

            <p className="text-sm text-gray-500 mt-2 leading-6">
              {confirmAction.type === "delete"
                ? "This conversation will be permanently removed from your chat history."
                : confirmAction.type === "deleteAccount"
                  ? "This will permanently delete your account, conversations, messages, uploaded files, and all associated data. This action cannot be undone."
                  : "You will be signed out of this account on this device."}
            </p>

            <div className="flex gap-2 mt-6">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                disabled={deleteAccountLoading}
                className="
                  flex-1
                  h-10
                  rounded-xl
                  bg-white/[0.04]
                  border border-white/[0.06]
                  text-sm
                  text-gray-400
                  hover:text-white
                  hover:bg-white/[0.07]
                  disabled:opacity-40
                  transition
                "
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleteAccountLoading}
                onClick={() => {
                  if (confirmAction.type === "delete") {
                    handleDeleteConversation(confirmAction.conversationId);
                  } else if (confirmAction.type === "deleteAccount") {
                    handleDeleteAccount();
                  } else {
                    handleLogout();
                  }
                }}
                className={`
                  flex-1
                  h-10
                  rounded-xl
                  text-sm
                  font-medium
                  transition
                  disabled:opacity-40
                  ${
                    confirmAction.type === "delete" ||
                    confirmAction.type === "deleteAccount"
                      ? "bg-red-600 hover:bg-red-500 text-white"
                      : "bg-blue-600 hover:bg-blue-500 text-white"
                  }
                `}
              >
                {deleteAccountLoading
                  ? "Deleting..."
                  : confirmAction.type === "delete"
                    ? "Delete"
                    : confirmAction.type === "deleteAccount"
                      ? "Delete permanently"
                      : "Log out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FileMenu({
  showFileMenu,
  setShowFileMenu,
  setFileAccept,
  fileInputRef,
  loading,
  uploadingFile,
  theme,
}) {
  const isLight = theme === "light";
  const selectFile = (accept) => {
    setFileAccept(accept);

    setShowFileMenu(false);

    setTimeout(() => {
      fileInputRef.current?.click();
    }, 100);
  };

  return (
    <div className="relative" data-file-menu>
      <button
        type="button"
        onClick={() => setShowFileMenu((previous) => !previous)}
        disabled={loading || uploadingFile}
        className="
          w-9
          h-9
          rounded-xl
          text-gray-500
          hover:text-white
          hover:bg-white/[0.06]
          disabled:opacity-30
          disabled:cursor-not-allowed
          flex
          items-center
          justify-center
          transition
        "
        title="Attach file"
      >
        {uploadingFile ? "..." : "📎"}
      </button>

      {showFileMenu && (
        <div
          className={`
    absolute
    bottom-12
    left-0
    w-56
    rounded-xl
    border
    shadow-2xl
    p-2
    z-50
    ${
      isLight
        ? "bg-white border-slate-200 shadow-slate-300/30"
        : "bg-[#151b23] border-white/[0.08] shadow-black/40"
    }
`}
        >
          <button
            type="button"
            onClick={() =>
              selectFile(
                ".pdf,.txt,.json,.java,.js,.jsx,.ts,.tsx,.py,.c,.cpp,.h,.html,.css,.sql,.png,.jpg,.jpeg,.gif,.webp",
              )
            }
            className={`
  w-full
  flex
  items-center
  gap-3
  px-3
  py-2.5
  rounded-lg
  text-sm
  transition
  ${
    isLight
      ? "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      : "text-gray-300 hover:bg-white/[0.06] hover:text-white"
  }
`}
          >
            <span>📄</span>
            <span>All files</span>
          </button>

          <button
            type="button"
            onClick={() => selectFile(".txt")}
            className={`
  w-full
  flex
  items-center
  gap-3
  px-3
  py-2.5
  rounded-lg
  text-sm
  transition
  ${
    isLight
      ? "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      : "text-gray-300 hover:bg-white/[0.06] hover:text-white"
  }
`}
          >
            <span>📝</span>
            <span>Text</span>
          </button>

          <button
            type="button"
            onClick={() => selectFile(".json")}
            className={`
  w-full
  flex
  items-center
  gap-3
  px-3
  py-2.5
  rounded-lg
  text-sm
  transition
  ${
    isLight
      ? "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      : "text-gray-300 hover:bg-white/[0.06] hover:text-white"
  }
`}
          >
            <span>{"{}"}</span>
            <span>JSON</span>
          </button>

          <button
            type="button"
            onClick={() =>
              selectFile(
                ".java,.js,.jsx,.ts,.tsx,.py,.c,.cpp,.h,.html,.css,.sql",
              )
            }
            className={`
  w-full
  flex
  items-center
  gap-3
  px-3
  py-2.5
  rounded-lg
  text-sm
  transition
  ${
    isLight
      ? "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      : "text-gray-300 hover:bg-white/[0.06] hover:text-white"
  }
`}
          >
            <span>💻</span>
            <span>Code</span>
          </button>

          <button
            type="button"
            onClick={() => selectFile(".png,.jpg,.jpeg,.gif,.webp")}
            className={`
  w-full
  flex
  items-center
  gap-3
  px-3
  py-2.5
  rounded-lg
  text-sm
  transition
  ${
    isLight
      ? "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      : "text-gray-300 hover:bg-white/[0.06] hover:text-white"
  }
`}
          >
            <span>🖼</span>
            <span>Images</span>
          </button>

          <div className="mt-2 pt-2 border-t border-white/[0.06] px-3 pb-1">
            <p className="text-[11px] text-gray-500 leading-5">
              TXT, Code &amp; Images
              <br />
              Maximum file size: 5 MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function FilePreviewCard({ selectedFile, uploadingFile, onPreview, onRemove }) {
  if (!selectedFile) {
    return null;
  }

  const file = selectedFile.file;

  return (
    <div className="px-3 pt-3">
      <div
        className="
          flex
          items-center
          gap-3
          w-fit
          max-w-full
          px-3
          py-2
          rounded-xl
          bg-[#151b23]
          border
          border-white/[0.08]
        "
      >
        <div
          className="
    w-9
    h-9
    rounded-lg
    bg-blue-500/10
    text-blue-400
    flex
    items-center
    justify-center
    flex-shrink-0
  "
        >
          {file.type?.startsWith("image/") ? "🖼️" : "📄"}
        </div>

        <div className="min-w-0">
          <button
            type="button"
            onClick={onPreview}
            className="
              block
              max-w-[220px]
              truncate
              text-sm
              text-gray-200
              hover:text-blue-400
              transition
              text-left
            "
          >
            {file.name}
          </button>

          <p className="text-[10px] text-gray-600">
            {uploadingFile
              ? "Uploading..."
              : selectedFile.uploaded
                ? "Uploaded"
                : "Ready"}
          </p>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="
            w-7
            h-7
            rounded-lg
            text-gray-600
            hover:text-red-400
            hover:bg-red-500/10
            transition
          "
          title="Remove file"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default Chat;
