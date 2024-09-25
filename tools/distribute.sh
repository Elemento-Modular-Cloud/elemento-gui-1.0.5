yarn build &&
yarn electron:dist-windows &&
yarn electron:dist-linux &&
yarn electron-forge:make-macos-arm &&
yarn electron-forge:arm-installer-dmg &&
yarn electron-forge:make-macos-intel &&
yarn electron-forge:intel-installer-dmg

USER=fvalle
HOST=34.78.71.31
VERSION=0.4.1
PATH=/mnt/repository/app

scp electrOS-arm64.dmg $USER@$HOST:$PATH/Elemento_Cloud_App.dmg
scp electrOS\ Setup\ $VERSION.exe $USER@$HOST:$PATH/Elemento_Cloud_App.exe
scp electrOS-x64.dmg $USER@$HOST:$PATH/Elemento_Cloud_App_intel.dmg
scp electrOS-$VERSION-arm64.AppImage $USER@$HOST:$PATH/Elemento_Cloud_App.AppImage