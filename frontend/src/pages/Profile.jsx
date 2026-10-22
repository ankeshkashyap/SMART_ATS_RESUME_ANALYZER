import { useState } from "react";
import DashboardLayout from "../components/common/DashboardLayout";
import { useUser } from "../context/UserContext";
import api from "../services/api";

export default function Profile() {

return (
    <DashboardLayout>
        <ProfileContent/>
    </DashboardLayout>
)
}


function ProfileContent()
{
    
    function getUserInitial(name) {
    return name?.trim()?.charAt(0)?.toUpperCase() || "";
}


    const user = useUser();
    const [name, setName] = useState(user?.name || "");
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
  
    const displayName = user?.name?.trim() || name.trim();

    const avatarInitial = displayName
        ? displayName.charAt(0).toUpperCase()
        : "U";

          console.log("Profile user:", user);
console.log("Profile local name:", name);
console.log("Profile display name:", displayName);

    const handleSave = async () => {
        if (!name.trim()) {
            setError("Name cannot be empty.");
            return;
        }
        setSaving(true);
        setError("");
        setMessage("");
        try {
            await api.put("/auth/profile", { name: name.trim() });
            setMessage("Profile updated successfully. Reloading...");
            // Reload to refresh UserContext across all components
            setTimeout(() => window.location.reload(), 800);
        } catch (err) {
            console.error("Failed to update profile:", err);
            setError(err.response?.data?.detail || "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setName(user?.name || "");
        setError("");
        setMessage("");
    };

    return (
            <div className="mx-auto max-w-2xl p-8">
                <h1 className="text-2xl font-bold text-text-primary">My Profile</h1>
                <p className="mt-2 text-text-secondary">Manage your account information.</p>

                <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-2xl">
                            {avatarInitial}
                        </div>
                        <div>
                            <p className="font-semibold text-text-primary">{displayName}</p>
                            <p className="text-sm text-text-secondary">{user?.email}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="profile-name" className="block text-sm font-medium text-text-primary">
                                Display Name
                            </label>
                            <input
                                id="profile-name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-text-primary transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-primary">
                                Email
                            </label>
                            <p className="mt-1 text-sm text-text-secondary">{user?.email}</p>
                            <p className="mt-1 text-xs text-text-secondary">Email cannot be changed.</p>
                        </div>

                        {error && (
                            <p className="text-sm text-danger">{error}</p>
                        )}
                        {message && (
                            <p className="text-sm text-success">{message}</p>
                        )}

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                disabled={saving}
                                onClick={handleSave}
                                className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                            <button
                                type="button"
                                disabled={saving}
                                onClick={handleCancel}
                                className="rounded-md border border-border bg-card px-5 py-2.5 text-sm font-semibold text-text-primary transition hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
    );

}