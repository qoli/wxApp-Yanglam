#bash
pkill -f "wechatwebdevtools.app" 
rm -rf dist
sleep 2
open /Applications/wechatwebdevtools.app
wepy build --watch --no-cache