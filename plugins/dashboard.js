import {installDashboard} from 'sparc-dashboard-beta'
export default defineNuxtPlugin((nuxtApp) => {
    const componentMap = [
      'FlatmapViewer',
      'ImageSelector',
      'BiolucidaViewer',
      'QDBGraph',
      'TextWidget',
      'ScaffoldViewer',
      'SubjectSelector',
      'HealFlatmap'
    ]
    installDashboard(nuxtApp.vueApp, componentMap, nuxtApp.$pinia)
})
