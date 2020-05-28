# Blog 文章程序目錄

##### fileSync.sh

文件同步腳本



### 備註

Blog 基於 LNMP 運行，并無基於 Docker 運行。

#### 更新 SSL 證書指令

需要 root 身份執行

```shell
su
export DP_Id="﹣"
export DP_Key="﹣"
acme.sh --issue --dns dns_dp -d yanglam.cn -d *.yanglam.cn
lnmp restart
```





# Client 小程序目錄

##### watch.sh 

清理生成目錄并重啟小程序調試工具和開始 WEPY 監控



# Server API 伺服器目錄

##### fileSync.sh 

同步更新的文件到伺服器



##### dockerRun.sh

本地運行

需要自行在 web-site 目錄下開始 node 程序

`gulp` 可使用 gulp 在目錄下運行



##### serverRun.sh

伺服器運行



### 備註

API 基於 Docker 運行，lnmp 環境下的 Nginx 轉發到 Docker 上。

第一次運行 API 伺服器，請初始化管理員和開發者賬戶。

```shell
curl "http://localhost:3000/users/init" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -u 'r2qra3ggend8:Wcw6H@Gc6w78' \
     -d $'{}'
```



#### 使用到的 Docker

* Web 基於 node，負責 API 功能的容器
* mongodb 數據庫容器
* adminmongo 管理數據庫的工具，可在正式運行不啟動
