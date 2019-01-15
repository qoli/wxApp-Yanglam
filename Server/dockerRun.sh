#bash
docker-compose rm -f
docker-compose down
docker-compose build
docker-compose up -d mongodb
docker-compose up adminmongo