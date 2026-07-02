<template>
  <div class="app-layout">
    <AppHeader />

    <main class="app-main">
      <RouterView v-slot="{ Component }">
        <Transition name="route" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <MobileNav />
  </div>
</template>

<script setup lang="ts">
import AppHeader from './AppHeader.vue'
import MobileNav from './MobileNav.vue'
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  background: var(--bg-page);
}

.app-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

@media (max-width: 768px) {
  .app-main {
    padding: 16px;
    padding-bottom: calc(64px + env(safe-area-inset-bottom, 0px));
  }
}

.route-enter-active,
.route-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.route-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.route-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
