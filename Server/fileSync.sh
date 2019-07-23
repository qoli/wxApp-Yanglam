#bash
date
echo "本地 ⇋  ubuntu@134.175.47.173"
echo ""
rsync -avzP --exclude=node_modules --exclude=data ./ ubuntu@134.175.47.173:/home/ubuntu/www
# ssh -l ubuntu 134.175.47.173 "/home/ubuntu/www/dockerServerRun.sh"