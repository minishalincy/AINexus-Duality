const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/lib/i18n/locales');

const additionalKeys = {
    en: { my_classroom_subtitle: "Manage your classes and subjects here." },
    hi: { my_classroom_subtitle: "अपनी कक्षाओं और विषयों को यहाँ प्रबंधित करें।" },
    kn: { my_classroom_subtitle: "ನಿಮ್ಮ ತರಗತಿಗಳು ಮತ್ತು ವಿಷಯಗಳನ್ನು ಇಲ್ಲಿ ನಿರ್ವಹಿಸಿ." },
    ta: { my_classroom_subtitle: "உங்கள் வகுப்புகள் மற்றும் பாடங்களை இங்கே நிர்வகிக்கவும்." },
    te: { my_classroom_subtitle: "మీ తరగతులు మరియు విషయాలను ఇక్కడ నిర్వహించండి." },
    ml: { my_classroom_subtitle: "നിങ്ങളുടെ ക്ലാസുകളും വിഷയങ്ങളും ഇവിടെ മാനേജ് ചെയ്യുക." },
    mr: { my_classroom_subtitle: "आपले वर्ग आणि विषय येथे व्यवस्थापित करा." },
    gu: { my_classroom_subtitle: "તમારા વર્ગો અને વિષયો અહીં મેનેજ કરો." },
    bn: { my_classroom_subtitle: "আপনার ক্লাস এবং বিষয়গুলি এখানে পরিচালনা করুন।" },
    pa: { my_classroom_subtitle: "ਆਪਣੀਆਂ ਕਲਾਸਾਂ ਅਤੇ ਵਿਸ਼ਿਆਂ ਦਾ ਪ੍ਰਬੰਧਨ ਇੱਥੇ ਕਰੋ।" },
    as: { my_classroom_subtitle: "আপোনাৰ শ্ৰেণী আৰু বিষয়সমূহ ইয়াত পৰিচালনা কৰক।" },
    or: { my_classroom_subtitle: "ଆପଣଙ୍କର ଶ୍ରେଣୀ ଏବଂ ବିଷୟଗୁଡିକ ଏଠାରେ ପରିଚାଳନା କରନ୍ତୁ।" }
};

const languages = fs.readdirSync(localesDir);

languages.forEach(lang => {
    const filePath = path.join(localesDir, lang, 'translation.json');
    if (fs.existsSync(filePath)) {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const newContent = { ...content, ...additionalKeys[lang] };
        fs.writeFileSync(filePath, JSON.stringify(newContent, null, 2));
        console.log(`Updated ${lang}`);
    }
});
