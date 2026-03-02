# Dockerfile for API Service
# 作者: Shyu

FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY apps/api/package*.json ./

# 安装依赖 - 包括devDependencies
RUN npm install

# 复制源代码
COPY apps/api/src ./src
COPY apps/api/nest-cli.json ./
COPY apps/api/tsconfig.json ./

# 暴露端口
EXPOSE 42123

# 启动命令 - 使用npx来运行nest
CMD ["npx", "nest", "start", "--watch", "--port", "42123"]
