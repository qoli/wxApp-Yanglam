#bash
echo "docker 方式開始運行"
echo "數據庫將會 -d 後台運行"
echo ""
docker-compose rm -f
docker-compose down
# docker-compose build
docker-compose up -d mongodb
docker-compose up -d adminmongo
echo "等待 20 秒"
echo ""
sleep 20
docker-compose logs mongodb
echo "啟動 Web"
docker-compose up web