import https from 'https';
import fs from 'fs';
import path from 'path';

// Using raw_database.json which usually has keys: d, a, p, z
const RAW_DATA_URL = 'https://raw.githubusercontent.com/earthchie/jquery.Thailand.js/master/jquery.Thailand.js/database/raw_database/raw_database.json';
const OUTPUT_FILE = path.join(process.cwd(), 'public', 'data', 'thai_address.json');

console.log('🔄 Fetching raw Thai address data...');

const downloadData = (url) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                reject(`Failed to download: ${res.statusCode}`);
                return;
            }

            // Fix: Use array of buffers to handle multi-byte characters (Thai) correctly
            const chunks = [];

            res.on('data', (chunk) => {
                chunks.push(chunk);
            });

            res.on('end', () => {
                try {
                    // Combine all buffers first, THEN convert to string utf-8
                    const buffer = Buffer.concat(chunks);
                    const jsonString = buffer.toString('utf8');
                    resolve(JSON.parse(jsonString));
                } catch (e) {
                    reject('Failed to parse JSON: ' + e.message);
                }
            });
        }).on('error', reject);
    });
};

const transformData = (rawData) => {
    console.log(`📊 Processing ${rawData.length} records...`);

    const provinceMap = new Map();
    let skippedCount = 0;

    rawData.forEach(item => {
        // Try all possible keys
        const provinceName = item.p || item.province || item.Province || item.changwat;
        const amphureName = item.a || item.amphoe || item.amphure || item.Amphoe || item.amphur;
        const tambonName = item.d || item.district || item.tambon || item.District || item.tumbon;
        const zipCode = item.z || item.zipcode || item.zip_code || item.Zipcode || item.zip;

        if (!provinceName || !amphureName || !tambonName) {
            skippedCount++;
            return;
        }

        if (!provinceMap.has(provinceName)) {
            provinceMap.set(provinceName, {
                id: provinceMap.size + 1,
                name_th: provinceName,
                amphure: new Map()
            });
        }

        const province = provinceMap.get(provinceName);

        if (!province.amphure.has(amphureName)) {
            province.amphure.set(amphureName, {
                id: province.id * 100 + province.amphure.size + 1, // Mock ID
                name_th: amphureName,
                tambon: []
            });
        }

        const amphure = province.amphure.get(amphureName);

        // Avoid duplicate tambons in same amphure
        const isDuplicateTambon = amphure.tambon.some(t => t.name_th === tambonName);
        if (!isDuplicateTambon) {
            amphure.tambon.push({
                id: amphure.id * 100 + amphure.tambon.length + 1, // Mock ID
                name_th: tambonName,
                zip_code: zipCode || 0
            });
        }
    });

    if (skippedCount > 0) {
        console.warn(`⚠️ Skipped ${skippedCount} incomplete records.`);
    }

    // Convert Maps to Arrays and sort
    return Array.from(provinceMap.values())
        .map(p => ({
            ...p,
            amphure: Array.from(p.amphure.values())
                .sort((a, b) => a.name_th.localeCompare(b.name_th, 'th'))
        }))
        .sort((a, b) => a.name_th.localeCompare(b.name_th, 'th'));
};

const main = async () => {
    try {
        const rawData = await downloadData(RAW_DATA_URL);
        const transformedData = transformData(rawData);

        // Ensure directory exists
        const dir = path.dirname(OUTPUT_FILE);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(transformedData, null, 2));
        console.log(`✅ Success! Saved full Thai address data to: ${OUTPUT_FILE}`);
        console.log(`   - Total Provinces Found: ${transformedData.length}`);

    } catch (error) {
        console.error('❌ Error:', error);
    }
};

main();
