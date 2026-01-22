"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, PlayCircle, Maximize2, Minimize2 } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { TEACHER_CATEGORIES, TEACHER_VIDEO_DATA, TeacherCategory, getTeacherVideoPath } from "../../../constants";

export default function TeacherVideoPlayerPage({ params }: { params: Promise<{ category: string; videoId: string }> }) {
    const { t } = useTranslation();
    const resolvedParams = React.use(params);
    const categoryId = resolvedParams.category as TeacherCategory;
    const videoId = resolvedParams.videoId;

    const categoryInfo = TEACHER_CATEGORIES.find(c => c.key === categoryId);
    const videoList = TEACHER_VIDEO_DATA[categoryId] || [];
    const videoMeta = videoList.find(v => v.id === videoId);

    const [isFullscreen, setIsFullscreen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleFullscreen = () => {
        const element = containerRef.current || videoRef.current;
        if (!element) return;

        if (!document.fullscreenElement) {
            element.requestFullscreen().then(() => {
                setIsFullscreen(true);
            }).catch((err) => {
                console.error('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen().then(() => {
                setIsFullscreen(false);
            });
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    if (!categoryInfo || !videoMeta) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-gray-800">video not found</h1>
                <Link href={`/mini-modules/teachers/${categoryId}`} className="text-blue-600 hover:underline mt-4 block">
                    {t('back', 'Back')}
                </Link>
            </div>
        );
    }

    const videoPath = getTeacherVideoPath(categoryId, videoMeta.filename);

    return (
        <div className="pb-24">
            <Link
                href={`/mini-modules/teachers/${categoryId}`}
                className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors inline-block"
            >
                <ArrowLeft size={20} />
                <span>{t('back', 'Back')}</span>
            </Link>

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {t(videoMeta.titleKey, videoMeta.id)}
                </h1>
                <p className="text-gray-600">{categoryInfo.label}</p>
            </div>

            <div ref={containerRef} className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
                <div className="relative bg-black aspect-video">
                    <video
                        key={videoPath}
                        ref={videoRef}
                        controls
                        className="w-full h-full"
                        onError={(e) => console.error('Video load error:', e)}
                        preload="metadata"
                        autoPlay
                    >
                        <source src={videoPath} type="video/mp4" />
                        <source src={videoPath.replace('.mp4', '.webm')} type="video/webm" />
                        {t('video_support_error', 'Your browser does not support the video tag.')}
                    </video>
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end">
                    <button
                        onClick={handleFullscreen}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
                    >
                        {isFullscreen ? (
                            <>
                                <Minimize2 size={20} />
                                <span>{t('exit_fullscreen', 'Exit Fullscreen')}</span>
                            </>
                        ) : (
                            <>
                                <Maximize2 size={20} />
                                <span>{t('fullscreen', 'Fullscreen')}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
