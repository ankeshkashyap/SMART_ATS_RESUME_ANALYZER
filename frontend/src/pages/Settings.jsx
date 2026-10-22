import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/common/DashboardLayout";
import { useTheme } from "../context/useTheme";
import { useUser } from "../context/UserContext";
import { Sun, Moon, Monitor } from "lucide-react";

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const user = useUser();
    const navigate = useNavigate();
    const [defaultView, setDefaultView] = useState(() => {
        return localStorage.getItem("analysisDefaultView") || "summary";
    });
    const [confirmDelete, setConfirmDelete] = useState(() => {
        return localStorage.getItem("confirmBeforeDelete") !== "false";
    });

    useEffect(() => {
        localStorage.setItem("analysisDefaultView", defaultView);
    }, [defaultView]);

    useEffect(() => {
        localStorage.setItem("confirmBeforeDelete", String(confirmDelete));
    }, [confirmDelete]);

    const themes = [
        { value: "light", label: "Light", icon: Sun },
        { value: "dark", label: "Dark", icon: Moon },
        { value: "system", label: "System", icon: Monitor },
    ];

    return (
        <DashboardLayout>
            <div className="mx-auto max-w-2xl p-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Customize your experience.</p>

                {/* Appearance */}
                <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-600 dark:bg-slate-800">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Appearance</h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Choose your preferred theme.</p>
                    <div className="mt-4 flex gap-3">
                        {themes.map((t) => {
                            const Icon = t.icon;
                            const active = theme === t.value;
                            return (
                                <button
                                    key={t.value}
                                    type="button"
                                    onClick={() => setTheme(t.value)}
                                    className={`flex flex-col items-center gap-2 rounded-lg border-2 px-5 py-4 text-sm font-medium transition ${
                                        active
                                            ? "border-primary bg-orange-50 text-primary dark:bg-orange-900/20"
                                            : "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-slate-600 dark:text-gray-300 dark:hover:border-slate-500"
                                    }`}
                                >
                                    <Icon size={20} />
                                    {t.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Analysis Preferences */}
                <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-600 dark:bg-slate-800">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Analysis Preferences</h2>

                    <div className="mt-4 space-y-4">
                        <div>
                            <label htmlFor="default-view" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Default Results View
                            </label>
                            <select
                                id="default-view"
                                value={defaultView}
                                onChange={(e) => setDefaultView(e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100"
                            >
                                <option value="summary">Summary</option>
                                <option value="detailed">Detailed Breakdown</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Confirm before deleting
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Show a confirmation dialog when deleting resumes or analyses.
                                </p>
                            </div>
                            <button
                                type="button"
                                role="switch"
                                aria-checked={confirmDelete}
                                onClick={() => setConfirmDelete((prev) => !prev)}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                                    confirmDelete ? "bg-primary" : "bg-gray-300 dark:bg-slate-600"
                                }`}
                            >
                                <span
                                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                                        confirmDelete ? "translate-x-5" : "translate-x-0"
                                    }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Account & Security */}
                <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-600 dark:bg-slate-800">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Account & Security</h2>
                    <div className="mt-4 space-y-3">
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email || "Not available"}</p>
                        </div>
                        <div className="border-t border-gray-200 pt-3 dark:border-slate-600">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Change Password</p>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Password change is not currently available through this application. Please contact support if you need to reset your password.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Data & Privacy */}
                <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-600 dark:bg-slate-800">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Data & Privacy</h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Manage your resumes and analyses from their respective pages.
                    </p>
                    <div className="mt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/resume")}
                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600"
                        >
                            Manage Resumes
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/analysis-history")}
                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600"
                        >
                            Analysis History
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
