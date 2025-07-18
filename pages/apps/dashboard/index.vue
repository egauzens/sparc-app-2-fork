<template>
  <div>
    <breadcrumb :breadcrumb="breadcrumb" :title=title />
    <client-only>
      <SparcDashboard :dBItems="dBItems"/>
    </client-only>
  </div>
</template>
<script>
export default {
  name: 'SparcDashboardPage',
  data() {
    return {
      title: 'SPARC Dashboard',
      breadcrumb: [
        {
          label: 'Home',
          to: {
            name: 'index'
          }
        },
        {
          to: {
            name: 'apps',
          },
          label: 'SPARC Apps',
        }
      ],
      dBItems:[{ id: "SubjectSelector-1",component: "SubjectSelector",componentName: "Select Subject",h:2, w:5, x:0, y:0 },
        { id: "BiolucidaViewer-2", componentName:"MBF Viewer", component:"BiolucidaViewer", h:11, w:7, x:5, y:0},
        { id: "FlatmapViewer-3",component: "FlatmapViewer",componentName: "Flatmap Viewer",h: 8, w: 2, x: 0, y: 2},
        { id: "ImageSelector-4", component:"ImageSelector", componentName:"Image Selector", h:8, w:3, x:2, y:2},
        { id: "ODBGraph-5", component: "QDBGraph", componentName: "Graph", h: 3, w: 5, x: 0, y: 10, }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
.dashboard-app{
    --el-color-primary: #8300bf;
    --el-color-primary-light-3: #fbfdff;
    --el-color-primary-dark-2: #24245b;
    --color:#243d8e;
    --el-dialog-width: 90%;
    --dash-text-dark:black;

    .grid-stack-item-content{
        background-color: #ebedf0;
        border:1px solid #909399 !important;
        border-radius:.2rem !important;

        .widget-name{
            padding-left:10px;
        }
    }
    .filter-wrapper div{
        padding-right:4px;
    }
  }
</style>
