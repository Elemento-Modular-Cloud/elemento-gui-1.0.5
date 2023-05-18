ditto -c -k --sequesterRsrc --keepParent Elemento\ Cloud\ App.app /var/folders/p9/jybhy1k151q_zhf41ds5741r0000gn/T/electron-notarize-26X7Ou/Elemento\ Cloud\ App.zip

notarytool submit /var/folders/p9/jybhy1k151q_zhf41ds5741r0000gn/T/electron-notarize-26X7Ou/Elemento\ Cloud\ App.zip --apple-id framesystem@icloud.com --password mumw-joxm-gdde-lhdq --team-id 9WTDB7G2C7 --wait --output-format json


d64c64bd-438a-42e1-9fbe-e58894f6e742

// ------- 0 -  SHOW CERTIFICATES
security find-identity -v -p codesigning

// ------- 1 - CODESIGN
codesign -s "Developer ID Application: Elemento SRL (9WTDB7G2C7)" -f --deep --entitlements ./entitlements.mac.plist --timestamp ./dist/mac-arm64/Elemento\ Cloud\ App.app

// check timestamp
codesign -dvv ./dist/mac-arm64/Elemento\ Cloud\ App.app

// ------- 1.1 - ZIP FILE
Create zip file of .app

// ------- 2 - UPLOAD & NOTARIZATION
xcrun altool --notarize-app --primary-bundle-id "app.elemento.cloud" --username "framesystem@icloud.com" --password "mumw-joxm-gdde-lhdq" --asc-provider "9WTDB7G2C7" --file ./dist/mac-arm64/Elemento\ Cloud\ App.zip --verbose

// ------- 2.1 - CHECK IF NOTARIZATION IS OK
xcrun altool --notarization-info 80447c47-121c-405a-85eb-e088b1a52bf7 -u "framesystem@icloud.com" -p "mumw-joxm-gdde-lhdq"

// ------- 3 - STAPLING
xcrun stapler staple /path/to/YourApp.app

2/7031a5024ef877dd932dc75b5bc3e14b36d687cd
