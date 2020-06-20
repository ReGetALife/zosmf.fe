# 实验六. ACCEPT实验

**实验目的：** 接受软件到 Distribution Library 中。软件一旦接受（Accept），将无法Restore。

**实验结果：** 实验后，学生应该掌握

- 如何ACCEPT软件

**实验指导：** 使用GIMSMP 实用程序中的ACCEPT 命令



## 实验步骤

**<font size=5>步骤1</font>** 接受软件到 Distribution Library 中。一旦接受，系统将不能把该软件从 Target Library中移除。

```
//ACCEPT JOB CLASS=A,MSGCLASS=A,MSGLEVEL=(1,1),
// 		NOTIFY=&SYSUID
//STEP EXEC PGM=GIMSMP,REGION=0M
//SMPCSI DD DSN=yourId.TDMF.SMP.CSI,
// 			DISP=OLD
//SMPCNTL DD *
  SET BOUNDARY(DZONE) .
  ACCEPT SELECT(HGTD530)
		BYPASS(HOLDSYS,HOLDUSER)
		CHECK
		COMPRESS(ALL) .
```

**<font size=5>步骤2</font>** 如果上述步骤无误，删除CHECK，执行ACCEPT。



**<font size=5>步骤3</font>** 如果上述步骤执行成功，在3.4面板中再次查看目标库中是否已经有软件内容。

| 目标库                           | 是否有内容？如果有，查看其内容 |
| -------------------------------- | ------------------------------ |
| yourId.TDMF.SMP.HGTD530.AGTDELIB |                                |
| yourId.TDMF.SMP.HGTD530.AGTDMLIB |                                |
| yourId.TDMF.SMP.HGTD530.AGTDPLIB |                                |
| yourId.TDMF.SMP.HGTD530.AGTDTLIB |                                |
| yourId.TDMF.SMP.HGTD530.AGTDLLIB |                                |

**<font size=5>步骤4</font>** 作业执行成功后，使用LIST命令查看各类 ZONE 中的内容，重点观察 SMPLIST 中的 DISTRIBUTION ZONE 中具体增加了哪些内容。

```
  SET BDY(GLOBAL).
  LIST ALLZONES.
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
		TLIBPREFIX = ADM010.TDMF.SMP
		APPLY ZONE = TZONE
		ACCEPT ZONE = DZONE
		SREL VER(001) = Z038
		DELETE VER(001) = GTD5100 GTD5200
		DATA 			= GTDKEYS
		EXEC 			= GZDRECON TDMF TDMFMON
		MOD 			= GTDADDT GTDAKEY GTDAMAP GTDASPP GTDASSO GT
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
                        XERSVC XERTERM XERWTO       ...
```

