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
      @ready="onMapReady"
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

let mapImp = null
let canvasContainer = null

// Connectivity paths are rendered on maplibre layers whose ids contain "path" or
// "nerve" (path-line, annotated-path, nerve-path, …). Anatomy/organs live on other
// layers, so this is how we tell a connection click from any other click.
const CONNECTION_LAYER_RE = /path|nerve/i

// Put the map into a permanently "pre-selected" state: connection paths are dimmed
// to low opacity so that hovering a pathway (painted at full opacity) stands out.
function applyDimmed() {
  mapImp?.setPaint({ coloured: true, outlined: true, dimmed: true })
}

function onMapReady(component) {
  mapImp = component?.mapImp
  if (!mapImp) return
  applyDimmed()

  // Gate clicks on the map surface itself. Attaching to maplibre's own canvas container
  // (rather than the widget root) guarantees we hit the right element with the right
  // timing, and controls/popovers live outside it so they keep working. Capture phase +
  // stopPropagation is meant to keep the click from reaching the flatmap's own handlers.
  const container = mapImp.map.getCanvasContainer()
  if (canvasContainer) canvasContainer.removeEventListener('click', onMapClick, true)
  canvasContainer = container
  canvasContainer.addEventListener('click', onMapClick, true)

  // Safety net for any click that still reaches the flatmap: the library un-dims when a
  // selection clears, so re-dim on its own click event. Registered after the library's
  // handler, this runs right after the un-dim within the same click — no visible flash.
  mapImp.map.on('click', applyDimmed)
}

// Return the connection feature whose line is directly under the click point, or null.
// We query the exact point (not a padded box) so that hit-testing uses each line's own
// rendered width — the same way the flatmap decides what you clicked. Hovering an organ
// highlights its connections, but those lines aren't under the cursor, so clicking the
// organ finds no path here and does nothing; only clicking the connection line itself
// counts.
function connectionAt(point) {
  if (!mapImp?.map) return null
  let features = []
  try {
    features = mapImp.map.queryRenderedFeatures(point)
  } catch {
    return null
  }
  return features.find(
    (f) => CONNECTION_LAYER_RE.test(f.layer?.id || '') && (f.properties?.models || f.properties?.label)
  ) || null
}

// Only a click on a hovered/highlighted connection does anything (it deep-links to the
// full map); every other click is swallowed. Hover highlighting is untouched — it runs
// off mousemove, not click.
function onMapClick(e) {
  if (!mapImp?.map) return
  const rect = mapImp.map.getCanvas().getBoundingClientRect()
  const point = [e.clientX - rect.left, e.clientY - rect.top]
  const connection = connectionAt(point)

  e.stopPropagation()
  e.preventDefault()

  if (connection) {
    openConnectionInFullMap(connection.properties.models || connection.properties.label)
  }
}

function openConnectionInFullMap(term) {
  // The maps page feeds `searchTerm` into the flatmap's searchAndShowResult(), which selects
  // the matching feature and — for a connectivity path — opens the connectivity explorer
  // (openConnectivityInfo emits connectivity-info-open). We also pass the species name so the
  // maps page opens it via the resource entry, which preserves the biological sex (otherwise
  // human female maps fall back to male). Passing the connection's models id reproduces the
  // same result as clicking it in the full map.
  const base = SPECIES_URLS[currentSpecies.value] ?? '/apps/maps'
  const sep = base.includes('?') ? '&' : '?'
  const params = `species=${encodeURIComponent(currentSpecies.value)}&searchTerm=${encodeURIComponent(term)}`
  window.location.href = `${base}${sep}${params}`
}

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
  if (canvasContainer) canvasContainer.removeEventListener('click', onMapClick, true)
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
