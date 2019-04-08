#!/bin/bash

# opt输入的打包类型
opt=$1
# 项目打包最终目录
folderName=$2

if [ $1 = "o" ]; then
        optName="online"
elif [ $1 = "i" ]; then
        optName="intranet"
else
        optName="develop"
fi

fis3 release ${optName} -d ${folderName}
