<template>
  <div class="menu-container">
    <a-menu
      theme="dark"
      mode="inline"
      @click="handleMenuClick"
      :defaultOpenKeys="defaultOpenKeys"
      v-model="selectedKeys"
    >
      <a-sub-menu v-for="menu in menuConfig" :key="'/playground/' + menu.path">
        <span slot="title">
          <a-icon :type="menu.icon" />
          <span>{{ menu.name }}</span>
        </span>
        <a-menu-item
          v-for="submenu in menu.children"
          :key="`/playground/${menu.path}/${submenu.path}`"
          :title="submenu.name"
          >{{ submenu.name }}</a-menu-item
        >
      </a-sub-menu>
      <a-menu-item :key="'/playground/ispf'"
        ><a-icon type="menu" /><span>ISPF</span></a-menu-item
      >
    </a-menu>
  </div>
</template>

<script>
export default {
  name: "SidebarMenu",
  data() {
    return {
      selectedKeys: [this.$route.path],
      defaultOpenKeys: [
        this.$route.path
          .split("/")
          .slice(0, -1)
          .join("/")
      ],
      menuConfig: [
        {
          name: "安全管理（RACF）",
          path: "racf",
          icon: "safety",
          children: [
            { name: "实验介绍", path: "intro" },
            { name: "实验一：创建组RACF实验", path: "lab1" },
            { name: "实验二：用户管理RACF实验", path: "lab2" },
            { name: "实验三：分散式RACF安全管理实验", path: "lab3" },
            { name: "实验四：数据集保护RACF实验I", path: "lab4" },
            { name: "实验五：数据集保护RACF实验II", path: "lab5" },
            { name: "实验六：保护TSO资源", path: "lab6" },
            { name: "实验七：使用JCL执行RACF命令", path: "lab7" }
          ]
        },
        {
          name: "存储管理（SMS）",
          path: "sms",
          icon: "hdd",
          children: [
            { name: "实验介绍", path: "intro" },
            { name: "实验一：初次接触 ISMF 实验", path: "lab1" },
            { name: "实验二：使用 ISMF 命令实验（可选）", path: "lab2" },
            {
              name: "实验三：提交实验：创建一个简单的 SMS 环境实验",
              path: "lab3"
            },
            { name: "实验四：盘卷和数据集 SMS 转换实验", path: "lab4" },
            { name: "实验五：SMS 系统命令实验（可选）", path: "lab5" },
            { name: "实验六：空间管理实验", path: "lab6" },
            { name: "实验七：复制/移动/删除数据集实验", path: "lab7" }
          ]
        },
        {
          name: "目录管理（Catalog）",
          path: "catalog",
          icon: "inbox",
          children: [
            { name: "实验介绍", path: "intro" },
            { name: "实验一：创建用户编目（User Catalog）实验", path: "lab1" },
            { name: "实验二：创建别名实验", path: "lab2" },
            { name: "实验三：查看数据集所属的Catalog实验", path: "lab3" },
            { name: "实验四：连接和断开Catalog实验", path: "lab4" },
            { name: "实验五：查看VVDS内容实验", path: "lab5" },
            { name: "实验六：查看VTOC内容实验", path: "lab6" },
            { name: "实验七：查看所有别名和用户编目实验", path: "lab7" },
            { name: "实验八：提交实验报告", path: "lab8" },
            { name: "实验九：删除用户编目（User Catalog）实验", path: "lab9" }
          ]
        },
        {
          name: "系统命令（MVS）",
          path: "mvs",
          icon: "code",
          children: [
            { name: "实验介绍", path: "intro" },
            { name: "实验一：系统命令执行", path: "lab1" }
          ]
        },
        {
          name: "脚本语言（REXX）",
          path: "rexx",
          icon: "snippets",
          children: [
            { name: "实验介绍", path: "intro" },
            { name: "实验一：REXX 基础实验", path: "lab1" },
            { name: "实验二：REXX 函数实验", path: "lab2" },
            { name: "实验三：REXX 程序间调用实验 I", path: "lab3" },
            { name: "实验四：REXX 程序间调用实验 II", path: "lab4" },
            { name: "实验五：构建并提交 JCL 实验", path: "lab5" },
            { name: "实验六：显示数据集信息实验", path: "lab6" },
            { name: "实验七：综合实验", path: "lab7" }
          ]
        },
        {
          name: "主机软件安装（SMP/E）",
          path: "smp",
          icon: "appstore",
          children: [
            { name: "实验介绍", path: "intro" },
            { name: "实验一：SMP/E 准备工作", path: "lab1" },
            { name: "实验二：RECEIVE 实验", path: "lab2" },
            { name: "实验三：创建分配库(DLib)和目标库(TLib)", path: "lab3" },
            { name: "实验四：定义DDDEF实验", path: "lab4" },
            { name: "实验五：APPLY 实验", path: "lab5" },
            { name: "实验六：ACCEPT 实验", path: "lab6" },
            { name: "实验七：提交实验报告", path: "lab7" },
            { name: "实验八：其它SYSMOD 安装（可选）", path: "lab8" },
            { name: "实验九：REJECT实验（可选）", path: "lab9" }
          ]
        }
      ]
    };
  },
  computed: {
    path() {
      return this.$route.path;
    }
  },
  watch: {
    path(v) {
      this.selectedKeys = [v];
    }
  },
  methods: {
    handleMenuClick(e) {
      this.$router.push(e.key);
    }
  }
};
</script>

<style scoped>
.menu-container {
  height: 92%;
  overflow: auto;
}
</style>
