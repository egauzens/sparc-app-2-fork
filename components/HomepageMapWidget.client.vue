<template>
  <div class="homepage-map-widget" ref="widgetRef">
    <MultiFlatmapVuer
      ref="flatmapRef"
      :flatmapAPI="flatmapAPI"
      :sparcAPI="sparcAPI"
      initial="Human Female"
      :disableUI="false"
      :displayMinimap="false"
      :showStarInLegend="false"
      :showLocalSettings="false"
      :showOpenMapButton="false"
      :showPathwayFilter="false"
      :connectivityInfoSidebar="false"
      :annotationSidebar="false"
      style="height: 100%; width: 100%"
      @flatmapChanged="currentSpecies = $event"
    />


    <button class="map-open-hint" @click.stop="openFullMap">
      Open full map
      <svg viewBox="0 0 12 12" width="11" height="11" fill="none">
        <path d="M2 10L10 2M10 2H4M10 2v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { MultiFlatmapVuer } from '@abi-software/flatmapvuer'
import '@abi-software/flatmapvuer/dist/style.css'

const props = defineProps({
  flatmapAPI: { type: String, required: true },
  sparcAPI: { type: String, required: true },
})

const SPECIES_URLS = {
  'Human Female': '/apps/maps?type=flatmap&taxon=NCBITaxon:9606&biologicalSex=PATO:0000383',
  'Human Male':   '/apps/maps?type=flatmap&taxon=NCBITaxon:9606&biologicalSex=PATO:0000384',
  'Rat':          '/apps/maps?type=flatmap&taxon=NCBITaxon:10114',
  'Mouse':        '/apps/maps?type=flatmap&taxon=NCBITaxon:10090',
  'Pig':          '/apps/maps?type=flatmap&taxon=NCBITaxon:9823',
  'Cat':          '/apps/maps?type=flatmap&taxon=NCBITaxon:9685',
}

const widgetRef = ref(null)
const currentSpecies = ref('Human Female')
const mapHref = computed(() => SPECIES_URLS[currentSpecies.value] ?? '/apps/maps')

function onWheel(e) {
  if (!widgetRef.value?.contains(e.target)) return
  e.preventDefault()
  e.stopPropagation()
  window.scrollBy(0, e.deltaY)
}

onMounted(() => {
  document.addEventListener('wheel', onWheel, { passive: false, capture: true })
})

onUnmounted(() => {
  document.removeEventListener('wheel', onWheel, { capture: true })
})

function openFullMap() {
  window.location.href = mapHref.value
}
</script>

<style lang="scss" scoped>
.homepage-map-widget {
  position: relative;
  z-index: 0; /* scoped stacking context so internal z-indexes don't bleed out */
  width: 100%;
  aspect-ratio: 16 / 7;
  overflow: hidden;
  @media (max-width: 768px) { aspect-ratio: 4 / 3; }
}


.map-open-hint {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 11;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  background: #8300bf;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.12s;

  &:hover {
    background: #6a009a;
  }
}

/* Raise library zoom controls above the overlay so they remain clickable */
:deep(.bottom-right-control) {
  z-index: 11;
}

/* Hide Beta/Legacy warning badges — not useful context on a homepage widget */
:deep(.beta-popovers) {
  display: none;
}
</style>
