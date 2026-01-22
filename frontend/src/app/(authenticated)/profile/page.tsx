'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { User, Mail, School, Camera, Save, Loader2 } from 'lucide-react';
import { ProfileService, TeacherProfile } from '@/services/profile';

export default function ProfilePage() {
    const { t } = useTranslation();
    const router = useRouter();
    const [profile, setProfile] = useState<TeacherProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [name, setName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await ProfileService.getProfile();
                setProfile(data);
                setName(data.name);
                setAvatarUrl(data.profile_picture || '');
            } catch (error: unknown) {
                const err = error as Error;
                if (err.message === "Unauthorized") {
                    router.push('/teacher/login');
                } else {
                    setMessage({ type: 'error', text: 'Failed to load profile' });
                }
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [router]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setMessage({ type: 'error', text: 'Image size should be less than 5MB' });
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
            const updated = await ProfileService.updateProfile({
                name,
                profile_picture: avatarUrl || undefined
            });
            setProfile(updated);
            setMessage({ type: 'success', text: 'Profile updated successfully' });
            
            // Update local storage name for immediate UI feedback if stored there
            // localStorage.setItem('userName', updated.name); 
        } catch {
            setMessage({ type: 'error', text: 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <Loader2 className="animate-spin text-primary-dark" size={32} />
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold text-gray-900">{t('nav.editProfile') || 'Edit Profile'}</h1>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <form onSubmit={handleSave} className="space-y-8">
                    {/* Profile Picture Section */}
                    <div className="flex flex-col items-center space-y-4 pb-4 border-b border-gray-100">
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="image/*" 
                            className="hidden" 
                        />
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <div className="w-28 h-28 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg transition-transform transform group-hover:scale-105 relative">
                                {avatarUrl ? (
                                    <Image unoptimized src={avatarUrl} alt="Preview" fill className="object-cover" />
                                ) : profile?.profile_picture ? (
                                    <Image unoptimized src={profile.profile_picture} alt={profile.name} fill className="object-cover" />
                                ) : (
                                    <span className="text-4xl font-bold text-primary-dark">{profile?.name.charAt(0)}</span>
                                )}
                            </div>
                            <div className="absolute bottom-0 right-0 p-2.5 bg-primary-dark text-white rounded-full shadow-md hover:bg-primary-accent transition-colors ring-2 ring-white">
                                <Camera size={18} />
                            </div>
                        </div>
                        
                        <p className="text-sm text-gray-500">
                            {t('profile_picture_hint') || "Click to upload a new photo"}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <User size={18} className="text-primary-accent" />
                                {t('register.name') || 'Full Name'}
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/20 outline-none transition-all"
                                placeholder="Enter your name"
                                required
                            />
                        </div>

                        {/* Email (Read-only) */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Mail size={18} className="text-gray-400" />
                                {t('register.email') || 'Email Address'}
                            </label>
                            <input
                                type="email"
                                value={profile?.email || ''}
                                disabled
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed select-none"
                            />
                            <p className="text-xs text-gray-400">Email address cannot be changed</p>
                        </div>

                        {/* School (Read-only) */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <School size={18} className="text-gray-400" />
                                {t('register.school') || 'School'}
                            </label>
                            <input
                                type="text"
                                value={profile?.school || ''}
                                disabled
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed select-none"
                            />
                            <p className="text-xs text-gray-400">Managed by your administrator</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-6 flex items-center justify-end gap-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-primary-dark text-white px-8 py-2.5 rounded-xl font-bold hover:bg-secondary-dark transition-colors shadow-lg shadow-primary-dark/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed min-w-40"
                        >
                            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            {t('save_changes') || 'Save Changes'}
                        </button>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                            {message.text}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
