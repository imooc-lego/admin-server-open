# Dockerfile
FROM node:14
WORKDIR /app
COPY . /app

# 设置时区
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' >/etc/timezone

# 宿主机 ip 指向 docker-host ，以方便 docker 内部访问宿主机
CMD /sbin/ip route|awk '/default/ { print $3,"\tdocker-host" }' >> /etc/hosts && npm i && npm run prd-dev && npx pm2 log
