<template>
  <div class="page-container">
    <breadcrumb :breadcrumb="breadcrumb" :title=title />
    <page-hero class="py-24">
      <div class="page-hero-content">
        <div>
          <h1>SPARC Dashboard</h1>
          <p>
            Explore an evolving collection of interactive widgets designed to analyze and interpret data about the vagus nerve. This platform brings together visualizations, metrics, and insights to support research and discovery. Data publication is an ongoing effort, with new findings and resources continuously being added as the SPARC project advances.
          </p>
        </div>
      </div>
    </page-hero>
    <div class="beta-tooltip px-32 py-4">
      <sparc-tooltip
        placement="left-center"
        content="Under active development"
      >
        <template #item>
          <div class="beta-tag"><el-icon class="beta-icon"><WarningFilled /></el-icon>Beta</div>
        </template>
      </sparc-tooltip>
    </div>
    <client-only>
      <SparcDashboard class="px-32" :dBItems="dBItems" :options="dashboardOptions"/>
    </client-only>
  </div>
</template>
<script>
import algoliasearch from 'algoliasearch'
export default {
  name: 'SparcDashboardPage',
    setup() {
    const config = useRuntimeConfig()
    const AlgoliaClient = algoliasearch(
      config.public.ALGOLIA_APP_ID,
      config.public.ALGOLIA_API_KEY
    )
    return { config, AlgoliaClient }
  },
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
      ],
      dashboardOptions :{
        services:{
          AlgoliaClient: this.AlgoliaClient,
          AlgoliaConfig:{
            apiKey:this.config.public.ALGOLIA_API_KEY,
            appID:this.config.public.ALGOLIA_APP_ID,
            indexName:this.config.public.ALGOLIA_INDEX_VERSION_PUBLISHED_TIME_DESC
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.page-container {
  background-color: #f6fcff;
}
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

.page-hero-content {
  display: flex;
  align-items: center;

  @media screen and (max-width: 64rem) {
    display: block;
  }
}
.beta-tooltip {
  display: flex;
  width: fit-content;
}
.beta-tag {
  color: #ff8400;
  display: flex;
  width: fit-content;
}
.beta-icon {
  font-size: 25px;
}
</style>
