# 实验环境介绍

## 一. 实验环境权限及其它说明

- 实验账号要能够建立数据集
- 实验账号要能够执行JCL作业
- 实验中 yourid 指用户的实验账号，通常以数字结束，“xx”表示账号的最后两位数字
- 实验中 teacherId 指代教师或管理员账号
- 实验中安装的软件相关代码需要事先上传到主机上，数据集的HLQ为 teacherId



针对TDMF软件，主机管理员可以按照下面步骤进行代码上传。

1. 解压缩软件代码，获得TSOBATCH、GZDRECON、TDMF530 等文件。
2. 通过FTP登录主机，以 **binary** 方式把以下内容上传到主机中：
   - 放在 PDS 中：TSOBATCH 和 GZDRECON。其中TSOBATCH 是JCL代码，GZDRECON是REXX代码。
   - 顺序数据集：TDMF530，格式：RECFM=FB, BLOCK=27998,  and LRECL=27998
3. 根据主机环境修改 TSOBATCH ，比如修改PREFIX(teacherId)，增加UNIT(3390) WORKUNIT(3390) 参数等，提交该JCL作业来解压缩软件代码。



## 二. 安装软件信息：TDMF for z/OS   Version 5 Release 3.0

软件相关信息参见：http://www-950.ibm.com/services/dms/en/support/tdmf/zos/v5/download530.html ，HLQ为“teacherId”

<img src="/img/smp/intro/1.png" style="display: block; margin: 0 auto; width:25%;" alt="intro_1">


## 三. 说明

1. 实验思路如下图
2. 实验环境中 yourId 均指你的TSO USER ID。

<img src="/img/smp/intro/2.png" style="display: block; margin: 0 auto; width:50%;" alt="intro_2">


