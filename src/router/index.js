import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/fish',
    name: 'Fish',
    component: () => import('../views/FishPage.vue'),
    meta: { fullscreen: true }
  },
  {
    path: '/leaves',
    name: 'Leaves',
    component: () => import('../views/LeavesPage.vue'),
    meta: { fullscreen: true }
  },
  {
    path: '/fishgroup',
    name: 'FishGroup',
    component: () => import('../views/fishGroup.vue'),
    meta: { fullscreen: true }
  },
  {
    path: '/butterfly',
    name: 'ButterflyNet',
    component: () => import('../views/ButterflyNet.vue'),
    meta: { fullscreen: true }
  },
  {
    path: '/datavortex',
    name: 'DataVortex',
    component: () => import('../views/DataVortex.vue'),
    meta: { fullscreen: true }
  },
  {
    path: '/raintext',
    name: 'RainText',
    component: () => import('../views/RainText.vue'),
    meta: { fullscreen: true }
  },
  {
    path: '/spinningtops',
    name: 'SpinningTops',
    component: () => import('../views/SpinningTops.vue'),
    meta: { fullscreen: true }
  },
  {
    path: '/interactivetnet',
    name: 'InteractiveNet',
    component: () => import('../views/InteractiveNet.vue'),
    meta: { fullscreen: true }
  },
  {
    path: '/dancer',
    name: 'Dancer',
    component: () => import('../views/DancerPage.vue'),
    meta: { fullscreen: true }
  },
  {
    path: '/gravity-particles',
    name: 'GravityParticles',
    component: () => import('../views/ParticleVortexPage.vue'),
    meta: { fullscreen: true }
  },
  {
    path: '/meteor-shower',
    name: 'MeteorShower',
    component: () => import('../views/DigitalRainPage.vue'),
    meta: { fullscreen: true }
  },
  {
    path: '/fluid-simulation',
    name: 'FluidSimulation',
    component: () => import('../views/FluidSimulationPage.vue'),
    meta: { fullscreen: true }
  },
  {
    path: '/cellular-automata',
    name: 'CellularAutomata',
    component: () => import('../views/CellularAutomataPage.vue'),
    meta: { fullscreen: true }
  },
  {
    path: '/bubble-pop',
    name: 'BubblePop',
    component: () => import('../views/BubblePop.vue'),
    meta: { fullscreen: true }
  },
  {
    path: '/flower-garden',
    name: 'FlowerGarden',
    component: () => import('../views/FlowerGarden.vue'),
    meta: { fullscreen: true }
  },
  {
    path: '/rainbow-wave',
    name: 'RainbowWave',
    component: () => import('../views/RainbowWave.vue'),
    meta: { fullscreen: true }
  },
  {
    path: '/starlight-dance',
    name: 'StarlightDance',
    component: () => import('../views/StarlightDance.vue'),
    meta: { fullscreen: true }
  },
  {
    path: '/candy-rain',
    name: 'CandyRain',
    component: () => import('../views/CandyRain.vue'),
    meta: { fullscreen: true }
  },
  {
    path: '/lotus-pond',
    name: 'LotusPond',
    component: () => import('../views/LotusPond.vue'),
    meta: { fullscreen: true }
  },


  {
    path: '/wave-interference',
    name: 'WaveInterference',
    component: () => import('../views/WaveInterference.vue'),
    meta: { fullscreen: true }
  },
  {
    path: '/magnetic-field',
    name: 'MagneticField',
    component: () => import('../views/MagneticField.vue'),
    meta: { fullscreen: true }
  },
  {
    path: '/fireworks',
    name: 'Fireworks',
    component: () => import('../views/Fireworks.vue'),
    meta: { fullscreen: true }
  },
  {
    path: '/quicksand',
    name: 'Quicksand',
    component: () => import('../views/Quicksand.vue'),
    meta: { fullscreen: true }
  },
  {
    path: '/fractal-tree',
    name: 'FractalTree',
    component: () => import('../views/FractalTree.vue'),
    meta: { fullscreen: true }
  },
  {
    path: '/cell-division',
    name: 'CellDivision',
    component: () => import('../views/CellDivision.vue'),
    meta: { fullscreen: true }
  },
  {
    path: '/noise-terrain',
    name: 'NoiseTerrain',
    component: () => import('../views/NoiseTerrain.vue'),
    meta: { fullscreen: true }
  },
  {
    path: '/mandala',
    name: 'Mandala',
    component: () => import('../views/Mandala.vue'),
    meta: { fullscreen: true }
  },
  {
    path: '/frequency-tower',
    name: 'FrequencyTower',
    component: () => import('../views/FrequencyTower.vue'),
    meta: { fullscreen: true }
  },
  {
    path: '/audio-wheel',
    name: 'AudioWheel',
    component: () => import('../views/AudioWheel.vue'),
    meta: { fullscreen: true }
  },
  {
    path: '/morphing-sphere',
    name: 'MorphingSphere',
    component: () => import('../views/MorphingSphere.vue'),
    meta: { fullscreen: true }
  },
  {
    path: '/stereo-channel',
    name: 'StereoChannel',
    component: () => import('../views/StereoChannel.vue'),
    meta: { fullscreen: true }
  },
  {
    path: '/music-network',
    name: 'MusicNetwork',
    component: () => import('../views/MusicNetwork.vue'),
    meta: { fullscreen: true }
  },
  {
    path: '/journeys',
    name: 'Journeys',
    component: () => import('../views/JourneysPage.vue')
  },

]

const router = createRouter({
  history: createWebHistory('/'),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
