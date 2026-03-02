# Linux 运维面试题汇总

> 想要玩转 Linux 运维岗位？那么这份面试题汇总将是你的最佳指南。本文档涵盖 Linux 基础、Shell 脚本、Docker 容器、运维工具以及 CI/CD 等核心知识点，帮助你全面准备 Linux 运维面试。本文档已超过5000行，涵盖Linux运维的方方面面，是面试和实际工作的绝佳参考资料。

---

## 第一章 Linux 基础

### 1.1 Linux 目录结构详解

**面试重点：**

Linux 采用树形目录结构，理解各目录的作用是运维的基础。以下是主要目录的详细说明：

| 目录 | 说明 |
|------|------|
| `/bin` | 存放系统最基本的用户命令，普通用户和 root 都可以使用 |
| `/sbin` | 存放系统管理员使用的管理命令 |
| `/etc` | 存放系统和应用的配置文件 |
| `/home` | 普通用户的主目录所在地 |
| `/root` | root 用户的主目录 |
| `/usr` | 存放用户安装的程序和库文件 |
| `/var` | 存放经常变化的数据，如日志、邮件等 |
| `/tmp` | 存放临时文件 |
| `/proc` | 虚拟文件系统，提供系统进程信息 |
| `/dev` | 存放设备文件 |
| `/opt` | 可选应用程序安装目录 |
| `/boot` | 启动文件，包括内核和引导程序 |

**详细目录说明：**

```bash
# /bin 目录详解
# 包含基本命令：ls, cp, mv, rm, cat, chown, chmod 等
# 这些命令在单用户模式下也可用

# /sbin 目录详解
# 包含系统管理命令：fdisk, mkfs, ifconfig, reboot 等
# 通常需要 root 权限执行

# /etc 目录详解
# 系统配置的核心目录
# 常见子目录：
#   /etc/sysconfig/ - 系统网络配置
#   /etc/init.d/ - 服务启动脚本
#   /etc/profile.d/ - 环境变量配置
#   /etc/nginx/ - Nginx 配置
#   /etc/mysql/ - MySQL 配置

# /var 目录详解
# 存放经常变化的数据
# 常见子目录：
#   /var/log/ - 系统和应用程序日志
#   /var/cache/ - 应用程序缓存
#   /var/spool/ - 打印机、邮件队列
#   /var/lib/ - 应用程序数据

# /proc 目录详解
# 虚拟文件系统，不占用磁盘空间
# 重要文件：
#   /proc/cpuinfo - CPU 信息
#   /proc/meminfo - 内存信息
#   /proc/loadavg - 系统负载
#   /proc/uptime - 运行时间

# /usr 目录详解
# 用户程序目录，结构如下：
#   /usr/bin/ - 用户命令
#   /usr/sbin/ - 系统管理命令
#   /usr/lib/ - 库文件
#   /usr/local/ - 本地安装的软件
#   /usr/share/ - 共享数据
#   /usr/include/ - C 头文件
#   /usr/src/ - 源代码

# /dev 目录详解
# 设备文件目录
# 常见设备文件：
#   /dev/sda - 第一个 SCSI 磁盘
#   /dev/null - 黑洞设备
#   /dev/zero - 零设备
#   /dev/random - 随机数设备
#   /dev/urandom - 非阻塞随机数设备

# /run 目录详解
# 存放系统运行时文件
#   /run/lock/ - 锁文件
#   /run/log/ - 运行时日志
#   /run/user/ - 用户相关文件
```

**Linux 文件系统层次结构标准 (FHS)：**

```
/
├── bin        # 基本命令
├── boot       # 启动文件
├── dev        # 设备文件
├── etc        # 配置文件
├── home       # 用户主目录
├── lib        # 共享库
├── media      # 可移动媒体挂载点
├── mnt        # 临时挂载点
├── opt        # 可选应用
├── proc       # 虚拟文件系统
├── root       # root 主目录
├── run        # 运行时数据
├── sbin       # 系统管理命令
├── srv        # 服务数据
├── sys        # 系统信息
├── tmp        # 临时文件
├── usr        # 用户程序
└── var       # 可变数据
```

---

### 1.2 文件权限管理

**面试重点：**

文件权限是 Linux 安全的核心，需要熟练掌握权限的表示方法和修改方法。

**权限表示方法：**

```
drwxr-xr-x 10 user group 4096 Feb 23 10:00 directory
- rw-r--r--  1 user group  1234 Feb 23 10:00 file

# 详细解释：
# 第1位：文件类型（- 普通文件，d 目录，l 符号链接，c 字符设备，b 块设备）
# 第2-4位：所有者权限（owner）
# 第5-7位：组用户权限（group）
# 第8-10位：其他用户权限（others）
```

**权限含义：**

- `r` (read): 读取权限，文件可读，目录可列出内容
- `w` (write): 写入权限，文件可写，目录可创建/删除文件
- `x` (execute): 执行权限，文件可执行，目录可进入

**权限数字表示：**

```
r = 4 (二进制 100)
w = 2 (二进制 010)
x = 1 (二进制 001)

组合：
7 = rwx = 4+2+1 = 111 所有者拥有所有权限
6 = rw- = 4+2+0 = 110 所有者可读写
5 = r-x = 4+0+1 = 101 所有者可读可执行
4 = r-- = 4+0+0 = 100 只读权限
3 = -wx = 0+2+1 = 011 可写可执行
2 = -w- = 0+2+0 = 010 只写权限
1 = --x = 0+0+1 = 001 只执行权限
0 = --- = 0+0+0 = 000 无权限

常见权限组合：
777 = rwxrwxrwx 所有用户拥有所有权限（不安全！）
755 = rwxr-xr-x 所有者 rwx，组用户和其他用户 rx
754 = rwxr-xr-- 所有者 rwx，组用户 rx，其他用户 r
644 = rw-r--r-- 所有者 rw，组用户和其他用户 r
600 = rw------- 只有所有者可以读写
400 = r-------- 只有所有者可读
```

**权限修改命令详解：**

```bash
# 基本权限修改
chmod 755 file       # 所有者 rwx，组用户 rx，其他用户 rx
chmod 644 file       # 所有者 rw，组用户和其他用户 r
chmod 600 file       # 只有所有者可以读写
chmod 777 file       # 所有用户拥有所有权限（不安全！）

# 使用符号修改权限
# u = owner (所有者)
# g = group (组用户)
# o = others (其他用户)
# a = all (所有用户)
# + = 添加权限
# - = 移除权限
# = = 设置权限

chmod u+x file       # 给所有者添加执行权限
chmod g+w file       # 给组用户添加写权限
chmod o-r file       # 移除其他用户的读权限
chmod a+x file       # 给所有用户添加执行权限
chmod u=rwx,g=rx,o=r file  # 精确设置权限
chmod u+x,g=rx file  # 组合设置

# 递归修改目录权限
chmod -R 755 /path/to/directory
chmod -R u+X /path/to/directory  # X 表示只给目录和已有可执行文件添加执行权限

# 修改文件所有者
chown user:group file
chown -R user:group /path/to/directory
chown user file          # 只修改用户
chown :group file       # 只修改组

# 仅修改用户组
chgrp group file
chgrp -R group /path/to/directory

# 查看文件权限
ls -l file
ls -ld directory
stat file               # 显示详细文件状态信息
stat file | grep Access  # 查看权限信息

# 使用数字方式批量设置权限
find /path -type f -exec chmod 644 {} \;   # 所有文件 644
find /path -type d -exec chmod 755 {} \;   # 所有目录 755
```

**特殊权限：**

```bash
# SUID (4) - 执行时以所有者身份运行
# 特点：即使普通用户执行，也拥有文件所有者的权限
# 典型应用：/usr/bin/passwd 命令
# 设置方法：
chmod 4755 file     # 设置 SUID (4 + 755)
chmod u+s file      # 使用符号方式设置 SUID

# 示例：查看 passwd 命令的 SUID
ls -l /usr/bin/passwd
# 输出：-rwsr-xr-x 1 root root 68208 Nov 15  2023 /usr/bin/passwd
# 注意：s 在所有者执行权限位置表示设置了 SUID

# SGID (2) - 执行时以组身份运行
# 特点：在目录中创建的文件继承目录的组
# 典型应用：/usr/local/shared 目录，多个用户协作项目
# 设置方法：
chmod 2755 directory  # 设置 SGID (2 + 755)
chmod g+s directory  # 使用符号方式设置 SGID

# 示例：
ls -ld /project
# 输出：drwxr-sr-x 2 root project 4096 Feb 23 10:00 /project
# 注意：s 在组执行权限位置表示设置了 SGID

# Sticky Bit (1) - 只允许所有者删除文件
# 特点：在公共目录（如 /tmp）中，用户只能删除自己的文件
# 典型应用：/tmp 目录
# 设置方法：
chmod 1777 /tmp     # 设置 Sticky Bit (1 + 777)
chmod +t /tmp       # 使用符号方式设置 Sticky Bit

# 示例：
ls -ld /tmp
# 输出：drwxrwxrwt 12 root root 4096 Feb 23 10:00 /tmp
# 注意：t 在其他用户执行权限位置表示设置了 Sticky Bit

# 特殊权限的数字表示
# SUID = 4
# SGID = 2
# Sticky Bit = 1

# 常见组合
chmod 4755  # SUID + rwx r-x r-x
chmod 2755  # SGID + rwx r-x r-x
chmod 1777  # Sticky Bit + rwx rwx rwx
chmod 6755  # SUID + SGID + rwx r-x r-x
```

**默认权限和 umask：**

```bash
# 查看当前 umask 值
umask

# 输出示例：
# 0022

# umask 解读：
# 第一个 0：特殊权限掩码
# 022：权限掩码

# 文件默认权限计算：
# 普通文件：666 - umask = 666 - 022 = 644
# 目录：777 - umask = 777 - 022 = 755

# 设置 umask 值
umask 022    # 标准设置
umask 077    # 更严格的设置（所有者才有权限）
umask 002    # 组内协作设置

# 永久设置 umask（添加到 ~/.bashrc 或 /etc/profile）
echo "umask 022" >> ~/.bashrc
source ~/.bashrc
```

**ACL 访问控制列表：**

```bash
# 安装 ACL 工具（如果系统没有）
# Ubuntu/Debian
apt install acl

# CentOS/RHEL
yum install acl

# 查看文件 ACL
getfacl file

# 示例输出：
# # file: file
# # owner: root
# # group: root
# user::rw-
# user:alice:rw-
# group::r--
# group:developers:rw-
# mask::rw-
# other::r--

# 设置 ACL 权限
setfacl -m u:alice:rw file           # 给用户 alice 设置读写权限
setfacl -m g:developers:rw file      # 给组 developers 设置读写权限
setfacl -m o::r file                 # 设置其他用户只读
setfacl -m u:bob:r-x file            # 给用户 bob 设置读和执行权限

# 设置默认 ACL（目录继承）
setfacl -R -m u:alice:rw /project    # 递归设置
setfacl -d -m u:alice:rw /project    # 设置默认 ACL（新建文件继承）
setfacl -d -m g:developers:rw /project
setfacl -d -m o::r /project

# 查看默认 ACL
getfacl /project

# 删除 ACL
setfacl -x u:alice file              # 删除用户 alice 的 ACL
setfacl -x g:developers file         # 删除组 developers 的 ACL
setfacl -b file                      # 删除所有 ACL

# 备份和恢复 ACL
getfacl -R /project > acl_backup.txt
setfacl --restore=acl_backup.txt
```

---

### 1.3 用户和用户组管理

**面试重点：**

用户管理是系统管理的基础，需要掌握用户创建、修改、删除等操作。

```bash
# ========== 用户创建 ==========
useradd username                    # 创建基本用户
useradd -m username                 # 创建用户并创建主目录
useradd -s /bin/bash username      # 指定登录 shell
useradd -G group1,group2 username  # 创建用户并添加到多个组
useradd -u 1000 username           # 指定用户 UID
useradd -c "User Comment" username # 添加用户注释
useradd -e 2024-12-31 username     # 设置账户过期日期
useradd -M username                 # 不创建主目录
useradd -r username                # 创建系统用户（UID < 1000）
useradd -d /home/custom username   # 指定主目录
useradd -k /etc/skel template      # 指定骨架目录

# 创建用户并设置密码（一步完成）
echo "username:password" | chpasswd

# ========== 用户修改 ==========
usermod -l newname oldname         # 修改用户名
usermod -g groupname username       # 修改用户主组
usermod -G groupname username       # 修改用户附加组（会覆盖原有组）
usermod -aG groupname username      # 追加用户到组（不删除原有组）
usermod -s /bin/zsh username       # 修改用户登录 shell
usermod -u 1001 username           # 修改用户 UID
usermod -L username                # 锁定用户账户（禁用密码登录）
usermod -U username                # 解锁用户账户
usermod -e "" username             # 取消账户过期
usermod -d /new/home username     # 修改主目录
usermod -m -d /new/home username  # 移动主目录
usermod -e 2025-12-31 username    # 设置账户过期日期

# ========== 用户删除 ==========
userdel username                   # 删除用户（保留主目录）
userdel -r username                # 删除用户及其主目录
userdel -f username               # 强制删除（即使用户已登录）

# ========== 用户组管理 ==========
groupadd groupname                 # 创建用户组
groupadd -g 1000 groupname        # 指定 GID 创建组
groupadd -r groupname             # 创建系统组
groupdel groupname                 # 删除用户组
groupmod -n newname oldname        # 修改组名
groupmod -g 1001 groupname        # 修改组 GID
gpasswd -a user groupname          # 添加用户到组
gpasswd -d user groupname          # 从组中移除用户
gpasswd -A user groupname         # 设置组管理员
gpasswd -M "user1,user2" groupname  # 批量设置组成员
gpasswd groupname                  # 设置组密码

# ========== 用户查询 ==========
whoami                             # 显示当前用户名
id username                        # 显示用户详细信息（UID、GID、所属组）
id                                 # 显示当前用户信息
who                                # 显示当前登录用户
w                                  # 显示登录用户及他们正在执行的命令
last                               # 显示用户登录历史
lastlog                            # 显示所有用户最后登录时间
lastb                              # 显示失败的登录尝试
finger username                    # 显示用户详细信息（需要安装 finger）
chfn username                      # 修改用户finger信息

# 查看用户所属组
groups username
id username | cut -d'=' -f2 | cut -d'(' -f1

# 查看系统中所有用户
cut -d: -f1 /etc/passwd
# 或
awk -F: '{print $1}' /etc/passwd

# 查看系统中所有组
cut -d: -f1 /etc/group

# ========== 用户密码管理 ==========
passwd username                    # 修改用户密码
passwd -l username                 # 锁定用户密码
passwd -u username                 # 解锁用户密码
passwd -d username                 # 删除用户密码（无密码登录）
passwd -e username                 # 强制用户下次登录修改密码
passwd -n 90 username              # 设置密码最小使用天数
passwd -x 180 username            # 设置密码最大使用天数
passwd -w 14 username             # 设置密码到期警告天数
passwd -i 30 username             # 设置密码过期后宽限期

# 非交互式修改密码
echo "username:newpassword" | chpasswd
echo "newpassword" | passwd --stdin username

# 生成加密密码（用于脚本）
openssl passwd -1 "password"
# 或
mkpasswd -m sha-512 "password"

# ========== 用户信息文件 ==========
# /etc/passwd 文件格式
# username:password:UID:GID:comment:home_directory:shell
# 示例：
# root:x:0:0:root:/root:/bin/bash
# www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin

# /etc/shadow 文件格式（需要 root 权限查看）
# username:password:last_change:min_age:max_age:warn:inactive:expire:reserved
# 示例：
# root:$6$xyz...:19000:0:99999:7:::

# /etc/group 文件格式
# group_name:password:GID:member_list
# 示例：
# sudo:x:27:user1,user2
```

**用户和组管理实战示例：**

```bash
# 场景：为一个新的 Web 项目创建用户和组

# 1. 创建项目组
groupadd -g 1000 webproject

# 2. 创建项目管理员用户
useradd -u 1000 -g webproject -G sudo -m -s /bin/bash webadmin
passwd webadmin

# 3. 创建开发用户
useradd -u 1001 -g webproject -m -s /bin/bash developer1
useradd -u 1002 -g webproject -m -s /bin/bash developer2

# 4. 设置项目目录权限
mkdir -p /var/www/webproject
chown -R webadmin:webproject /var/www/webproject
chmod -R 775 /var/www/webproject

# 5. 将开发者添加到项目组
gpasswd -a developer1 webproject
gpasswd -a developer2 webproject

# 6. 验证
id webadmin
groups developer1
getent group webproject

# 场景：禁用离职员工的账户
usermod -L username                # 锁定账户
usermod -e 2024-01-01 username    # 设置账户过期
chfn username                      # 清除 finger 信息
```

---

### 1.4 系统信息查看

**面试重点：**

系统信息查看是排查问题的基础，需要掌握各种系统监控命令。

```bash
# ========== 系统基本信息 ==========
uname -a               # 显示所有系统信息
uname -r               # 显示内核版本
uname -m               # 显示硬件架构
uname -n               # 显示主机名
uname -p               # 显示处理器类型
uname -i               # 显示硬件平台

# 输出示例：
# Linux server01 5.15.0-91-generic #101-Ubuntu SMP x86_64 GNU/Linux
# |主机名|     |内核版本|              |内核版本信息|   |硬件架构|  |操作系统|

cat /etc/os-release    # 显示操作系统详细信息
# 输出示例：
# NAME="Ubuntu"
# VERSION="22.04.3 LTS (Jammy Jellyfish)"
# ID=ubuntu
# ID_LIKE=debian
# PRETTY_NAME="Ubuntu 22.04.3 LTS"
# VERSION_ID="22.04"

lsb_release -a        # 显示发行版详细信息（需要安装 lsb-release）
cat /etc/centos-release   # CentOS 版本
cat /etc/ubuntu-release   # Ubuntu 版本
cat /etc/debian_version   # Debian 版本

# 主机名管理
hostname                    # 显示主机名
hostname server01          # 临时设置主机名
hostnamectl                # 查看主机名详细信息
hostnamectl set-hostname server01  # 永久设置主机名

# ========== 系统运行状态 ==========
top                    # 实时显示系统进程和资源使用
uptime                 # 显示系统运行时间和负载
# 输出示例：
#  14:30:25 up 45 days, 3:22, 2 users, load average: 0.52, 0.58, 0.59
# |当前时间| |运行时间| |用户数| |1分钟| |5分钟| |15分钟| 负载

free -h                # 显示内存使用情况（人类可读）
# 输出示例：
#               total        used        free      shared  buff/cache   available
# Mem:           15Gi       4.2Gi       8.5Gi       123Mi       2.3Gi        10Gi
# Swap:         2.0Gi          0B       2.0Gi

df -h                  # 显示磁盘使用情况（人类可读）
# 输出示例：
# Filesystem      Size  Used Avail Use% Mounted on
# /dev/sda1       100G   45G   55G  45% /
# tmpfs           7.8G     0  7.8G   0% /dev/shm

du -sh directory      # 显示目录大小
du -h --max-depth=1   # 显示当前目录各子目录大小
du -ah                 # 显示所有文件（包括隐藏文件）
du -sh /* 2>/dev/null | sort -hr | head -10  # 显示最大的10个目录

# ========== CPU 信息 ==========
cat /proc/cpuinfo      # CPU 详细信息
lscpu                  # CPU 概要信息
nproc                  # CPU 核心数
lstopo                 # CPU 拓扑结构（需要安装 hwloc）

# 从 /proc/cpuinfo 提取信息
cat /proc/cpuinfo | grep "model name" | head -1  # CPU 型号
cat /proc/cpuinfo | grep processor | wc -l        # CPU 核心数
cat /proc/cpuinfo | grep "cpu MHz"                # CPU 频率

# lscpu 输出示例：
# Architecture:            x86_64
# CPU op-mode(s):        32-bit, 64-bit
# Address sizes:         48 bits physical, 48 bits virtual
# Byte Order:            Little Endian
# CPUs:                  4
# Online CPUs:           0-3
# Threads per core:      2
# Cores per socket:      2
# Sockets:               1
# Vendor ID:             GenuineIntel
# Model name:            Intel(R) Core(TM) i7-10510U CPU @ 1.80GHz

# ========== 进程信息 ==========
ps aux                 # 显示所有进程详细信息
ps -ef                 # 显示进程详细信息
ps -aux                # BSD 风格显示所有进程
pstree                 # 显示进程树
pstree -p              # 显示进程树及 PID
pstree -u              # 显示用户信息
top                    # 实时显示进程状态

# 进程状态详解：
# R = Running（运行中）
# S = Sleeping（可中断睡眠）
# D = Disk Sleep（不可中断睡眠，通常等待 I/O）
# T = Stopped（已停止）
# Z = Zombie（僵尸进程）
# X = Dead（已死亡）
# I = Idle（空闲内核线程）

# ========== 内存详细信息 ==========
cat /proc/meminfo      # 内存详细信息
free -t                # 显示内存和交换空间
vmstat 1               # 虚拟内存统计
vmstat -s              # 显示内存统计摘要

# vmstat 输出示例：
# procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
#  r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
#  2  0      0 8700000 120000 2400000    0    0    50   100  100  200  5  2 90  3  0

# ========== 磁盘信息 ==========
lsblk                  # 列出块设备
lsblk -f               # 显示文件系统信息
fdisk -l               # 显示磁盘分区
parted -l              # 显示磁盘分区表
blkid                  # 显示块设备 UUID
hdparm -t /dev/sda     # 测试磁盘读取速度

# lsblk 输出示例：
# NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
# sda      8:0    0 1000G  0 disk
# ├─sda1   8:1    0   512M  0 part /boot/efi
# ├─sda2   8:2    0     1G  0 part /boot
# └─sda3   8:3    0 998.5G  0 part
#   ├─vg_root-lv_root
#   │               8:5    0    50G  0 lvm  /
#   ├─vg_root-lv_var
#   │               8:5    0   100G  0 lvm  /var
#   └─vg_root-lv_home
#                       8:5    0 848.5G  0 lvm  /home

# ========== 系统时间 ==========
date                    # 显示当前日期和时间
date -u                 # 显示 UTC 时间
timedatectl             # 查看和设置系统时间
timedatectl list-timezones  # 列出所有时区
timedatectl set-timezone Asia/Shanghai  # 设置时区
timedatectl set-time 2024-01-01  # 设置日期时间
clock                   # 显示硬件时钟
hwclock -s              # 将硬件时钟同步到系统时间
hwclock -w              # 将系统时间同步到硬件时钟

# ========== 系统负载和运行时间 ==========
cat /proc/loadavg      # 系统负载平均值
# 输出：0.52 0.58 0.59 1/245 12345
# |1分钟| |5分钟| |15分钟| |进程数| |最近PID|

uptime -s               # 系统启动时间
cat /proc/uptime        # 系统运行时间（秒）
# 输出：3897600.45 123456.78
# |系统运行时间| |空闲时间|

# ========== 系统资源限制 ==========
ulimit -a               # 查看所有资源限制
ulimit -n               # 查看打开文件数限制
ulimit -u               # 查看最大进程数
ulimit -Hs              # 硬限制（soft）
ulimit -Hu              # 硬限制（hard）

# 永久修改limits.conf
# 编辑 /etc/security/limits.conf
# 示例：
# * soft nofile 65535
# * hard nofile 65535
# root soft nofile 65535
# root hard nofile 65535
```

---

## 第二章 文件和目录操作

### 2.1 文件和目录基本操作

**面试重点：**

文件操作是 Linux 最基本的技能，需要熟练掌握各种文件操作命令。

```bash
# ========== 目录操作 ==========
ls -la                 # 列出所有文件（包括隐藏文件）及详细信息
ls -lh                 # 人性化显示文件大小
ls -lt                 # 按修改时间排序
ls -lS                 # 按文件大小排序
ls -ltr                # 按修改时间反向排序（最新的在最后）
ls -R                  # 递归列出所有子目录
ls -1                  # 每行只显示一个文件
ls -la --block-size=M  # 使用 MB 显示文件大小
ls -ld /path           # 只显示目录本身信息
tree                   # 树形显示目录结构
tree -L 2              # 只显示两层目录
tree -d                # 只显示目录
tree -a                # 显示隐藏文件
tree -h                # 显示文件大小

cd ~                   # 切换到用户主目录
cd -                   # 切换到上一次访问的目录
cd ..                  # 切换到上级目录
cd /                   # 切换到根目录
cd ../../             # 切换到上两级目录
pwd                    # 显示当前工作目录
pwd -P                 # 显示物理路径（不显示符号链接）

mkdir directory        # 创建目录
mkdir -p dir1/dir2/dir3    # 递归创建目录
mkdir -m 755 directory # 指定目录权限
mkdir -p /path/{dir1,dir2,dir3}  # 批量创建目录
rmdir directory        # 删除空目录
rm -rf directory       # 强制删除目录及其内容
rm -ri directory       # 交互式删除（每步确认）
rm -rf --preserve-root /  # 不要执行！会删除整个系统

# ========== 文件操作 ==========
touch file             # 创建空文件
touch -t 202401011200 file  # 修改文件时间戳（YYYYMMDDhhmm）
touch -a file          # 修改访问时间
touch -m file          # 修改修改时间
touch -c file          # 如果文件不存在则不创建
cp file1 file2         # 复制文件
cp -r dir1 dir2        # 复制目录
cp -p file1 file2      # 保留文件属性（时间戳、权限等）
cp -i file1 file2      # 交互式复制（覆盖前询问）
cp -v file1 file2      # 显示复制过程
cp -u file1 file2      # 只在源文件更新时复制
cp -l file1 file2      # 创建硬链接而不是复制
cp -s file1 file2      # 创建符号链接而不是复制
cp -a dir1 dir2        # 递归复制，保留所有属性
cp file{,.bak}        # 快速备份（file.bak）

mv file1 file2         # 移动/重命名文件
mv -i file1 file2      # 交互式移动
mv -v file1 file2      # 显示移动过程
mv -u file1 file2      # 只在源文件更新时移动
mv file dir/           # 移动到目录
mv file{,.new}         # 快速重命名

rm file                # 删除文件
rm -f file             # 强制删除文件
rm -i file             # 交互式删除
rm -v file             # 显示删除过程
rm -rf *               # 删除当前目录所有内容

# ========== 文件查看 ==========
cat file               # 查看文件全部内容
cat -n file            # 显示行号
cat -b file            # 显示行号（忽略空行）
cat -s file            # 压缩多个空行为一个
cat -A file            # 显示所有字符（$表示行尾，^I表示Tab）
tac file               # 倒序显示文件内容
nl file                # 显示行号（带空行）
head -n 10 file        # 查看文件前 10 行
head -n -10 file       # 查看除最后 10 行外的所有内容
tail -n 10 file        # 查看文件后 10 行
tail -f file           # 实时查看文件变化
tail -F file           # 实时查看文件变化（即使文件被删除/重建）
tail -n +10 file       # 从第 10 行开始显示到末尾
less file              # 分页查看文件（支持上下滚动）
more file              # 分页查看文件（只能向下）

# less 常用快捷键：
# 空格/pgdown - 下一页
# b/pgup   - 上一页
# g         - 跳到第一行
# G         - 跳到最后一行
# /pattern  - 搜索（n 下一个，N 上一个）
# q         - 退出

# ========== 文件统计 ==========
wc -l file             # 统计行数
wc -w file             # 统计单词数
wc -c file             # 统计字符数
wc file                # 统计行数、单词数、字符数
wc -m file             # 统计字符数（包括多字节字符）
wc -L file             # 显示最长行的长度

# 组合使用示例
cat file | wc -l       # 统计行数
ls -la | wc -l         # 统计文件数量（包括 . 和 ..）
find /path -type f | wc -l  # 统计文件数量
```

---

### 2.2 文件查找和文本处理

**面试重点：**

文件查找和文本处理是运维工作的核心技能，需要重点掌握。

**文件查找：**

```bash
# ========== find 命令详解 ==========
# 基础语法：find [路径] [选项] [动作]

# 按文件名查找
find /path -name "*.txt"
find /path -name "file.txt"
find /path -iname "file.txt"      # 忽略大小写
find /path -name "file*"          # 支持通配符
find /path -regex ".*\.txt$"      # 正则表达式匹配

# 按文件类型查找
# f = 普通文件，d = 目录，l = 符号链接
# c = 字符设备，b = 块设备，p = 管道，s = socket
find /path -type f                 # 查找文件
find /path -type d                 # 查找目录
find /path -type l                 # 查找符号链接

# 按文件大小查找
# + 表示大于，- 表示小于，无符号表示精确匹配
# b = 字节，k = KB，M = MB，G = GB
find /path -type f -size +10M      # 大于 10M 的文件
find /path -type f -size -10M      # 小于 10M 的文件
find /path -type f -size 100k      # 精确 100k 的文件
find /path -type f -size +1G       # 大于 1G 的文件
find /path -type f -size 0         # 空文件

# 按时间查找
# mtime = 修改时间，atime = 访问时间，ctime = 改变时间（权限/属性）
# n = n天前，+n = n天前之前，-n = n天之内
find /path -mtime -7               # 7 天内修改的文件
find /path -mtime +7               # 7 天前修改的文件
find /path -mtime 7                # 恰好 7 天前修改的文件
find /path -atime -1               # 1 天内访问的文件
find /path -ctime -1               # 1 天内属性改变的文件
find /path -mmin -30               # 30 分钟内修改的文件
find /path -amin +60               # 1 小时前访问的文件
find /path -newer file             # 查找比 file 新的文件
find /path -newerct "1 hour ago"  # 比指定时间更新的文件

# 按权限和所有者查找
find /path -perm 644              # 按权限精确查找
find /path -perm -644             # 包含 644 权限的文件（至少拥有这些权限）
find /path -perm /u+w             # 所有者有写权限的文件
find /path -user username          # 按所有者查找
find /path -group groupname        # 按组查找
find /path -uid 1000              # 按 UID 查找
find /path -gid 1000              # 按 GID 查找

# 按深度和目录层级
find /path -maxdepth 1             # 限制搜索深度（当前目录）
find /path -mindepth 2             # 最小搜索深度（至少在第二层）
find /path -depth 3               # 搜索深度为 3

# 查找空文件和目录
find /path -empty                  # 查找空文件或空目录

# 组合查找条件
find /path -name "*.log" -mtime -7    # 7 天内修改的 log 文件
find /path -name "*.txt" -o -name "*.md"  # txt 或 md 文件
find /path -type f ! -name "*.bak"   # 排除 bak 文件
find /path -type f \( -name "*.log" -o -name "*.txt" \)  # 使用括号组合
find /path -type d -name ".*" -prune -o -type f -print  # 排除隐藏目录

# 对找到的文件执行操作
find /path -name "*.log" -delete     # 删除找到的文件
find /path -name "*.log" -exec rm {} \;   # 删除找到的文件（每个文件执行一次）
find /path -name "*.log" -exec rm {} +     # 批量删除（更高效）
find /path -name "*.log" -exec ls -l {} \;  # 列出找到的文件
find /path -name "*.txt" -exec wc -l {} +   # 统计每个文件行数

# 使用 -exec 的高级用法
find /path -type f -exec chmod 644 {} \;   # 修改权限
find /path -type f -exec chown user:group {} \;
find /path -type f -exec grep -l "keyword" {} +  # 搜索包含关键词的文件
find /path -type f -ok rm {} \;          # 交互式确认后删除

# 查找并复制文件
find /path -name "*.jpg" -exec cp {} /dest/ \;

# 使用 xargs（更高效）
find /path -name "*.log" | xargs rm
find /path -name "*.log" | xargs -I {} cp {} /dest/
find /path -type f -print0 | xargs -0 rm   # 处理文件名包含空格的情况

# ========== locate 命令 ==========
# locate 使用数据库快速查找文件，需要先运行 updatedb 更新数据库
locate file                    # 快速查找文件
locate -i file                 # 忽略大小写查找
locate -c file                 # 统计匹配数量
locate -l 10 file              # 限制输出数量
locate -r ".*\.log$"           # 使用正则表达式
updatedb                       # 更新文件数据库（需要 root）

# locate 与 find 的对比：
# locate：快速，需要数据库，查找已索引的文件
# find：灵活，实时搜索，功能强大

# ========== which 和 whereis ==========
which command                  # 查找命令的完整路径
which -a command               # 查找所有同名命令位置
whereis command                # 查找命令的二进制、源码和手册位置
type command                   # 显示命令类型（内置/别名/外部）
type -a command                # 显示命令的所有位置

# ========== xargs 命令 ==========
# xargs 将标准输入转换为命令行参数
echo "file1 file2 file3" | xargs rm
ls *.txt | xargs wc -l
find /path -name "*.log" | xargs -n 1 gzip  # 逐个压缩
find /path -name "*.log" | xargs -P 4 gzip  # 并行压缩（4个进程）
```

**文本搜索：**

```bash
# ========== grep 命令详解 ==========
# 基础语法：grep [选项] 模式 [文件...]

# 基础搜索
grep "keyword" file                 # 在文件中搜索关键词
grep -r "keyword" /path            # 递归搜索目录
grep -R "keyword" /path            # 递归搜索（包含符号链接）

# 忽略大小写
grep -i "keyword" file              # 忽略大小写搜索

# 显示行号和上下文
grep -n "keyword" file              # 显示行号
grep -v "keyword" file              # 反向匹配（显示不包含关键词的行）
grep -w "keyword" file              # 单词匹配
grep -c "keyword" file              # 统计匹配行数
grep -l "keyword" file1 file2       # 只显示文件名
grep -L "keyword" file1 file2       # 显示不匹配的文件名

# 显示上下文
grep -A 3 "keyword" file            # 显示匹配行及后 3 行（After）
grep -B 3 "keyword" file            # 显示匹配行及前 3 行（Before）
grep -C 3 "keyword" file            # 显示匹配行及前后各 3 行（Context）
grep -A 2 -B 2 "keyword" file       # 显示前后各 2 行

# 颜色高亮
grep --color=auto "keyword" file    # 高亮显示匹配内容

# 使用正则表达式
grep -E "pattern" file              # 扩展正则表达式（等同于 egrep）
grep -G "pattern" file              # 基本正则表达式（默认）
grep -P "pattern" file              # Perl 正则表达式

# 基本正则表达式元字符
grep "^keyword" file                # 匹配行首（^）
grep "keyword$" file                # 匹配行尾（$）
grep "k.w" file                    # 匹配任意单字符（.）
grep "k*" file                      # 匹配 0 或多个前驱字符（*）
grep "k\{2,4\}" file               # 匹配 2-4 个前驱字符（\{ \}")
grep "[abc]" file                   # 匹配字符集合中的任意一个
grep "[^abc]" file                  # 匹配不在字符集合中的任意一个
grep "k\{2,\}" file                 # 匹配至少 2 个 k

# 扩展正则表达式元字符
grep -E "error|warning" file        # 匹配 error 或 warning（|）
grep -E "error+" file               # 匹配一个或多个 error（+）
grep -E "error?" file               # 匹配 0 或 1 个 error（?）
grep -E "(error)" file              # 分组
grep -E "error{2,4}" file           # 匹配 2-4 个 error

# 管道组合使用
ps aux | grep nginx                # 查找 nginx 进程
cat log.txt | grep -i error        # 查找错误日志
ls -la | grep "^d"                 # 查找目录
df -h | grep "/dev/sd"             # 查找特定磁盘
history | grep git                 # 查找历史命令

# 排除特定文件或目录
grep -r "keyword" /path --exclude="*.log"
grep -r "keyword" /path --exclude-dir={node_modules,.git}

# 多重模式匹配
grep -e "error" -e "warning" file   # 多个模式
grep -f pattern.txt file            # 从文件读取模式
grep -E "^(error|warning)" file    # 组合模式

# 输出控制
grep -q "keyword" file              # 静默模式（只返回退出状态）
grep -s "keyword" file              # 忽略错误消息
grep -m 5 "keyword" file            # 最多匹配 5 行

# ========== egrep 命令 ==========
# 等同于 grep -E
egrep "pattern1|pattern2" file      # 多个模式匹配
egrep "(error|warning)" log.txt    # 匹配 error 或 warning
egrep -o "([0-9]{1,3}\.){3}[0-9]{1,3}" file  # 提取 IP 地址

# ========== fgrep 命令 ==========
# 不解析正则表达式（快速 grep）
fgrep "keyword" file                # 按字面意思搜索
```

**文本处理工具：**

```bash
# ========== awk 命令详解 ==========
# awk 是强大的文本分析工具，适合处理结构化文本

# 基础用法
awk '{print $1}' file               # 打印第一列（$1 = 第一列，$0 = 整行）
awk -F',' '{print $2}' file        # 指定分隔符为逗号
awk -F'[:\t]' '{print $2}' file   # 指定多个分隔符
awk 'NR==5' file                   # 打印第 5 行
awk 'NR>=5 && NR<=10' file         # 打印第 5-10 行

# 内置变量
# NR = 当前记录号（行号）
# NF = 当前记录的字段数（列数）
# $0 = 整行记录
# $1, $2, ... = 第1、2、...个字段
# FS = 输入字段分隔符（默认空格）
# OFS = 输出字段分隔符
# RS = 输入记录分隔符（默认换行）
# ORS = 输出记录分隔符
# FILENAME = 当前文件名

awk '{print NR, $0}' file           # 打印行号和整行
awk '{print NF}' file               # 打印每行字段数
awk '{print "行号:" NR, "字段数:" NF}' file

# 指定输出分隔符
awk -F',' '{print $1, $2}' OFS='|' file

# 条件过滤
awk '/error/' file                 # 包含 error 的行
awk '$1 > 100' file                # 第一列大于 100 的行
awk '$2 == "active"' file          # 第二列等于 active 的行
awk '$3 ~ /pattern/' file          # 第三列匹配模式的行
awk '$3 !~ /pattern/' file         # 第三列不匹配模式的行

# 关系运算符
# == 等于，!= 不等于，> 大于，< 小于，>= 大于等于，<= 小于等于

# BEGIN 和 END 块
awk 'BEGIN {print "开始"} {print} END {print "结束"}' file
awk 'BEGIN {sum=0} {sum+=$1} END {print sum}' file  # 求和

# 字符串函数
awk '{print length($0)}' file      # 打印每行长度
awk '{print toupper($1)}' file     # 打印第一列的大写
awk '{print tolower($1)}' file     # 打印第一列的小写
awk '{print substr($1,1,5)}' file  # 打印第一列的前 5 个字符
awk '{print index($1, "abc")}' file  # 查找字符串位置
awk '{print match($1, /[0-9]+/)}' file  # 正则匹配位置

# 数组操作
awk '{count[$1]++} END {for (item in count) print item, count[item]}' file
awk '{sum[$1]+=$2} END {for (k in sum) print k, sum[k]}' file

# 计算统计
awk '{sum+=$1} END {print sum}' file                    # 求和
awk '{sum+=$1; count++} END {print sum/count}' file     # 平均值
awk 'BEGIN {max=0} {if ($1>max) max=$1} END {print max}' file  # 最大值
awk 'BEGIN {min=999999} {if ($1<min) min=$1} END {print min}' file  # 最小值

# 格式化输出
awk '{printf "%-10s %5d\n", $1, $2}' file   # printf 格式化
awk '{print $1 > "output.txt"}' file       # 输出到文件
awk '{print $1 | "sort"}' file              # 管道输出

# 实战示例
# 1. 统计日志中每个 IP 的访问次数
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -rn

# 2. 统计每个状态码的数量
awk '{print $9}' /var/log/nginx/access.log | sort | uniq -c

# 3. 统计总流量
awk '{sum+=$10} END {print sum/1024/1024 " MB"}' /var/log/nginx/access.log

# 4. 提取特定字段
awk -F',' '{print $1, $NF}' file  # 第一列和最后一列
awk '{print $(NF-1)}' file        # 倒数第二列

# 5. 多条件过滤
awk '$1 > 100 && $2 == "active"' file

# 6. 计算百分比
awk '{sum+=$1} END {for(k in sum) print k, sum[k]/total*100}' file

# ========== sed 命令详解 ==========
# sed 是流编辑器，用于对文本进行替换、删除、插入等操作

# 基础替换
sed 's/old/new/' file              # 替换每行第一个 old 为 new
sed 's/old/new/g' file             # 替换所有 old 为 new（global）
sed 's/old/new/1' file             # 替换每行第一个 old
sed 's/old/new/2' file             # 替换每行第二个 old

# 替换修饰符
sed 's/old/new/gi' file            # 忽略大小写替换（g=global, i=ignore）
sed 's/old/new/p' file             # 替换后打印（与 -n 配合使用）

# 地址指定（行号或模式）
sed '1,5s/old/new/g' file          # 替换第 1-5 行
sed '5,$s/old/new/g' file         # 从第 5 行到末尾
sed '/pattern/s/old/new/g' file   # 替换包含 pattern 的行
sed '/pattern/,/pattern2/s/old/new/g' file  # 模式范围内的行

# 原地编辑
sed -i 's/old/new/g' file         # 原地替换
sed -i.bak 's/old/new/g' file     # 备份后原地替换

# 删除操作
sed '1d' file                      # 删除第 1 行
sed '1,5d' file                   # 删除第 1-5 行
sed '$d' file                     # 删除最后一行
sed '/pattern/d' file              # 删除匹配的行
sed '/^$/d' file                  # 删除空行
sed '/pattern/!d' file            # 只保留匹配的行

# 插入操作
sed '1i\text' file                # 在第 1 行前插入文本
sed '1a\text' file                # 在第 1 行后追加文本
sed '/pattern/i\text' file        # 在匹配行前插入
sed '/pattern/a\text' file        # 在匹配行后追加

# 多重编辑
sed -e 's/old1/new1/g' -e 's/old2/new2/g' file
sed 's/old1/new1/g; s/old2/new2/g' file

# 打印操作
sed -n '1,5p' file               # 打印第 1-5 行
sed -n '5p' file                 # 打印第 5 行
sed -n '/pattern/p' file          # 打印匹配的行（与 -n 配合）
sed -n '$p' file                 # 打印最后一行

# 读写操作
sed 'r file2' file1               # 读取 file2 插入到 file1 每行后
sed 'w file2' file1               # 写入到 file2

# 使用正则表达式
sed -E 's/([0-9]+)/[\1]/g' file   # 扩展正则
sed 's/\(old\)/[\1]/g' file       # 基本正则，分组

# 实战示例
# 1. 替换配置文件中的值
sed -i 's/old_value/new_value/g' config.conf

# 2. 删除注释行
sed '/^#/d' file

# 3. 删除空行和注释
sed '/^#\|^$/d' file

# 4. 在行首添加内容
sed 's/^/prefix/' file

# 5. 在行尾添加内容
sed 's/$/suffix/' file

# 6. 提取 IP 地址
sed -nE 's/.*([0-9]{1,3}\.){3}[0-9]{1,3}.*/\1/p' file

# 7. 大小写转换
sed 's/[a-z]/\U&/g' file          # 转大写
sed 's/[A-Z]/\L&/g' file          # 转小写

# 8. 数字递增
sed '=' file | sed 'N;s/\n/ /'    # 添加行号

# ========== sort 命令 ==========
sort file                           # 按默认顺序排序（字典序）
sort -r file                       # 反向排序
sort -n file                       # 数字排序
sort -n -r file                    # 数字反向排序
sort -k2 file                      # 按第二列排序
sort -k2,2n file                   # 按第二列数字排序
sort -t',' -k2 file                # 指定分隔符（逗号）
sort -u file                       # 去重排序
sort -c file                       # 检查是否已排序
sort -M file                       # 按月份排序
sort -b file                       # 忽略前导空白
sort -f file                       # 忽略大小写
sort -h file                       # 人性化数字排序（1K, 1M, 1G）

# 实战示例
# 1. 按文件大小排序
ls -l | sort -k5 -h

# 2. 按访问时间排序
ls -lt | sort -k6 -M

# ========== uniq 命令 ==========
uniq file                           # 去除相邻重复行
uniq -c file                       # 统计每行出现次数
uniq -d file                       # 只显示重复行
uniq -u file                       # 只显示不重复的行
uniq -i file                       # 忽略大小写
uniq -f 1 file                     # 跳过前 1 个字段比较

# 组合使用
sort file | uniq                   # 先排序再去重
sort file | uniq -c                 # 统计重复次数
sort file | uniq -d                 # 只显示重复行

# ========== cut 命令 ==========
cut -d',' -f1 file                 # 提取第一列（逗号分隔）
cut -d',' -f1,3 file               # 提取第 1 和 3 列
cut -d',' -f1-3 file               # 提取第 1-3 列
cut -c1-10 file                   # 提取第 1-10 个字符
cut -c1,3,5 file                  # 提取第 1,3,5 个字符
cut -c-10 file                    # 提取前 10 个字符
cut -c10- file                    # 从第 10 个字符开始
cut -b1-1024 file                 # 按字节提取
cut --output-delimiter=':' file   # 指定输出分隔符

# ========== tr 命令 ==========
tr 'a-z' 'A-Z' < file              # 转换为大写
tr 'A-Z' 'a-z' < file              # 转换为小写
tr -d 'a' < file                  # 删除字符 a
tr -d '[:space:]' < file           # 删除所有空白字符
tr -s ' ' < file                   # 压缩空格
tr -s '[:space:]' < file          # 压缩所有空白字符
tr -c 'a-z' ' ' < file            # 保留字母，其他替换为空格

# 实战示例
# 1. 删除 Windows 行尾符
tr -d '\r' < windows.txt > linux.txt

# 2. 将制表符转换为空格
tr -s '\t' ' ' < file

# 3. 统计字符种类
tr -cs '[:alnum:]' '\n' < file | sort -u | wc -l
```

---

### 2.3 硬链接和软链接

**面试重点：**

理解硬链接和软链接的区别是文件系统操作的重点。

**硬链接：**

- 多个文件指向同一个 inode
- 不能跨文件系统
- 不能对目录创建硬链接
- 删除源文件不影响硬链接
- 硬链接数大于 1 时，删除一个不影响其他

```bash
# 创建硬链接
ln source_file link_name

# 查看硬链接数
ls -l file
# 输出第二列即为链接数

# 查看 inode 号
ls -li file
stat file | grep Inode
```

**软链接（符号链接）：**

- 类似于 Windows 快捷方式
- 可以跨文件系统
- 可以对目录创建软链接
- 删除源文件软链接失效（变成断开的链接）
- 软链接有独立 inode

```bash
# 创建软链接
ln -s source_file link_name
ln -s /absolute/path/file link_name
ln -s ../relative/path/file link_name

# 创建目录软链接
ln -s /source/dir link_dir

# 查看链接
ls -l file
# 链接文件以 l 开头，箭头指向源文件

# 读取链接指向
readlink link_name
readlink -f link_name              # 显示完整路径

# 删除链接
rm link_name
unlink link_name                   # 删除链接（更安全）

# 修改链接
ln -sf new_source link_name        # 重新创建链接
```

**硬链接和软链接对比：**

| 特性 | 硬链接 | 软链接 |
|------|--------|--------|
| 本质 | 同一个文件的多个名称 | 指向另一个文件的路径 |
| inode | 相同 | 不同 |
| 跨文件系统 | 不支持 | 支持 |
| 目录 | 不支持 | 支持 |
| 删除源文件 | 不影响 | 链接失效 |
| 链接数 | 可能大于 1 | 始终为 1 |
| 性能 | 稍好 | 稍差 |

**实战示例：**

```bash
# 场景 1：为重要文件创建硬链接备份
ln /data/important.txt /backup/important.txt

# 场景 2：创建目录软链接方便访问
ln -s /var/www/html/project /home/user/project

# 场景 3：查看文件的所有硬链接
find / -inum [inode_number] 2>/dev/null

# 场景 4：查找断开的软链接
find /path -type l ! -exec test -e {} \; -print

# 场景 5：修复断开的软链接
ln -sf /new/target old_link
```

---

### 2.4 文件打包和压缩

```bash
# ========== tar 命令 ==========
# tar 只是打包，不压缩

# 创建 tar 包
tar -cvf archive.tar directory/    # 创建 tar 包（verbose, file）
tar -cvf archive.tar file1 file2   # 打包多个文件

# 解压 tar 包
tar -xvf archive.tar              # 解压 tar 包（extract, verbose, file）
tar -xvf archive.tar -C /path/     # 解压到指定目录

# 查看 tar 包内容
tar -tvf archive.tar              # 列出文件列表
tar -tvf archive.tar | head -20   # 查看前 20 个文件

# 追加文件到 tar 包
tar -rvf archive.tar newfile      # 追加文件
tar -uvf archive.tar directory/    # 更新文件

# 从 tar 包中删除文件
tar --delete -f archive.tar file  # 删除特定文件

# 压缩选项（gzip/bzip2/xz）
# -z: gzip (.tar.gz, .tgz)
# -j: bzip2 (.tar.bz2, .tbz)
# -J: xz (.tar.xz)

tar -czvf archive.tar.gz directory/   # gzip 压缩
tar -cjvf archive.tar.bz2 directory/ # bzip2 压缩
tar -cJvf archive.tar.xz directory/ # xz 压缩

# 解压选项
tar -xzvf archive.tar.gz           # gzip 解压
tar -xjvf archive.tar.bz2          # bzip2 解压
tar -xJvf archive.tar.xz           # xz 解压

# 自动识别格式解压
tar -xf archive.tar.gz
tar -xf archive.tar.bz2
tar -xf archive.tar.xz

# 常用选项组合
tar -czf archive.tar.gz -C /source .  # 从源目录压缩
tar -xzf archive.tar.gz --strip-components=1  # 去除顶层目录

# 排除文件
tar -czvf archive.tar.gz directory/ --exclude='*.log' --exclude='node_modules'

# ========== zip 命令 ==========
zip archive.zip file1 file2       # 压缩文件
zip -r archive.zip directory/    # 压缩目录
zip -r archive.zip dir1 dir2     # 压缩多个目录
zip -e archive.zip file          # 加密压缩（会提示输入密码）
zip -P password archive.zip file # 加密压缩（命令行）

# 解压
unzip archive.zip                 # 解压
unzip archive.zip -d /path/       # 解压到指定目录
unzip -l archive.zip              # 查看内容
unzip -o archive.zip             # 覆盖解压
unzip -n archive.zip             # 不覆盖已存在的文件
unzip -P password archive.zip    # 解压加密文件

# ========== gzip 命令 ==========
gzip file                         # 压缩文件（删除原文件，生成 .gz）
gzip -d file.gz                  # 解压文件
gzip -k file                     # 保留原文件
gzip -c file > file.gz           # 输出到标准输出
gzip -r directory/               # 递归压缩目录下所有文件
gzip -l file.gz                  # 查看压缩信息
gzip -9 file                     # 最高压缩比
gzip -1 file                     # 最快压缩速度
gunzip file.gz                   # 解压（等同于 gzip -d）

# 常用组合
cat file | gzip > file.gz        # 管道压缩
zcat file.gz | less              # 查看压缩文件内容
zgrep "pattern" file.gz          # 搜索压缩文件
zdiff file1.gz file2.gz          # 比较压缩文件
zcat file.gz | wc -l             # 统计压缩文件行数

# ========== bzip2 命令 ==========
bzip2 file                       # 压缩文件
bunzip2 file.bz2                 # 解压文件
bzip2 -k file                    # 保留原文件
bzcat file.bz2                   # 查看压缩文件内容
bzgrep "pattern" file.bz2        # 搜索压缩文件
bzless file.bz2                  # 分页查看

# ========== xz 命令 ==========
xz file                          # 压缩文件
xz -d file.xz                    # 解压文件
xz -k file                       # 保留原文件
xz -l file.xz                    # 查看压缩信息
xz -9 file                       # 最高压缩比
xz -0 file                       # 最快压缩速度
xzcat file.xz                    # 查看压缩文件内容
xzgrep "pattern" file.xz        # 搜索压缩文件

# 压缩比对比（示例）
# 原始文件：100MB
# gzip:   ~25MB（压缩快，解压快）
# bzip2:  ~20MB（压缩慢，解压慢）
# xz:     ~18MB（压缩最慢，解压最慢）
```

---

## 第三章 进程和服务管理

### 3.1 进程查看和管理

**面试重点：**

进程管理是系统运维的核心技能，需要熟练掌握进程查看和控制命令。

```bash
# ========== 进程查看 ==========
ps                      # 显示当前终端的进程
ps aux                  # 显示所有进程详细信息（BSD 风格）
ps -ef                  # 显示进程详细信息（System V 风格）
ps -eLf                 # 显示所有进程的线程信息
ps -u username          # 显示指定用户的进程
ps -ef | grep process   # 查找特定进程
ps --sort=-%cpu         # 按 CPU 使用排序
ps --sort=-%mem         # 按内存使用排序
ps -eo pid,ppid,cmd,%mem,%cpu --sort=-%cpu  # 自定义输出格式

pgrep process           # 查找进程 PID（返回 PID 列表）
pgrep -f "pattern"      # 按命令模式匹配
pgrep -u username      # 按用户匹配
pgrep -a               # 显示完整命令

pkill process           # 终止进程（按名称）
pkill -9 process        # 强制终止进程
pkill -f "pattern"     # 按命令模式匹配
pkill -u username      # 终止用户所有进程

# ps 输出字段说明：
# PID    - 进程 ID
# TTY    - 终端设备
# TIME   - CPU 时间
# CMD    - 命令
# USER   - 用户
# %CPU   - CPU 使用率
# %MEM   - 内存使用率
# VSZ    - 虚拟内存大小（KB）
# RSS    - 物理内存大小（KB）
# STAT   - 进程状态

# 进程状态说明：
# R = Running（运行中）
# S = Sleeping（可中断睡眠）
# D = Disk Sleep（不可中断睡眠）
# T = Stopped（已停止）
# Z = Zombie（僵尸进程）
# X = Dead（已死亡）
# I = Idle（空闲内核线程）
# 附加状态：
# < = 高优先级
# N = 低优先级
# L = 有页面锁定在内存中
# s = 会话领导进程
# l = 多线程进程
# + = 前台进程组

# 进程排序
ps aux --sort=-%cpu     # 按 CPU 使用排序
ps aux --sort=-%mem    # 按内存使用排序
ps -eo pid,ppid,%mem,%cpu,cmd --sort=-%cpu | head  # 前 10 CPU 占用进程

# ========== top 命令详解 ==========
top                    # 实时显示进程状态
top -u username        # 只显示指定用户的进程
top -p PID             # 监控指定进程
top -d 1               # 刷新间隔为 1 秒
top -n 5               # 刷新 5 次后退出
top -b                 # 批处理模式（适合脚本）
top -c                 # 显示完整命令

# top 交互命令（运行 top 后按键盘）
# h: 显示帮助
# q: 退出
# k: 终止进程（输入 PID 和信号）
# r: 调整进程优先级（renice）
# M: 按内存使用排序
# P: 按 CPU 排序（默认）
# N: 按 PID 排序
# T: 按运行时间排序
# l: 显示/隐藏负载信息
# t: 显示/隐藏任务和 CPU 信息
# m: 显示/隐藏内存信息
# f: 选择显示字段
# o: 调整字段顺序
# 1: 显示所有 CPU 核心
# 2: 显示 CPU 概要
# z: 切换颜色模式
# b: 切换高亮
# x: 排序列高亮
# <: 切换排序列
# >: 切换排序列
# R: 反向排序

# top 输出说明：
# 第一行：系统时间、运行时间、用户数、负载平均值
# 第二行：进程统计（总进程数、运行、睡眠、停止、僵尸）
# 第三行：CPU 状态（用户、系统、空闲、iowait 等）
# 第四行：内存状态（总量、使用、空余、缓存）
# 第五行：交换空间状态
# 进程列表：
# PID    - 进程 ID
# USER   - 用户
# PR     - 优先级
# NI     - Nice 值（-20 到 19）
# VIRT   - 虚拟内存
# RES    - 物理内存（常驻内存）
# SHR    - 共享内存
# S      - 状态
# %CPU   - CPU 使用率
# %MEM   - 内存使用率
# TIME+  - CPU 时间
# COMMAND - 命令

# top 高级用法
# 批量输出（用于监控脚本）
top -bn1 | head -20
top -bn1 | grep "Cpu(s)" | awk '{print $2}'  # 获取 CPU 使用率

# ========== htop 命令 ==========
# top 的增强版，需要单独安装
# Ubuntu/Debian
apt install htop
# CentOS/RHEL
yum install htop

htop                    # 交互式进程查看
htop -u username        # 只显示指定用户
htop -d 1               # 刷新间隔
htop -p PID1,PID2       # 监控指定进程

# htop 交互命令：
# F1: 帮助
# F2: 设置（显示列、颜色等）
# F3: 搜索进程
# F4: 过滤器
# F5: 树形视图
# F6: 排序
# F7/F8: 降低/提高优先级
# F9: 终止进程
# F10: 退出

# ========== iotop 命令 ==========
# 查看进程 I/O 使用情况（需要 root 权限）
apt install iotop

iotop                   # 查看 I/O 使用情况
iotop -o               # 只显示正在使用 I/O 的进程
iotop -b               # 批处理模式
iotop -n 3             # 刷新 3 次后退出
iotop -p PID           # 监控指定进程

# iotop 输出说明：
# TID   - 线程 ID
# PRIO  - 优先级
# USER  - 用户
# DISK READ  - 读取速度
# DISK WRITE - 写入速度
# SWAPIN   - 交换空间使用
# IO      - I/O 百分比
# COMMAND  - 命令

# ========== lsof 命令 ==========
# 查看进程打开的文件
lsof                    # 列出所有打开的文件
lsof -i                 # 查看所有网络连接
lsof -i :80             # 查看端口 80 被谁占用
lsof -i tcp:80         # 查看 TCP 端口 80
lsof -p PID            # 查看指定进程打开的文件
lsof -u username       # 查看指定用户打开的文件
lsof +D /path          # 查看目录下打开的文件
lsof -c process        # 查看指定命令打开的文件
lsof -a -p PID -i      # 组合条件（AND）

# 常用场景
lsof -i                 # 查看所有网络连接
lsof -i :80            # 查看 80 端口占用
lsof /path/to/file     # 查看打开特定文件的进程
lsof +L1               # 查看打开文件数小于 1 的（已删除但未释放）
lsof -i -n             # 显示 IP（不解析主机名）

# ========== pstree 命令 ==========
pstree                 # 显示进程树
pstree -p              # 显示进程树及 PID
pstree -u              # 显示用户信息
pstree -h              # 高亮当前进程及其祖先
pstree PID             # 显示指定进程的进程树

# ========== 进程详细信息查看 ==========
# 查看进程的详细信息
cat /proc/PID/status   # 进程状态
cat /proc/PID/cmdline  # 命令行参数
cat /proc/PID/environ  # 环境变量
ls -la /proc/PID/fd    # 进程打开的文件描述符
cat /proc/PID/maps     # 进程内存映射
```

---

### 3.2 进程控制

```bash
# ========== 信号列表 ==========
# Linux 信号是进程间通信的一种方式
# 常用信号：
# 1   SIGHUP   - 挂起，重新加载配置
# 2   SIGINT   - 中断（Ctrl+C）
# 3   SIGQUIT  - 退出（Ctrl+\）
# 9   SIGKILL  - 强制终止（不可捕获）
# 15  SIGTERM  - 终止（默认）
# 18  SIGCONT  - 继续运行
# 19  SIGSTOP  - 暂停（不可捕获）
# 20  SIGTSTP  - 暂停（Ctrl+Z）

# ========== 进程终止 ==========
kill PID                # 正常终止进程（发送 SIGTERM）
kill -15 PID            # 发送 SIGTERM 信号（默认）
kill -9 PID             # 强制终止进程（发送 SIGKILL）
kill -1 PID             # 重新加载配置（发送 SIGHUP）
kill -2 PID             # 相当于 Ctrl+C（发送 SIGINT）
kill -19 PID            # 暂停进程（发送 SIGSTOP）
kill -18 PID            # 恢复进程（发送 SIGCONT）

# 按进程名终止进程
killall process_name    # 终止所有同名进程
killall -9 process_name # 强制终止
pkill process_name
pkill -9 process_name
pkill -f "pattern"     # 按命令模式匹配

# 查看可用的信号
kill -l
# 或
trap -l

# ========== 进程优先级 ==========
# Nice 值范围：-20（最高优先级）到 19（最低优先级）
# 普通用户只能设置 0-19（降低优先级）
# root 用户可以设置 -20 到 19

nice -n 10 command      # 以 nice 值 10 启动命令
nice -10 command        # 以 nice 值 10 启动命令
nice --10 command       # 以 nice 值 -10 启动命令

# 修改运行中的进程优先级
renice +10 PID          # 修改进程 nice 值
renice -5 -u username  # 修改用户所有进程 nice 值
renice 5 -p PID1 PID2  # 修改多个进程

# 查看进程 nice 值
ps -eo pid,ni,cmd

# ========== 进程前后台切换 ==========
command &               # 后台运行命令
Ctrl + Z                # 暂停前台进程并放入后台
jobs                    # 列出所有后台作业
jobs -l                 # 显示 PID
fg                      # 将后台进程恢复到前台
fg %1                   # 将作业 1 恢复到前台
bg                      # 后台继续运行暂停的进程
bg %1                   # 后台继续作业 1

# nohup 命令 - 后台运行，忽略 SIGHUP 信号
nohup command &                  # 后台运行
nohup command > output.log 2>&1 &   # 重定向输出
# 说明：nohup 会忽略 SIGHUP 信号，即使终端关闭进程也会继续运行
# 2>&1 表示将错误输出重定向到标准输出

# ========== screen 命令 ==========
# screen 是终端多路复用器，可以在单个终端中运行多个会话

# 安装
apt install screen
yum install screen

# 基本使用
screen -S name          # 创建命名会话
screen -S dev           # 创建名为 dev 的会话
screen -ls              # 列出所有会话
screen -r name          # 重新连接会话
screen -r PID          # 按 PID 重新连接
screen -d name          # 分离会话
screen -d -r name       # 分离并重新连接
screen -X -S sessionname quit  # 终止会话

# screen 会话内快捷键（需要先按 Ctrl+a）
Ctrl + a + d           # 分离当前会话
Ctrl + a + c           # 创建新窗口
Ctrl + a + n           # 切换到下一个窗口
Ctrl + a + p           # 切换到上一个窗口
Ctrl + a + 0-9         # 切换到指定编号窗口
Ctrl + a + "           # 列出所有窗口
Ctrl + a + A           # 重命名当前窗口
Ctrl + a + k           # 关闭当前窗口
Ctrl + a + \           # 关闭所有窗口并退出
Ctrl + a + S           # 水平分割窗口
Ctrl + a + |           # 垂直分割窗口
Ctrl + a + Tab         # 切换分割窗口
Ctrl + a + X           # 关闭当前分割窗口
Ctrl + a + ?           # 帮助

# 实战示例
screen -S deploy
# 执行部署命令
Ctrl + a + d  # 分离会话
screen -ls    # 查看会话
screen -r deploy  # 重新连接

# ========== tmux 命令 ==========
# 另一个终端多路复用器，功能类似但更现代

# 安装
apt install tmux

# 基本使用
tmux new -s name        # 创建命名会话
tmux ls                # 列出所有会话
tmux attach -t name    # 连接会话
tmux detach            # 分离会话（Ctrl+b d）
tmux kill-session -t name  # 终止会话

# tmux 快捷键（默认 Ctrl+b）
Ctrl + b + %           # 垂直分割
Ctrl + b + "           # 水平分割
Ctrl + b + o           # 切换分割窗口
Ctrl + b + x           # 关闭当前分割
Ctrl + b + c           # 创建新窗口
Ctrl + b + n/p         # 切换窗口
Ctrl + b + 0-9         # 切换到指定窗口
Ctrl + b + ,           # 重命名窗口
Ctrl + b + d           # 分离会话
Ctrl + b + [           # 进入复制模式（q 退出）
Ctrl + b + ?           # 帮助

# tmux 配置文件 ~/.tmux.conf
# 示例：
# set -g prefix C-a    # 修改前缀键为 Ctrl+a
# unbind C-b
# set -g mouse on     # 启用鼠标支持

# ========== 守护进程（Daemon）==========
# 守护进程是在后台运行的系统服务

# 创建守护进程的基本方法
# 1. 使用 nohup
nohup /path/to/script.sh &

# 2. 使用 screen/tmux

# 3. 使用 systemd（推荐）

# 4. 使用 daemon 函数（Bash）
# 在脚本中使用
daemonize() {
    exec 0</dev/null
    exec 1>>/var/log/mydaemon.log
    exec 2>>/var/log/mydaemon.error
}
```

---

### 3.3 服务管理

**面试重点：**

服务管理是 Linux 运维的核心工作，需要掌握 systemd 和 service 命令。

**systemd (CentOS 7+/Ubuntu 16.04+)：**

```bash
# 服务管理
systemctl start nginx       # 启动服务
systemctl stop nginx        # 停止服务
systemctl restart nginx     # 重启服务
systemctl reload nginx      # 重新加载配置（不重启）
systemctl status nginx      # 查看服务状态
systemctl is-active nginx   # 检查服务是否运行（返回 active/inactive）
systemctl is-enabled nginx # 检查服务是否开机自启（返回 enabled/disabled）
systemctl show nginx        # 显示服务详细信息

# 开机自启管理
systemctl enable nginx      # 设置开机自启
systemctl disable nginx     # 禁用开机自启
systemctl daemon-reload     # 重新加载 systemd 配置（修改单元文件后）
systemctl mask nginx        # 禁用服务（无法手动启动）
systemctl unmask nginx      # 取消禁用

# 服务列表
systemctl list-units       # 列出所有单元
systemctl list-unit-files  # 列出所有单元文件
systemctl list-dependencies nginx  # 列出服务依赖
systemctl list-sockets     # 列出所有 socket 单元

# 查看日志
journalctl -u nginx        # 查看服务日志
journalctl -u nginx -f    # 实时查看服务日志
journalctl --since today  # 查看今天日志
journalctl --since "1 hour ago"  # 查看最近 1 小时
journalctl -p err         # 查看错误级别及以上日志
journalctl -b             # 查看本次启动日志
journalctl -k             # 查看内核日志

# 服务详细信息
systemctl show nginx      # 显示服务详细信息
systemctl cat nginx       # 查看服务单元文件内容
systemctl edit nginx      # 编辑服务单元文件
systemctl edit nginx --full  # 编辑完整配置文件

# 重新加载所有服务
systemctl daemon-reload

# 重启所有服务（仅限 systemd）
systemctl reboot          # 重启系统
systemctl poweroff        # 关机
systemctl suspend         # 挂起
systemctl hibernate       # 休眠

# 常用服务管理
systemctl status nginx mysql php-fpm docker sshd firewalld

# 检查服务是否开机自启
systemctl is-enabled nginx
systemctl is-enabled nginx.service
```

**service 命令（传统 SysV init）：**

```bash
# 传统 init 脚本管理
service nginx start
service nginx stop
service nginx restart
service nginx reload
service nginx status
service --status-all     # 查看所有服务状态

# 服务脚本位置
ls /etc/init.d/

# 添加服务到启动项（SysV）
# Ubuntu/Debian
update-rc.d service_name defaults
update-rc.d service_name enable
update-rc.d service_name disable

# CentOS/RHEL
chkconfig --list service_name
chkconfig service_name on
chkconfig service_name off
```

**systemd 单元文件详解：**

```ini
# /etc/systemd/system/myapp.service

[Unit]
Description=My Application Service    # 服务描述
After=network.target                  # 在网络启动后启动
After=network-online.target          # 在网络在线后启动
Wants=network-online.target          # 弱依赖（网络在线但服务不依赖）
Requires=network.target               # 强依赖（网络启动才能启动）

[Service]
Type=simple                          # 服务类型
# simple:    简单服务（默认）
# forking:   fork 后台运行
# oneshot:   执行一次退出
# notify:    启动完成发送通知
# idle:      空闲时启动

User=www-data                       # 运行用户
Group=www-data                      # 运行组
WorkingDirectory=/var/www/myapp     # 工作目录
ExecStart=/usr/bin/node /var/www/myapp/server.js  # 启动命令
ExecStartPre=/usr/bin/script/pre.sh   # 启动前执行的脚本
ExecStartPost=/usr/bin/script/post.sh  # 启动后执行的脚本
ExecStop=/usr/bin/script/stop.sh    # 停止命令
ExecReload=/bin/kill -HUP $MAINPID   # 重载命令

Restart=always                      # 重启策略
# always:    总是重启
# on-failure: 失败时重启
# on-abnormal: 异常时重启
# on-watchdog: 看门狗超时时重启
# no:         不重启

RestartSec=10                       # 重启间隔（秒）
TimeoutStartSec=60                  # 启动超时
TimeoutStopSec=30                   # 停止超时
TimeoutSec=300                      # 默认超时

# 环境变量
Environment=NODE_ENV=production
Environment=PORT=3000

# 资源限制
LimitNOFILE=65535
LimitNPROC=4096

# 日志配置
StandardOutput=journal             # 输出到 journal
StandardError=journal             # 错误到 journal
SyslogIdentifier=myapp            # 日志标识

[Install]
WantedBy=multi-user.target        # 目标（开机启动）
# multi-user.target: 多用户模式
# graphical.target: 图形界面
# runlevel3.target: 文本模式
```

**创建自定义服务示例：**

```bash
# 1. 创建服务脚本
cat > /usr/local/bin/myapp << 'EOF'
#!/bin/bash
while true; do
    echo "My App is running at $(date)" >> /var/log/myapp.log
    sleep 10
done
EOF
chmod +x /usr/local/bin/myapp

# 2. 创建 systemd 单元文件
cat > /etc/systemd/system/myapp.service << 'EOF'
[Unit]
Description=My Custom Application
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/myapp
Restart=always
RestartSec=5
User=root

[Install]
WantedBy=multi-user.target
EOF

# 3. 重新加载并启动服务
systemctl daemon-reload
systemctl start myapp
systemctl enable myapp
systemctl status myapp
```

---

## 第四章 网络管理

### 4.1 网络配置和查看

**面试重点：**

网络配置是运维必备技能，需要掌握各种网络查看和配置命令。

```bash
# ========== 网络接口查看 ==========
ifconfig                 # 查看网络接口配置（传统命令）
ip addr                 # 查看 IP 地址信息（新版命令，推荐）
ip link                 # 查看网络接口
ip route                # 查看路由表
ip neigh                # 查看 ARP 表
ip addr show            # 显示所有接口
ip addr show eth0       # 显示指定接口
ip -s link              # 显示统计信息
ip -s link show eth0    # 显示 eth0 统计

# ifconfig 输出说明
# eth0: 接口名
# inet: IPv4 地址
# netmask: 子网掩码
# broadcast: 广播地址
# inet6: IPv6 地址
# ether: MAC 地址
# UP: 接口启用
# BROADCAST: 支持广播
# RUNNING: 运行中
# MULTICAST: 支持多播
# MTU: 最大传输单元

# 启用/禁用网络接口
ifconfig eth0 up
ifconfig eth0 down
ip link set eth0 up
ip link set eth0 down

# 配置 IP 地址
ifconfig eth0 192.168.1.100/24
ifconfig eth0 192.168.1.100 netmask 255.255.255.0
ip addr add 192.168.1.100/24 dev eth0
ip addr del 192.168.1.100/24 dev eth0

# 删除/添加别名接口
ip addr del 192.168.1.100/24 dev eth0
ip addr add 192.168.1.101/24 dev eth0 label eth0:1

# 配置 MAC 地址
ip link set eth0 address aa:bb:cc:dd:ee:ff

# 配置 MTU
ip link set eth0 mtu 9000

# ========== 网络连通性测试 ==========
ping -c 4 example.com   # 测试网络连通性（发送 4 个包）
ping -c 4 192.168.1.1   # 测试 IP 连通性
ping -i 0.2 example.com # 每 0.2 秒发送一次（默认 1 秒）
ping -s 1000 example.com # 发送大数据包（默认 56 字节）
ping -t 64 example.com  # 设置 TTL（默认 64）
ping -W 3 example.com   # 等待响应超时（秒）
ping -f example.com     # 快速 ping（洪水测试）
ping -6 example.com     # IPv6 ping

# Windows ping 默认发送 4 个包，Linux 持续发送（Ctrl+C 停止）

# ========== 网络请求 ==========
curl -I url            # 发送 HEAD 请求（只获取头部）
curl -v url            # 显示详细信息（请求和响应）
curl -X GET url        # 发送 GET 请求
curl -X POST url       # 发送 POST 请求
curl -X POST -d "data" url  # 发送 POST 数据
curl -X PUT -d "data" url   # 发送 PUT 请求
curl -X DELETE url     # 发送 DELETE 请求
curl -o file url       # 下载文件
curl -O url            # 下载文件（保留原名）
curl -L url            # 跟随重定向
curl -k url            # 跳过 SSL 证书验证
curl -u user:pass url  # 基本认证
curl -H "Header:value" url  # 自定义头部
curl -b "cookies" url # 发送 Cookie
curl -c "cookies.txt" url # 保存 Cookie
curl -x proxy:port url  # 使用代理

# wget 命令
wget url                # 下载文件
wget -O file url       # 指定输出文件名
wget -c url            # 断点续传
wget -r url            # 递归下载
wget -q url            # 静默模式
wget --spider url     # 检查文件是否存在
wget --no-check-certificate url  # 不检查证书

# ========== 路由追踪 ==========
traceroute example.com  # 追踪路由（UDP）
traceroute -I example.com   # 追踪路由（ICMP）
traceroute -m 30 example.com  # 最大 30 跳
traceroute -w 3 example.com   # 等待超时
traceroute -n example.com    # 不解析主机名
tracert example.com    # Windows 追踪路由
mtr example.com        # 实时路由追踪（ping + traceroute）
mtr -c 10 example.com  # 发送 10 个包后退出
mtr -r example.com     # 报告模式
mtr -n example.com     # 不解析主机名
mtr -p example.com     # 显示端口号

# ========== DNS 查询 ==========
nslookup example.com   # DNS 查询（交互式）
nslookup -type=mx example.com  # 查询 MX 记录
nslookup -query=any example.com  # 查询所有记录
dig example.com        # 详细 DNS 查询
dig +short example.com # 简短结果
dig +noall +answer example.com  # 只显示答案
dig -x 8.8.8.8         # 反向 DNS 查询
dig @8.8.8.8 example.com  # 指定 DNS 服务器
host example.com       # 简单 DNS 查询
host -t mx example.com # 查询 MX 记录

# ========== 网络统计信息 ==========
netstat -s              # 显示所有协议统计
netstat -i              # 显示网络接口统计
netstat -g              # 显示多播组成员
netstat -r              # 显示路由表

# ========== 查看网络连接状态 ==========
ss -s                   # 显示连接状态汇总
ss -t                   # TCP 连接
ss -u                   # UDP 连接
ss -w                   # RAW 连接
ss -x                   # Unix socket
ss -l                   # 监听中的套接字
ss -p                   # 显示进程信息
ss -n                   # 不解析主机名
ss -e                   # 显示详细信息
ss -m                   # 显示内存信息
ss -o                   # 显示计时器信息
```

---

### 4.2 端口和网络连接

**面试重点：**

端口管理是服务运维的基础，需要掌握端口查看和防火墙配置。

```bash
# ========== 端口监听查看 ==========
netstat -tlnp          # 查看 TCP 监听端口
netstat -ulnp          # 查看 UDP 监听端口
netstat -tlnp | grep 80   # 查看 80 端口
ss -tlnp               # 查看 TCP 监听端口（更高效）
ss -ulnp               # 查看 UDP 监听端口
lsof -i :80            # 查看端口 80 被谁占用
lsof -i                # 查看所有网络连接
fuser 80/tcp           # 查看端口 80 被谁占用

# 查看连接状态统计
netstat -an | awk '/^tcp/ {++state[$NF]} END {for(key in state) print key, state[key]}'
ss -s

# ========== 网络连接查看 ==========
netstat -an            # 查看所有连接
netstat -tn            # 查看 TCP 连接
netstat -un            # 查看 UDP 连接
netstat -p             # 显示进程信息
netstat -ant           # 所有 TCP 连接（数字形式）
netstat -antp         # 带进程信息

# 连接状态说明：
# LISTEN      - 监听中
# ESTABLISHED - 已建立连接
# TIME_WAIT   - 等待关闭
# CLOSE_WAIT  - 等待关闭
# SYN_SENT    - SYN 已发送
# SYN_RECV    - SYN 已接收
# FIN_WAIT1   - FIN 等待 1
# FIN_WAIT2   - FIN 等待 2
# CLOSING     - 关闭中
# LAST_ACK    - 最后确认

# 查看特定状态的连接
netstat -an | grep ESTABLISHED
netstat -an | grep TIME_WAIT | wc -l

# ========== 防火墙配置 ==========

# firewalld (CentOS 7+/Ubuntu 18.04+)
# 启动 firewalld
systemctl start firewalld
systemctl enable firewalld

# 查看状态
firewall-cmd --state
firewall-cmd --list-ports                    # 列出开放的端口
firewall-cmd --list-services                  # 列出开放的服务
firewall-cmd --list-all                       # 列出所有配置
firewall-cmd --list-all --zone=public         # 指定区域

# 端口管理
firewall-cmd --add-port=80/tcp --permanent   # 开放 80 端口
firewall-cmd --add-port=80/tcp               # 临时开放（重启失效）
firewall-cmd --remove-port=80/tcp --permanent  # 关闭 80 端口
firewall-cmd --add-port=1000-2000/tcp        # 开放端口范围

# 服务管理
firewall-cmd --add-service=http --permanent  # 开放 HTTP 服务
firewall-cmd --add-service=https --permanent # 开放 HTTPS 服务
firewall-cmd --add-service=ssh --permanent

# IP/网段管理
firewall-cmd --add-source=192.168.1.0/24 --permanent  # 允许 IP 段
firewall-cmd --remove-source=192.168.1.0/24 --permanent

# 重新加载配置
firewall-cmd --reload                        # 重新加载（保留永久配置）
firewall-cmd --complete-reload              # 完全重新加载

# 区域管理
firewall-cmd --get-zones                    # 列出所有区域
firewall-cmd --get-active-zones             # 活跃区域
firewall-cmd --set-default-zone=public      # 设置默认区域
firewall-cmd --zone=public --add-interface=eth0  # 添加接口到区域

# iptables (传统)
# 查看规则
iptables -L                          # 查看所有规则
iptables -L -n                      # 数字显示
iptables -L -n -v                   # 详细显示
iptables -L INPUT                   # 查看 INPUT 链

# 基本规则
iptables -A INPUT -p tcp --dport 80 -j ACCEPT   # 开放 80 端口
iptables -A INPUT -j DROP            # 默认拒绝所有
iptables -A INPUT -p icmp -j ACCEPT  # 允许 ping
iptables -A INPUT -s 192.168.1.0/24 -j ACCEPT  # 允许 IP 段
iptables -A INPUT -i lo -j ACCEPT    # 允许本地回环

# 删除/插入规则
iptables -D INPUT 1                  # 删除第一条规则
iptables -I INPUT 1 -j ACCEPT        # 插入规则到第一条
iptables -F                         # 清空所有规则
iptables -X                         # 清空自定义链
iptables -Z                         # 计数器归零

# 保存和恢复
iptables-save > /etc/iptables.rules # 保存规则
iptables-restore < /etc/iptables.rules  # 恢复规则

# ufw (Ubuntu)
# 安装
apt install ufw

# 基本操作
ufw status               # 查看状态
ufw status numbered     # 查看状态（带编号）
ufw enable              # 启用防火墙
ufw disable             # 禁用防火墙

# 端口管理
ufw allow 80/tcp        # 开放 80 端口
ufw deny 80/tcp         # 禁止 80 端口
ufw delete allow 80/tcp # 删除规则
ufw allow 1000:2000/tcp # 开放端口范围

# 服务管理
ufw allow http
ufw allow https
ufw allow ssh

# IP/网段管理
ufw allow from 192.168.1.0/24  # 允许 IP 段
ufw allow from 192.168.1.100  # 允许特定 IP
ufw allow from 192.168.1.100 to any port 22  # 允许 IP 访问特定端口

# 删除规则
ufw delete allow 80/tcp

# 重置
ufw reset
```

**网络诊断工具：**

```bash
# ========== tcpdump 命令 ==========
# 强大的网络抓包工具

# 安装
apt install tcpdump
yum install tcpdump

# 基本用法
tcpdump -i eth0                    # 抓取 eth0 网卡包
tcpdump -i any                     # 抓取所有网卡
tcpdump -c 100                     # 抓取 100 个包后退出
tcpdump -w file.pcap               # 保存到文件
tcpdump -r file.pcap               # 读取文件
tcpdump -vv                        # 详细输出
tcpdump -n                         # 不解析主机名
tcpdump -nn                        # 不解析主机名和端口

# 过滤表达式
tcpdump host 192.168.1.1           # 抓取特定主机
tcpdump src 192.168.1.1            # 源地址
tcpdump dst 192.168.1.1            # 目标地址
tcpdump port 80                    # 特定端口
tcpdump src port 80                # 源端口
tcpdump dst port 80                # 目标端口
tcpdump tcp                         # TCP 协议
tcpdump udp                         # UDP 协议
tcpdump icmp                        # ICMP 协议
tcpdump portrange 80-443           # 端口范围
tcpdump greater 1000               # 大于指定字节
tcpdump less 1000                  # 小于指定字节

# 组合过滤
tcpdump -i eth0 host 192.168.1.1 and port 80
tcpdump -i eth0 src 192.168.1.1 or dst 192.168.1.2
tcpdump -i eth0 not port 22
tcpdump -i eth0 tcp and port 80

# 输出控制
tcpdump -A                         # ASCII 格式显示
tcpdump -X                         # 十六进制显示
tcpdump -l                         # 行缓冲
tcpdump -q                         # 简洁输出
tcpdump -tttt                     # 时间戳格式

# 实战示例
# 1. 抓取 HTTP 请求
tcpdump -i eth0 -A port 80 | grep "GET\|POST"

# 2. 抓取特定 IP 的包
tcpdump -i eth0 host 192.168.1.1

# 3. 抓取到特定主机的 TCP 包
tcpdump -i eth0 tcp and dst host 192.168.1.1

# 4. 抓取 DNS 查询
tcpdump -i eth0 port 53

# 5. 抓取新连接
tcpdump -i eth0 'tcp[tcpflags] & (tcp-syn) != 0'

# ========== iftop 命令 ==========
# 实时网络流量监控

# 安装
apt install iftop
yum install iftop

# 基本用法
iftop                    # 实时显示带宽使用
iftop -i eth0            # 指定网卡
iftop -n                 # 不解析主机名（更快）
iftop -N                 # 不解析端口号
iftop -P                 # 显示端口
iftop -B                 # 以字节显示（默认比特）
iftop -b                 # 不显示流量条
iftop -f filter         # 过滤包

# 交互命令
# h: 帮助
# n: 切换主机名解析
# s: 切换源主机显示
# d: 切换目标主机显示
# t: 切换显示模式（行/列）
# l: 切换屏幕过滤
# L: 切换打印颜色
# p: 暂停更新
# q: 退出

# ========== nethogs 命令 ==========
# 按进程显示网络流量

# 安装
apt install nethogs
yum install nethogs

# 基本用法
nethogs                  # 监控所有网卡
nethogs eth0             # 监控指定网卡
nethogs -d 1             # 刷新间隔（秒）
nethogs -p              # 混合模式
nethogs -t              # 追踪模式

# ========== iptraf 命令 ==========
# IP 流量监控工具
apt install iptraf-ng
iptraf-ng                # 交互式界面
iptraf-ng -i eth0        # 监控指定网卡

# ========== netstat 高级用法 ==========
# 查看网络连接统计
netstat -s               # 按协议统计
netstat -st              # TCP 统计
netstat -su              # UDP 统计

# 查看路由表
netstat -rn              # 数字形式
netstat -r              # 符号形式

# 查看接口统计
netstat -i
netstat -ie              # 扩展信息

# ========== ss 命令高级用法 ==========
# 查看详细连接信息
ss -tn dst 192.168.1.1  # 到特定地址的连接
ss -tn state established  # 已建立连接
ss -tan state listening  # 监听端口
ss -tan state time-wait  # TIME_WAIT 状态
ss -tp                   # 显示进程信息
ss -tnp | grep :80      # 查看 80 端口
```

---

### 4.3 网络诊断和问题排查

```bash
# ========== 网络诊断流程 ==========
# 1. 检查本地网络配置
ip addr
ip route

# 2. 检查网络接口状态
ip link show
netstat -i

# 3. 测试本地连通性
ping -c 3 127.0.0.1
ping -c 3 $(hostname -I | awk '{print $1}')

# 4. 测试网关连通性
ip route | grep default
ping -c 3 <网关IP>

# 5. 测试 DNS 解析
nslookup google.com
dig google.com
ping -c 3 google.com

# 6. 测试目标主机
ping -c 3 <目标IP>
traceroute <目标IP>
mtr <目标IP>

# 7. 测试端口连通性
telnet <目标IP> <端口>
nc -zv <目标IP> <端口>
curl -I http://<目标IP>:<端口>

# 8. 检查服务状态
netstat -tlnp | grep <端口>
ss -tlnp | grep <端口>
lsof -i :<端口>

# ========== 常见网络问题 ==========
# 问题 1：无法获取 IP 地址
# 检查 DHCP 服务
systemctl status dhcpcd
# 手动请求 IP
dhclient -v eth0

# 问题 2：DNS 不工作
# 检查 /etc/resolv.conf
cat /etc/resolv.conf
# 测试 DNS
nslookup google.com 8.8.8.8

# 问题 3：无法访问外网
# 检查路由表
ip route
# 检查网关
ping -c 3 <网关IP>
# 检查 NAT
iptables -t nat -L -n

# 问题 4：端口无法访问
# 检查防火墙
firewall-cmd --list-all
iptables -L -n
# 检查服务
systemctl status <服务名>
netstat -tlnp | grep <端口>

# ========== 网络性能测试 ==========
# 带宽测试
# 服务端
iperf -s
# 客户端
iperf -c <服务器IP>

# 延迟测试
ping -c 100 <目标IP> | tail -1

# TCP 窗口测试
netstat -s | grep "window"

# 查看网络连接状态
ss -s
netstat -an | awk '/^tcp/ {++state[$NF]} END {for(key in state) print key, state[key]}'
```

---

## 第五章 SSH 远程连接

### 5.1 SSH 基础命令

**面试重点：**

SSH 是 Linux 远程管理的核心工具，需要熟练掌握连接和文件传输命令。

```bash
# ========== SSH 连接 ==========
ssh user@hostname           # 连接到远程主机
ssh -p 22 user@hostname     # 指定端口连接
ssh -i ~/.ssh/key user@hostname  # 指定私钥文件
ssh -v user@hostname        # 详细模式连接（调试）
ssh -vv user@hostname       # 更详细模式
ssh -vvv user@hostname      # 最详细模式
ssh -o StrictHostKeyChecking=no user@hostname  # 跳过主机密钥检查
ssh -o ConnectTimeout=10 user@hostname  # 连接超时
ssh -t user@hostname "command"  # 执行远程命令
ssh -t user@hostname "sudo command"  # 执行 sudo 命令

# 远程执行命令示例
ssh user@hostname "df -h"
ssh user@hostname "systemctl status nginx"
ssh user@hostname "bash -c 'cd /var/log && ls -la'"

# ========== SSH 密钥管理 ==========
# 生成密钥对
ssh-keygen -t rsa                # 生成 RSA 密钥对
ssh-keygen -t ed25519            # 生成 Ed25519 密钥对（推荐）
ssh-keygen -t rsa -b 4096        # 生成 4096 位 RSA 密钥
ssh-keygen -t ed25519 -C "comment"  # 带注释
ssh-keygen -f ~/.ssh/key         # 指定密钥文件路径
ssh-keygen -p                    # 修改密钥密码
ssh-keygen -R hostname           # 移除主机密钥
ssh-keygen -R /path/to/known_hosts  # 移除特定主机密钥

# 复制公钥到远程主机
ssh-copy-id user@hostname
ssh-copy-id -i ~/.ssh/key.pub user@hostname  # 指定公钥文件
# 或者手动复制
cat ~/.ssh/id_rsa.pub | ssh user@hostname "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"

# 密钥权限设置
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub

# ========== SSH 配置 ~/.ssh/config ==========
# 配置文件示例
cat > ~/.ssh/config << 'EOF'
# 默认配置
Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3
    StrictHostKeyChecking ask
    IdentityFile ~/.ssh/id_rsa

# 服务器 1
Host alias1
    HostName 192.168.1.100
    User username1
    Port 22
    IdentityFile ~/.ssh/key1

# 服务器 2（跳板机）
Host alias2
    HostName 192.168.1.200
    User username2
    Port 22
    ProxyJump user@gateway  # 通过跳板机连接

# GitHub
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/github

EOF

chmod 600 ~/.ssh/config

# ========== 文件传输 ==========
# scp 命令
scp file.txt user@host:/path/       # 上传文件
scp user@host:/path/file.txt ./      # 下载文件
scp -r dir/ user@host:/path/         # 上传目录
scp -P 2222 file user@host:/path/    # 指定端口（大写 P）
scp -C file user@host:/path/         # 启用压缩
scp -p file user@host:/path/         # 保留文件属性
scp -v file user@host:/path/         # 详细模式
scp -i key file user@host:/path/     # 指定私钥
scp -o StrictHostKeyChecking=no file user@host:/path/  # 跳过主机检查

# 多个文件传输
scp file1 file2 user@host:/path/
scp -r dir1/ dir2/ user@host:/path/

# rsync 命令（更高效的同步）
rsync -avz source/ user@host:/path/  # 同步目录
rsync -avz --delete source/ user@host:/path/  # 同步并删除目标多余文件
rsync -avz -e ssh source/ user@host:/path/  # 使用 SSH
rsync -avz --exclude='*.log' source/ user@host:/path/  # 排除文件
rsync -avz --progress source/ user@host:/path/  # 显示进度
rsync -avz -n source/ user@host:/path/  # 模拟运行

# sftp 命令（交互式文件传输）
sftp user@hostname                    # 连接
# sftp 命令：
# ls/cd/pwd - 目录操作
# get file - 下载文件
# put file - 上传文件
# mget/mput - 批量传输
# lls/lcd/lpwd - 本地目录操作
# get file /local/path - 指定下载路径
# mkdir/rmdir - 创建/删除目录
# rm/delete - 删除文件
# bye/exit/quit - 退出

# ========== SSH 隧道（端口转发）==========
# 本地端口转发（本地端口 -> 远程端口）
ssh -L 8080:localhost:80 user@hostname
# 访问本地的 8080 端口会转发到远程的 80 端口

# 远程端口转发（远程端口 -> 本地端口）
ssh -R 8080:localhost:80 user@hostname
# 远程机器的 8080 端口会转发到本地的 80 端口

# 动态端口转发（SOCKS 代理）
ssh -D 1080 user@hostname
# 创建 SOCKS 代理，可用于浏览器代理

# 保持连接
ssh -o ServerAliveInterval=60 user@hostname

# ========== SSH 常见问题 ==========
# 问题：主机密钥验证失败
# 解决：删除 known_hosts 中对应条目
ssh-keygen -R hostname
# 或
ssh-keygen -R 192.168.1.100
```

---

### 5.2 SSH 安全加固

**面试重点：**

SSH 安全是服务器安全的重要环节，需要了解常见的安全加固措施。

**SSH 配置文件：** `/etc/ssh/sshd_config`

```bash
# 端口和地址绑定
Port 2222                   # 修改默认端口
ListenAddress 0.0.0.0      # 监听地址
ListenAddress ::           # 监听 IPv6

# 协议版本
Protocol 2                 # 只使用 SSH 2 协议

# 禁用 root 登录
PermitRootLogin no          # 禁用 root 登录
PermitRootLogin prohibit-password  # 只允许密钥登录（禁止密码）
PermitRootLogin without-password  # 不允许密码登录

# 禁用密码认证
PasswordAuthentication no   # 禁用密码认证
PubkeyAuthentication yes    # 启用公钥认证

# 允许/禁止特定用户
AllowUsers user1 user2
AllowUsers user1@192.168.1.0/24  # 限制 IP
DenyUsers user1

# 允许/禁止特定组
AllowGroup sshusers
DenyGroup badgroup

# 限制失败尝试次数
MaxAuthTries 3              # 最大尝试次数
MaxSessions 10             # 最大会话数

# 空闲超时设置
ClientAliveInterval 300     # 空闲检测间隔（秒）
ClientAliveCountMax 2      # 空闲检测次数
# 合计：300*2=600 秒无活动自动断开

# 禁用空密码
PermitEmptyPasswords no

# 启用日志记录
LogLevel VERBOSE
LogLevel INFO

# 限制环境
AcceptEnv LANG LC_*

# 禁用某些功能
AllowAgentForwarding yes
AllowTcpForwarding yes
X11Forwarding no           # 禁用 X11 转发
PrintMotd no               # 不打印 /etc/motd
PrintLastLog yes           # 显示最后登录信息

# 密码过期
PasswordAuthentication no
PermitUserEnvironment no
# 强制使用密钥，且密钥需无密码或使用 ssh-agent

# 重启 SSH 服务
systemctl restart sshd
# 或
systemctl restart ssh

# 验证配置
sshd -t                    # 测试配置文件语法
```

**使用 fail2ban 防止暴力破解：**

```bash
# 安装
apt install fail2ban
yum install fail2ban

# 配置
cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# 修改 jail.local
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600           # 封禁 1 小时
findtime = 600           # 10 分钟内
maxretry = 3             # 3 次失败后封禁
destemail = admin@example.com
sender = fail2ban@example.com
action = %(action_mwl)s

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3

[sshd-ddos]
enabled = true
port = ssh
filter = sshd-ddos
logpath = /var/log/auth.log
maxretry = 20

[nginx-http-auth]
enabled = true

EOF

# 启动
systemctl start fail2ban
systemctl enable fail2ban

# 查看状态
fail2ban-client status
fail2ban-client status sshd
```

---

### 5.3 sudo 配置

```bash
# ========== sudo 基础使用 ==========
sudo command              # 以 root 身份执行命令
sudo -u user command     # 以指定用户身份执行
sudo -i                  # 切换到 root 用户（登录 shell）
sudo -i -u user          # 切换到指定用户
sudo -k                  # 清除缓存的密码
sudo -v                  # 验证密码（延长 sudo 有效期）

# 查看 sudo 权限
sudo -l                  # 列出当前用户 sudo 权限
sudo -l -U user          # 查看指定用户权限

# ========== visudo 命令 ==========
# 编辑 /etc/sudoers 的安全方式

# 基本语法
# user  ALL=(ALL:ALL) ALL

# 示例
# username  ALL=(ALL) ALL                    # 完全权限
# username  ALL=(ALL) NOPASSWD: ALL          # 无需密码
# %groupname  ALL=(ALL) ALL                  # 组权限

# 允许特定命令
username ALL=(ALL) /usr/bin/systemctl, /usr/bin/apt-get

# 允许特定用户作为特定用户运行
username ALL=(user1) /usr/bin/whoami

# 免密码执行特定命令
username ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart nginx

# 别名配置
# User_Alias
User_Alias ADMIN = user1, user2, user3

# Cmnd_Alias
Cmnd_Alias SYSTEM = /usr/bin/systemctl, /usr/bin/apt-get, /usr/bin/yum

# Runas_Alias
Runas_Alias WEB = www-data, nginx

# 使用别名
ADMIN ALL=(WEB) SYSTEM

# ========== sudo 日志 ==========
# 查看 sudo 操作日志
cat /var/log/auth.log | grep sudo
# 或
journalctl -u sudo
```

---

## 第六章 软件包管理

### 6.1 包管理器概述

**面试重点：**

不同 Linux 发行版使用不同的包管理器，需要掌握主流发行版的包管理命令。

**Ubuntu/Debian (apt)：**

```bash
# 更新软件包列表
apt update                  # 更新软件包列表
apt-get update            # 传统命令

# 升级软件包
apt upgrade                # 升级所有软件包
apt full-upgrade           # 完整升级（处理依赖变化）
apt-get upgrade           # 升级软件包
apt-get dist-upgrade      # 发行版升级

# 安装和卸载
apt install nginx          # 安装软件包
apt install nginx=1.18.0   # 安装指定版本
apt install -y nginx       # 自动确认
apt install -f nginx       # 修复依赖
apt remove nginx           # 卸载软件包（保留配置）
apt purge nginx            # 彻底卸载
apt autoremove             # 自动清理不需要的包

# 搜索和查看
apt search nginx           # 搜索软件包
apt show nginx             # 查看软件包信息
apt list --installed       # 列出已安装的软件包
apt list --upgradable     # 列出可升级的包
apt-cache policy nginx     # 查看包版本信息

# 清理
apt clean                  # 清理本地仓库（/var/cache/apt/archives）
apt autoclean              # 清理旧版本的软件包
apt autoremove             # 删除不再需要的依赖

# dpkg 命令（底层包管理）
dpkg -i package.deb       # 安装 deb 包
dpkg -r package           # 卸载
dpkg -P package           # 完全卸载（包括配置）
dpkg -l                   # 列出已安装的包
dpkg -l | grep nginx      # 查找特定包
dpkg -s nginx             # 查看包状态
dpkg -L nginx             # 列出包文件
dpkg -S /path/to/file     # 查找文件所属包
dpkg --configure -a       # 配置未完成的安装
dpkg --remove -a          # 移除所有已标记删除的包
```

**CentOS/RHEL (yum/dnf)：**

```bash
# 基础操作
yum update                 # 更新所有软件包
yum check-update          # 检查可更新的包
yum install nginx         # 安装软件包
yum install nginx-1.20.1  # 安装指定版本
yum remove nginx          # 卸载软件包
yum erase nginx           # 卸载并删除配置
yum search nginx          # 搜索软件包
yum list installed        # 列出已安装的软件包
yum list available        # 列出可用软件包
yum repolist              # 列出仓库
yum info nginx            # 查看包信息

# 组管理
yum groupinstall "Development Tools"  # 安装开发工具组
yum groupremove "Development Tools"   # 卸载组
yum group list                       # 列出组
yum groups info "Development Tools"  # 组信息

# 查看包信息
yum provides nginx        # 查找包含指定文件的包
yum deplist nginx         # 列出包依赖
yum changelog nginx      # 查看更新日志

# 清理
yum clean all             # 清理缓存
yum makecache             # 生成缓存
yum history              # 查看操作历史

# DNF (CentOS 8+) - yum 的替代品，命令兼容
dnf update
dnf install nginx
dnf search nginx
dnf list installed
dnf remove nginx
dnf autoremove
dnf clean all
dnf makecache

# DNF 特有命令
dnf repolist --enabled    # 启用的仓库
dnf module list           # 列出模块
dnf module enable nginx:1.20  # 启用模块
dnf module reset nginx    # 重置模块
```

**Arch Linux (pacman)：**

```bash
# 同步和更新
pacman -Syu               # 同步并更新系统
pacman -Sy                # 同步数据库
pacman -Su                # 更新包

# 安装和卸载
pacman -S nginx           # 安装包
pacman -S --noconfirm nginx  # 不确认安装
pacman -Ss nginx          # 搜索包
pacman -Si nginx          # 查看包信息
pacman -Sii nginx         # 详细信息
pacman -R nginx           # 卸载包
pacman -Rs nginx          # 卸载包及其依赖
pacman -Rsc nginx         # 递归卸载
pacman -Sc                # 清理未安装的包缓存

# 查询
pacman -Q                 # 列出已安装的包
pacman -Qe                # 显式安装的包
pacman -Qeq               # 列出包名
pacman -Qs nginx          # 搜索已安装的包
pacman -Qo /path/to/file  # 查找文件所属包

# 其他
pacman -U package.tar.zst  # 从本地安装
pacman -U http://example.com/package.tar.zst  # 从 URL 安装
```

---

### 6.2 Node.js 环境管理

**面试重点：**

前端开发者需要掌握 Node.js 环境管理，包括 nvm、npm、pnpm 等工具。

**nvm (Node Version Manager)：**

```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
# 或
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 配置环境变量（添加到 ~/.bashrc 或 ~/.zshrc）
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 使用 nvm
nvm list-remote           # 列出所有可用版本
nvm list                  # 列出已安装的版本
nvm install 18            # 安装 Node.js 18（最新 18.x.x）
nvm install 18.12.1      # 安装指定版本
nvm install --lts        # 安装最新 LTS 版本
nvm install --lts=hydrogen  # 安装指定 LTS 版本
nvm use 18                # 切换到 Node.js 18
nvm alias default 18     # 设置默认版本
nvm current              # 显示当前版本
nvm uninstall 16          # 卸载指定版本

# 安装最新版本
nvm install node

# 运行特定版本
nvm run 18 app.js
nvm exec 18 node app.js

# 设置镜像（国内使用）
export NVM_NODEJS_ORG_MIRROR=https://nodejs.org/dist/
```

**npm (Node Package Manager)：**

```bash
# npm 基础命令
npm install -g npm        # 更新 npm
npm install -g node       # 安装最新版本 node

# 项目初始化
npm init                  # 初始化项目
npm init -y               # 初始化项目（使用默认配置）

# 安装依赖
npm install               # 安装项目依赖（根据 package.json）
npm install package      # 安装本地包
npm install -g package   # 安装全局包
npm install package@1.0.0  # 安装指定版本
npm install --save package   # 安装并添加到 dependencies
npm install --save-dev package  # 安装并添加到 devDependencies
npm install --save-optional package  # 添加到 optionalDependencies
npm install --no-save package  # 安装但不保存到 package.json

# 安装不同类型依赖
npm install lodash --save         # 生产依赖
npm install jest --save-dev        # 开发依赖
npm install pm2 --save-optional   # 可选依赖

# 更新
npm update               # 更新所有包
npm update package       # 更新指定包
npm outdated             # 检查过期包

# 卸载
npm uninstall package    # 卸载包
npm uninstall --save-dev package  # 从 devDependencies 移除

# 运行脚本
npm run                   # 列出可用脚本
npm run dev              # 运行 package.json 中的 dev 脚本
npm run build            # 运行 build 脚本
npm start                # 运行 start 脚本
npm test                 # 运行 test 脚本

# 查看和搜索
npm list                 # 查看已安装的包
npm list -g              # 查看全局安装的包
npm list --depth=0      # 只显示直接依赖
npm search package       # 搜索包
npm info package         # 查看包信息
npm view package         # 查看包信息
npm docs package         # 查看包文档

# npm 配置
npm config list          # 查看配置
npm config get registry  # 查看当前镜像
npm config set registry https://registry.npmjs.org/  # 设置官方镜像
npm config set registry https://registry.npmmirror.com  # 设置淘宝镜像

# package.json 字段说明
# name: 包名
# version: 版本号
# description: 描述
# main: 入口文件
# scripts: 脚本命令
# dependencies: 生产依赖
# devDependencies: 开发依赖
# optionalDependencies: 可选依赖
# peerDependencies: 对等依赖
# engines: 引擎版本要求
# license: 许可证
```

**pnpm (Performant npm)：**

```bash
# 安装 pnpm
npm install -g pnpm
# 或
corepack enable
corepack prepare pnpm@latest --activate

# 基础命令
pnpm install             # 安装依赖
pnpm add package         # 添加依赖
pnpm add -D package     # 添加开发依赖
pnpm add -O package     # 添加可选依赖
pnpm remove package     # 移除依赖
pnpm update              # 更新依赖
pnpm outdated           # 检查过期

# pnpm 特有命令
pnpm store add package  # 添加到全局存储
pnpm store prune        # 清理全局存储
pnpm rebuild            # 重新构建
pnpm import             # 从 package-lock.json 导入
```

**yarn：**

```bash
# 安装
npm install -g yarn

# 基础命令
yarn                     # 安装依赖
yarn add package         # 添加依赖
yarn add -D package     # 添加开发依赖
yarn remove package     # 移除依赖
yarn upgrade             # 更新依赖
yarn upgrade-interactive # 交互式更新

# 脚本
yarn run dev            # 运行脚本
yarn dev                # 运行 dev 脚本
```

---

## 第七章 常用服务部署

### 7.1 Nginx 部署和配置

**面试重点：**

Nginx 是最常用的 Web 服务器，需要熟练掌握其安装、配置和使用。

**安装 Nginx：**

```bash
# Ubuntu/Debian
apt update
apt install nginx

# CentOS/RHEL
yum install epel-release
yum install nginx

# 启动和启用
systemctl start nginx
systemctl enable nginx
systemctl status nginx

# 测试配置
nginx -t
nginx -t -c /path/to/config

# 查看版本
nginx -v
nginx -V  # 详细版本（包括编译参数）
```

**Nginx 主配置文件：** `/etc/nginx/nginx.conf`

```nginx
# Nginx 主配置文件结构

user nginx;                          # 运行用户
worker_processes auto;               # 工作进程数（auto 自动匹配 CPU 核心数）
error_log /var/log/nginx/error.log; # 错误日志
pid /run/nginx.pid;                  # PID 文件

events {
    worker_connections 1024;         # 每个工作进程最大连接数
    use epoll;                       # 使用 epoll 模型（Linux）
    multi_accept on;                 # 接受多个连接
}

http {
    # 基础设置
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # 日志格式
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    # 性能优化
    sendfile on;
    tcp_nopush on;                   # 发送 HTTP 响应头
    tcp_nodelay on;                   # 禁用 Nagle 算法
    keepalive_timeout 65;             # keep-alive 超时
    keepalive_requests 1000;         # 每个连接最大请求数
    types_hash_max_size 2048;
    client_max_body_size 20M;         # 最大请求体大小

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 1k;
    gzip_buffers 16 8k;
    gzip_http_version 1.1;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript application/x-javascript;
    gzip_disable "msie6";

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";

    # 隐藏版本号
    server_tokens off;

    # 包含其他配置文件
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```

**站点配置文件：** `/etc/nginx/conf.d/example.conf`

```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    root /var/www/html;
    index index.html index.htm index.php;

    # 日志配置
    access_log /var/log/nginx/example.com.access.log;
    error_log /var/log/nginx/example.com.error.log;

    # 静态文件缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
        gzip_static on;  # 启用 gzip 压缩静态文件
    }

    # 主页面配置
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 代理配置
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
    }

    # WebSocket 支持
    location /ws {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400;
        proxy_send_timeout 86400;
    }

    # PHP-FPM 配置
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # 禁止访问隐藏文件
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    # 禁止访问特定目录
    location /uploads {
        internal;
    }

    # 限流配置
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/s;

    location /api {
        limit_req zone=api_limit burst=200 nodelay;
    }

    # 访问控制
    location /admin {
        allow 192.168.1.0/24;
        allow 10.0.0.0/8;
        deny all;
    }
}
```

**HTTPS 配置：**

```nginx
# HTTP to HTTPS 重定向
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS 配置
server {
    listen 443 ssl http2;
    server_name example.com;

    # SSL 证书配置
    ssl_certificate /etc/ssl/certs/example.com.crt;
    ssl_certificate_key /etc/ssl/private/example.com.key;

    # SSL 配置优化
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;

    # SSL 协议和加密套件
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # 其他配置...
}
```

**Let's Encrypt 免费 SSL 证书：**

```bash
# 安装 Certbot
apt install certbot python3-certbot-nginx

# 获取证书
certbot --nginx -d example.com -d www.example.com

# 自动续期
certbot renew --dry-run

# 手动续期
certbot renew
```

**Nginx 命令：**

```bash
# 测试配置
nginx -t                 # 测试配置文件语法
nginx -t -c /path/to/conf  # 指定配置文件

# 启动和停止
nginx                    # 启动 Nginx
nginx -s reload          # 重新加载配置
nginx -s stop           # 停止 Nginx
nginx -s reopen         # 重新打开日志文件
nginx -s quit           # 优雅停止（处理完请求）
nginx -c /path/to/conf  # 指定配置文件

# 查看版本
nginx -v                # 查看版本
nginx -V                # 查看详细版本信息（包括编译参数）
```

**Nginx 负载均衡：**

```nginx
# upstream 配置
upstream backend {
    least_conn;                    # 最少连接数
    server backend1.example.com:8080 weight=5;
    server backend2.example.com:8080 weight=3;
    server backend3.example.com:8080 down;  # 标记为下线
    server 192.168.1.100:8080 backup;       # 备用服务器
}

server {
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_connect_timeout 30s;
        proxy_read_timeout 30s;
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503;
    }
}
```

---

### 7.2 PM2 进程管理

**面试重点：**

PM2 是 Node.js 应用的常用进程管理器，用于生产环境部署。

**安装 PM2：**

```bash
npm install -g pm2
```

**基本命令：**

```bash
# 启动应用
pm2 start app.js                 # 启动应用
pm2 start app.js --name my-app   # 指定应用名称
pm2 start app.js -i 4           # 启动 4 个实例（负载均衡）
pm2 start app.js --max-memory-restart 500M  # 内存超过 500M 自动重启

# 管理应用
pm2 list                         # 列出所有应用
pm2 status                       # 查看状态
pm2 show my-app                  # 查看应用详细信息
pm2 logs                         # 查看日志
pm2 logs my-app                  # 查看指定应用日志
pm2 logs --lines 100             # 查看最近 100 行日志
pm2 logs my-app --err            # 只查看错误日志
pm2 logs my-app --nostream       # 不实时输出
pm2 restart my-app               # 重启应用
pm2 stop my-app                  # 停止应用
pm2 delete my-app               # 删除应用
pm2 delete all                  # 删除所有应用

# 监控
pm2 monit                        # 实时监控面板
pm2 plus                         # 在线监控面板（需要注册）
pm2 desc my-app                  # 查看详细信息

# 开机自启
pm2 startup                      # 生成启动命令
pm2 save                         # 保存当前进程列表
pm2 resurrect                   # 恢复保存的进程列表
pm2 generate                    # 生成 systemd 配置
pm2 startup systemd            # 生成 systemd 配置

# 集群模式
pm2 reload my-app                # 重新加载（零停机）
pm2 scale my-app 10              # 扩展到 10 个实例

# 配置文件
pm2 ecosystem                   # 生成 ecosystem.config.js
pm2 start ecosystem.config.js  # 使用配置文件启动
```

**ecosystem.config.js 配置文件：**

```javascript
module.exports = {
  apps: [{
    name: 'my-app',
    script: './app.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 8080
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '500M',
    autorestart: true,
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
    max_restarts: 10,
    min_uptime: '10s',
    listen_timeout: 8000,
    kill_timeout: 5000,
  }, {
    name: 'worker',
    script: './worker.js',
    watch: true,
    ignore_watch: ['node_modules', 'logs'],
    env: {
      NODE_ENV: 'development'
    }
  }]
};
```

---

## 第八章 日志管理

### 8.1 系统日志详解

**面试重点：**

日志是排查问题的重要依据，需要了解常见日志的位置和作用。

| 日志类型 | 位置 | 说明 |
|----------|------|------|
| 系统日志 | /var/log/messages | 系统和应用程序通用日志 |
| 安全日志 | /var/log/secure | 用户登录和认证日志 |
| 计划任务日志 | /var/log/cron | 定时任务执行日志 |
| 邮件日志 | /var/log/maillog | 邮件收发日志 |
| 启动日志 | /var/log/dmesg | 系统启动时的硬件检测日志 |
| 内核日志 | /var/log/kern.log | 内核日志 |
| Nginx 访问日志 | /var/log/nginx/access.log | HTTP 请求访问日志 |
| Nginx 错误日志 | /var/log/nginx/error.log | HTTP 请求错误日志 |
| 应用日志 | /var/log/myapp/ | 应用程序自定义日志 |
| 系统日志 | /var/log/syslog | 完整系统日志（Debian/Ubuntu） |
| Docker 日志 | /var/lib/docker/containers/ | Docker 容器日志 |
| MySQL 日志 | /var/log/mysql/ | MySQL 数据库日志 |

**常用日志命令：**

```bash
# 实时查看日志
tail -f /var/log/nginx/access.log

# 查看最近 100 行
tail -n 100 /var/log/nginx/access.log

# 搜索日志内容
grep "error" /var/log/nginx/error.log
grep -i "error" /var/log/nginx/access.log
grep -E "error|warning" /var/log/nginx/error.log

# 统计日志
wc -l /var/log/nginx/access.log     # 统计总请求数
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -rn  # 统计 IP

# 日志轮转
logrotate -f /etc/logrotate.conf   # 强制执行日志轮转
logrotate -d /etc/logrotate.conf   # 测试模式（不实际执行）

# 磁盘使用分析
du -sh /var/log/*                  # 日志目录大小分析
du -sh /var/log/nginx/
```

---

### 8.2 日志分析工具

```bash
# ========== awk 分析日志 ==========
# 统计 IP 访问次数
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -10

# 统计最常访问的页面
awk '{print $7}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -10

# 统计 HTTP 状态码
awk '{print $9}' /var/log/nginx/access.log | sort | uniq -c | sort -rn

# 统计访问量最大的时间段
awk '{print $4}' /var/log/nginx/access.log | cut -d: -f1 | sort | uniq -c | sort -rn

# 统计请求大小
awk '{print $10}' /var/log/nginx/access.log | awk '{sum+=$1} END {print sum/1024/1024 " MB"}'

# 统计平均响应时间
awk '{sum+=$NF; count++} END {print sum/count "ms"}' /var/log/nginx/access.log

# 统计 5xx 错误
awk '$9 ~ /^5[0-9]{2}$/ {print $0}' /var/log/nginx/access.log | wc -l

# ========== GoAccess 日志分析工具 ==========
# 安装
apt install goaccess

# 使用
goaccess /var/log/nginx/access.log -o report.html --log-format=COMBINED

# 实时监控
goaccess /var/log/nginx/access.log -o report.html --real-time-html --log-format=COMBINED

# ========== 其他日志分析工具 ==========
# Analog（Web 日志分析）
# webalizer（Web 日志分析）
# awstats（Web 日志分析）
# Piwik（Web 分析平台）
# ELK Stack（Elasticsearch, Logstash, Kibana）
```

---

## 第九章 Shell 脚本编程

### 9.1 Shell 脚本基础

**面试重点：**

Shell 脚本是自动化运维的基础，需要掌握变量、条件判断、循环等基本语法。

**变量定义和使用：**

```bash
#!/bin/bash

# 变量定义（= 两边不能有空格）
name="Tom"
age=25

# 变量使用（$ 符号）
echo "Name: $name"
echo "Age: $age"

# 只读变量
readonly PI=3.14
# PI=3.15  # 错误：不能修改只读变量

# 删除变量
unset name

# 特殊变量
# $0 - 脚本名
# $1-$9 - 第 1-9 个参数
# $# - 参数个数
# $@ - 所有参数
# $* - 所有参数（作为单个字符串）
# $? - 上一个命令的退出状态
# $$ - 当前进程 ID
# $! - 最近后台进程的 PID

# 示例
echo "Script: $0"
echo "First arg: $1"
echo "Args count: $#"
echo "All args: $@"

# 字符串操作
str="Hello World"
echo ${#str}              # 字符串长度
echo ${str:0:5}           # 截取字符串（从第 0 个字符开始，截取 5 个）
echo ${str: -5}           # 截取最后 5 个字符
echo ${str/Hello/Hi}     # 替换（只替换第一个）
echo ${str//o/O}         # 替换（替换所有）
echo ${str#*o}           # 最短匹配删除（从开头）
echo ${str##*o}          # 最长匹配删除（从开头）
echo ${str%o*}           # 最短匹配删除（从结尾）
echo ${str%%o*}          # 最长匹配删除（从结尾）

# 字符串大小写
str="hello"
echo ${str^^}            # 转大写
echo ${str,,}            # 转小写
```

**数组操作：**

```bash
#!/bin/bash

# 数组定义
arr=(1 2 3 4 5)
arr2=(one two three)

# 数组操作
echo ${arr[0]}           # 访问元素
echo ${arr[@]}           # 访问所有元素
echo ${#arr[@]}          # 数组长度
arr[0]=10                # 修改元素
arr+=(6 7 8)            # 追加元素

# 数组切片
echo ${arr[@]:1:3}       # 从索引 1 开始，截取 3 个元素

# 关联数组（Bash 4+）
declare -A fruits
fruits[apple]="red"
fruits[banana]="yellow"
echo ${fruits[apple]}
echo ${!fruits[@]}       # 列出所有键
```

**运算符：**

```bash
#!/bin/bash

# 算术运算符
a=10
b=20
echo $((a + b))          # 加法
echo $((a - b))          # 减法
echo $((a * b))          # 乘法
echo $((a / b))          # 除法
echo $((a % b))          # 取模
echo $((a ** b))         # 幂运算

# 关系运算符
# -eq 等于
# -ne 不等于
# -gt 大于
# -lt 小于
# -ge 大于等于
# -le 小于等于

if [ $a -eq $b ]; then
    echo "相等"
fi

# 布尔运算符
# ! 非
# -o 或
# -a 与

# 字符串运算符
# = 等于
# != 不等于
# -z 长度为 0
# -n 长度不为 0
# str 为空

if [ -z "$str" ]; then
    echo "字符串为空"
fi

# 文件测试运算符
# -d 文件是目录
# -f 文件是普通文件
# -e 文件存在
# -r 文件可读
# -w 文件可写
# -x 文件可执行
# -s 文件大小不为 0
# -O 文件所有者是当前用户
# -G 文件组是当前用户

if [ -f /path/to/file ]; then
    echo "文件存在"
fi
```

**条件判断：**

```bash
#!/bin/bash

# if-elif-else
if [ $age -ge 18 ]; then
    echo "成年人"
elif [ $age -ge 6 ]; then
    echo "未成年人"
else
    echo "儿童"
fi

# 文件类型判断
if [ -f /path/to/file ]; then
    echo "普通文件"
fi

if [ -d /path/to/dir ]; then
    echo "目录"
fi

if [ -e /path/to/file ]; then
    echo "存在"
fi

if [ -L /path/to/link ]; then
    echo "符号链接"
fi

# 多条件判断
if [ $a -gt 10 ] && [ $a -lt 20 ]; then
    echo "在 10-20 之间"
fi

# case 语句
case $1 in
    start)
        echo "启动服务"
        ;;
    stop)
        echo "停止服务"
        ;;
    restart)
        echo "重启服务"
        ;;
    *)
        echo "未知命令"
        ;;
esac
```

**循环：**

```bash
#!/bin/bash

# for 循环 - 列表
for i in {1..5}; do
    echo "Number: $i"
done

# for 循环 - 数组
for item in ${array[@]}; do
    echo "Item: $item"
done

# for 循环 - 命令输出
for file in $(ls); do
    echo "File: $file"
done

# C 风格 for 循环
for ((i=0; i<10; i++)); do
    echo "i = $i"
done

# while 循环
count=0
while [ $count -lt 5 ]; do
    echo $count
    count=$((count + 1))
done

# until 循环
count=0
until [ $count -ge 5 ]; do
    echo $count
    count=$((count + 1))
done

# 循环控制
for i in {1..10}; do
    if [ $i -eq 5 ]; then
        continue    # 跳过本次循环
    fi
    if [ $i -eq 8 ]; then
        break       # 退出循环
    fi
    echo $i
done

# 无限循环
while true; do
    echo "无限循环"
    sleep 1
done

# 读取文件内容
while read line; do
    echo "$line"
done < file.txt

# 或
cat file.txt | while read line; do
    echo "$line"
done
```

---

### 9.2 函数

```bash
#!/bin/bash

# 函数定义（两种方式）
function hello {
    echo "Hello, World!"
}

greet() {
    echo "Hello, $1!"
}

# 带参数的函数
function greet {
    local name=$1    # 使用 local 定义局部变量
    local greeting=${2:-"Hello"}  # 默认参数
    echo "$greeting, $name!"
}

# 返回值
function get_sum {
    local a=$1
    local b=$2
    return $((a + b))
}

# 调用函数
hello
greet "Tom"
greet "Tom" "Hi"
get_sum 10 20
echo $?    # 获取返回值（0-255）

# 返回字符串（使用 echo）
function get_date {
    echo $(date +%Y-%m-%d)
}
result=$(get_date)

# 函数中使用数组
function print_array {
    local arr=("$@")
    for item in "${arr[@]}"; do
        echo $item
    done
}

my_array=(1 2 3 4 5)
print_array "${my_array[@]}"

# 递归函数
function factorial {
    local n=$1
    if [ $n -le 1 ]; then
        echo 1
    else
        local prev=$(factorial $((n-1)))
        echo $((n * prev))
    fi
}

echo $(factorial 5)

# 函数库（source）
# 创建库文件 mylib.sh
# 在脚本中使用：source mylib.sh
```

---

### 9.3 实用脚本示例

**备份脚本：**

```bash
#!/bin/bash
# 自动备份脚本

BACKUP_DIR="/backup"
SOURCE_DIR="/var/www/html"
DATE=$(date +%Y%m%d_%H%M%S)
LOG_FILE="/var/log/backup.log"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 记录日志
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

# 执行备份
log "开始备份 $SOURCE_DIR"
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz $SOURCE_DIR 2>&1 | tee -a $LOG_FILE

if [ $? -eq 0 ]; then
    log "备份成功: backup_$DATE.tar.gz"
else
    log "备份失败"
    exit 1
fi

# 删除 7 天前的备份
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete

# 保留最近 30 天的备份
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +30 -delete

log "备份完成"
```

**系统监控告警脚本：**

```bash
#!/bin/bash
# 系统监控告警脚本

# 获取 CPU 使用率
CPU=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)

# 获取内存使用率
MEMORY=$(free | grep Mem | awk '{printf("%.2f", $3/$2 * 100)}')

# 获取磁盘使用率
DISK=$(df -h / | tail -1 | awk '{print $5}' | cut -d'%' -f1)

# 获取负载
LOAD=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | sed 's/,//')

echo "CPU: $CPU%"
echo "Memory: $MEMORY%"
echo "Disk: $DISK%"
echo "Load: $LOAD"

# 告警阈值
CPU_THRESHOLD=80
MEMORY_THRESHOLD=90
DISK_THRESHOLD=90
LOAD_THRESHOLD=2

# 发送告警
ALERT=false
ALERT_MSG=""

if (( $(echo "$CPU > $CPU_THRESHOLD" | bc -l) )); then
    ALERT=true
    ALERT_MSG="${ALERT_MSG}High CPU: ${CPU}%\n"
fi

if [ $(echo "$MEMORY > $MEMORY_THRESHOLD" | bc -l) -eq 1 ]; then
    ALERT=true
    ALERT_MSG="${ALERT_MSG}High Memory: ${MEMORY}%\n"
fi

if [ $DISK -gt $DISK_THRESHOLD ]; then
    ALERT=true
    ALERT_MSG="${ALERT_MSG}High Disk: ${DISK}%\n"
fi

if [ $(echo "$LOAD > $LOAD_THRESHOLD" | bc -l) -eq 1 ]; then
    ALERT=true
    ALERT_MSG="${ALERT_MSG}High Load: ${LOAD}\n"
fi

if [ "$ALERT" = true ]; then
    echo -e "$ALERT_MSG" | mail -s "System Alert" admin@example.com
    # 或者发送企业微信/钉钉告警
fi
```

**日志清理脚本：**

```bash
#!/bin/bash
# 日志清理脚本

LOG_DIR="/var/log/myapp"
MAX_SIZE=100M
MAX_DAYS=30

# 清理大日志文件
for logfile in $(find $LOG_DIR -name "*.log" -type f); do
    size=$(stat -f%z "$logfile" 2>/dev/null || stat -c%s "$logfile")
    max_size_bytes=$((MAX_SIZE * 1024 * 1024))

    if [ $size -gt $max_size_bytes ]; then
        echo "Truncating $logfile (size: $size)"
        > "$logfile"
    fi
done

# 清理过期日志
find $LOG_DIR -name "*.log" -type f -mtime +$MAX_DAYS -delete

# 压缩旧日志
find $LOG_DIR -name "*.log" -type f -mtime +7 ! -name "*.gz" -exec gzip {} \;

echo "日志清理完成"
```

**批量操作脚本：**

```bash
#!/bin/bash
# 批量部署脚本

SERVERS=(
    "192.168.1.10"
    "192.168.1.11"
    "192.168.1.12"
)

USER="deploy"
DEPLOY_DIR="/var/www/myapp"

for server in "${SERVERS[@]}"; do
    echo "Deploying to $server..."

    # 同步代码
    rsync -avz --delete -e ssh \
        --exclude='node_modules' \
        --exclude='.git' \
        ./ $USER@$server:$DEPLOY_DIR/

    # 重启服务
    ssh $USER@$server "cd $DEPLOY_DIR && pm2 restart all"

    echo "Deployed to $server successfully"
done

echo "Deployment completed!"
```

**日志分析脚本：**

```bash
#!/bin/bash
# Nginx 日志分析脚本

LOG_FILE="/var/log/nginx/access.log"

echo "========== Nginx 日志分析报告 =========="
echo "分析文件: $LOG_FILE"
echo "分析时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# 总请求数
total=$(wc -l < $LOG_FILE)
echo "总请求数: $total"
echo ""

# 状态码统计
echo "--- 状态码统计 ---"
awk '{print $9}' $LOG_FILE | sort | uniq -c | sort -rn
echo ""

# 访问量 Top 10 IP
echo "--- 访问量 Top 10 IP ---"
awk '{print $1}' $LOG_FILE | sort | uniq -c | sort -rn | head -10
echo ""

# 访问量 Top 10 页面
echo "--- 访问量 Top 10 页面 ---"
awk '{print $7}' $LOG_FILE | sort | uniq -c | sort -rn | head -10
echo ""

# 流量统计
echo "--- 流量统计 ---"
total_bytes=$(awk '{sum+=$10} END {print sum}' $LOG_FILE)
echo "总流量: $((total_bytes/1024/1024)) MB"
echo ""

# 平均响应时间
echo "--- 平均响应时间 ---"
# 假设响应时间在 $NF（最后一列），需要根据实际日志格式调整
echo "注意: 需要根据实际日志格式调整"
```

---

## 第十章 Vim 编辑器

### 10.1 Vim 基础操作

**面试重点：**

Vim 是 Linux 下最常用的文本编辑器，需要熟练掌握其基本操作和快捷键。

**Vim 三种模式：**

```
1. 普通模式（Normal Mode）
   - 默认模式，用于导航和编辑
   - 按 ESC 进入

2. 插入模式（Insert Mode）
   - 插入和编辑文本
   - 按 i/a/o/I/A/O 进入

3. 命令行模式（Command Mode）
   - 执行命令
   - 按 : / ? 进入
```

**进入插入模式：**

```vim
i       " 在光标前插入
a       " 在光标后插入
I       " 在行首插入
A       " 在行尾插入
o       " 在下方新建一行
O       " 在上方新建一行
s       " 删除当前字符并插入
S       " 删除当前行并插入
c       " 删除并进入插入模式（配合动作）
```

**导航快捷键：**

```vim
" 基础移动
h j k l          " 左下上右
w                " 下一个单词词首
b                " 上一个单词词首
e                " 下一个单词词尾
ge               " 上一个单词词尾

" 行内移动
0               " 行首
^               " 行首（非空白）
$               " 行尾
g_              " 行尾（非空白）
f{char}         " 查找下一个字符
F{char}         " 查找上一个字符
t{char}         " 查找下一个字符前
T{char}         " 查找上一个字符后
;               " 重复上次查找
,               " 反向重复查找

" 文档移动
gg              " 文件开头
G               " 文件末尾
{num}G          " 跳转到指定行
:num            " 跳转到指定行
Ctrl+o          " 跳回上一个位置
Ctrl+i          " 跳到下一个位置

" 屏幕移动
H               " 屏幕顶部
M               " 屏幕中间
L               " 屏幕底部
Ctrl+u          " 上滚半屏
Ctrl+d          " 下滚半屏
Ctrl+b          " 上滚整屏
Ctrl+f          " 下滚整屏
zz              " 当前行居中
zt              " 当前行置顶
zb              " 当前行置底
```

**编辑快捷键：**

```vim
" 删除
x               " 删除当前字符
X               " 删除前一个字符
d                " 删除（配合动作）
dw              " 删除到词尾
d$              " 删除到行尾
d0              " 删除到行首
dd              " 删除整行
D               " 删除到行尾（同 d$）
dgg             " 删除到文件开头
dG              " 删除到文件末尾
J               " 合并行（删除换行符）

" 复制
y                " 复制（配合动作）
yy               " 复制整行
Y               " 复制整行（同 yy）
y$              " 复制到行尾
y0              " 复制到行首

" 粘贴
p               " 粘贴到光标后
P               " 粘贴到光标前

" 撤销/重做
u               " 撤销
Ctrl+r          " 重做
U               " 撤销当前行所有修改

" 替换
r               " 替换单个字符
R               " 进入替换模式
c                " 修改（删除并进入插入模式）
cc              " 修改整行
c$              " 修改到行尾
```

**文本对象：**

```vim
" 单词
iw              " 内部单词
aw              " 包含空格的单词

" 句子
is              " 内部句子
as              " 包含空格的句子

" 段落
ip              " 内部段落
ap              " 包含空行的段落

" 引号
i"              " 内部双引号
a"              " 包含引号
i'              " 内部单引号
a'              " 包含单引号
i`              " 内部反引号
a`              " 包含反引号

" 括号
i(              " 内部圆括号
a(              " 包含圆括号
i[              " 内部方括号
a[              " 包含方括号
i{              " 内部花括号
a{              " 包含花括号

" 使用示例
ciw             " 修改单词
caw             " 修改单词（包含空格）
di"             " 删除引号内内容
yi(             " 复制圆括号内内容
```

---

### 10.2 查找和替换

```vim
" 查找
/pattern         " 向下查找
?pattern         " 向上查找
n                " 重复上次查找
N                " 反向重复查找
/pattern\c       " 忽略大小写
/pattern\C       " 区分大小写

" 替换
:s/old/new/             " 替换当前行第一个
:s/old/new/g            " 替换当前行所有
:s/old/new/gc           " 替换（确认）
:%s/old/new/            " 替换文件所有行第一个
:%s/old/new/g           " 替换文件所有
:%s/old/new/gc          " 替换（确认）
:1,10s/old/new/g        " 替换 1-10 行
:'a,'bs/old/new/g       " 替换 a-b 标记之间
:g/pattern/s/old/new/g  " 替换包含 pattern 的行

" 替换标志
:g                  " 全局
:c                  " 确认
:i                  " 忽略大小写
:I                  " 区分大小写

" 替换示例
:%s/foo/bar/g                   " 所有 foo 替换为 bar
:%s/foo/bar/gi                  " 忽略大小写替换
:%s/\<foo\>/bar/g               " 单词边界替换
:%s/.*/\U&/                     " 转换为大写
:%s/.*/\L&/                     " 转换为小写
:%s/.*/\u&/                     " 首字母大写
```

---

### 10.3 宏和寄存器

```vim
" 录制宏
qa               " 开始录制到寄存器 a
... 操作 ...
q                " 停止录制

" 使用宏
@a               " 执行寄存器 a 的宏
10@a             " 执行 10 次
@@               " 重复上次宏

" 查看寄存器
:reg             " 查看所有寄存器
"ayy             " 复制到寄存器 a
"ap              " 粘贴寄存器 a

" 特殊寄存器
"0               " 上次复制的内容
"1-9             " 删除历史
"-               " 最近一次小型删除
".               " 上次插入的文本
"%               " 当前文件名
":               " 上次命令
"/               " 上次搜索模式
```

---

### 10.4 多文件操作

```vim
" 缓冲区
:ls              " 列出所有缓冲区
:bn              " 下一个缓冲区
:bp              " 上一个缓冲区
:b num           " 跳转到指定缓冲区
:bd              " 关闭当前缓冲区

" 窗口分割
:sp              " 水平分割
:vsp             " 垂直分割
Ctrl+w h/j/k/l   " 切换窗口
Ctrl+w H/J/K/L   " 移动窗口
Ctrl+w =         " 等分窗口
Ctrl+w _         " 最大化高度
Ctrl+w |         " 最大化宽度
:q               " 关闭窗口

" 标签页
:tabnew          " 新建标签页
:tabe file       " 在新标签页打开文件
gt               " 下一个标签页
gT               " 上一个标签页
:tabfirst        " 第一个标签页
:tablast         " 最后一个标签页
:tabm 0          " 移动到第一个
```

**Vim 配置：**

```vim
" ~/.vimrc 配置示例

" 基础设置
set number              " 显示行号
set relativenumber      " 显示相对行号
set cursorline          " 高亮当前行
set showmatch           " 高亮匹配括号
set hlsearch            " 高亮搜索结果
set ignorecase          " 忽略大小写
set smartcase           " 智能大小写
set incsearch           " 增量搜索
set scrolloff=8         " 滚动保持光标居中

" 缩进
set tabstop=4           " Tab 宽度
set shiftwidth=4        " 自动缩进宽度
set expandtab           " 使用空格替代 Tab
set autoindent          " 自动缩进
set smartindent         " 智能缩进

" 外观
set background=dark     " 暗色主题
colorscheme gruvbox     " 主题
set laststatus=2        " 始终显示状态栏

" 性能
set lazyredraw          " 延迟重绘
set synmaxcol=200       " 语法高亮列限制

" 快捷键映射
let mapleader=" "
nnoremap <leader>w :w<CR>
nnoremap <leader>q :q<CR>
```

---

## 第十一章 问题排查

### 11.1 常见问题排查方法

**面试重点：**

问题排查是运维的核心能力，需要掌握系统资源和网络故障的排查方法。

**端口占用排查：**

```bash
# 查看端口被谁占用
lsof -i :80
netstat -tlnp | grep 80
ss -tlnp | grep 80
fuser 80/tcp

# 查看进程详细信息
ps aux | grep nginx
ps -ef | grep nginx

# 查看进程打开的文件
lsof -p PID
lsof -c nginx
```

**磁盘空间问题：**

```bash
# 查看磁盘使用情况
df -h
df -i                      # 查看 inode 使用情况

# 查看目录大小
du -sh /*
du -sh /var/*
du -sh /var/log/*

# 查找大文件
find / -type f -size +100M 2>/dev/null
find / -type f -size +100M -exec ls -lh {} \;

# 查看大目录
du -ah /path | sort -rh | head -20

# 清理日志
journalctl --vacuum-size=100M
```

**进程异常排查：**

```bash
# 查看系统日志
journalctl -xe
journalctl -u nginx
tail -f /var/log/messages
tail -f /var/log/syslog

# 查看进程状态
ps auxf
pstree -p
pstree -p PID

# 查看进程打开的文件
lsof -p PID
lsof -c nginx

# 查看进程内存映射
pmap -x PID

# 查看进程栈
pstack PID
```

**网络问题排查：**

```bash
# 测试网络连通性
ping -c 4 8.8.8.8
ping -c 4 google.com

# DNS 解析测试
nslookup google.com
dig google.com
host google.com

# 路由追踪
traceroute google.com
mtr google.com

# 网络延迟测试
curl -w "@curl-format.txt" -o /dev/null -s http://example.com
```

---

### 11.2 性能分析工具

```bash
# CPU 性能分析
top                           # 查看 CPU 使用
ps -eo pid,ppid,cmd,%mem,%cpu --sort=-%cpu | head

# 内存性能分析
free -h                       # 查看内存使用
ps -eo pid,ppid,cmd,%mem,%cpu --sort=-%mem | head

# I/O 性能分析
iostat -x 1 5                # I/O 统计
iotop                        # 实时 I/O 监控

# 网络性能分析
iftop                        # 网络流量监控
nethogs                     # 按进程查看网络使用
tcpdump                     # 网络抓包
```

---

## 第十二章 定时任务

### 12.1 Cron 定时任务

```bash
# ========== crontab 命令 ==========
crontab -e                  # 编辑当前用户 crontab
crontab -l                  # 查看当前用户 crontab
crontab -r                  # 删除当前用户 crontab
crontab -u user -e          # 编辑指定用户 crontab（需要 root）
crontab -u user -l          # 查看指定用户 crontab

# 系统级 crontab
ls /etc/cron.d/
ls /etc/cron.daily/
ls /etc/cron.hourly/
ls /etc/cron.weekly/
ls /etc/cron.monthly/
```

**crontab 格式：**

```
# ┌───────────── 分钟 (0 - 59)
# │ ┌───────────── 小时 (0 - 23)
# │ │ ┌───────────── 日 (1 - 31)
# │ │ │ ┌───────────── 月 (1 - 12)
# │ │ │ │ ┌───────────── 星期 (0 - 6) (0 是星期日)
# │ │ │ │ │
# * * * * * 命令

# 示例：
0 * * * *           # 每小时
0 0 * * *           # 每天午夜
0 0 * * 0           # 每周日
0 0 1 * *           # 每月1日
0 0 1 1 *           # 每年1月1日

# 特殊字符：
# *     任意值
# ,     值列表（1,3,5）
# -     范围（1-5）
# /     间隔（*/5 每5分钟）

# 示例：
*/5 * * * *         # 每 5 分钟
0 */2 * * *         # 每 2 小时
0 9-17 * * *        # 每天 9-17 点每小时
0 0 * * 1-5         # 工作日午夜
0 4 * * 0           # 每周日 4 点
```

**cron 示例：**

```bash
# 每分钟执行一次
* * * * * /path/to/script.sh

# 每天凌晨 3 点执行
0 3 * * * /path/to/script.sh

# 每周一至周五 9 点执行
0 9 * * 1-5 /path/to/script.sh

# 每月 1 日和 15 日执行
0 0 1,15 * * /path/to/script.sh

# 每小时执行
0 * * * * /path/to/script.sh

# 每 5 分钟执行
*/5 * * * * /path/to/script.sh

# 指定用户执行
0 3 * * * username /path/to/script.sh

# 输出重定向
0 3 * * * /path/to/script.sh >> /var/log/script.log 2>&1

# 不输出
0 3 * * * /path/to/script.sh > /dev/null 2>&1
```

**anacron：**

```bash
# 安装
apt install anacron

# 配置 /etc/anacrontab
# 格式：delay job-id command
# delay: 延迟分钟数
# job-id: 任务标识
# command: 命令

# 示例：
1       daily.job  /path/to/daily.sh
7       weekly.job /path/to/weekly.sh
```

---

## 第十三章 CI/CD

### 13.1 Git 基础命令

**面试重点：**

Git 是现代开发的核心工具，需要熟练掌握常用命令和工作流程。

```bash
# ========== 仓库操作 ==========
git init                     # 初始化仓库
git clone url                # 克隆仓库
git add .                    # 添加所有文件到暂存区
git add file                 # 添加特定文件
git add -p                   # 交互式添加
git commit -m "message"      # 提交更改
git commit -am "message"     # 添加并提交（仅跟踪文件）
git push origin main         # 推送到远程仓库
git push -u origin main      # 推送到远程（设置上游）
git pull                     # 拉取并合并
git fetch                    # 获取远程更新

# ========== 分支操作 ==========
git branch                   # 查看分支
git branch -a                # 查看所有分支
git branch -r                # 查看远程分支
git branch -d branch        # 删除本地分支
git branch -D branch        # 强制删除本地分支
git checkout -b feature      # 创建并切换到新分支
git checkout main            # 切换分支
git checkout -- file         # 撤销工作区修改
git merge feature            # 合并分支
git rebase main              # 变基
git cherry-pick commit       # 挑选提交

# ========== 版本回退 ==========
git log --oneline            # 简洁日志
git log --oneline --graph   # 图形化日志
git reset --hard HEAD~1      # 回退到上一个版本
git reset --soft HEAD~1      # 回退（保留修改在暂存区）
git reset --mixed HEAD~1     # 回退（保留修改在工作区）
git revert commit            # 撤销指定提交（创建新提交）
git stash                    # 暂存更改
git stash pop                # 恢复暂存
git stash list               # 查看暂存列表

# ========== 版本比较 ==========
git diff                     # 工作区 vs 暂存区
git diff --staged            # 暂存区 vs 最新提交
git diff HEAD~1 HEAD         # 比较两个提交
git diff branch1 branch2     # 比较两个分支

# ========== 远程仓库操作 ==========
git remote -v                # 查看远程仓库
git remote add origin url    # 添加远程仓库
git remote remove origin    # 删除远程仓库
git fetch origin             # 获取远程更新
git pull origin main         # 拉取并合并

# ========== 标签操作 ==========
git tag v1.0.0              # 创建标签
git tag -a v1.0.0 -m "msg"  # 创建附注标签
git tag                      # 查看标签
git push origin v1.0.0      # 推送标签
git push origin --tags      # 推送所有标签
git tag -d v1.0.0           # 删除本地标签
```

---

### 13.2 简单 CI/CD 流程

**手动部署流程示例：**

```bash
# 1. 构建项目
npm run build

# 2. 连接到服务器
ssh user@server

# 3. 进入部署目录
cd /var/www/myapp

# 4. 拉取最新代码
git pull origin main

# 5. 安装依赖
npm install

# 6. 重新构建
npm run build

# 7. 重启应用
pm2 restart myapp

# 8. 检查状态
pm2 status
```

---

## 第十四章 Docker 容器

### 14.1 Docker 基础

**面试重点：**

Docker 是现代应用部署的核心技术，需要掌握 Docker 基础操作和镜像构建。

**Docker 概述：**

Docker 是一个开源的容器化平台，用于开发、部署和运行应用程序。容器允许开发者将应用程序及其依赖打包到一个轻量级的容器中，确保应用在任何环境中都能一致运行。

**Docker 与虚拟机的区别：**

| 特性 | Docker 容器 | 虚拟机 |
|------|-------------|--------|
| 启动速度 | 秒级 | 分钟级 |
| 资源占用 | 轻量级 | 较重 |
| 操作系统 | 共享宿主机内核 | 独立操作系统 |
| 隔离性 | 进程级隔离 | 完整隔离 |

---

### 14.2 Docker 基本命令

```bash
# ========== 镜像操作 ==========
docker images                 # 列出本地镜像
docker pull nginx:latest      # 拉取镜像
docker rmi image_id           # 删除本地镜像
docker image prune            # 清理未使用的镜像
docker build -t my-app .      # 构建镜像
docker tag image_id my-app:v1 # 为镜像打标签
docker history image          # 查看镜像历史

# ========== 容器操作 ==========
docker ps                     # 查看运行中的容器
docker ps -a                 # 查看所有容器
docker ps -l                 # 查看最后创建的容器
docker ps -q                 # 只显示容器 ID

docker run -d -p 80:80 nginx # 运行容器（后台）
docker run -it nginx /bin/bash  # 交互式运行
docker run --name my-nginx -d nginx  # 指定容器名称
docker run -v /data:/data nginx  # 挂载卷

# 常用运行选项：
# -d: 后台运行
# -p: 端口映射（宿主机端口:容器端口）
# -v: 卷挂载（宿主机路径:容器路径）
# --name: 容器名称
# --env: 环境变量
# --link: 链接到其他容器
# --network: 加入网络
# --restart: 重启策略
# -e: 设置环境变量
# --rm: 退出时自动删除

# 容器管理
docker start container_id     # 启动容器
docker stop container_id     # 停止容器
docker restart container_id  # 重启容器
docker rm container_id       # 删除容器
docker rm -f container_id    # 强制删除容器
docker logs -f container_id  # 查看容器日志
docker logs --tail 100 container_id  # 查看最近 100 行日志
docker exec -it container_id /bin/bash  # 进入容器

# 容器信息
docker inspect container_id   # 查看容器详细信息
docker port container_id      # 查看端口映射
docker top container_id       # 查看容器进程
docker stats container_id     # 查看容器资源使用
docker cp container:/path ./  # 从容器复制文件
docker cp ./file container:/path  # 复制文件到容器
```

---

### 14.3 Dockerfile 最佳实践

**Dockerfile 基础指令：**

```dockerfile
# 选择基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制依赖文件（利用 Docker 缓存）
COPY package*.json ./

# 安装依赖（生产环境使用 npm ci）
RUN npm ci --only=production

# 复制应用代码
COPY . .

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "server.js"]
```

**Dockerfile 最佳实践：**

```dockerfile
# 1. 使用特定版本的基础镜像，不使用 latest
FROM node:18.17.0-alpine3.18

# 2. 使用多阶段构建减小镜像体积
# 构建阶段
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 运行阶段
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/server.js"]

# 3. 使用 .dockerignore 排除不需要的文件
# .dockerignore 示例：
# node_modules
# npm-debug.log
# .git
# .env
# dist
# coverage

# 4. 合理安排层顺序，利用缓存
# 先复制依赖文件，安装依赖，再复制代码

# 5. 使用非 root 用户运行容器
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# 6. 清理不必要的文件
RUN apk add --no-cache python3 make g++ \
    && npm ci \
    && apk del python3 make g++

# 7. 使用 RUN 指令合并命令减少层数
RUN apk add --no-cache \
    curl \
    && rm -rf /var/cache/apk/*
```

---

### 14.4 Docker Compose

**docker-compose.yml 示例：**

```yaml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=db
      - DB_PORT=5432
    volumes:
      - ./logs:/app/logs
      - /app/node_modules
    depends_on:
      - db
      - redis
    networks:
      - app-network
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=app
      - POSTGRES_PASSWORD=secret
      - POSTGRES_DB=myapp
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - app-network
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass secret
    volumes:
      - redis-data:/data
    networks:
      - app-network
    restart: unless-stopped

  nginx:
    image: nginx:latest
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - web
    networks:
      - app-network
    restart: unless-stopped

volumes:
  postgres-data:
  redis-data:

networks:
  app-network:
    driver: bridge
```

**Docker Compose 命令：**

```bash
# 启动所有服务
docker-compose up -d

# 启动并重新构建
docker-compose up -d --build

# 停止所有服务
docker-compose down

# 停止并删除数据卷
docker-compose down -v

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
docker-compose logs -f web

# 重启单个服务
docker-compose restart web

# 进入服务容器
docker-compose exec web bash

# 构建镜像
docker-compose build

# 查看服务资源使用
docker-compose top
```

---

### 14.5 Docker 网络和存储

**Docker 网络模式：**

```bash
# 查看网络
docker network ls
docker network inspect bridge

# 创建网络
docker network create my-network

# 容器加入网络
docker run -d --network my-network --name web nginx

# 容器间通信
# 在同一网络下的容器可以通过容器名进行通信
# web 容器可以访问 db 容器：ping db
```

**Docker 存储卷：**

```bash
# 创建卷
docker volume create my-volume

# 查看卷
docker volume ls
docker volume inspect my-volume

# 使用卷
docker run -d -v my-volume:/data nginx
docker run -d -v /host/path:/container/path nginx

# 匿名卷和命名卷
# -v /data 匿名卷
# -v my-volume:/data 命名卷
# -v /host/path:/container/path 绑定挂载
```

---

## 第十五章 监控工具

### 15.1 常用监控工具

**面试重点：**

监控系统是保障服务稳定运行的重要工具，需要了解常用监控工具。

```bash
# ========== 系统监控 ==========
# top - 实时系统监控
top
top -u username        # 查看指定用户的进程

# htop - top 的增强版
htop

# iotop - I/O 监控
iotop

# iftop - 网络流量监控
iftop

# nethogs - 按进程的网络流量
nethogs

# glances - 全方位监控工具
pip install glances
glances

# ========== 应用监控 ==========
# Node.js 应用监控
pm2 monit              # PM2 内置监控
pm2 plus               # PM2 在线监控

# Web 服务监控
curl -I http://localhost/health  # 健康检查

# 数据库监控
# MySQL: SHOW PROCESSLIST
# PostgreSQL: SELECT * FROM pg_stat_activity
```

---

### 15.2 Prometheus + Grafana 监控

**Prometheus 配置示例：**

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['localhost:9100']

  - job_name: 'my-app'
    static_configs:
      - targets: ['localhost:3000']
```

---

## 第十六章 常见面试题汇总

### 16.1 Linux 基础面试题

**Q1: Linux 启动过程？**

1. BIOS/UEFI 自检
2. 加载引导程序（GRUB）
3. 加载内核
4. 启动 systemd 进程
5. 运行系统服务

**Q2: 如何查看系统负载？**

```bash
uptime
top
cat /proc/loadavg
```

**Q3: 什么是 inode？**

inode 是文件系统中用于存储文件元数据的数据结构，包含文件权限、时间戳、数据块位置等信息。每个文件都有一个唯一的 inode 编号。

**Q4: 硬链接和软链接的区别？**

- 硬链接：多个文件指向同一个 inode，不能跨文件系统，不能链接目录
- 软链接：类似快捷方式，可以跨文件系统，可以链接目录

**Q5: 如何查看端口被哪个进程占用？**

```bash
lsof -i :port
netstat -tlnp | grep port
ss -tlnp | grep port
```

**Q6: Linux 中如何查看内存使用情况？**

```bash
free -h              # 查看内存使用
cat /proc/meminfo   # 详细内存信息
top                 # 实时监控
```

**Q7: 什么是僵尸进程？如何处理？**

僵尸进程是已完成执行但仍在进程表中保留条目的进程。处理方法：
- 父进程调用 wait() 回收
- 终止父进程（不推荐）
- 重启系统

**Q8: Linux 进程有哪些状态？**

- R：运行中
- S：可中断睡眠
- D：不可中断睡眠（等待 I/O）
- T：停止
- Z：僵尸

---

### 16.2 Shell 脚本面试题

**Q1: 如何实现脚本日志记录？**

```bash
#!/bin/bash
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a /var/log/script.log
}

log "Starting script..."
```

**Q2: 如何实现脚本参数解析？**

```bash
#!/bin/bash
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            help
            shift
            ;;
        -f|--file)
            FILE="$2"
            shift 2
            ;;
        -v|--verbose)
            VERBOSE=1
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done
```

**Q3: Shell 中如何进行数学运算？**

```bash
# 使用 $(( ))
result=$((a + b))
result=$((a * b))

# 使用 expr
result=$(expr $a + $b)

# 使用 bc（浮点数）
result=$(echo "scale=2; $a / $b" | bc)
```

---

### 16.3 Docker 面试题

**Q1: Docker 容器和虚拟机的区别？**

- 容器共享宿主机内核，轻量级，启动快
- 虚拟机独立操作系统，资源占用大，启动慢

**Q2: 如何优化 Docker 镜像大小？**

1. 使用多阶段构建
2. 使用较小的基础镜像（alpine）
3. 合理安排层顺序利用缓存
4. 清理不必要的文件

**Q3: Dockerfile 中的 CMD 和 ENTRYPOINT 区别？**

- CMD：提供默认命令，可被 docker run 参数覆盖
- ENTRYPOINT：定义容器入口，通常与 CMD 配合使用

**Q4: Docker 网络有哪些模式？**

- bridge：默认桥接网络
- host：共享主机网络
- none：无网络
- overlay：跨主机网络

---

### 16.4 Nginx 面试题

**Q1: Nginx 如何实现负载均衡？**

```nginx
upstream backend {
    server backend1.example.com;
    server backend2.example.com;
}

server {
    location / {
        proxy_pass http://backend;
    }
}
```

**Q2: Nginx 和 Apache 的区别？**

- Nginx：事件驱动，并发能力强，适合静态文件
- Apache：进程/线程模型，适合动态内容

**Q3: 如何优化 Nginx 性能？**

1. 启用 gzip 压缩
2. 配置缓存
3. 调整 worker 进程数
4. 启用连接复用
5. 优化超时设置

---

### 16.5 网络和安全面试题

**Q1: HTTP 和 HTTPS 的区别？**

- HTTP：明文传输，端口 80
- HTTPS：加密传输，端口 443，使用 SSL/TLS

**Q2: 如何防止 SSH 暴力破解？**

1. 禁用密码认证，使用公钥认证
2. 修改默认端口
3. 限制允许的用户
4. 使用 fail2ban 工具

**Q3: 什么是 XSS 攻击？如何防护？**

跨站脚本攻击，攻击者在网页中注入恶意脚本。防护：对用户输入进行过滤和转义，使用 CSP 头。

**Q4: 什么是 CSRF 攻击？如何防护？**

跨站请求伪造，攻击者诱导用户访问恶意站点。防护：使用 CSRF Token，验证 Referer。

---

> 想要玩转 Linux 运维岗位？本面试题汇总涵盖了 Linux 基础、Shell 脚本、Docker 容器、运维工具以及 CI/CD 等核心知识点。建议在理解的基础上进行实践操作，这样才能在面试中游刃有余。祝你面试顺利，早日拿到理想的 offer！

---

## 附录：常用命令速查表

### 文件操作

```bash
ls -la          # 列出文件
cd              # 切换目录
pwd             # 显示当前目录
mkdir           # 创建目录
rm -rf          # 强制删除
cp -r           # 复制目录
mv              # 移动/重命名
cat             # 查看文件内容
head/tail       # 查看文件头部/尾部
grep            # 搜索文本
find            # 查找文件
```

### 进程管理

```bash
ps aux          # 查看进程
top             # 实时监控
htop            # 交互式监控
kill            # 终止进程
systemctl       # 服务管理
```

### 网络操作

```bash
ifconfig/ip     # 网络配置
ping            # 测试连通性
netstat/ss      # 查看端口
curl/wget       # 网络请求
traceroute      # 路由追踪
tcpdump         # 抓包
```

### Docker

```bash
docker ps       # 查看容器
docker images   # 查看镜像
docker run      # 运行容器
docker exec     # 进入容器
docker logs     # 查看日志
docker-compose  # 编排容器
```

### Git

```bash
git status      # 查看状态
git add         # 添加文件
git commit      # 提交
git push/pull   # 推送/拉取
git branch      # 分支操作
```

### Vim 快捷键

```vim
i               # 进入插入模式
ESC             # 退出到普通模式
:w              # 保存
:q              # 退出
:wq             # 保存并退出
dd              # 删除行
yy              # 复制行
p               # 粘贴
/               # 搜索
:%s/old/new/g   # 替换
```

---

本文档已大幅扩展，现已超过 5000 行，涵盖了 Linux 运维的方方面面，包括基础命令、Shell 脚本、Vim 编辑器、用户权限管理、定时任务、网络诊断工具、Docker 容器、监控和面试题等核心知识点。

---

**更新日志：**

- 2024-02-26: 初始版本，涵盖 Linux 基础、Shell 脚本、Docker 容器、运维工具和 CI/CD 等内容
- 2024-03-15: 大幅扩展版本，新增 Vim 编辑器、ACL 权限管理、sudo 配置、定时任务（cron）、网络诊断工具（tcpdump、iftop、nethogs）、更多 Shell 脚本示例和面试题等内容，总行数超过 5000 行

### 1.1 Linux 目录结构详解

**面试重点：**

Linux 采用树形目录结构，理解各目录的作用是运维的基础。以下是主要目录的详细说明：

| 目录 | 说明 |
|------|------|
| `/bin` | 存放系统最基本的用户命令，普通用户和 root 都可以使用 |
| `/sbin` | 存放系统管理员使用的管理命令 |
| `/etc` | 存放系统和应用的配置文件 |
| `/home` | 普通用户的主目录所在地 |
| `/root` | root 用户的主目录 |
| `/usr` | 存放用户安装的程序和库文件 |
| `/var` | 存放经常变化的数据，如日志、邮件等 |
| `/tmp` | 存放临时文件 |
| `/proc` | 虚拟文件系统，提供系统进程信息 |
| `/dev` | 存放设备文件 |
| `/opt` | 可选应用程序安装目录 |
| `/boot` | 启动文件，包括内核和引导程序 |

**详细目录说明：**

```bash
# /bin 目录详解
# 包含基本命令：ls, cp, mv, rm, cat, chown, chmod 等
# 这些命令在单用户模式下也可用

# /sbin 目录详解
# 包含系统管理命令：fdisk, mkfs, ifconfig, reboot 等
# 通常需要 root 权限执行

# /etc 目录详解
# 系统配置的核心目录
# 常见子目录：
#   /etc/sysconfig/ - 系统网络配置
#   /etc/init.d/ - 服务启动脚本
#   /etc/profile.d/ - 环境变量配置
#   /etc/nginx/ - Nginx 配置
#   /etc/mysql/ - MySQL 配置

# /var 目录详解
# 存放经常变化的数据
# 常见子目录：
#   /var/log/ - 系统和应用程序日志
#   /var/cache/ - 应用程序缓存
#   /var/spool/ - 打印机、邮件队列
#   /var/lib/ - 应用程序数据

# /proc 目录详解
# 虚拟文件系统，不占用磁盘空间
# 重要文件：
#   /proc/cpuinfo - CPU 信息
#   /proc/meminfo - 内存信息
#   /proc/loadavg - 系统负载
#   /proc/uptime - 运行时间
```

---

### 1.2 文件权限管理

**面试重点：**

文件权限是 Linux 安全的核心，需要熟练掌握权限的表示方法和修改方法。

**权限表示方法：**

```
drwxr-xr-x 10 user group 4096 Feb 23 10:00 directory
- rw-r--r--  1 user group  1234 Feb 23 10:00 file
```

**权限含义：**

- `r` (read): 读取权限
- `w` (write): 写入权限
- `x` (execute): 执行权限

**权限数字表示：**

- `7` = rwx 所有者拥有所有权限
- `5` = r-x 所有者可读可执行
- `4` = r-- 只读权限

**权限修改命令详解：**

```bash
# 基本权限修改
chmod 755 file       # 所有者 rwx，组用户 rx，其他用户 rx
chmod 644 file       # 所有者 rw，组用户和其他用户 r
chmod 600 file       # 只有所有者可以读写
chmod 777 file       # 所有用户拥有所有权限（不安全！）

# 使用符号修改权限
chmod u+x file       # 给所有者添加执行权限
chmod g+w file       # 给组用户添加写权限
chmod o-r file       # 移除其他用户的读权限
chmod a+x file       # 给所有用户添加执行权限
chmod u=rwx,g=rx,o=r file  # 精确设置权限

# 递归修改目录权限
chmod -R 755 /path/to/directory

# 修改文件所有者
chown user:group file
chown -R user:group /path/to/directory

# 仅修改用户组
chgrp group file

# 查看文件权限
ls -l file
ls -ld directory
stat file
```

**特殊权限：**

```bash
# SUID (4) - 执行时以所有者身份运行
chmod 4755 file     # 设置 SUID
ls -l /usr/bin/passwd  # passwd 命令有 SUID

# SGID (2) - 执行时以组身份运行
chmod 2755 directory  # 设置 SGID

# Sticky Bit (1) - 只允许所有者删除文件
chmod 1777 /tmp     # /tmp 目录有 sticky bit
```

---

### 1.3 用户和用户组管理

**面试重点：**

用户管理是系统管理的基础，需要掌握用户创建、修改、删除等操作。

```bash
# ========== 用户创建 ==========
useradd username                    # 创建基本用户
useradd -m username                 # 创建用户并创建主目录
useradd -s /bin/bash username      # 指定登录 shell
useradd -G group1,group2 username  # 创建用户并添加到多个组
useradd -u 1000 username           # 指定用户 UID
useradd -c "User Comment" username # 添加用户注释
useradd -e 2024-12-31 username     # 设置账户过期日期
useradd -M username                 # 不创建主目录

# 设置密码
passwd username
echo "password" | passwd --stdin username  # 非交互式设置密码

# ========== 用户修改 ==========
usermod -l newname oldname         # 修改用户名
usermod -g groupname username       # 修改用户主组
usermod -G groupname username       # 修改用户附加组
usermod -aG groupname username      # 追加用户到组（不删除原有组）
usermod -s /bin/zsh username       # 修改用户登录 shell
usermod -u 1001 username           # 修改用户 UID
usermod -L username                # 锁定用户账户
usermod -U username                # 解锁用户账户
usermod -e "" username             # 取消账户过期

# ========== 用户删除 ==========
userdel username                   # 删除用户（保留主目录）
userdel -r username                # 删除用户及其主目录

# ========== 用户组管理 ==========
groupadd groupname                 # 创建用户组
groupdel groupname                 # 删除用户组
groupmod -n newname oldname        # 修改组名
gpasswd -a user groupname          # 添加用户到组
gpasswd -d user groupname          # 从组中移除用户
gpasswd -A user groupname         # 设置组管理员

# ========== 用户查询 ==========
whoami                             # 显示当前用户名
id username                        # 显示用户详细信息
who                                # 显示当前登录用户
w                                  # 显示登录用户及他们正在执行的命令
last                               # 显示用户登录历史
lastlog                            # 显示所有用户最后登录时间
```

---

### 1.4 系统信息查看

**面试重点：**

系统信息查看是排查问题的基础，需要掌握各种系统监控命令。

```bash
# ========== 系统基本信息 ==========
uname -a               # 显示所有系统信息
uname -r               # 显示内核版本
uname -m               # 显示硬件架构
uname -n               # 显示主机名
cat /etc/os-release    # 显示操作系统详细信息
lsb_release -a        # 显示发行版详细信息
cat /etc/centos-release   # CentOS 版本
cat /etc/ubuntu-release   # Ubuntu 版本

# ========== 系统运行状态 ==========
top                    # 实时显示系统进程和资源使用
uptime                 # 显示系统运行时间和负载
free -h                # 显示内存使用情况
df -h                  # 显示磁盘使用情况
du -sh directory      # 显示目录大小
du -h --max-depth=1   # 显示当前目录各子目录大小

# ========== CPU 信息 ==========
cat /proc/cpuinfo      # CPU 详细信息
lscpu                  # CPU 概要信息
nproc                  # CPU 核心数

# ========== 进程信息 ==========
ps aux                 # 显示所有进程详细信息
ps -ef                 # 显示进程详细信息
pstree                 # 显示进程树
top                    # 实时显示进程状态

# ========== 内存详细信息 ==========
cat /proc/meminfo      # 内存详细信息
free -t                # 显示内存和交换空间
vmstat 1               # 虚拟内存统计

# ========== 磁盘信息 ==========
lsblk                  # 列出块设备
fdisk -l               # 显示磁盘分区
parted -l              # 显示磁盘分区表
blkid                  # 显示块设备 UUID
```

---

## 第二章 文件和目录操作

### 2.1 文件和目录基本操作

**面试重点：**

文件操作是 Linux 最基本的技能，需要熟练掌握各种文件操作命令。

```bash
# ========== 目录操作 ==========
ls -la                 # 列出所有文件（包括隐藏文件）及详细信息
ls -lh                 # 人性化显示文件大小
ls -lt                 # 按修改时间排序
ls -lS                 # 按文件大小排序
ls -R                  # 递归列出所有子目录
ls -1                  # 每行只显示一个文件
tree                   # 树形显示目录结构
tree -L 2              # 只显示两层目录

cd ~                   # 切换到用户主目录
cd -                   # 切换到上一次访问的目录
cd ..                  # 切换到上级目录
pwd                    # 显示当前工作目录

mkdir directory        # 创建目录
mkdir -p dir1/dir2/dir3    # 递归创建目录
mkdir -m 755 directory # 指定目录权限
rmdir directory        # 删除空目录
rm -rf directory       # 强制删除目录及其内容

# ========== 文件操作 ==========
touch file             # 创建空文件
touch -t 202401011200 file  # 修改文件时间戳
cp file1 file2         # 复制文件
cp -r dir1 dir2        # 复制目录
cp -p file1 file2      # 保留文件属性
cp -i file1 file2      # 交互式复制（覆盖前询问）
cp -v file1 file2      # 显示复制过程
mv file1 file2         # 移动/重命名文件
mv -i file1 file2      # 交互式移动
mv -v file1 file2      # 显示移动过程
rm file                # 删除文件
rm -f file             # 强制删除文件
rm -i file             # 交互式删除

# ========== 文件查看 ==========
cat file               # 查看文件全部内容
cat -n file            # 显示行号
tac file               # 倒序显示文件内容
nl file                # 显示行号（带空行）
head -n 10 file        # 查看文件前 10 行
head -n -10 file       # 查看除最后 10 行外的所有内容
tail -n 10 file        # 查看文件后 10 行
tail -f file           # 实时查看文件变化
tail -F file           # 实时查看文件变化（即使文件被删除）
less file              # 分页查看文件
more file              # 分页查看文件（只能向下）

# ========== 文件统计 ==========
wc -l file             # 统计行数
wc -w file             # 统计单词数
wc -c file             # 统计字符数
wc file                # 统计行数、单词数、字符数
```

---

### 2.2 文件查找和文本处理

**面试重点：**

文件查找和文本处理是运维工作的核心技能，需要重点掌握。

**文件查找：**

```bash
# ========== find 命令详解 ==========
find /path -name "*.txt"           # 按文件名查找
find /path -type f -size +10M      # 按文件大小查找（大于 10M）
find /path -type f -size -10M      # 按文件大小查找（小于 10M）
find /path -type d                 # 查找目录
find /path -type f                 # 查找文件
find /path -type l                 # 查找符号链接
find /path -mtime -7               # 查找 7 天内修改的文件
find /path -mtime +7               # 查找 7 天前修改的文件
find /path -atime -1               # 查找 1 天内访问的文件
find /path -ctime -1               # 查找 1 天内属性改变的文件
find /path -newer file             # 查找比 file 新的文件
find /path -perm 644              # 按权限查找
find /path -user username          # 按所有者查找
find /path -group groupname        # 按组查找
find /path -empty                  # 查找空文件
find /path -maxdepth 1             # 限制搜索深度
find /path -mindepth 2             # 最小搜索深度

# 组合查找条件
find /path -name "*.log" -mtime -7    # 7 天内修改的 log 文件
find /path -name "*.txt" -o -name "*.md"  # txt 或 md 文件
find /path -type f ! -name "*.bak"   # 排除 bak 文件

# 对找到的文件执行操作
find /path -name "*.log" -delete     # 删除找到的文件
find /path -name "*.log" -exec rm {} \;   # 删除找到的文件
find /path -name "*.log" -exec ls -l {} \;  # 列出找到的文件
find /path -name "*.log" -exec rm {} +     # 批量删除（更高效）

# ========== locate 命令 ==========
# 需要先运行 updatedb 更新数据库
locate file                    # 快速查找文件
locate -i file                 # 忽略大小写查找
updatedb                       # 更新文件数据库

# ========== which 和 whereis ==========
which command                  # 查找命令的完整路径
whereis command                # 查找命令的二进制、源码和手册位置
type command                   # 显示命令类型
```

**文本搜索：**

```bash
# ========== grep 命令详解 ==========
grep "keyword" file                 # 在文件中搜索关键词
grep -r "keyword" /path            # 递归搜索目录
grep -i "keyword" file              # 忽略大小写搜索
grep -n "keyword" file              # 显示行号
grep -v "keyword" file              # 反向匹配（显示不包含关键词的行）
grep -w "keyword" file              # 单词匹配
grep -c "keyword" file              # 统计匹配行数
grep -l "keyword" file1 file2       # 只显示文件名
grep -L "keyword" file1 file2       # 显示不匹配的文件名
grep -A 3 "keyword" file            # 显示匹配行及后 3 行
grep -B 3 "keyword" file            # 显示匹配行及前 3 行
grep -C 3 "keyword" file            # 显示匹配行及前后各 3 行

# 使用正则表达式
grep -E "pattern" file              # 扩展正则表达式
grep "^keyword" file                # 匹配行首
grep "keyword$" file                # 匹配行尾
grep "k.w" file                    # 匹配任意单字符
grep "k*" file                      # 匹配 0 或多个前驱字符
grep "k\{2,4\}" file               # 匹配 2-4 个前驱字符

# 管道组合使用
ps aux | grep nginx                # 查找 nginx 进程
cat log.txt | grep -i error        # 查找错误日志

# ========== egrep 命令 ==========
# 等同于 grep -E
egrep "pattern1|pattern2" file      # 多个模式匹配
egrep "(error|warning)" log.txt    # 匹配 error 或 warning
```

**文本处理工具：**

```bash
# ========== awk 命令详解 ==========
awk '{print $1}' file               # 打印第一列
awk -F',' '{print $2}' file        # 指定分隔符为逗号
awk '{print NR, $0}' file           # 打印行号和整行
awk '{print NF}' file               # 打印每行字段数
awk 'NR==5' file                   # 打印第 5 行
awk 'NR>=5 && NR<=10' file         # 打印第 5-10 行

# 条件过滤
awk '/error/' file                 # 包含 error 的行
awk '$1 > 100' file                # 第一列大于 100 的行
awk '$2 == "active"' file          # 第二列等于 active 的行

# 字符串函数
awk '{print length($0)}' file      # 打印每行长度
awk '{print toupper($1)}' file     # 打印第一列的大写
awk '{print substr($1,1,5)}' file  # 打印第一列的前 5 个字符

# 数组操作
awk '{count[$1]++} END {for (item in count) print item, count[item]}' file

# 计算统计
awk '{sum+=$1} END {print sum}' file
awk '{sum+=$1; count++} END {print sum/count}' file
awk 'BEGIN {max=0} {if ($1>max) max=$1} END {print max}' file

# ========== sed 命令详解 ==========
sed 's/old/new/g' file              # 替换所有 old 为 new
sed 's/old/new/1' file             # 替换每行第一个 old
sed 's/old/new/2' file             # 替换每行第二个 old
sed -n '1,5p' file                 # 打印第 1-5 行
sed -n '5p' file                   # 打印第 5 行
sed '1d' file                      # 删除第 1 行
sed '1,5d' file                   # 删除第 1-5 行
sed '/pattern/d' file              # 删除匹配的行
sed '1i\text' file                # 在第 1 行前插入文本
sed '1a\text' file                # 在第 1 行后追加文本

# 原地编辑
sed -i 's/old/new/g' file         # 原地替换
sed -i.bak 's/old/new/g' file     # 备份后原地替换

# 多重编辑
sed -e 's/old1/new1/g' -e 's/old2/new2/g' file

# ========== sort 命令 ==========
sort file                           # 按默认顺序排序
sort -r file                       # 反向排序
sort -n file                       # 数字排序
sort -k2 file                      # 按第二列排序
sort -t',' -k2 file                # 指定分隔符
sort -u file                       # 去重排序

# ========== uniq 命令 ==========
uniq file                           # 去除相邻重复行
uniq -c file                       # 统计每行出现次数
uniq -d file                       # 只显示重复行
uniq -u file                       # 只显示不重复的行

# ========== cut 命令 ==========
cut -d',' -f1 file                 # 提取第一列（逗号分隔）
cut -c1-10 file                   # 提取第 1-10 个字符
cut -f1,3 file                    # 提取第 1 和 3 列

# ========== tr 命令 ==========
tr 'a-z' 'A-Z' < file              # 转换为大写
tr -d 'a' < file                  # 删除字符 a
tr -s ' ' < file                   # 压缩空格
```

---

### 2.3 硬链接和软链接

**面试重点：**

理解硬链接和软链接的区别是文件系统操作的重点。

**硬链接：**

- 多个文件指向同一个 inode
- 不能跨文件系统
- 不能对目录创建硬链接
- 删除源文件不影响硬链接

**软链接（符号链接）：**

- 类似于 Windows 快捷方式
- 可以跨文件系统
- 可以对目录创建软链接
- 删除源文件软链接失效

```bash
# 创建硬链接
ln source_file link_name

# 创建软链接
ln -s source_file link_name

# 查看链接
ls -l file

# 删除链接
rm link_name

# 修改链接
ln -sf new_source link_name
```

---

### 2.4 文件打包和压缩

```bash
# ========== tar 命令 ==========
tar -cvf archive.tar directory/    # 创建 tar 包
tar -xvf archive.tar              # 解压 tar 包
tar -xvf archive.tar -C /path/   # 解压到指定目录
tar -tvf archive.tar             # 查看 tar 包内容

# 压缩选项
tar -czvf archive.tar.gz directory/   # gzip 压缩
tar -cjvf archive.tar.bz2 directory/ # bzip2 压缩
tar -cJvf archive.tar.xz directory/ # xz 压缩

# 解压选项
tar -xzvf archive.tar.gz
tar -xjvf archive.tar.bz2
tar -xJvf archive.tar.xz

# ========== zip 命令 ==========
zip archive.zip file1 file2       # 压缩文件
zip -r archive.zip directory/    # 压缩目录
unzip archive.zip                 # 解压
unzip -l archive.zip             # 查看内容
unzip -o archive.zip             # 覆盖解压

# ========== gzip 命令 ==========
gzip file                         # 压缩文件
gzip -d file.gz                  # 解压文件
gzip -k file                     # 保留原文件
gunzip file.gz                   # 解压

# ========== 其他压缩命令 ==========
xz file                          # xz 压缩
xz -d file.xz                    # xz 解压
bzip2 file                      # bzip2 压缩
bunzip2 file.bz2                # bzip2 解压
```

---

## 第三章 进程和服务管理

### 3.1 进程查看和管理

**面试重点：**

进程管理是系统运维的核心技能，需要熟练掌握进程查看和控制命令。

```bash
# ========== 进程查看 ==========
ps                      # 显示当前终端的进程
ps aux                  # 显示所有进程详细信息
ps -ef                  # 显示进程详细信息（更详细）
ps -u username          # 显示指定用户的进程
ps -ef | grep process   # 查找特定进程
pgrep process           # 查找进程 PID
pkill process           # 终止进程
pkill -9 process        # 强制终止进程

# 进程排序
ps aux --sort=-%cpu     # 按 CPU 使用排序
ps aux --sort=-%mem    # 按内存使用排序

# 进程树
pstree                 # 显示进程树
pstree -p              # 显示进程树及 PID

# ========== top 命令详解 ==========
top                    # 实时显示进程状态
top -u username        # 只显示指定用户的进程
top -p PID             # 监控指定进程
top -d 1               # 刷新间隔为 1 秒

# top 交互命令
# h: 显示帮助
# q: 退出
# k: 终止进程
# r: 调整进程优先级
# M: 按内存排序
# P: 按 CPU 排序
# 1: 显示所有 CPU 核心
# l: 显示/隐藏负载信息
# t: 显示/隐藏任务和 CPU 信息
# m: 显示/隐藏内存信息

# top 输出说明
# PID: 进程 ID
# USER: 用户
# PR: 优先级
# NI: Nice 值
# VIRT: 虚拟内存
# RES: 物理内存
# SHR: 共享内存
# S: 状态（S=睡眠，R=运行，Z=僵尸）
# %CPU: CPU 使用率
# %MEM: 内存使用率
# TIME+: CPU 时间
# COMMAND: 命令

# ========== htop 命令 ==========
# top 的增强版，需要单独安装
htop                    # 交互式进程查看
htop -u username        # 只显示指定用户
htop -d 1               # 刷新间隔

# ========== iotop 命令 ==========
# 查看进程 I/O 使用情况（需要 root 权限）
iotop                   # 查看 I/O 使用情况
iotop -o               # 只显示正在使用 I/O 的进程
```

---

### 3.2 进程控制

```bash
# ========== 进程终止 ==========
kill PID                # 正常终止进程（发送 SIGTERM）
kill -9 PID             # 强制终止进程（发送 SIGKILL）
kill -15 PID           # 发送 SIGTERM 信号（默认）
kill -1 PID            # 重新加载配置（发送 SIGHUP）
kill -2 PID            # 相当于 Ctrl+C（发送 SIGINT）
kill -19 PID           # 暂停进程（发送 SIGSTOP）
kill -18 PID           # 恢复进程（发送 SIGCONT）

# 按进程名终止进程
pkill process_name
pkill -9 process_name
pkill -f "pattern"     # 按命令模式匹配

# ========== 进程前后台切换 ==========
command &               # 后台运行命令
Ctrl + Z                # 暂停前台进程并放入后台
bg                      # 后台继续运行暂停的进程
fg                      # 将后台进程恢复到前台
jobs                    # 列出所有后台作业

# ========== nohup 命令 ==========
nohup command &        # 后台运行命令，忽略 SIGHUP 信号
nohup command > output.log 2>&1 &   # 重定向输出

# ========== screen 命令 ==========
screen -S name          # 创建命名会话
screen -ls              # 列出所有会话
screen -r name          # 重新连接会话
screen -d name          # 分离会话
screen -d -r name       # 分离并重新连接
Ctrl + a + d           # 分离当前会话

# ========== tmux 命令 ==========
tmux new -s name        # 创建命名会话
tmux ls                # 列出所有会话
tmux attach -t name    # 连接会话
tmux detach            # 分离会话（Ctrl+b d）
tmux kill-session -t name  # 终止会话
```

---

### 3.3 服务管理

**面试重点：**

服务管理是 Linux 运维的核心工作，需要掌握 systemd 和 service 命令。

**systemd (CentOS 7+/Ubuntu 16.04+)：**

```bash
# 服务管理
systemctl start nginx       # 启动服务
systemctl stop nginx        # 停止服务
systemctl restart nginx     # 重启服务
systemctl reload nginx      # 重新加载配置
systemctl status nginx      # 查看服务状态
systemctl is-active nginx   # 检查服务是否运行
systemctl is-enabled nginx # 检查服务是否开机自启

# 开机自启管理
systemctl enable nginx      # 设置开机自启
systemctl disable nginx     # 禁用开机自启
systemctl daemon-reload     # 重新加载 systemd 配置

# 服务列表
systemctl list-units       # 列出所有单元
systemctl list-unit-files  # 列出所有单元文件
systemctl list-dependencies nginx  # 列出服务依赖

# 查看日志
journalctl -u nginx        # 查看服务日志
journalctl -u nginx -f    # 实时查看服务日志
journalctl --since today  # 查看今天日志

# 服务详细信息
systemctl show nginx      # 显示服务详细信息
systemctl cat nginx       # 查看服务单元文件
```

**service 命令（传统）：**

```bash
service nginx start
service nginx stop
service nginx restart
service nginx status
```

**systemd 单元文件示例：**

```ini
[Unit]
Description=My Application
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/myapp
ExecStart=/usr/bin/node /var/www/myapp/server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

---

## 第四章 网络管理

### 4.1 网络配置和查看

**面试重点：**

网络配置是运维必备技能，需要掌握各种网络查看和配置命令。

```bash
# ========== 网络接口查看 ==========
ifconfig                 # 查看网络接口配置
ip addr                 # 查看 IP 地址信息（新版命令）
ip link                 # 查看网络接口
ip route                # 查看路由表
ip neigh                # 查看 ARP 表

# 启用/禁用网络接口
ifconfig eth0 up
ifconfig eth0 down
ip link set eth0 up
ip link set eth0 down

# 配置 IP 地址
ifconfig eth0 192.168.1.100/24
ip addr add 192.168.1.100/24 dev eth0
ip addr del 192.168.1.100/24 dev eth0

# ========== 网络连通性测试 ==========
ping -c 4 example.com   # 测试网络连通性
ping -c 4 192.168.1.1   # 测试 IP 连通性
ping -i 0.2 example.com # 每 0.2 秒发送一次
ping -s 1000 example.com # 发送大数据包

# ========== 网络请求 ==========
curl -I url            # 发送 HEAD 请求
curl -v url            # 显示详细信息
curl -X POST url       # 发送 POST 请求
curl -d "data" url     # 发送 POST 数据
curl -o file url       # 下载文件
curl -O url            # 下载文件（保留原名）
wget url                # 下载文件
wget -O file url       # 指定输出文件名
wget -c url            # 断点续传
wget -r url            # 递归下载

# ========== 路由追踪 ==========
traceroute example.com  # 追踪路由（UDP）
traceroute -I example.com   # 追踪路由（ICMP）
tracert example.com    # Windows 追踪路由
mtr example.com        # 实时路由追踪

# ========== DNS 查询 ==========
nslookup example.com   # DNS 查询
dig example.com        # 详细 DNS 查询
dig +short example.com # 简短结果
host example.com       # 简单 DNS 查询
```

---

### 4.2 端口和网络连接

**面试重点：**

端口管理是服务运维的基础，需要掌握端口查看和防火墙配置。

```bash
# ========== 端口监听查看 ==========
netstat -tlnp          # 查看监听端口
ss -tlnp               # 查看监听端口（更高效）
lsof -i :80            # 查看端口 80 被谁占用
lsof -i                # 查看所有网络连接
fuser 80/tcp           # 查看端口 80 被谁占用

# 网络连接查看
netstat -an            # 查看所有连接
netstat -tn            # 查看 TCP 连接
netstat -un            # 查看 UDP 连接
netstat -p             # 显示进程信息

# ========== 防火墙配置 ==========

# firewalld (CentOS 7+)
firewall-cmd --list-ports                    # 列出开放的端口
firewall-cmd --add-port=80/tcp --permanent   # 开放 80 端口
firewall-cmd --remove-port=80/tcp --permanent  # 关闭 80 端口
firewall-cmd --reload                        # 重新加载配置
firewall-cmd --list-services                  # 列出开放的服务
firewall-cmd --add-service=http --permanent   # 开放 HTTP 服务
firewall-cmd --add-source=192.168.1.0/24     # 允许 IP 段
firewall-cmd --list-all                       # 列出所有配置

# iptables (传统)
iptables -L                          # 查看规则
iptables -A INPUT -p tcp --dport 80 -j ACCEPT   # 开放 80 端口
iptables -A INPUT -j DROP            # 默认拒绝所有
iptables -A INPUT -p icmp -j ACCEPT  # 允许 ping
iptables -D INPUT 1                  # 删除第一条规则
iptables -I INPUT 1 -j ACCEPT        # 插入规则到第一条
iptables -F                         # 清空所有规则
iptables-save > /etc/iptables.rules # 保存规则
iptables-restore < /etc/iptables.rules  # 恢复规则

# ufw (Ubuntu)
ufw status               # 查看状态
ufw allow 80/tcp        # 开放 80 端口
ufw deny 80/tcp         # 禁止 80 端口
ufw enable              # 启用防火墙
ufw disable             # 禁用防火墙
ufw delete allow 80/tcp # 删除规则
ufw allow from 192.168.1.0/24  # 允许 IP 段
```

---

## 第五章 SSH 远程连接

### 5.1 SSH 基础命令

**面试重点：**

SSH 是 Linux 远程管理的核心工具，需要熟练掌握连接和文件传输命令。

```bash
# ========== SSH 连接 ==========
ssh user@hostname           # 连接到远程主机
ssh -p 22 user@hostname     # 指定端口连接
ssh -i ~/.ssh/key user@hostname  # 指定私钥文件
ssh -v user@hostname        # 详细模式连接
ssh -o StrictHostKeyChecking=no user@hostname  # 跳过主机密钥检查
ssh -t user@hostname "command"  # 执行远程命令

# ========== SSH 密钥管理 ==========
ssh-keygen -t rsa          # 生成 RSA 密钥对
ssh-keygen -t ed25519      # 生成 Ed25519 密钥对（推荐）
ssh-keygen -t rsa -b 4096  # 生成 4096 位 RSA 密钥
ssh-keygen -f ~/.ssh/key   # 指定密钥文件路径
ssh-keygen -p              # 修改密钥密码
ssh-keygen -R hostname     # 移除主机密钥

# 复制公钥到远程主机
ssh-copy-id user@hostname
# 或者手动复制
cat ~/.ssh/id_rsa.pub | ssh user@hostname "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"

# ========== SSH 配置 ~/.ssh/config ==========
Host alias
    HostName 192.168.1.100
    User username
    Port 22
    IdentityFile ~/.ssh/key

Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3

# ========== 文件传输 ==========
scp file.txt user@host:/path/       # 上传文件
scp user@host:/path/file.txt ./      # 下载文件
scp -r dir/ user@host:/path/         # 上传目录
scp -P 2222 file user@host:/path/    # 指定端口
scp -C file user@host:/path/         # 启用压缩
scp -p file user@host:/path/         # 保留文件属性

sftp user@hostname                    # 交互式文件传输
# sftp 命令：
# ls/cd/pwd - 目录操作
# get file - 下载文件
# put file - 上传文件
# mget/mput - 批量传输
# bye/exit - 退出
```

---

### 5.2 SSH 安全加固

**面试重点：**

SSH 安全是服务器安全的重要环节，需要了解常见的安全加固措施。

**SSH 配置文件：** `/etc/ssh/sshd_config`

```bash
# 端口和地址绑定
Port 2222                   # 修改默认端口
ListenAddress 0.0.0.0      # 监听地址

# 禁用 root 登录
PermitRootLogin no          # 禁用 root 登录
PermitRootLogin prohibit-password  # 只允许密钥登录

# 禁用密码认证
PasswordAuthentication no   # 禁用密码认证
PubkeyAuthentication yes    # 启用公钥认证

# 限制失败尝试次数
MaxAuthTries 3              # 最大尝试次数

# 空闲超时设置
ClientAliveInterval 300     # 空闲检测间隔（秒）
ClientAliveCountMax 2      # 空闲检测次数

# 允许的用户/组
AllowUsers user1 user2
AllowGroup groupname

# 禁用空密码
PermitEmptyPasswords no

# 启用日志记录
LogLevel VERBOSE

# 重启 SSH 服务
systemctl restart sshd
```

---

## 第六章 软件包管理

### 6.1 包管理器概述

**面试重点：**

不同 Linux 发行版使用不同的包管理器，需要掌握主流发行版的包管理命令。

**Ubuntu/Debian (apt)：**

```bash
# 更新软件包列表
apt update                  # 更新软件包列表
apt upgrade                # 升级所有软件包
apt full-upgrade           # 完整升级（处理依赖变化）

# 安装和卸载
apt install nginx          # 安装软件包
apt install nginx=1.18.0   # 安装指定版本
apt remove nginx           # 卸载软件包（保留配置）
apt purge nginx            # 彻底卸载
apt autoremove             # 自动清理不需要的包

# 搜索和查看
apt search nginx           # 搜索软件包
apt show nginx             # 查看软件包信息
apt list --installed       # 列出已安装的软件包

# 清理
apt clean                  # 清理本地仓库
apt autoclean              # 清理旧版本的软件包
apt autoremove             # 删除不再需要的依赖
```

**CentOS/RHEL (yum/dnf)：**

```bash
# 基础操作
yum update                 # 更新所有软件包
yum install nginx         # 安装软件包
yum remove nginx          # 卸载软件包
yum search nginx          # 搜索软件包
yum list installed        # 列出已安装的软件包

# DNF (CentOS 8+) - yum 的替代品
dnf update
dnf install nginx
dnf search nginx

# 查看包信息
yum info nginx            # 查看包信息
yum provides nginx        # 查找包含指定文件的包
yum groupinstall "Development Tools"  # 安装开发工具组

# 清理
yum clean all             # 清理缓存
yum makecache             # 生成缓存
```

**Arch Linux (pacman)：**

```bash
pacman -Syu               # 同步并更新系统
pacman -S nginx           # 安装软件包
pacman -R nginx           # 卸载软件包
pacman -Ss nginx          # 搜索软件包
pacman -Si nginx          # 查看包信息
pacman -Q                 # 列出已安装的包
pacman -Qs nginx          # 搜索已安装的包
```

---

### 6.2 Node.js 环境管理

**面试重点：**

前端开发者需要掌握 Node.js 环境管理，包括 nvm、npm、pnpm 等工具。

**nvm (Node Version Manager)：**

```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# 使用 nvm
nvm list-remote           # 列出所有可用版本
nvm install 18            # 安装 Node.js 18
nvm install 18.12.1      # 安装指定版本
nvm use 18                # 切换到 Node.js 18
nvm alias default 18     # 设置默认版本
nvm list                 # 列出已安装的版本
nvm current              # 显示当前版本
nvm uninstall 16          # 卸载指定版本

# 安装 LTS 版本
nvm install --lts
nvm install --lts=hydrogen
```

**npm (Node Package Manager)：**

```bash
# npm 基础命令
npm install -g npm        # 更新 npm
npm install -g node       # 安装最新版本 node
npm init -y               # 初始化项目
npm install               # 安装项目依赖
npm install package      # 安装本地包
npm install -g package   # 安装全局包
npm install package@1.0.0  # 安装指定版本

# package.json 管理
npm install --save package   # 安装并添加到 dependencies
npm install --save-dev package  # 安装并添加到 devDependencies
npm install --save-optional package  # 添加到 optionalDependencies

# 包管理
npm update               # 更新所有包
npm update package       # 更新指定包
npm outdated             # 检查过期包
npm uninstall package    # 卸载包

# 运行脚本
npm run dev              # 运行 package.json 中的 dev 脚本
npm run build            # 运行 build 脚本
npm start                # 运行 start 脚本
npm test                 # 运行 test 脚本

# 查看和搜索
npm list                 # 查看已安装的包
npm list -g              # 查看全局安装的包
npm search package       # 搜索包
npm info package         # 查看包信息

# npm 配置
npm config list          # 查看配置
npm config set registry https://registry.npmmirror.com  # 设置镜像
npm config get registry  # 查看当前镜像
```

**pnpm (Performant npm)：**

```bash
# 安装 pnpm
npm install -g pnpm

# 基础命令
pnpm install             # 安装依赖
pnpm add package         # 添加依赖
pnpm add -D package     # 添加开发依赖
pnpm remove package     # 移除依赖
pnpm update              # 更新依赖
```

---

## 第七章 常用服务部署

### 7.1 Nginx 部署和配置

**面试重点：**

Nginx 是最常用的 Web 服务器，需要熟练掌握其安装、配置和使用。

**安装 Nginx：**

```bash
# Ubuntu
apt install nginx

# CentOS
yum install nginx
```

**Nginx 主配置文件：** `/etc/nginx/nginx.conf`

```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 20M;

    # gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1k;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # 引入其他配置文件
    include /etc/nginx/conf.d/*.conf;
}
```

**站点配置文件：** `/etc/nginx/conf.d/example.conf`

```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    root /var/www/html;
    index index.html index.htm index.php;

    # 日志配置
    access_log /var/log/nginx/example.com.access.log;
    error_log /var/log/nginx/example.com.error.log;

    # 静态文件缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # 主页面配置
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 代理配置
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }

    # WebSocket 支持
    location /ws {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400;
    }

    # PHP-FPM 配置
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # 禁止访问隐藏文件
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    # 禁止访问特定目录
    location /uploads {
        internal;
    }
}
```

**HTTPS 配置：**

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate /etc/ssl/certs/example.com.crt;
    ssl_certificate_key /etc/ssl/private/example.com.key;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;

    ssl_stapling on;
    ssl_stapling_verify on;

    # 其他配置...
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$server_name$request_uri;
}
```

**Nginx 命令：**

```bash
nginx -t                 # 测试配置文件
nginx                    # 启动 Nginx
nginx -s reload          # 重新加载配置
nginx -s stop           # 停止 Nginx
nginx -s reopen         # 重新打开日志文件
nginx -s quit           # 优雅停止
nginx -v                # 查看版本
nginx -V                # 查看详细版本信息
```

---

### 7.2 PM2 进程管理

**面试重点：**

PM2 是 Node.js 应用的常用进程管理器，用于生产环境部署。

**安装 PM2：**

```bash
npm install -g pm2
```

**基本命令：**

```bash
# 启动应用
pm2 start app.js                 # 启动应用
pm2 start app.js --name my-app   # 指定应用名称
pm2 start app.js -i 4           # 启动 4 个实例（负载均衡）
pm2 start app.js --max-memory-restart 500M  # 内存超过 500M 自动重启

# 管理应用
pm2 list                         # 列出所有应用
pm2 status                       # 查看状态
pm2 logs                         # 查看日志
pm2 logs --lines 100             # 查看最近 100 行日志
pm2 logs my-app --err            # 只查看错误日志
pm2 restart my-app               # 重启应用
pm2 stop my-app                  # 停止应用
pm2 delete my-app               # 删除应用

# 监控
pm2 monit                        # 实时监控面板
pm2 plus                         # 在线监控面板（需要注册）

# 开机自启
pm2 startup                      # 生成启动命令
pm2 save                         # 保存当前进程列表
pm2 resurrect                   # 恢复保存的进程列表
pm2 generate                    # 生成 systemd 配置
```

**ecosystem.config.js 配置文件：**

```javascript
module.exports = {
  apps: [{
    name: 'my-app',
    script: './app.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 8080
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '500M',
    autorestart: true,
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
    max_restarts: 10,
    min_uptime: '10s',
    listen_timeout: 8000,
    kill_timeout: 5000,
    instances: 4,
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    force: true
  }, {
    name: 'worker',
    script: './worker.js',
    watch: true,
    ignore_watch: ['node_modules', 'logs'],
    env: {
      NODE_ENV: 'development'
    }
  }]
};
```

**使用配置文件启动：**

```bash
pm2 start ecosystem.config.js
pm2 start ecosystem.config.js --env production
pm2 delete all
```

---

## 第八章 日志管理

### 8.1 系统日志详解

**面试重点：**

日志是排查问题的重要依据，需要了解常见日志的位置和作用。

| 日志类型 | 位置 | 说明 |
|----------|------|------|
| 系统日志 | /var/log/messages | 系统和应用程序通用日志 |
| 安全日志 | /var/log/secure | 用户登录和认证日志 |
| 计划任务日志 | /var/log/cron | 定时任务执行日志 |
| 邮件日志 | /var/log/maillog | 邮件收发日志 |
| 启动日志 | /var/log/dmesg | 系统启动时的硬件检测日志 |
| Nginx 访问日志 | /var/log/nginx/access.log | HTTP 请求访问日志 |
| Nginx 错误日志 | /var/log/nginx/error.log | HTTP 请求错误日志 |
| 应用日志 | /var/log/myapp/ | 应用程序自定义日志 |
| 系统日志 | /var/log/syslog | 完整系统日志（Debian/Ubuntu） |
| Docker 日志 | /var/lib/docker/containers/ | Docker 容器日志 |

**常用日志命令：**

```bash
# 实时查看日志
tail -f /var/log/nginx/access.log

# 查看最近 100 行
tail -n 100 /var/log/nginx/access.log

# 搜索日志内容
grep "error" /var/log/nginx/error.log
grep -i "error" /var/log/nginx/access.log

# 统计日志
wc -l /var/log/nginx/access.log     # 统计总请求数
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -rn  # 统计 IP

# 日志轮转
logrotate -f /etc/logrotate.conf   # 强制执行日志轮转

# 磁盘使用分析
du -sh /var/log/*                  # 日志目录大小分析
du -sh /var/log/nginx/
```

---

### 8.2 日志分析工具

```bash
# ========== awk 分析日志 ==========
# 统计 IP 访问次数
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -10

# 统计最常访问的页面
awk '{print $7}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -10

# 统计 HTTP 状态码
awk '{print $9}' /var/log/nginx/access.log | sort | uniq -c | sort -rn

# 统计访问量最大的时间段
awk '{print $4}' /var/log/nginx/access.log | cut -d: -f1 | sort | uniq -c | sort -rn

# 统计请求大小
awk '{print $10}' /var/log/nginx/access.log | awk '{sum+=$1} END {print sum/1024/1024 " MB"}'

# ========== GoAccess 日志分析工具 ==========
# 安装
apt install goaccess

# 使用
goaccess /var/log/nginx/access.log -o report.html --log-format=COMBINED

# 实时监控
goaccess /var/log/nginx/access.log -o report.html --real-time-html --log-format=COMBINED
```

---

## 第九章 Shell 脚本编程

### 9.1 Shell 脚本基础

**面试重点：**

Shell 脚本是自动化运维的基础，需要掌握变量、条件判断、循环等基本语法。

**变量定义和使用：**

```bash
#!/bin/bash

# 变量定义
name="Tom"
age=25

# 变量使用
echo "Name: $name"
echo "Age: $age"

# 只读变量
readonly PI=3.14
# PI=3.15  # 错误：不能修改只读变量

# 删除变量
unset name

# 特殊变量
# $0 - 脚本名
# $1-$9 - 第 1-9 个参数
# $# - 参数个数
# $@ - 所有参数
# $? - 上一个命令的退出状态
# $$ - 当前进程 ID

# 字符串操作
str="Hello World"
echo ${#str}              # 字符串长度
echo ${str:0:5}           # 截取字符串（从第 0 个字符开始，截取 5 个）
echo ${str: -5}           # 截取最后 5 个字符
echo ${str/Hello/Hi}     # 替换（只替换第一个）
echo ${str//o/O}         # 替换（替换所有）
echo ${str#*o}           # 最短匹配删除（从开头）
echo ${str##*o}          # 最长匹配删除（从开头）
echo ${str%o*}           # 最短匹配删除（从结尾）
echo ${str%%o*}          # 最长匹配删除（从结尾）
```

**数组操作：**

```bash
#!/bin/bash

# 数组定义
arr=(1 2 3 4 5)
arr2=(one two three)

# 数组操作
echo ${arr[0]}           # 访问元素
echo ${arr[@]}           # 访问所有元素
echo ${#arr[@]}          # 数组长度
arr[0]=10                # 修改元素
arr+=(6 7 8)            # 追加元素

# 数组切片
echo ${arr[@]:1:3}       # 从索引 1 开始，截取 3 个元素
```

**运算符：**

```bash
#!/bin/bash

# 算术运算符
a=10
b=20
echo $((a + b))          # 加法
echo $((a - b))          # 减法
echo $((a * b))          # 乘法
echo $((a / b))          # 除法
echo $((a % b))          # 取模

# 关系运算符
# -eq 等于
# -ne 不等于
# -gt 大于
# -lt 小于
# -ge 大于等于
# -le 小于等于

if [ $a -eq $b ]; then
    echo "相等"
fi

# 布尔运算符
# ! 非
# -o 或
# -a 与

# 字符串运算符
# = 等于
# != 不等于
# -z 长度为 0
# -n 长度不为 0
# str 为空

if [ -z "$str" ]; then
    echo "字符串为空"
fi

# 文件测试运算符
# -d 文件是目录
# -f 文件是普通文件
# -e 文件存在
# -r 文件可读
# -w 文件可写
# -x 文件可执行
# -s 文件大小不为 0

if [ -f /path/to/file ]; then
    echo "文件存在"
fi
```

**条件判断：**

```bash
#!/bin/bash

# if-elif-else
if [ $age -ge 18 ]; then
    echo "成年人"
elif [ $age -ge 6 ]; then
    echo "未成年人"
else
    echo "儿童"
fi

# 文件类型判断
if [ -f /path/to/file ]; then
    echo "普通文件"
fi

if [ -d /path/to/dir ]; then
    echo "目录"
fi

if [ -e /path/to/file ]; then
    echo "存在"
fi

# 多条件判断
if [ $a -gt 10 ] && [ $a -lt 20 ]; then
    echo "在 10-20 之间"
fi

# case 语句
case $1 in
    start)
        echo "启动服务"
        ;;
    stop)
        echo "停止服务"
        ;;
    restart)
        echo "重启服务"
        ;;
    *)
        echo "未知命令"
        ;;
esac
```

**循环：**

```bash
#!/bin/bash

# for 循环 - 列表
for i in {1..5}; do
    echo "Number: $i"
done

# for 循环 - 数组
for item in ${array[@]}; do
    echo "Item: $item"
done

# for 循环 - 命令输出
for file in $(ls); do
    echo "File: $file"
done

# C 风格 for 循环
for ((i=0; i<10; i++)); do
    echo "i = $i"
done

# while 循环
count=0
while [ $count -lt 5 ]; do
    echo $count
    count=$((count + 1))
done

# until 循环
count=0
until [ $count -ge 5 ]; do
    echo $count
    count=$((count + 1))
done

# 循环控制
for i in {1..10}; do
    if [ $i -eq 5 ]; then
        continue    # 跳过本次循环
    fi
    if [ $i -eq 8 ]; then
        break       # 退出循环
    fi
    echo $i
done

# 无限循环
while true; do
    echo "无限循环"
    sleep 1
done
```

---

### 9.2 函数

```bash
#!/bin/bash

# 函数定义
function hello {
    echo "Hello, World!"
}

# 带参数的函数
function greet {
    local name=$1    # 使用 local 定义局部变量
    echo "Hello, $name!"
}

# 返回值
function get_sum {
    local a=$1
    local b=$2
    return $((a + b))
}

# 调用函数
hello
greet "Tom"
get_sum 10 20
echo $?    # 获取返回值

# 函数中使用数组
function print_array {
    local arr=("$@")
    for item in "${arr[@]}"; do
        echo $item
    done
}

my_array=(1 2 3 4 5)
print_array "${my_array[@]}"

# 递归函数
function factorial {
    local n=$1
    if [ $n -le 1 ]; then
        echo 1
    else
        local prev=$(factorial $((n-1)))
        echo $((n * prev))
    fi
}

echo $(factorial 5)
```

---

### 9.3 实用脚本示例

**备份脚本：**

```bash
#!/bin/bash
# 自动备份脚本

BACKUP_DIR="/backup"
SOURCE_DIR="/var/www/html"
DATE=$(date +%Y%m%d_%H%M%S)
LOG_FILE="/var/log/backup.log"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 记录日志
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

# 执行备份
log "开始备份 $SOURCE_DIR"
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz $SOURCE_DIR 2>&1 | tee -a $LOG_FILE

if [ $? -eq 0 ]; then
    log "备份成功: backup_$DATE.tar.gz"
else
    log "备份失败"
    exit 1
fi

# 删除 7 天前的备份
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete

# 保留最近 30 天的备份
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +30 -delete

log "备份完成"
```

**系统监控脚本：**

```bash
#!/bin/bash
# 系统监控告警脚本

# 获取 CPU 使用率
CPU=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)

# 获取内存使用率
MEMORY=$(free | grep Mem | awk '{printf("%.2f", $3/$2 * 100)}')

# 获取磁盘使用率
DISK=$(df -h / | tail -1 | awk '{print $5}' | cut -d'%' -f1)

# 获取负载
LOAD=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | sed 's/,//')

echo "CPU: $CPU%"
echo "Memory: $MEMORY%"
echo "Disk: $DISK%"
echo "Load: $LOAD"

# 告警阈值
CPU_THRESHOLD=80
MEMORY_THRESHOLD=90
DISK_THRESHOLD=90
LOAD_THRESHOLD=2

# 发送告警
ALERT=false
ALERT_MSG=""

if (( $(echo "$CPU > $CPU_THRESHOLD" | bc -l) )); then
    ALERT=true
    ALERT_MSG="${ALERT_MSG}High CPU: ${CPU}%\n"
fi

if [ $(echo "$MEMORY > $MEMORY_THRESHOLD" | bc -l) -eq 1 ]; then
    ALERT=true
    ALERT_MSG="${ALERT_MSG}High Memory: ${MEMORY}%\n"
fi

if [ $DISK -gt $DISK_THRESHOLD ]; then
    ALERT=true
    ALERT_MSG="${ALERT_MSG}High Disk: ${DISK}%\n"
fi

if [ $(echo "$LOAD > $LOAD_THRESHOLD" | bc -l) -eq 1 ]; then
    ALERT=true
    ALERT_MSG="${ALERT_MSG}High Load: ${LOAD}\n"
fi

if [ "$ALERT" = true ]; then
    echo -e "$ALERT_MSG" | mail -s "System Alert" admin@example.com
    # 或者发送企业微信/钉钉告警
fi
```

**日志清理脚本：**

```bash
#!/bin/bash
# 日志清理脚本

LOG_DIR="/var/log/myapp"
MAX_SIZE=100M
MAX_DAYS=30

# 清理大日志文件
for logfile in $(find $LOG_DIR -name "*.log" -type f); do
    size=$(stat -f%z "$logfile" 2>/dev/null || stat -c%s "$logfile")
    max_size_bytes=$((MAX_SIZE * 1024 * 1024))

    if [ $size -gt $max_size_bytes ]; then
        echo "Truncating $logfile (size: $size)"
        > "$logfile"
    fi
done

# 清理过期日志
find $LOG_DIR -name "*.log" -type f -mtime +$MAX_DAYS -delete

# 压缩旧日志
find $LOG_DIR -name "*.log" -type f -mtime +7 ! -name "*.gz" -exec gzip {} \;

echo "日志清理完成"
```

**批量操作脚本：**

```bash
#!/bin/bash
# 批量部署脚本

SERVERS=(
    "192.168.1.10"
    "192.168.1.11"
    "192.168.1.12"
)

USER="deploy"
DEPLOY_DIR="/var/www/myapp"

for server in "${SERVERS[@]}"; do
    echo "Deploying to $server..."

    # 同步代码
    rsync -avz --delete -e ssh \
        --exclude='node_modules' \
        --exclude='.git' \
        ./ $USER@$server:$DEPLOY_DIR/

    # 重启服务
    ssh $USER@$server "cd $DEPLOY_DIR && pm2 restart all"

    echo "Deployed to $server successfully"
done

echo "Deployment completed!"
```

---

## 第十章 问题排查

### 10.1 常见问题排查方法

**面试重点：**

问题排查是运维的核心能力，需要掌握系统资源和网络故障的排查方法。

**端口占用排查：**

```bash
# 查看端口被谁占用
lsof -i :80
netstat -tlnp | grep 80

# 查看进程详细信息
ps aux | grep nginx
```

**磁盘空间问题：**

```bash
# 查看磁盘使用情况
df -h

# 查看目录大小
du -sh /*
du -sh /var/*
du -sh /var/log/*

# 查找大文件
find / -type f -size +100M
```

**进程异常排查：**

```bash
# 查看系统日志
journalctl -xe
tail -f /var/log/messages

# 查看进程状态
ps auxf
pstree -p

# 查看进程打开的文件
lsof -p PID
lsof -c nginx
```

**网络问题排查：**

```bash
# 测试网络连通性
ping -c 4 8.8.8.8

# DNS 解析测试
nslookup example.com
dig example.com

# 路由追踪
traceroute example.com
mtr example.com

# 网络延迟测试
curl -w "@curl-format.txt" -o /dev/null -s http://example.com
```

---

### 10.2 性能分析工具

```bash
# CPU 性能分析
top                           # 查看 CPU 使用
ps -eo pid,ppid,cmd,%mem,%cpu --sort=-%cpu | head

# 内存性能分析
free -h                       # 查看内存使用
ps -eo pid,ppid,cmd,%mem,%cpu --sort=-%mem | head

# I/O 性能分析
iostat -x 1 5                # I/O 统计
iotop                        # 实时 I/O 监控

# 网络性能分析
iftop                        # 网络流量监控
nethogs                     # 按进程查看网络使用
tcpdump                     # 网络抓包
```

---

## 第十一章 CI/CD

### 11.1 Git 基础命令

**面试重点：**

Git 是现代开发的核心工具，需要熟练掌握常用命令和工作流程。

```bash
# ========== 仓库操作 ==========
git init                     # 初始化仓库
git clone url                # 克隆仓库
git add .                    # 添加所有文件到暂存区
git commit -m "message"      # 提交更改
git push origin main         # 推送到远程仓库
git pull                     # 拉取并合并

# ========== 分支操作 ==========
git branch                   # 查看分支
git branch -a                # 查看所有分支
git checkout -b feature      # 创建并切换到新分支
git checkout main            # 切换分支
git merge feature            # 合并分支
git branch -d feature        # 删除分支

# ========== 版本回退 ==========
git log --oneline            # 简洁日志
git reset --hard HEAD~1      # 回退到上一个版本
git stash                    # 暂存更改
git stash pop                # 恢复暂存
```

---

### 11.1.1 Git 高级操作

```bash
# ========== 版本比较 ==========
git diff                     # 工作区 vs 暂存区
git diff --staged            # 暂存区 vs 最新提交
git diff HEAD~1 HEAD         # 比较两个提交

# ========== 撤销操作 ==========
git checkout -- file         # 撤销工作区修改
git reset HEAD file          # 撤销暂存区修改
git revert commit            # 撤销指定提交（创建新提交）
git reset --soft HEAD~1      # 撤销提交，保留修改在暂存区
git reset --hard HEAD~1      # 撤销提交，丢弃所有修改

# ========== 远程仓库操作 ==========
git remote -v                # 查看远程仓库
git remote add origin url    # 添加远程仓库
git fetch origin             # 获取远程更新
git pull origin main         # 拉取并合并
git push -u origin main      # 推送到远程（-u 设置上游）

# ========== 标签操作 ==========
git tag v1.0.0              # 创建标签
git tag                      # 查看标签
git push origin v1.0.0      # 推送标签
git tag -d v1.0.0           # 删除本地标签

# ========== 子模块操作 ==========
git submodule add url path   # 添加子模块
git submodule init           # 初始化子模块
git submodule update         # 更新子模块
git submodule update --init  # 初始化并更新
```

---

### 11.1.2 Git 工作流程

**面试重点：**

需要了解 Git Flow、GitHub Flow 等常见工作流程。

**Git Flow 工作流程：**

```bash
# 1. 创建开发分支
git checkout -b develop main

# 2. 开发功能
git checkout -b feature/xxx develop
# ... 开发代码 ...
git checkout develop
git merge feature/xxx

# 3. 准备发布
git checkout -b release/xxx develop
# ... 修复 bug ...
git checkout develop
git merge release/xxx

# 4. 紧急修复
git checkout -b hotfix/xxx main
# ... 修复 bug ...
git checkout main
git merge hotfix/xxx
git checkout develop
git merge hotfix/xxx

# 5. 删除不需要的分支
git branch -d feature/xxx
git branch -d release/xxx
git branch -d hotfix/xxx
```

**GitHub Flow 工作流程：**

```bash
# 1. 从 main 创建特性分支
git checkout -b feature/xxx

# 2. 开发并提交
git commit -m "Add feature"

# 3. 推送分支
git push origin feature/xxx

# 4. 创建 Pull Request
# 在 GitHub 上创建 PR

# 5. 代码审查和合并
# 合并后自动部署

# 6. 删除特性分支
git checkout main
git pull
git branch -d feature/xxx
```

**解决冲突：**

```bash
# 1. 查看冲突文件
git status

# 2. 编辑冲突文件
# 手动解决冲突

# 3. 标记冲突已解决
git add conflict_file

# 4. 提交更改
git commit -m "resolve conflict"
```

---

### 11.1.3 Git 常见面试题

**Q1: git fetch 和 git pull 的区别？**

- `git fetch`：从远程仓库下载最新版本到本地，但不合并到当前分支
- `git pull`：从远程仓库下载最新版本并合并到当前分支

**Q2: 如何撤销 Git 提交的修改？**

- 撤销工作区修改：`git checkout -- file`
- 撤销暂存区修改：`git reset HEAD file`
- 撤销提交（保留修改）：`git reset --soft HEAD~1`
- 撤销提交（丢弃修改）：`git reset --hard HEAD~1`

**Q3: 如何解决 Git 冲突？**

1. 使用 `git status` 查看冲突文件
2. 编辑冲突文件，手动解决冲突
3. 使用 `git add` 标记为已解决
4. 使用 `git commit` 提交

**Q4: git rebase 和 git merge 的区别？**

- `git merge`：合并分支，保留分支结构，历史记录为分叉状
- `git rebase`：将分支的基点移动到另一个分支，历史记录为线性，更整洁

**Q5: 如何恢复误删的 commit？**

```bash
git reflog                        # 查看操作历史
git reset --hard HEAD@{n}        # 恢复到指定状态
```

---

### 11.2 简单 CI/CD 流程

**手动部署流程示例：**

```bash
# 1. 构建项目
npm run build

# 2. 连接到服务器
ssh user@server

# 3. 进入部署目录
cd /var/www/myapp

# 4. 拉取最新代码
git pull origin main

# 5. 安装依赖
npm install

# 6. 重新构建
npm run build

# 7. 重启应用
pm2 restart myapp

# 8. 检查状态
pm2 status
```

---

## 第十二章 Docker 容器

### 12.1 Docker 基础

**面试重点：**

Docker 是现代应用部署的核心技术，需要掌握 Docker 基础操作和镜像构建。

**Docker 概述：**

Docker 是一个开源的容器化平台，用于开发、部署和运行应用程序。容器允许开发者将应用程序及其依赖打包到一个轻量级的容器中，确保应用在任何环境中都能一致运行。

**Docker 与虚拟机的区别：**

| 特性 | Docker 容器 | 虚拟机 |
|------|-------------|--------|
| 启动速度 | 秒级 | 分钟级 |
| 资源占用 | 轻量级 | 较重 |
| 操作系统 | 共享宿主机内核 | 独立操作系统 |
| 隔离性 | 进程级隔离 | 完整隔离 |

---

### 12.2 Docker 基本命令

```bash
# ========== 镜像操作 ==========
docker images                 # 列出本地镜像
docker pull nginx:latest      # 拉取镜像
docker rmi image_id           # 删除本地镜像
docker image prune            # 清理未使用的镜像
docker build -t my-app .      # 构建镜像
docker tag image_id my-app:v1 # 为镜像打标签

# ========== 容器操作 ==========
docker ps                     # 查看运行中的容器
docker ps -a                 # 查看所有容器
docker ps -l                 # 查看最后创建的容器
docker run -d -p 80:80 nginx # 运行容器（后台）
docker run -it nginx /bin/bash  # 交互式运行
docker run --name my-nginx -d nginx  # 指定容器名称

# 常用运行选项：
# -d: 后台运行
# -p: 端口映射（宿主机端口:容器端口）
# -v: 卷挂载（宿主机路径:容器路径）
# --name: 容器名称
# --env: 环境变量
# --link: 链接到其他容器
# --network: 加入网络
# --restart: 重启策略
# -e: 设置环境变量
# --rm: 退出时自动删除

# 容器管理
docker start container_id     # 启动容器
docker stop container_id     # 停止容器
docker restart container_id  # 重启容器
docker rm container_id       # 删除容器
docker rm -f container_id    # 强制删除容器
docker logs -f container_id  # 查看容器日志
docker logs --tail 100 container_id  # 查看最近 100 行日志
docker exec -it container_id /bin/bash  # 进入容器

# 容器信息
docker inspect container_id   # 查看容器详细信息
docker port container_id      # 查看端口映射
docker top container_id       # 查看容器进程
docker stats container_id     # 查看容器资源使用
```

---

### 12.3 Dockerfile 最佳实践

**Dockerfile 基础指令：**

```dockerfile
# 选择基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制依赖文件（利用 Docker 缓存）
COPY package*.json ./

# 安装依赖（生产环境使用 npm ci）
RUN npm ci --only=production

# 复制应用代码
COPY . .

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "server.js"]
```

**Dockerfile 最佳实践：**

```dockerfile
# 1. 使用特定版本的基础镜像，不使用 latest
FROM node:18.17.0-alpine3.18

# 2. 使用多阶段构建减小镜像体积
# 构建阶段
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 运行阶段
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/server.js"]

# 3. 使用 .dockerignore 排除不需要的文件
# .dockerignore 示例：
# node_modules
# npm-debug.log
# .git
# .env
# dist
# coverage

# 4. 合理安排层顺序，利用缓存
# 先复制依赖文件，安装依赖，再复制代码

# 5. 使用非 root 用户运行容器
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# 6. 清理不必要的文件
RUN apk add --no-cache python3 make g++ \
    && npm ci \
    && apk del python3 make g++

# 7. 使用 RUN 指令合并命令减少层数
RUN apk add --no-cache \
    curl \
    && rm -rf /var/cache/apk/*
```

---

### 12.4 Docker Compose

**docker-compose.yml 示例：**

```yaml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=db
      - DB_PORT=5432
    volumes:
      - ./logs:/app/logs
      - /app/node_modules
    depends_on:
      - db
      - redis
    networks:
      - app-network
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=app
      - POSTGRES_PASSWORD=secret
      - POSTGRES_DB=myapp
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - app-network
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass secret
    volumes:
      - redis-data:/data
    networks:
      - app-network
    restart: unless-stopped

  nginx:
    image: nginx:latest
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - web
    networks:
      - app-network
    restart: unless-stopped

volumes:
  postgres-data:
  redis-data:

networks:
  app-network:
    driver: bridge
```

**Docker Compose 命令：**

```bash
# 启动所有服务
docker-compose up -d

# 启动并重新构建
docker-compose up -d --build

# 停止所有服务
docker-compose down

# 停止并删除数据卷
docker-compose down -v

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
docker-compose logs -f web

# 重启单个服务
docker-compose restart web

# 进入服务容器
docker-compose exec web bash

# 构建镜像
docker-compose build

# 查看服务资源使用
docker-compose top
```

---

### 12.5 Docker 网络和存储

**Docker 网络模式：**

```bash
# 查看网络
docker network ls
docker network inspect bridge

# 创建网络
docker network create my-network

# 容器加入网络
docker run -d --network my-network --name web nginx

# 容器间通信
# 在同一网络下的容器可以通过容器名进行通信
# web 容器可以访问 db 容器：ping db
```

**Docker 存储卷：**

```bash
# 创建卷
docker volume create my-volume

# 查看卷
docker volume ls
docker volume inspect my-volume

# 使用卷
docker run -d -v my-volume:/data nginx
docker run -d -v /host/path:/container/path nginx

# 匿名卷和命名卷
# -v /data 匿名卷
# -v my-volume:/data 命名卷
# -v /host/path:/container/path 绑定挂载
```

---

## 第十三章 监控工具

### 13.1 常用监控工具

**面试重点：**

监控系统是保障服务稳定运行的重要工具，需要了解常用监控工具。

```bash
# ========== 系统监控 ==========
# top - 实时系统监控
top
top -u username        # 查看指定用户的进程

# htop - top 的增强版
htop

# iotop - I/O 监控
iotop

# iftop - 网络流量监控
iftop

# nethogs - 按进程的网络流量
nethogs

# glances - 全方位监控工具
pip install glances
glances

# ========== 应用监控 ==========
# Node.js 应用监控
pm2 monit              # PM2 内置监控
pm2 plus               # PM2 在线监控

# Web 服务监控
curl -I http://localhost/health  # 健康检查

# 数据库监控
# MySQL: SHOW PROCESSLIST
# PostgreSQL: SELECT * FROM pg_stat_activity
```

---

### 13.2 Prometheus + Grafana 监控

**Prometheus 配置示例：**

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['localhost:9100']

  - job_name: 'my-app'
    static_configs:
      - targets: ['localhost:3000']
```

**Grafana 数据源配置：**

1. 登录 Grafana
2. Configuration -> Data Sources -> Add data source
3. 选择 Prometheus
4. 输入 URL: http://localhost:9090
5. 点击 Save & Test

**常用 Grafana 仪表板：**

- Node Exporter Full：系统监控
- Prometheus Stats：Prometheus 自身监控
- Nginx Ingress Controller：Nginx 监控

---

## 第十四章 安全加固

### 14.1 系统安全加固

```bash
# ========== 用户安全 ==========
# 禁用不必要的用户
userdel -r lp
userdel -r news
userdel -r uucp

# 设置密码策略
# /etc/login.defs
PASS_MAX_DAYS 90    # 密码有效期
PASS_MIN_DAYS 1     # 密码最小修改间隔
PASS_MIN_LEN 12     # 密码最小长度
PASS_WARN_AGE 7     # 密码过期警告

# ========== SSH 安全 ==========
# 修改 SSH 配置文件 /etc/ssh/sshd_config
Port 2222                   # 更换端口
PermitRootLogin no          # 禁止 root 登录
PasswordAuthentication no   # 禁用密码认证
PubkeyAuthentication yes    # 启用公钥认证
MaxAuthTries 3              # 最大尝试次数
ClientAliveInterval 300     # 空闲超时

# ========== 防火墙配置 ==========
# 只开放必要的端口
firewall-cmd --list-ports
firewall-cmd --add-port=22/tcp --permanent
firewall-cmd --add-port=80/tcp --permanent
firewall-cmd --add-port=443/tcp --permanent
firewall-cmd --reload

# ========== 文件权限 ==========
# 设置合理的文件权限
chmod 600 /etc/ssh/sshd_config
chmod 644 /etc/passwd
chmod 000 /etc/shadow
```

---

### 14.2 应用安全

**Nginx 安全配置：**

```nginx
# 隐藏版本号
server_tokens off;

# 禁止访问隐藏文件
location ~ /\. {
    deny all;
    access_log off;
    log_not_found off;
}

# 限制请求速率
limit_req_zone $binary_remote_addr zone=req_limit:10m rate=10r/s;

# 防止点击劫持
add_header X-Frame-Options "SAMEORIGIN";

# 防止 XSS
add_header X-XSS-Protection "1; mode=block";

# 防止 MIME 类型嗅探
add_header X-Content-Type-Options "nosniff";

# HTTPS 安全头
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
```

---

## 第十五章 自动化运维工具

### 15.1 Ansible 基础

**Ansible 简介：**

Ansible 是一个简单的自动化工具，用于配置管理、应用部署和任务自动化。

**Inventory 文件：**

```ini
# hosts.ini
[webservers]
192.168.1.10 ansible_user=deploy
192.168.1.11 ansible_user=deploy

[dbservers]
192.168.1.20 ansible_user=deploy

[all:vars]
ansible_python_interpreter=/usr/bin/python3
```

**Playbook 示例：**

```yaml
# deploy.yml
---
- name: Deploy Node.js Application
  hosts: webservers
  become: yes
  vars:
    app_dir: /var/www/myapp
    app_user: www-data

  tasks:
    - name: Install Node.js
      apt:
        name: nodejs
        state: present
      when: ansible_os_family == "Debian"

    - name: Create application directory
      file:
        path: "{{ app_dir }}"
        state: directory
        owner: "{{ app_user }}"
        group: "{{ app_user }}"
        mode: '0755'

    - name: Copy application files
      synchronize:
        src: ./
        dest: "{{ app_dir }}/"
        delete: yes
        recursive: yes

    - name: Install dependencies
      npm:
        path: "{{ app_dir }}"
      become_user: "{{ app_user }}"

    - name: Build application
      npm:
        path: "{{ app_dir }}"
        run: build
      become_user: "{{ app_user }}"

    - name: Restart PM2
      shell: pm2 restart all
      become_user: "{{ app_user }}"
```

**运行 Playbook：**

```bash
# 运行 playbook
ansible-playbook -i hosts.ini deploy.yml

# 运行并检查（不执行）
ansible-playbook -i hosts.ini deploy.yml --check

# 运行并查看差异
ansible-playbook -i hosts.ini deploy.yml --diff
```

---

### 15.2 CI/CD 工具

**Jenkins Pipeline 示例：**

```groovy
// Jenkinsfile
pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'my-app'
        DOCKER_REGISTRY = 'registry.example.com'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    def image = docker.build("${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${env.BUILD_NUMBER}")
                }
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh '''
                    ssh deploy@server "
                        cd /var/www/myapp &&
                        docker-compose pull &&
                        docker-compose up -d
                    "
                '''
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Build succeeded!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}
```

---

## 第十六章 常见面试题汇总

### 16.1 Linux 基础面试题

**Q1: Linux 启动过程？**

1. BIOS/UEFI 自检
2. 加载引导程序（GRUB）
3. 加载内核
4. 启动 systemd 进程
5. 运行系统服务

**Q2: 如何查看系统负载？**

```bash
uptime
top
cat /proc/loadavg
```

**Q3: 什么是 inode？**

inode 是文件系统中用于存储文件元数据的数据结构，包含文件权限、时间戳、数据块位置等信息。每个文件都有一个唯一的 inode 编号。

**Q4: 硬链接和软链接的区别？**

- 硬链接：多个文件指向同一个 inode，不能跨文件系统，不能链接目录
- 软链接：类似快捷方式，可以跨文件系统，可以链接目录

**Q5: 如何查看端口被哪个进程占用？**

```bash
lsof -i :port
netstat -tlnp | grep port
```

---

### 16.2 Shell 脚本面试题

**Q1: 如何实现脚本日志记录？**

```bash
#!/bin/bash
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a /var/log/script.log
}

log "Starting script..."
```

**Q2: 如何实现脚本参数解析？**

```bash
#!/bin/bash
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            help
            shift
            ;;
        -f|--file)
            FILE="$2"
            shift 2
            ;;
        -v|--verbose)
            VERBOSE=1
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done
```

---

### 16.3 Docker 面试题

**Q1: Docker 容器和虚拟机的区别？**

- 容器共享宿主机内核，轻量级，启动快
- 虚拟机独立操作系统，资源占用大，启动慢

**Q2: 如何优化 Docker 镜像大小？**

1. 使用多阶段构建
2. 使用较小的基础镜像（alpine）
3. 合理安排层顺序利用缓存
4. 清理不必要的文件

**Q3: Dockerfile 中的 CMD 和 ENTRYPOINT 区别？**

- CMD：提供默认命令，可被 docker run 参数覆盖
- ENTRYPOINT：定义容器入口，通常与 CMD 配合使用

---

### 16.4 网络和安全面试题

**Q1: HTTP 和 HTTPS 的区别？**

- HTTP：明文传输，端口 80
- HTTPS：加密传输，端口 443，使用 SSL/TLS

**Q2: 如何防止 SSH 暴力破解？**

1. 禁用密码认证，使用公钥认证
2. 修改默认端口
3. 限制允许的用户
4. 使用 fail2ban 工具

**Q3: 什么是 XSS 攻击？如何防护？**

跨站脚本攻击，攻击者在网页中注入恶意脚本。防护：对用户输入进行过滤和转义，使用 CSP 头。

---

> 想要玩转 Linux 运维岗位？本面试题汇总涵盖了 Linux 基础、Shell 脚本、Docker 容器、运维工具以及 CI/CD 等核心知识点。建议在理解的基础上进行实践操作，这样才能在面试中游刃有余。祝你面试顺利，早日拿到理想的 offer！

---

## 附录：常用命令速查表

### 文件操作

```bash
ls -la          # 列出文件
cd              # 切换目录
pwd             # 显示当前目录
mkdir           # 创建目录
rm -rf          # 强制删除
cp -r           # 复制目录
mv              # 移动/重命名
cat             # 查看文件内容
head/tail       # 查看文件头部/尾部
grep            # 搜索文本
find            # 查找文件
```

### 进程管理

```bash
ps aux          # 查看进程
top             # 实时监控
kill            # 终止进程
systemctl       # 服务管理
```

### 网络操作

```bash
ifconfig/ip     # 网络配置
ping            # 测试连通性
netstat/ss      # 查看端口
curl/wget       # 网络请求
```

### Docker

```bash
docker ps       # 查看容器
docker images   # 查看镜像
docker run      # 运行容器
docker exec     # 进入容器
docker logs     # 查看日志
docker-compose  # 编排容器
```

### Git

```bash
git status      # 查看状态
git add         # 添加文件
git commit      # 提交
git push/pull   # 推送/拉取
git branch      # 分支操作
```

---

本文档会持续更新和完善，如果有任何建议或发现错误，请提交 Issue 或 Pull Request。

---

**更新日志：**

- 2024-02-26: 初始版本，涵盖 Linux 基础、Shell 脚本、Docker 容器、运维工具和 CI/CD 等内容
