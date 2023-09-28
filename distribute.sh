yarn build &&
yarn electron:dist-windows &&
yarn electron:dist-linux &&
yarn electron-forge:make-macos-arm &&
yarn electron-forge:arm-installer-dmg &&
yarn electron-forge:make-macos-intel &&
yarn electron-forge:intel-installer-dmg