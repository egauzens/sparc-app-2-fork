<template>
  <div class="page-data">
    <div class="home-hero">
      <div class="hero-inner">
        <div class="hero-eyebrow">Open data from molecule to organ</div>
        <!-- eslint-disable vue/no-v-html -->
        <h1 class="hero-h1" v-if="heroHeading">{{ heroHeading }}</h1>
        <div class="hero-sub" v-html="parseMarkdown(heroCopy)" />
        <div class="hero-btns">
          <nuxt-link to="/data?type=dataset" class="hero-btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="14" height="14">
              <ellipse cx="12" cy="6" rx="8" ry="3"/>
              <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6"/>
              <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6"/>
            </svg>
            Access
          </nuxt-link>
          <nuxt-link to="/share-data" class="hero-btn-ghost">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="14" height="14">
              <path d="M12 3v12m0-12l-4 4m4-4l4 4"/>
              <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>
            </svg>
            Contribute
          </nuxt-link>
        </div>
      </div>
      <div class="hero-image-wrap">
        <img
          src="https://images.ctfassets.net/6bya4tyw8399/1vTvDLvi5CPAy9vqI7UjrB/7fa18b8c0fe2dc2f4a739b24e9dfb884/transparent-hero.png"
          alt="SPARC nervous system infographic"
          class="hero-image"
        />
      </div>
    </div>

    <!-- Interactive Map Section -->
    <div class="map-section">
      <div class="map-layout">
        <div class="map-card">
        <nuxt-link :to="currentMapSpecies.href" class="map-image-link" :aria-label="`Open ${currentMapSpecies.label} flatmap`">
          <img
            :src="currentMapSpecies.image"
            :alt="`${currentMapSpecies.label} anatomical connectivity map`"
            class="map-img"
          />
          <div class="map-open-hint">
            Click to open full map
            <svg viewBox="0 0 12 12" width="11" height="11" fill="none">
              <path d="M2 10L10 2M10 2H4M10 2v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="map-species-overlay" @click.prevent>
            <button
              v-for="s in mapSpecies"
              :key="s.id"
              class="species-tab"
              :class="{ active: selectedSpecies === s.id }"
              @click.prevent="selectedSpecies = s.id"
            >{{ s.label }}</button>
          </div>
        </nuxt-link>
        </div>
        <div class="map-text">
          <div class="section-kicker">Interactive map</div>
          <h2 class="section-h2">Navigate the body's wiring diagram</h2>
          <p class="section-sub">Click any anatomical structure to surface linked datasets and models. Built on SCKAN — every connection grounded in published science.</p>
        </div>
      </div>
    </div>

    <!-- Discover by facet section -->
    <div class="discover-section">
      <div class="discover-header">
        <div class="section-kicker">Explore the catalog</div>
        <h2 class="section-h2">Discover by facet</h2>
        <p class="section-sub">Browse datasets by experimental approach, anatomical structure, or species.</p>
        <div class="facet-tabs">
          <button
            v-for="tab in facetTabConfig"
            :key="tab.id"
            class="facet-tab-pill"
            :class="{ active: activeFacetTab === tab.id }"
            @click="activeFacetTab = tab.id"
          >{{ tab.label }}</button>
        </div>
      </div>
      <div class="facet-charts-container">
        <div
          v-for="tab in facetTabConfig"
          :key="tab.id"
          class="facet-chart"
          :class="{ 'facet-chart--hidden': activeFacetTab !== tab.id }"
        >
          <div
            v-for="item in facetDataByTab[tab.id]"
            :key="item.label"
            class="facet-bar-row"
            role="button"
            tabindex="0"
            @click="navigateToFacet(item.label)"
            @keydown.enter="navigateToFacet(item.label)"
          >
            <div class="facet-bar-label">{{ item.label }}</div>
            <div class="facet-bar-track">
              <div class="facet-bar-fill" :style="{ width: item.pct + '%' }"></div>
            </div>
            <div class="facet-bar-count">{{ item.count.toLocaleString() }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Explore the tools section -->
    <div class="tools-section">
      <div class="tools-layout">
      <div class="tools-left">
      <div class="tools-nav">
        <button
          v-for="tab in toolTabs"
          :key="tab.id"
          class="tool-tab"
          :class="{ active: activeToolTab === tab.id }"
          @click="activeToolTab = tab.id"
        >
          <span class="tool-tab-icon" v-html="tab.icon" aria-hidden="true"></span>
          <span class="tool-tab-label">{{ tab.label }}</span>
        </button>
      </div>
      <div class="tools-previews">
        <!-- Gallery -->
        <div class="tools-preview" :class="{ 'tools-preview--hidden': activeToolTab !== 'gallery' }">
          <div class="preview-media"></div>
          <div class="preview-text">
            <div class="section-kicker">Image gallery</div>
            <h3 class="preview-heading">Curated imagery</h3>
            <p class="preview-desc">Featured microscopy and atlas imagery from across SPARC datasets — confocal, smFISH, tracing, and more. Curated by SPARC editors. Each image links to its source dataset. Filter by organ, species, or modality.</p>
            <nuxt-link to="/apps" class="preview-btn">Browse full gallery <svg viewBox="0 0 12 12" width="11" height="11" fill="none" style="margin-left:6px;flex-shrink:0"><path d="M2 10L10 2M10 2H4M10 2v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></nuxt-link>
          </div>
        </div>

        <!-- SCKAN NLI -->
        <div class="tools-preview" :class="{ 'tools-preview--hidden': activeToolTab !== 'nli' }">
          <div class="preview-media"></div>
          <div class="preview-text">
            <div class="section-kicker">SCKAN NLI</div>
            <h3 class="preview-heading">Ask questions in plain language</h3>
            <p class="preview-desc">Query SPARC's autonomic connectivity knowledge base in natural language. Ask about neural pathways or datasets — every answer grounded in published science.</p>
            <a href="https://sparc.science/tools-and-resources/4LkLiH5s4FV0LVJd3htsMN" target="_blank" rel="noopener" class="preview-btn">Open SCKAN NLI <svg viewBox="0 0 12 12" width="11" height="11" fill="none" style="margin-left:6px;flex-shrink:0"><path d="M2 10L10 2M10 2H4M10 2v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
          </div>
        </div>

        <!-- Cell Explorer -->
        <div class="tools-preview" :class="{ 'tools-preview--hidden': activeToolTab !== 'cell' }">
          <div class="preview-media"></div>
          <div class="preview-text">
            <div class="section-kicker">Cell explorer</div>
            <h3 class="preview-heading">Cell type exploration</h3>
            <p class="preview-desc">Explore transcriptomic cell types across SPARC datasets using interactive UMAP visualizations. Gene expression profiles grounded in SPARC's unified metadata.</p>
            <a href="https://sparc.science/tools-and-resources" target="_blank" rel="noopener" class="preview-btn">Open Cell Explorer <svg viewBox="0 0 12 12" width="11" height="11" fill="none" style="margin-left:6px;flex-shrink:0"><path d="M2 10L10 2M10 2H4M10 2v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
          </div>
        </div>

        <!-- Simulate -->
        <div class="tools-preview" :class="{ 'tools-preview--hidden': activeToolTab !== 'simulate' }">
          <div class="preview-media"></div>
          <div class="preview-text">
            <div class="section-kicker">o²S²PARC</div>
            <h3 class="preview-heading">Simulation and modeling</h3>
            <p class="preview-desc">Run and share computational models in the cloud. Reproduce published simulations or build your own pipelines — no local install required.</p>
            <a href="https://osparc.io" target="_blank" rel="noopener" class="preview-btn">Open Simulate <svg viewBox="0 0 12 12" width="11" height="11" fill="none" style="margin-left:6px;flex-shrink:0"><path d="M2 10L10 2M10 2H4M10 2v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
          </div>
        </div>

        <!-- SCKANNER -->
        <div class="tools-preview" :class="{ 'tools-preview--hidden': activeToolTab !== 'sckanner' }">
          <div class="preview-media"></div>
          <div class="preview-text">
            <div class="section-kicker">SCKANNER</div>
            <h3 class="preview-heading">Tabular connectivity explorer</h3>
            <p class="preview-desc">Browse and validate SPARC connectivity annotations in a structured table. Filter by origin, destination, nerve pathway, and species.</p>
            <a href="https://sparc.science/tools-and-resources" target="_blank" rel="noopener" class="preview-btn">Open SCKANNER <svg viewBox="0 0 12 12" width="11" height="11" fill="none" style="margin-left:6px;flex-shrink:0"><path d="M2 10L10 2M10 2H4M10 2v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
          </div>
        </div>
      </div>
      </div>
      <div class="tools-text">
        <div class="section-kicker">Platform overview</div>
        <h2 class="section-h2">Explore the tools</h2>
        <p class="section-sub">From research images to connectivity queries to running simulations — all grounded in SPARC's unified metadata.</p>
      </div>
      </div>
    </div>
  </div>

  <!-- Find your path section -->
  <div class="path-section">
    <div class="path-header">
      <div class="section-kicker">Get started</div>
      <h2 class="section-h2">Find your path</h2>
    </div>
    <div class="path-cards">

      <div class="path-card">
        <div class="path-card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="28" height="28">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
        </div>
        <div class="path-card-kicker">Researchers</div>
        <h3 class="path-card-heading">Find data &amp; models</h3>
        <p class="path-card-desc">Search hundreds of open datasets, models, and simulations spanning the autonomic nervous system. Filter by organ, species, modality, and more.</p>
        <nuxt-link to="/data?type=dataset" class="path-card-btn">Browse datasets</nuxt-link>
      </div>

      <div class="path-card">
        <div class="path-card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="28" height="28">
            <path d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15m-6.8-1.5v6m0 0H9m4 0h4"/><path d="M3 12h18"/>
          </svg>
        </div>
        <div class="path-card-kicker">Analysts</div>
        <h3 class="path-card-heading">Use SPARC data</h3>
        <p class="path-card-desc">Programmatic access to datasets, models, metadata, and connectivity knowledge via APIs.</p>
        <a href="https://docs.sparc.science/docs/sparc-apis-and-open-access-code" target="_blank" rel="noopener" class="path-card-btn">Explore Docs</a>
      </div>

      <div class="path-card">
        <div class="path-card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="28" height="28">
            <path d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"/>
          </svg>
        </div>
        <div class="path-card-kicker">Contributors</div>
        <h3 class="path-card-heading">Share your work</h3>
        <p class="path-card-desc">Submit datasets, protocols, and tools to the SPARC repository. Reach a global community of autonomic nervous system researchers and maximize the impact of your science.</p>
        <nuxt-link to="/share-data" class="path-card-btn">Submit to SPARC</nuxt-link>
      </div>

      <div class="path-card">
        <div class="path-card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="28" height="28">
            <path d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6V7.5Z"/>
          </svg>
        </div>
        <div class="path-card-kicker">Community</div>
        <h3 class="path-card-heading">Latest news</h3>
        <p class="path-card-desc">Stay up to date with the latest from the SPARC program — new datasets, tool launches, consortium updates, funding opportunities, and community events.</p>
        <nuxt-link to="/news-and-events" class="path-card-btn">All news</nuxt-link>
      </div>

    </div>
  </div>

</template>

<script setup>
import { failMessage } from '@/utils/notification-messages'
import thumbHuman from '~/assets/flatmap-thumbnails/human.png'
import thumbRat   from '~/assets/flatmap-thumbnails/rat.png'
import thumbPig   from '~/assets/flatmap-thumbnails/pig.png'
import thumbMouse from '~/assets/flatmap-thumbnails/mouse.png'
import { parseMarkdown } from '@/utils/formattingUtils.js'
import getHomepageFields from '@/utils/homepageFields'
import { useMainStore } from '../store/index.js'
import { pathOr } from 'ramda'
import { useRuntimeConfig, useAsyncData } from '#app'

const config = useRuntimeConfig()
const { $contentfulClient, $axios, $algoliaClient } = useNuxtApp()
useHead({
  title: 'SPARC Portal',
  bodyAttrs: { style: 'background: #06060f' },
  meta: [
    {
      hid: 'description',
      name: 'description',
      content:
        'The open community platform for bridging the body and the brain through neuroscience and systems physiology data, computational and spatial modeling, and device design.'
    },
    {
      name: 'og:type',
      content: 'website'
    },
    {
      hid: 'og:title',
      property: 'og:title',
      content: 'SPARC Portal'
    },
    {
      name: "google-site-verification",
      content: `${config.public.GOOGLE_SEARCH_CONSOLE_VERIFICATION_ID}`
    },
    {
      hid: 'og:image',
      property: 'og:image',
      content: 'https://images.ctfassets.net/6bya4tyw8399/7r5WTb92QnHkub8RsExuc1/2ac134de2ddfd65eb6316421df7578f9/sparc-logo-primary.png'
    },
    {
      hid: 'og:image:secure_url', property: 'og:image:secure_url',
      content: 'https://images.ctfassets.net/6bya4tyw8399/7r5WTb92QnHkub8RsExuc1/2ac134de2ddfd65eb6316421df7578f9/sparc-logo-primary.png'
    },
    {
      name: 'og:site_name',
      content: 'SPARC Portal'
    },
    {
      name: 'twitter:card',
      content: 'summary'
    },
    {
      name: 'twitter:site',
      content: '@sparc_science'
    },
    {
      name: 'twitter:title',
      content: 'SPARC Portal'
    },
    {
      name: 'twitter:image',
      content: 'https://images.ctfassets.net/6bya4tyw8399/7r5WTb92QnHkub8RsExuc1/2ac134de2ddfd65eb6316421df7578f9/sparc-logo-primary.png'
    },
    {
      name: 'twitter:description',
      content: 'The open community platform for bridging the body and the brain through neuroscience and systems physiology data, computational and spatial modeling, and device design.'
    }
  ]
})

const { data: homepageData, error: homepageError } = useAsyncData('homepage', async () => {
  return $contentfulClient.getEntry(config.public.ctf_home_page_id);
})

const { data: featuredDatasets, error: featuredDatasetsError } = useAsyncData('featuredDatasets', async () => {
  try {
    const response = await $axios.get(`${config.public.portal_api}/get_featured_dataset`)
    return response.data?.datasets
  } catch {
    const response = await $axios.get(`${config.public.discover_api_host}/datasets/32`)
    return [response.data]
  }
});

const institutionId = computed(() => 
  pathOr(
    undefined,
    ['featuredProject', 'fields', 'institutions', 0, 'sys', 'id'],
    homepageData?.value?.fields
  )
);

const { data: institutionData, error: institutionError } = useAsyncData(
  'institution',
  async () => {
    if (!institutionId.value) return null;
    return $contentfulClient.getEntry(institutionId.value);
  },
  { watch: [institutionId] }
);

const fields = computed(() => {
  if (!homepageData.value) return null;

  let fields = getHomepageFields(homepageData.value?.fields);
  const datasetSectionTitle = homepageData.value?.fields.datasetSectionTitle;

  if (featuredDatasets.value?.length > 0) {
    const featuredDataset = {
      title: featuredDatasets.value[0].name,
      description: featuredDatasets.value[0].description,
      banner: featuredDatasets.value[0].banner,
      id: featuredDatasets.value[0].id,
    }
    fields = { ...fields, featuredDataset, datasetSectionTitle }
  }

  if (institutionData.value) {
    fields.featuredProject.fields.banner = institutionData.value?.fields.logo.fields.file.url;
  }

  return fields;
})

const heroHeading = computed(() => fields.value?.heroHeading)
const heroImage = computed(() => fields.value?.heroImage)
const heroCopy = computed(() => fields.value?.heroCopy)

const router = useRouter()

const { data: algoliaFacetData } = useAsyncData('facets', async () => {
  const algoliaIndex = $algoliaClient.initIndex(config.public.ALGOLIA_INDEX_VERSION_PUBLISHED_TIME_DESC)
  const result = await algoliaIndex.search('', {
    hitsPerPage: 0,
    facets: ['item.modalities.keyword', 'anatomy.organ.category.name', 'organisms.primary.species.name'],
  })
  return result.facets || {}
})

const facetTabConfig = [
  { id: 'modality', label: 'By modality', path: 'item.modalities.keyword' },
  { id: 'organ',    label: 'By organ',    path: 'anatomy.organ.category.name' },
  { id: 'species',  label: 'By species',  path: 'organisms.primary.species.name' },
]

const activeFacetTab = ref('modality')

function buildFacetItems(raw) {
  const items = Object.entries(raw || {})
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15)
  const max = items[0]?.count || 1
  return items.map(item => ({ ...item, pct: Math.round((item.count / max) * 100) }))
}

const facetDataByTab = computed(() => {
  const data = algoliaFacetData.value || {}
  return Object.fromEntries(
    facetTabConfig.map(tab => [tab.id, buildFacetItems(data[tab.path])])
  )
})

function navigateToFacet(label) {
  router.push({ path: '/data', query: { type: 'dataset', selectedFacetIds: label } })
}

const toolTabs = [
  {
    id: 'gallery', label: 'Gallery',
    icon: `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.2"/><rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.2"/><rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.2"/><rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.2"/></svg>`,
  },
  {
    id: 'nli', label: 'SCKAN NLI',
    icon: `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H9l-3 2v-2H3a1 1 0 0 1-1-1V3Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M5 6h6M5 8.5h3.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`,
  },
  {
    id: 'cell', label: 'Cell explorer',
    icon: `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="4" cy="11" r="1.5" stroke="currentColor" stroke-width="1.2"/><circle cx="8" cy="5" r="1.5" stroke="currentColor" stroke-width="1.2"/><circle cx="12" cy="9" r="1.5" stroke="currentColor" stroke-width="1.2"/><circle cx="6" cy="8" r="1" stroke="currentColor" stroke-width="1.2"/><circle cx="10" cy="12" r="1" stroke="currentColor" stroke-width="1.2"/><circle cx="3" cy="5" r="1" stroke="currentColor" stroke-width="1.2"/></svg>`,
  },
  {
    id: 'simulate', label: 'Simulate',
    icon: `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 11.5 Q3 9 5 10 T8 7 T11 5 T15 6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" fill="none"/><path d="M1 13 Q4 11.5 6 12 T10 10 T15 9.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.5"/></svg>`,
  },
  {
    id: 'sckanner', label: 'SCKANNER',
    icon: `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="3" width="14" height="2" rx="0.5" stroke="currentColor" stroke-width="1.2"/><rect x="1" y="7" width="14" height="2" rx="0.5" stroke="currentColor" stroke-width="1.2"/><rect x="1" y="11" width="14" height="2" rx="0.5" stroke="currentColor" stroke-width="1.2"/></svg>`,
  },
]
const activeToolTab = ref('gallery')


const mapSpecies = [
  { id: 'human', label: 'Human', href: '/apps/maps?type=ac&taxon=NCBITaxon:9606',  accent: '#7733bb', image: thumbHuman },
  { id: 'rat',   label: 'Rat',   href: '/apps/maps?type=ac&taxon=NCBITaxon:10114', accent: '#2a9a6a', image: thumbRat },
  { id: 'pig',   label: 'Pig',   href: '/apps/maps?type=ac&taxon=NCBITaxon:9823',  accent: '#4466cc', image: thumbPig },
  { id: 'mouse', label: 'Mouse', href: '/apps/maps?type=ac&taxon=NCBITaxon:10090', accent: '#cc6644', image: thumbMouse },
]
const selectedSpecies = ref('human')
const currentMapSpecies = computed(() => mapSpecies.find(s => s.id === selectedSpecies.value) ?? mapSpecies[0])

if (homepageError.value) {
  console.error(homepageError.value)
  failMessage("Some services are temporarily unavailable, which may cause certain pages to load incompletely.")
}
  
const { profileComplete, userProfile } = storeToRefs(useMainStore)

watch(
  () => profileComplete?.value, (newVal) => {
    if (userProfile?.value && !newVal) {
      // Redirect to the welcome page if profile is incomplete
      navigateTo('/welcome');
    }
  },
  { immediate: true }
)

// When trying to do federated sign in using a middleware (like we do for sign out), Cognito's callback would only
// execute client-side (after the middleware had already redirected to the new page) causing it to overwrite the 
// previous redirect. This issue was supposed to be addressed by https://github.com/aws-amplify/amplify-js/pull/3588, 
// but attempting to handle dynamic routing after amplify federated sign in via a custom state hook as suggested 
// here: https://github.com/aws-amplify/amplify-js/issues/3125#issuecomment-814265328 did not work
onBeforeMount(() => {
  const signInRedirectCookie = useCookie('sign-in-redirect-url');
  if (signInRedirectCookie.value) {
    const signInRedirectUrl = signInRedirectCookie.value;
    signInRedirectCookie.value = null;
    return navigateTo(signInRedirectUrl)
  }
});
</script>

<style lang="scss" scoped>
@import 'sparc-design-system-components-2/src/assets/_variables.scss';
.page-data {
  background-color: #06060f;
}
.secondary-background {
  background-color: $background;
}

hr {
  margin: 0;
  padding: 0;
  border-top: none;
  border-color: $lineColor1;
}

/* ── Hero ── */
.home-hero {
  background: #06060f;
  padding: 4rem 2rem 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.hero-inner {
  position: relative;
  flex: 1;
  min-width: 0;
  max-width: 800px;
}

.hero-image-wrap {
  opacity: 0.7;
  flex-shrink: 0;
  mask-image:
    linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%),
    linear-gradient(to right,  transparent 0%, black 18%, black 100%);
  mask-composite: intersect;
  -webkit-mask-image:
    linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%),
    linear-gradient(to right,  transparent 0%, black 18%, black 100%);
  -webkit-mask-composite: source-in;
  @media (max-width: 1024px) {
    width: 320px;
  }
  @media (max-width: 768px) {
    width: 100%;
    mask-image: linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%);
  }
}

.hero-image {
  width: auto;
  max-height: 367px;
  display: block;
}

.hero-eyebrow {
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #b44fff;
  margin-bottom: 0.9rem;
  font-weight: 500;
}

.hero-h1 {
  font-size: 42px;
  font-weight: 500;
  line-height: 1.1;
  color: #fff;
  margin-bottom: 0.9rem;
  @media (max-width: 768px) {
    font-size: 30px;
  }
}

.hero-sub {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.75;
  margin-bottom: 1.75rem;
  :deep(p) {
    margin: 0;
  }
}

.hero-btns {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.hero-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #8300bf;
  color: #fff;
  font-size: 13px;
  border-radius: 8px;
  padding: 9px 18px;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.15s;
  &:hover {
    background: #9a00de;
    color: #fff;
  }
}

.hero-btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  border-radius: 8px;
  padding: 9px 18px;
  border: 0.5px solid rgba(255, 255, 255, 0.18);
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #fff;
  }
}

/* ── Discover by facet ── */
.discover-section {
  background: #06060f;
  padding: 4rem 2rem;
  border-top: 0.5px solid rgba(255, 255, 255, 0.06);
  display: flex;
  gap: 3rem;
  align-items: flex-start;
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 1.5rem;
  }
}

.discover-header {
  width: 280px;
  flex-shrink: 0;
  @media (max-width: 900px) {
    width: 100%;
  }
}

.facet-tabs {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 1.25rem;
}

.facet-tab-pill {
  display: inline-block;
  width: fit-content;
  font-size: 12px;
  font-weight: 500;
  padding: 5px 16px;
  border-radius: 20px;
  border: 0.5px solid rgba(255, 255, 255, 0.14);
  background: transparent;
  color: rgba(255, 255, 255, 0.45);
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
  text-align: left;
  &:hover {
    color: rgba(255, 255, 255, 0.8);
    border-color: rgba(255, 255, 255, 0.3);
  }
  &.active {
    background: rgba(131, 0, 191, 0.25);
    color: #d080ff;
    border-color: rgba(131, 0, 191, 0.5);
  }
}

.facet-charts-container {
  flex: 1;
  min-width: 0;
  display: grid;
  grid-template-columns: 1fr;
}

.facet-chart {
  grid-column: 1;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.facet-chart--hidden {
  visibility: hidden;
  pointer-events: none;
}

.facet-bar-row {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  border-radius: 6px;
  padding: 4px 6px;
  transition: background 0.12s;
  &:hover {
    background: rgba(255, 255, 255, 0.04);
    .facet-bar-fill {
      opacity: 0.9;
    }
  }
  &:focus-visible {
    outline: 1px solid rgba(131, 0, 191, 0.7);
  }
}

.facet-bar-label {
  width: 150px;
  flex-shrink: 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  @media (max-width: 600px) {
    width: 110px;
    font-size: 11px;
  }
}

.facet-bar-track {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 3px;
  overflow: hidden;
}

.facet-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #5500aa, #8300bf);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.facet-bar-count {
  width: 48px;
  text-align: right;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.35);
  flex-shrink: 0;
}


/* ── Map section ── */
.map-section {
  background: #06060f;
  padding: 4rem 2rem;
  border-top: 0.5px solid rgba(255, 255, 255, 0.06);
}

.map-layout {
  display: flex;
  gap: 2.5rem;
  align-items: flex-start;
  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.map-card {
  flex: 1;
  min-width: 0;
  border: 0.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  background: #06060f;
}

.map-text {
  width: 260px;
  flex-shrink: 0;
  @media (max-width: 768px) {
    width: 100%;
  }
}

.section-kicker {
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #b44fff;
  font-weight: 500;
  margin-bottom: 0.9rem;
}

.section-h2 {
  font-size: 42px;
  font-weight: 500;
  line-height: 1.1;
  color: #fff;
  margin-bottom: 0.9rem;
  @media (max-width: 768px) {
    font-size: 30px;
  }
}

.section-sub {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.75;
  margin-bottom: 0;
}

.map-species-overlay {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.species-tab {
  font-size: 12px;
  font-weight: 500;
  padding: 5px 16px;
  border-radius: 6px;
  border: 0.5px solid rgba(255, 255, 255, 0.14);
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(4px);
  color: rgba(255, 255, 255, 0.45);
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
  text-align: left;
  &:hover {
    color: rgba(255, 255, 255, 0.8);
    border-color: rgba(255, 255, 255, 0.3);
  }
  &.active {
    background: rgba(131, 0, 191, 0.25);
    color: #d080ff;
    border-color: rgba(131, 0, 191, 0.5);
  }
}

.map-image-link {
  display: block;
  text-decoration: none;
  cursor: pointer;
  position: relative;
  aspect-ratio: 16 / 7;
  overflow: hidden;
  @media (max-width: 768px) {
    aspect-ratio: 4 / 3;
  }
  &:hover .map-open-hint {
    opacity: 1;
  }
}

.map-img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  object-position: center;
  filter: invert(1) hue-rotate(180deg);
  mix-blend-mode: screen;
}


.map-open-hint {
  position: absolute;
  bottom: 12px;
  right: 12px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  background: #8300bf;
  color: #fff;
  border-radius: 8px;
  padding: 9px 18px;
  opacity: 0.85;
  transition: opacity 0.15s;
  pointer-events: none;
}

/* ── Explore the tools ── */
.tools-section {
  background: #06060f;
  padding: 4rem 2rem;
  border-top: 0.5px solid rgba(255, 255, 255, 0.06);
}

.tools-layout {
  display: flex;
  gap: 2.5rem;
  align-items: flex-start;
  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.tools-left {
  flex: 1;
  min-width: 0;
}

.tools-text {
  width: 260px;
  flex-shrink: 0;
  @media (max-width: 768px) {
    width: 100%;
  }
}

.tools-nav {
  display: flex;
  gap: 0;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
  border-bottom: 0.5px solid rgba(255, 255, 255, 0.1);
}

.tool-tab {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 18px 10px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: rgba(255, 255, 255, 0.4);
  font-size: 13px;
  font-family: inherit;
  font-weight: 400;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  margin-bottom: -1px;
  &:hover {
    color: rgba(255, 255, 255, 0.75);
  }
  &.active {
    color: #fff;
    border-bottom-color: #8300bf;
    font-weight: 500;
  }
}

.tool-tab-icon {
  display: flex;
  align-items: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  svg { width: 16px; height: 16px; }
}

.tool-tab-label {
  line-height: 1;
}

.tools-previews {
  display: grid;
  grid-template-columns: 1fr;
}

.tools-preview {
  grid-column: 1;
  grid-row: 1;
  display: flex;
  border: 0.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  background: #0a0a1e;
  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.tools-preview--hidden {
  visibility: hidden;
  pointer-events: none;
}

.preview-media {
  flex: 1;
  min-height: 300px;
  background: #08081e;

  img, video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.preview-text {
  width: 260px;
  flex-shrink: 0;
  order: -1;
  padding: 1.75rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-right: 0.5px solid rgba(255, 255, 255, 0.07);
  @media (max-width: 768px) {
    width: 100%;
    order: 0;
    border-right: none;
    border-bottom: 0.5px solid rgba(255, 255, 255, 0.07);
  }

  .section-kicker {
    margin-bottom: 0.4rem;
  }
}

.preview-heading {
  font-size: 20px;
  font-weight: 500;
  color: #fff;
  line-height: 1.2;
  margin: 0 0 0.75rem;
}

.preview-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.65;
  margin: 0 0 1.25rem;
}

.preview-btn {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  font-size: 13px;
  font-weight: 500;
  padding: 9px 18px;
  border-radius: 8px;
  background: #8300bf;
  border: none;
  color: #fff;
  text-decoration: none;
  transition: background 0.15s;
  &:hover {
    background: #9a00de;
    color: #fff;
  }
}

/* ── Find your path ── */
.path-section {
  background: #06060f;
  padding: 4rem 2rem 5rem;
  border-top: 0.5px solid rgba(255, 255, 255, 0.07);
}

.path-header {
  max-width: 1200px;
  margin: 0 auto 2.5rem;
}

.path-cards {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px)  { grid-template-columns: 1fr; }
}

.path-card {
  background: rgba(255, 255, 255, 0.03);
  border: 0.5px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 1.75rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0;
  transition: border-color 0.15s, background 0.15s;
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(131, 0, 191, 0.35);
  }
}

.path-card-icon {
  color: #8300bf;
  margin-bottom: 1.25rem;
}

.path-card-kicker {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #8300bf;
  margin-bottom: 0.5rem;
}

.path-card-heading {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 0.75rem;
}

.path-card-desc {
  font-size: 13px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.55);
  margin: 0 0 1.5rem;
  flex: 1;
}

.path-card-btn {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  font-size: 13px;
  font-weight: 500;
  padding: 9px 18px;
  border-radius: 8px;
  background: #8300bf;
  border: none;
  color: #fff;
  text-decoration: none;
  transition: background 0.15s;
  margin-top: auto;
  &:hover {
    background: #9a00de;
    color: #fff;
  }
}

</style>
