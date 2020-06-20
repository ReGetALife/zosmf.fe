<template>
  <div class="detail-page">
    <h1>{{ $route.params.lab | formatName }}</h1>
    <a-popconfirm
      title="确认发布成绩？"
      placement="left"
      @confirm="handOutScores"
      okText="确认"
      cancelText="取消"
    >
      <a-button class="hand-out-score" type="primary">
        <a-icon type="notification" />发布成绩
      </a-button>
    </a-popconfirm>
    <a-spin size="large" :spinning="loading">
      <a-icon slot="indicator" type="loading-3-quarters" :spin="true" />
      <a-table
        :columns="columns"
        :dataSource="data"
        :rowKey="record => record.uid"
      >
        <span slot="status" slot-scope="text">
          <!-- 1 已批阅; 0 未批阅 -->
          <a-badge :status="text.status ? 'success' : 'default'" />
          {{ text.status ? "已批阅" : "未批阅" }}
        </span>
        <span slot="action" slot-scope="record">
          <span v-if="record.status">
            <a-button type="primary" icon="eye" @click="review(record)"
              >查看</a-button
            >
          </span>
          <span v-else>
            <a-button type="primary" icon="edit" @click="review(record)"
              >批阅</a-button
            >
          </span>
          <a-divider type="vertical" />
          <a-button icon="download" @click="downloadPDF(record)">下载</a-button>
        </span>
      </a-table>
    </a-spin>
    <a :href="url" :download="disposition" ref="downloadHref" />
  </div>
</template>

<script>
import { mapMutations } from "vuex";

const columns = [
  { title: "TSO ID", dataIndex: "uid" },
  { title: "实验状态", key: "status", scopedSlots: { customRender: "status" } },
  { title: "评分", dataIndex: "score" },
  { title: "评语", dataIndex: "comment" },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];
export default {
  data() {
    return {
      data: [],
      loading: false,
      columns,
      numPages: undefined,
      disposition: "",
      url: ""
    };
  },
  computed: {
    lab() {
      return this.$route.params.lab.toUpperCase();
    }
  },
  created() {
    this.fetch();
  },
  mounted() {},
  watch: {
    $route() {
      this.fetch();
    }
  },
  methods: {
    ...mapMutations("report", ["save"]),
    fetch() {
      this.loading = true;
      this.$http
        .get(`/api/db/submitted`, {
          params: {
            lab: this.lab.toUpperCase()
          }
        })
        .then(data => {
          this.loading = false;
          this.data = data.body;
        });
    },
    getPDF(record) {
      return new Promise(resolve => {
        this.$http
          .post(
            `/api/db/downloadPDF`,
            {
              uid: record.uid,
              lab: this.lab.toUpperCase()
            },
            { responseType: "arraybuffer" }
          )
          .then(res => {
            this.disposition = res.headers.map["content-disposition"][0]
              .split("=")[1]
              .replace(/"/g, "");
            let binaryData = [];
            binaryData.push(res.body);
            this.url = window.URL.createObjectURL(
              new Blob(binaryData, {
                type: "application/pdf"
              })
            );
            this.save({
              ...record,
              lab: this.lab,
              url: this.url
            });
            resolve();
          });
      });
    },
    review(record) {
      this.getPDF(record).then(() => {
        this.$router.push(
          `${this.lab.toLowerCase()}/${record.uid.toLowerCase()}`
        );
      });
    },
    downloadPDF(record) {
      this.getPDF(record).then(() => {
        this.$refs.downloadHref.click();
      });
    },
    handOutScores() {
      this.$http
        .post("/api/db/reScore", {
          lab: this.lab.toUpperCase()
        })
        .then(() => {
          this.$message.success("发布成功");
        })
        .catch(() => {
          this.$message.error("发布失败");
        });
    }
  },
  filters: {
    formatName(name) {
      let title = "";
      switch (name) {
        case "racf":
          title = "安全管理（RACF）";
          break;
        case "sms":
          title = "存储管理（SMS）";
          break;
        case "catalog":
          title = "目录管理（Catalog）";
          break;
        case "mvs":
          title = "系统命令（MVS）";
          break;
        case "rexx":
          title = "脚本语言（REXX）";
          break;
        case "smp" :
          title = "主机软件安装（SMP/E）";
          break;
        default:
          break;
      }
      return title;
    }
  }
};
</script>

<style lang="scss" scoped>
.detail-page {
  position: relative;
  .hand-out-score {
    position: absolute;
    right: 0;
    top: 8px;
  }
}
</style>
