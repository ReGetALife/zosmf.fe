# 实验一 SMP/E准备工作

**实验目的:** 创建一个Global CSI, Target CSI 和 Distribution CSI

**实验结果:** 实验后，学生应该掌握：

- 创建CSI
- 初始化CSI
- 创建 SMP/E 数据集
- 定义Global Zone, Target Zone, Distribution Zone

**实验指导:** 使用IDCAMS实用程序中的 DEFINE CLUSTER 命令创建一个CSI 数据集。



## 实验步骤

**<font size=5>步骤一</font>** 提交以下JCL作业，创建一个新的CSI数据集

```
//*以下作业用来完成 SMP/E 的准备工作
//*
//*作业流程概要:
//*1 创建一个 KSDS 数据集，作为 CSI
//*2 初始化 CSI
//*3 创建多个 SMP/E 管理的数据集，给 DDDEF 动态创建数据集做准备
//*4 分别定义全局区，目标区，分配区
//*
//FEK1SMPE JOB CLASS=A,MSGCLASS=A,MSGLEVEL=(1,1),
// NOTIFY=&SYSUID
//*********************************************************************
//*
//*定义了一个名为 yourId.TDMF.SMP.CSI 的 KSDS 数据集，作为 CSI
//*
//DEFCSI EXEC PGM=IDCAMS,REGION=0M
//SYSPRINT DD SYSOUT=*
//SYSIN DD *
   DEFINE CLUSTER -
            (NAME(yourId.TDMF.SMP.CSI) -
            RECORDSIZE(24 143) -
            KEYS(24 0) -
            FREESPACE(10,5) -
            SHR(2) -
            VOLUMES(USER01) -
            UNIQUE -
            IMBED) -
        DATA (NAME(yourId.TDMF.SMP.CSI.DATA) -
            CONTROLINTERVALSIZE(4096) -
            CYLINDERS(1 1)) -
       INDEX (NAME(yourId.TDMF.SMP.CSI.INDEX) -
            TRACKS(10 10))
```

**<font size=5>步骤二</font>** 提交以下JCL作业，格式化一个新的CSI数据集

```
//* 将 CSI 准备好
//* 将 SYS1.MACLIB 中的 GIMZPOOL 成员复制到刚刚创建好的 CSI 中，对 CSI 进行初始化。
//*
//INITCSI EXEC PGM=IDCAMS,REGION=0M
//SMPCSI DD DSN=yourId.TDMF.SMP.CSI,
// 		    DISP=OLD
//ZPOOL DD DSN=SYS1.MACLIB(GIMZPOOL),DISP=SHR
//SYSPRINT DD SYSOUT=*
//SYSIN DD *
   REPRO INFILE(ZPOOL) OUTFILE(SMPCSI)
/*   
```

**<font size=5>步骤三</font>** 定义一个过程，创建SMP/E数据集，这7个数据集分别如下所示，同时初始化global zone，定义DDDEF，关联数据集（包括这7个新建的数据集）。

| Data Set Name           | Description                                                  |
| ----------------------- | ------------------------------------------------------------ |
| yourId.TDMF.SMP.SMPLOG  | The SMPLOG data set (LOG) contains time-stamped records of SMP/E processing. The records in this data set can be written automatically by SMP/E or added by the user through the LOG command. The data set also contains messages issued by SMP/E, as well as detailed information about data set allocation. |
| yourId.TDMF.SMP.SMPLOGA | SMPLOGA is a backup LOG data set. If SMPLOGA is defined, it is used automatically when the SMPLOG data set is full. |
| yourId.TDMF.SMP.SMPLTS  | The SMPLTS data set is used to maintain the base versions of load modules and program objects for which SYSLIB allocations have been specified. |
| yourId.TDMF.SMP.SMPMTS  | The SMPMTS data set (MTS) is a target library for macros that exist only in a distribution library (such as macros in SYS1.AMODGEN). This data set allows the current version of these macros to be used for assemblies during APPLY processing. |
| yourId.TDMF.SMP.SMPPTS  | The SMPPTS data set (PTS) is used as a repository for SYSMODs. It contains one member for each SYSMOD that was received. Each member is called an MCS entry and is an exact copy of the SYSMOD as it was received from the SMPPTFIN data set. The name of an MCS entry matches the SYSMOD ID of the SYSMOD it contains. |
| yourId.TDMF.SMP.SMPSCDS | The SMPSCDS data set (SCDS) contains backup copies of target zone entries that are created during APPLY processing. |
| yourId.TDMF.SMP.SMPSTS  | The SMPSTS data set (STS) is a target library for source that exists only in a distribution library. This data set allows the current version of these modules to be used for assemblies during APPLY processing. |

示例JCL作业如下：

```
//* 创建 SMP/E 数据集
//CRTDS PROC SMPPRFX='yourId.TDMF.SMP',BLKSZ=27920
//SMPE EXEC PGM=GIMSMP,REGION=0M
//SMPCSI DD DSN=yourId.TDMF.SMP.CSI,DISP=OLD
//*下面的数据集包含 LIST 命令的输出
//SMPLIST DD SYSOUT=*
//SYSPRINT DD SYSOUT=*
//*下面的数据集包含 SMP/E 处理的时间戳
//*下面的记录可以被 SMP/E 自动的写入，或者用户通过 LOG 命令添加
//SMPLOG DD DSN=&SMPPRFX..SMPLOG,
// 			DISP=(NEW,CATLG,DELETE),
//			DSORG=PS,
// 			RECFM=VB,
// 			LRECL=3200,
// 			BLKSIZE=&BLKSZ,
// 			UNIT=SYSDA,
// 			SPACE=(3200,(35,35))
//*下面的数据集是一个备份数据集。当 SMPLOG 数据集满了，它会被自动使用
//SMPLOGA DD DSN=&SMPPRFX..SMPLOGA,
// 			DISP=(NEW,CATLG,DELETE),
// 			DSORG=PS,
// 			RECFM=VB,
// 			LRECL=3200,
// 			BLKSIZE=&BLKSZ,
// 			UNIT=SYSDA,
// 			SPACE=(3200,(35,35))
//*下面的数据集用来维护 LOAD MODULE 的 Base Version 和 Program Object.
//*它们是由 SYSLIB 指定的
//SMPLTS DD DSN=&SMPPRFX..SMPLTS,
// 			DISP=(NEW,CATLG,DELETE),
// 			DSNTYPE=LIBRARY,
// 			RECFM=U,
// 			LRECL=0,
// 			BLKSIZE=32760,
// 			UNIT=SYSDA,
// 			SPACE=(6144,(1200,300,150))
//*下面的数据集用来接收来自分配库的宏
//SMPMTS DD DSN=&SMPPRFX..SMPMTS,
// 			DISP=(NEW,CATLG,DELETE),
// 			DSORG=PO,
// 			RECFM=FB,
// 			LRECL=80,
// 			BLKSIZE=&BLKSZ,
// 			UNIT=SYSDA,
// 			SPACE=(6160,(35,20,10))
//*该数据集是 SYSMOD 的库，它为每个 SYSMOD 创建一个成员。
//*每个成员都是 SMPPTFIN 的备份。
//SMPPTS DD DSN=&SMPPRFX..SMPPTS,
// 			DISP=(NEW,CATLG,DELETE),
// 			DSORG=PO,
// 			RECFM=FB,
// 			LRECL=80,
// 			BLKSIZE=&BLKSZ,
// 			UNIT=SYSDA,
// 			SPACE=(6160,(350,350,80))
//*
//*下面的数据集包含目标区 Entry 的备份，这些 Entry 是在 APPLY 过程中创建的。
//SMPSCDS DD DSN=&SMPPRFX..SMPSCDS,
// 			DISP=(NEW,CATLG,DELETE),
// 			DSORG=PO,
// 			RECFM=FB,
// 			LRECL=80,
// 			BLKSIZE=&BLKSZ,
// 			UNIT=SYSDA,
// 			SPACE=(6160,(70,35,80))
//*
//*下面的数据集用来存放仅在分配区存在资源目标库。
//SMPSTS DD DSN=&SMPPRFX..SMPSTS,
// 			DISP=(NEW,CATLG,DELETE),
// 			DSORG=PO,
// 			RECFM=FB,
// 			LRECL=80,
// 			BLKSIZE=&BLKSZ,
// 			UNIT=SYSDA,
// 			SPACE=(6160,(35,35,80))
//*下面的数据集用来存放 SMP/E 处理过程中产生的信息，同时包括 VSAM RPL 的转储信息。
//SMPOUT DD SYSOUT=*
//下面的数据集存放 SMP/E 处理过程产生的报告。
//SMPRPT DD SYSOUT=*
//*当 SMP/E 出现严重错误时，下面的数据集用来存放 SMP/E 存储的输出。
//SMPSNAP DD SYSOUT=*
//* 临时数据集
//SMPWRK1 DD UNIT=SYSDA,SPACE=(CYL,(2,1,10)),DCB=BLKSIZE=6160
//SMPWRK2 DD UNIT=SYSDA,SPACE=(CYL,(2,1,10)),DCB=BLKSIZE=6160
//SMPWRK3 DD UNIT=SYSDA,SPACE=(CYL,(2,1,10)),DCB=BLKSIZE=3200
//SMPWRK4 DD UNIT=SYSDA,SPACE=(CYL,(2,1,10)),DCB=BLKSIZE=3200
//SMPWRK6 DD UNIT=SYSDA,SPACE=(CYL,(2,1,10)),DCB=BLKSIZE=3200
//*当某些 UITILITY 被调用时，下面的数据集可用来代替一些数据集，像 SYSIN,SYSLIN.
//SYSUT1 DD UNIT=SYSDA,SPACE=(CYL,(2,1))
//SYSUT2 DD UNIT=SYSDA,SPACE=(CYL,(2,1))
//SYSUT3 DD UNIT=SYSDA,SPACE=(CYL,(2,1))
//SYSUT4 DD UNIT=SYSDA,SPACE=(CYL,(2,1))
// PEND
//STEP EXEC CRTDS
//SMPCNTL DD *
    SET BDY(GLOBAL) .
    UCLIN.
      ADD GLOBALZONE /* 定义全局区 */
    	  OPTIONS(TDMOPT) /* 定义一个 OPTIONS ENTRY */
          SREL(Z038) /*列出在全局支持的系统版本。Z038 代表 MVS */
          ZONEINDEX( /*指向 TZONG,DZONG 的指针*/
           (TZONE,yourId.TDMF.SMP.CSI,TARGET), /*告诉 SMP/E 它们在哪个数据集里*/
           (DZONE,yourId.TDMF.SMP.CSI,DLIB)).
      ADD OPTIONS(TDMOPT) /* 添加 OPTIONS ENTRY */
    	ASM(ASMUTIL) /* SMP ASSEMBLER UTILITY 名 */
    	LKED(LINKEDIT) /* SMP LINK EDIT UTILITY 名 */
    	DSPREFIX(yourId.TDMF.SMP) /*当SMPTLIB 数据集创建的时候，指定的数据集的前缀*/
    	DSSPACE(1200,1200,1400)
    	NOPURGE /* KEEP REL FILES AFTER RCVE */
    	.
      ADD UTILITY(ASMUTIL) /* ASSEMBLER UTILITY ENTRY */
    	NAME(ASMA90) /* ASMA90 IS ASSEMBLER H */
    	PARM(DECK,NOOBJECT,USING(WARN(2))) /*指定 UTILITY 要使用的参数*/
    	RC(4) /*指定能够接受的最高返回码，如果返回码高于该值，则认为请求失败*/
    	.
      ADD UTILITY(LINKEDIT) /* LINK EDIT UTILITY ENTRY */
    	NAME(HEWLH096) /* LINKAGE EDITOR 名 */
    	RC(4) /* 能够接受的最高返回码 */
    	PRINT(SYSPRINT) /* 供 SYSPRINT OUTPUT 使用的 DDNAME */
    	PARM(SIZE=(1526K,100K),NCAL,LET,LIST,XREF) /* 覆盖 SIZE */
    	.
      ADD DDDEF(SMPOUT) SYSOUT(*) .
      ADD DDDEF(SMPRPT) SYSOUT(*) .
      ADD DDDEF(SMPLIST) SYSOUT(*) .
      ADD DDDEF(SYSPRINT) SYSOUT(*) .
      ADD DDDEF(SMPSNAP) SYSOUT(*) .
      ADD DDDEF(SMPTLIB) UNIT(SYSDA) .
      ADD DDDEF(SYSUT1) CYL SPACE(2,1) UNIT(SYSDA) .
      ADD DDDEF(SYSUT2) CYL SPACE(2,1) UNIT(SYSDA) .
      ADD DDDEF(SYSUT3) CYL SPACE(2,1) UNIT(SYSDA) .
      ADD DDDEF(SYSUT4) CYL SPACE(2,1) UNIT(SYSDA) .
      ADD DDDEF(SMPTLOAD) CYL SPACE(2,1) DIR(10) UNIT(SYSDA) .
      ADD DDDEF(SMPLOG) DA(yourId.TDMF.SMP.SMPLOG) MOD .
      ADD DDDEF(SMPLOGA) DA(yourId.TDMF.SMP.SMPLOGA) MOD .
      ADD DDDEF(SMPLTS) DA(yourId.TDMF.SMP.SMPLTS) SHR .
      ADD DDDEF(SMPMTS) DA(yourId.TDMF.SMP.SMPMTS) SHR .
      ADD DDDEF(SMPPTS) DA(yourId.TDMF.SMP.SMPPTS) SHR .
      ADD DDDEF(SMPSCDS) DA(yourId.TDMF.SMP.SMPSCDS) SHR .
      ADD DDDEF(SMPSTS) DA(yourId.TDMF.SMP.SMPSTS) SHR .
	ENDUCL .
```

执行上述JCL作业，定义Global Zone，为其定义Option, Utility, DDDEF。



***补充（关于Utility）:***

If you do not define UTILITY entries and OPTIONS entries to specify which utility programs to use, SMP/E uses default utility programs, as well as its own default values, for return codes, print values, and the parameters to be passed. Table 4 lists the default values for the various types of utility programs.

![](/img/smp/lab1/1.png)

**<font size=5>步骤四</font>** 修改上述JCL作业，定义Target Zone，为其定义默认Option 及DDDEF。

***命令提示：***

```
    SET BDY(TZONE) . /* SET TO TZONE ZONE */
    UCLIN.
      ADD TARGETZONE(TZONE) /*定义目标区 */
        RELATED(DZONE) /*目标区 RELATED 为分配区*/
        OPTIONS(TDMOPT) /* 定义一个 OPTION ENTRY */
        SREL(Z038)
        .
      ADD DDDEF(SMPOUT) SYSOUT(*) .
      ADD DDDEF(SMPRPT) SYSOUT(*) .
      ADD DDDEF(SMPLIST) SYSOUT(*) .
      ADD DDDEF(SYSPRINT) SYSOUT(*) .
      ADD DDDEF(SMPSNAP) SYSOUT(*) .
      ADD DDDEF(SYSUT1) CYL SPACE(2,1) UNIT(SYSDA) .
      ADD DDDEF(SYSUT2) CYL SPACE(2,1) UNIT(SYSDA) .
      ADD DDDEF(SYSUT3) CYL SPACE(2,1) UNIT(SYSDA) .
      ADD DDDEF(SYSUT4) CYL SPACE(2,1) UNIT(SYSDA) .
      ADD DDDEF(SMPLOG) DA(yourId.TDMF.SMP.SMPLOG) MOD .
      ADD DDDEF(SMPLOGA) DA(yourId.TDMF.SMP.SMPLOGA) MOD .
      ADD DDDEF(SMPLTS) DA(yourId.TDMF.SMP.SMPLTS) SHR .
      ADD DDDEF(SMPMTS) DA(yourId.TDMF.SMP.SMPMTS) SHR .
      ADD DDDEF(SMPPTS) DA(yourId.TDMF.SMP.SMPPTS) SHR .
      ADD DDDEF(SMPSCDS) DA(yourId.TDMF.SMP.SMPSCDS) SHR .
      ADD DDDEF(SMPSTS) DA(yourId.TDMF.SMP.SMPSTS) SHR .
      ADD DDDEF(SYSLIB) CONCAT(SMPMTS) .
      ADD DDDEF(SMPTLOAD) CYL SPACE(2,1) DIR(10) UNIT(SYSDA) .
      ADD DDDEF(SMPWRK1) CYL SPACE(2,1) DIR(10) UNIT(SYSDA) .
      ADD DDDEF(SMPWRK2) CYL SPACE(2,1) DIR(10) UNIT(SYSDA) .
      ADD DDDEF(SMPWRK3) CYL SPACE(2,1) DIR(10) UNIT(SYSDA) .
      ADD DDDEF(SMPWRK4) CYL SPACE(2,1) DIR(10) UNIT(SYSDA) .
      ADD DDDEF(SMPWRK6) CYL SPACE(2,1) DIR(10) UNIT(SYSDA) .
    ENDUCL .
```

**<font size=5>步骤5</font>** 修改上述JCL作业，定义Distribution Zone，为其定义默认 Option 及DDDEF。

***命令提示：***

```
    SET BDY(DZONE) .
    UCLIN.
      ADD DLIBZONE(DZONE) /* 定义分配区 */
        RELATED(TZONE) /*分配区 RELATED 为目标区*/
        OPTIONS(TDMOPT)
        SREL(Z038) .
      ADD DDDEF(SMPOUT) SYSOUT(*) .
      ADD DDDEF(SMPRPT) SYSOUT(*) .
      ADD DDDEF(SMPLIST) SYSOUT(*) .
      ADD DDDEF(SYSPRINT) SYSOUT(*) .
      ADD DDDEF(SMPSNAP) SYSOUT(*) .
      ADD DDDEF(SYSUT1) CYL SPACE(2,1) UNIT(SYSDA) .
      ADD DDDEF(SYSUT2) CYL SPACE(2,1) UNIT(SYSDA) .
      ADD DDDEF(SYSUT3) CYL SPACE(2,1) UNIT(SYSDA) .
      ADD DDDEF(SYSUT4) CYL SPACE(2,1) UNIT(SYSDA) .
      ADD DDDEF(SMPLOG) DA(yourId.TDMF.SMP.SMPLOG) MOD .
      ADD DDDEF(SMPLOGA) DA(yourId.TDMF.SMP.SMPLOGA) MOD .
      ADD DDDEF(SMPLTS) DA(yourId.TDMF.SMP.SMPLTS) SHR .
      ADD DDDEF(SMPMTS) DA(yourId.TDMF.SMP.SMPMTS) SHR .
      ADD DDDEF(SMPPTS) DA(yourId.TDMF.SMP.SMPPTS) SHR .
      ADD DDDEF(SMPSCDS) DA(yourId.TDMF.SMP.SMPSCDS) SHR .
      ADD DDDEF(SMPSTS) DA(yourId.TDMF.SMP.SMPSTS) SHR .
      ADD DDDEF(SYSLIB) CONCAT(SMPMTS) .
      ADD DDDEF(SMPTLOAD) CYL SPACE(2,1) DIR(10) UNIT(SYSDA) .
      ADD DDDEF(SMPWRK1) CYL SPACE(2,1) DIR(10) UNIT(SYSDA) .
      ADD DDDEF(SMPWRK2) CYL SPACE(2,1) DIR(10) UNIT(SYSDA) .
      ADD DDDEF(SMPWRK3) CYL SPACE(2,1) DIR(10) UNIT(SYSDA) .
      ADD DDDEF(SMPWRK4) CYL SPACE(2,1) DIR(10) UNIT(SYSDA) .
      ADD DDDEF(SMPWRK6) CYL SPACE(2,1) DIR(10) UNIT(SYSDA) .
    ENDUCL .
```

**<font size=5>步骤6</font>** 提交JCL作业，查看之前几个步骤定义的ZONE。

***提示：SMP/E命令***

```
    SET BDY(GLOBAL).
    LIST ALLZONES . /* 列出区域信息 */
```

