<template>
  <div class="dataset-references">
    <div class="heading2 mb-8">
      Metrics
    </div>
    <div class="body1 row" v-loading="loadingMetrics">
      <div class="col">
        <div>
          Citations: <span class="label4">{{ citations }}</span>
        </div>
        <div>
          Downloads: <span class="label4">{{ fullDownloads }}</span>
        </div>
        <div v-if="protocols?.length > 0">
          Protocols:
          <sparc-tooltip placement="left-center">
            <template #item>
              <svgo-icon-help class="help-icon"/>
            </template>
            <template #data>
              Number of views and forks are only available for protocols hosted on <a href="https://protocols.io" target="_blank">Protocols.io</a>
            </template>
          </sparc-tooltip>
        </div>
        <div v-for="doi in protocols" :key="doi">
          <div class="ml-32">
            Protocol Link: <a :href="'https://doi.org/' + doi" target="_blank">https://doi.org/{{ doi }}</a>
          </div>
          <template v-if="isProtocolsIo(doi)">
            <div class="ml-32">
              Protocol Views: <span class="label4">{{ getProtocolViews(doi) }}</span>
            </div>
            <div class="ml-32">
              Number of Protocol Forks:
            </div>
            <div class="ml-64">
              Private: <span class="label4">{{ getProtocolPrivateForks(doi) }}</span>
            </div>
            <div class="ml-64">
              Public: <span class="label4">{{ getProtocolPublicForks(doi) }}</span>
            </div>
          </template>
        </div>
      </div>
      <div v-if="scholarData" class="col ml-16">
        <div>
          Dataset Index: <span class="label4">{{ scholarData.latestDIndex?.score ?? 'N/A' }}</span>
        </div>
        <div>
          Mentions: <span class="label4">{{ scholarData.totalMentions ?? 'N/A' }}</span>
        </div>
        <div v-if="scholarData.fujiScore">
          FAIR Score: <span class="label4">{{ scholarData.fujiScore.score ?? 'N/A' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { pathOr } from 'ramda'

const PROTOCOLS_IO_PREFIX = '10.17504/'

const protocolsMap = ref({})
const scholarData = ref(null)
const loadingMetrics = ref(true)

const props = defineProps({
  protocols: Array,
  citations: Number,
  fullDownloads: Number,
  datasetDoi: String
})
const { protocols, datasetDoi } = toRefs(props)

const config = useRuntimeConfig()
const { $axios } = useNuxtApp()

const isProtocolsIo = (doi) => doi?.startsWith(PROTOCOLS_IO_PREFIX)

const toSuffix = (doi) => doi.slice(PROTOCOLS_IO_PREFIX.length)

async function fetchWithRetry(axios, url, retries = 3, delay = 500) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${config.public.PROTOCOLS_IO_TOKEN}` }
      })
      return pathOr(null, ['payload', 'stats'], data)
    } catch (err) {
      if (attempt < retries) {
        await new Promise((res) => setTimeout(res, delay))
      } else {
        console.error(`Failed after ${retries} retries: ${url}`)
        return null
      }
    }
  }
}

async function fetchProtocolsWithLimit(dois, concurrency = 5) {
  const protocolsIoDois = (dois ?? []).filter(isProtocolsIo)
  if (protocolsIoDois.length === 0) return {}

  const results = {}
  const queue = [...protocolsIoDois]

  const workers = Array.from({ length: concurrency }, async () => {
    while (queue.length > 0) {
      const doi = queue.shift()
      const suffix = toSuffix(doi)
      const url = `${config.public.PROTOCOLS_IO_HOST}/api/v4/protocols/${suffix}`
      results[doi] = await fetchWithRetry($axios, url)
    }
  })

  await Promise.all(workers)
  return results
}

async function fetchScholarData(doi) {
  if (!doi) return null
  try {
    const { data } = await $axios.get(
      `/api/scholardata?doi=${encodeURIComponent(doi)}`
    )
    return data
  } catch {
    return null
  }
}

[protocolsMap.value, scholarData.value] = await Promise.all([
  fetchProtocolsWithLimit(protocols?.value, 5),
  fetchScholarData(datasetDoi?.value)
])

loadingMetrics.value = false

const getProtocolViews = (doi) =>
  pathOr('N/A', [doi, 'number_of_views'], protocolsMap.value)

const getProtocolPrivateForks = (doi) =>
  pathOr('N/A', [doi, 'number_of_forks', 'private'], protocolsMap.value)

const getProtocolPublicForks = (doi) =>
  pathOr('N/A', [doi, 'number_of_forks', 'public'], protocolsMap.value)
</script>

<style lang="scss" scoped>
@import 'sparc-design-system-components-2/src/assets/_variables.scss';
.help-icon {
  color: $purple;
  height: 1.5rem;
  width: 1.5rem;
}
.row {
  display: flex;
  flex-direction: row;
}
.col {
  display: flex;
  flex-direction: column;
}
</style>
