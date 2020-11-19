#!/bin/bash

# 切换到 master 分支
git checkout master

# 获取最新的 master 分支代码
git pull origin master

# npm version xxx 最后的类型，patch|minor|minor 三选一
version_type="patch" ## 默认为 patch

# 执行命令传入了参数（参数数量 >= 1），如 `sh ./build/up-version.sh patch`
if [ $# -eq 1 -o $# -gt 1 ]
then
    ## 参数值必须 patch|minor|major 三选一
    if [ $1 != "patch" -a $1 != "minor" -a $1 != "major" ]
    then
        echo "参数值错误，必须 patch|minor|major 三选一"
        exit 1
    fi
    version_type=$1

    ## 对 major 和 minor 进行再次确认
    if [ $version_type = 'minor' -o $version_type = 'major' ]
    then
        read -r -p "你确定要执行 npm version $version_type ? [Y/n] " input
        case $input in
            [yY][eE][sS]|[yY])
                echo "确认，继续执行"
                ;;

            [nN][oO]|[nN])
                echo "取消执行"
                exit 1
                ;;

            *)
                echo "非法输出，取消执行"
                exit 1
                ;;
        esac
    fi
fi

echo "version_type: $version_type"

# 升级 npm 版本并自动生成 git tag 
npm version $version_type

# push tags ，以触发 github actions 发布到 npm
git push origin --tags
