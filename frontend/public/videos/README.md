# Videos Folder Structure

Place your videos in the following structure:

```
public/
  videos/
    teacher/
      classroom-management/
        video.mp4 (or video.webm)
      time-management/
        video.mp4
      stress-burnout/
        video.mp4
      teaching-improvement/
        video.mp4
      reflection/
        video.mp4
      skills-management/
        video.mp4
    grade-wise/
      (to be implemented)
```

## Notes:
- Video files should be named `video.mp4` or `video.webm`
- For multiple videos in a category, you can name them `video1.mp4`, `video2.mp4`, etc. and update the `videoFiles` object in `mini-modules/page.tsx`
- Supported formats: MP4, WebM
- Recommended: Use MP4 (H.264) for best browser compatibility
