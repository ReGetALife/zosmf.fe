<template>
  <div class="teacher-home">
    <h1>实验总览</h1>
    <a-spin size="large" :spinning="isLoading">
      <a-icon slot="indicator" type="loading-3-quarters" :spin="true" />
      <a-list class="overview-list" itemLayout="horizontal" :dataSource="data">
        <a-list-item slot="renderItem" slot-scope="item">
          <a-button
            slot="actions"
            type="primary"
            @click="$router.push(`/administration/${item.path}`)"
            >查看详情</a-button
          >
          <a-list-item-meta :description="`已有 ${item.submit} 人提交`">
            <a slot="title" :href="`/administration/${item.path}`">
              {{ item.name }}
            </a>
          </a-list-item-meta>
        </a-list-item>
      </a-list>
    </a-spin>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoading: true,
      data: [
        {
          name: "安全管理（RACF）",
          path: "racf",
          submit: "x",
          review: 5
        },
        {
          name: "存储管理（SMS）",
          path: "sms",
          submit: "x",
          review: 5
        },
        {
          name: "目录管理（Catalog）",
          path: "catalog",
          submit: "x",
          review: 5
        },
        {
          name: "系统命令（MVS）",
          path: "mvs",
          submit: "x",
          review: 5
        },
        {
          name: "脚本语言（REXX）",
          path: "rexx",
          submit: "x",
          review: 5
        },
        {
          name: "主机软件安装（SMP/E）",
          path: "smp",
          submit: "x",
          review: 5
        }
      ]
    };
  },
  async created() {
    this.isLoading = true;
    await this.data.map(async lab => {
      const res = await this.$http.get(`/api/db/submitted`, {
        params: {
          lab: lab.path.toUpperCase()
        }
      });
      if (res.status === 200) {
        lab.submit = res.body.length;
      }
    });
    this.isLoading = false;
  }
};
</script>
