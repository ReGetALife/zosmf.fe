# 实验七. 提交实验报告

**实验目的：** 提交实验报告

**实验结果：** 实验后，学生应该掌握

- 通过LIST命令查看 ZONE 的内容

**实验指导：** 使用 GIMSMP 实用程序完成实验



## 实验步骤

**<font size=5>步骤1</font>** 查看 GLOBAL Zone，TARGET Zone，DISTRIBUTION Zone 内容。注意作业名称应该为“yourIdR5”。

```
//yourIdR5 JOB NOTIFY=&SYSUID
//LIST1 EXEC PGM=GIMSMP,REGION=0M
//SMPCSI DD DSN=yourId.TDMF.SMP.CSI,
//			DISP=OLD
//SMPLIST DD SYSOUT=*
//SYSPRINT DD SYSOUT=*
//SMPCNTL DD *
  SET BDY(GLOBAL).
  LIST GLOBALZONE SYSMODS.
//LIST2 EXEC PGM=GIMSMP,REGION=0M
//SMPCSI DD DSN=yourId.TDMF.SMP.CSI,
// 			DISP=OLD
//SMPLIST DD SYSOUT=*
//SYSPRINT DD SYSOUT=*
//SMPCNTL DD *
  SET BDY(TZONE).
  LIST TZONE SYSMODS.
//LIST3 EXEC PGM=GIMSMP,REGION=0M
//SMPCSI DD DSN=yourId.TDMF.SMP.CSI,
// 			DISP=OLD
//SMPLIST DD SYSOUT=*
//SYSPRINT DD SYSOUT=*
//SMPCNTL DD *
  SET BDY(DZONE).
  LIST DZONE SYSMODS.
```

1. Submit JCL作业，确保作业的返回码不大于4，观察作业输出，确保内容无误。
2. 在SDSF;ST面板中找到作业，在作业左侧使用 XD 命令把作业输出到数据集（yourId.SMP.REPORT）中。
3. 最后通过FTP工具（比如FileZilla）把数据集（yourId.SMP.REPORT）下载到本地***提交到QQ群中***。
