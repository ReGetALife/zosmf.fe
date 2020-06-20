# 实验三. 创建分配库(DLib)和目标库(TLib)

**实验目的：** 创建需要的库，包括分配库（Distribution Library）和目标库（Target Library）。

**实验结果：** 实验后，学生应该掌握

- 批量创建数据集的方法

**实验指导：** 使用IEFBR14实用程序创建数据集



## 实验步骤

**<font size=5>步骤1</font>** 根据软件要求，创建相应的分配库和目标库。

该软件有下）面的一些分配库和目标库。

| 分配库（Distribution Library）         | 目标库（Target Library）  |
| -------------------------------- | ------------------------------- |
| yourId.TDMF.SMP.HGTD530.AGTDELIB | yourId.TDMF.SMP.HGTD530.GTDELIB |
| yourId.TDMF.SMP.HGTD530.AGTDMLIB | yourId.TDMF.SMP.HGTD530.GTDMLIB |
| yourId.TDMF.SMP.HGTD530.AGTDPLIB | yourId.TDMF.SMP.HGTD530.GTDPLIB |
| yourId.TDMF.SMP.HGTD530.AGTDTLIB | yourId.TDMF.SMP.HGTD530.GTDTLIB |
| yourId.TDMF.SMP.HGTD530.AGTDLLIB | yourId.TDMF.SMP.HGTD530.GTDLLIB |

示范JCL作业内容如下：

```
//*创建分配库和目标库
//CRTLIB JOB NOTIFY=&SYSUID
//CRTDS PROC SMPPRFX='yourId.TDMF.SMP.HGTD530'
//STEP EXEC PGM=IEFBR14
//AGTDELIB DD DSN=&SMPPRFX..AGTDELIB,
// 			DISP=(NEW,CATLG,DELETE),
// 			DSORG=PO,
// 			DSNTYPE=LIBRARY,
// 			RECFM=FB,
// 			LRECL=80,
// 			BLKSIZE=23440,
// 			UNIT=SYSDA,
// 			SPACE=(TRK,(15,1))
//AGTDMLIB DD DSN=&SMPPRFX..AGTDMLIB,
// 			DISP=(NEW,CATLG,DELETE),
// 			DSORG=PO,
// 			DSNTYPE=LIBRARY,
//			RECFM=FB,
// 			LRECL=80,
// 			BLKSIZE=23440,
// 			UNIT=SYSDA,
// 			SPACE=(CYL,(1,1))
//AGTDPLIB DD DSN=&SMPPRFX..AGTDPLIB,
// 			DISP=(NEW,CATLG,DELETE),
// 			DSORG=PO,
// 			DSNTYPE=LIBRARY,
// 			RECFM=FB,
// 			LRECL=80,
// 			BLKSIZE=23440,
// 			UNIT=SYSDA,
// 			SPACE=(CYL,(3,2))
//AGTDTLIB DD DSN=&SMPPRFX..AGTDTLIB,
// 			DISP=(NEW,CATLG,DELETE),
// 			DSORG=PO,
// 			DSNTYPE=LIBRARY,
// 			RECFM=FB,
// 			LRECL=80,
// 			BLKSIZE=23440,
// 			UNIT=SYSDA,
// 			SPACE=(TRK,(1,1))
//AGTDLLIB DD DSN=&SMPPRFX..AGTDLLIB,
// 			DISP=(NEW,CATLG,DELETE),
// 			DSORG=PO,
// 			DSNTYPE=LIBRARY,
// 			RECFM=U,
// 			LRECL=0,
// 			BLKSIZE=27998,
// 			UNIT=SYSDA,
// 			SPACE=(CYL,(4,1))
//GTDELIB DD DSN=&SMPPRFX..GTDELIB,
// 			DISP=(NEW,CATLG,DELETE),
// 			DSORG=PO,
// 			DSNTYPE=LIBRARY,
// 			RECFM=FB,
// 			LRECL=80,
// 			BLKSIZE=23440,
// 			UNIT=SYSDA,
// 			SPACE=(TRK,(15,1))
//GTDMLIB DD DSN=&SMPPRFX..GTDMLIB,
// 			DISP=(NEW,CATLG,DELETE),
// 			DSORG=PO,
// 			DSNTYPE=LIBRARY,
// 			RECFM=FB,
// 			LRECL=80,
// 			BLKSIZE=23440,
// 			UNIT=SYSDA,
// 			SPACE=(TRK,(3,2))
//GTDPLIB DD DSN=&SMPPRFX..GTDPLIB,
// 			DISP=(NEW,CATLG,DELETE),
// 			DSORG=PO,
// 			DSNTYPE=LIBRARY,
// 			RECFM=FB,
// 			LRECL=80,
// 			BLKSIZE=23440,
// 			UNIT=SYSDA,
// 			SPACE=(CYL,(3,2))
//GTDTLIB DD DSN=&SMPPRFX..GTDTLIB,
// 			DISP=(NEW,CATLG,DELETE),
// 			DSORG=PO,
// 			DSNTYPE=LIBRARY,
// 			RECFM=FB,
// 			LRECL=80,
// 			BLKSIZE=23440,
// 			UNIT=SYSDA,
// 			SPACE=(TRK,(1,1))
//GTDLLIB DD DSN=&SMPPRFX..GTDLLIB,
// 			DISP=(NEW,CATLG,DELETE),
// 			DSORG=PO,
// 			DSNTYPE=LIBRARY,
// 			RECFM=U,
// 			LRECL=0,
// 			BLKSIZE=27998,
// 			UNIT=SYSDA,
// 			SPACE=(CYL,(8,1))
// PEND
//CRTDS EXEC CRTDS
```

**<font size=5>步骤2</font>** 作业成功后，使用3.4面板查看这些数据集时候创建成功。

