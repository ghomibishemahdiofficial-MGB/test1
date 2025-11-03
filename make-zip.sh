#!/bin/bash

echo "🚀 شروع آماده‌سازی برای Deploy..."

# رنگ‌ها
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# ۱. پاکسازی
echo -e "${YELLOW}۱. حذف فایل‌های غیرضروری...${NC}"
rm -rf node_modules .next .turbo coverage .git .vscode out
rm -f npm-debug.log* yarn-debug.log* yarn-error.log*
echo -e "${GREEN}✅ پاکسازی تمام شد${NC}"

# ۲. نمایش حجم
echo -e "${YELLOW}۲. بررسی حجم...${NC}"
du -sh . | awk '{print "حجم کل: " $1}'

# ۳. ساخت Zip
echo -e "${YELLOW}۳. ساخت فایل Zip...${NC}"
cd ..
PROJECT_NAME="mgb-ai"
ZIP_NAME="${PROJECT_NAME}-$(date +%Y%m%d-%H%M%S).zip"

zip -r "$ZIP_NAME" "$PROJECT_NAME" \
  -x "*/node_modules/*" \
  -x "*/.next/*" \
  -x "*/.git/*" \
  -x "*/.turbo/*" \
  -x "*/coverage/*" \
  -x "*/.DS_Store" \
  -x "*/.*"

# ۴. نتیجه
echo -e "${GREEN}✅✅✅ Zip آماده شد!${NC}"
echo -e "${GREEN}فایل: $ZIP_NAME${NC}"
echo -e "${GREEN}مسیر: $(pwd)/$ZIP_NAME${NC}"
echo -e "${YELLOW}حجم: $(du -h $ZIP_NAME | cut -f1)${NC}"

cd "$PROJECT_NAME"
