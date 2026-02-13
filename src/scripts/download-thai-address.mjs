import fs from 'fs';
import path from 'path';
import https from 'https';

const dest = path.join(process.cwd(), 'public', 'data', 'thai_address.json');

// List of potential URLs (New Candidates)
const urls = [
    'https://raw.githubusercontent.com/Meldin/thai-province-data/master/api_province_with_amphure_tambon.json',
    'https://raw.githubusercontent.com/apisit/thai-province-data/master/api_province_with_amphure_tambon.json',
    'https://raw.githubusercontent.com/natharit-k/thai-province-data/master/api_province_with_amphure_tambon.json',
    'https://raw.githubusercontent.com/k4anKp/thai-province-data/master/api_province_with_amphure_tambon.json'
];

const download = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close(() => resolve(true));
                });
            } else {
                fs.unlink(dest, () => { }); // Delete empty file
                reject(`Server responded with ${response.statusCode}: ${url}`);
            }
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            reject(err.message);
        });
    });
};

(async () => {
    console.log('🔄 Attempting to download Thai Address Data...');

    // Ensure directory exists
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    for (const url of urls) {
        try {
            console.log(`Testing URL: ${url}`);
            await download(url, dest);
            console.log('✅ Success! Downloaded to public/data/thai_address.json');
            process.exit(0);
        } catch (err) {
            console.log(`❌ Failed: ${err}`);
            // Continue to next URL
        }
    }

    console.error('🔥 All download attempts failed.');
    process.exit(1);
})();
