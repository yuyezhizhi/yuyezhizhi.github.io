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
    component: () => import('../views/FishPage.vue')
  },
  {
    path: '/leaves',
    name: 'Leaves',
    component: () => import('../views/LeavesPage.vue')
  },
  {
    path: '/fishgroup',
    name: 'FishGroup',
    component: () => import('../views/fishGroup.vue')
  },
  {
    path: '/datavortex',
    name: 'DataVortex',
    component: () => import('../views/DataVortex.vue')
  },
  {
    path: '/butterfly',
    name: 'ButterflyNet',
    component: () => import('../views/ButterflyNet.vue')
  },
  {
    path: '/raintext',
    name: 'RainText',
    component: () => import('../views/RainText.vue')
  },
  {
    path: '/spinningtops',
    name: 'SpinningTops',
    component: () => import('../views/SpinningTops.vue')
  },
  {
    path: '/interactivetnet',
    name: 'InteractiveNet',
    component: () => import('../views/InteractiveNet.vue')
  },
  {
    path: '/dancer',
    name: 'Dancer',
    component: () => import('../views/DancerPage.vue')
  },
  {
    path: '/gravity-particles',
    name: 'GravityParticles',
    component: () => import('../views/ParticleVortexPage.vue')
  },
  {
    path: '/audio-visualizer',
    name: 'AudioVisualizer',
    component: () => import('../views/AudioVisualizerPage.vue')
  },
  {
    path: '/meteor-shower',
    name: 'MeteorShower',
    component: () => import('../views/DigitalRainPage.vue')
  },
  {
    path: '/fluid-simulation',
    name: 'FluidSimulation',
    component: () => import('../views/FluidSimulationPage.vue')
  },
  {
    path: '/cellular-automata',
    name: 'CellularAutomata',
    component: () => import('../views/CellularAutomataPage.vue')
  },
  {
    path: '/bubble-pop',
    name: 'BubblePop',
    component: () => import('../views/BubblePop.vue')
  },
  {
    path: '/flower-garden',
    name: 'FlowerGarden',
    component: () => import('../views/FlowerGarden.vue')
  },
  {
    path: '/rainbow-wave',
    name: 'RainbowWave',
    component: () => import('../views/RainbowWave.vue')
  },
  {
    path: '/starlight-dance',
    name: 'StarlightDance',
    component: () => import('../views/StarlightDance.vue')
  },
  {
    path: '/candy-rain',
    name: 'CandyRain',
    component: () => import('../views/CandyRain.vue')
  },
  {
    path: '/lotus-pond',
    name: 'LotusPond',
    component: () => import('../views/LotusPond.vue')
  },
  {
    path: '/gravity-field',
    name: 'GravityField',
    component: () => import('../views/GravityField.vue')
  },
  {
    path: '/black-hole',
    name: 'BlackHole',
    component: () => import('../views/BlackHole.vue')
  },
  {
    path: '/wave-interference',
    name: 'WaveInterference',
    component: () => import('../views/WaveInterference.vue')
  },
  {
    path: '/magnetic-field',
    name: 'MagneticField',
    component: () => import('../views/MagneticField.vue')
  },
  {
    path: '/fireworks',
    name: 'Fireworks',
    component: () => import('../views/Fireworks.vue')
  },
  {
    path: '/quicksand',
    name: 'Quicksand',
    component: () => import('../views/Quicksand.vue')
  },
  {
    path: '/fractal-tree',
    name: 'FractalTree',
    component: () => import('../views/FractalTree.vue')
  },
  {
    path: '/cell-division',
    name: 'CellDivision',
    component: () => import('../views/CellDivision.vue')
  },
  {
    path: '/noise-terrain',
    name: 'NoiseTerrain',
    component: () => import('../views/NoiseTerrain.vue')
  },
  {
    path: '/mandala',
    name: 'Mandala',
    component: () => import('../views/Mandala.vue')
  },
  {
    path: '/frequency-tower',
    name: 'FrequencyTower',
    component: () => import('../views/FrequencyTower.vue')
  },
  {
    path: '/audio-wheel',
    name: 'AudioWheel',
    component: () => import('../views/AudioWheel.vue')
  },
  {
    path: '/music-network',
    name: 'MusicNetwork',
    component: () => import('../views/MusicNetwork.vue')
  },
  {
    path: '/morphing-sphere',
    name: 'MorphingSphere',
    component: () => import('../views/MorphingSphere.vue')
  },
  {
    path: '/stereo-channel',
    name: 'StereoChannel',
    component: () => import('../views/StereoChannel.vue')
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
