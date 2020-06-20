# 实验二. RECEIVE 实验

**实验目的：** 接受软件（包括软件的各类代码和控制语句）到Global Zone中，为后续的Apply/Accept/Restore/ Reject 等操作做预备工作。

**实验结果：** 实验后，学生应该掌握

- 如何RECEIVE软件

**实验指导：** 使用GIMSMP实用程序中的RECEIVE命令接受软件。



## 实验步骤

**<font size=5>步骤1</font>** 提交以下JCL作业，接收软件：TDMF for z/OS  Version 5 Release 3.0

软件相关信息参见：http://www-950.ibm.com/services/dms/en/support/tdmf/zos/v5/download530.html 。

**<font color=red>注意：SMPPTFIN 为软件安装控制语句，数据集的 hlq 为 “teacherId” ，无需修改。SMPCNTL 控制语句中
RFPREFIX(teacherId)无需修改</font>**

**示例JCL作业：**

```
//RCVE JOB CLASS=A,MSGCLASS=A,MSGLEVEL=(1,1),
// 		NOTIFY=&SYSUID
//RECEIVE EXEC PGM=GIMSMP,REGION=0M
//SMPCSI DD DSN=yourId.TDMF.SMP.CSI,
// 			DISP=OLD
//SMPPTFIN DD DSN=teacherId.IBM. HGTD530.SMPMCS, /*指定的是要接收的 SYSMOD 来源*/
// 			DISP=SHR /*该数据集里包含 MCS */
//SMPHOLD DD DUMMY
//SMPCNTL DD *
   SET BOUNDARY(GLOBAL) .
   RECEIVE SELECT(HGTD530) /* 1 注释*/
		SYSMODS /* 2 注释*/
		RFPREFIX(teacherId) /* 3 注释*/
		LIST . /* 4 注释*/
/*		
```

***注释：***

1. **SELECT**

   指定将要接收的一个或多个SYSMOD的ID，其它跟此SYSMOD相关的特征都将被接收。该命令还可以用来指定FMIDSET，这是一个用来存放FMIDs的数据集。

2. **SYSMODS **

   指出来自SMPPTFIN（是SYSMOD的源数据，存在于磁带或磁盘中）的数据应该被接收。如果指定的是HOLDDATA说明要接收HOLDDATA。

3. **RFPREFIX**

   指定RELFILE（顾名思义，指的是实际的元件）的HLQ为teachId。

4. **LIST**

   指出SMP/E将列出每个可用的SYSMOD的MCS。

   

***说明：***

- RECEIVE是第一个SMP/E用来处理SYSMOD的命令。它将数据读入全局区，SMPPTS，还有临时数据集SMPLIBS为以后的处理做准备。
- teacherId.IBM.HHOP750.SMPMCS是一个包含MCS语句的数据集，下面对其中的内容做如下解释

| Command                                                      | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ++FUNCTION(HGTD530)<br/>REWORK(2011105)<br/>DESC(TDMF Base)<br/>RFDSNPFX(IBM)<br/>FILES(6) | 1. REWORK指定SYSMOD修改的级别，它指定的参数是一个日期，只要这个日期比当前系统中已经接收SYSMOD的日期晚，该SYSMOD的就可以使用<br/>2. DESC指定描述信息。<br/>3. RFDSNPFX 指定在RECEIVE过程中所需要创建的数据集的HLQ.<br/>4. FILES指定与此FUNCTION相关的文件的数量，为了提高SMP/E的性能，FUNCTION常常被打包到相应的文件中 |
| ++VER(Z038)<br/>DELETE(GTD5100,GTD5200)                      | 1. VER 描述接收和安装一个SYSMOD所需要的环境<br/>2. DELETE指定当前的FUNCTION安装的时候，需要首先删除的FUNCTION |
| ++MOD(GTDADDT)<br/>SYSLIB(…)<br/>DISTLIB(…)<br/>RELFILE(…) 1/2/3/4/5/6 | 1. SYSLIB指定目标库的 DDname<br/>2. DISTLIB指定分配库的DDname。<br/>3. RELFILE 指定包含这个元件的SYSMOD的相关的文件。 |

**<font size=5>步骤2</font>** 作业成功后，使用LIST命令查看GLOBAL ZONE。重点观察 SMPLIST 中的 GLOBALZONE 增加了哪些内容。

```
				Display Filter View Print Options Search Help
-------------------------------------------------------------------------------
SDSF JOB DATA SET DISPLAY - JOB LISTZONE (JOB07707) DATA SET DISPLAYED
PREFIX=* DEST=(ALL) OWNER=ADM010 SYSNAME=
NP DDNAME StepName ProcStep DSID Owner C Dest 		Rec-Cnt Page
    JESMSGLG JES2 			  2 ADM010 W LOCAL 		18
	JESJCL JES2 			  3 ADM010 W LOCAL 		8
	JESYSMSG JES2 			  4 ADM010 W LOCAL 		31
	SMPLIST SMPE            102 ADM010 W LOCAL 		1,407
	SMPOUT SMPE 			104 ADM010 W LOCAL 		12
	SMPRPT SMPE 			105 ADM010 W LOCAL 		28
```

```
GLOBAL SYSMOD ENTRIES
  NAME
HGTD530 TYPE 	= FUNCTION
		DESCRIPTION = TDMF Base
		STATUS = REC
		REWORK = 2011105
		JCLIN = YES
		DATE/TIME REC = 16.144 10:28:48
		TLIBPREFIX = ADM010.TDMF.SMP
		SREL VER(001) = Z038
		DELETE VER(001) = GTD5100 GTD5200
		DATA = GTDKEYS
		EXEC = GZDRECON TDMF TDMFMON
		MOD = GTDADDT GTDAKEY GTDAMAP GTDASPP GTDASSO GT
			GTDBUPM GTDBVOL GTDCDDT GTDCDIO GTDCFTP GT
            GTDCNAV GTDCOMF GTDCOMM GTDCOM1 GTDCOM2 GT
            GTDDDDT GTDDOVA GTDEDDT GTDEMC GTDEVOL GT
            GTDHMSG GTDHST GTDIBM GTDICOM GTDICPY GT
            GTDIOER GTDIPGM GTDIP01 GTDIP02 GTDIP03 GT
            GTDKVOL GTDLKEY GTDLOGS GTDLVL GTDMAIN GT
            GTDMSGV GTDMST GTDMSTA GTDMSTR GTDMST1 GT
            GTDMUCB GTDMVOL GTDNVOL GTDOPT GTDPERF GT
            GTDRFTP GTDRMGR GTDRMST GTDRTNC GTDRTNM GT
            GTDSLAV GTDSLV1 GTDSTAT GTDSTK GTDSUMM GT
            GTDTRC GTDTRD GTDTRP GTDTVOL GTDUCBS GT
            GTDVERS GTDVMAP GTDVOL GTDVPST GTDVRBS GT
            GTDXCPY GTDXER GTDXSA1 GTDXSL0 GTDXSL1 GT
            GTDXSR0 GTDXSR1 GTDXSR2 GTDXSR3 GTDXVOL GT
            XERSVC XERTERM XERWTO
......
```

