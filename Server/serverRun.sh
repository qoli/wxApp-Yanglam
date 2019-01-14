#bash
docker-compose rm -f
docker-compose down
docker-compose build
docker-compose up -d mongodb
# docker-compose up -d adminmongo
sleep 10
docker-compose up web