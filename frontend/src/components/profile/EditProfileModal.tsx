"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { User, Mail, School, Camera, Save, Loader2, X } from "lucide-react";
import { ProfileService, TeacherProfile } from "@/services/profile";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
    const { t } = useTranslation();
    const [profile, setProfile] = useState<TeacherProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [name, setName] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Initial Load
    useEffect(() => {
        if (!isOpen) return; // Only load when open

        const loadProfile = async () => {
            setLoading(true);
            try {
                const data = await ProfileService.getProfile();
                setProfile(data);
                setName(data.name);
                setAvatarUrl(data.profile_picture || "");
            } catch (error) {
                console.error("Failed to load profile", error);
                setMessage({ type: "error", text: "Failed to load profile data" });
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, [isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setMessage({ type: "error", text: "Image size should be less than 5MB" });
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            await ProfileService.updateProfile({
                name,
                profile_picture: avatarUrl || undefined,
            });
            // Success! Close after a brief moment or show success
            setMessage({ type: "success", text: t('profile_updated') || "Profile updated successfully" });
            setTimeout(() => {
                onClose();
                window.dispatchEvent(new Event('profile-updated'));
            }, 1000);
        } catch (error: any) {
            console.error("Profile update error:", error);
            const errorMsg = error.message || (t('profile_update_failed') || "Failed to update profile");
            setMessage({ type: "error", text: errorMsg });
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Blurry Backdrop */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-white/20">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-800">{t('nav.editProfile')}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 md:p-8">
                    {loading ? (
                        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary-dark" size={32} /></div>
                    ) : (
                        <form onSubmit={handleSave} className="space-y-6">
                            {/* Avatar */}
                            <div className="flex flex-col items-center gap-3">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <div
                                    className="relative w-24 h-24 rounded-full bg-primary-100 border-4 border-white shadow-md cursor-pointer group overflow-hidden"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {avatarUrl ? (
                                        <Image unoptimized src={avatarUrl} alt="Avatar" fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-primary-dark text-3xl font-bold">
                                            {name.charAt(0)}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="text-white" size={24} />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500">{t('profile_picture_hint')}</p>
                            </div>

                            {/* Inputs */}
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <User size={16} className="text-primary-accent" />
                                        {t('register.name')}
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/10 outline-none transition-all"
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <Mail size={16} className="text-gray-400" />
                                        {t('register.email')}
                                    </label>
                                    <input
                                        type="email"
                                        value={profile?.email || ""}
                                        disabled
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 cursor-not-allowed"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <School size={16} className="text-gray-400" />
                                        {t('register.school')}
                                    </label>
                                    <input
                                        type="text"
                                        value={profile?.school || ""}
                                        disabled
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-[2] bg-primary-dark text-white py-2.5 rounded-xl font-bold hover:bg-secondary-dark transition-colors shadow-lg shadow-primary-dark/20 flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    {t('save_changes')}
                                </button>
                            </div>

                            {message && (
                                <div className={`px-4 py-2 rounded-lg text-sm font-medium text-center ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    {message.text}
                                </div>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
