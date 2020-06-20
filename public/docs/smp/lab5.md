# 实验五. APPLY实验

**实验目的：** 部署软件到 Target Library 中。之后可以接受(Accept) 软件，也可以对软件进行 Restore。

**实验结果：** 实验后，学生应该掌握

- 如何 APPLY 软件

**实验指导：** 使用GIMSMP 实用程序中的APPLY 命令。

**<font size=5>步骤1</font>** 检查下面的数据集里面是否有内容。

| 分配库                           | 目标库                          |
| -------------------------------- | ------------------------------- |
| yourId.TDMF.SMP.HGTD530.AGTDELIB | yourId.TDMF.SMP.HGTD530.GTDELIB |
| yourId.TDMF.SMP.HGTD530.AGTDMLIB | yourId.TDMF.SMP.HGTD530.GTDMLIB |
| yourId.TDMF.SMP.HGTD530.AGTDPLIB | yourId.TDMF.SMP.HGTD530.GTDPLIB |
| yourId.TDMF.SMP.HGTD530.AGTDTLIB | yourId.TDMF.SMP.HGTD530.GTDTLIB |
| yourId.TDMF.SMP.HGTD530.AGTDLLIB | yourId.TDMF.SMP.HGTD530.GTDLLIB |

**<font size=5>步骤2</font>**  预备执行APPLY，把软件部署到Target Library中，是软件生效。使用“CHECK”检查是否有错误。

```
//APLY JOB CLASS=A,MSGCLASS=A,MSGLEVEL=(1,1),
// 		NOTIFY=&SYSUID
//APPLY EXEC PGM=GIMSMP,REGION=0M
//SMPCSI DD DSN=yourId.TDMF.SMP.CSI,
//			DISP=OLD
//SMPCNTL DD *
  SET BOUNDARY(TZONE) .
  APPLY SELECT(HGTD530)
		BYPASS(HOLDSYS,HOLDUSER)
		CHECK
		COMPRESS(ALL) .
/*
```

**注释：**

1. HOLDSYS意思是，跟特定系统的reason ID相关的SYSMOD 在 APPLY 的时候将不会被挂起而直接被SMP/E处理。如果缺省，则所有的 SYSMOD 都会被SMP/E 直接处理。
2. HOLDUSER，跟特定用户的reason ID相关的SYSMOD 在 APPLY 的时候将不会被挂起而直接被SMP/E处理。如果缺省，则所有的 SYSMOD 都会被SMP/E 直接处理。

**<font size=5>步骤3</font>** 如果上述步骤无误，删除CHECK，执行APPLY。



**<font size=5>步骤4</font>** 如果上述步骤执行成功，在3.4面板中再次查看目标库中是否已经有软件内容。

| 目标库                          | 是否有内容？如果有，查看其内容                           |
| -------------------------------- | ------------------------------- |
| yourId.TDMF.SMP.HGTD530.GTDELIB |  |
| yourId.TDMF.SMP.HGTD530.GTDMLIB |  |
| yourId.TDMF.SMP.HGTD530.GTDPLIB |  |
| yourId.TDMF.SMP.HGTD530.GTDTLIB |  |
| yourId.TDMF.SMP.HGTD530.GTDLLIB |  |

**<font size=5>步骤5</font>** 作业执行成功后，使用LIST命令查看各类 ZONE 中的内容，重点观察 SMPLIST 中的 GLOBAL ZONE和 TARGET ZONE 中具体增加了哪些内容。

```
SET BDY(GLOBAL).
LIST ALLZONES.
```

```
			Display Filter View Print Options Search Help
-------------------------------------------------------------------------------
SDSF JOB DATA SET DISPLAY - JOB LISTZONE (JOB07710) 	DATA SET DISPLAYED
PREFIX=* DEST=(ALL) OWNER=ADM010 SYSNAME=
NP DDNAME StepName ProcStep  DSID Owner C Dest 		Rec-Cnt Page
   JESMSGLG JES2 				2 ADM010 W LOCAL 		18
   JESJCL JES2 					3 ADM010 W LOCAL 		8
   JESYSMSG JES2 				4 ADM010 W LOCAL 		38
   SMPLIST SMPE 			  102 ADM010 W LOCAL 		295
   SMPOUT SMPE 				  104 ADM010 W LOCAL 		11
   SMPRPT SMPE 				  105 ADM010 W LOCAL 		16
   SMPOUT SMPE 				  106 ADM010 W LOCAL 		12
   SMPRPT SMPE 				  107 ADM010 W LOCAL 		16
```

```
GLOBAL SYSMOD ENTRIES
  NAME
HGTD530 TYPE 		= FUNCTION
		DESCRIPTION = TDMF Base
		STATUS 		= REC
		REWORK 		= 2011105
		JCLIN 		= YES
		DATE/TIME REC = 16.144 10:28:48
		TLIBPREFIX = yourId.TDMF.SMP
		APPLY ZONE = TZONE
		SREL VER(001) = Z038
		DELETE VER(001) = GTD5100 GTD5200
		DATA 		= GTDKEYS
		EXEC 		= GZDRECON TDMF TDMFMON
		MOD 		= GTDADDT GTDAKEY GTDAMAP GTDASPP GTDASSO GT
					GTDBUPM GTDBVOL GTDCDDT GTDCDIO GTDCFTP GT
					GTDCNAV GTDCOMF GTDCOMM GTDCOM1 GTDCOM2 GT
                    GTDDDDT GTDDOVA GTDEDDT GTDEMC GTDEVOL GT
                    GTDHMSG GTDHST GTDIBM GTDICOM GTDICPY GT
    ......
```

