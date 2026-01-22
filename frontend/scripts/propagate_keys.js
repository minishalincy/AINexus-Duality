const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/lib/i18n/locales');
const enContent = JSON.parse(fs.readFileSync(path.join(localesDir, 'en/translation.json'), 'utf-8'));

const languages = fs.readdirSync(localesDir).filter(l => l !== 'en');

languages.forEach(lang => {
    const filePath = path.join(localesDir, lang, 'translation.json');
    if (fs.existsSync(filePath)) {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        // Add missing keys from EN to this lang
        let updated = false;
        Object.keys(enContent).forEach(key => {
            if (!content[key]) {
                content[key] = enContent[key];
                updated = true;
            }
        });

        if (updated) {
            fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
            console.log(`Updated ${lang}`);
        }
    }
});
