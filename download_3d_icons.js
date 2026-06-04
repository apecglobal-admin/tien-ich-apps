const fs = require('fs');
const path = require('path');
const https = require('https');

const iconsToDownload = [
  { name: 'transfer', url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Money%20with%20wings/3D/money_with_wings_3d.png' },
  { name: 'card', url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Credit%20card/3D/credit_card_3d.png' },
  { name: 'savings', url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Piggy%20bank/3D/piggy_bank_3d.png' },
  { name: 'loan', url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Money%20bag/3D/money_bag_3d.png' },
  { name: 'topup', url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Mobile%20phone/3D/mobile_phone_3d.png' },
  { name: 'insurance', url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Shield/3D/shield_3d.png' },
  { name: 'opencard', url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Star/3D/star_3d.png' },
  { name: 'qrpay', url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Mobile%20phone%20with%20arrow/3D/mobile_phone_with_arrow_3d.png' },
  { name: 'more', url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Plus/3D/plus_3d.png' },
  { name: 'electric', url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Light%20bulb/3D/light_bulb_3d.png' },
  { name: 'water', url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Droplet/3D/droplet_3d.png' },
  { name: 'internet', url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Globe%20with%20meridians/3D/globe_with_meridians_3d.png' },
  { name: 'tv', url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Television/3D/television_3d.png' },
  { name: 'apartment', url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/House%20with%20garden/3D/house_with_garden_3d.png' },
  { name: 'flight', url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Airplane/3D/airplane_3d.png' },
  { name: 'train', url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Train/3D/train_3d.png' },
  { name: 'hotel', url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Bed/3D/bed_3d.png' },
  { name: 'shopping', url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Shopping%20bags/3D/shopping_bags_3d.png' }
];

const targetDir = path.join(__dirname, 'app', 'public', 'icons', '3d');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function run() {
  console.log('Downloading 3D icons...');
  for (const icon of iconsToDownload) {
    const dest = path.join(targetDir, `${icon.name}.png`);
    await download(icon.url, dest);
    console.log(`Downloaded ${icon.name}.png`);
  }

  console.log('Updating CMS database...');
  const dbPath = path.join(__dirname, 'app', 'src', 'data', 'cms-data.json');
  if (fs.existsSync(dbPath)) {
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Mapping item names to our new 3D icons
    const nameMap = {
      'Chuyển tiền': 'transfer',
      'Thanh toán thẻ': 'card',
      'Tiết kiệm': 'savings',
      'Vay online': 'loan',
      'Nạp tiền điện thoại': 'topup',
      'Bảo hiểm': 'insurance',
      'Mở thẻ': 'opencard',
      'QR Pay': 'qrpay',
      'Xem thêm': 'more',
      'Điện': 'electric',
      'Nước': 'water',
      'Internet': 'internet',
      'Truyền hình': 'tv',
      'Chung cư': 'apartment',
      'Khác': 'more',
      'Vé máy bay': 'flight',
      'Vé tàu xe': 'train',
      'Đặt phòng': 'hotel',
      'Mua sắm': 'shopping'
    };

    if (data.sections) {
      data.sections.forEach(section => {
        if (section.id !== 'section-banks' && section.items) {
          section.items.forEach(item => {
            const mappedName = nameMap[item.name];
            if (mappedName) {
              item.icon = `/icons/3d/${mappedName}.png`;
              // Make background slightly lighter/transparent to pop 3D image
              item.color = 'rgba(255, 255, 255, 0.7)'; 
            }
          });
        }
      });
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
      console.log('Successfully updated cms-data.json');
    }
  }
}

run().catch(console.error);
