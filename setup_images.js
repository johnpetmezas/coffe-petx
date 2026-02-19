const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'raw_images');
const destDir = path.join(__dirname, 'public', 'coffee-sequence');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

// Read directory
fs.readdir(srcDir, (err, files) => {
    if (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
    }

    // Filter for jpgs and sort
    const jpgs = files.filter(f => f.endsWith('.jpg') && f.includes('frame')).sort();

    console.log(`Found ${jpgs.length} images.`);

    jpgs.forEach((file, index) => {
        // file is like ezgif-frame-001.jpg
        // target is frame_0.jpg
        // Note: index IS 0-based, so first file becomes frame_0.jpg

        const oldPath = path.join(srcDir, file);
        const newPath = path.join(destDir, `frame_${index}.jpg`);

        fs.copyFileSync(oldPath, newPath);
        console.log(`Copied ${file} -> frame_${index}.jpg`);
    });

    console.log('Done.');
});
