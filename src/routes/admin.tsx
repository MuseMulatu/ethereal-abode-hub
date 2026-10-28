import { createFileRoute } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  Edit2,
  Eye,
  FileText,
  Filter,
  Globe,
  HelpCircle,
  History,
  Image as ImageIcon,
  Key,
  Layers,
  Lock,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  RefreshCw,
  Save,
  Search,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Trash2,
  Upload,
  User,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { brand, catalogueSofas } from "@/data/site";
import {
  changeUserPassword,
  createBlogPost,
  createProduct,
  createUser,
  deleteBlogPost,
  deleteProduct,
  deleteUser,
  fetchSiteSettings,
  getAuditLogs,
  getBlogPosts,
  getCurrentUser,
  getDynamicBlogPosts,
  getInquiries,
  getProducts,
  getSiteSettings,
  getUsers,
  loginAdminUser,
  saveDynamicBlogPost,
  saveSiteSection,
  saveSiteSettings,
  setCurrentUser,
  updateBlogPost,
  updateInquiryStatus,
  updateProduct,
  updateUser,
  uploadImageFile,
  type AdminRole,
  type AdminUser,
  type AuditLogItem,
  type BackendProduct,
  type CustomerInquiry,
  type DynamicBlogPost,
  type InquiryStatus,
  type SiteSectionAbout,
  type SiteSectionHero,
  type SiteSectionMadeToOrder,
  type SiteSectionShowroom,
} from "@/lib/cms-store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal & Inquiries CMS — Anteniguss Home" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboard,
});

function ImageUploadField({
  label,
  value,
  onChange,
  placeholder = "/IMG_5171.jpg or image URL",
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadImageFile(file);
      if (res.success && res.url) {
        onChange(res.url);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded border border-input bg-background p-2.5 text-sm focus:outline-none"
        />
        <label className="cursor-pointer inline-flex items-center gap-1.5 rounded border border-border bg-stone px-3.5 py-2 text-xs font-semibold hover:bg-stone/80 transition-colors shrink-0">
          <Upload className="h-3.5 w-3.5" />
          <span>{uploading ? "Uploading..." : "Upload File"}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>
      {value && (
        <div className="mt-2 flex items-center gap-3">
          <img
            src={value}
            alt="Preview"
            className="h-12 w-16 rounded object-cover border border-border bg-stone"
            onError={(e) => ((e.target as HTMLElement).style.display = "none")}
          />
          <span className="text-[11px] text-muted-foreground truncate max-w-xs">{value}</span>
        </div>
      )}
    </div>
  );
}

function AdminLoginScreen({ onLoginSuccess }: { onLoginSuccess: (user: AdminUser) => void }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e?: React.FormEvent, customUser?: string, customPass?: string) => {
    if (e) e.preventDefault();
    const idToUse = customUser !== undefined ? customUser : identifier;
    const passToUse = customPass !== undefined ? customPass : password;

    if (!idToUse || !passToUse) {
      setError("Please enter both username and password");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await loginAdminUser(idToUse, passToUse);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setError(res.error || "Invalid username or password");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to authenticate");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (u: string, p: string) => {
    setIdentifier(u);
    setPassword(p);
    handleLogin(undefined, u, p);
  };

  return (
    <div className="min-h-screen bg-stone/20 flex items-center justify-center p-4 sm:p-6 lg:p-8 pt-32 pb-24">
      <div className="w-full max-w-md bg-background rounded-xl border border-border shadow-2xl p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background mb-2 shadow-sm">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <p className="eyebrow text-muted-foreground">Anteniguss Home Showroom CMS</p>
          <h1 className="display text-3xl text-foreground">Staff Portal Login</h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Sign in with your authorized staff credentials to manage showroom leads, product catalog,
            and SEO design journal.
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Username or Email
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin, manager, or marketing"
                className="w-full rounded border border-input bg-stone/20 py-2.5 pl-10 pr-4 text-sm focus:border-foreground focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded border border-input bg-stone/20 py-2.5 pl-10 pr-4 text-sm focus:border-foreground focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded border border-foreground bg-foreground px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-background hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Portal</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Access Pills */}
        <div className="pt-5 border-t border-border">
          <p className="eyebrow text-[10px] text-muted-foreground mb-2.5 text-center">
            One-Click Staff Sign-In (For Testing)
          </p>
          <div className="grid grid-cols-3 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickLogin("admin", "Anteniguss2026!")}
              className="rounded border border-border bg-stone/40 p-2.5 text-center hover:bg-stone transition-colors"
            >
              <span className="font-semibold block text-foreground">Super Admin</span>
              <span className="text-[10px] text-muted-foreground">All features</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("manager", "Manager2026!")}
              className="rounded border border-border bg-stone/40 p-2.5 text-center hover:bg-stone transition-colors"
            >
              <span className="font-semibold block text-foreground">Manager</span>
              <span className="text-[10px] text-muted-foreground">Store & Leads</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("marketing", "Marketing2026!")}
              className="rounded border border-border bg-stone/40 p-2.5 text-center hover:bg-stone transition-colors"
            >
              <span className="font-semibold block text-foreground">Marketing</span>
              <span className="text-[10px] text-muted-foreground">SEO Journal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminProfileModal({
  user,
  isOpen,
  onClose,
}: {
  user: AdminUser;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  if (!isOpen) return null;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    if (newPassword.length < 6) {
      setNotice({ type: "error", message: "New password must be at least 6 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setNotice({ type: "error", message: "New passwords do not match." });
      return;
    }

    setLoading(true);
    setNotice(null);
    try {
      const res = await changeUserPassword(user.id, currentPassword, newPassword);
      if (res.success) {
        setNotice({ type: "success", message: "Password updated successfully!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          setNotice(null);
          onClose();
        }, 1500);
      } else {
        setNotice({ type: "error", message: res.error || "Failed to update password." });
      }
    } catch (err: any) {
      setNotice({ type: "error", message: err?.message || "Error changing password." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-ink/70 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-lg rounded-xl bg-background p-6 sm:p-8 shadow-2xl border border-border space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <p className="eyebrow text-muted-foreground">Account Information</p>
              <h3 className="display text-2xl">Staff Profile & Credentials</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone text-muted-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="rounded-lg border border-border bg-stone/30 p-4 space-y-2.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Full Name:</span>
              <span className="font-semibold text-foreground">{user.full_name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Username:</span>
              <span className="font-mono text-foreground font-semibold">@{user.username}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Email:</span>
              <span className="text-foreground">{user.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Permission Role:</span>
              <span className="rounded bg-foreground text-background px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                {user.role.replace("_", " ")}
              </span>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <h4 className="font-semibold text-sm border-b border-border/60 pb-2">Change Password</h4>

            {notice && (
              <div
                className={`rounded p-3 text-xs flex items-center gap-2 ${
                  notice.type === "success"
                    ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-800"
                    : "border border-destructive/30 bg-destructive/10 text-destructive"
                }`}
              >
                {notice.type === "success" ? (
                  <CheckCircle className="h-4 w-4 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0" />
                )}
                <span>{notice.message}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Current Password *
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded border border-input bg-background p-2.5 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                New Password *
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded border border-input bg-background p-2.5 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded border border-input bg-background p-2.5 text-sm focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded border border-border text-xs font-semibold hover:bg-stone"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded border border-foreground bg-foreground text-xs font-semibold text-background hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function UserManagementTab({ currentUser }: { currentUser: AdminUser }) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [newRole, setNewRole] = useState<AdminRole>("STORE_MANAGER");
  const [newPassword, setNewPassword] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadUsers = () => {
    getUsers().then(setUsers);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newEmail || !newPassword) return;

    setLoading(true);
    const res = await createUser({
      username: newUsername,
      email: newEmail,
      full_name: newFullName || newUsername,
      role: newRole,
      password: newPassword,
      auth_user_name: currentUser.username,
    });
    setLoading(false);

    if (res.success) {
      setNotice(`User @${newUsername} created successfully!`);
      setShowAddModal(false);
      setNewUsername("");
      setNewEmail("");
      setNewFullName("");
      setNewPassword("");
      loadUsers();
      setTimeout(() => setNotice(null), 4000);
    } else {
      alert(res.error || "Failed to create user");
    }
  };

  const handleDelete = async (id: number, username: string) => {
    if (id === currentUser.id) {
      alert("You cannot delete your own account.");
      return;
    }
    if (!confirm(`Are you sure you want to delete staff account @${username}?`)) return;

    const res = await deleteUser(id, currentUser.username);
    if (res.success) {
      setNotice(`User @${username} deleted.`);
      loadUsers();
      setTimeout(() => setNotice(null), 4000);
    } else {
      alert(res.error || "Failed to delete user");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="display text-3xl">Staff & Roles Management</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Create and manage showroom managers, marketing editors, and staff access accounts.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded border border-foreground bg-foreground px-4 py-2.5 text-xs font-semibold text-background hover:opacity-90"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add New Staff Account</span>
        </button>
      </div>

      {notice && (
        <div className="rounded border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="rounded-lg border border-border bg-background overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone/50 border-b border-border uppercase tracking-wider text-muted-foreground font-semibold">
              <tr>
                <th className="px-6 py-3.5">Staff User</th>
                <th className="px-6 py-3.5">Email</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-stone/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-stone font-semibold text-foreground text-xs uppercase">
                        {u.full_name?.charAt(0) || u.username.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{u.full_name}</p>
                        <p className="text-[11px] text-muted-foreground">@{u.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{u.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block rounded px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                        u.role === "SUPER_ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : u.role === "STORE_MANAGER"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {u.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {u.id !== currentUser.id ? (
                      <button
                        type="button"
                        onClick={() => handleDelete(u.id, u.username)}
                        className="p-1.5 rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                        title="Delete user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : (
                      <span className="text-[11px] text-muted-foreground italic">(Current Account)</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-ink/70 backdrop-blur-xs transition-opacity"
            onClick={() => setShowAddModal(false)}
          />
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative w-full max-w-md rounded-xl bg-background p-6 shadow-2xl border border-border space-y-4">
              <h3 className="display text-2xl">Create Staff Account</h3>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    placeholder="e.g. Bethlehem Tilahun"
                    className="w-full rounded border border-input bg-background p-2.5 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={newUsername}
                    onChange={(e) =>
                      setNewUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))
                    }
                    placeholder="e.g. manager_bole"
                    className="w-full rounded border border-input bg-background p-2.5 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="name@anteniguss.com"
                    className="w-full rounded border border-input bg-background p-2.5 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Role *
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as AdminRole)}
                    className="w-full rounded border border-input bg-background p-2.5 text-sm focus:outline-none"
                  >
                    <option value="STORE_MANAGER">Store Manager (Products, Sections, Inquiries)</option>
                    <option value="MARKETING">Marketing Editor (SEO Journal & Leads)</option>
                    <option value="SUPER_ADMIN">Super Admin (Full System Control)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Initial Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full rounded border border-input bg-background p-2.5 text-sm focus:outline-none"
                  />
                </div>
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded border border-border text-xs font-semibold hover:bg-stone"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded border border-foreground bg-foreground text-xs font-semibold text-background hover:opacity-90 disabled:opacity-50"
                  >
                    {loading ? "Creating..." : "Create Account"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AuditLogsTab() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const loadLogs = async () => {
    setLoading(true);
    const data = await getAuditLogs();
    setLogs(data);
    setLoading(false);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = logs.filter((l) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (l.action || "").toLowerCase().includes(q) ||
      (l.target || "").toLowerCase().includes(q) ||
      (l.details || "").toLowerCase().includes(q) ||
      (l.user_name || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="display text-3xl">System Audit Trail</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Immutable log of major actions: product creation/updates, post publications, section updates, and staff logins.
          </p>
        </div>
        <button
          type="button"
          onClick={loadLogs}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded border border-border bg-background px-4 py-2 text-xs font-semibold hover:bg-stone"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Logs</span>
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Filter audit logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded border border-input bg-background py-2 pl-10 pr-4 text-xs focus:outline-none"
        />
      </div>

      <div className="rounded-lg border border-border bg-background overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone/50 border-b border-border uppercase tracking-wider text-muted-foreground font-semibold">
              <tr>
                <th className="px-6 py-3.5">Timestamp</th>
                <th className="px-6 py-3.5">Staff User</th>
                <th className="px-6 py-3.5">Action</th>
                <th className="px-6 py-3.5">Target</th>
                <th className="px-6 py-3.5">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-mono text-[11px]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground font-sans text-xs">
                    No audit records logged yet.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone/20 transition-colors">
                    <td className="px-6 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 font-semibold text-foreground">
                      @{log.user_name || "system"}
                      {log.user_role && (
                        <span className="ml-1 text-[10px] text-muted-foreground font-normal not-mono">
                          ({log.user_role})
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase not-mono ${
                          log.action.includes("DELETE")
                            ? "bg-destructive/10 text-destructive"
                            : log.action.includes("CREATE")
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-foreground">{log.target || "—"}</td>
                    <td className="px-6 py-3 text-muted-foreground max-w-md truncate font-sans text-xs">
                      {log.details || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [currentUser, setCurrentUserState] = useState<AdminUser | null>(() => getCurrentUser());
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "inquiries" | "sections" | "blog" | "catalog" | "users" | "audit"
  >("inquiries");

  // Inquiries State
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);
  const [inquirySearch, setInquirySearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingStaffNoteId, setEditingStaffNoteId] = useState<string | number | null>(null);
  const [tempStaffNote, setTempStaffNote] = useState("");

  // Sections State
  const [heroSettings, setHeroSettings] = useState<SiteSectionHero>({
    headline: "Furniture for the modern Ethiopian home.",
    subheadline:
      "Sofas, armchairs, dining sets and beds, made in Addis Ababa in the size and fabric you choose.",
    kicker: "አንተ፡ንጉስ · Addis Ababa",
    backgroundImage: "/IMG_5171.jpg",
  });
  const [madeToOrderSettings, setMadeToOrderSettings] = useState<SiteSectionMadeToOrder>({
    title: "Made to order. Sized for your living room.",
    description:
      "Every home in Addis Ababa is shaped differently. That is why every sofa, dining set and armchair in our atelier is made to order — in the exact dimensions your room needs, in the wood and upholstery fabric you select.",
    bullet1: "Custom dimensions to fit your living room plan",
    bullet2: "Belgian linen, bouclé, velvet, or Ethiopian leather",
    bullet3: "Solid wood frame with a 5-year structural warranty",
    bullet4: "White-glove delivery & setup anywhere in Addis Ababa",
    imageUrl: "/curved-sectional.jpg",
  });
  const [showroomSettings, setShowroomSettings] = useState<SiteSectionShowroom>({
    address: brand.address,
    openingHours: "Mon – Sat: 10:00 – 20:00 · Sunday by appointment",
    phone: brand.phone,
    email: brand.email,
    imageUrl: "/buna-guests.jpg",
  });
  const [aboutSettings, setAboutSettings] = useState<SiteSectionAbout>({
    title: "Made in Addis Ababa. Sized for your home.",
    story:
      "Anteniguss Home was established with a singular focus: to build enduring furniture crafted for contemporary Ethiopian life. We combine local hardwood carpentry with imported, high-grade linen, bouclé, and velvet upholstery.",
    atelierImage: "/about-atelier.jpg",
  });
  const [sectionSaveNotice, setSectionSaveNotice] = useState<string | null>(null);

  // Blog / SEO State
  const [posts, setPosts] = useState<DynamicBlogPost[]>([]);
  const [editingPostId, setEditingPostId] = useState<string | number | null>(null);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogSlug, setBlogSlug] = useState("");
  const [blogCategory, setBlogCategory] = useState("Interiors");
  const [blogExcerpt, setBlogExcerpt] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogCoverImage, setBlogCoverImage] = useState("/journal-feature.jpg");
  const [targetKeyword, setTargetKeyword] = useState("custom sofas Addis Ababa");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("mobile");
  const [blogSaveNotice, setBlogSaveNotice] = useState<string | null>(null);

  // Products Management State
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | string | null>(null);
  const [prodTitle, setProdTitle] = useState("");
  const [prodAmharic, setProdAmharic] = useState("");
  const [prodCategory, setProdCategory] = useState("sofas");
  const [prodCapacity, setProdCapacity] = useState("5-seater");
  const [prodDimensions, setProdDimensions] = useState("");
  const [prodDescription, setProdDescription] = useState("");
  const [prodPriceDisplay, setProdPriceDisplay] = useState("Ask for price");
  const [prodImageUrl, setProdImageUrl] = useState("/curved-boucle-sofa.jpg");
  const [prodIsFeatured, setProdIsFeatured] = useState(false);
  const [prodIsTopPick, setProdIsTopPick] = useState(false);
  const [prodWoodOptions, setProdWoodOptions] = useState(
    "Solid Ethiopian Wanza, Stained Ash, Natural Teak, Dark Walnut",
  );
  const [prodFabricOptions, setProdFabricOptions] = useState(
    "Belgian Linen, Bouclé Warm Ivory, Olive Textured Chenille, Addis Camel Leather",
  );
  const [productNotice, setProductNotice] = useState<string | null>(null);

  // Allowed tabs per role
  const allowedTabs = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === "SUPER_ADMIN") {
      return ["inquiries", "sections", "catalog", "blog", "users", "audit"];
    }
    if (currentUser.role === "STORE_MANAGER") {
      return ["inquiries", "sections", "catalog", "audit"];
    }
    return ["blog", "inquiries"];
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && allowedTabs.length > 0 && !allowedTabs.includes(activeTab)) {
      setActiveTab(allowedTabs[0] as any);
    }
  }, [currentUser, allowedTabs, activeTab]);

  const refreshProducts = () => {
    getProducts({ include_archived: true }).then((list) => {
      if (list && list.length > 0) setProducts(list);
    });
  };

  const refreshPosts = () => {
    getBlogPosts().then((savedPosts) => {
      if (savedPosts && savedPosts.length > 0) setPosts(savedPosts);
    });
  };

  // Load Inquiries, Settings, Products & Posts
  useEffect(() => {
    getInquiries().then((data) => setInquiries(data));
    refreshProducts();
    refreshPosts();

    const savedSettings = getSiteSettings();
    if (savedSettings.hero) setHeroSettings(savedSettings.hero);
    if (savedSettings.made_to_order || (savedSettings as any).madeToOrder) {
      setMadeToOrderSettings(
        (savedSettings.made_to_order || (savedSettings as any).madeToOrder)!,
      );
    }
    if (savedSettings.showroom) setShowroomSettings(savedSettings.showroom);
    if (savedSettings.about_page || (savedSettings as any).aboutPage) {
      setAboutSettings((savedSettings.about_page || (savedSettings as any).aboutPage)!);
    }

    fetchSiteSettings().then((remoteSettings) => {
      if (remoteSettings) {
        if (remoteSettings.hero) setHeroSettings(remoteSettings.hero);
        if (remoteSettings.made_to_order || (remoteSettings as any).madeToOrder) {
          setMadeToOrderSettings(
            (remoteSettings.made_to_order || (remoteSettings as any).madeToOrder)!,
          );
        }
        if (remoteSettings.showroom) setShowroomSettings(remoteSettings.showroom);
        if (remoteSettings.about_page || (remoteSettings as any).aboutPage) {
          setAboutSettings((remoteSettings.about_page || (remoteSettings as any).aboutPage)!);
        }
      }
    });
  }, []);

  // Update Inquiries
  const handleStatusChange = async (id: string | number, newStatus: InquiryStatus) => {
    await updateInquiryStatus(id, newStatus);
    const updated = await getInquiries();
    setInquiries(updated);
  };

  const handleSaveStaffNote = async (id: string | number) => {
    await updateInquiryStatus(
      id,
      inquiries.find((i) => i.id === id)?.status || "new_lead",
      tempStaffNote,
    );
    setEditingStaffNoteId(null);
    const updated = await getInquiries();
    setInquiries(updated);
  };

  // Save Sections
  const handleSaveSections = async () => {
    await saveSiteSection("hero", heroSettings, currentUser?.username, currentUser?.role);
    await saveSiteSection(
      "made_to_order",
      madeToOrderSettings,
      currentUser?.username,
      currentUser?.role,
    );
    await saveSiteSection("showroom", showroomSettings, currentUser?.username, currentUser?.role);
    await saveSiteSection("about_page", aboutSettings, currentUser?.username, currentUser?.role);
    setSectionSaveNotice("Site sections updated successfully!");
    setTimeout(() => setSectionSaveNotice(null), 4000);
  };

  // Product CRUD Handlers
  const handleOpenNewProduct = () => {
    setEditingProductId(null);
    setProdTitle("");
    setProdAmharic("");
    setProdCategory("sofas");
    setProdCapacity("5-seater");
    setProdDimensions("");
    setProdDescription("");
    setProdPriceDisplay("Ask for price");
    setProdImageUrl("/curved-boucle-sofa.jpg");
    setProdIsFeatured(false);
    setProdIsTopPick(false);
    setProdWoodOptions("Solid Ethiopian Wanza, Stained Ash, Natural Teak, Dark Walnut");
    setProdFabricOptions(
      "Belgian Linen, Bouclé Warm Ivory, Olive Textured Chenille, Addis Camel Leather",
    );
    setShowProductModal(true);
  };

  const handleEditProduct = (p: BackendProduct) => {
    setEditingProductId(p.id);
    setProdTitle(p.title);
    setProdAmharic(p.amharic_name || "");
    setProdCategory(p.category);
    setProdCapacity(p.seating_capacity || "");
    setProdDimensions(p.dimensions || "");
    setProdDescription(p.description || "");
    setProdPriceDisplay(p.price_display);
    setProdImageUrl(p.image_url);
    setProdIsFeatured(p.is_featured);
    setProdIsTopPick(p.is_top_pick);
    setProdWoodOptions(
      Array.isArray(p.wood_options) && p.wood_options.length > 0
        ? p.wood_options.join(", ")
        : "Solid Ethiopian Wanza, Stained Ash, Natural Teak, Dark Walnut",
    );
    setProdFabricOptions(
      Array.isArray(p.fabric_options) && p.fabric_options.length > 0
        ? p.fabric_options.join(", ")
        : "Belgian Linen, Bouclé Warm Ivory, Olive Textured Chenille, Addis Camel Leather",
    );
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle || !prodImageUrl) return;

    const woods = prodWoodOptions
      .split(",")
      .map((w) => w.trim())
      .filter(Boolean);
    const fabrics = prodFabricOptions
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);
    const computedDetail = prodDimensions
      ? `${prodCapacity || "Custom"} · ${prodDimensions}`
      : prodCapacity || "Made to Order";

    if (editingProductId) {
      await updateProduct(editingProductId, {
        title: prodTitle,
        amharic_name: prodAmharic || null,
        category: prodCategory,
        seating_capacity: prodCapacity || null,
        dimensions: prodDimensions || null,
        description: prodDescription || null,
        detail: computedDetail,
        price_display: prodPriceDisplay,
        image_url: prodImageUrl,
        is_featured: prodIsFeatured,
        is_top_pick: prodIsTopPick,
        wood_options: woods,
        fabric_options: fabrics,
        auth_user_name: currentUser?.username,
        auth_user_role: currentUser?.role,
      });
      setProductNotice(`Updated "${prodTitle}" successfully!`);
    } else {
      await createProduct({
        title: prodTitle,
        slug: prodTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        amharic_name: prodAmharic || null,
        category: prodCategory,
        seating_capacity: prodCapacity || null,
        dimensions: prodDimensions || null,
        description: prodDescription || null,
        detail: computedDetail,
        price_display: prodPriceDisplay,
        image_url: prodImageUrl,
        is_featured: prodIsFeatured,
        is_top_pick: prodIsTopPick,
        wood_options: woods,
        fabric_options: fabrics,
        sort_order: products.length + 1,
        auth_user_name: currentUser?.username,
        auth_user_role: currentUser?.role,
      });
      setProductNotice(`Created "${prodTitle}" in catalog!`);
    }

    setShowProductModal(false);
    refreshProducts();
    setTimeout(() => setProductNotice(null), 4000);
  };

  const handleDeleteProduct = async (id: number | string) => {
    if (!confirm("Are you sure you want to remove this product from the catalog?")) return;
    await deleteProduct(id, false, currentUser?.username, currentUser?.role);
    refreshProducts();
  };

  const handleToggleTopPick = async (id: number | string, current: boolean) => {
    await updateProduct(id, {
      is_top_pick: !current,
      auth_user_name: currentUser?.username,
      auth_user_role: currentUser?.role,
    });
    refreshProducts();
  };

  const handleToggleFeatured = async (id: number | string, current: boolean) => {
    await updateProduct(id, {
      is_featured: !current,
      auth_user_name: currentUser?.username,
      auth_user_role: currentUser?.role,
    });
    refreshProducts();
  };

  // Blog / Journal Full CRUD Handlers
  const handleEditBlogPost = (post: DynamicBlogPost) => {
    setEditingPostId(post.id || post.slug);
    setBlogTitle(post.title);
    setBlogSlug(post.slug);
    setBlogCategory(post.category);
    setBlogExcerpt(post.excerpt || "");
    setBlogContent(post.content);
    setBlogCoverImage(post.cover_image_url || "/journal-feature.jpg");
    setTargetKeyword(post.target_keyword || "");
    setMetaTitle(post.meta_title || "");
    setMetaDescription(post.meta_description || "");
  };

  const handleCancelEditPost = () => {
    setEditingPostId(null);
    setBlogTitle("");
    setBlogSlug("");
    setBlogExcerpt("");
    setBlogContent("");
    setMetaTitle("");
    setMetaDescription("");
  };

  const handleDeleteBlogPost = async (idOrSlug: string | number) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    await deleteBlogPost(idOrSlug, currentUser?.username, currentUser?.role);
    refreshPosts();
    if (editingPostId === idOrSlug) {
      handleCancelEditPost();
    }
  };

  const handleSaveBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogContent) return;

    const postPayload: DynamicBlogPost = {
      title: blogTitle,
      slug:
        blogSlug ||
        blogTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      category: blogCategory,
      excerpt: blogExcerpt,
      content: blogContent,
      cover_image_url: blogCoverImage,
      status: "published",
      target_keyword: targetKeyword,
      meta_title: metaTitle || `${blogTitle} — Anteniguss Home`,
      meta_description: metaDescription || blogExcerpt,
      auth_user_name: currentUser?.username,
      auth_user_role: currentUser?.role,
    };

    if (editingPostId) {
      await updateBlogPost(editingPostId, postPayload);
      setBlogSaveNotice(`Article "${postPayload.title}" updated successfully!`);
    } else {
      await createBlogPost(postPayload);
      setBlogSaveNotice(`Article "${postPayload.title}" published and SEO indexed!`);
    }

    refreshPosts();
    setTimeout(() => setBlogSaveNotice(null), 4000);
    handleCancelEditPost();
  };

  // SEO Real-time checks
  const seoCheckTitle =
    targetKeyword.trim() !== "" &&
    (metaTitle || blogTitle).toLowerCase().includes(targetKeyword.toLowerCase());
  const seoCheckDesc =
    (metaDescription || blogExcerpt).length >= 80 && (metaDescription || blogExcerpt).length <= 160;
  const seoCheckContent =
    targetKeyword.trim() !== "" && blogContent.toLowerCase().includes(targetKeyword.toLowerCase());

  // Filtered Inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    if (statusFilter !== "all" && inq.status !== statusFilter) return false;
    if (inquirySearch.trim()) {
      const q = inquirySearch.toLowerCase();
      const matchName = inq.customer_name.toLowerCase().includes(q);
      const matchPhone = inq.customer_phone.toLowerCase().includes(q);
      const matchNum = inq.inquiry_number.toLowerCase().includes(q);
      const matchArea = (inq.subcity_area || "").toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchNum && !matchArea) return false;
    }
    return true;
  });

  if (!currentUser) {
    return (
      <AdminLoginScreen
        onLoginSuccess={(u) => {
          setCurrentUser(u);
          setCurrentUserState(u);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone/20 pt-28 pb-20">
      {/* Top Banner / Authenticated Staff Header */}
      <header className="border-b border-border bg-background shadow-xs">
        <div className="mx-auto max-w-[110rem] px-6 py-4 sm:px-10 lg:px-16 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="eyebrow text-muted-foreground">Anteniguss Home Showroom CMS</p>
            </div>
            <h1 className="display text-2xl">Management & Leads Portal</h1>
          </div>

          {/* Authenticated Staff Pill & Account Actions */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 rounded-lg border border-border bg-stone/30 px-3.5 py-1.5 text-xs">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background font-bold text-[11px] uppercase">
                {currentUser.full_name?.charAt(0) || currentUser.username.charAt(0)}
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground leading-tight">{currentUser.full_name}</p>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">
                  {currentUser.role.replace("_", " ")}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowProfileModal(true)}
              className="inline-flex items-center gap-1.5 rounded border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-stone transition-colors"
              title="Staff Profile & Change Password"
            >
              <Key className="h-3.5 w-3.5" />
              <span>Profile</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentUser(null);
                setCurrentUserState(null);
              }}
              className="inline-flex items-center gap-1.5 rounded border border-border bg-stone/40 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation (Role Filtered) */}
        <div className="mx-auto max-w-[110rem] px-6 sm:px-10 lg:px-16 flex items-center gap-8 overflow-x-auto border-t border-border/50 text-sm">
          {allowedTabs.includes("inquiries") && (
            <button
              onClick={() => setActiveTab("inquiries")}
              className={`py-3.5 border-b-2 font-medium transition-colors flex items-center gap-2 shrink-0 ${
                activeTab === "inquiries"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Customer Inquiries & Leads</span>
              <span className="rounded-full bg-foreground text-background px-2 py-0.5 text-xs">
                {inquiries.length}
              </span>
            </button>
          )}

          {allowedTabs.includes("sections") && (
            <button
              onClick={() => setActiveTab("sections")}
              className={`py-3.5 border-b-2 font-medium transition-colors flex items-center gap-2 shrink-0 ${
                activeTab === "sections"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <ImageIcon className="h-4 w-4" />
              <span>Section & Photo Swapper</span>
            </button>
          )}

          {allowedTabs.includes("catalog") && (
            <button
              onClick={() => setActiveTab("catalog")}
              className={`py-3.5 border-b-2 font-medium transition-colors flex items-center gap-2 shrink-0 ${
                activeTab === "catalog"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>Catalog & Product Manager</span>
            </button>
          )}

          {allowedTabs.includes("blog") && (
            <button
              onClick={() => setActiveTab("blog")}
              className={`py-3.5 border-b-2 font-medium transition-colors flex items-center gap-2 shrink-0 ${
                activeTab === "blog"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Globe className="h-4 w-4" />
              <span>SEO Design Journal</span>
            </button>
          )}

          {allowedTabs.includes("users") && (
            <button
              onClick={() => setActiveTab("users")}
              className={`py-3.5 border-b-2 font-medium transition-colors flex items-center gap-2 shrink-0 ${
                activeTab === "users"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <UserCheck className="h-4 w-4" />
              <span>Staff & Roles</span>
            </button>
          )}

          {allowedTabs.includes("audit") && (
            <button
              onClick={() => setActiveTab("audit")}
              className={`py-3.5 border-b-2 font-medium transition-colors flex items-center gap-2 shrink-0 ${
                activeTab === "audit"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <History className="h-4 w-4" />
              <span>System Audit Trail</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-[110rem] px-6 py-8 sm:px-10 lg:px-16">
        {/* ================================================================= */}
        {/* TAB 1: CUSTOMER INQUIRIES & LEADS                                 */}
        {/* ================================================================= */}
        {activeTab === "inquiries" && (
          <div className="space-y-6">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-lg border border-border bg-background p-5">
                <span className="eyebrow text-muted-foreground">Total Inquiries</span>
                <p className="display mt-2 text-3xl">{inquiries.length}</p>
                <p className="mt-1 text-xs text-muted-foreground">Bespoke furniture interest</p>
              </div>

              <div className="rounded-lg border border-border bg-background p-5">
                <span className="eyebrow text-amber-600">New Leads</span>
                <p className="display mt-2 text-3xl">
                  {inquiries.filter((i) => i.status === "new_lead").length}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Needs concierge contact</p>
              </div>

              <div className="rounded-lg border border-border bg-background p-5">
                <span className="eyebrow text-blue-600">Showroom Booked</span>
                <p className="display mt-2 text-3xl">
                  {inquiries.filter((i) => i.status === "showroom_booked").length}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Abkem Tower consultation</p>
              </div>

              <div className="rounded-lg border border-border bg-background p-5">
                <span className="eyebrow text-emerald-600">In Production / Closed</span>
                <p className="display mt-2 text-3xl">
                  {
                    inquiries.filter((i) => i.status === "in_production" || i.status === "closed")
                      .length
                  }
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Workshop carpentry</p>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-border bg-background p-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search customer name, phone, or reference..."
                  value={inquirySearch}
                  onChange={(e) => setInquirySearch(e.target.value)}
                  className="w-full rounded border border-input bg-stone/30 py-2 pl-10 pr-4 text-sm focus:border-foreground focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded border border-input bg-stone/30 py-1.5 px-2.5 text-xs focus:outline-none"
                >
                  <option value="all">All Statuses ({inquiries.length})</option>
                  <option value="new_lead">New Lead</option>
                  <option value="contacted">Contacted</option>
                  <option value="showroom_booked">Showroom Booked</option>
                  <option value="in_production">In Production</option>
                  <option value="closed">Closed / Delivered</option>
                </select>
              </div>
            </div>

            {/* Inquiries List */}
            {filteredInquiries.length === 0 ? (
              <div className="rounded-lg border border-border bg-background p-12 text-center text-muted-foreground">
                No customer inquiries found.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="rounded-lg border border-border bg-background p-6 shadow-xs transition-shadow hover:shadow-md"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 border-b border-border/60 pb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-foreground">
                            {inq.inquiry_number}
                          </span>
                          <span
                            className={`rounded px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                              inq.status === "new_lead"
                                ? "bg-amber-100 text-amber-800"
                                : inq.status === "showroom_booked"
                                  ? "bg-blue-100 text-blue-800"
                                  : inq.status === "in_production"
                                    ? "bg-purple-100 text-purple-800"
                                    : inq.status === "closed"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-stone text-foreground"
                            }`}
                          >
                            {inq.status.replace("_", " ")}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(inq.created_at).toLocaleDateString()} at{" "}
                            {new Date(inq.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <h3 className="display mt-2 text-2xl text-foreground">
                          {inq.customer_name}
                        </h3>
                        {inq.subcity_area && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {inq.subcity_area}
                          </p>
                        )}
                      </div>

                      {/* Action buttons (Call / WhatsApp / Status) */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        <a
                          href={`tel:${inq.customer_phone.replace(/\s/g, "")}`}
                          className="inline-flex items-center gap-1.5 rounded border border-border bg-stone/40 px-3 py-2 text-xs font-semibold text-foreground hover:bg-stone"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          <span>{inq.customer_phone}</span>
                        </a>

                        <a
                          href={`https://wa.me/${inq.customer_phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `Hello ${inq.customer_name}, thank you for contacting Anteniguss Home regarding your inquiry ${inq.inquiry_number}. We would love to discuss your custom furniture specifications!`,
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded border border-emerald-600 bg-emerald-600/10 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-600 hover:text-white transition-colors"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>Chat WhatsApp</span>
                        </a>

                        {/* Status Select */}
                        <select
                          value={inq.status}
                          onChange={(e) =>
                            handleStatusChange(inq.id, e.target.value as InquiryStatus)
                          }
                          className="rounded border border-input bg-background py-2 px-3 text-xs font-semibold focus:outline-none"
                        >
                          <option value="new_lead">New Lead</option>
                          <option value="contacted">Contacted</option>
                          <option value="showroom_booked">Showroom Booked</option>
                          <option value="in_production">In Production</option>
                          <option value="closed">Closed / Delivered</option>
                        </select>
                      </div>
                    </div>

                    {/* Pieces Requested */}
                    <div className="mt-4">
                      <p className="eyebrow text-muted-foreground">Furniture Pieces Requested</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {inq.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="rounded border border-border bg-stone/40 px-3 py-2 text-xs"
                          >
                            <span className="font-semibold text-foreground">
                              {item.product_name}
                            </span>
                            <span className="text-muted-foreground"> (x{item.quantity})</span>
                            {(item.selected_fabric || item.selected_wood) && (
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                {item.selected_fabric} · {item.selected_wood}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Customer Notes */}
                    {inq.customer_notes && (
                      <div className="mt-4 rounded bg-stone/30 p-3 text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground block mb-0.5">
                          Customer Request:
                        </span>
                        {inq.customer_notes}
                      </div>
                    )}

                    {/* Staff Notes */}
                    <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
                      {editingStaffNoteId === inq.id ? (
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Add consultation notes..."
                            value={tempStaffNote}
                            onChange={(e) => setTempStaffNote(e.target.value)}
                            className="flex-1 rounded border border-input bg-background px-3 py-1.5 text-xs focus:outline-none"
                          />
                          <button
                            onClick={() => handleSaveStaffNote(inq.id)}
                            className="rounded bg-foreground text-background px-3 py-1.5 font-semibold text-xs"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingStaffNoteId(null)}
                            className="text-xs text-muted-foreground hover:underline"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          <span className="text-muted-foreground">
                            <span className="font-semibold">Showroom Staff Note:</span>{" "}
                            {inq.staff_notes || "None"}
                          </span>
                          <button
                            onClick={() => {
                              setEditingStaffNoteId(inq.id);
                              setTempStaffNote(inq.staff_notes || "");
                            }}
                            className="text-xs font-medium text-foreground underline hover:opacity-75"
                          >
                            {inq.staff_notes ? "Edit Note" : "+ Add Note"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: SECTION & PHOTO SWAPPER (Prevents Client Nagging)         */}
        {/* ================================================================= */}
        {activeTab === "sections" && (
          <div className="max-w-4xl space-y-8">
            <div>
              <h2 className="display text-3xl">Page Content & Photo Swapper</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Edit headlines, subheadings, and swap section imagery across the website without
                touching code.
              </p>
            </div>

            {sectionSaveNotice && (
              <div className="rounded border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-800 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                {sectionSaveNotice}
              </div>
            )}

            {/* 1. Hero Banner Section */}
            <div className="rounded-lg border border-border bg-background p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <ImageIcon className="h-5 w-5 text-foreground" />
                <h3 className="display text-xl">Homepage Hero Banner</h3>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Headline
                </label>
                <input
                  type="text"
                  value={heroSettings.headline}
                  onChange={(e) => setHeroSettings({ ...heroSettings, headline: e.target.value })}
                  className="w-full rounded border border-input bg-background p-2.5 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Subheadline
                </label>
                <textarea
                  rows={2}
                  value={heroSettings.subheadline}
                  onChange={(e) =>
                    setHeroSettings({ ...heroSettings, subheadline: e.target.value })
                  }
                  className="w-full rounded border border-input bg-background p-2.5 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Amharic Kicker
                </label>
                <input
                  type="text"
                  value={heroSettings.kicker}
                  onChange={(e) => setHeroSettings({ ...heroSettings, kicker: e.target.value })}
                  className="w-full rounded border border-input bg-background p-2.5 text-sm focus:outline-none"
                />
              </div>

              <ImageUploadField
                label="Hero Background Image"
                value={heroSettings.backgroundImage}
                onChange={(url) => setHeroSettings({ ...heroSettings, backgroundImage: url })}
                placeholder="/IMG_5171.jpg or image URL"
              />
            </div>

            {/* 2. Made to Order Promo Section */}
            <div className="rounded-lg border border-border bg-background p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <Sparkles className="h-5 w-5 text-foreground" />
                <h3 className="display text-xl">Made-To-Order Promo Section</h3>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Promo Title
                </label>
                <input
                  type="text"
                  value={madeToOrderSettings.title}
                  onChange={(e) =>
                    setMadeToOrderSettings({ ...madeToOrderSettings, title: e.target.value })
                  }
                  className="w-full rounded border border-input bg-background p-2.5 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Promo Description
                </label>
                <textarea
                  rows={3}
                  value={madeToOrderSettings.description}
                  onChange={(e) =>
                    setMadeToOrderSettings({ ...madeToOrderSettings, description: e.target.value })
                  }
                  className="w-full rounded border border-input bg-background p-2.5 text-sm focus:outline-none"
                />
              </div>

              <ImageUploadField
                label="Promo Image"
                value={madeToOrderSettings.imageUrl}
                onChange={(url) =>
                  setMadeToOrderSettings({ ...madeToOrderSettings, imageUrl: url })
                }
                placeholder="/curved-sectional.jpg or image URL"
              />
            </div>

            {/* 3. Showroom Section */}
            <div className="rounded-lg border border-border bg-background p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <MapPin className="h-5 w-5 text-foreground" />
                <h3 className="display text-xl">Showroom Info & Hours</h3>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Showroom Address
                </label>
                <input
                  type="text"
                  value={showroomSettings.address}
                  onChange={(e) =>
                    setShowroomSettings({ ...showroomSettings, address: e.target.value })
                  }
                  className="w-full rounded border border-input bg-background p-2.5 text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={showroomSettings.phone}
                    onChange={(e) =>
                      setShowroomSettings({ ...showroomSettings, phone: e.target.value })
                    }
                    className="w-full rounded border border-input bg-background p-2.5 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={showroomSettings.email}
                    onChange={(e) =>
                      setShowroomSettings({ ...showroomSettings, email: e.target.value })
                    }
                    className="w-full rounded border border-input bg-background p-2.5 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <ImageUploadField
                label="Showroom Photo"
                value={showroomSettings.imageUrl}
                onChange={(url) => setShowroomSettings({ ...showroomSettings, imageUrl: url })}
                placeholder="/buna-guests.jpg or image URL"
              />
            </div>

            {/* 4. About Page Section */}
            <div className="rounded-lg border border-border bg-background p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <FileText className="h-5 w-5 text-foreground" />
                <h3 className="display text-xl">About Page Story & Workshop</h3>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  About Headline
                </label>
                <input
                  type="text"
                  value={aboutSettings.title || ""}
                  onChange={(e) =>
                    setAboutSettings({ ...aboutSettings, title: e.target.value })
                  }
                  className="w-full rounded border border-input bg-background p-2.5 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Atelier Story & Philosophy
                </label>
                <textarea
                  rows={4}
                  value={aboutSettings.story || ""}
                  onChange={(e) =>
                    setAboutSettings({ ...aboutSettings, story: e.target.value })
                  }
                  className="w-full rounded border border-input bg-background p-2.5 text-sm focus:outline-none"
                />
              </div>

              <ImageUploadField
                label="Atelier / Workshop Photo"
                value={aboutSettings.atelierImage || "/about-atelier.jpg"}
                onChange={(url) =>
                  setAboutSettings({ ...aboutSettings, atelierImage: url })
                }
                placeholder="/about-atelier.jpg or image URL"
              />
            </div>

            <button
              type="button"
              onClick={handleSaveSections}
              className="inline-flex items-center gap-2 rounded border border-foreground bg-foreground px-6 py-3.5 text-sm font-semibold text-background hover:opacity-90 transition-opacity"
            >
              <Save className="h-4 w-4" />
              Save Section Changes
            </button>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: SEO DESIGN JOURNAL (Google Organic Growth Engine)          */}
        {/* ================================================================= */}
        {activeTab === "blog" && (
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Editor Column */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h2 className="display text-3xl">Publish SEO Article</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Draft keyword-optimized articles that rank organically on Google search.
                </p>
              </div>

              {blogSaveNotice && (
                <div className="rounded border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-800 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  {blogSaveNotice}
                </div>
              )}

              <form onSubmit={handleSaveBlogPost} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. How to Choose the Perfect Custom Sofa in Addis Ababa"
                    value={blogTitle}
                    onChange={(e) => {
                      setBlogTitle(e.target.value);
                      if (!metaTitle) setMetaTitle(`${e.target.value} — Anteniguss Home`);
                    }}
                    className="w-full rounded border border-input bg-background p-2.5 text-sm focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      placeholder="custom-sofa-addis-ababa"
                      value={blogSlug}
                      onChange={(e) => setBlogSlug(e.target.value)}
                      className="w-full rounded border border-input bg-background p-2.5 text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Category
                    </label>
                    <select
                      value={blogCategory}
                      onChange={(e) => setBlogCategory(e.target.value)}
                      className="w-full rounded border border-input bg-background p-2.5 text-sm focus:outline-none"
                    >
                      <option value="Interiors">Interiors & Living</option>
                      <option value="Craftsmanship">Woodworking & Craft</option>
                      <option value="Showroom">Showroom Stories</option>
                      <option value="Materials">Fabrics & Leather</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Article Excerpt (Short Summary)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="A brief 1-2 sentence teaser for Google search and blog grid..."
                    value={blogExcerpt}
                    onChange={(e) => {
                      setBlogExcerpt(e.target.value);
                      if (!metaDescription) setMetaDescription(e.target.value);
                    }}
                    className="w-full rounded border border-input bg-background p-2.5 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Article Body (Markdown / Text) *
                  </label>
                  <textarea
                    rows={8}
                    required
                    placeholder="Write your article essay here. Include headings, craft details, and showroom tips..."
                    value={blogContent}
                    onChange={(e) => setBlogContent(e.target.value)}
                    className="w-full rounded border border-input bg-background p-2.5 text-sm font-mono text-xs focus:outline-none"
                  />
                </div>

                <ImageUploadField
                  label="Cover Image"
                  value={blogCoverImage}
                  onChange={(url) => setBlogCoverImage(url)}
                  placeholder="/journal-feature.jpg or image URL"
                />

                {/* SEO Metadata Box */}
                <div className="rounded border border-border bg-stone/30 p-5 space-y-4">
                  <p className="eyebrow text-muted-foreground flex items-center gap-1.5">
                    <Globe className="h-4 w-4" />
                    Google Search Engine Settings
                  </p>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Target Focus Keyword / Search Phrase
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. custom sofas Addis Ababa"
                      value={targetKeyword}
                      onChange={(e) => setTargetKeyword(e.target.value)}
                      className="w-full rounded border border-input bg-background p-2 text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Meta Title (Google Headline)
                      </label>
                      <span
                        className={`text-xs ${
                          metaTitle.length > 60
                            ? "text-amber-600 font-bold"
                            : "text-muted-foreground"
                        }`}
                      >
                        {metaTitle.length}/60 chars
                      </span>
                    </div>
                    <input
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      className="w-full rounded border border-input bg-background p-2 text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Meta Description (Google Snippet)
                      </label>
                      <span
                        className={`text-xs ${
                          metaDescription.length < 120 || metaDescription.length > 160
                            ? "text-amber-600 font-medium"
                            : "text-emerald-600 font-semibold"
                        }`}
                      >
                        {metaDescription.length}/160 chars
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      className="w-full rounded border border-input bg-background p-2 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded border border-foreground bg-foreground px-6 py-3.5 text-sm font-semibold text-background hover:opacity-90 transition-opacity"
                  >
                    <Globe className="h-4 w-4" />
                    {editingPostId ? "Update & Save Article" : "Publish & Index on Google"}
                  </button>
                  {editingPostId && (
                    <button
                      type="button"
                      onClick={handleCancelEditPost}
                      className="rounded border border-border bg-stone px-4 py-3.5 text-sm font-medium hover:bg-stone/80"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Live Google Snippet Preview & SEO Audit Column */}
            <div className="lg:col-span-5 space-y-6">
              {/* Google SERP Simulator */}
              <div className="rounded-lg border border-border bg-background p-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Google Search Result Preview
                    </span>
                  </div>
                  <div className="flex items-center gap-1 rounded bg-stone p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setPreviewDevice("mobile")}
                      className={`px-2 py-0.5 rounded text-[11px] ${
                        previewDevice === "mobile"
                          ? "bg-background text-foreground font-semibold shadow-xs"
                          : "text-muted-foreground"
                      }`}
                    >
                      <Smartphone className="h-3 w-3 inline mr-1" /> Mobile
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewDevice("desktop")}
                      className={`px-2 py-0.5 rounded text-[11px] ${
                        previewDevice === "desktop"
                          ? "bg-background text-foreground font-semibold shadow-xs"
                          : "text-muted-foreground"
                      }`}
                    >
                      Desktop
                    </button>
                  </div>
                </div>

                {/* Google Card Simulation */}
                <div className="mt-4 rounded border border-border/80 bg-white p-4 font-sans text-left shadow-xs">
                  <div className="flex items-center gap-2 text-xs text-[#202124]">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-stone text-[9px] font-bold">
                      A
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[12px] text-[#202124] leading-tight font-medium">
                        Anteniguss Home
                      </span>
                      <span className="text-[11px] text-[#4d5156] leading-tight">
                        https://anteniguss.com › blog › {blogSlug || "custom-sofas-addis-ababa"}
                      </span>
                    </div>
                  </div>

                  <h4 className="mt-1.5 text-base font-normal text-[#1a0dab] hover:underline cursor-pointer line-clamp-1">
                    {metaTitle || blogTitle || "The Design Journal — Anteniguss Home Addis Ababa"}
                  </h4>

                  <p className="mt-1 text-xs leading-relaxed text-[#4d5156] line-clamp-2">
                    {metaDescription ||
                      blogExcerpt ||
                      "Explore made-to-order sofas, handcrafted dining sets and Ethiopian artisanal woodwork from the Anteniguss Home showroom at Abkem Tower."}
                  </p>
                </div>
              </div>

              {/* SEO Checklist */}
              <div className="rounded-lg border border-border bg-background p-6">
                <span className="eyebrow text-muted-foreground">SEO Health Checklist</span>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2.5 text-xs">
                    {seoCheckTitle ? (
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <HelpCircle className="h-4 w-4 text-amber-500" />
                    )}
                    <span className={seoCheckTitle ? "text-foreground" : "text-muted-foreground"}>
                      Target keyword included in title
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 text-xs">
                    {seoCheckDesc ? (
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <HelpCircle className="h-4 w-4 text-amber-500" />
                    )}
                    <span className={seoCheckDesc ? "text-foreground" : "text-muted-foreground"}>
                      Meta description optimal length (120–160 chars)
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 text-xs">
                    {seoCheckContent ? (
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <HelpCircle className="h-4 w-4 text-amber-500" />
                    )}
                    <span className={seoCheckContent ? "text-foreground" : "text-muted-foreground"}>
                      Target keyword present in body text
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 text-xs">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span className="text-foreground">
                      Automated JSON-LD Schema.org Article generated
                    </span>
                  </div>
                </div>
              </div>

              {/* Published Posts List */}
              {posts.length > 0 && (
                <div className="rounded-lg border border-border bg-background p-6">
                  <div className="flex items-center justify-between border-b border-border pb-2.5">
                    <span className="eyebrow text-muted-foreground">
                      Published Articles ({posts.length})
                    </span>
                    <a
                      href="/blog"
                      target="_blank"
                      className="text-xs font-semibold text-foreground underline hover:opacity-80"
                    >
                      View Live Journal →
                    </a>
                  </div>
                  <div className="mt-3 space-y-2">
                    {posts.map((p, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded border border-border/60 bg-stone/30 p-2.5 text-xs gap-2"
                      >
                        <div className="truncate flex-1">
                          <p className="font-semibold text-foreground truncate">{p.title}</p>
                          <p className="text-[11px] text-muted-foreground">/{p.slug}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleEditBlogPost(p)}
                            className="p-1.5 rounded hover:bg-stone text-muted-foreground hover:text-foreground"
                            title="Edit Article"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBlogPost(p.id || p.slug)}
                            className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                            title="Delete Article"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-semibold uppercase">
                            Live
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: LOOK BOOK 2026 CATALOG MODELS & PRODUCT CRUD               */}
        {/* ================================================================= */}
        {activeTab === "catalog" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="display text-3xl">Catalog & Product Manager</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Create, edit, and organize products. Changes update both the `/shop` catalog and
                  homepage.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenNewProduct}
                  className="inline-flex items-center gap-1.5 rounded border border-foreground bg-foreground px-4 py-2 text-xs font-semibold text-background hover:opacity-90 transition-opacity"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Product</span>
                </button>
                <a
                  href="/shop"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 rounded border border-border bg-background px-4 py-2 text-xs font-semibold hover:bg-stone"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>View Public Catalog</span>
                </a>
              </div>
            </div>

            {productNotice && (
              <div className="rounded border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-800 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                {productNotice}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-lg border bg-background overflow-hidden p-4 flex flex-col justify-between transition-shadow hover:shadow-md ${
                    item.is_archived ? "opacity-50 border-dashed border-border" : "border-border"
                  }`}
                >
                  <div className="flex gap-4">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-24 w-24 rounded object-cover bg-stone shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-1">
                        <span className="rounded bg-stone px-2 py-0.5 text-[10px] font-semibold uppercase">
                          {item.category}
                        </span>
                        {item.seating_capacity && (
                          <span className="rounded bg-stone/80 px-2 py-0.5 text-[10px] text-muted-foreground">
                            {item.seating_capacity}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-sm mt-1 truncate">{item.title}</h3>
                      {item.amharic_name && (
                        <p className="font-amharic text-xs text-muted-foreground">
                          {item.amharic_name}
                        </p>
                      )}
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                        {item.dimensions || item.detail}
                      </p>
                      <p className="text-xs font-semibold mt-1 text-foreground">
                        {item.price_display}
                      </p>
                    </div>
                  </div>

                  {/* Badges & Actions */}
                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleToggleTopPick(item.id, item.is_top_pick)}
                        title="Show in Homepage Sofa Carousel"
                        className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${
                          item.is_top_pick
                            ? "bg-amber-100 text-amber-800"
                            : "bg-stone/50 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {item.is_top_pick ? "★ Top Pick" : "+ Top Pick"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(item.id, item.is_featured)}
                        title="Show in Featured Grid"
                        className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${
                          item.is_featured
                            ? "bg-purple-100 text-purple-800"
                            : "bg-stone/50 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {item.is_featured ? "Featured" : "+ Feature"}
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleEditProduct(item)}
                        className="p-1.5 rounded hover:bg-stone text-muted-foreground hover:text-foreground"
                        title="Edit Product"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(item.id)}
                        className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                        title="Delete / Archive Product"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Product Edit / Add Modal */}
            {showProductModal && (
              <div className="fixed inset-0 z-50 overflow-y-auto">
                <div
                  className="fixed inset-0 bg-ink/70 backdrop-blur-xs transition-opacity"
                  onClick={() => setShowProductModal(false)}
                />
                <div className="flex min-h-screen items-center justify-center p-4">
                  <div className="relative w-full max-w-2xl rounded-lg bg-background p-6 shadow-2xl border border-border">
                    <h3 className="display text-2xl mb-4">
                      {editingProductId ? "Edit Product" : "Add New Product"}
                    </h3>

                    <form onSubmit={handleSaveProduct} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                          Product Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={prodTitle}
                          onChange={(e) => setProdTitle(e.target.value)}
                          placeholder="e.g. Maya Curved Sectional"
                          className="w-full rounded border border-input bg-background p-2.5 text-sm focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                            Amharic Label
                          </label>
                          <input
                            type="text"
                            value={prodAmharic}
                            onChange={(e) => setProdAmharic(e.target.value)}
                            placeholder="e.g. ባለ 5 መቀመጫ"
                            className="w-full rounded border border-input bg-background p-2.5 text-sm focus:outline-none font-amharic"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                            Category *
                          </label>
                          <select
                            value={prodCategory}
                            onChange={(e) => setProdCategory(e.target.value)}
                            className="w-full rounded border border-input bg-background p-2.5 text-sm focus:outline-none"
                          >
                            <option value="sofas">Sofas & Sectionals</option>
                            <option value="dining">Dining & Tables</option>
                            <option value="armchairs">Armchairs & Accent Chairs</option>
                            <option value="bedroom">Beds & Bedroom</option>
                            <option value="kids">Kids & Family</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                            Seating Capacity
                          </label>
                          <input
                            type="text"
                            value={prodCapacity}
                            onChange={(e) => setProdCapacity(e.target.value)}
                            placeholder="e.g. 5-seater or Modular"
                            className="w-full rounded border border-input bg-background p-2.5 text-sm focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                            Dimensions
                          </label>
                          <input
                            type="text"
                            value={prodDimensions}
                            onChange={(e) => setProdDimensions(e.target.value)}
                            placeholder="e.g. 302.4 cm × 257.7 cm"
                            className="w-full rounded border border-input bg-background p-2.5 text-sm focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                          Price Display
                        </label>
                        <input
                          type="text"
                          value={prodPriceDisplay}
                          onChange={(e) => setProdPriceDisplay(e.target.value)}
                          placeholder="e.g. Ask for price or 85,000 ETB"
                          className="w-full rounded border border-input bg-background p-2.5 text-sm focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                            Available Wood Finishes (comma separated)
                          </label>
                          <input
                            type="text"
                            value={prodWoodOptions}
                            onChange={(e) => setProdWoodOptions(e.target.value)}
                            placeholder="Solid Ethiopian Wanza, Stained Ash, Natural Teak"
                            className="w-full rounded border border-input bg-background p-2.5 text-sm focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                            Available Fabrics (comma separated)
                          </label>
                          <input
                            type="text"
                            value={prodFabricOptions}
                            onChange={(e) => setProdFabricOptions(e.target.value)}
                            placeholder="Belgian Linen, Bouclé Warm Ivory, Camel Leather"
                            className="w-full rounded border border-input bg-background p-2.5 text-sm focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                          Product Description
                        </label>
                        <textarea
                          rows={2}
                          value={prodDescription}
                          onChange={(e) => setProdDescription(e.target.value)}
                          placeholder="Brief description of design, comfort, and materials..."
                          className="w-full rounded border border-input bg-background p-2.5 text-sm focus:outline-none"
                        />
                      </div>

                      <ImageUploadField
                        label="Product Main Photo"
                        value={prodImageUrl}
                        onChange={(url) => setProdImageUrl(url)}
                        placeholder="/curved-boucle-sofa.jpg or image URL"
                      />

                      <div className="flex items-center gap-6 pt-2">
                        <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer">
                          <input
                            type="checkbox"
                            checked={prodIsTopPick}
                            onChange={(e) => setProdIsTopPick(e.target.checked)}
                            className="rounded border-input text-foreground focus:ring-0"
                          />
                          <span>Show on Homepage Sofa Marquee</span>
                        </label>

                        <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer">
                          <input
                            type="checkbox"
                            checked={prodIsFeatured}
                            onChange={(e) => setProdIsFeatured(e.target.checked)}
                            className="rounded border-input text-foreground focus:ring-0"
                          />
                          <span>Show in Featured Section</span>
                        </label>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                        <button
                          type="button"
                          onClick={() => setShowProductModal(false)}
                          className="px-4 py-2 rounded border border-border text-xs font-semibold hover:bg-stone"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded border border-foreground bg-foreground text-xs font-semibold text-background hover:opacity-90"
                        >
                          {editingProductId ? "Save Changes" : "Create Product"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 5: STAFF & ROLES (SUPER_ADMIN ONLY)                           */}
        {/* ================================================================= */}
        {activeTab === "users" && <UserManagementTab currentUser={currentUser} />}

        {/* ================================================================= */}
        {/* TAB 6: AUDIT TRAIL (SUPER_ADMIN & STORE_MANAGER)                  */}
        {/* ================================================================= */}
        {activeTab === "audit" && <AuditLogsTab />}
      </main>

      {/* Staff Profile & Password Modal */}
      {showProfileModal && currentUser && (
        <AdminProfileModal
          user={currentUser}
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
}
